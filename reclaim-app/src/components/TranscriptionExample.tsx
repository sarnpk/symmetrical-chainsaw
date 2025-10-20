import React, { useState } from 'react'
import { useTranscriptionPoller } from '@/hooks/useTranscriptionPoller'

interface TranscriptionExampleProps {
  evidenceFileId?: string
  jobId?: string
}

export function TranscriptionExample({ evidenceFileId, jobId }: TranscriptionExampleProps) {
  const [inputFileId, setInputFileId] = useState(evidenceFileId || '')
  const [inputJobId, setInputJobId] = useState(jobId || '')

  const {
    status,
    isPolling,
    transcription,
    error,
    startPolling,
    stopPolling
  } = useTranscriptionPoller({
    evidenceFileId: inputFileId,
    jobId: inputJobId,
    autoStart: false,
    maxAttempts: 60 // 10 minutes
  })

  const handleStart = () => {
    if (!inputFileId && !inputJobId) {
      alert('Please provide either an Evidence File ID or Job ID')
      return
    }
    startPolling()
  }

  const getStatusColor = () => {
    if (error) return 'text-red-600'
    if (transcription) return 'text-green-600'
    if (isPolling) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getStatusText = () => {
    if (error) return `Error: ${error}`
    if (transcription) return 'Completed'
    if (isPolling) return `Processing... (${status?.gladia_status || 'checking'})`
    return 'Ready'
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Transcription Status Checker</h2>
      
      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="fileId" className="block text-sm font-medium text-gray-700 mb-2">
            Evidence File ID
          </label>
          <input
            id="fileId"
            type="text"
            value={inputFileId}
            onChange={(e) => setInputFileId(e.target.value)}
            placeholder="Enter evidence file ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPolling}
          />
        </div>
        
        <div className="text-center text-gray-500">OR</div>
        
        <div>
          <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-2">
            Job ID
          </label>
          <input
            id="jobId"
            type="text"
            value={inputJobId}
            onChange={(e) => setInputJobId(e.target.value)}
            placeholder="Enter Gladia job ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPolling}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleStart}
          disabled={isPolling || (!inputFileId && !inputJobId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPolling ? 'Checking...' : 'Start Checking'}
        </button>
        
        <button
          onClick={stopPolling}
          disabled={!isPolling}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>

      {/* Status Display */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-medium">Status:</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {isPolling && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>
        
        {status && (
          <div className="text-sm text-gray-600">
            <div>Job ID: {status.job_id}</div>
            {status.language && <div>Language: {status.language}</div>}
            {status.gladia_status && <div>Gladia Status: {status.gladia_status}</div>}
          </div>
        )}
      </div>

      {/* Transcription Result */}
      {transcription && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-semibold text-green-800 mb-2">Transcription Result:</h3>
          <p className="text-green-700 whitespace-pre-wrap">{transcription}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-2">How to use:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Enter either an Evidence File ID or a Gladia Job ID</li>
          <li>Click "Start Checking" to begin polling the transcription status</li>
          <li>The system will automatically check every few seconds until completion</li>
          <li>Once completed, the transcription will appear below</li>
          <li>You can stop the polling at any time by clicking "Stop"</li>
        </ol>
      </div>
    </div>
  )
}