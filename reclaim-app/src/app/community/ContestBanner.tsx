'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, Award, Gift } from 'lucide-react'

interface Contest {
  id: string
  title: string
  description: string
  prize: string
  end_date: string
}

interface ContestEntry {
  user_id: string
  score: number
  helpful_posts: number
  helpful_comments: number
  total_likes_received: number
}

export default function ContestBanner({ currentUserId }: { currentUserId: string | null }) {
  const [contest, setContest] = useState<Contest | null>(null)
  const [myEntry, setMyEntry] = useState<ContestEntry | null>(null)
  const [topEntries, setTopEntries] = useState<ContestEntry[]>([])
  const [myRank, setMyRank] = useState<number | null>(null)

  useEffect(() => {
    if (currentUserId) {
      loadContest()
    }
  }, [currentUserId])

  const loadContest = async () => {
    try {
      const res = await fetch('/api/community/contests')
      if (!res.ok) return
      const data = await res.json()
      setContest(data.contest)
      setMyEntry(data.my_entry)
      setTopEntries(data.top_entries || [])
      setMyRank(data.my_rank)
    } catch (err) {
      console.error('loadContest error:', err)
    }
  }

  if (!contest) return null

  const daysLeft = Math.ceil((new Date(contest.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-lg border-2 border-amber-300 p-5 shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {contest.title}
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                LIVE
              </span>
            </h3>
            <p className="text-sm text-gray-700">{contest.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Gift className="h-4 w-4" />
            <span className="text-sm">Prize</span>
          </div>
          <div className="text-xs font-bold text-gray-900">{contest.prize}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Your Stats */}
        {myEntry && (
          <div className="bg-white rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">Your Progress</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Rank:</span>
                <span className="font-bold text-indigo-600">#{myRank || 'â€”'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Score:</span>
                <span className="font-bold text-gray-900">{myEntry.score} pts</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Helpful Posts:</span>
                <span className="font-medium text-gray-700">{myEntry.helpful_posts}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Likes Received:</span>
                <span className="font-medium text-gray-700">{myEntry.total_likes_received}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Leaderboard */}
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-gray-900">Top Contributors</span>
          </div>
          <div className="space-y-1">
            {topEntries.slice(0, 3).map((entry, idx) => (
              <div key={entry.user_id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : 'text-orange-600'}`}>
                    {idx === 0 ? 'ðŸ¥‡' : idx === 1 ? 'ðŸ¥ˆ' : 'ðŸ¥‰'}
                  </span>
                  <span className="text-gray-700">Member #{entry.user_id.slice(0, 8)}</span>
                </div>
                <span className="font-bold text-gray-900">{entry.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Left */}
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{daysLeft}</div>
            <div className="text-xs text-gray-600 mb-2">Days Left</div>
            <div className="text-xs text-gray-700 leading-relaxed">
              Share helpful content, support others, and climb the leaderboard to win!
            </div>
          </div>
        </div>
      </div>

      {!myEntry && (
        <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
          <p className="text-sm text-indigo-900 font-medium">
            ðŸŽ¯ Start posting helpful content to enter the contest automatically!
          </p>
        </div>
      )}
    </div>
  )
}
