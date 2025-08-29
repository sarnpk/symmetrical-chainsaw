'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'
import { RefreshCw, Book, Target, Lock, Info } from 'lucide-react'

export default function GreyRockHelpPage() {
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
            <RefreshCw className="h-7 w-7 text-amber-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Grey Rock — Help</h1>
          </div>
          <Link href="/grey-rock" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Grey Rock →</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center text-gray-900 font-semibold">
            <Info className="h-5 w-5 text-amber-600" />
            <span className="ml-2">Technique Overview</span>
          </div>
          <p className="text-gray-600 text-sm">Grey Rock reduces conflict by offering brief, neutral, and boring responses. The goal is to deprive provocation of emotional fuel, not to win arguments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Book className="h-5 w-5 text-indigo-600" />
              <span className="ml-2">Learn vs Practice</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li><strong>Learn:</strong> Browse scenarios with explanations and model responses.</li>
              <li><strong>Practice:</strong> Test yourself; pick responses and see feedback.</li>
              <li>Use filters for pack and difficulty; search to find relevant scenarios.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Target className="h-5 w-5 text-emerald-600" />
              <span className="ml-2">Gamification & Limits</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Track streaks and pack progress as you practice.</li>
              <li>Some scenario packs require higher tiers; practice sessions may have daily limits.</li>
              <li>Accessibility: optional text-to-speech; toggle audio as needed.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">Safety first: Do not use Grey Rock if it escalates risk. Step away and use your Safety Plan when needed.</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
