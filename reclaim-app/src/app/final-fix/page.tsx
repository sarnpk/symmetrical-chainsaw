'use client'

import React, { useState } from 'react'

export default function FinalFixPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const finalFix = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔧 FINAL FIX: Using corrected Gladia v2 API structure')
      
      const response = await fetch('/api/fix-stuck-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: '497c4410-d286-421e-904e-32a262e6b05b'
        })
      })

      const data = await response.json()
      console.log('📊 Final fix result:', data)
      setResult(data)
      
      if (data.success && data.status === 'completed') {
        alert(`🎉 FINALLY FIXED!\n\nTranscription: "${data.transcription}"\n\nYour journal should now show this transcription!`)
      }
    } catch (err: any) {
      console.error('❌ Final fix error:', err)
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🎯 FINAL FIX - Corrected API Structure</h1>
          
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🔍 Issue Found:</h3>
            <p className="text-sm text-green-700 mb-2">
              The transcription is in <code>result.result.transcription.full_transcript</code> but the extraction logic was looking at <code>result.transcription.full_transcript</code>
            </p>
            <div className="text-xs text-green-600 font-mono bg-green-100 p-2 rounded">
              Expected: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
            </div>
          </div>

          <button
            onClick={finalFix}
            disabled={loading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold mb-6"
          >
            {loading ? '🔧 Applying Final Fix...' : '🎯 FINAL FIX - Extract from Correct Path'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Using corrected Gladia v2 API structure...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Final Fix Result:</h3>
                {result.test_mode && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    FINAL FIX
                  </span>
                )}
              </div>
              
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto mb-4">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.transcription && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 SUCCESS! TRANSCRIPTION EXTRACTED:</h4>
                  <p className="text-green-700 text-xl font-mono bg-white p-3 rounded border">
                    "{result.transcription}"
                  </p>
                  
                  {result.fixed && (
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <p className="text-sm text-green-600 font-semibold">
                        ✅ Database Updated Successfully!
                      </p>
                      <p className="text-xs text-green-600">
                        Your journal should now show this transcription instead of "processing"
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {result.status === 'extraction_failed' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-semibold text-red-800 mb-2">❌ STILL FAILED</h4>
                  <p className="text-red-700 mb-2">
                    Even with the corrected path, extraction failed. This suggests a deeper issue.
                  </p>
                  
                  {result.extraction_debug && (
                    <div className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2">
                      <strong>Extraction Debug:</strong>
                      <pre className="mt-1">{JSON.stringify(result.extraction_debug, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Technical Details */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 What This Fix Does:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Corrected Path:</strong> Looks at <code>result.result.transcription.full_transcript</code></li>
              <li>• <strong>Fallback Paths:</strong> Also checks <code>result.result.transcription.utterances</code></li>
              <li>• <strong>Legacy Support:</strong> Still supports old API formats</li>
              <li>• <strong>Detailed Logging:</strong> Shows exactly what paths are checked</li>
              <li>• <strong>Database Update:</strong> Updates your evidence_files table on success</li>
            </ul>
            
            <div className="mt-3 p-2 bg-blue-100 rounded">
              <strong>Expected Result:</strong> <code>"1, 2, 3, 4, 5, 6, 7, 8, 9, 10."</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}