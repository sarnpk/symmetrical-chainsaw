'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isActive?: boolean
}

export default function VoiceInput({ onTranscript, isActive = true }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        
        recognitionRef.current.onresult = (event: any) => {
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
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
        
        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }
      }
    }
  }, [onTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
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
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  )
}