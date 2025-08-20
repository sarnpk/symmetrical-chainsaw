'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import type { EvidenceFile } from '@/lib/supabase'

interface AudioEvidenceCardProps {
  evidenceFiles: EvidenceFile[]
  evidenceUrls: {[key: string]: string}
}

export default function AudioEvidenceCard({ evidenceFiles, evidenceUrls }: AudioEvidenceCardProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [audioProgress, setAudioProgress] = useState<{[key: string]: number}>({})
  const [audioDuration, setAudioDuration] = useState<{[key: string]: number}>({})
  const [isMuted, setIsMuted] = useState<{[key: string]: boolean}>({})
  const audioRefs = useRef<{[key: string]: HTMLAudioElement}>({})
  
  const audioFiles = evidenceFiles.filter(file => file.file_type?.startsWith('audio'))
  
  if (audioFiles.length === 0) return null

  const togglePlayPause = (fileId: string) => {
    const audio = audioRefs.current[fileId]
    if (!audio) return

    if (playingAudio === fileId) {
      audio.pause()
      setPlayingAudio(null)
    } else {
      // Pause any currently playing audio
      if (playingAudio) {
        audioRefs.current[playingAudio]?.pause()
      }
      audio.play()
      setPlayingAudio(fileId)
    }
  }

  const toggleMute = (fileId: string) => {
    const audio = audioRefs.current[fileId]
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(prev => ({ ...prev, [fileId]: audio.muted }))
  }

  const handleTimeUpdate = (fileId: string) => {
    const audio = audioRefs.current[fileId]
    if (!audio) return

    const progress = (audio.currentTime / audio.duration) * 100
    setAudioProgress(prev => ({ ...prev, [fileId]: progress }))
  }

  const handleLoadedMetadata = (fileId: string) => {
    const audio = audioRefs.current[fileId]
    if (!audio) return

    setAudioDuration(prev => ({ ...prev, [fileId]: audio.duration }))
  }

  const handleSeek = (fileId: string, percentage: number) => {
    const audio = audioRefs.current[fileId]
    if (!audio) return

    const newTime = (percentage / 100) * audio.duration
    audio.currentTime = newTime
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          🎙️ Audio Evidence
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {audioFiles.length} audio {audioFiles.length === 1 ? 'recording' : 'recordings'} and transcriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {audioFiles.map((file) => (
          <div key={file.id} className="border border-gray-200 rounded-lg p-4">
            <div className="space-y-4">
              {/* Audio Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Audio Recording</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    📅 {new Date(file.uploaded_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Custom Audio Player */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current[file.id] = el
                  }}
                  src={evidenceUrls[file.id] || ''}
                  onTimeUpdate={() => handleTimeUpdate(file.id)}
                  onLoadedMetadata={() => handleLoadedMetadata(file.id)}
                  onEnded={() => setPlayingAudio(null)}
                  preload="metadata"
                />
                
                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlayPause(file.id)}
                    className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0"
                  >
                    {playingAudio === file.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const percentage = ((e.clientX - rect.left) / rect.width) * 100
                        handleSeek(file.id, percentage)
                      }}
                    >
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-100"
                        style={{ width: `${audioProgress[file.id] || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatTime((audioProgress[file.id] || 0) * (audioDuration[file.id] || 0) / 100)}</span>
                      <span>{formatTime(audioDuration[file.id] || 0)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleMute(file.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                  >
                    {isMuted[file.id] ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Caption */}
              {file.caption && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Caption:</p>
                  <p className="text-gray-700 text-sm">{file.caption}</p>
                </div>
              )}

              {/* Transcription Status */}
              <div className="flex items-center gap-2 text-xs">
                {file.transcription_status === 'completed' && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                )}
                {file.transcription_status === 'processing' && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Processing…</span>
                )}
                {file.transcription_status === 'failed' && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">Failed</span>
                )}
              </div>

              {/* Transcription */}
              {file.transcription && (
                <div className="mt-4">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs sm:text-sm text-indigo-800 flex-shrink-0">
                        You
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="inline-block bg-white border border-gray-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm text-sm text-gray-800 max-w-full whitespace-pre-wrap break-words">
                          {file.transcription}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(file.uploaded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}