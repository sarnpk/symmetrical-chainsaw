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
        diarization: true,
        diarization_config: {
          number_of_speakers: 2,
          min_speakers: 1,
          max_speakers: 5,
        },
        sentiment_analysis: true,
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

    // Return the result_url immediately - client will poll this
    return NextResponse.json({
      result_url: transcribeData.result_url,
      id: transcribeData.id,
    })
  } catch (error: any) {
    console.error('Start transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
