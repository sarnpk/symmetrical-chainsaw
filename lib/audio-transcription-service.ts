// Audio Transcription Service
// Integrates Gladia API with Supabase for evidence file transcription

import { supabase } from './supabase'
import { transcribeAudioFile, transcribeAudioFromUrl, type GladiaResult } from './gladia-api'
import { recordFeatureUsage, checkFeatureLimit } from './supabase'

interface TranscriptionJob {
  evidenceFileId: string
  userId: string
  audioFile?: File
  audioUrl?: string
  options?: {
    language?: string
    customVocabulary?: string[]
    transcriptionHint?: string
  }
}

interface TranscriptionResult {
  success: boolean
  transcription?: string
  language?: string
  confidence?: number
  duration?: number
  error?: string
  words?: Array<{
    word: string
    start_time: number
    end_time: number
    confidence: number
  }>
}

class AudioTranscriptionService {
  /**
   * Process audio transcription for evidence file
   */
  async processAudioTranscription(job: TranscriptionJob): Promise<TranscriptionResult> {
    try {
      // Check if user has transcription quota available
      const canTranscribe = await checkFeatureLimit(job.userId, 'ai_interactions')
      if (!canTranscribe) {
        return {
          success: false,
          error: 'Transcription limit reached for your subscription tier'
        }
      }

      // Update evidence file status to processing
      await this.updateEvidenceFileStatus(job.evidenceFileId, 'processing')

      let gladiaResult: GladiaResult

      // Transcribe using appropriate method
      if (job.audioFile) {
        gladiaResult = await transcribeAudioFile(job.audioFile, job.options)
      } else if (job.audioUrl) {
        gladiaResult = await transcribeAudioFromUrl(job.audioUrl, job.options)
      } else {
        throw new Error('No audio file or URL provided')
      }

      // Update evidence file with transcription results
      await this.updateEvidenceFileWithTranscription(job.evidenceFileId, gladiaResult)

      // Record usage for billing
      await recordFeatureUsage(job.userId, 'ai_interactions', 'monthly_count', 1, {
        feature: 'audio_transcription',
        duration: gladiaResult.duration,
        language: gladiaResult.language,
        confidence: gladiaResult.confidence
      })

      return {
        success: true,
        transcription: gladiaResult.transcription,
        language: gladiaResult.language,
        confidence: gladiaResult.confidence,
        duration: gladiaResult.duration,
        words: gladiaResult.words
      }

    } catch (error) {
      console.error('Transcription processing error:', error)
      
      // Update evidence file status to failed
      await this.updateEvidenceFileStatus(job.evidenceFileId, 'failed', error instanceof Error ? error.message : 'Unknown error')

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed'
      }
    }
  }

  /**
   * Batch process multiple audio files
   */
  async processBatchTranscription(jobs: TranscriptionJob[]): Promise<TranscriptionResult[]> {
    const results: TranscriptionResult[] = []

    // Process jobs sequentially to avoid rate limiting
    for (const job of jobs) {
      const result = await this.processAudioTranscription(job)
      results.push(result)

      // Add delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return results
  }

  /**
   * Get transcription status for evidence file
   */
  async getTranscriptionStatus(evidenceFileId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    transcription?: string
    error?: string
    progress?: number
  }> {
    try {
      const { data: evidenceFile, error } = await supabase
        .from('evidence_files')
        .select('transcription_status, transcription, processing_status, metadata')
        .eq('id', evidenceFileId)
        .single()

      if (error) throw error

      return {
        status: evidenceFile.transcription_status || 'pending',
        transcription: evidenceFile.transcription,
        error: evidenceFile.metadata?.transcription_error,
        progress: evidenceFile.metadata?.transcription_progress
      }
    } catch (error) {
      console.error('Failed to get transcription status:', error)
      return {
        status: 'failed',
        error: 'Failed to get status'
      }
    }
  }

  /**
   * Retry failed transcription
   */
  async retryTranscription(evidenceFileId: string, userId: string): Promise<TranscriptionResult> {
    try {
      // Get evidence file details
      const { data: evidenceFile, error } = await supabase
        .from('evidence_files')
        .select('*')
        .eq('id', evidenceFileId)
        .single()

      if (error) throw error

      // Generate signed URL for audio file
      const { data: signedUrlData } = await supabase.storage
        .from(evidenceFile.storage_bucket)
        .createSignedUrl(evidenceFile.storage_path, 3600) // 1 hour

      if (!signedUrlData?.signedUrl) {
        throw new Error('Failed to generate audio URL')
      }

      // Process transcription
      return await this.processAudioTranscription({
        evidenceFileId,
        userId,
        audioUrl: signedUrlData.signedUrl,
        options: {
          language: evidenceFile.metadata?.preferred_language,
          transcriptionHint: evidenceFile.metadata?.transcription_hint
        }
      })
    } catch (error) {
      console.error('Retry transcription error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Retry failed'
      }
    }
  }

  /**
   * Update evidence file transcription status
   */
  private async updateEvidenceFileStatus(
    evidenceFileId: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    const updates: any = {
      transcription_status: status,
      processing_status: status,
      updated_at: new Date().toISOString()
    }

    if (status === 'processing') {
      updates.metadata = {
        transcription_started_at: new Date().toISOString()
      }
    }

    if (status === 'failed' && error) {
      updates.metadata = {
        transcription_error: error,
        transcription_failed_at: new Date().toISOString()
      }
    }

    if (status === 'completed') {
      updates.processed_at = new Date().toISOString()
    }

    await supabase
      .from('evidence_files')
      .update(updates)
      .eq('id', evidenceFileId)
  }

  /**
   * Update evidence file with transcription results
   */
  private async updateEvidenceFileWithTranscription(
    evidenceFileId: string,
    result: GladiaResult
  ): Promise<void> {
    const updates = {
      transcription: result.transcription,
      transcription_status: 'completed' as const,
      processing_status: 'completed' as const,
      processed_at: new Date().toISOString(),
      metadata: {
        transcription_language: result.language,
        transcription_confidence: result.confidence,
        transcription_duration: result.duration,
        transcription_completed_at: new Date().toISOString(),
        word_timestamps: result.words
      }
    }

    await supabase
      .from('evidence_files')
      .update(updates)
      .eq('id', evidenceFileId)
  }

  /**
   * Get user's transcription usage stats
   */
  async getTranscriptionUsage(userId: string): Promise<{
    monthly_transcriptions: number
    monthly_limit: number
    remaining: number
    total_duration: number
  }> {
    try {
      // Get current month usage
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('usage_count, usage_metadata')
        .eq('user_id', userId)
        .eq('feature_name', 'ai_interactions')
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-32`)

      const monthlyTranscriptions = usage?.reduce((sum, record) => {
        return record.usage_metadata?.feature === 'audio_transcription' ? sum + record.usage_count : sum
      }, 0) || 0

      const totalDuration = usage?.reduce((sum, record) => {
        return record.usage_metadata?.feature === 'audio_transcription' 
          ? sum + (record.usage_metadata?.duration || 0) 
          : sum
      }, 0) || 0

      // Get user's limit (this would come from their subscription tier)
      const { data: profile } = await supabase
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
      const remaining = monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - monthlyTranscriptions)

      return {
        monthly_transcriptions: monthlyTranscriptions,
        monthly_limit: monthlyLimit,
        remaining,
        total_duration: totalDuration
      }
    } catch (error) {
      console.error('Failed to get transcription usage:', error)
      return {
        monthly_transcriptions: 0,
        monthly_limit: 10,
        remaining: 10,
        total_duration: 0
      }
    }
  }
}

// Export singleton instance
export const audioTranscriptionService = new AudioTranscriptionService()

// Export types
export type { TranscriptionJob, TranscriptionResult }
