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

  const avgSafety = (entries.reduce((acc, e) => acc + (e.safety_rating || e.ai_analysis?.safety_level || 5), 0) / entries.length).toFixed(1)
  const avgMood = (entries.reduce((acc, e) => acc + (e.mood_rating || 5), 0) / entries.length).toFixed(1)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{thisWeekCount}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Safety</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgSafety}</p>
            </div>
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 self-end sm:self-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
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