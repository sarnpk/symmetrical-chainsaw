'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import MoodCheckIn from '@/components/MoodCheckIn'
import CopingStrategies from '@/components/CopingStrategies'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Shield,
  Sun
} from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

export default function WellnessPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [dailyAffirmation, setDailyAffirmation] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const affirmations = [
    "I am worthy of love, respect, and kindness.",
    "My feelings are valid and important.",
    "I have the strength to overcome challenges.",
    "I am healing at my own pace, and that's okay.",
    "I deserve to feel safe and secure.",
    "My voice matters and deserves to be heard.",
    "I am brave for seeking help and support.",
    "I choose to focus on my growth and healing.",
    "I am not defined by what happened to me.",
    "I have the power to create positive change in my life.",
    "I am surrounded by love and support.",
    "Every day I am becoming stronger and more resilient.",
    "I trust my instincts and inner wisdom.",
    "I am worthy of healthy, loving relationships.",
    "I celebrate my progress, no matter how small."
  ]

  useEffect(() => {
    const loadUserData = async () => {
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
      
      // Set daily affirmation based on date
      const today = new Date().toDateString()
      const affirmationIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % affirmations.length
      setDailyAffirmation(affirmations[affirmationIndex])
      
      setLoading(false)
    }

    loadUserData()
  }, [router, supabase])

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

  const subscriptionTier = profile.subscription_tier || 'foundation'

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto space-y-6 px-4 md:px-0">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Wellness Dashboard</h1>
          <p className="text-gray-600">Your daily space for healing, growth, and self-care</p>
        </div>

        {/* Daily Affirmation */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Sparkles className="h-5 w-5" />
              Daily Affirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg font-medium text-purple-800 italic text-center">
              "{dailyAffirmation}"
            </blockquote>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Sun className="h-4 w-4" />
                <span>Take a moment to breathe and reflect on this</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wellness Journey</p>
                  <p className="font-semibold text-gray-900">Day by day</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="font-semibold text-gray-900">Growing stronger</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Support</p>
                  <p className="font-semibold text-gray-900">Always here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Check-in */}
          <div className="space-y-6">
            <MoodCheckIn 
              userId={user.id} 
              subscriptionTier={subscriptionTier as 'foundation' | 'recovery' | 'empowerment'} 
            />
          </div>

          {/* Coping Strategies */}
          <div className="space-y-6">
            <CopingStrategies 
              userId={user.id} 
              subscriptionTier={subscriptionTier as 'foundation' | 'recovery' | 'empowerment'} 
            />
          </div>
        </div>

        {/* Crisis Resources */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Shield className="h-5 w-5" />
              Crisis Resources
            </CardTitle>
            <CardDescription className="text-red-700">
              If you're in immediate danger or having thoughts of self-harm, please reach out for help immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">Emergency Services</h4>
                <p className="text-sm text-red-800">Call 911 for immediate emergency assistance</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">Crisis Text Line</h4>
                <p className="text-sm text-red-800">Text HOME to 741741 for 24/7 crisis support</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">National Suicide Prevention Lifeline</h4>
                <p className="text-sm text-red-800">Call 988 for 24/7 suicide prevention support</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">National Domestic Violence Hotline</h4>
                <p className="text-sm text-red-800">Call 1-800-799-7233 for domestic violence support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tier Info */}
        {subscriptionTier === 'foundation' && (
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Unlock More Wellness Features</CardTitle>
              <CardDescription className="text-purple-700">
                Upgrade to Recovery or Empowerment plan to access advanced wellness tracking and personalized insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Recovery Plan ($9.99/month)</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Daily mood check-ins</li>
                    <li>• Personal coping strategies library</li>
                    <li>• 100 AI coaching interactions</li>
                    <li>• Enhanced emotional tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Empowerment Plan ($19.99/month)</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• All Recovery features</li>
                    <li>• Unlimited AI coaching</li>
                    <li>• Advanced pattern analysis</li>
                    <li>• Complete evidence documentation</li>
                  </ul>
                </div>
              </div>
              <a
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade Your Plan
                <span className="text-sm">→</span>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
