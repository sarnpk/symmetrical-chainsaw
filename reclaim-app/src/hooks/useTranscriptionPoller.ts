import { useState, useEffect, useCallback, useRef } from 'react'
import { TranscriptionPoller, TranscriptionStatus } from '@/lib/transcription-poller'

export interface UseTranscriptionPollerOptions {
  evidenceFileId?: string
  jobId?: string
  autoStart?: boolean
  maxAttempts?: number
}

export interface UseTranscriptionPollerReturn {
  status: TranscriptionStatus | null
  isPolling: boolean
  transcription: string | null
  error: string | null
  startPolling: () => void
  stopPolling: () => void
}

export function useTranscriptionPoller(
  options: UseTranscriptionPollerOptions
): UseTranscriptionPollerReturn {
  const [status, setStatus] = useState<TranscriptionStatus | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const pollerRef = useRef<TranscriptionPoller | null>(null)

  const startPolling = useCallback(() => {
    if (!options.evidenceFileId && !options.jobId) {
      setError('Missing evidenceFileId or jobId')
      return
    }

    if (pollerRef.current) {
      pollerRef.current.stop()
    }

    setIsPolling(true)
    setError(null)
    setTranscription(null)
    setStatus(null)

    pollerRef.current = new TranscriptionPoller({
      evidenceFileId: options.evidenceFileId,
      jobId: options.jobId,
      maxAttempts: options.maxAttempts,
      onStatusUpdate: (newStatus) => {
        console.log('📊 Transcription status update:', newStatus)
        setStatus(newStatus)
      },
      onComplete: (completedTranscription, language) => {
        console.log('✅ Transcription completed:', completedTranscription)
        setTranscription(completedTranscription)
        setIsPolling(false)
        setError(null)
      },
      onError: (errorMessage) => {
        console.error('❌ Transcription error:', errorMessage)
        setError(errorMessage)
        setIsPolling(false)
      }
    })

    pollerRef.current.start().catch((err) => {
      console.error('Failed to start polling:', err)
      setError(err.message)
      setIsPolling(false)
    })
  }, [options.evidenceFileId, options.jobId, options.maxAttempts])

  const stopPolling = useCallback(() => {
    if (pollerRef.current) {
      pollerRef.current.stop()
      pollerRef.current = null
    }
    setIsPolling(false)
  }, [])

  // Auto-start if requested
  useEffect(() => {
    if (options.autoStart && (options.evidenceFileId || options.jobId)) {
      startPolling()
    }

    // Cleanup on unmount
    return () => {
      if (pollerRef.current) {
        pollerRef.current.stop()
      }
    }
  }, [options.autoStart, options.evidenceFileId, options.jobId, startPolling])

  return {
    status,
    isPolling,
    transcription,
    error,
    startPolling,
    stopPolling
  }
}