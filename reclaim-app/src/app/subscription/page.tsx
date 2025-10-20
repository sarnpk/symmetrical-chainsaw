'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

const TIERS = ['foundation', 'recovery', 'empowerment'] as const

type TierKey = typeof TIERS[number]

interface TierLimitsResponse {
  tiers: Record<TierKey, Record<string, number>>
}

export default function SubscriptionPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [limits, setLimits] = useState<TierLimitsResponse['tiers'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/'
        return
      }
      setUser(user)

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      const { data: sessionRes } = await supabase.auth.getSession()
      const token = sessionRes?.session?.access_token
      if (token) {
        const res = await fetch('/api/subscription/tiers', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const json: TierLimitsResponse = await res.json()
          setLimits(json.tiers)
        }
      }
      setLoading(false)
    }
    run()
  }, [supabase])

  // Shared formatters
  const present = (n: number, formatter?: (n: number) => string) => {
    if (n === -1) return 'Unlimited'
    if (n === 0) return 'Not available'
    return formatter ? formatter(n) : String(n)
  }
  const withPerMonth = (n: number, formatter?: (n: number) => string) => {
    const base = present(n, formatter)
    if (base === 'Unlimited' || base === 'Not available') return base
    return `${base}/mo`
  }

  const FeatureRow = ({ name, k, formatter }: { name: string; k: string; formatter?: (n: number) => string }) => {
    const fmt = (n: number) => present(n, formatter)
    return (
      <div className="grid grid-cols-4 gap-4 py-2 text-sm">
        <div className="text-gray-700">{name}</div>
        {TIERS.map((t) => (
          <div key={t} className="text-gray-900">
            {limits ? fmt(limits[t as TierKey][k] ?? -1) : '—'}
          </div>
        ))}
      </div>
    )
  }

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const currentTier = (profile.subscription_tier as TierKey) || 'foundation'

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between px-4 md:px-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" /> Subscription
            </h1>
            <p className="text-gray-600 mt-1">Choose the plan that fits your journey. Change anytime.</p>
          </div>
          <div className="text-sm text-gray-700">
            Current plan: <span className="font-medium capitalize">{currentTier}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-0">
          {TIERS.map((tier) => (
            <Card key={tier} className={tier === currentTier ? 'border-2 border-purple-500' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{tier}</span>
                  {tier === currentTier ? (
                    <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
                      <CheckCircle2 className="h-3 w-3" /> Current
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <ArrowUpRight className="h-3 w-3" /> Switch
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {tier === 'foundation' && 'Starter tools to begin your recovery'}
                  {tier === 'recovery' && 'Advanced features for steady progress'}
                  {tier === 'empowerment' && 'Everything unlocked, no limits'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>AI Coach: <strong>{limits ? withPerMonth(limits[tier]['ai_interactions:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Patterns: <strong>{limits ? withPerMonth(limits[tier]['pattern_analysis:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Journal entries: <strong>{limits ? withPerMonth(limits[tier]['journal_entries:monthly_count'] ?? -1) : '—'}</strong>
                    {tier === 'foundation' && (
                      <span className="ml-2 text-xs text-gray-600">(Basic fields)</span>
                    )}
                  </div>
                  <div>Mind Reset: <strong>{limits ? withPerMonth(limits[tier]['mind_reset_sessions:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Boundary Builder: <strong>{limits ? withPerMonth(limits[tier]['boundary_builder:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Grey Rock: <strong>{limits ? withPerMonth(limits[tier]['grey_rock_messages:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Community posts: <strong>{limits ? withPerMonth(limits[tier]['community_posts:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Wellness: <strong>{limits ? withPerMonth(limits[tier]['wellness:monthly_count'] ?? -1) : '—'}</strong></div>
                  <div>Transcription minutes: <strong>{limits ? withPerMonth(limits[tier]['transcription_minutes:minutes'] ?? -1) : '—'}</strong></div>
                  <div>Evidence storage: <strong>{limits ? present(limits[tier]['storage:storage_mb'] ?? -1, (n) => `${n} MB`) : '—'}</strong></div>
                </div>
                {/* Future: add upgrade/downgrade buttons wired to billing provider */}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="px-4 md:px-0">
          <CardHeader>
            <CardTitle>Feature comparison</CardTitle>
            <CardDescription>Live from your Supabase feature limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-xs uppercase tracking-wide text-gray-500 pb-2 border-b">
              <div>Feature</div>
              {TIERS.map((t) => (
                <div key={t} className="capitalize">{t}</div>
              ))}
            </div>
            <FeatureRow name="AI Coach interactions (mo)" k="ai_interactions:monthly_count" />
            <FeatureRow name="Patterns (mo)" k="pattern_analysis:monthly_count" />
            <FeatureRow name="Journal entries (mo)" k="journal_entries:monthly_count" />
            <FeatureRow name="Mind Reset sessions (mo)" k="mind_reset_sessions:monthly_count" />
            <FeatureRow name="Boundary Builder (mo)" k="boundary_builder:monthly_count" />
            <FeatureRow name="Grey Rock messages (mo)" k="grey_rock_messages:monthly_count" />
            <FeatureRow name="Community posts (mo)" k="community_posts:monthly_count" />
            <FeatureRow name="Wellness (mo)" k="wellness:monthly_count" />
            <FeatureRow name="Transcription minutes (mo)" k="transcription_minutes:minutes" />
            <FeatureRow name="Evidence storage" k="storage:storage_mb" formatter={(n) => `${n} MB`} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
