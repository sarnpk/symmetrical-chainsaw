import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    // Upload to Supabase storage temporarily
    const fileName = `temp-audio-${Date.now()}.${audioFile.name.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence-files')
      .upload(`temp/${fileName}`, audioFile);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get signed URL
    const { data: signedUrlData } = await supabase.storage
      .from('evidence-files')
      .createSignedUrl(`temp/${fileName}`, 3600);

    if (!signedUrlData?.signedUrl) {
      throw new Error('Failed to generate audio URL');
    }

    // Call Supabase Edge Function for transcription
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions
      .invoke('transcribe-audio', {
        body: {
          audio_url: signedUrlData.signedUrl,
          evidence_file_id: null // Not storing as evidence file
        }
      });

    // Clean up temporary file
    await supabase.storage
      .from('evidence-files')
      .remove([`temp/${fileName}`]);

    if (transcriptionError) {
      throw new Error(`Transcription failed: ${transcriptionError.message}`);
    }

    if (transcriptionData?.success && transcriptionData?.transcription) {
      return NextResponse.json({
        success: true,
        transcription: transcriptionData.transcription,
        language: transcriptionData.language || 'en',
        confidence: transcriptionData.confidence || 0.8
      });
    }

    throw new Error('No transcription result received');

  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Transcription failed'
    }, { status: 500 });
  }
}