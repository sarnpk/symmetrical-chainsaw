/**
 * Client-side transcription polling utility
 * Handles checking transcription status and updating UI accordingly
 */

export interface TranscriptionStatus {
  success: boolean
  status: 'processing' | 'completed' | 'failed'
  transcription?: string
  job_id?: string
  language?: string
  error?: string
  gladia_status?: string
}

export interface TranscriptionPollerOptions {
  evidenceFileId?: string
  jobId?: string
  onStatusUpdate?: (status: TranscriptionStatus) => void
  onComplete?: (transcription: string, language?: string) => void
  onError?: (error: string) => void
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
}

export class TranscriptionPoller {
  private options: Required<TranscriptionPollerOptions>
  private attempts = 0
  private timeoutId: NodeJS.Timeout | null = null
  private isPolling = false

  constructor(options: TranscriptionPollerOptions) {
    this.options = {
      evidenceFileId: options.evidenceFileId || '',
      jobId: options.jobId || '',
      onStatusUpdate: options.onStatusUpdate || (() => {}),
      onComplete: options.onComplete || (() => {}),
      onError: options.onError || (() => {}),
      maxAttempts: options.maxAttempts || 60, // 10 minutes with 10s intervals
      initialDelay: options.initialDelay || 2000, // Start with 2s
      maxDelay: options.maxDelay || 10000 // Max 10s between polls
    }
  }

  async start(): Promise<void> {
    if (this.isPolling) {
      console.warn('TranscriptionPoller: Already polling')
      return
    }

    if (!this.options.evidenceFileId && !this.options.jobId) {
      this.options.onError('Missing evidenceFileId or jobId')
      return
    }

    console.log('🚀 Starting transcription polling', {
      evidenceFileId: this.options.evidenceFileId,
      jobId: this.options.jobId
    })

    this.isPolling = true
    this.attempts = 0
    await this.poll()
  }

  stop(): void {
    console.log('🛑 Stopping transcription polling')
    this.isPolling = false
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private async poll(): Promise<void> {
    if (!this.isPolling) return

    this.attempts++
    console.log(`🔍 Transcription poll attempt ${this.attempts}/${this.options.maxAttempts}`)

    try {
      const response = await fetch('/api/transcribe-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          evidence_file_id: this.options.evidenceFileId,
          job_id: this.options.jobId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const status: TranscriptionStatus = await response.json()
      console.log('📊 Transcription status:', status)

      // Notify status update
      this.options.onStatusUpdate(status)

      if (status.status === 'completed' && status.transcription) {
        console.log('✅ Transcription completed:', status.transcription)
        this.isPolling = false
        this.options.onComplete(status.transcription, status.language)
        return
      }

      if (status.status === 'failed') {
        console.error('❌ Transcription failed:', status.error)
        this.isPolling = false
        this.options.onError(status.error || 'Transcription failed')
        return
      }

      // Still processing - schedule next poll
      if (this.attempts >= this.options.maxAttempts) {
        console.error('❌ Transcription polling timed out')
        this.isPolling = false
        this.options.onError('Transcription timed out after maximum attempts')
        return
      }

      // Calculate next delay with exponential backoff
      const delay = Math.min(
        this.options.initialDelay * Math.pow(1.5, Math.min(this.attempts - 1, 5)),
        this.options.maxDelay
      )

      console.log(`⏱️ Scheduling next poll in ${delay}ms`)
      this.timeoutId = setTimeout(() => this.poll(), delay)

    } catch (error: any) {
      console.error('❌ Transcription poll error:', error)
      
      // Retry on network errors, but not on auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        this.isPolling = false
        this.options.onError('Authentication error')
        return
      }

      if (this.attempts >= this.options.maxAttempts) {
        this.isPolling = false
        this.options.onError(`Polling failed after ${this.options.maxAttempts} attempts: ${error.message}`)
        return
      }

      // Retry with longer delay on error
      const delay = Math.min(this.options.initialDelay * 2, this.options.maxDelay)
      console.log(`⏱️ Retrying poll in ${delay}ms after error`)
      this.timeoutId = setTimeout(() => this.poll(), delay)
    }
  }

  private async getAuthToken(): Promise<string> {
    // Try to get token from various sources
    if (typeof window !== 'undefined') {
      // Method 1: Try global supabase instance
      const supabase = (window as any).supabase
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            return session.access_token
          }
        } catch (error) {
          console.warn('Failed to get session from global supabase:', error)
        }
      }
      
      // Method 2: Try to import and create supabase client
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey)
          const { data: { session } } = await client.auth.getSession()
          if (session?.access_token) {
            return session.access_token
          }
        }
      } catch (error) {
        console.warn('Failed to create supabase client:', error)
      }
      
      // Method 3: Try localStorage (common pattern)
      try {
        const authData = localStorage.getItem('supabase.auth.token')
        if (authData) {
          const parsed = JSON.parse(authData)
          if (parsed.access_token) {
            return parsed.access_token
          }
        }
      } catch (error) {
        console.warn('Failed to get token from localStorage:', error)
      }
    }
    
    // Fallback - return empty string and let the API handle the error
    console.warn('Unable to get auth token, API will return 401')
    return ''
  }
}

// Convenience function for simple usage
export async function pollTranscriptionStatus(
  evidenceFileId: string,
  onComplete: (transcription: string) => void,
  onError: (error: string) => void,
  onStatusUpdate?: (status: TranscriptionStatus) => void
): Promise<TranscriptionPoller> {
  const poller = new TranscriptionPoller({
    evidenceFileId,
    onComplete,
    onError,
    onStatusUpdate
  })
  
  await poller.start()
  return poller
}