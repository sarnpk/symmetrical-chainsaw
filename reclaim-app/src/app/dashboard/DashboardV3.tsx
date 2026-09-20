'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Plus, BookOpen, Brain, Shield, Heart, AlertTriangle, FileText,
  Sparkles, Users, TrendingUp, Anchor, HeartPulse, MessageSquare,
  Target, RefreshCw, Wind, Zap, Mic, BarChart3, ChevronRight,
  ArrowUpRight, ShieldAlert, HandHeart, Smile, Activity, Eye, Gauge, Compass, Search, Stethoscope, Timer, Sunrise, Waves
} from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'

interface DashboardV3Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

interface UsageData {
  ai_interactions: { current: number; limit: number; remaining: number }
  audio_transcription: { duration_minutes: number; minutes_limit: number; minutes_remaining: number }
  pattern_analysis: { current: number; limit: number; remaining: number }
}

const quickActions = [
  { name: 'Document', desc: 'Record an incident', href: '/journal/new', icon: Plus, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'AI Coach', desc: 'Get support now', href: '/ai-coach', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { name: 'Grey Rock', desc: 'Response templates', href: '/grey-rock', icon: FileText, color: 'bg-gray-100 text-gray-600' },
  { name: 'Crisis Help', desc: 'When you are spiraling', href: '/crisis-reframe', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
]

const toolGroups = [
  {
    label: 'Understand',
    tools: [
      { name: 'NPD Traits', href: '/npd-traits', icon: Target },
      { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare },
      { name: 'Patterns', href: '/patterns', icon: TrendingUp },
      { name: 'Letting Go', href: '/letting-go', icon: Wind },
      { name: 'Narcissist Detector', href: '/narcissist-detector', icon: Search },
      { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Compass },
      { name: 'Cognitive Dissonance', href: '/cognitive-dissonance', icon: Gauge },
      { name: 'Empathy Audit', href: '/empathy-audit', icon: Stethoscope },
      { name: 'Role Reframing', href: '/role-reframing', icon: RefreshCw },
      { name: 'Relationship Health', href: '/relationship-health-check', icon: HeartPulse },
    ],
  },
  {
    label: 'Heal',
    tools: [
      { name: 'Wellness', href: '/wellness', icon: HeartPulse },
      { name: 'Mind Reset', href: '/mind-reset', icon: Brain },
      { name: 'Belief Reframe', href: '/belief-reframe', icon: RefreshCw },
      { name: 'Affirmations', href: '/affirmations', icon: Sparkles },
      { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles },
      { name: 'Healing', href: '/healing', icon: Heart },
      { name: 'No Contact', href: '/no-contact-anchor', icon: Shield },
      { name: 'Acceptance', href: '/acceptance', icon: Smile },
      { name: 'Decompression', href: '/decompression', icon: Waves },
      { name: 'Mental Pause', href: '/mental-pause', icon: Timer },
      { name: 'Morning Intention', href: '/morning-intention', icon: Sunrise },
      { name: 'Urge Surfing', href: '/urge-surfing', icon: Wind },
    ],
  },
  {
    label: 'Document',
    tools: [
      { name: 'Journal', href: '/journal', icon: BookOpen },
      { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle },
      { name: 'Positive Moments', href: '/positive-moments', icon: Heart },
      { name: 'Reality Anchor', href: '/reality-log', icon: Anchor },
    ],
  },
  {
    label: 'Protect',
    tools: [
      { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare },
      { name: 'Stonewalling', href: '/stonewalling', icon: Shield },
      { name: 'Reactive Abuse', href: '/reactive-abuse', icon: AlertTriangle },
      { name: 'Boundary Builder', href: '/boundary-builder', icon: HandHeart },
      { name: 'Safety Plan', href: '/safety-plan', icon: Shield },
      { name: 'Gaslighting Tracker', href: '/gaslighting-tracker', icon: Eye },
      { name: 'Crisis Toolkit', href: '/crisis-toolkit', icon: Activity },
    ],
  },
  {
    label: 'Connect',
    tools: [
      { name: 'AI Coach', href: '/ai-coach', icon: Brain },
      { name: 'Community', href: '/community', icon: Users },
    ],
  },
]

  const tierLabels: Record<string, string> = {
  foundation: 'Foundation',
  recovery: 'Recovery',
  empowerment: 'Empowerment',
}

export default function DashboardV3({ user, profile, recentEntries }: DashboardV3Props) {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const supabase = createClient()
  const tier = profile?.subscription_tier || 'foundation'

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const res = await fetch('/api/usage/limits', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.ok) setUsage(data)
        }
      } catch (e) {
        console.error('Failed to load usage', e)
      }
    }
    loadUsage()
  }, [supabase])

  const formatLimit = (current: number, limit: number) => {
    if (limit === -1) return `${current} (Unlimited)`
    return `${current} / ${limit}`
  }

  return (
    <div className="space-y-4">
      {/* Welcome + Emergency */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {profile?.display_name || 'Friend'}
        </h1>
        <p className="text-xs text-gray-500">
          {recentEntries?.length || 0} journal entries saved
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-red-800">
          <strong className="text-red-900">911</strong> or <strong className="text-red-900">1-800-799-7233</strong>
        </span>
        <Link href="/safety-plan" className="text-xs font-medium text-red-600 hover:underline">
          Safety Plan
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2" data-tour="quick-actions">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer">
              <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">{action.name}</div>
                <div className="text-xs text-gray-500 truncate">{action.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Entries */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-900">Recent Entries</h2>
            <Link href="/journal" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-1.5">
            {recentEntries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <div className="p-2.5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{entry.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(entry.incident_date).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Current Plan & Usage */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-2">This month</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Plan Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Current Plan</div>
                <div className="text-xs text-gray-500">{tierLabels[tier] || 'Foundation'}</div>
              </div>
            </div>
            {tier !== 'empowerment' && (
              <Link
                href="/subscription"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ArrowUpRight className="h-3 w-3" />
                Upgrade
              </Link>
            )}
          </div>

          {/* Usage Cards */}
          {usage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {/* AI Interactions */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-700">AI Coach</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">This month</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatLimit(usage.ai_interactions.current, usage.ai_interactions.limit)}
                </div>
                {usage.ai_interactions.limit > 0 && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (usage.ai_interactions.current / usage.ai_interactions.limit) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Audio Transcription */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Mic className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-700">Audio Transcription</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">This month</div>
                <div className="text-sm font-semibold text-gray-900">
                  {usage.audio_transcription.minutes_limit === -1
                    ? `${usage.audio_transcription.duration_minutes} min (Unlimited)`
                    : `${usage.audio_transcription.duration_minutes} / ${usage.audio_transcription.minutes_limit} min`}
                </div>
                {usage.audio_transcription.minutes_limit > 0 && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (usage.audio_transcription.duration_minutes / usage.audio_transcription.minutes_limit) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Pattern Analysis */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-700">Pattern Analysis</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">This month</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatLimit(usage.pattern_analysis.current, usage.pattern_analysis.limit)}
                </div>
                {usage.pattern_analysis.limit > 0 && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (usage.pattern_analysis.current / usage.pattern_analysis.limit) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usage not loaded yet */}
          {!usage && (
            <div className="px-4 py-3 grid grid-cols-3 gap-4 animate-pulse">
              <div className="h-16 bg-gray-50 rounded" />
              <div className="h-16 bg-gray-50 rounded" />
              <div className="h-16 bg-gray-50 rounded" />
            </div>
          )}
        </div>
      </div>

      {/* All Tools - Categorized */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-2">All Tools</h2>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {toolGroups.map((group) => {
            const isExpanded = expandedGroup === group.label
            return (
              <div key={group.label}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{group.label}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 space-y-1">
                    {group.tools.map((tool) => (
                      <Link key={tool.href} href={tool.href}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <tool.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{tool.name}</span>
                          <ChevronRight className="h-3 w-3 text-gray-300 ml-auto" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
