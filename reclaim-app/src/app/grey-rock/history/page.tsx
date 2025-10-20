'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { createClient, Profile, GreyRockSession } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

export default function GreyRockHistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<GreyRockSession[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      setProfile(profile as Profile | null)

      const { data: sessionsData } = await supabase
        .from('grey_rock_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
      setSessions((sessionsData as GreyRockSession[]) || [])
      setLoading(false)
    }
    run()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">
        Please sign in to view your history.
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Grey Rock Practice History</h1>
            <p className="text-sm text-gray-600 mt-1">Review your recent sessions and drill into attempts.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/grey-rock" className="inline-flex items-center justify-center h-10 px-4 rounded-lg border shadow-sm bg-white text-gray-900 hover:bg-gray-50">
              Back to Practice
            </Link>
          </div>
        </div>

        {/* Content */}
        {sessions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
            No sessions yet. Start your first practice on the Grey Rock page.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {sessions.map((s) => {
                const started = new Date(s.started_at)
                const duration = s.duration_ms ? Math.round((s.duration_ms as number)/1000) : null
                return (
                  <div key={s.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{started.toLocaleString()}</div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.mode === 'practice' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{s.mode}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">Score: {s.correct_count}/{s.total_attempts}</div>
                    <div className="mt-1 text-xs text-gray-500">Duration: {duration ? `${duration}s` : '-'}</div>
                    <div className="mt-3">
                      <Link href={`/grey-rock/history/${s.id}`} className="inline-flex h-9 px-3 items-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700">View details</Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3"/>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {sessions.map((s) => {
                    const started = new Date(s.started_at)
                    const duration = s.duration_ms ? Math.round((s.duration_ms as number)/1000) : null
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">{started.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.mode === 'practice' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{s.mode}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{s.correct_count}/{s.total_attempts}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{duration ? `${duration}s` : '-'}</td>
                        <td className="px-6 py-3 text-right">
                          <Link href={`/grey-rock/history/${s.id}`} className="inline-flex h-9 px-3 items-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700">View</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
