import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { result_url } = await req.json()

    if (!result_url) {
      return NextResponse.json({ error: 'No result URL provided' }, { status: 400 })
    }

    // Check the status
    const resultResponse = await fetch(result_url, {
      headers: {
        'x-gladia-key': process.env.GLADIA_API_KEY || '',
      },
    })

    if (!resultResponse.ok) {
      return NextResponse.json({ status: 'pending' })
    }

    const resultData = await resultResponse.json()

    if (resultData.status === 'done') {
      // Extract transcription with speaker info and sentiment
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
        status: 'done',
        transcription,
        speakers,
        sentiment_analysis: resultData.result?.sentiment_analysis || resultData.sentiment_analysis,
        full_result: resultData,
      })
    }

    if (resultData.status === 'error') {
      return NextResponse.json({
        status: 'error',
        error: resultData.error || 'Transcription failed',
      })
    }

    // Still processing
    return NextResponse.json({
      status: 'processing',
    })
  } catch (error: any) {
    console.error('Poll error:', error)
    return NextResponse.json(
      { status: 'error', error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
