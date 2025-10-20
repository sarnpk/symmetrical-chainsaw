import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for direct database updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ROBUST transcription extraction - same as other components
function extractTranscriptionText(result: any): string | null {
  console.log('🔍 EXTRACTING TRANSCRIPTION FROM:', JSON.stringify(result, null, 2))
  
  // Priority 1: v2 format full_transcript (most reliable)
  if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
    const text = result.transcription.full_transcript.trim()
    if (text) {
      console.log('✅ FOUND FULL_TRANSCRIPT:', text)
      return text
    }
  }
  
  // Priority 2: v2 format utterances
  if (result?.transcription?.utterances && Array.isArray(result.transcription.utterances) && result.transcription.utterances.length > 0) {
    const text = result.transcription.utterances
      .map((u: any) => (u.text || '').trim())
      .filter((text: string) => text.length > 0)
      .join(' ')
      .trim()
    
    if (text) {
      console.log('✅ FOUND UTTERANCES TRANSCRIPTION:', text)
      return text
    }
  }
  
  // Priority 3: v1 format prediction (legacy)
  if (result?.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
    const prediction = result.prediction[0]
    if (prediction?.transcription && typeof prediction.transcription === 'string') {
      const text = prediction.transcription.trim()
      if (text) {
        console.log('✅ FOUND PREDICTION TRANSCRIPTION:', text)
        return text
      }
    }
  }
  
  console.log('❌ NO TRANSCRIPTION TEXT FOUND')
  return null
}

export async function POST(request: Request) {
  try {
    console.log('🔧 Fix stuck transcription API called')
    
    const authHeader = request.headers.get('authorization') || ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
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
    
    console.log(`🔧 Fixing stuck transcription for evidence_file_id: ${evidence_file_id}, job_id: ${job_id}`)
    
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
    
    // Check with Gladia API directly
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
        error: `Gladia status check failed: ${statusResponse.status}`,
        code: 'GLADIA_ERROR'
      }, { status: 500 })
    }
    
    const result = await statusResponse.json()
    console.log(`📊 Gladia response:`, JSON.stringify(result, null, 2))
    
    // Extract transcription using the same logic as other components
    const transcription = extractTranscriptionText(result)
    
    if (transcription) {
      console.log(`🎉 Transcription completed: "${transcription}"`)
      
      // Update evidence file with completed transcription
      if (evidence_file_id) {
        try {
          const updateData = {
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
                                    result.prediction?.[0]?.language || 'unknown',
              transcription_confidence: result.transcription?.utterances?.[0]?.confidence || 
                                       result.prediction?.[0]?.confidence || 0,
              transcription_duration: result.metadata?.audio_duration || 
                                    (result.prediction?.[0] ? result.prediction[0].time_end - result.prediction[0].time_begin : undefined)
            }
          }
          
          const { error: updateError } = await supabaseAdmin
            .from('evidence_files')
            .update(updateData)
            .eq('id', evidence_file_id)
            .eq('user_id', user.id)
          
          if (updateError) {
            console.error('Failed to update evidence file:', updateError)
            return NextResponse.json({ 
              error: 'Failed to update database',
              details: updateError.message 
            }, { status: 500 })
          }
          
          console.log(`✅ Successfully updated evidence file ${evidence_file_id}`)
          
          // Record usage
          try {
            const currentPeriodStart = new Date()
            currentPeriodStart.setDate(1)
            const currentPeriodEnd = new Date(currentPeriodStart)
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
            currentPeriodEnd.setDate(0)

            await supabaseAdmin
              .from('usage_tracking')
              .insert({
                user_id: user.id,
                feature_name: 'ai_interactions',
                usage_type: 'monthly_count',
                usage_count: 1,
                usage_metadata: {
                  feature: 'audio_transcription',
                  duration: updateData.metadata.transcription_duration,
                  language: updateData.metadata.transcription_language,
                  confidence: updateData.metadata.transcription_confidence
                },
                billing_period_start: currentPeriodStart.toISOString().split('T')[0],
                billing_period_end: currentPeriodEnd.toISOString().split('T')[0]
              })
            
            console.log(`📊 Recorded usage for user ${user.id}`)
          } catch (usageError) {
            console.warn('Failed to record usage:', usageError)
          }
        } catch (dbError) {
          console.error('Database update error:', dbError)
          return NextResponse.json({ 
            error: 'Database update failed',
            details: dbError.message 
          }, { status: 500 })
        }
      }
      
      return NextResponse.json({
        success: true,
        status: 'completed',
        transcription,
        job_id: jobIdToCheck,
        language: result.transcription?.languages?.[0] || 
                 result.transcription?.utterances?.[0]?.language || 
                 result.prediction?.[0]?.language || 'unknown',
        fixed: true
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
        job_id: jobIdToCheck,
        fixed: true
      })
    }
    
    // Still processing
    console.log(`⏳ Job ${jobIdToCheck} still processing (status: ${result.status})`)
    return NextResponse.json({
      success: true,
      status: 'processing',
      job_id: jobIdToCheck,
      gladia_status: result.status,
      message: 'Transcription is still processing'
    })
    
  } catch (error: any) {
    console.error('❌ Fix stuck transcription error:', error)
    
    return NextResponse.json({
      error: error.message || 'Fix failed',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}