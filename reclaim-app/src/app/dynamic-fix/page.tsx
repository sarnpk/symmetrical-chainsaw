'use client'

import React, { useState } from 'react'

export default function DynamicFixPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState('9bfc20b0-ae25-47e7-8589-19b20b93c7c3') // Latest stuck job
  const [evidenceFileId, setEvidenceFileId] = useState('02f23db8-4305-4912-b964-36d0bbbe3604') // Latest evidence file

  const dynamicFix = async () => {
    if (!jobId && !evidenceFileId) {
      alert('Please provide either Job ID or Evidence File ID')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log('🔧 DYNAMIC FIX: Using corrected Gladia v2 API structure')
      
      const response = await fetch('/api/fix-stuck-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId || undefined,
          evidence_file_id: evidenceFileId || undefined
        })
      })

      const data = await response.json()
      console.log('📊 Dynamic fix result:', data)
      setResult(data)
      
      if (data.success && data.status === 'completed') {
        alert(`🎉 FIXED!\n\nTranscription: "${data.transcription}"\n\nYour journal should now show this transcription!`)
      }
    } catch (err: any) {
      console.error('❌ Dynamic fix error:', err)
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const quickFixLatest = async () => {
    setJobId('9bfc20b0-ae25-47e7-8589-19b20b93c7c3')
    setEvidenceFileId('02f23db8-4305-4912-b964-36d0bbbe3604')
    
    // Wait a moment for state to update, then fix
    setTimeout(() => {
      dynamicFix()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔧 Dynamic Fix - Any Job ID</h1>
          
          {/* Quick Fix for Latest */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">🚨 Quick Fix Latest Stuck Job</h3>
            <p className="text-sm text-red-700 mb-3">
              Fix your latest stuck transcription immediately:
            </p>
            <div className="text-xs text-red-600 font-mono bg-red-100 p-2 rounded mb-3">
              Job ID: 9bfc20b0-ae25-47e7-8589-19b20b93c7c3<br/>
              Evidence File ID: 02f23db8-4305-4912-b964-36d0bbbe3604
            </div>
            <button
              onClick={quickFixLatest}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
            >
              🚨 Fix Latest Stuck Job
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
            onClick={dynamicFix}
            disabled={loading || (!jobId && !evidenceFileId)}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold mb-6"
          >
            {loading ? '🔧 Fixing...' : '🔧 Fix This Transcription'}
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
                <h3 className="font-semibold text-gray-800">Dynamic Fix Result:</h3>
                {result.test_mode && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    DYNAMIC FIX
                  </span>
                )}
              </div>
              
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto mb-4">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.transcription && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 SUCCESS! TRANSCRIPTION EXTRACTED:</h4>
                  <p className="text-green-700 text-lg font-mono bg-white p-3 rounded border">
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
            </div>
          )}

          {/* Root Cause Fix Needed */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Root Cause Fix Needed</h3>
            <p className="text-sm text-yellow-700 mb-2">
              The real problem is that <code>/api/evidence/transcribe/status</code> is not working properly. 
              This endpoint should automatically update the database when transcriptions complete.
            </p>
            <ul className="text-xs text-yellow-600 list-disc list-inside space-y-1">
              <li>Transcriptions complete successfully on Gladia</li>
              <li>But the status checking API doesn't update the database</li>
              <li>So the UI stays stuck on "processing"</li>
              <li>This fix tool works around the broken status checking</li>
            </ul>
            
            <div className="mt-3 p-2 bg-yellow-100 rounded">
              <strong>Permanent Solution:</strong> Fix the <code>/api/evidence/transcribe/status</code> endpoint to use the corrected Gladia v2 API structure.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}