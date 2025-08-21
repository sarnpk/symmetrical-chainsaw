import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for privileged operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GladiaResponse {
  id?: string
  status?: string
  transcription?: {
    full_transcript?: string
    languages?: string[]
    utterances?: Array<{
      text?: string
      language?: string
      confidence?: number
    }>
  }
  prediction?: Array<{
    transcription?: string
    language?: string
    confidence?: number
    time_begin?: number
    time_end?: number
  }>
  metadata?: {
    audio_duration?: number
  }
  error?: string
}

// Extract transcription text from any Gladia response format
function extractTranscriptionText(result: GladiaResponse): string | null {
  console.log('🔍 Extracting transcription from:', JSON.stringify(result, null, 2))
  
  const candidates = [
    result?.transcription?.full_transcript,
    result?.prediction?.[0]?.transcription,
    result?.transcription?.utterances?.map(u => u.text).filter(Boolean).join(' '),
  ]
  
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'string' && candidate.trim()) {
      const text = candidate.trim()
      console.log('✅ Found transcription:', text)
      return text
    }
  }
  
  console.log('❌ No transcription text found')
  return null
}

// Start transcription with Gladia
async function startGladiaTranscription(audioUrl: string): Promise<string> {
  const gladiaApiKey = process.env.GLADIA_API_KEY
  if (!gladiaApiKey) throw new Error('GLADIA_API_KEY not configured')

  console.log('🚀 Starting Gladia transcription...')
  
  const response = await fetch('https://api.gladia.io/v2/transcription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gladia-key': gladiaApiKey,
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gladia start error:', response.status, errorText)
    throw new Error(`Failed to start transcription: ${response.status}`)
  }

  const result = await response.json()
  console.log('✅ Gladia job started:', result.id)
  return result.id
}

// Check transcription status with Gladia
async function checkGladiaStatus(jobId: string): Promise<GladiaResponse> {
  const gladiaApiKey = process.env.GLADIA_API_KEY
  if (!gladiaApiKey) throw new Error('GLADIA_API_KEY not configured')

  console.log(`🔍 Checking Gladia status for job: ${jobId}`)
  
  const response = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
    headers: { 'x-gladia-key': gladiaApiKey },
  })

  if (!response.ok) {
    throw new Error(`Failed to check status: ${response.status}`)
  }

  const result = await response.json()
  console.log(`📊 Gladia response:`, JSON.stringify(result, null, 2))
  return result
}

// Poll until completion with exponential backoff
async function pollUntilComplete(jobId: string, maxWaitMs = 300000): Promise<string> {
  const startTime = Date.now()
  let attempt = 0
  
  while (Date.now() - startTime < maxWaitMs) {
    attempt++
    console.log(`⏳ Poll attempt ${attempt} for job ${jobId}`)
    
    const result = await checkGladiaStatus(jobId)
    
    // Try to extract transcription
    const transcription = extractTranscriptionText(result)
    if (transcription) {
      console.log(`✅ Transcription completed: "${transcription}"`)
      return transcription
    }
    
    // Check for errors
    if (result.status === 'error') {
      throw new Error(result.error || 'Transcription failed')
    }
    
    // Calculate next delay (exponential backoff: 1s, 2s, 4s, 8s, then 10s max)
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
    console.log(`⏱️ Waiting ${delay}ms before next check...`)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  
  throw new Error('Transcription timed out')
}

// Record usage for billing
async function recordUsage(userId: string, duration?: number) {
  const currentPeriodStart = new Date()
  currentPeriodStart.setDate(1)
  
  const currentPeriodEnd = new Date(currentPeriodStart)
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
  currentPeriodEnd.setDate(0)

  await supabaseAdmin.from('usage_tracking').insert({
    user_id: userId,
    feature_name: 'ai_interactions',
    usage_type: 'monthly_count',
    usage_count: 1,
    usage_metadata: {
      feature: 'audio_transcription',
      duration: duration || 0,
    },
    billing_period_start: currentPeriodStart.toISOString().split('T')[0],
    billing_period_end: currentPeriodEnd.toISOString().split('T')[0]
  })
}

export async function POST(request: Request) {
  try {
    console.log('🎯 Direct transcription API called')
    
    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const body = await request.json()
    const { evidence_file_id, audio_url } = body
    
    if (!evidence_file_id || !audio_url) {
      return NextResponse.json({ 
        error: 'Missing evidence_file_id or audio_url' 
      }, { status: 400 })
    }
    
    console.log(`📁 Processing file ${evidence_file_id} for user ${user.id}`)
    
    // Update status to processing
    await supabaseAdmin
      .from('evidence_files')
      .update({
        transcription_status: 'processing',
        processing_status: 'processing',
        metadata: {
          transcription_started_at: new Date().toISOString()
        }
      })
      .eq('id', evidence_file_id)
      .eq('user_id', user.id)
    
    // Start transcription
    const jobId = await startGladiaTranscription(audio_url)
    
    // Update with job ID
    await supabaseAdmin
      .from('evidence_files')
      .update({
        metadata: {
          transcription_job_id: jobId,
          transcription_started_at: new Date().toISOString()
        }
      })
      .eq('id', evidence_file_id)
    
    // Poll until complete (this is the key difference - we wait!)
    const transcription = await pollUntilComplete(jobId)
    
    // Update with completed transcription
    await supabaseAdmin
      .from('evidence_files')
      .update({
        transcription,
        transcription_status: 'completed',
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        metadata: {
          transcription_job_id: jobId,
          transcription_completed_at: new Date().toISOString()
        }
      })
      .eq('id', evidence_file_id)
    
    // Record usage
    await recordUsage(user.id)
    
    console.log(`🎉 Transcription completed successfully: "${transcription}"`)
    
    return NextResponse.json({
      success: true,
      transcription,
      job_id: jobId
    })
    
  } catch (error: any) {
    console.error('❌ Direct transcription error:', error)
    
    return NextResponse.json({
      error: error.message || 'Transcription failed'
    }, { status: 500 })
  }
}