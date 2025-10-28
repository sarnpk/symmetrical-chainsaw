import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { transcribeAudioFile } from '../../../../../lib/gladia-api';

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

    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an audio file.' }, { status: 400 });
    }

    // Validate file size (max 25MB)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 25MB.' }, { status: 400 });
    }

    // Transcribe audio using Gladia
    const result = await transcribeAudioFile(audioFile, {
      transcriptionHint: 'This is a conversation that may contain manipulation tactics, emotional abuse, or narcissistic behavior patterns.'
    });

    return NextResponse.json({
      success: true,
      transcription: result.transcription,
      language: result.language,
      confidence: result.confidence,
      duration: result.duration
    });

  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Transcription failed'
    }, { status: 500 });
  }
}