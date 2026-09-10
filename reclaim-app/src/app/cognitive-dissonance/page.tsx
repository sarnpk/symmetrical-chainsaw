'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, X, CheckCircle, RefreshCw, Loader } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function CognitiveDissonancePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [detecting, setDetecting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      await loadAlerts()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const loadAlerts = async () => {
    const res = await fetch('/api/cognitive-dissonance/alerts')
    const data = await res.json()
    setAlerts(data.alerts || [])
  }

  const handleDetect = async () => {
    setDetecting(true)
    try {
      const res = await fetch('/api/cognitive-dissonance/detect', { method: 'POST' })
      const data = await res.json()
      if (data.detected > 0) {
        toast.success(`Detected ${data.detected} new conflicts`)
        await loadAlerts()
      } else {
        toast.success('No new conflicts detected')
      }
    } catch (error) {
      toast.error('Detection failed')
    } finally {
      setDetecting(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cognitive Dissonance Alerts</h1>
            <p className="text-gray-600 mt-2">Detect conflicting beliefs across your journals</p>
          </div>
          <button
            onClick={handleDetect}
            disabled={detecting}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 disabled:opacity-50"
          >
            {detecting ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            {detecting ? 'Detecting...' : 'Scan for Conflicts'}
          </button>
        </div>

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">What is Cognitive Dissonance?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-amber-800">
            <p>Cognitive dissonance occurs when you hold two conflicting beliefs simultaneously, causing mental discomfort.</p>
            <p className="font-medium">Examples in abuse recovery:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>"I'm worthless" vs "I deserve respect"</li>
              <li>"They never said that" vs your clear memory of them saying it</li>
              <li>"I'm too sensitive" vs "My feelings are valid"</li>
            </ul>
            <p className="mt-3">This tool scans your journals to detect these conflicts and help you resolve them.</p>
          </CardContent>
        </Card>

        {alerts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conflicts detected</h3>
              <p className="text-gray-600 mb-6">
                Click "Scan for Conflicts" to analyze your recent journal entries
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.severity} severity
                      </span>
                    </div>
                    <button onClick={() => handleDismiss(alert.id)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-amber-900 mb-4">{alert.conflict_summary}</h3>

                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-blue-900 uppercase">{alert.source_1_type}</span>
                        <span className="text-xs text-blue-700">{new Date(alert.source_1_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-blue-900">{alert.source_1_text}</p>
                    </div>

                    <div className="text-center text-amber-600 font-semibold">âš ï¸ CONFLICTS WITH âš ï¸</div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-purple-900 uppercase">{alert.source_2_type}</span>
                        <span className="text-xs text-purple-700">{new Date(alert.source_2_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-purple-900">{alert.source_2_text}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Resolved
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
