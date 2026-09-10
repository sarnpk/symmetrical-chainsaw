'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Alert {
  id: string
  alert_type: string
  severity: string
  source_1_type: string
  source_1_text: string
  source_1_date: string
  source_2_type: string
  source_2_text: string
  source_2_date: string
  conflict_summary: string
}

export default function CognitiveDissonanceWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    const res = await fetch('/api/cognitive-dissonance/alerts')
    const data = await res.json()
    setAlerts(data.alerts || [])
    setLoading(false)
  }

  const handleDismiss = async (id: string) => {
    await fetch('/api/cognitive-dissonance/alerts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_dismissed: true })
    })
    setAlerts(alerts.filter(a => a.id !== id))
    toast.success('Alert dismissed')
  }

  const handleResolve = async (id: string) => {
    await fetch('/api/cognitive-dissonance/alerts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_resolved: true })
    })
    setAlerts(alerts.filter(a => a.id !== id))
    toast.success('Conflict resolved')
  }

  if (loading || alerts.length === 0) return null

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900">Cognitive Dissonance Detected</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.slice(0, 2).map((alert) => (
          <div key={alert.id} className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs px-2 py-1 rounded ${
                alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {alert.severity} severity
              </span>
              <button onClick={() => handleDismiss(alert.id)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm font-medium text-amber-900 mb-3">{alert.conflict_summary}</p>

            <div className="space-y-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <span className="font-semibold text-blue-900">{new Date(alert.source_1_date).toLocaleDateString()}</span>
                <p className="text-blue-800 mt-1">{alert.source_1_text.substring(0, 100)}...</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <span className="font-semibold text-purple-900">{new Date(alert.source_2_date).toLocaleDateString()}</span>
                <p className="text-purple-800 mt-1">{alert.source_2_text.substring(0, 100)}...</p>
              </div>
            </div>

            <button
              onClick={() => handleResolve(alert.id)}
              className="mt-3 w-full text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Mark as Resolved
            </button>
          </div>
        ))}
        {alerts.length > 2 && (
          <p className="text-xs text-amber-700 text-center">+{alerts.length - 2} more conflicts detected</p>
        )}
      </CardContent>
    </Card>
  )
}
