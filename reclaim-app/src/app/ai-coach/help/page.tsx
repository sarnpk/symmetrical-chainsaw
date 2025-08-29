'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { MessageSquare, Sparkles, Shield, Info } from 'lucide-react'

export default function AICoachHelpPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900">AI Coach Help</h1>
          <Link href="/ai-coach" className="text-sm text-indigo-600 hover:text-indigo-700">Back to AI Coach</Link>
        </div>

        <div className="space-y-6">
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Overview</h2>
            </div>
            <p className="text-gray-700 text-sm">
              AI Coach offers supportive, trauma‑informed guidance. Share what's on your mind and receive brief, practical
              suggestions—grounding skills, reframes, and next steps.
            </p>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-medium text-gray-900">Using the Coach</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Start with one sentence about what you need (vent, plan, calm, boundary).</li>
              <li>Ask for formats: bullets, 1‑minute exercise, or a compassionate reframe.</li>
              <li>Keep PII minimal; you control what you share.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Limits</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Coaching is supportive, not medical or legal advice.</li>
              <li>If you're in crisis, use emergency resources immediately.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-medium text-gray-900">Safety</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Call 911 (US) or your local emergency number if in imminent danger.</li>
              <li>US: 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line).</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
