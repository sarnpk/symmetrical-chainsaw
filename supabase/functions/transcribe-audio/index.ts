import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GladiaTranscriptionRequest {
  audio_url?: string
  language?: string
  language_behaviour?: 'manual' | 'automatic single language' | 'automatic multiple languages'
  transcription_hint?: string
  detect_language?: boolean
  enable_code_switching?: boolean
  custom_vocabulary?: string[]
}

interface GladiaTranscriptionResponse {
  id: string
  status: 'queued' | 'processing' | 'done' | 'error'
  result_url?: string
  error?: string
  prediction?: {
    language: string
    language_probability: number
    transcription: string
    confidence: number
    time_begin: number
    time_end: number
    words?: Array<{
      word: string
      time_begin: number
      time_end: number
      confidence: number
    }>
  }[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { evidence_file_id, options = {} } = await req.json()

    if (!evidence_file_id) {
      throw new Error('Evidence file ID is required')
    }

    // Check user's transcription limits
    const canTranscribe = await checkTranscriptionLimit(supabaseClient, user.id)
    if (!canTranscribe) {
      return new Response(
        JSON.stringify({
          error: 'Transcription limit reached for your subscription tier',
          code: 'LIMIT_EXCEEDED'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get evidence file details
    const { data: evidenceFile, error: fileError } = await supabaseClient
      .from('evidence_files')
      .select('*')
      .eq('id', evidence_file_id)
      .eq('user_id', user.id)
      .single()

    if (fileError || !evidenceFile) {
      throw new Error('Evidence file not found')
    }

    // Check if file is audio
    if (!evidenceFile.file_type.startsWith('audio/')) {
      throw new Error('File is not an audio file')
    }

    // Update status to processing
    await supabaseClient
      .from('evidence_files')
      .update({
        transcription_status: 'processing',
        processing_status: 'processing',
        metadata: {
          ...evidenceFile.metadata,
          transcription_started_at: new Date().toISOString()
        }
      })
      .eq('id', evidence_file_id)

    // Generate signed URL for audio file
    const { data: signedUrlData } = await supabaseClient.storage
      .from(evidenceFile.storage_bucket)
      .createSignedUrl(evidenceFile.storage_path, 3600) // 1 hour

    if (!signedUrlData?.signedUrl) {
      throw new Error('Failed to generate audio URL')
    }

    // Start transcription with Gladia API
    const transcriptionResult = await transcribeWithGladia(signedUrlData.signedUrl, options)

    // Update evidence file with transcription results
    await supabaseClient
      .from('evidence_files')
      .update({
        transcription: transcriptionResult.transcription,
        transcription_status: 'completed',
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        metadata: {
          ...evidenceFile.metadata,
          transcription_language: transcriptionResult.language,
          transcription_confidence: transcriptionResult.confidence,
          transcription_duration: transcriptionResult.duration,
          transcription_completed_at: new Date().toISOString(),
          word_timestamps: transcriptionResult.words
        }
      })
      .eq('id', evidence_file_id)

    // Record usage for billing
    await recordTranscriptionUsage(supabaseClient, user.id, transcriptionResult)

    return new Response(
      JSON.stringify({
        success: true,
        transcription: transcriptionResult.transcription,
        language: transcriptionResult.language,
        confidence: transcriptionResult.confidence,
        duration: transcriptionResult.duration
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Transcription error:', error)

    return new Response(
      JSON.stringify({
        error: error.message || 'Transcription failed',
        code: 'TRANSCRIPTION_ERROR'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function transcribeWithGladia(audioUrl: string, options: any) {
  const gladiaApiKey = Deno.env.get('GLADIA_API_KEY')
  if (!gladiaApiKey) {
    throw new Error('Gladia API key not configured')
  }

  // Start transcription
  const transcriptionRequest: GladiaTranscriptionRequest = {
    audio_url: audioUrl,
    language_behaviour: 'automatic single language',
    detect_language: true,
    enable_code_switching: false,
    transcription_hint: 'This recording may contain evidence of emotional abuse, manipulation, or threatening behavior.',
    ...options,
  }

  const startResponse = await fetch('https://api.gladia.io/v2/transcription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gladia-key': gladiaApiKey,
    },
    body: JSON.stringify(transcriptionRequest),
  })

  if (!startResponse.ok) {
    throw new Error(`Failed to start transcription: ${startResponse.statusText}`)
  }

  const { id: transcriptionId } = await startResponse.json()

  // Poll for results
  const maxAttempts = 60 // 5 minutes max
  let attempts = 0

  while (attempts < maxAttempts) {
    const statusResponse = await fetch(`https://api.gladia.io/v2/transcription/${transcriptionId}`, {
      headers: {
        'x-gladia-key': gladiaApiKey,
      },
    })

    if (!statusResponse.ok) {
      throw new Error(`Failed to get transcription status: ${statusResponse.statusText}`)
    }

    const result: GladiaTranscriptionResponse = await statusResponse.json()

    if (result.status === 'done') {
      if (!result.prediction || result.prediction.length === 0) {
        throw new Error('No transcription result available')
      }

      const prediction = result.prediction[0]

      return {
        transcription: prediction.transcription,
        language: prediction.language,
        confidence: prediction.confidence,
        duration: prediction.time_end - prediction.time_begin,
        words: prediction.words?.map(word => ({
          word: word.word,
          start_time: word.time_begin,
          end_time: word.time_end,
          confidence: word.confidence,
        })),
      }
    }

    if (result.status === 'error') {
      throw new Error(`Transcription failed: ${result.error}`)
    }

    // Wait 5 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 5000))
    attempts++
  }

  throw new Error('Transcription timeout - please try again')
}

async function checkTranscriptionLimit(supabaseClient: any, userId: string): Promise<boolean> {
  // Get user's subscription tier
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  const limits = {
    foundation: 10,
    recovery: 100,
    empowerment: -1 // unlimited
  }

  const monthlyLimit = limits[profile?.subscription_tier || 'foundation']

  if (monthlyLimit === -1) return true // unlimited

  // Check current month usage
  const currentMonth = new Date().toISOString().slice(0, 7)

  const { data: usage } = await supabaseClient
    .from('usage_tracking')
    .select('usage_count, usage_metadata')
    .eq('user_id', userId)
    .eq('feature_name', 'ai_interactions')
    .eq('usage_type', 'monthly_count')
    .gte('created_at', `${currentMonth}-01`)
    .lt('created_at', `${currentMonth}-32`)

  const currentUsage = usage?.reduce((sum: number, record: any) => {
    return record.usage_metadata?.feature === 'audio_transcription' ? sum + record.usage_count : sum
  }, 0) || 0

  return currentUsage < monthlyLimit
}

async function recordTranscriptionUsage(supabaseClient: any, userId: string, result: any) {
  const currentPeriodStart = new Date()
  currentPeriodStart.setDate(1) // First day of month

  const currentPeriodEnd = new Date(currentPeriodStart)
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
  currentPeriodEnd.setDate(0) // Last day of month

  await supabaseClient
    .from('usage_tracking')
    .insert({
      user_id: userId,
      feature_name: 'ai_interactions',
      usage_type: 'monthly_count',
      usage_count: 1,
      usage_metadata: {
        feature: 'audio_transcription',
        duration: result.duration,
        language: result.language,
        confidence: result.confidence
      },
      billing_period_start: currentPeriodStart.toISOString().split('T')[0],
      billing_period_end: currentPeriodEnd.toISOString().split('T')[0]
    })
}