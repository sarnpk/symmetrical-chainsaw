'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, TrendingUp, Shield, Heart } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface JournalStatsProps {
  entries: JournalEntry[]
}

export default function JournalStats({ entries }: JournalStatsProps) {
  if (entries.length === 0) return null

  const thisWeekCount = entries.filter(e => {
    const entryDate = new Date(e.incident_date || e.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  }).length

  const safetyEntries = entries.filter(e => {
    const safety = e.safety_rating || e.ai_analysis?.safety_level
    return safety != null && !isNaN(Number(safety)) && Number(safety) >= 0 && Number(safety) <= 5
  })
  const avgSafety = safetyEntries.length > 0 
    ? (safetyEntries.reduce((acc, e) => {
        const safety = Number(e.safety_rating || e.ai_analysis?.safety_level || 0)
        return acc + Math.min(Math.max(safety, 0), 5)
      }, 0) / safetyEntries.length).toFixed(1)
    : '0.0'
    
  const moodEntries = entries.filter(e => {
    const mood = e.mood_rating
    return mood != null && !isNaN(Number(mood)) && Number(mood) >= 0 && Number(mood) <= 5
  })
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((acc, e) => {
        const mood = Number(e.mood_rating || 0)
        return acc + Math.min(Math.max(mood, 0), 5)
      }, 0) / moodEntries.length).toFixed(1)
    : '0.0'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{thisWeekCount}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Safety (/5)</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgSafety}</p>
            </div>
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Mood</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgMood}</p>
            </div>
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}