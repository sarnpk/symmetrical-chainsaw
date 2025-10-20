'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Trophy, BookHeart, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface RealityAnchorWidgetProps {
  userId: string
}

interface StreakData {
  current_streak: number
  longest_streak: number
  last_completed_date: string | null
}

interface TodayIntention {
  completed: boolean
  affirmation_text?: string
}

interface LogStats {
  weekCount: number
  topTrait: string | null
}

export default function RealityAnchorWidget({ userId }: RealityAnchorWidgetProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [todayIntention, setTodayIntention] = useState<TodayIntention | null>(null)
  const [logStats, setLogStats] = useState<LogStats>({ weekCount: 0, topTrait: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streakRes, intentionRes, logRes] = await Promise.all([
          fetch('/api/reality-anchor/streaks?routineType=morning_intention'),
          fetch('/api/reality-anchor/morning-intention'),
          fetch('/api/reality-anchor/reality-log')
        ])

        if (streakRes.ok) {
          const data = await streakRes.json()
          setStreak(data)
        }

        if (intentionRes.ok) {
          const data = await intentionRes.json()
          setTodayIntention(data)
        }

        if (logRes.ok) {
          const entries = await logRes.json()
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          const weekEntries = entries.filter((e: any) => new Date(e.date) >= weekAgo)
          
          const traitCounts: Record<string, number> = {}
          entries.forEach((e: any) => {
            if (e.npd_trait) {
              traitCounts[e.npd_trait] = (traitCounts[e.npd_trait] || 0) + 1
            }
          })
          
          const topTrait = Object.keys(traitCounts).length > 0
            ? Object.entries(traitCounts).sort((a, b) => b[1] - a[1])[0][0]
            : null

          setLogStats({ weekCount: weekEntries.length, topTrait })
        }
      } catch (error) {
        console.error('Failed to fetch Reality Anchor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reality Anchor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookHeart className="h-5 w-5 text-amber-600" />
              Reality Anchor
            </CardTitle>
            <CardDescription>Your daily grounding routine</CardDescription>
          </div>
          <Link href="/morning-intention" className="text-amber-600 hover:text-amber-700">
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Morning Intention Streak */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Morning Streak</p>
              <p className="text-xs text-gray-600">
                {todayIntention?.completed ? 'Completed today!' : 'Not yet today'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">{streak?.current_streak || 0}</p>
            <p className="text-xs text-gray-500">days</p>
          </div>
        </div>

        {/* Longest Streak */}
        {streak && streak.longest_streak > 0 && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Best Streak</p>
                <p className="text-xs text-gray-600">Keep it up!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">{streak.longest_streak}</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </div>
        )}

        {/* Reality Log Stats */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reality Log</p>
              <p className="text-xs text-gray-600">
                {logStats.weekCount} {logStats.weekCount === 1 ? 'entry' : 'entries'} this week
              </p>
            </div>
          </div>
          <Link 
            href="/reality-log/new"
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link 
            href="/affirmations"
            className="text-center p-2 bg-white rounded-md hover:bg-amber-100 transition-colors text-sm font-medium text-gray-700"
          >
            Affirmations
          </Link>
          <Link 
            href="/reality-log"
            className="text-center p-2 bg-white rounded-md hover:bg-amber-100 transition-colors text-sm font-medium text-gray-700"
          >
            View Log
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
