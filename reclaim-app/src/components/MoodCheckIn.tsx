'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Zap, 
  AlertTriangle, 
  Save, 
  TrendingUp,
  Calendar,
  Smile,
  Frown,
  Meh
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MoodCheckInProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

interface MoodEntry {
  id?: string
  mood_rating: number
  energy_level: number
  anxiety_level: number
  notes: string
  created_at?: string
}

export default function MoodCheckIn({ userId, subscriptionTier }: MoodCheckInProps) {
  const [moodRating, setMoodRating] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null)
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Check if user has access to mood tracking
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    if (hasAccess) {
      loadTodayEntry()
      loadRecentEntries()
    }
    setLoading(false)
  }, [userId, hasAccess])

  const loadTodayEntry = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('mood_check_ins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .single()

      if (data && !error) {
        setTodayEntry(data)
        setMoodRating(data.mood_rating)
        setEnergyLevel(data.energy_level)
        setAnxietyLevel(data.anxiety_level)
        setNotes(data.notes || '')
      }
    } catch (error) {
      // No entry for today, which is fine
    }
  }

  const loadRecentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_check_ins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      if (data && !error) {
        setRecentEntries(data)
      }
    } catch (error) {
      console.error('Failed to load recent entries:', error)
    }
  }

  const handleSave = async () => {
    if (!hasAccess) return

    setSaving(true)
    try {
      const entryData = {
        user_id: userId,
        mood_rating: moodRating,
        energy_level: energyLevel,
        anxiety_level: anxietyLevel,
        notes: notes.trim() || null
      }

      if (todayEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('mood_check_ins')
          .update(entryData)
          .eq('id', todayEntry.id)

        if (error) throw error
        toast.success('Mood check-in updated!')
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('mood_check_ins')
          .insert(entryData)
          .select()
          .single()

        if (error) throw error
        setTodayEntry(data)
        toast.success('Mood check-in saved!')
      }

      await loadRecentEntries()
    } catch (error) {
      console.error('Failed to save mood check-in:', error)
      toast.error('Failed to save mood check-in')
    } finally {
      setSaving(false)
    }
  }

  const getMoodIcon = (rating: number) => {
    if (rating <= 3) return <Frown className="h-5 w-5 text-red-500" />
    if (rating <= 7) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Smile className="h-5 w-5 text-green-500" />
  }

  const getRatingColor = (rating: number, type: 'mood' | 'energy' | 'anxiety') => {
    if (type === 'anxiety') {
      // For anxiety, lower is better
      if (rating <= 3) return 'bg-green-500'
      if (rating <= 7) return 'bg-yellow-500'
      return 'bg-red-500'
    } else {
      // For mood and energy, higher is better
      if (rating <= 3) return 'bg-red-500'
      if (rating <= 7) return 'bg-yellow-500'
      return 'bg-green-500'
    }
  }

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

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Daily Mood Check-In
          </CardTitle>
          <CardDescription>Track your emotional wellbeing and recovery progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">✨</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-purple-900 mb-1">
                  Unlock Daily Mood Tracking with Recovery Plan
                </h4>
                <p className="text-sm text-purple-700 mb-3">
                  Track your emotional wellbeing, identify patterns, and monitor your recovery progress with daily mood check-ins.
                </p>
                <a
                  href="/subscription"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upgrade to Recovery
                  <span className="text-xs">→</span>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Today's Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Daily Mood Check-In
            {todayEntry && <span className="text-sm text-green-600 font-normal">✓ Completed</span>}
          </CardTitle>
          <CardDescription>
            {todayEntry ? 'Update your mood check-in for today' : 'How are you feeling today?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Mood (1-10)
            </label>
            <div className="grid grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMoodRating(rating)}
                  className={`p-2 text-center rounded-lg border-2 transition-all ${
                    moodRating === rating
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-sm">{rating}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Zap className="inline h-4 w-4 mr-1" />
              Energy Level (1-10)
            </label>
            <div className="grid grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setEnergyLevel(rating)}
                  className={`p-2 text-center rounded-lg border-2 transition-all ${
                    energyLevel === rating
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-sm">{rating}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Anxiety Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Anxiety Level (1-10)
            </label>
            <div className="grid grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setAnxietyLevel(rating)}
                  className={`p-2 text-center rounded-lg border-2 transition-all ${
                    anxietyLevel === rating
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-sm">{rating}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Very Calm</span>
              <span>Very Anxious</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors resize-none"
              placeholder="How are you feeling? What's on your mind today?"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : (todayEntry ? 'Update Check-in' : 'Save Check-in')}
          </button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Recent Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(entry.created_at!).toLocaleDateString()}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getMoodIcon(entry.mood_rating)}
                    <div className="text-xs text-gray-500">
                      M:{entry.mood_rating} E:{entry.energy_level} A:{entry.anxiety_level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
