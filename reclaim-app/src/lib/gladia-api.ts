// Gladia API Integration for Audio Transcription
// Handles audio file transcription for evidence files

interface GladiaTranscriptionRequest {
  audio_url?: string
  audio?: File
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
    speaker?: string
    words?: Array<{
      word: string
      time_begin: number
      time_end: number
      confidence: number
    }>
  }[]
}

interface GladiaResult {
  transcription: string
  language: string
  confidence: number
  duration: number
  words?: Array<{
    word: string
    start_time: number
    end_time: number
    confidence: number
  }>
}

class GladiaAPI {
  private apiKey: string
  private baseUrl = 'https://api.gladia.io/v2'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Transcribe audio file using Gladia API
   */
  async transcribeAudio(
    audioFile: File, 
    options: Partial<GladiaTranscriptionRequest> = {}
  ): Promise<GladiaResult> {
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('language_behaviour', 'automatic single language')
      formData.append('output_format', 'json')
      
      const response = await fetch(`${this.baseUrl}/transcription/`, {
        method: 'POST',
        headers: {
          'x-gladia-key': this.apiKey,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        transcription: result.prediction?.[0]?.transcription || result.transcription || '',
        language: result.prediction?.[0]?.language || 'en',
        confidence: result.prediction?.[0]?.confidence || 0.8,
        duration: result.prediction?.[0]?.time_end - result.prediction?.[0]?.time_begin || 0
      }
    } catch (error) {
      console.error('Gladia transcription error:', error)
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }


}

// Export singleton instance
export const gladiaAPI = new GladiaAPI(process.env.GLADIA_API_KEY || '')

// Export types
export type { GladiaResult, GladiaTranscriptionRequest }

// Utility function for easy transcription
export async function transcribeAudioFile(
  audioFile: File,
  options?: {
    language?: string
    customVocabulary?: string[]
    transcriptionHint?: string
  }
): Promise<GladiaResult> {
  return gladiaAPI.transcribeAudio(audioFile, {
    language: options?.language,
    custom_vocabulary: options?.customVocabulary,
    transcription_hint: options?.transcriptionHint,
  })
}