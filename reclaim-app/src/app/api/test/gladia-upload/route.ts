import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Upload to Gladia
    const gladiaFormData = new FormData()
    gladiaFormData.append('audio', audioFile)

    const uploadResponse = await fetch('https://api.gladia.io/v2/upload', {
      method: 'POST',
      headers: {
        'x-gladia-key': process.env.GLADIA_API_KEY || '',
      },
      body: gladiaFormData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Gladia upload error:', errorText)
      return NextResponse.json(
        { error: 'Failed to upload to Gladia' },
        { status: uploadResponse.status }
      )
    }

    const uploadData = await uploadResponse.json()

    return NextResponse.json({
      audio_url: uploadData.audio_url,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
