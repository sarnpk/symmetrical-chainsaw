'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

const NPD_TRAIT_DESCRIPTIONS: Record<string, string> = {
  'Playing the Victim': 'When you set a boundary or ask for help, she responds with victimhood to make you feel guilty and take responsibility instead.',
  'Gaslighting': 'She denies things happened, makes you question your memory, and insists you\'re "making things up" or "too sensitive".',
  'Triangulation': 'She brings a third person into conflicts to make you jealous, insecure, or to validate her perspective over yours.',
  'Love-bombing': 'She showers you with attention, gifts, and affection early on, then withdraws it to keep you off-balance.',
  'Hoovering': 'She tries to pull you back in after a breakup or distance with promises of change or sudden kindness.',
  'Flying Monkeys': 'She uses others (kids, family, friends) to attack you, spy on you, or deliver messages on her behalf.',
  'Covert Criticism': 'She disguises criticism as concern or jokes, making you feel bad while maintaining plausible deniability.',
  'Boundary Violations': 'She ignores your stated limits, invades your privacy, or disrespects your personal space.',
  'Withholding Affection/Resources': 'She uses love, money, or support as a weapon to punish you or control your behavior.',
  'Emotional Manipulation': 'She uses your emotions against you to get what she wants or to avoid accountability.',
}

export default function RealityLogEntryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entry, setEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const params = useParams()
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
    }

    getUser()
  }, [router, supabase])

  useEffect(() => {
    const loadEntry = async () => {
      if (!user?.id || !params.id) return
      
      try {
        const { data, error } = await supabase
          .from('reality_log_entries')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error loading entry:', error)
          router.push('/reality-log')
        } else {
          setEntry(data)
        }
      } catch (error) {
        console.error('Error loading entry:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && params.id) {
      loadEntry()
    }
  }, [params.id, user?.id, supabase, router])

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return
    if (!user?.id) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('reality_log_entries')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id)

      if (!error) {
        router.push('/reality-log')
      } else {
        console.error('Error deleting:', error)
        setDeleting(false)
      }
    } catch (error) {
      console.error('Error deleting:', error)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile || !entry) {
    return null
  }

  const traitDescription = NPD_TRAIT_DESCRIPTIONS[entry.npd_trait] || ''

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/reality-log"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Reality Log
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/reality-log/${entry.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Entry Details */}
        <Card>
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date */}
            <div>
              <p className="text-sm text-gray-600">📅 Date</p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Event */}
            <div>
              <p className="text-sm text-gray-600">🎯 Event</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{entry.event}</p>
            </div>

            {/* Fact */}
            <div>
              <p className="text-sm text-gray-600">📋 Fact</p>
              <p className="text-gray-700 mt-1 leading-relaxed">{entry.fact}</p>
            </div>

            {/* NPD Trait */}
            <div>
              <p className="text-sm text-gray-600">🏷️ NPD Trait</p>
              <p className="text-lg font-medium text-indigo-600 mt-1">{entry.npd_trait}</p>
            </div>

            {/* Pattern */}
            {entry.is_consistent && (
              <div>
                <p className="text-sm text-gray-600">📌 Pattern</p>
                <p className="text-gray-700 mt-1">✓ Consistent with past behavior</p>
                {entry.pattern_note && (
                  <p className="text-gray-600 mt-2 italic">{entry.pattern_note}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reality Check */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Reality Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-gray-900">
                This is consistent with the Covert NPD trait of:
              </p>
              <p className="text-lg font-semibold text-indigo-600 mt-2">"{entry.npd_trait}"</p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">{traitDescription}</p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-900 font-medium">✅ Remember:</p>
              <p className="text-green-800 mt-2">
                This is NOT your fault. This is her pattern. You are not crazy. You documented this.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
