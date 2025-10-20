'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'
import { RotateCcw, Sparkles, Heart, Brain, Info } from 'lucide-react'

export default function MindResetHelpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }
  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto pt-4 sm:pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RotateCcw className="h-7 w-7 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Mind Reset — Help</h1>
          </div>
          <Link href="/mind-reset" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Mind Reset →</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center text-gray-900 font-semibold">
            <Info className="h-5 w-5 text-indigo-600" />
            <span className="ml-2">What is Mind Reset?</span>
          </div>
          <p className="text-gray-600 text-sm">Short, effective tools to calm your nervous system and reframe unhelpful thoughts. Use when you need to de-escalate and regain clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Brain className="h-5 w-5 text-indigo-600" />
              <span className="ml-2">AI Reframe</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Enter a thought; receive a compassionate, practical reframe.</li>
              <li>Private by default; only stored if your account settings enable history.</li>
              <li>Usage may be limited by your plan; upgrades unlock more.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Heart className="h-5 w-5 text-rose-600" />
              <span className="ml-2">Affirmations</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Pick a playlist, favorite lines, and optionally auto-play.</li>
              <li>Your preferences are saved to continue where you left off.</li>
              <li>Use keyboard: ←/→ to navigate, space to play/pause.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:col-span-2">
            <div className="flex items-center text-gray-900 font-semibold">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span className="ml-2">Breathing</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Select a pattern (Box, 4-7-8, Equal, Coherent) and a duration.</li>
              <li>Follow the on-screen phases; the timer guides inhale/hold/exhale.</li>
              <li>Stop anytime. If you feel dizzy, pause and switch to normal breathing.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">
            Tip: If you’re in immediate danger or crisis, use your Safety Plan or call local emergency services.
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
