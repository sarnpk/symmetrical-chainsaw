'use client'

import { useState } from 'react'
import { Upload, FileAudio, Loader2 } from 'lucide-react'

export default function TestGladiaPage() {
  const [file, setFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState('')
  const [speakers, setSpeakers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [showDebug, setShowDebug] = useState(false)
  const [debugData, setDebugData] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
      setTranscription('')
      setAudioUrl('')
    }
  }

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file')
      return
    }

    setLoading(true)
    setError('')
    setTranscription('')
    setSpeakers([])

    try {
      // Step 1: Upload file
      const formData = new FormData()
      formData.append('audio', file)

      const uploadResponse = await fetch('/api/test/gladia-upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      const uploadData = await uploadResponse.json()
      setAudioUrl(uploadData.audio_url)

      // Step 2: Start transcription (returns immediately with result_url)
      const startResponse = await fetch('/api/test/gladia-start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: uploadData.audio_url,
        }),
      })

      if (!startResponse.ok) {
        throw new Error('Failed to start transcription')
      }

      const startData = await startResponse.json()
      const resultUrl = startData.result_url

      // Step 3: Poll for results from client side
      let attempts = 0
      const maxAttempts = 90 // 3 minutes

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds

        const pollResponse = await fetch('/api/test/gladia-poll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            result_url: resultUrl,
          }),
        })

        if (!pollResponse.ok) {
          attempts++
          continue
        }

        const pollData = await pollResponse.json()

        if (pollData.status === 'done') {
          console.log('Transcription data:', pollData)
          setDebugData(pollData)
          
          setTranscription(pollData.transcription || 'No transcription received')
          setSpeakers(pollData.speakers || [])
          
          if (pollData.transcription && (!pollData.speakers || pollData.speakers.length === 0)) {
            setError('Transcription completed but speaker diarization data not available. Full transcription is shown below.')
          }
          break
        }

        if (pollData.status === 'error') {
          throw new Error('Transcription failed on Gladia servers')
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transcription timeout - file may be too large or processing is taking longer than expected')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gladia Transcription Test
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Audio File</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {file ? (
                <>
                  <FileAudio className="w-12 h-12 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload audio file
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP3, WAV, M4A, or other audio formats
                  </p>
                </>
              )}
            </label>
          </div>

          <button
            onClick={handleTranscribe}
            disabled={!file || loading}
            className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Transcribing...
              </>
            ) : (
              'Transcribe Audio'
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Audio URL Display */}
        {audioUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Uploaded Audio URL:
            </h3>
            <p className="text-xs text-blue-700 break-all">{audioUrl}</p>
          </div>
        )}

        {/* Speaker Analysis */}
        {speakers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Speaker Analysis</h2>
            <div className="space-y-4">
              {speakers.map((speaker, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-indigo-600">
                      {speaker.speaker}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      speaker.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      speaker.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {speaker.sentiment}
                    </span>
                    <span className="text-xs text-gray-500">
                      {speaker.start?.toFixed(1)}s - {speaker.end?.toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{speaker.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcription Display */}
        {transcription && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Full Transcription</h2>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Transcription will appear here..."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(transcription)
                  alert('Copied to clipboard!')
                }}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Data
              </button>
            </div>
          </div>
        )}

        {/* Debug Data */}
        {showDebug && debugData && (
          <div className="bg-gray-900 rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Debug: Raw API Response</h2>
            <pre className="text-xs text-green-400 overflow-auto max-h-96">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
