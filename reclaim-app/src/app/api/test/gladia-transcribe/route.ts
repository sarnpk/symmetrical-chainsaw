import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { audio_url } = await req.json()

    if (!audio_url) {
      return NextResponse.json({ error: 'No audio URL provided' }, { status: 400 })
    }

    // Start transcription with diarization and sentiment analysis
    const transcribeResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'x-gladia-key': process.env.GLADIA_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audio_url,
        diarization: true, // Enable speaker diarization
        diarization_config: {
          number_of_speakers: 2, // Assume 2 speakers (can be adjusted)
          min_speakers: 1,
          max_speakers: 5,
        },
        sentiment_analysis: true, // Enable sentiment analysis
        subtitles: false,
      }),
    })

    if (!transcribeResponse.ok) {
      const errorText = await transcribeResponse.text()
      console.error('Gladia transcription error:', errorText)
      return NextResponse.json(
        { error: 'Failed to start transcription' },
        { status: transcribeResponse.status }
      )
    }

    const transcribeData = await transcribeResponse.json()
    const resultUrl = transcribeData.result_url

    // Poll for results - longer timeout for larger files
    let attempts = 0
    const maxAttempts = 180 // 3 minutes max for larger files
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between checks
      
      const resultResponse = await fetch(resultUrl, {
        headers: {
          'x-gladia-key': process.env.GLADIA_API_KEY || '',
        },
      })

      if (!resultResponse.ok) {
        attempts++
        continue
      }

      const resultData = await resultResponse.json()

      if (resultData.status === 'done') {
        // Log the full result for debugging
        console.log('Gladia result:', JSON.stringify(resultData, null, 2))
        
        // Extract transcription - try multiple possible paths
        const transcription = resultData.result?.transcription?.full_transcript || 
                            resultData.result?.transcription?.text ||
                            resultData.transcription?.full_transcript ||
                            resultData.transcription?.text ||
                            'No transcription available'
        
        // Extract utterances with speaker labels and sentiment
        const utterances = resultData.result?.transcription?.utterances || 
                          resultData.transcription?.utterances ||
                          []
        
        const speakers = utterances.map((u: any) => ({
          speaker: u.speaker || u.speaker_id || 'Speaker',
          text: u.text || u.transcript || '',
          start: u.start || u.time_begin || 0,
          end: u.end || u.time_end || 0,
          sentiment: u.sentiment || u.sentiment_analysis?.sentiment || 'neutral',
          confidence: u.confidence || 1.0,
        }))

        // If no utterances but we have transcription, create a single entry
        if (speakers.length === 0 && transcription && transcription !== 'No transcription available') {
          speakers.push({
            speaker: 'Speaker 1',
            text: transcription,
            start: 0,
            end: 0,
            sentiment: 'neutral',
            confidence: 1.0,
          })
        }

        return NextResponse.json({
          transcription,
          speakers,
          sentiment_analysis: resultData.result?.sentiment_analysis || resultData.sentiment_analysis,
          full_result: resultData,
        })
      }

      if (resultData.status === 'error') {
        return NextResponse.json(
          { error: 'Transcription failed', details: resultData },
          { status: 500 }
        )
      }

      attempts++
    }

    return NextResponse.json(
      { error: 'Transcription timeout - file may be too large' },
      { status: 408 }
    )
  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
