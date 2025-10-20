'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Check } from 'lucide-react'

interface MorningIntentionCardProps {
  userId: string
}

export default function MorningIntentionCard({ userId }: MorningIntentionCardProps) {
  const [intention, setIntention] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/reality-anchor/morning-intention')
        const data = await res.json()
        setIntention(data.intention || data.suggestedAffirmation)
        setCompleted(data.intention?.completed || false)

        const streakRes = await fetch(`/api/reality-anchor/streaks?routineType=morning_intention&userId=${userId}`)
        const streakData = await streakRes.json()
        setStreak(streakData.streak?.current_streak || 0)
      } catch (error) {
        console.error('Error loading intention:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userId])

  const handleComplete = async () => {
    try {
      const res = await fetch('/api/reality-anchor/morning-intention', {
        method: 'PUT',
      })

      if (res.ok) {
        const data = await res.json()
        setCompleted(true)
        setStreak(streak + 1)
      }
    } catch (error) {
      console.error('Error completing intention:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="animate-pulse h-24 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  const text = intention?.affirmations?.text || intention?.text || 'Loading affirmation...'

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">Morning Intention</CardTitle>
          </div>
          <span className="text-sm font-bold text-indigo-600">🔥 {streak} days</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 italic p-4 bg-white rounded-lg border border-indigo-100">
          "{text}"
        </p>
        {!completed ? (
          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Mark Complete
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <Check className="h-5 w-5" />
            Completed today
          </div>
        )}
      </CardContent>
    </Card>
  )
}
