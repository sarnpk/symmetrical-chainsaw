"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { Heart, Sparkles, Shield, Info } from 'lucide-react'

export default function WellnessHelpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
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
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Wellness Help</h1>
          <Link href="/wellness" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Wellness</Link>
        </div>

        <div className="space-y-6">
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-medium text-gray-900">Overview</h2>
            </div>
            <p className="text-gray-700 text-sm">
              The Wellness Dashboard is your daily space for self-care. Check in with your mood, explore coping strategies,
              and reflect with gentle prompts. Small consistent steps build resilience over time.
            </p>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <h2 className="text-lg font-medium text-gray-900">Mood Check‑in</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Record your current mood and quick notes to track patterns.</li>
              <li>View gentle trends to notice what helps you feel better.</li>
              <li>Keep entries brief—consistency matters more than length.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Coping Strategies</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Browse ideas grouped by need (grounding, self‑soothing, connection, etc.).</li>
              <li>Save your favorites to build a personal toolkit.</li>
              <li>Use the simplest skill that works—no perfection needed.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-medium text-gray-900">Daily Affirmations</h2>
            </div>
            <p className="text-sm text-gray-700">
              A short message rotates daily to encourage gentle self‑talk. You can shuffle to view another when you need it.
            </p>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-medium text-gray-900">Safety</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>If you’re in immediate danger or considering self‑harm, call 911 (US) or your local emergency number.</li>
              <li>US Crisis lines: 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line).</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
