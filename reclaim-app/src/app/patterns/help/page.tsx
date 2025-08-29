'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { LineChart, Info, Shield } from 'lucide-react'

export default function PatternsHelpPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900">Pattern Analysis Help</h1>
          <Link href="/patterns" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Patterns</Link>
        </div>

        <div className="space-y-6">
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Overview</h2>
            </div>
            <p className="text-gray-700 text-sm">
              Pattern Analysis helps you spot trends across your entries (moods, tags, time of day). Use insights to
              adjust routines and coping plans.
            </p>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Tips</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Keep entries consistent (even short check‑ins improve signal).</li>
              <li>Tag entries to group by context (sleep, work, relationships).</li>
              <li>Revisit monthly to adjust strategies that work vs. drain.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-medium text-gray-900">Safety & Limits</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Insights are informational only—not a diagnosis.</li>
              <li>If trends raise concern about safety, consider contacting support or a professional.</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
