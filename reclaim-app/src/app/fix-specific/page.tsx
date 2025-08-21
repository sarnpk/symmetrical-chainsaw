'use client'

import React, { useState } from 'react'

export default function FixSpecificPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fixSpecificJob = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔧 Fixing specific job: 497c4410-d286-421e-904e-32a262e6b05b')
      
      const response = await fetch('/api/fix-stuck-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: '497c4410-d286-421e-904e-32a262e6b05b'
        })
      })

      const data = await response.json()
      console.log('📊 Fix result:', data)
      setResult(data)
      
      if (data.success && data.status === 'completed') {
        alert(`✅ FIXED! Transcription: "${data.transcription}"`)
      } else if (data.status === 'extraction_failed') {
        alert(`⚠️ Gladia completed but extraction failed. Check the debug info below.`)
      }
    } catch (err: any) {
      console.error('❌ Fix error:', err)
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🎯 Fix Specific Job</h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Target Job:</h3>
            <p className="text-sm text-blue-700 font-mono">497c4410-d286-421e-904e-32a262e6b05b</p>
            <p className="text-xs text-blue-600 mt-1">
              This job shows "done" on Gladia with transcription: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
            </p>
          </div>

          <button
            onClick={fixSpecificJob}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-semibold mb-6"
          >
            {loading ? '🔧 Fixing...' : '🔧 Fix This Specific Job'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Using enhanced extraction logic...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Enhanced Fix Result:</h3>
                {result.test_mode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    V2 TEST MODE
                  </span>
                )}
              </div>
              
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto mb-4">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.transcription && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">✅ TRANSCRIPTION EXTRACTED:</h4>
                  <p className="text-green-700 text-lg font-mono">"{result.transcription}"</p>
                  
                  {result.fixed && (
                    <p className="text-sm text-green-600 mt-2">
                      🎉 Database updated! Your journal should now show this transcription.
                    </p>
                  )}
                </div>
              )}
              
              {result.status === 'extraction_failed' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ EXTRACTION FAILED</h4>
                  <p className="text-yellow-700 mb-2">
                    Gladia says the job is "done" but we couldn't extract the transcription text.
                  </p>
                  
                  {result.debug_info && (
                    <div className="text-xs text-yellow-600">
                      <strong>Debug Info:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Has transcription object: {result.debug_info.has_transcription_object ? '✅' : '❌'}</li>
                        <li>Has full_transcript: {result.debug_info.has_full_transcript ? '✅' : '❌'}</li>
                        <li>Full transcript value: "{result.debug_info.full_transcript_value}"</li>
                        <li>Has utterances: {result.debug_info.has_utterances ? '✅' : '❌'}</li>
                        <li>Utterances length: {result.debug_info.utterances_length}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Expected Gladia Response */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-800 mb-2">Expected Gladia Response:</h3>
            <pre className="text-xs text-green-700 whitespace-pre-wrap overflow-x-auto">
{`{
  "metadata": {
    "audio_duration": 5.06,
    "number_of_distinct_channels": 1,
    "billing_time": 5.06,
    "transcription_time": 9.431
  },
  "transcription": {
    "languages": ["en"],
    "utterances": [],
    "full_transcript": "1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
  }
}`}
            </pre>
            <p className="text-sm text-green-600 mt-2">
              The enhanced extraction should find the full_transcript: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}