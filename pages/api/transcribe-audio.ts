// Next.js API route for audio transcription
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { audioTranscriptionService } from '../../lib/audio-transcription-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { evidence_file_id, options = {} } = req.body

    if (!evidence_file_id) {
      return res.status(400).json({ error: 'Evidence file ID is required' })
    }

    // Get user from session/auth header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' })
    }

    // Extract user ID from JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authorization' })
    }

    // Get evidence file details
    const { data: evidenceFile, error: fileError } = await supabase
      .from('evidence_files')
      .select('*')
      .eq('id', evidence_file_id)
      .eq('user_id', user.id)
      .single()

    if (fileError || !evidenceFile) {
      return res.status(404).json({ error: 'Evidence file not found' })
    }

    // Generate signed URL for the audio file
    const { data: signedUrlData } = await supabase.storage
      .from(evidenceFile.storage_bucket)
      .createSignedUrl(evidenceFile.storage_path, 3600) // 1 hour

    if (!signedUrlData?.signedUrl) {
      return res.status(500).json({ error: 'Failed to generate audio URL' })
    }

    // Process transcription
    const result = await audioTranscriptionService.processAudioTranscription({
      evidenceFileId: evidence_file_id,
      userId: user.id,
      audioUrl: signedUrlData.signedUrl,
      options
    })

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error,
        code: result.error?.includes('limit') ? 'LIMIT_EXCEEDED' : 'TRANSCRIPTION_ERROR'
      })
    }

    res.status(200).json({
      success: true,
      transcription: result.transcription,
      language: result.language,
      confidence: result.confidence,
      duration: result.duration,
      words: result.words
    })

  } catch (error) {
    console.error('Transcription API error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
