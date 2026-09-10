'use client'

import { useEffect, useState } from 'react'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'

interface UserStats {
  level: number
  points: number
  posts_count: number
  comments_count: number
  current_streak: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
}

export default function UserStatsWidget() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/community/user-stats')
      if (!res.ok) throw new Error('Failed to load stats')
      const data = await res.json()
      setStats(data.stats)
      setBadges(data.earned_badges.map((eb: any) => eb.community_badges))
    } catch (err) {
      console.error('loadStats error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) return null

  const nextLevelPoints = stats.level * 100
  const progress = (stats.points % 100) / 100 * 100

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-gray-900">Level {stats.level}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-indigo-600">
          <Star className="h-4 w-4 fill-indigo-600" />
          <span className="font-medium">{stats.points} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress to Level {stats.level + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-indigo-600">{stats.posts_count}</div>
          <div className="text-xs text-gray-600">Posts</div>
        </div>
        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-600">{stats.comments_count}</div>
          <div className="text-xs text-gray-600">Comments</div>
        </div>
        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-orange-600">{stats.current_streak}</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <Award className="h-3 w-3" />
            <span>Badges Earned ({badges.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {badges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-lg px-2 py-1 text-xs flex items-center gap-1 border border-gray-200"
                title={badge.description}
              >
                <span>{badge.icon}</span>
                <span className="text-gray-700">{badge.name}</span>
              </div>
            ))}
            {badges.length > 6 && (
              <div className="bg-white rounded-lg px-2 py-1 text-xs text-gray-500 border border-gray-200">
                +{badges.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
