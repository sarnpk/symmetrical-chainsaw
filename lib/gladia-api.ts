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
      // Step 1: Upload audio file
      const uploadResponse = await this.uploadAudio(audioFile)
      
      // Step 2: Start transcription
      const transcriptionResponse = await this.startTranscription(uploadResponse.audio_url, options)
      
      // Step 3: Poll for results
      const result = await this.pollForResults(transcriptionResponse.id)
      
      return this.formatResult(result)
    } catch (error) {
      console.error('Gladia transcription error:', error)
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Transcribe audio from URL
   */
  async transcribeFromUrl(
    audioUrl: string,
    options: Partial<GladiaTranscriptionRequest> = {}
  ): Promise<GladiaResult> {
    try {
      // Start transcription directly with URL
      const transcriptionResponse = await this.startTranscription(audioUrl, options)
      
      // Poll for results
      const result = await this.pollForResults(transcriptionResponse.id)
      
      return this.formatResult(result)
    } catch (error) {
      console.error('Gladia transcription error:', error)
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Upload audio file to Gladia
   */
  private async uploadAudio(audioFile: File): Promise<{ audio_url: string }> {
    const formData = new FormData()
    formData.append('audio', audioFile)

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'x-gladia-key': this.apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Start transcription process
   */
  private async startTranscription(
    audioUrl: string,
    options: Partial<GladiaTranscriptionRequest>
  ): Promise<{ id: string }> {
    const requestBody: GladiaTranscriptionRequest = {
      audio_url: audioUrl,
      language_behaviour: 'automatic single language',
      detect_language: true,
      enable_code_switching: false,
      ...options,
    }

    const response = await fetch(`${this.baseUrl}/transcription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': this.apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Transcription request failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Poll for transcription results
   */
  private async pollForResults(transcriptionId: string): Promise<GladiaTranscriptionResponse> {
    const maxAttempts = 60 // 5 minutes max (5 second intervals)
    let attempts = 0

    while (attempts < maxAttempts) {
      const response = await fetch(`${this.baseUrl}/transcription/${transcriptionId}`, {
        headers: {
          'x-gladia-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get transcription status: ${response.statusText}`)
      }

      const result: GladiaTranscriptionResponse = await response.json()

      if (result.status === 'done') {
        return result
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

  /**
   * Format Gladia response to our standard format
   */
  private formatResult(response: GladiaTranscriptionResponse): GladiaResult {
    if (!response.prediction || response.prediction.length === 0) {
      throw new Error('No transcription result available')
    }

    const prediction = response.prediction[0]
    
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

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        headers: {
          'x-gladia-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get languages: ${response.statusText}`)
      }

      const data = await response.json()
      return data.languages || []
    } catch (error) {
      console.error('Failed to get supported languages:', error)
      return ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'] // Fallback
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

export async function transcribeAudioFromUrl(
  audioUrl: string,
  options?: {
    language?: string
    customVocabulary?: string[]
    transcriptionHint?: string
  }
): Promise<GladiaResult> {
  return gladiaAPI.transcribeFromUrl(audioUrl, {
    language: options?.language,
    custom_vocabulary: options?.customVocabulary,
    transcription_hint: options?.transcriptionHint,
  })
}
