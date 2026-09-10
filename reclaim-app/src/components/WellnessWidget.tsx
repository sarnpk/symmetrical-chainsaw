'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface WellnessWidgetProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

interface MoodEntry {
  mood_rating: number
  energy_level: number
  anxiety_level: number
  created_at: string
}

export default function WellnessWidget({ userId, subscriptionTier }: WellnessWidgetProps) {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null)
  const [weeklyAverage, setWeeklyAverage] = useState<{ mood: number; energy: number; anxiety: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dailyAffirmation, setDailyAffirmation] = useState('')

  const supabase = createClient()
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  const affirmations = [
    "I am worthy of love, respect, and kindness.",
    "My feelings are valid and important.",
    "I have the strength to overcome challenges.",
    "I am healing at my own pace, and that's okay.",
    "I deserve to feel safe and secure."
  ]

  useEffect(() => {
    const loadWellnessData = async () => {
      // Set daily affirmation
      const today = new Date().toDateString()
      const idx = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % affirmations.length
      setDailyAffirmation(affirmations[idx])

      if (hasAccess) {
        try {
          // Load today's mood entry
          const todayStart = new Date().toISOString().split('T')[0]
          const { data: todayData } = await supabase
            .from('mood_check_ins')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', `${todayStart}T00:00:00`)
            .lt('created_at', `${todayStart}T23:59:59`)
            .single()

          if (todayData) {
            setTodayMood(todayData)
          }

          // Load weekly average
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          const { data: weekData } = await supabase
            .from('mood_check_ins')
            .select('mood_rating, energy_level, anxiety_level')
            .eq('user_id', userId)
            .gte('created_at', weekAgo.toISOString())

          if (weekData && weekData.length > 0) {
            const avg = weekData.reduce(
              (acc, entry) => ({
                mood: acc.mood + entry.mood_rating,
                energy: acc.energy + entry.energy_level,
                anxiety: acc.anxiety + entry.anxiety_level
              }),
              { mood: 0, energy: 0, anxiety: 0 }
            )
            
            setWeeklyAverage({
              mood: Math.round(avg.mood / weekData.length),
              energy: Math.round(avg.energy / weekData.length),
              anxiety: Math.round(avg.anxiety / weekData.length)
            })
          }
        } catch (error) {
          console.error('Failed to load wellness data:', error)
        }
      }
      
      setLoading(false)
    }

    loadWellnessData()
  }, [userId, hasAccess, supabase])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Wellness Check-in
            </CardTitle>
            <CardDescription>Your daily wellness at a glance</CardDescription>
          </div>
          <Link 
            href="/wellness" 
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Affirmation */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Today's Affirmation</span>
          </div>
          <p className="text-sm text-purple-800 italic">"{dailyAffirmation}"</p>
        </div>

        {hasAccess ? (
          <>
            {/* Today's Mood */}
            {todayMood ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-pink-600">{todayMood.mood_rating}/10</div>
                  <div className="text-xs text-gray-600">Mood</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{todayMood.energy_level}/10</div>
                  <div className="text-xs text-gray-600">Energy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">{todayMood.anxiety_level}/10</div>
                  <div className="text-xs text-gray-600">Anxiety</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-sm text-gray-600 mb-2">Haven't checked in today yet</p>
                <Link 
                  href="/wellness#mood-checkin" 
                  className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700"
                >
                  Check in now
                </Link>
              </div>
            )}

            {/* Weekly Trend */}
            {weeklyAverage && (
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">7-Day Average</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-pink-600">{weeklyAverage.mood}/10</div>
                    <div className="text-gray-500">Mood</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{weeklyAverage.energy}/10</div>
                    <div className="text-gray-500">Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{weeklyAverage.anxiety}/10</div>
                    <div className="text-gray-500">Anxiety</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3">
            <div className="text-center">
              <p className="text-sm text-purple-700 mb-2">
                Unlock mood tracking and coping strategies
              </p>
              <Link 
                href="/subscription" 
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
              >
                Upgrade to Recovery
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}