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
  Meh,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MoodCheckInProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
  maxEntries?: number // Limit entries shown in Today's Mood Journey
  compact?: boolean // Compact mode for dashboard
  showJourney?: boolean // Show Today's Mood Journey and AI Suggestions
}

interface MoodEntry {
  id?: string
  mood_rating: number
  energy_level: number
  anxiety_level: number
  notes: string
  created_at?: string
}

interface AISuggestion {
  type: 'tool' | 'insight' | 'warning'
  title: string
  message: string
  action?: { label: string; href: string }
}

export default function MoodCheckIn({ userId, subscriptionTier, maxEntries = 10, compact = false, showJourney = true }: MoodCheckInProps) {
  const [moodRating, setMoodRating] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null)
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dragMood, setDragMood] = useState(false)
  const [dragEnergy, setDragEnergy] = useState(false)
  const [dragAnxiety, setDragAnxiety] = useState(false)
  const [todayEntries, setTodayEntries] = useState<MoodEntry[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])

  const supabase = createClient()

  // Check if user has access to mood tracking
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    if (hasAccess) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [userId, hasAccess])

  const loadData = async () => {
    await Promise.all([
      loadTodayEntry(),
      loadRecentEntries(),
      loadTodayEntries()
    ])
    setLoading(false)
  }

  const loadTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('mood_check_ins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: true })

      if (data && !error) {
        setTodayEntries(data)
        generateAISuggestions(data)
      }
    } catch (error) {
      console.error('Failed to load today entries:', error)
    }
  }

  const generateAISuggestions = (entries: MoodEntry[]) => {
    const suggestions: AISuggestion[] = []
    
    if (entries.length === 0) return
    
    const latest = entries[entries.length - 1]
    const avgMood = entries.reduce((sum, e) => sum + e.mood_rating, 0) / entries.length
    const avgAnxiety = entries.reduce((sum, e) => sum + e.anxiety_level, 0) / entries.length
    const avgEnergy = entries.reduce((sum, e) => sum + e.energy_level, 0) / entries.length

    // Low mood suggestion
    if (latest.mood_rating <= 3) {
      suggestions.push({
        type: 'tool',
        title: 'Mood is Low',
        message: 'Your mood is low right now. Try a quick reframe exercise to shift perspective.',
        action: { label: 'Crisis Reframe Tool', href: '/crisis-reframe' }
      })
    }

    // High anxiety suggestion
    if (latest.anxiety_level >= 8) {
      suggestions.push({
        type: 'tool',
        title: 'High Anxiety Detected',
        message: 'Your anxiety is high. Try breathing exercises or grounding techniques.',
        action: { label: 'Mind Reset (Breathing)', href: '/mind-reset' }
      })
    }

    // Low energy suggestion
    if (latest.energy_level <= 3) {
      suggestions.push({
        type: 'tool',
        title: 'Low Energy',
        message: 'Energy is low. Consider a coping strategy or gentle movement.',
        action: { label: 'Coping Strategies', href: '/wellness#coping-strategies' }
      })
    }

    // Pattern insight
    if (entries.length >= 3) {
      const moodTrend = entries[entries.length - 1].mood_rating - entries[0].mood_rating
      if (moodTrend >= 3) {
        suggestions.push({
          type: 'insight',
          title: 'Mood Improving',
          message: `Your mood has improved by ${moodTrend} points today. Keep doing what you're doing!`,
        })
      } else if (moodTrend <= -3) {
        suggestions.push({
          type: 'warning',
          title: 'Mood Declining',
          message: `Your mood has dropped ${Math.abs(moodTrend)} points today. Consider reaching out for support.`,
          action: { label: 'View Resources', href: '/wellness' }
        })
      }
    }

    // Crisis warning
    if (avgMood <= 3 && avgAnxiety >= 7) {
      suggestions.push({
        type: 'warning',
        title: 'Difficult Day',
        message: 'This seems like a particularly hard day. Please consider reaching out to your support system or crisis resources.',
        action: { label: 'Crisis Resources', href: '/wellness' }
      })
    }

    setAiSuggestions(suggestions)
  }

  const loadTodayEntry = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('mood_check_ins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })

      if (data && !error && data.length > 0) {
        setTodayEntry(data[0])
        // Don't pre-fill - let user enter fresh data for new check-in
      }
    } catch (error) {
      // No entry for today, which is fine
    }
  }

  // UX helpers
  const valueToPercent = (val: number, min = 1, max = 10) => ((val - min) / (max - min)) * 100

  const descriptorMoodOrEnergy = (val: number) => {
    if (val <= 2) return 'Very Low'
    if (val <= 4) return 'Low'
    if (val <= 7) return 'Moderate'
    if (val <= 9) return 'High'
    return 'Very High'
  }

  const descriptorAnxiety = (val: number) => {
    if (val <= 2) return 'Very Calm'
    if (val <= 4) return 'Calm'
    if (val <= 7) return 'Moderate'
    if (val <= 9) return 'Anxious'
    return 'Very Anxious'
  }

  const moodGradient = 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%)'
  const energyGradient = 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%)'
  const anxietyGradient = 'linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)'

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

      // Always create new entry (multiple per day)
      const { data, error } = await supabase
        .from('mood_check_ins')
        .insert(entryData)
        .select()
        .single()

      if (error) throw error
      setTodayEntry(data)
      toast.success('Mood check-in saved!')
      
      // Reset form for next check-in
      setMoodRating(5)
      setEnergyLevel(5)
      setAnxietyLevel(5)
      setNotes('')

      // Reload all data
      await Promise.all([
        loadTodayEntry(),
        loadRecentEntries(),
        loadTodayEntries()
      ])
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

  const handleDelete = async (entryId: string) => {
    if (!confirm('Delete this mood check-in?')) return

    try {
      const { error } = await supabase
        .from('mood_check_ins')
        .delete()
        .eq('id', entryId)

      if (error) throw error
      toast.success('Check-in deleted')
      await loadData()
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error('Failed to delete check-in')
    }
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
                  <span className="text-purple-600 font-bold text-sm">âœ¨</span>
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
                  <span className="text-xs">â†’</span>
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
            Mood Check-In
            {todayEntries.length > 0 && <span className="text-sm text-green-600 font-normal">({todayEntries.length} today)</span>}
          </CardTitle>
          <CardDescription>
            How are you feeling right now? Check in multiple times throughout the day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Mood (1-10)
            </label>
            {/* Discrete slider 1â€“10 with value chip, ticks, and drag bubble */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={moodRating}
                    onChange={(e) => setMoodRating(Number(e.target.value))}
                    onMouseDown={() => setDragMood(true)}
                    onMouseUp={() => setDragMood(false)}
                    onTouchStart={() => setDragMood(true)}
                    onTouchEnd={() => setDragMood(false)}
                    onBlur={() => setDragMood(false)}
                    aria-label="Overall Mood from 1 to 10"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={moodRating}
                    className="w-full h-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                    style={{ background: moodGradient }}
                  />
                  {dragMood && (
                    <div
                      className="absolute -top-8 left-0 translate-x-[-50%] px-2 py-1 text-xs rounded-md bg-pink-600 text-white shadow"
                      style={{ left: `${valueToPercent(moodRating)}%` }}
                    >
                      {moodRating}
                    </div>
                  )}
                </div>
                <div className="min-w-[44px] h-9 px-2 inline-flex items-center justify-center rounded-md border border-pink-300 bg-pink-50 text-pink-700 font-semibold">
                  {moodRating}
                </div>
              </div>
              <div className="flex justify-between">
                {[...Array(10)].map((_, i) => {
                  const idx = i + 1
                  const isMajor = idx === 1 || idx === 5 || idx === 10
                  return (
                    <span
                      key={idx}
                      className={isMajor ? 'w-px h-3 bg-gray-400' : 'w-px h-2 bg-gray-300'}
                    />
                  )
                })}
              </div>
              <div className="text-xs text-gray-600">Selected: <span className="font-medium text-pink-700">{moodRating}</span> â€” {descriptorMoodOrEnergy(moodRating)}</div>
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
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    onMouseDown={() => setDragEnergy(true)}
                    onMouseUp={() => setDragEnergy(false)}
                    onTouchStart={() => setDragEnergy(true)}
                    onTouchEnd={() => setDragEnergy(false)}
                    onBlur={() => setDragEnergy(false)}
                    aria-label="Energy Level from 1 to 10"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={energyLevel}
                    className="w-full h-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ background: energyGradient }}
                  />
                  {dragEnergy && (
                    <div
                      className="absolute -top-8 left-0 translate-x-[-50%] px-2 py-1 text-xs rounded-md bg-blue-600 text-white shadow"
                      style={{ left: `${valueToPercent(energyLevel)}%` }}
                    >
                      {energyLevel}
                    </div>
                  )}
                </div>
                <div className="min-w-[44px] h-9 px-2 inline-flex items-center justify-center rounded-md border border-blue-300 bg-blue-50 text-blue-700 font-semibold">
                  {energyLevel}
                </div>
              </div>
              <div className="flex justify-between">
                {[...Array(10)].map((_, i) => {
                  const idx = i + 1
                  const isMajor = idx === 1 || idx === 5 || idx === 10
                  return (
                    <span
                      key={idx}
                      className={isMajor ? 'w-px h-3 bg-gray-400' : 'w-px h-2 bg-gray-300'}
                    />
                  )
                })}
              </div>
              <div className="text-xs text-gray-600">Selected: <span className="font-medium text-blue-700">{energyLevel}</span> â€” {descriptorMoodOrEnergy(energyLevel)}</div>
            </div>
          </div>

          {/* Anxiety Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Anxiety Level (1-10)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={anxietyLevel}
                    onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                    onMouseDown={() => setDragAnxiety(true)}
                    onMouseUp={() => setDragAnxiety(false)}
                    onTouchStart={() => setDragAnxiety(true)}
                    onTouchEnd={() => setDragAnxiety(false)}
                    onBlur={() => setDragAnxiety(false)}
                    aria-label="Anxiety Level from 1 to 10"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={anxietyLevel}
                    className="w-full h-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    style={{ background: anxietyGradient }}
                  />
                  {dragAnxiety && (
                    <div
                      className="absolute -top-8 left-0 translate-x-[-50%] px-2 py-1 text-xs rounded-md bg-orange-600 text-white shadow"
                      style={{ left: `${valueToPercent(anxietyLevel)}%` }}
                    >
                      {anxietyLevel}
                    </div>
                  )}
                </div>
                <div className="min-w-[44px] h-9 px-2 inline-flex items-center justify-center rounded-md border border-orange-300 bg-orange-50 text-orange-700 font-semibold">
                  {anxietyLevel}
                </div>
              </div>
              <div className="flex justify-between">
                {[...Array(10)].map((_, i) => {
                  const idx = i + 1
                  const isMajor = idx === 1 || idx === 5 || idx === 10
                  return (
                    <span
                      key={idx}
                      className={isMajor ? 'w-px h-3 bg-gray-400' : 'w-px h-2 bg-gray-300'}
                    />
                  )
                })}
              </div>
              <div className="text-xs text-gray-600">Selected: <span className="font-medium text-orange-700">{anxietyLevel}</span> â€” {descriptorAnxiety(anxietyLevel)}</div>
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
            {saving ? 'Saving...' : 'Save Check-in'}
          </button>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {showJourney && aiSuggestions.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-indigo-900 text-base">ðŸ’¡ Suggestions for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                suggestion.type === 'warning' ? 'bg-red-50 border-red-200' :
                suggestion.type === 'insight' ? 'bg-green-50 border-green-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className={`font-semibold text-sm mb-1 ${
                  suggestion.type === 'warning' ? 'text-red-900' :
                  suggestion.type === 'insight' ? 'text-green-900' :
                  'text-blue-900'
                }`}>{suggestion.title}</div>
                <div className={`text-sm mb-2 ${
                  suggestion.type === 'warning' ? 'text-red-800' :
                  suggestion.type === 'insight' ? 'text-green-800' :
                  'text-blue-800'
                }`}>{suggestion.message}</div>
                {suggestion.action && (
                  <a
                    href={suggestion.action.href}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded ${
                      suggestion.type === 'warning' ? 'bg-red-600 text-white hover:bg-red-700' :
                      suggestion.type === 'insight' ? 'bg-green-600 text-white hover:bg-green-700' :
                      'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {suggestion.action.label} â†’
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Today's Chart */}
      {showJourney && todayEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Today's Mood Journey {todayEntries.length > maxEntries && `(showing last ${maxEntries})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEntries.slice(-maxEntries).map((entry, idx) => {
                const time = new Date(entry.created_at!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                return (
                  <div key={entry.id} className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 w-16">{time}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-12">Mood</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getRatingColor(entry.mood_rating, 'mood')}`}
                            style={{ width: `${entry.mood_rating * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-6">{entry.mood_rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-12">Energy</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getRatingColor(entry.energy_level, 'energy')}`}
                            style={{ width: `${entry.energy_level * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-6">{entry.energy_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-12">Anxiety</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getRatingColor(entry.anxiety_level, 'anxiety')}`}
                            style={{ width: `${entry.anxiety_level * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-6">{entry.anxiety_level}</span>
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-gray-600 italic mt-1">"{entry.notes}"</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id!)}
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete this check-in"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {!compact && recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Recent Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.slice(0, 7).map((entry) => (
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
