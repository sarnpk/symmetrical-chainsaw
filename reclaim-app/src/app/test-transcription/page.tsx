'use client'

import React, { useState } from 'react'
import { TranscriptionExample } from '@/components/TranscriptionExample'
import { SimpleTranscriptionTest } from '@/components/SimpleTranscriptionTest'
import { AuthDebugger } from '@/components/AuthDebugger'

export default function TestTranscriptionPage() {
  const [activeTab, setActiveTab] = useState<'simple' | 'polling' | 'debug'>('simple')

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transcription Testing Tool
          </h1>
          <p className="text-gray-600">
            Test the transcription system APIs and polling functionality
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('simple')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple API Test
            </button>
            <button
              onClick={() => setActiveTab('polling')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'polling'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Polling System Test
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'simple' && <SimpleTranscriptionTest />}
        {activeTab === 'polling' && <TranscriptionExample />}
        
        {/* Additional debugging info */}
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <strong>API Endpoints:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li><code>/api/transcribe-simple</code> - Start transcription</li>
                <li><code>/api/transcribe-status</code> - Check status</li>
                <li><code>/functions/v1/transcribe-audio</code> - Edge function</li>
              </ul>
            </div>
            
            <div>
              <strong>Testing Steps:</strong>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                <li>Use "Simple API Test" to test individual API calls</li>
                <li>Use "Polling System Test" to test the full polling flow</li>
                <li>Check browser console for detailed logs</li>
                <li>Monitor network tab for API requests</li>
              </ol>
            </div>
            
            <div>
              <strong>Expected Flow:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Start transcription → Get job_id</li>
                <li>Poll status → "processing"</li>
                <li>Continue polling → "completed" + transcription</li>
                <li>Or get error if something fails</li>
              </ul>
            </div>
            
            <div>
              <strong>Common Issues:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>401 errors → Authentication problems</li>
                <li>404 errors → Job/file not found</li>
                <li>500 errors → Server/API issues</li>
                <li>Timeout → Long audio files or API delays</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Quick Test URLs:</h3>
            <div className="text-xs space-y-1">
              <div><strong>Short audio (5s):</strong> <code>https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav</code></div>
              <div><strong>Speech sample:</strong> <code>https://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0010_8k.wav</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}