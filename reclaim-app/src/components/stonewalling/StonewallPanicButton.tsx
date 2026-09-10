'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, X } from 'lucide-react'

export default function StonewallPanicButton() {
  const [showGuidance, setShowGuidance] = useState(false)
  const [guidance, setGuidance] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const getHelp = async () => {
    setLoading(true)
    const response = await fetch('/api/stonewalling/real-time-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shutdown_type: 'silent_treatment',
        duration_so_far: 10,
        trigger: 'unknown',
        your_emotional_state: 7
      })
    })
    const data = await response.json()
    setGuidance(data)
    setShowGuidance(true)
    setLoading(false)
  }

  if (!showGuidance) {
    return (
      <button
        onClick={getHelp}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-red-700 flex items-center gap-2 z-50"
      >
        <AlertCircle className="h-5 w-5" />
        {loading ? 'Getting Help...' : "I'm Being Stonewalled"}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

            <button
              onClick={() => window.location.href = '/stonewalling/log'}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
            >
              Log This Incident
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
