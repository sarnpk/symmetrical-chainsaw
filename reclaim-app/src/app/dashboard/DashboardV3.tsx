'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Plus, BookOpen, Brain, Shield, Heart, AlertTriangle, FileText, Sparkles, Users, TrendingUp, Anchor, HeartPulse, MessageSquare, Target, RefreshCw, Wind } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'

interface DashboardV3Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

const tools = [
  { name: 'New Entry', href: '/journal/new', icon: Plus, color: 'indigo', desc: 'Document a new experience' },
  { name: 'Journal', href: '/journal', icon: BookOpen, color: 'blue', desc: 'View all your entries' },
  { name: 'AI Coach', href: '/ai-coach', icon: Brain, color: 'purple', desc: 'Get support and guidance' },
  { name: 'Wellness', href: '/wellness', icon: HeartPulse, color: 'pink', desc: 'Daily self-care & mood tracking' },
  { name: 'Belief Reframe', href: '/belief-reframe', icon: RefreshCw, color: 'green', desc: 'Challenge false beliefs' },
  { name: 'Positive Moments', href: '/positive-moments', icon: Heart, color: 'emerald', desc: 'Capture good experiences' },
  { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle, color: 'red', desc: 'Document abuse incidents' },
  { name: 'Reality Log', href: '/reality-log', icon: Anchor, color: 'teal', desc: 'Ground yourself in truth' },
  { name: 'No Contact', href: '/no-contact-anchor', icon: Shield, color: 'green', desc: 'Stay strong & grounded' },
  { name: 'Patterns', href: '/patterns', icon: TrendingUp, color: 'blue', desc: 'See recurring behaviors' },
  { name: 'Mind Reset', href: '/mind-reset', icon: Brain, color: 'cyan', desc: 'Reframe negative thoughts' },
  { name: 'Grey Rock', href: '/grey-rock-templates', icon: FileText, color: 'gray', desc: 'Response templates' },
  { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles, color: 'amber', desc: 'Find hope & perspective' },
  { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare, color: 'violet', desc: 'Understand tactics used' },
  { name: 'NPD Traits', href: '/npd-traits', icon: Target, color: 'rose', desc: 'Identify personality patterns' },
  { name: 'Community', href: '/community', icon: Users, color: 'indigo', desc: 'Connect with others' },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
}

export default function DashboardV3({ user, profile, recentEntries }: DashboardV3Props) {
  const [stats, setStats] = useState({ entries: 0 })
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
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.display_name || 'Friend'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Continue your healing journey. You&apos;re making progress.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-red-800">
          <strong className="text-red-900">911</strong> or <strong className="text-red-900">1-800-799-7233</strong>
        </span>
        <Link href="/safety-plan" className="text-xs font-medium text-red-600 hover:underline">
          Safety Plan
        </Link>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const colors = colorMap[tool.color] || colorMap.indigo
          return (
            <Link key={tool.href} href={tool.href}>
              <div className="flex flex-col items-center text-center p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group">
                <div className={`${colors.bg} w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className="text-sm font-semibold text-gray-900">{tool.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tool.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Entries */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
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
    </div>
  )
}
