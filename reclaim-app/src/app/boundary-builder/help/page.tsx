'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'
import { Shield, Target, MessageCircle, Info } from 'lucide-react'

export default function BoundaryBuilderHelpPage() {
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
            <Shield className="h-7 w-7 text-emerald-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Boundary Builder — Help</h1>
          </div>
          <Link href="/boundary-builder" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Boundary Builder →</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center text-gray-900 font-semibold">
            <Info className="h-5 w-5 text-emerald-600" />
            <span className="ml-2">How it works</span>
          </div>
          <p className="text-gray-600 text-sm">Create, save, and practice clear boundary statements. Start with templates or write your own. Activate boundaries to track your current focus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Categories & Templates</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Browse templates across communication, emotional, time, physical, social, and financial needs.</li>
              <li>Templates are examples—customize wording to fit your voice.</li>
              <li>Some advanced templates may require a paid tier.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="ml-2">Best Practices</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Be specific and behavior-focused: “If X happens, I will Y.”</li>
              <li>Keep it short, neutral, and repeatable.</li>
              <li>Follow through consistently; you are enforcing your limits, not controlling others.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">Note: Boundaries are for your actions and safety. If a situation feels unsafe, step away and refer to your Safety Plan.</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
