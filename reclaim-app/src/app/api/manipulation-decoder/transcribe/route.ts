import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { checkAndRecordAIUsage } from '@/lib/usage-tracking';

export async function POST(request: Request) {
  // Check usage and authenticate
  const usageCheck = await checkAndRecordAIUsage('audio_transcription');
  if ('error' in usageCheck) {
    return NextResponse.json({ error: usageCheck.error }, { status: usageCheck.status });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.GLADIA_API_KEY) {
    return NextResponse.json({ error: 'Transcription service not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'auto';

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an audio file.' }, { status: 400 });
    }

    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 });
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

    // Start transcription with diarization and sentiment
    const transcriptionResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': process.env.GLADIA_API_KEY,
      },
      body: JSON.stringify({ 
        audio_url,
        language: language === 'auto' ? undefined : language,
        diarization: true,
        diarization_config: {
          number_of_speakers: 2,
          min_speakers: 1,
          max_speakers: 5,
        },
        sentiment_analysis: true,
      }),
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription start failed');
    }

    const transcriptionData = await transcriptionResponse.json();
    const jobId = transcriptionData.id || transcriptionData.result_url;

    // Return job ID immediately - client will poll
    return NextResponse.json({
      success: true,
      jobId: jobId,
      polling: true,
      message: 'Transcription started. Please wait...'
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: 'Transcription failed. Please try again with a shorter audio file.'
    }, { status: 500 });
  }
}