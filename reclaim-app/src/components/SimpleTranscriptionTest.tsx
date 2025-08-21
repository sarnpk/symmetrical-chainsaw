'use client'

import React, { useState } from 'react'

interface TranscriptionResult {
  success: boolean
  status: string
  transcription?: string
  job_id?: string
  language?: string
  error?: string
  gladia_status?: string
  test_mode?: boolean
}

export function SimpleTranscriptionTest() {
  const [evidenceFileId, setEvidenceFileId] = useState('')
  const [jobId, setJobId] = useState('')
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useTestEndpoint, setUseTestEndpoint] = useState(true)

  const testWithTestEndpoint = async (type: 'start' | 'status') => {
    if (type === 'start') {
      const audioUrl = prompt('Enter audio URL to test transcription:')
      if (!audioUrl) return

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('��� Testing with test endpoint - starting transcription')
        
        const response = await fetch('/api/test-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test_type: 'start_transcription',
            audio_url: audioUrl
          })
        })

        const data = await response.json()
        console.log('📊 Test API Response:', data)

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        setResult(data)
        if (data.job_id) {
          setJobId(data.job_id)
        }
      } catch (err: any) {
        console.error('❌ Test error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      if (!jobId) {
        setError('Please provide a Job ID to check status')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🧪 Testing with test endpoint - checking status')
        
        const response = await fetch('/api/test-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test_type: 'check_status',
            job_id: jobId
          })
        })

        const data = await response.json()
        console.log('📊 Test Status Response:', data)

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        setResult(data)
      } catch (err: any) {
        console.error('❌ Test status error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const getAuthToken = async (): Promise<string> => {
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
    return ''
  }

  const testWithAuthEndpoint = async (type: 'start' | 'status') => {
    if (type === 'start') {
      const audioUrl = prompt('Enter audio URL to test transcription:')
      if (!audioUrl) return

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🚀 Testing with auth endpoint - starting transcription')
        
        const token = await getAuthToken()
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch('/api/transcribe-simple', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audio_url: audioUrl,
            file_name: 'test-audio'
          })
        })

        const data = await response.json()
        console.log('📊 Auth API Response:', data)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in to your app first.')
          }
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        setResult(data)
        if (data.job_id) {
          setJobId(data.job_id)
        }
      } catch (err: any) {
        console.error('❌ Auth test error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      if (!evidenceFileId && !jobId) {
        setError('Please provide either Evidence File ID or Job ID')
        return
      }

      setLoading(true)
      setError('')
      setResult(null)

      try {
        console.log('🔍 Testing with auth endpoint - checking status')
        
        const token = await getAuthToken()
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch('/api/transcribe-status', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            evidence_file_id: evidenceFileId || undefined,
            job_id: jobId || undefined
          })
        })

        const data = await response.json()
        console.log('📊 Auth Status Response:', data)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in to your app first.')
          }
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        setResult(data)
      } catch (err: any) {
        console.error('❌ Auth status error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const testSimpleTranscription = async () => {
    if (useTestEndpoint) {
      await testWithTestEndpoint('start')
    } else {
      await testWithAuthEndpoint('start')
    }
  }

  const testStatusCheck = async () => {
    if (useTestEndpoint) {
      await testWithTestEndpoint('status')
    } else {
      await testWithAuthEndpoint('status')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Simple Transcription API Test</h2>
      
      {/* Endpoint Selection */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">Test Mode</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={useTestEndpoint}
              onChange={() => setUseTestEndpoint(true)}
              className="mr-2"
            />
            <span className="text-sm">Test Endpoint (No Auth Required)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useTestEndpoint}
              onChange={() => setUseTestEndpoint(false)}
              className="mr-2"
            />
            <span className="text-sm">Production Endpoint (Auth Required)</span>
          </label>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          {useTestEndpoint 
            ? '✅ Using test endpoint - no authentication needed' 
            : '⚠️ Using production endpoint - requires login'
          }
        </p>
      </div>

      {/* Test Simple Transcription */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Start New Transcription</h3>
        <p className="text-sm text-gray-600 mb-4">
          This will prompt for an audio URL and start a new transcription
        </p>
        
        <button
          onClick={testSimpleTranscription}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Starting...' : 'Start Transcription Test'}
        </button>
      </div>

      {/* Test Status Check */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Check Transcription Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {!useTestEndpoint && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence File ID
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
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job ID {useTestEndpoint && '(auto-filled from start test)'}
            </label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter Gladia job ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>
        
        <button
          onClick={testStatusCheck}
          disabled={loading || (!jobId && (!evidenceFileId || useTestEndpoint))}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Testing API...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
          {error.includes('Authentication required') && (
            <p className="text-sm text-red-600 mt-2">
              💡 Try switching to "Test Endpoint" mode above, or log in to your app first.
            </p>
          )}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">API Response:</h3>
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
              <h4 className="font-semibold text-green-800 mb-2">Transcription:</h4>
              <p className="text-green-700">{result.transcription}</p>
            </div>
          )}
          
          {result.job_id && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Job ID:</strong> {result.job_id}
                <br />
                <span className="text-xs">Use this ID to check status later</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li><strong>Start Transcription:</strong> Click the button and enter a public audio URL</li>
          <li><strong>Check Status:</strong> Use the job ID from step 1 to check transcription progress</li>
          <li>Check the browser console for detailed logs</li>
          <li>Switch between test and production endpoints to compare behavior</li>
        </ol>
        
        <div className="mt-3">
          <strong>Sample audio URLs for testing:</strong>
          <ul className="list-disc list-inside ml-4 text-xs space-y-1">
            <li><code>https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav</code></li>
            <li><code>https://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0010_8k.wav</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}