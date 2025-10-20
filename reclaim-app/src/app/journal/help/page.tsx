'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { BookOpen, Info, Shield, Tags } from 'lucide-react'

export default function JournalHelpPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900">Journal Help</h1>
          <Link href="/journal" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Journal</Link>
        </div>

        <div className="space-y-6">
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Overview</h2>
            </div>
            <p className="text-gray-700 text-sm">
              Use your journal to capture moments, track moods, and reflect on progress. Entries can be drafts or
              published, and you can filter by mood, safety, and more.
            </p>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tags className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-medium text-gray-900">Tips</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Short notes are enough—aim for consistency over perfection.</li>
              <li>Tag entries and add a mood rating to improve Pattern Analysis.</li>
              <li>Use drafts for sensitive thoughts you’re not ready to publish.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Filters & Views</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Switch between grid and list views for easier scanning.</li>
              <li>Filter by drafts, mood, or safety level to focus your review.</li>
              <li>Search by title or content when looking for something specific.</li>
            </ul>
          </section>

          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-medium text-gray-900">Safety</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>In crisis, call 911 (US) or your local emergency number immediately.</li>
              <li>US: 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line).</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
