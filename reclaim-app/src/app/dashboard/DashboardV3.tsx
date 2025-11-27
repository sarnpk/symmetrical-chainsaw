'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, BookOpen, Brain, Shield, Heart, Anchor, MessageSquare, AlertTriangle, Target, FileText, RotateCcw, HeartHandshake, Flame, TrendingUp, ChevronDown, ChevronUp, Sparkles, Wind, Smile, X, Users } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'
import CognitiveDissonanceWidget from '@/components/CognitiveDissonanceWidget'
import NoContactWidget from '@/components/NoContactWidget'
import NarcissistDetectorWidget from '@/components/NarcissistDetectorWidget'
import NarcissistSimulatorWidget from '@/components/NarcissistSimulatorWidget'
import CrisisReframeWidget from '@/components/CrisisReframeWidget'
import MoodCheckIn from '@/components/MoodCheckIn'

interface DashboardV3Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

export default function DashboardV3({ user, profile, recentEntries }: DashboardV3Props) {
  const [stats, setStats] = useState({ streak: 0, entries: 0, relationshipHealth: 0 })
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showSafetyBanner, setShowSafetyBanner] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [streakRes, entriesRes, healthRes] = await Promise.all([
        fetch('/api/reality-anchor/streaks/morning_intention').catch(() => null),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        fetch('/api/relationship-health').catch(() => null)
      ])

      let streakData = { current_streak: 0 }
      let healthData = { score: 50 }

      if (streakRes && streakRes.ok) {
        streakData = await streakRes.json()
      }

      if (healthRes && healthRes.ok) {
        healthData = await healthRes.json()
      }

      setStats({
        streak: streakData.current_streak || 0,
        entries: entriesRes.count || 0,
        relationshipHealth: healthData.score || 50
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats({ streak: 0, entries: 0, relationshipHealth: 50 })
    }
  }

  const categories = [
    {
      id: 'journaling',
      name: '📝 Documentation',
      items: [
        { name: 'Document', href: '/journal/new', icon: Plus, color: 'indigo', featured: true, priority: 3 },
        { name: 'Document Experiences', href: '/journal', icon: BookOpen, color: 'blue' },
        { name: 'Reality Anchor', href: '/reality-log', icon: Anchor, color: 'teal' },
        { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle, color: 'red' },
        { name: 'Letting Go', href: '/letting-go', icon: Wind, color: 'sky', featured: true, priority: 6 },
        { name: 'Patterns', href: '/patterns', icon: TrendingUp, color: 'indigo' }
      ]
    },
    {
      id: 'protection',
      name: '🛡️ Protection',
      items: [
        { name: 'Grey Rock', href: '/grey-rock-templates', icon: FileText, color: 'gray', featured: true, priority: 4 },
        { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare, color: 'indigo' },
        { name: 'Stonewalling', href: '/stonewalling', icon: Shield, color: 'slate' },
        { name: 'Reactive Abuse', href: '/reactive-abuse', icon: RotateCcw, color: 'purple' }
      ]
    },
    {
      id: 'wellness',
      name: '💚 Wellness & Recovery',
      items: [
        { name: 'Wellness', href: '/wellness', icon: Heart, color: 'pink', featured: true, priority: 1 },
        { name: 'Crisis Reframe', href: '/crisis-reframe', icon: AlertTriangle, color: 'red', featured: true, priority: 2 },
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
      name: '🎯 Analysis & Understanding',
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
      name: '💬 Support & Guidance',
      items: [
        { name: 'AI Coach', href: '/ai-coach', icon: Brain, color: 'purple', featured: true, priority: 9 },
        { name: 'Safety Plan', href: '/safety-plan', icon: Shield, color: 'red' },
        { name: 'Community', href: '/community', icon: Heart, color: 'blue' }
      ]
    },
    {
      id: 'account',
      name: '⚙️ Settings',
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
    <div className="space-y-6 pt-6">
      {/* TIER 1: Professional Support */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="text-base font-semibold text-green-900 mb-2">💼 Need Professional Support?</div>
            <p className="text-sm text-green-800">Connect with trauma-informed therapists and family law attorneys</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => window.open('https://www.psychology-today.com/us/therapists', '_blank')}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Find Therapist
            </button>
            <button
              onClick={() => window.open('https://www.avvo.com/find-a-lawyer', '_blank')}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
            >
              Legal Help
            </button>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Welcome back, {profile?.display_name || 'Friend'}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold">
              <Flame className="h-8 w-8 text-orange-300" />
              {stats.streak}
            </div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.entries}</div>
            <div className="text-sm opacity-90">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold">
              <Heart className={`h-6 w-6 ${stats.relationshipHealth >= 70 ? 'text-green-300' : stats.relationshipHealth >= 40 ? 'text-yellow-300' : 'text-red-300'}`} />
              {stats.relationshipHealth}
            </div>
            <div className="text-sm opacity-90">Health Score</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-sm opacity-90">Growing Stronger</div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Featured Tools */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredTools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className={`hover:shadow-lg transition-all cursor-pointer border-${tool.color}-200 hover:scale-105`}>
                <CardHeader className="text-center pt-6 pb-6">
                  <div className={`mx-auto bg-${tool.color}-100 p-3 rounded-full w-fit mb-3`}>
                    <tool.icon className={`h-6 w-6 text-${tool.color}-600`} />
                  </div>
                  <CardTitle className="text-base font-medium">{tool.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            View All Tools →
          </button>
        </div>
      </div>

      {/* TIER 2: Daily Wellness Check */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Check-In</h2>
        <MoodCheckIn 
          userId={user.id} 
          subscriptionTier={profile.subscription_tier as 'foundation' | 'recovery' | 'empowerment'}
          showJourney={false}
          compact={true}
        />
      </div>

      {/* Recent Entries */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Documentation</h2>
            <Link href="/journal" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recentEntries.slice(0, 3).map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-1">{entry.title}</CardTitle>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.incident_date).toLocaleDateString()} • Safety: {entry.safety_rating}/5
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{entry.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Safety First Banner */}
      {showSafetyBanner && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-base font-semibold text-red-900 mb-2">🚨 Safety First</div>
                  <p className="text-sm text-red-800">
                    In immediate danger? Call <span className="font-bold">911</span> or National Domestic Violence Hotline: <span className="font-bold">1-800-799-7233</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link 
                    href="/safety-plan" 
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline whitespace-nowrap"
                  >
                    Safety Plan →
                  </Link>
                  <button 
                    onClick={() => setShowSafetyBanner(false)} 
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIER 3: Crisis & Alerts (Conditional) */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Active Alerts & Support</h2>
        <CrisisReframeWidget />
        <CognitiveDissonanceWidget />
        <NoContactWidget />
      </div>

      {/* TIER 4: Analysis Tools */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding & Analysis</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <NarcissistDetectorWidget />
          <NarcissistSimulatorWidget />
        </div>
      </div>

      {/* All Tools - Categorized */}
      <div id="all-tools">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Tools</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  {expandedCategory === category.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {expandedCategory === category.id && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {category.items.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <item.icon className={`h-5 w-5 text-${item.color}-600`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
