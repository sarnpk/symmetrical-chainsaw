'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PanicPage() {
  const [showGuidance, setShowGuidance] = useState(false)
  const [guidance, setGuidance] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState({
    shutdown_type: 'silent_treatment',
    duration_so_far: 10,
    trigger: '',
    your_emotional_state: 7
  })

  const getHelp = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stonewalling/real-time-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      })
      const data = await response.json()
      setGuidance(data)
      setShowGuidance(true)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  if (showGuidance && guidance) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-red-800">Real-Time Guidance</h2>
                <button onClick={() => setShowGuidance(false)} className="text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Immediate Actions</h3>
                  <ul className="list-disc list-inside space-y-1 text-red-800">
                    {guidance?.immediate_actions?.map((action: string, i: number) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">What to Say</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-800">
                    {guidance?.what_to_say?.map((phrase: string, i: number) => (
                      <li key={i}>{phrase}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Avoid Saying</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    {guidance?.what_not_to_say?.map((phrase: string, i: number) => (
                      <li key={i}>{phrase}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Self-Care Right Now</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    {guidance?.self_care_tips?.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Exit Strategy</h3>
                  <p className="text-purple-800">{guidance?.exit_strategy}</p>
                </div>

                <Link href="/stonewalling/log">
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
                    Log This Incident
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Stonewalling Emergency Help</h1>
              <p className="text-gray-600">Get immediate AI-powered guidance</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Shutdown
                </label>
                <select
                  value={context.shutdown_type}
                  onChange={(e) => setContext({ ...context, shutdown_type: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="silent_treatment">Silent Treatment</option>
                  <option value="physical_withdrawal">Physical Withdrawal</option>
                  <option value="topic_avoidance">Topic Avoidance</option>
                  <option value="emotional_unavailability">Emotional Unavailability</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long has this been going on? (minutes)
                </label>
                <input
                  type="number"
                  value={context.duration_so_far}
                  onChange={(e) => setContext({ ...context, duration_so_far: parseInt(e.target.value) })}
                  className="w-full p-3 border rounded-lg"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What triggered it? (optional)
                </label>
                <textarea
                  value={context.trigger}
                  onChange={(e) => setContext({ ...context, trigger: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="e.g., Asked about finances, mentioned therapy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your emotional state (1-10): {context.your_emotional_state}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={context.your_emotional_state}
                  onChange={(e) => setContext({ ...context, your_emotional_state: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calm</span>
                  <span>Distressed</span>
                </div>
              </div>

              <button
                onClick={getHelp}
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-2"
              >
                <AlertCircle className="h-6 w-6" />
                {loading ? 'Getting Help...' : 'Get Help Now'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
