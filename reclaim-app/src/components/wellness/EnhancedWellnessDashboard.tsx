'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Plus,
  BarChart3,
  Flame,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface WellnessGoal {
  id: string
  title: string
  current_value: number
  target_value: number
  target_date: string
  is_completed: boolean
}

interface WellnessHabit {
  id: string
  habit_name: string
  streak_count: number
  longest_streak: number
  target_frequency: number
}

interface WeeklyReport {
  mood_average: number
  energy_average: number
  anxiety_average: number
  habits_completed: number
  progress_summary: string
}

interface EnhancedWellnessDashboardProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function EnhancedWellnessDashboard({ userId, subscriptionTier }: EnhancedWellnessDashboardProps) {
  const [goals, setGoals] = useState<WellnessGoal[]>([])
  const [habits, setHabits] = useState<WellnessHabit[]>([])
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', target_value: 7, target_date: '' })

  const supabase = createClient()
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    if (hasAccess) {
      loadWellnessData()
    }
    setLoading(false)
  }, [userId, hasAccess])

  const loadWellnessData = async () => {
    try {
      // Load goals
      const { data: goalsData } = await supabase
        .from('wellness_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      // Load habits
      const { data: habitsData } = await supabase
        .from('wellness_habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('streak_count', { ascending: false })

      // Load weekly report
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const { data: reportData } = await supabase
        .from('wellness_reports')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start_date', weekStart.toISOString().split('T')[0])
        .single()

      setGoals(goalsData || [])
      setHabits(habitsData || [])
      setWeeklyReport(reportData)
    } catch (error) {
      console.error('Failed to load wellness data:', error)
    }
  }

  const addGoal = async () => {
    if (!newGoal.title.trim()) return

    try {
      const { error } = await supabase
        .from('wellness_goals')
        .insert({
          user_id: userId,
          goal_type: 'daily_checkin',
          title: newGoal.title,
          target_value: newGoal.target_value,
          target_date: newGoal.target_date || null
        })

      if (!error) {
        setNewGoal({ title: '', target_value: 7, target_date: '' })
        setShowAddGoal(false)
        loadWellnessData()
      }
    } catch (error) {
      console.error('Failed to add goal:', error)
    }
  }

  const completeHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Add completion
      await supabase
        .from('habit_completions')
        .insert({
          user_id: userId,
          habit_id: habitId,
          completion_date: today
        })

      loadWellnessData()
    } catch (error) {
      console.error('Failed to complete habit:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
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
            <Target className="h-5 w-5 text-indigo-500" />
            Enhanced Wellness Dashboard
          </CardTitle>
          <CardDescription>Track goals, habits, and weekly progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-purple-700 mb-2">
                Unlock wellness goals and habit tracking
              </p>
              <Link 
                href="/subscription" 
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
              >
                Upgrade to Recovery
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weekly Progress Summary */}
      {weeklyReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{weeklyReport.mood_average?.toFixed(1) || 'N/A'}</div>
                <div className="text-xs text-gray-600">Avg Mood</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{weeklyReport.energy_average?.toFixed(1) || 'N/A'}</div>
                <div className="text-xs text-gray-600">Avg Energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{weeklyReport.habits_completed || 0}</div>
                <div className="text-xs text-gray-600">Habits Done</div>
              </div>
            </div>
            {weeklyReport.progress_summary && (
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {weeklyReport.progress_summary}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wellness Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-500" />
                Wellness Goals
              </CardTitle>
              <CardDescription>Track your wellness objectives</CardDescription>
            </div>
            <button
              onClick={() => setShowAddGoal(true)}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddGoal && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Goal title (e.g., Daily mood check-ins)"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target (days)"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addGoal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{goal.title}</div>
                    <div className="text-sm text-gray-600">
                      Progress: {goal.current_value}/{goal.target_value}
                      {goal.target_date && ` ⬢ Due: ${new Date(goal.target_date).toLocaleDateString()}`}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  {goal.is_completed && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-3" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No wellness goals yet</p>
                <p className="text-sm">Set your first goal to start tracking progress</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Wellness Habits
          </CardTitle>
          <CardDescription>Build consistent wellness practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{habit.habit_name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {habit.streak_count} day streak
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-yellow-500" />
                        Best: {habit.longest_streak} days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Complete Today
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No wellness habits yet</p>
                <p className="text-sm">Start building healthy daily practices</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}