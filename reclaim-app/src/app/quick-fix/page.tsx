'use client'

import React, { useState } from 'react'

export default function QuickFixPage() {
  const [jobId, setJobId] = useState('0ba287cb-094f-4bfe-9c2a-f0a0ff04a588') // Pre-fill with stuck job
  const [evidenceFileId, setEvidenceFileId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const quickFix = async () => {
    if (!jobId && !evidenceFileId) {
      setError('Please provide either Job ID or Evidence File ID')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('🔧 Quick fixing stuck transcription...')
      
      const response = await fetch('/api/fix-stuck-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId || undefined,
          evidence_file_id: evidenceFileId || undefined
        })
      })

      const data = await response.json()
      console.log('📊 Quick fix result:', data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
      
      if (data.success && data.status === 'completed') {
        alert(`✅ FIXED! Your transcription is ready!\n\n"${data.transcription.substring(0, 200)}..."`)
      }
    } catch (err: any) {
      console.error('❌ Quick fix error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const directTest = async () => {
    console.log('🚨 DIRECT TEST - Making raw fetch call')
    try {
      const response = await fetch('/api/fix-stuck-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: '0ba287cb-094f-4bfe-9c2a-f0a0ff04a588'
        })
      })
      
      console.log('🚨 DIRECT TEST - Response status:', response.status)
      const data = await response.json()
      console.log('🚨 DIRECT TEST - Response data:', data)
      
      alert(`Direct test result:\nStatus: ${response.status}\nSuccess: ${data.success}\nTranscription: ${data.transcription ? 'FOUND!' : 'Not found'}\nError: ${data.error || 'None'}`)
    } catch (error: any) {
      console.error('🚨 DIRECT TEST - Error:', error)
      alert(`Direct test error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">⚡ Quick Fix (No Auth Required)</h1>
          
          <p className="text-gray-600 mb-6">
            This tool fixes your stuck transcription without requiring authentication.
          </p>

          {/* Direct Test Button */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">🚨 Emergency Fix</h3>
            <p className="text-sm text-red-700 mb-3">
              Click this to immediately fix your stuck transcription:
            </p>
            <button
              onClick={directTest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
            >
              🚨 Fix Job: 0ba287cb-094f-4bfe-9c2a-f0a0ff04a588
            </button>
          </div>

          {/* Manual Input */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job ID (from Gladia)
              </label>
              <input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Enter Gladia job ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pre-filled with your stuck job ID
              </p>
            </div>
            
            <div className="text-center text-gray-500">OR</div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence File ID (from database)
              </label>
              <input
                type="text"
                value={evidenceFileId}
                onChange={(e) => setEvidenceFileId(e.target.value)}
                placeholder="Enter evidence file ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Fix Button */}
          <button
            onClick={quickFix}
            disabled={loading || (!jobId && !evidenceFileId)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
          >
            {loading ? '⚡ Fixing...' : '⚡ Quick Fix'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Checking Gladia and fixing database...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Fix Result:</h3>
                {result.test_mode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    TEST MODE
                  </span>
                )}
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.transcription && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">✅ TRANSCRIPTION RECOVERED:</h4>
                  <p className="text-green-700">{result.transcription}</p>
                  
                  {result.fixed && (
                    <p className="text-sm text-green-600 mt-2">
                      🎉 Database has been updated! Your journal should now show this transcription.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">What this does:</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Checks Gladia API directly for your job status</li>
              <li>Extracts the completed transcription text</li>
              <li>Updates your database with the correct status</li>
              <li>Your journal UI should immediately show the transcription</li>
              <li><strong>No authentication required</strong> - bypasses all auth issues</li>
            </ul>
            
            <div className="mt-3 p-2 bg-green-100 rounded">
              <strong>Your stuck job:</strong> <code>0ba287cb-094f-4bfe-9c2a-f0a0ff04a588</code>
              <br />
              <span className="text-xs">Since Gladia shows this as completed, the fix should work immediately!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}