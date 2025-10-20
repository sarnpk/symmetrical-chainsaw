'use client'

import React, { useState } from 'react'

export default function FixTranscriptionPage() {
  const [evidenceFileId, setEvidenceFileId] = useState('')
  const [jobId, setJobId] = useState('0ba287cb-094f-4bfe-9c2a-f0a0ff04a588') // Pre-fill with your stuck job
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fixStuckTranscription = async () => {
    if (!evidenceFileId && !jobId) {
      setError('Please provide either Evidence File ID or Job ID')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('🔧 Fixing stuck transcription...')
      
      // Get auth token (you'll need to implement this based on your auth system)
      const token = await getAuthToken()
      
      const response = await fetch('/api/fix-stuck-transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          evidence_file_id: evidenceFileId || undefined,
          job_id: jobId || undefined
        })
      })

      const data = await response.json()
      console.log('📊 Fix result:', data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
      
      if (data.success && data.status === 'completed') {
        alert(`✅ Fixed! Transcription: "${data.transcription.substring(0, 100)}..."`)
      }
    } catch (err: any) {
      console.error('❌ Fix error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getAuthToken = async (): Promise<string> => {
    // Try to get token from Supabase
    if (typeof window !== 'undefined') {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey)
          const { data: { session } } = await client.auth.getSession()
          if (session?.access_token) {
            return session.access_token
          }
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error)
      }
    }
    throw new Error('Unable to get auth token - please log in')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔧 Fix Stuck Transcription</h1>
          
          <p className="text-gray-600 mb-6">
            This tool fixes transcriptions that are stuck on "processing" by checking Gladia directly and updating the database.
          </p>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
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
            
            <div className="text-center text-gray-500">OR</div>
            
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
                Pre-filled with your stuck job ID: 0ba287cb-094f-4bfe-9c2a-f0a0ff04a588
              </p>
            </div>
          </div>

          {/* Fix Button */}
          <button
            onClick={fixStuckTranscription}
            disabled={loading || (!evidenceFileId && !jobId)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '🔧 Fixing...' : '🔧 Fix Stuck Transcription'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Checking Gladia and fixing database...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Fix Result:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.transcription && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Fixed! Transcription:</h4>
                  <p className="text-green-700">{result.transcription}</p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Checks the Gladia API directly for the job status</li>
              <li>If completed, extracts the transcription text</li>
              <li>Updates your database with the completed transcription</li>
              <li>Your UI should immediately show the transcription</li>
            </ol>
            
            <div className="mt-3">
              <strong>Your stuck job ID:</strong> <code>0ba287cb-094f-4bfe-9c2a-f0a0ff04a588</code>
              <br />
              <span className="text-xs">This should work immediately since Gladia shows it as completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}