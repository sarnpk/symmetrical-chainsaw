'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Plus, BookOpen, Brain, Shield, Heart, MessageSquare, AlertTriangle, FileText, Sparkles, ChevronDown, ChevronRight, Users, TrendingUp, Anchor } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'

interface DashboardV3Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

const quickActions = [
  { name: 'Document', href: '/journal/new', icon: Plus, color: 'indigo', desc: 'Record an incident' },
  { name: 'AI Coach', href: '/ai-coach', icon: Brain, color: 'purple', desc: 'Get support now' },
  { name: 'Grey Rock', href: '/grey-rock-templates', icon: FileText, color: 'gray', desc: 'Response templates' },
  { name: 'Crisis Help', href: '/crisis-reframe', icon: AlertTriangle, color: 'red', desc: 'When you are spiraling' },
]

const allTools = [
  { section: 'Document', items: [
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Reality Anchor', href: '/reality-log', icon: Anchor },
    { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle },
    { name: 'Patterns', href: '/patterns', icon: TrendingUp },
  ]},
  { section: 'Protect', items: [
    { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare },
    { name: 'Stonewalling', href: '/stonewalling', icon: Shield },
    { name: 'Reactive Abuse', href: '/reactive-abuse', icon: Shield },
  ]},
  { section: 'Heal', items: [
    { name: 'Wellness', href: '/wellness', icon: Heart },
    { name: 'Mind Reset', href: '/mind-reset', icon: Brain },
    { name: 'Belief Reframe', href: '/belief-reframe', icon: Sparkles },
    { name: 'Affirmations', href: '/affirmations', icon: Sparkles },
    { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles },
    { name: 'Healing', href: '/healing', icon: Heart },
    { name: 'No Contact', href: '/no-contact-anchor', icon: Shield },
    { name: 'Acceptance', href: '/acceptance', icon: Heart },
  ]},
  { section: 'Understand', items: [
    { name: 'Narcissist Detector', href: '/narcissist-detector', icon: AlertTriangle },
    { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Brain },
    { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare },
    { name: 'Relationship Health', href: '/relationship-health', icon: Heart },
    { name: 'NPD Traits', href: '/npd-traits', icon: TrendingUp },
    { name: 'Gaslighting Tracker', href: '/gaslighting-tracker', icon: AlertTriangle },
  ]},
  { section: 'Community', items: [
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Safety Plan', href: '/safety-plan', icon: Shield },
  ]},
]

export default function DashboardV3({ user, profile, recentEntries }: DashboardV3Props) {
  const [stats, setStats] = useState({ entries: 0 })
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setStats({ entries: count || 0 })
    }
    load()
  }, [user.id, supabase])

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-5 pb-10">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.display_name || 'Friend'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {stats.entries} journal {stats.entries === 1 ? 'entry' : 'entries'} saved
        </p>
      </div>

      {/* Emergency */}
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-red-800">
          <strong className="text-red-900">911</strong> or <strong className="text-red-900">1-800-799-7233</strong>
        </span>
        <Link href="/safety-plan" className="text-xs font-medium text-red-600 hover:underline">
          Safety Plan
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer">
              <div className={`bg-${action.color}-100 p-2 rounded-lg`}>
                <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{action.name}</div>
                <div className="text-xs text-gray-500">{action.desc}</div>
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
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
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

      {/* All Tools */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-2">All Tools</h2>
        <div className="space-y-1.5">
          {allTools.map((group) => (
            <div key={group.section} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <button
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedSection(expandedSection === group.section ? null : group.section)}
              >
                <span className="text-sm font-medium text-gray-900">{group.section}</span>
                {expandedSection === group.section
                  ? <ChevronDown className="h-4 w-4 text-gray-400" />
                  : <ChevronRight className="h-4 w-4 text-gray-400" />
                }
              </button>
              {expandedSection === group.section && (
                <div className="px-4 pb-3 pt-1 grid grid-cols-2 gap-1">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                        <item.icon className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
