'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function MorningIntentionPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [intention, setIntention] = useState<any>(null)
  const [streak, setStreak] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      
      try {
        const today = new Date().toISOString().split('T')[0]
        
        // Get today's intention directly from Supabase
        const { data: intention, error: intentionError } = await supabase
          .from('morning_intentions')
          .select('*, affirmations(*)')
          .eq('user_id', user.id)
          .eq('date', today)
          .single()

        if (intentionError && intentionError.code !== 'PGRST116') {
          console.error('Intention error:', intentionError)
        }

        // If no intention, get a personalized affirmation
        if (!intention) {
          // Get user preferences
          const { data: preferences } = await supabase
            .from('affirmation_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()

          let affirmationQuery = supabase
            .from('affirmations')
            .select('*')
            .eq('category', 'morning')
            .eq('is_default', true)

          // Prioritize parent-focused affirmations if user has children
          if (preferences?.has_children || profile?.has_children) {
            affirmationQuery = affirmationQuery.eq('is_parent_focused', true)
          }

          const { data: affirmations } = await affirmationQuery.limit(10)
          const affirmation = affirmations?.[Math.floor(Math.random() * affirmations.length)]

          setIntention(affirmation || {
            id: 'default',
            text: 'Today I choose peace and clarity',
            category: 'morning'
          })
          setCompleted(false)
        } else {
          setIntention(intention)
          setCompleted(intention.completed || false)
        }

        // Get streak data
        const { data: streak } = await supabase
          .from('routine_streaks')
          .select('*')
          .eq('user_id', user.id)
          .eq('routine_type', 'morning_intention')
          .single()

        setStreak(streak)
      } catch (error) {
        console.error('Error loading:', error)
      }
    }

    load()
  }, [user?.id, supabase])

  const handleComplete = async () => {
    if (!user?.id) return
    
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Create or update morning intention
      const { data: updatedIntention, error } = await supabase
        .from('morning_intentions')
        .upsert({
          user_id: user.id,
          date: today,
          affirmation_id: intention?.id,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .select('*, affirmations(*)')
        .single()

      if (error) {
        console.error('Error completing intention:', error)
        return
      }

      setIntention(updatedIntention)
      setCompleted(true)

      // Update streak
      const { data: existingStreak } = await supabase
        .from('routine_streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('routine_type', 'morning_intention')
        .single()

      if (!existingStreak) {
        const { data: newStreak } = await supabase
          .from('routine_streaks')
          .insert({
            user_id: user.id,
            routine_type: 'morning_intention',
            current_streak: 1,
            longest_streak: 1,
            last_completed_date: today,
          })
          .select()
          .single()
        
        setStreak(newStreak)
      } else {
        const lastDate = new Date(existingStreak.last_completed_date)
        const todayDate = new Date(today)
        const daysDiff = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        let newStreak = existingStreak.current_streak
        if (daysDiff === 1) {
          newStreak = existingStreak.current_streak + 1
        } else if (daysDiff > 1) {
          newStreak = 1
        }

        const longestStreak = Math.max(newStreak, existingStreak.longest_streak)

        const { data: updatedStreak } = await supabase
          .from('routine_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_completed_date: today,
          })
          .eq('user_id', user.id)
          .eq('routine_type', 'morning_intention')
          .select()
          .single()

        setStreak(updatedStreak)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const text = intention?.affirmations?.text || intention?.text || 'Loading affirmation...'

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Morning Intention</h1>
          <p className="text-gray-600 mt-2">Start your day with intention and clarity</p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-4xl font-bold text-indigo-600 mt-2">
                🔥 {streak?.current_streak || 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Longest Streak</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                🏆 {streak?.longest_streak || 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Affirmation */}
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Today's Affirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              "{text}"
            </p>
            {!completed ? (
              <button
                onClick={handleComplete}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Mark Complete
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-medium p-3 bg-green-50 rounded-lg">
                <Check className="h-5 w-5" />
                Completed today
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/affirmations"
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
          >
            View All Affirmations
          </Link>
          <Link
            href="/reality-log"
            className="flex-1 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-center font-medium"
          >
            Reality Anchor
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
