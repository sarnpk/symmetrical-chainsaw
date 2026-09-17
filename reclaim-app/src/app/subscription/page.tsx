'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, CheckCircle2, ArrowUpRight, Zap, Shield, Brain, Heart, Users, HelpCircle } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

const TIERS = ['foundation', 'recovery', 'empowerment'] as const
type TierKey = typeof TIERS[number]

interface FeatureRow {
  name: string
  description: string
  category: string
  foundation: string | boolean
  recovery: string | boolean
  empowerment: string | boolean
}

const FEATURES: FeatureRow[] = [
  { name: 'Journal Entries', description: 'Document incidents with AI-powered titles and metadata', category: 'Core', foundation: '1/day', recovery: '15/day', empowerment: 'Unlimited' },
  { name: 'AI Coach Chats', description: '24/7 supportive chat that understands narcissistic abuse', category: 'Core', foundation: '2/day', recovery: '25/day', empowerment: '50/day' },
  { name: 'Pattern Analysis', description: 'AI detects recurring toxic behaviors across your entries', category: 'Core', foundation: '1/day', recovery: '10/day', empowerment: '30/day' },
  { name: 'Mind Reset Exercises', description: 'Guided exercises to break free from negative thought loops', category: 'Core', foundation: '1/day', recovery: '10/day', empowerment: 'Unlimited' },
  { name: 'Safety Plan', description: 'Emergency contacts, safe locations, and crisis checklist', category: 'Core', foundation: true, recovery: true, empowerment: true },
  { name: 'Grey Rock Practice', description: 'Practice emotionally unresponsive communication with AI', category: 'Protection', foundation: '1/day', recovery: '10/day', empowerment: '50/day' },
  { name: 'Grey Rock Templates', description: 'Pre-built responses for common manipulation tactics', category: 'Protection', foundation: '1/day', recovery: '15/day', empowerment: 'Unlimited' },
  { name: 'BIFF Assistant', description: 'Generate Brief, Informative, Firm, Friendly responses', category: 'Protection', foundation: '1/day', recovery: '10/day', empowerment: '50/day' },
  { name: 'Boundary Builder', description: 'Create and track personal boundaries with AI guidance', category: 'Protection', foundation: '5/mo', recovery: '25/mo', empowerment: 'Unlimited' },
  { name: 'Boundary Templates', description: 'Ready-made boundary scripts for emails, texts, and calls', category: 'Protection', foundation: false, recovery: true, empowerment: true },
  { name: 'Mood Check-ins', description: 'Track your emotional state over time', category: 'Wellness', foundation: false, recovery: true, empowerment: true },
  { name: 'Coping Strategies', description: 'AI-personalized coping techniques based on your mood', category: 'Wellness', foundation: false, recovery: '15/mo', empowerment: 'Unlimited' },
  { name: 'Wellness Tracking', description: 'Daily mood, sleep, and energy tracking with insights', category: 'Wellness', foundation: '1/day', recovery: '10/day', empowerment: 'Unlimited' },
  { name: 'Crisis Reframing', description: 'AI helps reframe spiraling thoughts when you feel overwhelmed', category: 'Wellness', foundation: '1/day', recovery: '15/day', empowerment: '50/day' },
  { name: 'Healing Sessions', description: 'Guided reflection exercises to process trauma', category: 'Wellness', foundation: '1/day', recovery: '5/day', empowerment: 'Unlimited' },
  { name: 'Narcissist Detector', description: 'Paste a message — AI checks for narcissistic traits', category: 'Analysis', foundation: '1/day', recovery: '5/day', empowerment: '30/day' },
  { name: 'Manipulation Decoder', description: 'Decode hidden manipulation tactics in conversations', category: 'Analysis', foundation: '1/day', recovery: '5/day', empowerment: '30/day' },
  { name: 'Gaslighting Tracker', description: 'Log and verify gaslighting incidents against your memory', category: 'Analysis', foundation: '1/day', recovery: '10/day', empowerment: '50/day' },
  { name: 'Relationship Health Check', description: 'AI-powered assessment of your relationship dynamics', category: 'Analysis', foundation: '1/week', recovery: '3/day', empowerment: 'Unlimited' },
  { name: 'Narcissist Simulator', description: 'Practice conversations with an AI simulating narcissistic behavior', category: 'Analysis', foundation: false, recovery: '3/day', empowerment: '10/day' },
  { name: 'File Storage', description: 'Upload evidence, audio recordings, and documents', category: 'Storage', foundation: '100 MB', recovery: '1 GB', empowerment: '5 GB' },
  { name: 'Audio Transcription', description: 'Convert voice recordings to text for documentation', category: 'Storage', foundation: false, recovery: '60 min/mo', empowerment: '300 min/mo' },
  { name: 'Priority Support', description: 'Get help when you need it most', category: 'Storage', foundation: false, recovery: 'Email', empowerment: '24/7 Chat' },
  { name: 'Export Data', description: 'Download your journal and data for court or therapy', category: 'Storage', foundation: '1/mo', recovery: '5/mo', empowerment: 'Unlimited' },
  { name: 'Early Access Features', description: 'Try new features before they launch', category: 'Storage', foundation: false, recovery: true, empowerment: true },
]

const CATEGORIES = [
  { key: 'Core', icon: Heart },
  { key: 'Protection', icon: Shield },
  { key: 'Wellness', icon: Brain },
  { key: 'Analysis', icon: Zap },
  { key: 'Storage', icon: Users },
]

const tierMeta: Record<TierKey, { accent: string; label: string }> = {
  foundation: { accent: 'green', label: 'Foundation (Free)' },
  recovery: { accent: 'brand', label: 'Recovery' },
  empowerment: { accent: 'hope', label: 'Empowered' },
}

const cellValue = (value: string | boolean) => {
  if (typeof value === 'boolean') {
    return value ? <CheckCircle2 className="h-4 w-4 text-success-600" /> : <span className="text-ink-300">—</span>
  }
  return <span className="text-sm font-medium">{value}</span>
}

export default function SubscriptionPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const handleUpgrade = async (tier: string) => {
    setUpgrading(tier)
    window.location.href = '/pricing'
  }

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
      setLoading(false)
    }
    run()
  }, [supabase])

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const currentTier = (profile.subscription_tier as TierKey) || 'foundation'

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
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

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => {
            const meta = tierMeta[tier]
            const isCurrent = tier === currentTier
            return (
              <Card key={tier} className={isCurrent ? 'border-2 border-purple-500 ring-1 ring-purple-200' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{meta.label}</span>
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Current
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <ArrowUpRight className="h-3 w-3" /> Switch
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {CATEGORIES.map(({ key: cat, icon: Icon }) => {
                    const catFeatures = FEATURES.filter(f => f.category === cat)
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                          <Icon className="h-3.5 w-3.5" />
                          {cat}
                        </div>
                        <div className="space-y-1">
                          {catFeatures.map((f) => (
                            <div key={f.name} className="flex items-center justify-between text-sm group relative">
                              <span className="text-gray-600 truncate flex items-center gap-1">
                                {f.name}
                                <HelpCircle className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
                              </span>
                              <span className="font-medium text-gray-900 ml-2 whitespace-nowrap">{cellValue(f[tier])}</span>
                              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-50">
                                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-56 shadow-lg">
                                  {f.description}
                                  <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {!isCurrent && tier !== 'foundation' && (
                    <button
                      onClick={() => handleUpgrade(tier)}
                      disabled={upgrading === tier}
                      className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {upgrading === tier ? 'Loading...' : tier === 'recovery' ? 'Upgrade to Recovery' : 'Upgrade to Empowered'}
                    </button>
                  )}
                  {isCurrent && tier !== 'foundation' && (
                    <button disabled className="w-full mt-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg font-semibold cursor-not-allowed">
                      Current Plan
                    </button>
                  )}
                  {tier === 'foundation' && !isCurrent && (
                    <button
                      onClick={() => handleUpgrade('foundation')}
                      className="w-full mt-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Start Free
                    </button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Full feature comparison table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Full Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Feature</th>
                    {TIERS.map((t) => (
                      <th key={t} className={`text-center py-2 px-3 font-semibold ${t === currentTier ? 'text-purple-700' : 'text-gray-700'}`}>
                        {tierMeta[t].label}
                        {t === currentTier && <span className="block text-[10px] text-purple-500 font-normal">Current</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map(({ key: cat, icon: Icon }) => (
                    <>
                      <tr key={`cat-${cat}`}>
                        <td colSpan={4} className="pt-4 pb-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <Icon className="h-3.5 w-3.5" />
                            {cat}
                          </div>
                        </td>
                      </tr>
                      {FEATURES.filter(f => f.category === cat).map((f) => (
                        <tr key={f.name} className="border-b border-gray-100 hover:bg-gray-50 group">
                          <td className="py-2 pr-4 text-gray-700">
                            <div className="flex items-center gap-1.5">
                              {f.name}
                              <div className="relative">
                                <HelpCircle className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
                                <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-50">
                                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-56 shadow-lg">
                                    {f.description}
                                    <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          {TIERS.map((t) => (
                            <td key={t} className={`py-2 px-3 text-center ${t === currentTier ? 'bg-purple-50/30' : ''}`}>
                              {cellValue(f[t])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-500">All daily limits reset at midnight UTC. &quot;Unlimited&quot; features are subject to a fair use policy.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
