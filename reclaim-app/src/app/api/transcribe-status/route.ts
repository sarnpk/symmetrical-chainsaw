import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for privileged operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    console.log('🔍 Transcription status check API called')
    
    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const body = await request.json()
    const { evidence_file_id, job_id } = body
    
    if (!evidence_file_id && !job_id) {
      return NextResponse.json({ error: 'Missing evidence_file_id or job_id' }, { status: 400 })
    }
    
    console.log(`📋 Checking status for evidence_file_id: ${evidence_file_id}, job_id: ${job_id}`)
    
    // Get evidence file if ID provided
    let evidenceFile = null
    if (evidence_file_id) {
      const { data, error } = await supabaseAdmin
        .from('evidence_files')
        .select('*')
        .eq('id', evidence_file_id)
        .eq('user_id', user.id)
        .single()
      
      if (error) {
        console.error('Failed to get evidence file:', error)
        return NextResponse.json({ error: 'Evidence file not found' }, { status: 404 })
      }
      
      evidenceFile = data
    }
    
    // Get job ID from evidence file if not provided
    const jobIdToCheck = job_id || evidenceFile?.metadata?.transcription_job_id
    
    if (!jobIdToCheck) {
      return NextResponse.json({ error: 'No transcription job found' }, { status: 404 })
    }
    
    // Check with Gladia API
    const gladiaApiKey = process.env.GLADIA_API_KEY
    if (!gladiaApiKey) {
      return NextResponse.json({ error: 'GLADIA_API_KEY not configured' }, { status: 500 })
    }
    
    console.log(`🔍 Checking Gladia status for job ${jobIdToCheck}`)
    
    const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobIdToCheck}`, {
      headers: { 'x-gladia-key': gladiaApiKey },
    })
    
    if (!statusResponse.ok) {
      console.error('Gladia status check failed:', statusResponse.status)
      return NextResponse.json({ 
        error: `Status check failed: ${statusResponse.status}`,
        code: 'GLADIA_ERROR'
      }, { status: 500 })
    }
    
    const result = await statusResponse.json()
    console.log(`📊 Gladia response:`, JSON.stringify(result, null, 2))
    
    // Extract transcription using the same logic as the Edge function
    let transcription = null
    
    // Priority 1: v2 format full_transcript (most reliable)
    if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
      const text = result.transcription.full_transcript.trim()
      if (text) {
        transcription = text
        console.log('✅ FOUND FULL_TRANSCRIPT:', transcription)
      }
    }
    
    // Priority 2: v2 format utterances
    if (!transcription && result?.transcription?.utterances && Array.isArray(result.transcription.utterances) && result.transcription.utterances.length > 0) {
      const text = result.transcription.utterances
        .map((u: any) => (u.text || '').trim())
        .filter((text: string) => text.length > 0)
        .join(' ')
        .trim()
      
      if (text) {
        transcription = text
        console.log('✅ FOUND UTTERANCES TRANSCRIPTION:', transcription)
      }
    }
    
    // Priority 3: v1 format prediction (legacy)
    if (!transcription && result?.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
      const prediction = result.prediction[0]
      if (prediction?.transcription && typeof prediction.transcription === 'string') {
        const text = prediction.transcription.trim()
        if (text) {
          transcription = text
          console.log('✅ FOUND PREDICTION TRANSCRIPTION:', transcription)
        }
      }
    }
    
    if (transcription) {
      console.log(`🎉 Transcription completed: "${transcription}"`)
      
      // Update evidence file with completed transcription
      if (evidence_file_id) {
        try {
          await supabaseAdmin
            .from('evidence_files')
            .update({
              transcription: transcription,
              transcription_status: 'completed',
              processing_status: 'completed',
              processed_at: new Date().toISOString(),
              metadata: {
                ...evidenceFile?.metadata,
                transcription_job_id: jobIdToCheck,
                transcription_completed_at: new Date().toISOString(),
                transcription_language: result.transcription?.languages?.[0] || 
                                      result.transcription?.utterances?.[0]?.language || 
                                      result.prediction?.[0]?.language || 'unknown'
              }
            })
            .eq('id', evidence_file_id)
            .eq('user_id', user.id)
          
          console.log(`✅ Updated evidence file ${evidence_file_id} with completed transcription`)
        } catch (dbError) {
          console.error('Failed to update evidence file:', dbError)
        }
      }
      
      return NextResponse.json({
        success: true,
        status: 'completed',
        transcription,
        job_id: jobIdToCheck,
        language: result.transcription?.languages?.[0] || 
                 result.transcription?.utterances?.[0]?.language || 
                 result.prediction?.[0]?.language || 'unknown'
      })
    }
    
    // Check for errors
    if (result.status === 'error') {
      console.error('Gladia transcription error:', result.error)
      
      // Update evidence file with error
      if (evidence_file_id) {
        try {
          await supabaseAdmin
            .from('evidence_files')
            .update({
              transcription_status: 'failed',
              processing_status: 'failed',
              processed_at: new Date().toISOString(),
              metadata: {
                ...evidenceFile?.metadata,
                transcription_job_id: jobIdToCheck,
                transcription_error: result.error,
                transcription_failed_at: new Date().toISOString()
              }
            })
            .eq('id', evidence_file_id)
            .eq('user_id', user.id)
          
          console.log(`❌ Updated evidence file ${evidence_file_id} with error`)
        } catch (dbError) {
          console.error('Failed to update evidence file with error:', dbError)
        }
      }
      
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: result.error || 'Transcription failed',
        job_id: jobIdToCheck
      })
    }
    
    // Still processing
    console.log(`⏳ Job ${jobIdToCheck} still processing (status: ${result.status})`)
    return NextResponse.json({
      success: true,
      status: 'processing',
      job_id: jobIdToCheck,
      gladia_status: result.status
    })
    
  } catch (error: any) {
    console.error('❌ Status check error:', error)
    
    return NextResponse.json({
      error: error.message || 'Status check failed',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}