'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import AffirmationCard from '@/components/reality-anchor/AffirmationCard'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AffirmationsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [affirmations, setAffirmations] = useState<any[]>([])
  const [category, setCategory] = useState('morning')
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

  useEffect(() => {
    const loadAffirmations = async () => {
      try {
        const { data, error } = await supabase
          .from('affirmations')
          .select('*')
          .eq('category', category)
          .eq('is_default', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading affirmations:', error)
        } else {
          setAffirmations(data || [])
        }
      } catch (error) {
        console.error('Error loading affirmations:', error)
      }
    }

    loadAffirmations()
  }, [category, supabase])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Affirmations</h1>
            <p className="text-gray-600 mt-2">Browse affirmations by category</p>
          </div>
          <Link 
            href="/wellness" 
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            â† Back to Wellness
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['morning', 'boundary', 'self-compassion', 'strength', 'clarity', 'peace'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat === 'self-compassion' ? 'Self-Compassion' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Affirmations Grid */}
        <div className="grid gap-4">
          {affirmations.length > 0 ? (
            affirmations.map((aff) => (
              <AffirmationCard
                key={aff.id}
                id={aff.id}
                text={aff.text}
                category={aff.category}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              No affirmations found for this category
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
