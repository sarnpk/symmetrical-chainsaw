'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient, Profile, GreyRockSession, GreyRockAttempt } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

export default function GreyRockSessionDetailPage() {
  const params = useParams<{ id: string }>()
  const sessionId = params?.id
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<GreyRockSession | null>(null)
  const [attempts, setAttempts] = useState<GreyRockAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !sessionId) {
        setLoading(false)
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      setProfile(profile as Profile | null)

      const { data: sess } = await supabase
        .from('grey_rock_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle()
      setSession(sess as GreyRockSession | null)

      const { data: attemptsData } = await supabase
        .from('grey_rock_attempts')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      setAttempts((attemptsData as GreyRockAttempt[]) || [])

      setLoading(false)
    }
    run()
  }, [sessionId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-700 gap-4">
        <div>Session not found or you are not signed in.</div>
        <Link href="/grey-rock/history" className="text-indigo-600 hover:text-indigo-800 underline">Back to History</Link>
      </div>
    )
  }

  const duration = session.duration_ms ? Math.round((session.duration_ms as number)/1000) : null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Session Details</h1>
            <p className="text-sm text-gray-600">Started: {new Date(session.started_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/grey-rock/history" className="inline-flex items-center justify-center h-10 px-4 rounded-lg border shadow-sm bg-white text-gray-900 hover:bg-gray-50">Back to History</Link>
            <Link href="/grey-rock" className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Practice Again</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Mode</div>
            <div className="mt-1">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${session.mode === 'practice' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{session.mode}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-gray-900 font-medium mt-1">{session.correct_count}/{session.total_attempts}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-gray-900 font-medium mt-1">{duration ? `${duration}s` : '-'}</div>
          </div>
        </div>

        {/* Attempts */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">Attempts</div>
          {attempts.length === 0 ? (
            <div className="p-4 text-gray-600">No attempts recorded.</div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-100">
                {attempts.map((a) => (
                  <div key={a.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{(a.metadata as any)?.scenario_title || a.scenario_id}</div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${a.is_correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{a.is_correct ? 'Correct' : 'Incorrect'}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{new Date(a.created_at).toLocaleTimeString()} • {a.difficulty || '-'} • {a.latency_ms ? `${a.latency_ms} ms` : '-'}</div>
                    <div className="mt-2 text-sm text-gray-700">Selected: <span className="text-gray-900">{a.selected_response}</span></div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scenario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correct</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {attempts.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">{new Date(a.created_at).toLocaleTimeString()}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{(a.metadata as any)?.scenario_title || a.scenario_id}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{a.difficulty || '-'}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 truncate max-w-xs" title={a.selected_response}>{a.selected_response}</td>
                        <td className={`px-6 py-3 text-sm whitespace-nowrap ${a.is_correct ? 'text-green-700' : 'text-red-700'}`}>{a.is_correct ? 'Yes' : 'No'}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{a.latency_ms ? `${a.latency_ms} ms` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
