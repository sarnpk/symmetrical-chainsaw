import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for privileged operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ROBUST transcription extraction - standardized across all components
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
    console.log('🎯 Simple transcription API called')
    
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
    const { audio_url, file_name, evidence_file_id } = body
    
    if (!audio_url) {
      return NextResponse.json({ error: 'Missing audio_url' }, { status: 400 })
    }
    
    console.log(`📁 Processing audio for user ${user.id}`)
    
    // Start transcription with Gladia
    const gladiaApiKey = process.env.GLADIA_API_KEY
    if (!gladiaApiKey) {
      return NextResponse.json({ error: 'GLADIA_API_KEY not configured' }, { status: 500 })
    }

    console.log('🚀 Starting Gladia transcription...')
    
    const startResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': gladiaApiKey,
      },
      body: JSON.stringify({ audio_url }),
    })

    if (!startResponse.ok) {
      const errorText = await startResponse.text()
      console.error('Gladia start error:', startResponse.status, errorText)
      return NextResponse.json({ 
        error: `Failed to start transcription: ${startResponse.status}`,
        code: 'GLADIA_START_ERROR'
      }, { status: 500 })
    }

    const startResult = await startResponse.json()
    const jobId = startResult.id
    console.log('✅ Gladia job started:', jobId)
    
    // Update evidence file with job ID if provided
    if (evidence_file_id) {
      try {
        await supabaseAdmin
          .from('evidence_files')
          .update({
            transcription_status: 'processing',
            metadata: {
              transcription_job_id: jobId,
              transcription_started_at: new Date().toISOString()
            }
          })
          .eq('id', evidence_file_id)
          .eq('user_id', user.id)
      } catch (dbError) {
        console.warn('Failed to update evidence file:', dbError)
      }
    }
    
    // Implement smart polling strategy
    const maxWaitMs = 600000 // 10 minutes (increased from 5)
    const startTime = Date.now()
    let attempt = 0
    let consecutiveErrors = 0
    const maxConsecutiveErrors = 3
    
    while (Date.now() - startTime < maxWaitMs) {
      attempt++
      console.log(`⏳ Poll attempt ${attempt} for job ${jobId}`)
      
      try {
        const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
          headers: { 'x-gladia-key': gladiaApiKey },
        })

        if (!statusResponse.ok) {
          consecutiveErrors++
          console.error(`Status check failed (${consecutiveErrors}/${maxConsecutiveErrors}):`, statusResponse.status)
          
          if (consecutiveErrors >= maxConsecutiveErrors) {
            return NextResponse.json({ 
              error: `Status check failed after ${maxConsecutiveErrors} attempts: ${statusResponse.status}`,
              code: 'STATUS_CHECK_ERROR',
              job_id: jobId
            }, { status: 500 })
          }
          
          // Wait longer before retrying on error
          await new Promise(resolve => setTimeout(resolve, 5000))
          continue
        }

        // Reset error counter on successful response
        consecutiveErrors = 0

        const result = await statusResponse.json()
        console.log(`📊 Gladia response (attempt ${attempt}):`, JSON.stringify(result, null, 2))
        
        // Use standardized transcription extraction
        const transcription = extractTranscriptionText(result)
        
        if (transcription) {
          console.log(`🎉 Transcription completed: "${transcription}"`)
          
          // Update evidence file with completed transcription if provided
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
                    transcription_job_id: jobId,
                    transcription_completed_at: new Date().toISOString(),
                    transcription_language: result.transcription?.languages?.[0] || 
                                          result.transcription?.utterances?.[0]?.language || 
                                          result.prediction?.[0]?.language || 'unknown'
                  }
                })
                .eq('id', evidence_file_id)
                .eq('user_id', user.id)
            } catch (dbError) {
              console.warn('Failed to update evidence file with completion:', dbError)
            }
          }
          
          return NextResponse.json({
            success: true,
            transcription,
            job_id: jobId,
            language: result.transcription?.languages?.[0] || 
                     result.transcription?.utterances?.[0]?.language || 
                     result.prediction?.[0]?.language || 'unknown'
          })
        }
        
        // Check for errors
        if (result.status === 'error') {
          console.error('Gladia error:', result.error)
          
          // Update evidence file with error if provided
          if (evidence_file_id) {
            try {
              await supabaseAdmin
                .from('evidence_files')
                .update({
                  transcription_status: 'failed',
                  processing_status: 'failed',
                  processed_at: new Date().toISOString(),
                  metadata: {
                    transcription_job_id: jobId,
                    transcription_error: result.error,
                    transcription_failed_at: new Date().toISOString()
                  }
                })
                .eq('id', evidence_file_id)
                .eq('user_id', user.id)
            } catch (dbError) {
              console.warn('Failed to update evidence file with error:', dbError)
            }
          }
          
          return NextResponse.json({ 
            error: result.error || 'Transcription failed',
            code: 'GLADIA_TRANSCRIPTION_ERROR',
            job_id: jobId
          }, { status: 500 })
        }
        
        // Calculate adaptive delay based on attempt number and expected processing time
        let delay: number
        if (attempt <= 3) {
          // Quick checks for short audio (1s, 2s, 4s)
          delay = 1000 * Math.pow(2, attempt - 1)
        } else if (attempt <= 10) {
          // Medium checks (5s)
          delay = 5000
        } else {
          // Longer checks for long audio (10s)
          delay = 10000
        }
        
        console.log(`⏱️ Waiting ${delay}ms before next check...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        
      } catch (pollError: any) {
        consecutiveErrors++
        console.error(`Poll error (${consecutiveErrors}/${maxConsecutiveErrors}):`, pollError.message)
        
        if (consecutiveErrors >= maxConsecutiveErrors) {
          return NextResponse.json({ 
            error: `Polling failed after ${maxConsecutiveErrors} consecutive errors: ${pollError.message}`,
            code: 'POLLING_ERROR',
            job_id: jobId
          }, { status: 500 })
        }
        
        // Wait before retrying on error
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
    
    console.error('❌ Transcription timed out after 10 minutes')
    
    // Update evidence file with timeout if provided
    if (evidence_file_id) {
      try {
        await supabaseAdmin
          .from('evidence_files')
          .update({
            transcription_status: 'failed',
            processing_status: 'failed',
            processed_at: new Date().toISOString(),
            metadata: {
              transcription_job_id: jobId,
              transcription_error: 'Transcription timed out after 10 minutes',
              transcription_failed_at: new Date().toISOString()
            }
          })
          .eq('id', evidence_file_id)
          .eq('user_id', user.id)
      } catch (dbError) {
        console.warn('Failed to update evidence file with timeout:', dbError)
      }
    }
    
    return NextResponse.json({ 
      error: 'Transcription timed out after 10 minutes. The job may still be processing in the background.',
      code: 'TIMEOUT',
      job_id: jobId
    }, { status: 408 })
    
  } catch (error: any) {
    console.error('❌ Simple transcription error:', error)
    
    return NextResponse.json({
      error: error.message || 'Transcription failed',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// Add status check endpoint
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('job_id')
    
    if (!jobId) {
      return NextResponse.json({ error: 'Missing job_id parameter' }, { status: 400 })
    }
    
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
    
    const gladiaApiKey = process.env.GLADIA_API_KEY
    if (!gladiaApiKey) {
      return NextResponse.json({ error: 'GLADIA_API_KEY not configured' }, { status: 500 })
    }
    
    console.log(`🔍 Checking status for job ${jobId}`)
    
    const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
      headers: { 'x-gladia-key': gladiaApiKey },
    })

    if (!statusResponse.ok) {
      return NextResponse.json({ 
        error: `Status check failed: ${statusResponse.status}`,
        code: 'STATUS_CHECK_ERROR'
      }, { status: 500 })
    }

    const result = await statusResponse.json()
    console.log(`📊 Status check result:`, JSON.stringify(result, null, 2))
    
    const transcription = extractTranscriptionText(result)
    
    if (transcription) {
      return NextResponse.json({
        success: true,
        status: 'completed',
        transcription,
        job_id: jobId,
        language: result.transcription?.languages?.[0] || 
                 result.transcription?.utterances?.[0]?.language || 
                 result.prediction?.[0]?.language || 'unknown'
      })
    }
    
    if (result.status === 'error') {
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: result.error || 'Transcription failed',
        job_id: jobId
      })
    }
    
    return NextResponse.json({
      success: true,
      status: 'processing',
      job_id: jobId
    })
    
  } catch (error: any) {
    console.error('❌ Status check error:', error)
    
    return NextResponse.json({
      error: error.message || 'Status check failed',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}