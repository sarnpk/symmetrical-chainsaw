'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import RealityLogForm from '@/components/reality-anchor/RealityLogForm'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NewRealityLogPage() {
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

  if (!user || !profile) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Reality Anchor Entry</h1>
          <p className="text-gray-600 mt-2">Document facts about what happened</p>
        </div>

        <RealityLogForm user={user} />
      </div>
    </DashboardLayout>
  )
}
