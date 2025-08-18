'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import UsageTrackingDashboard from '@/components/UsageTrackingDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  Calendar, 
  Download,
  RefreshCw,
  Info
} from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

export default function UsagePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [usageHistory, setUsageHistory] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
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
      
      // Load usage history
      await loadUsageHistory(user.id)
      
      setLoading(false)
    }

    loadUserData()
  }, [router, supabase])

  const loadUsageHistory = async (userId: string) => {
    try {
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      setUsageHistory(usage || [])
    } catch (error) {
      console.error('Failed to load usage history:', error)
    }
  }

  const refreshUsage = async () => {
    if (!user) return
    
    setRefreshing(true)
    await loadUsageHistory(user.id)
    setRefreshing(false)
  }

  const exportUsageData = () => {
    if (!usageHistory.length) return

    const csvContent = [
      ['Date', 'Feature', 'Usage Count', 'Metadata'].join(','),
      ...usageHistory.map(record => [
        new Date(record.created_at).toLocaleDateString(),
        record.feature_name,
        record.usage_count,
        JSON.stringify(record.usage_metadata || {})
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `usage-data-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const subscriptionTier = profile.subscription_tier || 'foundation'

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto space-y-6 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usage & Billing</h1>
            <p className="text-gray-600 mt-1">Monitor your feature usage and subscription limits</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshUsage}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportUsageData}
              disabled={!usageHistory.length}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Usage Dashboard */}
        <UsageTrackingDashboard 
          userId={user.id} 
          subscriptionTier={subscriptionTier as 'foundation' | 'recovery' | 'empowerment'} 
        />

        {/* Usage History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Usage History
            </CardTitle>
            <CardDescription>
              Your recent feature usage activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usageHistory.length > 0 ? (
              <div className="space-y-3">
                {usageHistory.slice(0, 20).map((record, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.feature_name === 'ai_interactions' ? 'AI Interaction' : 
                           record.feature_name === 'journal_entries' ? 'Journal Entry' :
                           record.feature_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.usage_metadata?.feature && (
                            <span className="capitalize">{record.usage_metadata.feature.replace('_', ' ')} • </span>
                          )}
                          {new Date(record.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {record.usage_count} {record.usage_count === 1 ? 'use' : 'uses'}
                      </p>
                      {record.usage_metadata?.duration && (
                        <p className="text-sm text-gray-500">
                          {Math.round(record.usage_metadata.duration / 60)}min
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {usageHistory.length > 20 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Showing 20 of {usageHistory.length} records
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No usage history found</p>
                <p className="text-sm">Start using features to see your activity here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Subscription Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Foundation (Free)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5 AI interactions/month</li>
                  <li>• 5 audio transcriptions/month</li>
                  <li>• Basic journal features</li>
                  <li>• Community support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recovery ($9.99/month)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 100 AI interactions/month</li>
                  <li>• 30 audio transcriptions/month</li>
                  <li>• Enhanced emotional tracking</li>
                  <li>• Pattern analysis</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Empowerment ($19.99/month)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Unlimited AI interactions</li>
                  <li>• Unlimited audio transcriptions</li>
                  <li>• Complete evidence documentation</li>
                  <li>• Advanced pattern analysis</li>
                  <li>• Premium support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
