'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square } from 'lucide-react'
import {
  createSpeechRecognition,
  ensureMicrophonePermission,
  releaseMicrophonePermission,
  micErrorMessage,
  isSpeechRecognitionSupported,
} from '@/lib/voice-recognition'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isActive?: boolean
  onError?: (message: string) => void
}

export default function VoiceInput({ onTranscript, isActive = true, onError }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported())

    const recognition = createSpeechRecognition()
    if (recognition) {
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        releaseMicrophonePermission()
      }

      recognition.onerror = (event: any) => {
        const msg = micErrorMessage(event)
        if (msg) {
          setError(msg)
          onError?.(msg)
        }
        setIsListening(false)
        releaseMicrophonePermission()
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      releaseMicrophonePermission()
    }
  }, [onTranscript, onError])

  const startListening = async () => {
    if (!recognitionRef.current || isListening) return
    setError('')

    const permission = await ensureMicrophonePermission()
    if (!permission.granted) {
      const msg = permission.error || 'Microphone permission is required.'
      setError(msg)
      onError?.(msg)
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      releaseMicrophonePermission()
    }
  }

  if (!isSupported || !isActive) return null

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={`p-2 rounded-lg transition-colors ${
        isListening 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={error || (isListening ? 'Stop recording' : 'Start voice input')}
    >
      {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  )
}