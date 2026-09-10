'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import { Plus, BookOpen, Brain, Shield, Heart, Anchor, MessageSquare, AlertTriangle, Target, FileText, RotateCcw, HeartHandshake, Flame, TrendingUp, ChevronDown, ChevronUp, Sparkles, Wind, X, Waves } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'
import MoodCheckIn from '@/components/MoodCheckIn'

const CrisisReframeWidget = dynamic(() => import('@/components/CrisisReframeWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})
const HopeReframeWidget = dynamic(() => import('@/components/HopeReframeWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})
const CognitiveDissonanceWidget = dynamic(() => import('@/components/CognitiveDissonanceWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})
const NoContactWidget = dynamic(() => import('@/components/NoContactWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})
const NarcissistDetectorWidget = dynamic(() => import('@/components/NarcissistDetectorWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})
const NarcissistSimulatorWidget = dynamic(() => import('@/components/NarcissistSimulatorWidget'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
})

interface DashboardV3Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

export default function DashboardV3({ user, profile, recentEntries }: DashboardV3Props) {
  const [stats, setStats] = useState({ streak: 0, entries: 0 })
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showSafetyBanner, setShowSafetyBanner] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { count } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setStats({
        streak: 0,
        entries: count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const categories = [
    {
      id: 'journaling',
      name: 'Documentation',
      items: [
        { name: 'Document', href: '/journal/new', icon: Plus, color: 'indigo', featured: true, priority: 3 },
        { name: 'Experiences', href: '/journal', icon: BookOpen, color: 'blue' },
        { name: 'Reality Anchor', href: '/reality-log', icon: Anchor, color: 'teal' },
        { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle, color: 'red' },
        { name: 'Letting Go', href: '/letting-go', icon: Wind, color: 'sky', featured: true, priority: 6 },
        { name: 'Urge Surfing', href: '/urge-surfing', icon: Waves, color: 'blue', featured: true, priority: 7 },
        { name: 'Patterns', href: '/patterns', icon: TrendingUp, color: 'indigo' }
      ]
    },
    {
      id: 'protection',
      name: 'Protection',
      items: [
        { name: 'Grey Rock', href: '/grey-rock-templates', icon: FileText, color: 'gray', featured: true, priority: 4 },
        { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare, color: 'indigo' },
        { name: 'Stonewalling', href: '/stonewalling', icon: Shield, color: 'slate' },
        { name: 'Reactive Abuse', href: '/reactive-abuse', icon: RotateCcw, color: 'purple' }
      ]
    },
    {
      id: 'wellness',
      name: 'Wellness & Recovery',
      items: [
        { name: 'Wellness', href: '/wellness', icon: Heart, color: 'pink', featured: true, priority: 1 },
        { name: 'Crisis Reframe', href: '/crisis-reframe', icon: AlertTriangle, color: 'red', featured: true, priority: 2 },
        { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles, color: 'amber', featured: true, priority: 3 },
        { name: 'Healing', href: '/healing', icon: Sparkles, color: 'purple', featured: true, priority: 5 },
        { name: 'Mind Reset', href: '/mind-reset', icon: Brain, color: 'purple', featured: true, priority: 6 },
        { name: 'Belief Reframe', href: '/belief-reframe', icon: Brain, color: 'green' },
        { name: 'Affirmations', href: '/affirmations', icon: Sparkles, color: 'yellow' },
        { name: 'Positive Moments', href: '/positive-moments', icon: Heart, color: 'pink' },
        { name: 'No Contact Anchor', href: '/no-contact-anchor', icon: Shield, color: 'emerald' },
        { name: 'Acceptance', href: '/acceptance', icon: Heart, color: 'green' },
        { name: 'Role Reframing', href: '/role-reframing', icon: RotateCcw, color: 'blue' }
      ]
    },
    {
      id: 'analysis',
      name: 'Analysis & Understanding',
      items: [
        { name: 'Narcissist Detector', href: '/narcissist-detector', icon: AlertTriangle, color: 'red', featured: true, priority: 7 },
        { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Target, color: 'purple', featured: true, priority: 8 },
        { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare, color: 'green' },
        { name: 'Relationship Health', href: '/relationship-health', icon: Heart, color: 'pink' },
        { name: 'NPD Traits', href: '/npd-traits', icon: Target, color: 'orange' },
        { name: 'Gaslighting Tracker', href: '/gaslighting-tracker', icon: AlertTriangle, color: 'red' },
        { name: 'Empathy Audit', href: '/empathy-audit', icon: HeartHandshake, color: 'blue' }
      ]
    },
    {
      id: 'support',
      name: 'Support & Guidance',
      items: [
        { name: 'AI Coach', href: '/ai-coach', icon: Brain, color: 'purple', featured: true, priority: 9 },
        { name: 'Safety Plan', href: '/safety-plan', icon: Shield, color: 'red' },
        { name: 'Community', href: '/community', icon: Heart, color: 'blue' }
      ]
    },
    {
      id: 'account',
      name: 'Settings',
      items: [
        { name: 'Usage', href: '/usage', icon: TrendingUp, color: 'gray' },
        { name: 'Subscription', href: '/subscription', icon: Sparkles, color: 'purple' },
        { name: 'Account', href: '/account', icon: Shield, color: 'gray' }
      ]
    }
  ]

  const featuredTools = categories
    .flatMap(cat => cat.items.filter(item => item.featured))
    .sort((a, b) => (a.priority || 99) - (b.priority || 99))

  return (
    <div className="space-y-4 pt-4">
      {/* Professional Support + Safety - combined compact banner */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-green-900">Need professional support?</span>
          <div className="flex gap-2">
            <button onClick={() => window.open('https://www.psychology-today.com/us/therapists', '_blank')} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">Therapist</button>
            <button onClick={() => window.open('https://www.avvo.com/find-a-lawyer', '_blank')} className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-700">Legal</button>
          </div>
        </div>
        {showSafetyBanner && (
          <div className="flex-1 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center justify-between gap-2">
            <span className="text-sm text-red-800"><strong className="text-red-900">911</strong> or <strong className="text-red-900">1-800-799-7233</strong></span>
            <div className="flex items-center gap-2">
              <Link href="/safety-plan" className="text-xs font-medium text-red-600 hover:underline whitespace-nowrap">Safety Plan â†’</Link>
              <button onClick={() => setShowSafetyBanner(false)} className="text-red-400 hover:text-red-600" aria-label="Dismiss"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Hero Stats - compact inline */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg px-5 py-3 text-white flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Welcome back, {profile?.display_name || 'Friend'}</h1>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-300" />
            <span className="font-bold">{stats.streak}</span>
            <span className="opacity-80">streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-blue-200" />
            <span className="font-bold">{stats.entries}</span>
            <span className="opacity-80">entries</span>
          </div>
        </div>
      </div>

      {/* Quick Actions - compact grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Quick Actions</h2>
          <button onClick={() => document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">All Tools â†’</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {featuredTools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white border border-gray-200 hover:shadow-md hover:border-${tool.color}-300 transition-all cursor-pointer text-center`}>
                <div className={`bg-${tool.color}-100 p-1.5 rounded-full`}>
                  <tool.icon className={`h-4 w-4 text-${tool.color}-600`} />
                </div>
                <span className="text-xs font-medium text-gray-700 leading-tight">{tool.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Check-In */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Daily Check-In</h2>
        <MoodCheckIn
          userId={user.id}
          subscriptionTier={profile.subscription_tier as 'foundation' | 'recovery' | 'empowerment'}
          showJourney={false}
          compact={true}
        />
      </div>

      {/* Recent Entries - compact */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Documentation</h2>
            <Link href="/journal" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            {recentEntries.slice(0, 3).map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{entry.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(entry.incident_date).toLocaleDateString()} â€¢ Safety: {entry.safety_rating}/5
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-1">{entry.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Widgets - compact 2-col */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Support</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <CrisisReframeWidget />
          <HopeReframeWidget />
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <CognitiveDissonanceWidget />
          <NoContactWidget />
        </div>
      </div>

      {/* Analysis Tools - compact 2-col */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Analysis</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <NarcissistDetectorWidget />
          <NarcissistSimulatorWidget />
        </div>
      </div>

      {/* All Tools - compact accordion */}
      <div id="all-tools">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">All Tools</h2>
        <div className="space-y-1.5">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <button
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                {expandedCategory === category.id ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
              </button>
              {expandedCategory === category.id && (
                <div className="px-4 pb-3 pt-1 grid grid-cols-2 md:grid-cols-4 gap-1">
                  {category.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                        <item.icon className={`h-3.5 w-3.5 text-${item.color}-600`} />
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

function WidgetSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse space-y-2" aria-hidden="true">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
