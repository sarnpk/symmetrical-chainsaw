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
      
      // Get or create user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            display_name: user.email?.split('@')[0],
            subscription_tier: 'foundation',
          })
          .select()
          .single()
        
        if (!error) {
          profile = newProfile
        }
      }
      
      setProfile(profile)
      
      // Get recent entries
      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      
      setRecentEntries(entries || [])
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
      <DashboardV3 user={user} profile={profile} recentEntries={recentEntries} />
    </DashboardLayout>
  )
}
