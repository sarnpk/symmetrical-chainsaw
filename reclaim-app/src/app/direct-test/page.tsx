'use client'

import React from 'react'

export default function DirectTestPage() {
  const runDirectTest = async () => {
    console.log('🚨 DIRECT TEST - Starting...')
    
    try {
      console.log('🚨 Making fetch call to /api/test-transcribe')
      
      const response = await fetch('/api/test-transcribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test_type: 'start_transcription',
          audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
        })
      })
      
      console.log('🚨 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      const data = await response.json()
      console.log('🚨 Response data:', data)
      
      document.getElementById('result')!.innerHTML = `
        <h3>Direct Test Result:</h3>
        <p><strong>Status:</strong> ${response.status} ${response.statusText}</p>
        <p><strong>Success:</strong> ${data.success}</p>
        <p><strong>Job ID:</strong> ${data.job_id || 'None'}</p>
        <p><strong>Error:</strong> ${data.error || 'None'}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
      
    } catch (error: any) {
      console.error('🚨 DIRECT TEST - Error:', error)
      document.getElementById('result')!.innerHTML = `
        <h3>Direct Test Error:</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🚨 Direct API Test</h1>
          
          <p className="text-gray-600 mb-6">
            This page makes a direct fetch call to the test endpoint to bypass any component logic issues.
          </p>
          
          <button
            onClick={runDirectTest}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            🚨 Run Direct Test
          </button>
          
          <div id="result" className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[100px]">
            <p className="text-gray-500">Click the button above to run the test...</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What this test does:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Makes a POST request to <code>/api/test-transcribe</code></li>
              <li>• Uses test audio URL: <code>BabyElephantWalk60.wav</code></li>
              <li>• Should return a job_id if successful</li>
              <li>• Logs everything to browser console</li>
              <li>• Shows raw response data</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Expected Results:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Success:</strong> Status 200, success: true, job_id returned</li>
              <li>• <strong>API Key Missing:</strong> Status 500, error about GLADIA_API_KEY</li>
              <li>• <strong>Network Error:</strong> Fetch fails completely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}