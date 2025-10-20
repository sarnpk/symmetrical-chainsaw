import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for direct database updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// FIXED transcription extraction - handles Gladia v2 API structure properly
function extractTranscriptionText(result: any): string | null {
  console.log('🔍 FIXED STATUS API: Extracting transcription from Gladia v2 API')
  
  // Priority 1: Gladia v2 API format - result.result.transcription.full_transcript
  if (result?.result?.transcription?.full_transcript && typeof result.result.transcription.full_transcript === 'string') {
    const text = result.result.transcription.full_transcript.trim()
    if (text) {
      console.log('✅ FIXED STATUS API: Found v2 full_transcript:', text)
      return text
    }
  }
  
  // Priority 2: Gladia v2 API format - result.result.transcription.utterances
  if (result?.result?.transcription?.utterances && Array.isArray(result.result.transcription.utterances) && result.result.transcription.utterances.length > 0) {
    const text = result.result.transcription.utterances
      .map((u: any) => (u.text || '').trim())
      .filter((text: string) => text.length > 0)
      .join(' ')
      .trim()
    
    if (text) {
      console.log('✅ FIXED STATUS API: Found v2 utterances transcription:', text)
      return text
    }
  }
  
  // Priority 3: Legacy format - result.transcription.full_transcript
  if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
    const text = result.transcription.full_transcript.trim()
    if (text) {
      console.log('✅ FIXED STATUS API: Found legacy full_transcript:', text)
      return text
    }
  }
  
  // Priority 4: Legacy format - result.transcription.utterances
  if (result?.transcription?.utterances && Array.isArray(result.transcription.utterances) && result.transcription.utterances.length > 0) {
    const text = result.transcription.utterances
      .map((u: any) => (u.text || '').trim())
      .filter((text: string) => text.length > 0)
      .join(' ')
      .trim()
    
    if (text) {
      console.log('✅ FIXED STATUS API: Found legacy utterances transcription:', text)
      return text
    }
  }
  
  console.log('❌ FIXED STATUS API: No transcription text found')
  return null
}

export async function POST(request: Request) {
  try {
    console.log('🔍 FIXED STATUS API: Called with corrected Gladia v2 structure')
    
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

    const { evidence_file_id, job_id } = await request.json().catch(() => ({})) as {
      evidence_file_id: string
      job_id?: string
    }

    if (!evidence_file_id) {
      return NextResponse.json({ error: 'evidence_file_id required' }, { status: 400 })
    }

    console.log(`🔍 FIXED STATUS API: Checking evidence_file_id: ${evidence_file_id}, job_id: ${job_id}`)

    // Get evidence file
    const { data: evidenceFile, error: fileError } = await supabaseAdmin
      .from('evidence_files')
      .select('*')
      .eq('id', evidence_file_id)
      .eq('user_id', user.id)
      .single()

    if (fileError || !evidenceFile) {
      console.error('FIXED STATUS API: Evidence file not found:', fileError)
      return NextResponse.json({ error: 'Evidence file not found' }, { status: 404 })
    }

    // Get job ID from evidence file if not provided
    const jobIdToCheck = job_id || evidenceFile?.metadata?.transcription_job_id

    if (!jobIdToCheck) {
      console.error('FIXED STATUS API: No transcription job ID found')
      return NextResponse.json({ error: 'No transcription job found' }, { status: 404 })
    }

    // Check with Gladia API directly (bypass the broken Edge function)
    const gladiaApiKey = process.env.GLADIA_API_KEY
    if (!gladiaApiKey) {
      return NextResponse.json({ error: 'GLADIA_API_KEY not configured' }, { status: 500 })
    }

    console.log(`🔍 FIXED STATUS API: Checking Gladia directly for job ${jobIdToCheck}`)

    const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobIdToCheck}`, {
      headers: { 'x-gladia-key': gladiaApiKey },
    })

    if (!statusResponse.ok) {
      console.error('FIXED STATUS API: Gladia status check failed:', statusResponse.status)
      return NextResponse.json({ 
        error: `Gladia status check failed: ${statusResponse.status}`,
        code: 'GLADIA_ERROR'
      }, { status: 500 })
    }

    const result = await statusResponse.json()
    console.log(`📊 FIXED STATUS API: Gladia response status: ${result.status}`)

    // Extract transcription using the corrected logic
    const transcription = extractTranscriptionText(result)
    const isCompleted = result.status === 'done' || transcription

    if (isCompleted && transcription) {
      console.log(`🎉 FIXED STATUS API: Transcription completed: "${transcription}"`)

      // Update evidence file with completed transcription
      try {
        const updateData = {
          transcription: transcription,
          transcription_status: 'completed',
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
          metadata: {
            ...evidenceFile.metadata,
            transcription_job_id: jobIdToCheck,
            transcription_completed_at: new Date().toISOString(),
            transcription_language: result.result?.transcription?.languages?.[0] || 
                                  result.transcription?.languages?.[0] || 
                                  result.transcription?.utterances?.[0]?.language || 
                                  result.prediction?.[0]?.language || 'unknown',
            transcription_confidence: result.result?.transcription?.utterances?.[0]?.confidence || 
                                     result.transcription?.utterances?.[0]?.confidence || 
                                     result.prediction?.[0]?.confidence || 0,
            transcription_duration: result.result?.metadata?.audio_duration || 
                                  result.metadata?.audio_duration || 
                                  (result.prediction?.[0] ? result.prediction[0].time_end - result.prediction[0].time_begin : undefined),
            fixed_by_status_api: true,
            status_api_fixed_at: new Date().toISOString()
          }
        }

        const { error: updateError } = await supabaseAdmin
          .from('evidence_files')
          .update(updateData)
          .eq('id', evidence_file_id)
          .eq('user_id', user.id)

        if (updateError) {
          console.error('FIXED STATUS API: Failed to update evidence file:', updateError)
          return NextResponse.json({ 
            error: 'Failed to update database',
            details: updateError.message 
          }, { status: 500 })
        }

        console.log(`✅ FIXED STATUS API: Successfully updated evidence file ${evidence_file_id}`)

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

          console.log(`📊 FIXED STATUS API: Recorded usage for user ${user.id}`)
        } catch (usageError) {
          console.warn('FIXED STATUS API: Failed to record usage:', usageError)
        }

        return NextResponse.json({
          success: true,
          status: 'completed',
          transcription,
          job_id: jobIdToCheck,
          evidence_file_id,
          language: updateData.metadata.transcription_language,
          message: 'Transcription completed and database updated by FIXED status API'
        })

      } catch (dbError: any) {
        console.error('FIXED STATUS API: Database update error:', dbError)
        return NextResponse.json({ 
          error: 'Database update failed',
          details: dbError.message 
        }, { status: 500 })
      }
    }

    // Check for errors
    if (result.status === 'error') {
      console.error('FIXED STATUS API: Gladia transcription error:', result.error)

      // Update evidence file with error
      try {
        await supabaseAdmin
          .from('evidence_files')
          .update({
            transcription_status: 'failed',
            processing_status: 'failed',
            processed_at: new Date().toISOString(),
            metadata: {
              ...evidenceFile.metadata,
              transcription_job_id: jobIdToCheck,
              transcription_error: result.error,
              transcription_failed_at: new Date().toISOString()
            }
          })
          .eq('id', evidence_file_id)
          .eq('user_id', user.id)

        console.log(`❌ FIXED STATUS API: Updated evidence file ${evidence_file_id} with error`)
      } catch (dbError) {
        console.error('FIXED STATUS API: Failed to update evidence file with error:', dbError)
      }

      return NextResponse.json({
        success: false,
        status: 'failed',
        error: result.error || 'Transcription failed',
        job_id: jobIdToCheck,
        evidence_file_id
      })
    }

    // Still processing
    console.log(`⏳ FIXED STATUS API: Job ${jobIdToCheck} still processing (status: ${result.status})`)
    return NextResponse.json({
      success: true,
      status: 'processing',
      job_id: jobIdToCheck,
      evidence_file_id,
      gladia_status: result.status,
      message: 'Transcription is still processing'
    })

  } catch (e: any) {
    console.error('❌ FIXED STATUS API error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}