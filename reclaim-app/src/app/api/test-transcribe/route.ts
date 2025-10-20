import { NextResponse } from 'next/server'

/**
 * Test endpoint for transcription without authentication
 * WARNING: This is for testing only - remove in production
 */

export async function POST(request: Request) {
  // IMPORTANT: This endpoint bypasses ALL authentication for testing
  console.log('🧪 TEST ENDPOINT CALLED - NO AUTH REQUIRED')
  
  try {
    const body = await request.json()
    const { audio_url, job_id, test_type } = body
    
    console.log('🧪 Test request body:', { audio_url: !!audio_url, job_id, test_type })
    
    if (test_type === 'start_transcription') {
      if (!audio_url) {
        return NextResponse.json({ 
          error: 'Missing audio_url',
          test_mode: true 
        }, { status: 400 })
      }
      
      // Check if Gladia API key is configured
      const gladiaApiKey = process.env.GLADIA_API_KEY
      if (!gladiaApiKey) {
        return NextResponse.json({ 
          error: 'GLADIA_API_KEY not configured in environment variables',
          test_mode: true,
          debug: 'Check your .env.local file'
        }, { status: 500 })
      }

      console.log('🚀 Starting test transcription with Gladia API...')
      console.log('🔗 Audio URL:', audio_url)
      
      try {
        const startResponse = await fetch('https://api.gladia.io/v2/transcription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gladia-key': gladiaApiKey,
          },
          body: JSON.stringify({ audio_url }),
        })

        console.log('📡 Gladia API response status:', startResponse.status)

        if (!startResponse.ok) {
          const errorText = await startResponse.text()
          console.error('❌ Gladia start error:', startResponse.status, errorText)
          return NextResponse.json({ 
            error: `Gladia API error: ${startResponse.status}`,
            details: errorText,
            test_mode: true
          }, { status: 500 })
        }

        const startResult = await startResponse.json()
        console.log('✅ Test transcription started successfully:', startResult)
        
        return NextResponse.json({
          success: true,
          job_id: startResult.id,
          message: 'Transcription started successfully via test endpoint',
          test_mode: true,
          gladia_response: startResult
        })
      } catch (fetchError: any) {
        console.error('❌ Network error calling Gladia:', fetchError)
        return NextResponse.json({
          error: 'Network error calling Gladia API',
          details: fetchError.message,
          test_mode: true
        }, { status: 500 })
      }
    }
    
    if (test_type === 'check_status') {
      if (!job_id) {
        return NextResponse.json({ 
          error: 'Missing job_id',
          test_mode: true 
        }, { status: 400 })
      }
      
      const gladiaApiKey = process.env.GLADIA_API_KEY
      if (!gladiaApiKey) {
        return NextResponse.json({ 
          error: 'GLADIA_API_KEY not configured',
          test_mode: true 
        }, { status: 500 })
      }
      
      console.log(`🔍 Checking test status for job ${job_id}`)
      
      try {
        const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${job_id}`, {
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
        console.log(`📊 Gladia status result:`, result)
        
        // Extract transcription using robust logic
        let transcription = null
        
        // Priority 1: v2 format full_transcript
        if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
          transcription = result.transcription.full_transcript.trim()
          console.log('✅ Found full_transcript:', transcription)
        }
        // Priority 2: v2 format utterances
        else if (result?.transcription?.utterances && Array.isArray(result.transcription.utterances) && result.transcription.utterances.length > 0) {
          transcription = result.transcription.utterances
            .map((u: any) => (u.text || '').trim())
            .filter((text: string) => text.length > 0)
            .join(' ')
            .trim()
          if (transcription) {
            console.log('✅ Found utterances transcription:', transcription)
          }
        }
        // Priority 3: v1 format prediction
        else if (result?.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
          const prediction = result.prediction[0]
          if (prediction?.transcription && typeof prediction.transcription === 'string') {
            transcription = prediction.transcription.trim()
            console.log('✅ Found prediction transcription:', transcription)
          }
        }
        
        const finalStatus = transcription ? 'completed' : (result.status === 'error' ? 'failed' : 'processing')
        console.log(`📋 Final status: ${finalStatus}`)
        
        return NextResponse.json({
          success: true,
          status: finalStatus,
          transcription,
          job_id,
          language: result.transcription?.languages?.[0] || 
                   result.transcription?.utterances?.[0]?.language || 
                   result.prediction?.[0]?.language || 'unknown',
          gladia_status: result.status,
          error: result.status === 'error' ? result.error : undefined,
          test_mode: true,
          raw_gladia_response: result
        })
      } catch (fetchError: any) {
        console.error('❌ Network error checking status:', fetchError)
        return NextResponse.json({
          error: 'Network error checking Gladia status',
          details: fetchError.message,
          test_mode: true
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Invalid test_type. Use "start_transcription" or "check_status"',
      valid_types: ['start_transcription', 'check_status'],
      test_mode: true
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('❌ Test endpoint error:', error)
    
    return NextResponse.json({
      error: 'Test endpoint failed',
      details: error.message,
      stack: error.stack,
      test_mode: true
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Test transcription endpoint',
    endpoints: {
      'POST with test_type: "start_transcription"': 'Start a new transcription',
      'POST with test_type: "check_status"': 'Check transcription status'
    },
    warning: 'This is a test endpoint - remove in production'
  })
}