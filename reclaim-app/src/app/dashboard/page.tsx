'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'
import DashboardV3 from './DashboardV3'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      // Local-only session read â€” no network round trip before first paint.
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return

      if (!session?.user) {
        router.push('/')
        return
      }

      setUser(session.user)

      // Fetch profile and recent entries in parallel (single network hop).
      const [profileRes, entriesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle(),
        supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3),
      ])
      if (cancelled) return

      let resolvedProfile = profileRes.data as Profile | null
      if (!resolvedProfile) {
        const createRes = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email!,
            display_name: session.user.email?.split('@')[0],
            subscription_tier: 'foundation',
          })
          .select()
          .single()
        if (!cancelled) {
          resolvedProfile = (createRes.data as Profile | null) ?? resolvedProfile
        }
      }

      if (cancelled) return
      setProfile(resolvedProfile)
      setRecentEntries(entriesRes.data || [])
      setReady(true)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router, supabase])

  // Pre-session state resolves instantly (local storage); paint a bare shell.
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Paint the app shell immediately; content streams in behind a skeleton.
  return (
    <DashboardLayout user={user} profile={profile}>
      {ready && profile ? (
        <DashboardV3 user={user} profile={profile} recentEntries={recentEntries} />
      ) : (
        <DashboardSkeleton />
      )}
    </DashboardLayout>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-3 pt-4 animate-pulse" aria-busy="true">
      <div className="flex gap-2">
        <div className="flex-1 bg-green-50 rounded-lg px-4 py-2.5 h-10" />
        <div className="flex-1 bg-red-50 rounded-lg px-4 py-2.5 h-10" />
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg px-5 py-3 h-12" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-2.5 h-16" />
        ))}
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 h-12" />
      <div className="grid md:grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-3 h-16" />
        ))}
      </div>
    </div>
  )
}