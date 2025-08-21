import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for direct database updates (NO AUTH REQUIRED FOR TESTING)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// FINAL transcription extraction - handles Gladia v2 API structure properly
function extractTranscriptionText(result: any): string | null {
  console.log('🔍 EXTRACTING TRANSCRIPTION FROM GLADIA V2 API')
  
  // Priority 1: Gladia v2 API format - result.result.transcription.full_transcript
  if (result?.result?.transcription?.full_transcript && typeof result.result.transcription.full_transcript === 'string') {
    const text = result.result.transcription.full_transcript.trim()
    if (text) {
      console.log('✅ FOUND V2 FULL_TRANSCRIPT:', text)
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
      console.log('✅ FOUND V2 UTTERANCES TRANSCRIPTION:', text)
      return text
    }
  }
  
  // Priority 3: Legacy format - result.transcription.full_transcript
  if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
    const text = result.transcription.full_transcript.trim()
    if (text) {
      console.log('✅ FOUND LEGACY FULL_TRANSCRIPT:', text)
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
      console.log('✅ FOUND LEGACY UTTERANCES TRANSCRIPTION:', text)
      return text
    }
  }
  
  // Priority 5: v1 format prediction (legacy)
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
  console.log('🔍 Available paths checked:')
  console.log('  - result.result.transcription.full_transcript:', !!result?.result?.transcription?.full_transcript)
  console.log('  - result.result.transcription.utterances:', !!result?.result?.transcription?.utterances)
  console.log('  - result.transcription.full_transcript:', !!result?.transcription?.full_transcript)
  console.log('  - result.transcription.utterances:', !!result?.transcription?.utterances)
  console.log('  - result.prediction:', !!result?.prediction)
  
  return null
}

export async function POST(request: Request) {
  // IMPORTANT: This endpoint bypasses ALL authentication for testing
  console.log('🔧 FINAL FIX ENDPOINT CALLED - NO AUTH REQUIRED')
  
  try {
    const body = await request.json()
    const { job_id, evidence_file_id } = body
    
    console.log('��� Final fix request:', { job_id, evidence_file_id })
    
    if (!job_id && !evidence_file_id) {
      return NextResponse.json({ 
        error: 'Missing job_id or evidence_file_id',
        test_mode: true 
      }, { status: 400 })
    }
    
    // Get evidence file if ID provided
    let evidenceFile = null
    let jobIdToCheck = job_id
    
    if (evidence_file_id) {
      const { data, error } = await supabaseAdmin
        .from('evidence_files')
        .select('*')
        .eq('id', evidence_file_id)
        .single()
      
      if (error) {
        console.error('Failed to get evidence file:', error)
        return NextResponse.json({ 
          error: 'Evidence file not found',
          details: error.message,
          test_mode: true 
        }, { status: 404 })
      }
      
      evidenceFile = data
      jobIdToCheck = jobIdToCheck || evidenceFile?.metadata?.transcription_job_id
    }
    
    if (!jobIdToCheck) {
      return NextResponse.json({ 
        error: 'No transcription job ID found',
        test_mode: true 
      }, { status: 404 })
    }
    
    // Check Gladia API key
    const gladiaApiKey = process.env.GLADIA_API_KEY
    if (!gladiaApiKey) {
      return NextResponse.json({ 
        error: 'GLADIA_API_KEY not configured',
        test_mode: true 
      }, { status: 500 })
    }
    
    console.log(`🔍 Checking Gladia status for job ${jobIdToCheck}`)
    
    try {
      const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobIdToCheck}`, {
        headers: { 'x-gladia-key': gladiaApiKey },
      })

      console.log('📡 Gladia status response:', statusResponse.status)

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('❌ Gladia status error:', statusResponse.status, errorText)
        return NextResponse.json({ 
          error: `Gladia status check failed: ${statusResponse.status}`,
          details: errorText,
          test_mode: true
        }, { status: 500 })
      }

      const result = await statusResponse.json()
      console.log(`📊 Gladia status result structure:`, {
        has_result: !!result.result,
        has_result_transcription: !!result.result?.transcription,
        has_result_transcription_full_transcript: !!result.result?.transcription?.full_transcript,
        full_transcript_value: result.result?.transcription?.full_transcript,
        status: result.status
      })
      
      // Extract transcription using the corrected logic
      const transcription = extractTranscriptionText(result)
      const isCompleted = result.status === 'done' || transcription
      
      console.log(`🔍 Final analysis:`, {
        gladia_status: result.status,
        transcription_found: !!transcription,
        is_completed: isCompleted,
        transcription_text: transcription
      })
      
      if (isCompleted && transcription) {
        console.log(`🎉 Transcription successfully extracted: "${transcription}"`)
        
        // Update evidence file if we have one
        if (evidenceFile) {
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
                fixed_by_final_endpoint: true,
                fixed_at: new Date().toISOString()
              }
            }
            
            const { error: updateError } = await supabaseAdmin
              .from('evidence_files')
              .update(updateData)
              .eq('id', evidenceFile.id)
            
            if (updateError) {
              console.error('Failed to update evidence file:', updateError)
              return NextResponse.json({ 
                error: 'Failed to update database',
                details: updateError.message,
                transcription: transcription,
                test_mode: true
              }, { status: 500 })
            }
            
            console.log(`✅ Successfully updated evidence file ${evidenceFile.id}`)
            
            return NextResponse.json({
              success: true,
              status: 'completed',
              transcription,
              job_id: jobIdToCheck,
              evidence_file_id: evidenceFile.id,
              language: updateData.metadata.transcription_language,
              confidence: updateData.metadata.transcription_confidence,
              duration: updateData.metadata.transcription_duration,
              fixed: true,
              test_mode: true,
              message: '🎉 SUCCESS! Database updated. Your journal should now show the transcription!'
            })
          } catch (dbError: any) {
            console.error('Database update error:', dbError)
            return NextResponse.json({ 
              error: 'Database update failed',
              details: dbError.message,
              transcription: transcription,
              test_mode: true
            }, { status: 500 })
          }
        } else {
          // No evidence file to update, just return the transcription
          return NextResponse.json({
            success: true,
            status: 'completed',
            transcription,
            job_id: jobIdToCheck,
            test_mode: true,
            message: 'Transcription found but no evidence file to update'
          })
        }
      } else if (result.status === 'done' && !transcription) {
        // Gladia says "done" but we still can't extract transcription
        console.error(`⚠️ Gladia status is "done" but transcription extraction still failed`)
        return NextResponse.json({
          success: false,
          status: 'extraction_failed',
          job_id: jobIdToCheck,
          gladia_status: result.status,
          message: 'Gladia completed but transcription extraction still failed after fix',
          raw_gladia_response: result,
          test_mode: true,
          extraction_debug: {
            checked_paths: [
              'result.result.transcription.full_transcript',
              'result.result.transcription.utterances',
              'result.transcription.full_transcript',
              'result.transcription.utterances',
              'result.prediction'
            ],
            path_values: {
              'result.result.transcription.full_transcript': result?.result?.transcription?.full_transcript,
              'result.result.transcription.utterances': result?.result?.transcription?.utterances?.length || 0,
              'result.transcription.full_transcript': result?.transcription?.full_transcript,
              'result.transcription.utterances': result?.transcription?.utterances?.length || 0,
              'result.prediction': result?.prediction?.length || 0
            }
          }
        })
      }
      
      // Check for errors
      if (result.status === 'error') {
        console.error('Gladia transcription error:', result.error)
        return NextResponse.json({
          success: false,
          status: 'failed',
          error: result.error || 'Transcription failed',
          job_id: jobIdToCheck,
          test_mode: true
        })
      }
      
      // Still processing
      console.log(`⏳ Job ${jobIdToCheck} still processing (status: ${result.status})`)
      return NextResponse.json({
        success: true,
        status: 'processing',
        job_id: jobIdToCheck,
        gladia_status: result.status,
        message: 'Transcription is still processing',
        test_mode: true
      })
      
    } catch (fetchError: any) {
      console.error('❌ Network error checking status:', fetchError)
      return NextResponse.json({
        error: 'Network error checking Gladia status',
        details: fetchError.message,
        test_mode: true
      }, { status: 500 })
    }
    
  } catch (error: any) {
    console.error('❌ Final fix endpoint error:', error)
    
    return NextResponse.json({
      error: 'Final fix endpoint failed',
      details: error.message,
      stack: error.stack,
      test_mode: true
    }, { status: 500 })
  }
}