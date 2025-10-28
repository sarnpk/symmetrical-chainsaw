import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

function extractTranscriptionText(result: any): string | null {
  if (result?.transcription?.full_transcript && typeof result.transcription.full_transcript === 'string') {
    const text = result.transcription.full_transcript.trim()
    if (text) return text
  }
  
  if (result?.transcription?.utterances && Array.isArray(result.transcription.utterances) && result.transcription.utterances.length > 0) {
    const text = result.transcription.utterances
      .map((u: any) => (u.text || '').trim())
      .filter((text: string) => text.length > 0)
      .join(' ')
      .trim()
    if (text) return text
  }
  
  if (result?.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
    const prediction = result.prediction[0]
    if (prediction?.transcription && typeof prediction.transcription === 'string') {
      const text = prediction.transcription.trim()
      if (text) return text
    }
  }
  
  return null
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.GLADIA_API_KEY) {
    return NextResponse.json({ error: 'Transcription service not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an audio file.' }, { status: 400 });
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 25MB.' }, { status: 400 });
    }

    // Upload to temporary storage first
    const uploadFormData = new FormData();
    uploadFormData.append('audio', audioFile);

    const uploadResponse = await fetch('https://api.gladia.io/v2/upload', {
      method: 'POST',
      headers: {
        'x-gladia-key': process.env.GLADIA_API_KEY!,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const { audio_url } = await uploadResponse.json();

    // Start transcription
    const transcriptionResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': process.env.GLADIA_API_KEY!,
      },
      body: JSON.stringify({ audio_url }),
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);
    }

    const { id: jobId } = await transcriptionResponse.json();

    // Poll for results
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
        headers: { 'x-gladia-key': process.env.GLADIA_API_KEY! },
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.statusText}`);
      }

      const result = await statusResponse.json();
      const transcription = extractTranscriptionText(result);

      if (transcription) {
        return NextResponse.json({
          success: true,
          transcription,
          language: result.transcription?.languages?.[0] || 'en',
          confidence: result.transcription?.utterances?.[0]?.confidence || 0.8
        });
      }

      if (result.status === 'error') {
        throw new Error(`Transcription failed: ${result.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Transcription timeout');

  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Transcription failed'
    }, { status: 500 });
  }
}