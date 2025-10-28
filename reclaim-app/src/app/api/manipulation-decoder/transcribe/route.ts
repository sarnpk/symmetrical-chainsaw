import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

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

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an audio file.' }, { status: 400 });
    }

    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB for quick transcription.' }, { status: 400 });
    }

    // Upload directly to Gladia
    const uploadFormData = new FormData();
    uploadFormData.append('audio', audioFile);

    const uploadResponse = await fetch('https://api.gladia.io/v2/upload', {
      method: 'POST',
      headers: { 'x-gladia-key': process.env.GLADIA_API_KEY },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const { audio_url } = await uploadResponse.json();

    // Start transcription
    const transcriptionResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': process.env.GLADIA_API_KEY,
      },
      body: JSON.stringify({ audio_url }),
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription start failed');
    }

    const { id: jobId } = await transcriptionResponse.json();

    // Quick poll (max 15 seconds)
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
        headers: { 'x-gladia-key': process.env.GLADIA_API_KEY },
      });

      if (statusResponse.ok) {
        const result = await statusResponse.json();
        
        // Extract transcription
        let transcription = null;
        if (result?.transcription?.full_transcript) {
          transcription = result.transcription.full_transcript.trim();
        } else if (result?.transcription?.utterances?.length > 0) {
          transcription = result.transcription.utterances
            .map((u: any) => u.text || '')
            .join(' ')
            .trim();
        }

        if (transcription) {
          return NextResponse.json({
            success: true,
            transcription,
            language: result.transcription?.languages?.[0] || 'en'
          });
        }

        if (result.status === 'error') {
          throw new Error('Transcription failed');
        }
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Transcription is taking too long. Please try a shorter audio file (under 1 minute).'
    }, { status: 408 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: 'Transcription failed. Please try again with a shorter audio file.'
    }, { status: 500 });
  }
}