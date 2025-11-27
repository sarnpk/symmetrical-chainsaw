'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, BookOpen, Brain, Shield, Heart, Anchor, MessageSquare, AlertTriangle, Target, FileText, RotateCcw, HeartHandshake, Flame, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'
import CognitiveDissonanceWidget from '@/components/CognitiveDissonanceWidget'
import NoContactWidget from '@/components/NoContactWidget'
import NarcissistDetectorWidget from '@/components/NarcissistDetectorWidget'
import NarcissistSimulatorWidget from '@/components/NarcissistSimulatorWidget'
import CrisisReframeWidget from '@/components/CrisisReframeWidget'
import MoodCheckIn from '@/components/MoodCheckIn'

interface DashboardV2Props {
  user: User
  profile: Profile
  recentEntries: JournalEntry[]
}

export default function DashboardV2({ user, profile, recentEntries }: DashboardV2Props) {
  const [stats, setStats] = useState({ streak: 0, entries: 0, relationshipHealth: 0 })
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
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
      name: '📝 Journaling',
      items: [
        { name: 'New Entry', href: '/journal/new', icon: Plus, color: 'indigo', featured: true },
        { name: 'Journal', href: '/journal', icon: BookOpen, color: 'blue' },
        { name: 'Reality Anchor', href: '/reality-log', icon: Anchor, color: 'teal' },
        { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle, color: 'red' }
      ]
    },
    {
      id: 'protection',
      name: '🛡️ Protection',
      items: [
        { name: 'Grey Rock', href: '/grey-rock-templates', icon: FileText, color: 'gray', featured: true },
        { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare, color: 'indigo' },
        { name: 'Stonewalling', href: '/stonewalling', icon: Shield, color: 'slate' },
        { name: 'Reactive Abuse', href: '/reactive-abuse', icon: RotateCcw, color: 'purple' }
      ]
    },
    {
      id: 'recovery',
      name: '🧠 Recovery',
      items: [
        { name: 'Crisis Reframe', href: '/crisis-reframe', icon: AlertTriangle, color: 'red', featured: true },
        { name: 'Belief Reframe', href: '/belief-reframe', icon: Brain, color: 'green', featured: true },
        { name: 'Positive Moments', href: '/positive-moments', icon: Heart, color: 'pink' },
        { name: 'No Contact Anchor', href: '/no-contact-anchor', icon: Shield, color: 'emerald' }
      ]
    },
    {
      id: 'analysis',
      name: '🎯 Analysis',
      items: [
        { name: 'Narcissist Detector', href: '/narcissist-detector', icon: AlertTriangle, color: 'red', featured: true },
        { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Target, color: 'purple', featured: true },
        { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare, color: 'green' },
        { name: 'Relationship Health', href: '/relationship-health', icon: Heart, color: 'pink' },
        { name: 'NPD Traits', href: '/npd-traits', icon: Target, color: 'orange' },
        { name: 'Gaslighting', href: '/gaslighting-tracker', icon: AlertTriangle, color: 'red' },
        { name: 'Empathy Audit', href: '/empathy-audit', icon: HeartHandshake, color: 'blue' }
      ]
    },
    {
      id: 'support',
      name: '💬 Support',
      items: [
        { name: 'AI Coach', href: '/ai-coach', icon: Brain, color: 'purple', featured: true },
        { name: 'Wellness', href: '/wellness', icon: Heart, color: 'pink' }
      ]
    }
  ]

  const featuredTools = categories.flatMap(cat => cat.items.filter(item => item.featured))

  return (
    <div className="space-y-6">
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

      {/* Crisis Reframe - Priority Widget */}
      <CrisisReframeWidget />

      {/* Mood Check-In */}
      <MoodCheckIn userId={user.id} subscriptionTier={profile.subscription_tier as 'foundation' | 'recovery' | 'empowerment'} />

      {/* Cognitive Dissonance Alerts */}
      <CognitiveDissonanceWidget />

      {/* No Contact Widget */}
      <NoContactWidget />

      {/* Narcissist Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <NarcissistDetectorWidget />
        <NarcissistSimulatorWidget />
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
      </div>

      {/* Recent Entries */}
      {recentEntries && recentEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
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

      {/* All Tools - Categorized */}
      <div>
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

      {/* Professional Support - Compact */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Need Professional Support?</h3>
              <p className="text-sm text-green-700">Connect with trauma-informed therapists and family law attorneys</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://www.psychology-today.com/us/therapists', '_blank')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Find Therapist
              </button>
              <button
                onClick={() => window.open('https://www.avvo.com/find-a-lawyer', '_blank')}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
              >
                Legal Help
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Banner - Dismissible */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-sm">Safety First</h3>
              <p className="text-xs text-red-700">In immediate danger? Call 911 or National Domestic Violence Hotline: 1-800-799-7233</p>
            </div>
            <Link href="/safety-plan" className="text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap">
              Safety Plan →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
