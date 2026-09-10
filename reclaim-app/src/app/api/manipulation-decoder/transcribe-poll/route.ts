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
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'No job ID provided' }, { status: 400 });
    }

    // Check status
    const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
      headers: { 'x-gladia-key': process.env.GLADIA_API_KEY },
    });

    if (!statusResponse.ok) {
      return NextResponse.json({ status: 'pending' });
    }

    const result = await statusResponse.json();

    if (result.status === 'error') {
      return NextResponse.json({
        success: false,
        error: result.error || 'Transcription failed'
      }, { status: 500 });
    }

    // Extract transcription
    let transcription = null;
    if (result?.transcription?.full_transcript) {
      transcription = result.transcription.full_transcript.trim();
    } else if (result?.result?.transcription?.full_transcript) {
      transcription = result.result.transcription.full_transcript.trim();
    } else if (result?.transcription?.utterances?.length > 0) {
      transcription = result.transcription.utterances
        .map((u: any) => u.text || '')
        .join(' ')
        .trim();
    } else if (result?.prediction?.[0]?.transcription) {
      transcription = result.prediction[0].transcription.trim();
    }

    // Extract speaker data
    const utterances = result?.result?.transcription?.utterances || 
                      result?.transcription?.utterances || []
    
    const speakers = utterances.map((u: any) => ({
      speaker: u.speaker || u.speaker_id || 'Speaker',
      text: u.text || u.transcript || '',
      start: u.start || u.time_begin || 0,
      end: u.end || u.time_end || 0,
      sentiment: u.sentiment || u.sentiment_analysis?.sentiment || 'neutral',
      confidence: u.confidence || 1.0,
    }))

    if (transcription) {
      return NextResponse.json({
        success: true,
        transcription,
        speakers,
        language: result.transcription?.languages?.[0] || result.prediction?.[0]?.language || 'en',
        status: 'done'
      });
    }

    // Still processing
    return NextResponse.json({ status: 'processing' });

  } catch (error: any) {
    console.error('Poll error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
