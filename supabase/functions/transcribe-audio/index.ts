import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GladiaTranscriptionRequest {
  audio_url: string
  language?: string
  // v2 uses American spelling
  language_behavior?: 'manual' | 'automatic single language' | 'automatic multiple languages'
  transcription_hint?: string
  enable_code_switching?: boolean
  custom_vocabulary?: string[]
}

interface GladiaTranscriptionResponse {
  id?: string
  status: 'queued' | 'processing' | 'done' | 'error'
  result_url?: string
  error?: string
  // Legacy shape
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
  // v2 shape
  transcription?: {
    languages?: string[]
    utterances?: Array<{
      text: string
      language?: string
      start?: number
      end?: number
      confidence?: number
      channel?: number
      words?: Array<{
        word: string
        start?: number
        end?: number
        confidence?: number
      }>
    }>
    full_transcript?: string
  }
  metadata?: {
    audio_duration?: number
    number_of_distinct_channels?: number
    billing_time?: number
    transcription_time?: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase clients
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Admin client bypasses RLS for storage and DB updates
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    )

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { evidence_file_id, audio_url: preSignedAudioUrl, options = {} } = await req.json()

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

    // Update status to processing (use admin to bypass RLS)
    await supabaseAdmin
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

    // Use provided pre-signed URL if available, otherwise generate one (admin bypasses policies)
    let audioUrlToUse = preSignedAudioUrl as string | undefined
    let audioUrlSource: 'pre-signed' | 'generated' = 'pre-signed'
    if (!audioUrlToUse) {
      const { data: signedUrlData, error: signedErr } = await supabaseAdmin.storage
        .from(evidenceFile.storage_bucket)
        .createSignedUrl(evidenceFile.storage_path, 3600) // 1 hour
      if (!signedUrlData?.signedUrl) {
        const detail = signedErr?.message || 'no signedUrl returned'
        throw new Error(`Failed to generate audio URL: ${detail}`)
      }
      audioUrlToUse = signedUrlData.signedUrl
      audioUrlSource = 'generated'
    }

    // Start transcription with Gladia API
    const transcriptionResult = await transcribeWithGladia(audioUrlToUse!, options, audioUrlSource)

    // Update evidence file with transcription results (admin)
    await supabaseAdmin
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
    await recordTranscriptionUsage(supabaseAdmin, user.id, transcriptionResult)

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

async function transcribeWithGladia(audioUrl: string, options: any, source: 'pre-signed' | 'generated') {
  const gladiaApiKey = Deno.env.get('GLADIA_API_KEY')
  if (!gladiaApiKey) {
    throw new Error('Gladia API key not configured')
  }

  // Start transcription with minimal valid v2 payload to avoid schema issues
  const transcriptionRequest: GladiaTranscriptionRequest = {
    audio_url: audioUrl,
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
    let bodyText = ''
    let validationErrors: string[] | undefined
    try {
      const maybeJson = await startResponse.clone().json()
      bodyText = JSON.stringify(maybeJson)
      if (maybeJson && Array.isArray(maybeJson.validation_errors)) {
        validationErrors = maybeJson.validation_errors
      }
    } catch (_) {
      try { bodyText = await startResponse.text() } catch (_) {}
    }
    // Avoid leaking token in logs if present in URL
    const safeUrl = audioUrl.replace(/(token=)[^&]+/i, '$1***')
    console.error('Gladia start error', { status: startResponse.status, statusText: startResponse.statusText, body: bodyText.slice(0, 500), validation_errors: validationErrors, audioUrlSource: source, audioUrl: safeUrl })
    const ve = validationErrors ? ` validation_errors: ${validationErrors.join('; ').slice(0, 300)}` : ''
    throw new Error(`Failed to start transcription: ${startResponse.status} ${startResponse.statusText}${ve}${bodyText ? ' - ' + bodyText.slice(0, 200) : ''}`)
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

    // If v2 shape is present, treat as done even if 'status' is missing
    if (result.transcription && (result.status === 'done' || result.status === undefined)) {
      const t = result.transcription
      const transcript = t.full_transcript || (t.utterances?.map(u => u.text).join(' ') || '')
      if (!transcript) {
        console.error('Gladia done without transcript', { snippet: JSON.stringify(result).slice(0, 500) })
        throw new Error('No transcription result available')
      }
      const lang = t.languages?.[0] || t.utterances?.[0]?.language || 'unknown'
      // Rough confidence: average of utterance confidences if available
      let confidence = 0
      if (t.utterances && t.utterances.length > 0) {
        const vals = t.utterances.map(u => typeof u.confidence === 'number' ? u.confidence : 0)
        confidence = vals.reduce((a, b) => a + b, 0) / vals.length
      }
      const duration = result.metadata?.audio_duration ?? undefined

      return {
        transcription: transcript,
        language: lang,
        confidence: confidence || 0,
        duration: typeof duration === 'number' ? duration : undefined,
        words: t.utterances?.flatMap(u => (u.words || []).map(w => ({
          word: w.word,
          start_time: w.start ?? 0,
          end_time: w.end ?? 0,
          confidence: w.confidence ?? 0,
        })))
      }
    }

    if (result.status === 'done') {
      // Prefer v2 shape if present
      if (result.transcription) {
        const t = result.transcription
        const transcript = t.full_transcript || (t.utterances?.map(u => u.text).join(' ') || '')
        if (!transcript) {
          console.error('Gladia done without transcript', { snippet: JSON.stringify(result).slice(0, 500) })
          throw new Error('No transcription result available')
        }
        const lang = t.languages?.[0] || t.utterances?.[0]?.language || 'unknown'
        // Rough confidence: average of utterance confidences if available
        let confidence = 0
        if (t.utterances && t.utterances.length > 0) {
          const vals = t.utterances.map(u => typeof u.confidence === 'number' ? u.confidence : 0)
          confidence = vals.reduce((a, b) => a + b, 0) / vals.length
        }
        // duration: prefer metadata; fallback to last utterance end
        let duration = result.metadata?.audio_duration as number | undefined
        if ((duration === undefined || isNaN(duration)) && t.utterances && t.utterances.length > 0) {
          const last = t.utterances.reduce((a, b) => (typeof a.end === 'number' && typeof b.end === 'number' ? (a.end > b.end ? a : b) : a), t.utterances[0])
          if (typeof last.end === 'number') duration = last.end
        }

        return {
          transcription: transcript,
          language: lang,
          confidence: confidence || 0,
          duration: typeof duration === 'number' ? duration : undefined,
          words: t.utterances?.flatMap(u => (u.words || []).map(w => ({
            word: w.word,
            start_time: w.start ?? 0,
            end_time: w.end ?? 0,
            confidence: w.confidence ?? 0,
          })))
        }
      }

      // Legacy inline shape
      if (result.prediction && result.prediction.length > 0) {
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

      // If no inline result provided, try fetching result_url (v2 behavior)
      if (result.result_url) {
        try {
          const res2 = await fetch(result.result_url, { headers: { 'x-gladia-key': gladiaApiKey } })
          if (res2.ok) {
            const body2 = await res2.json()
            const t = (body2.transcription ?? body2.result ?? {}) as GladiaTranscriptionResponse['transcription']
            if (t) {
              const transcript = t.full_transcript || (t.utterances?.map((u: any) => u.text).join(' ') || '')
              if (transcript) {
                const lang = t.languages?.[0] || t.utterances?.[0]?.language || 'unknown'
                let confidence = 0
                if (t.utterances && t.utterances.length > 0) {
                  const vals = t.utterances.map((u: any) => typeof u.confidence === 'number' ? u.confidence : 0)
                  confidence = vals.reduce((a: number, b: number) => a + b, 0) / vals.length
                }
                // duration: prefer metadata from first call; else from body2.metadata; else last utterance end
                let duration = result.metadata?.audio_duration as number | undefined
                if ((duration === undefined || isNaN(duration)) && typeof body2?.metadata?.audio_duration === 'number') {
                  duration = body2.metadata.audio_duration
                }
                if ((duration === undefined || isNaN(duration)) && t.utterances && t.utterances.length > 0) {
                  const last = t.utterances.reduce((a: any, b: any) => (typeof a.end === 'number' && typeof b.end === 'number' ? (a.end > b.end ? a : b) : a), t.utterances[0])
                  if (typeof last.end === 'number') duration = last.end
                }

                return {
                  transcription: transcript,
                  language: lang,
                  confidence: confidence || 0,
                  duration: typeof duration === 'number' ? duration : undefined,
                  words: t.utterances?.flatMap((u: any) => ((u.words || []).map((w: any) => ({
                    word: w.word,
                    start_time: w.start ?? 0,
                    end_time: w.end ?? 0,
                    confidence: w.confidence ?? 0,
                  }))))
                }
              }
            }
          } else {
            console.error('Failed to fetch Gladia result_url', { status: res2.status, statusText: res2.statusText })
          }
        } catch (e) {
          console.error('Error fetching Gladia result_url', { error: (e as Error).message })
        }
      }

      console.error('Gladia done but no inline result and no usable result_url', { snippet: JSON.stringify(result).slice(0, 500) })
      throw new Error('No transcription result available')
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