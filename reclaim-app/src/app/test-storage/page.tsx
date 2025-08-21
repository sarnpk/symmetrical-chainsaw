'use client'

import React, { useState } from 'react'

export default function TestStoragePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [storagePath, setStoragePath] = useState('')

  const testSignedUrl = async () => {
    if (!storagePath) {
      alert('Please enter a storage path')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log('🔍 Testing signed URL access for:', storagePath)

      // Test creating signed URL
      const response = await fetch('/api/test-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_type: 'create_signed_url',
          storage_path: storagePath
        })
      })

      const data = await response.json()
      console.log('📊 Signed URL test result:', data)

      if (data.signed_url) {
        // Test if the signed URL is actually accessible
        console.log('🌐 Testing signed URL accessibility...')
        
        try {
          const urlResponse = await fetch(data.signed_url, { method: 'HEAD' })
          data.url_accessible = urlResponse.ok
          data.url_status = urlResponse.status
          data.url_headers = Object.fromEntries(urlResponse.headers.entries())
          console.log('📡 URL accessibility test:', {
            accessible: urlResponse.ok,
            status: urlResponse.status
          })
        } catch (urlError: any) {
          data.url_accessible = false
          data.url_error = urlError.message
          console.error('❌ URL accessibility error:', urlError)
        }
      }

      setResult(data)
    } catch (error: any) {
      console.error('❌ Storage test error:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGladiaAccess = async () => {
    if (!storagePath) {
      alert('Please enter a storage path')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log('🤖 Testing Gladia API access to signed URL...')

      const response = await fetch('/api/test-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_type: 'test_gladia_access',
          storage_path: storagePath
        })
      })

      const data = await response.json()
      console.log('📊 Gladia access test result:', data)
      setResult(data)
    } catch (error: any) {
      console.error('❌ Gladia access test error:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🗄️ Storage Access Test</h1>
          
          <p className="text-gray-600 mb-6">
            This page tests if Supabase signed URLs are accessible by external services like Gladia API.
          </p>

          {/* Storage Path Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Path (from evidence_files table)
            </label>
            <input
              type="text"
              value={storagePath}
              onChange={(e) => setStoragePath(e.target.value)}
              placeholder="e.g., user123/audio/filename.wav"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can find this in your evidence_files table in the storage_path column
            </p>
          </div>

          {/* Test Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={testSignedUrl}
              disabled={loading || !storagePath}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Signed URL'}
            </button>
            
            <button
              onClick={testGladiaAccess}
              disabled={loading || !storagePath}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Gladia Access'}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Testing storage access...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Test Results:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.signed_url && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-semibold text-blue-800 mb-2">Generated Signed URL:</h4>
                  <p className="text-xs text-blue-700 break-all">{result.signed_url}</p>
                  
                  {result.url_accessible !== undefined && (
                    <p className="mt-2 text-sm">
                      <strong>Accessible:</strong> 
                      <span className={result.url_accessible ? 'text-green-600' : 'text-red-600'}>
                        {result.url_accessible ? ' ✅ Yes' : ' ❌ No'}
                      </span>
                      {result.url_status && ` (Status: ${result.url_status})`}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">How to get a storage path:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Upload an audio file in your journal</li>
              <li>Check your Supabase database → evidence_files table</li>
              <li>Copy the storage_path value from a recent upload</li>
              <li>Paste it above and run the tests</li>
            </ol>
            
            <div className="mt-3">
              <strong>What the tests check:</strong>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                <li><strong>Signed URL Test:</strong> Can we create a signed URL and access it?</li>
                <li><strong>Gladia Access Test:</strong> Can Gladia API access the signed URL?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}