'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import PersonalizationStep, { PersonalizationData } from '@/components/onboarding/PersonalizationStep'
import { User } from '@supabase/supabase-js'

export default function PersonalizationPage() {
  const [user, setUser] = useState<User | null>(null)
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
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleComplete = async (data: PersonalizationData) => {
    if (!user) return

    try {
      const response = await fetch('/api/affirmation-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          has_children: data.hasChildren,
          children_count: data.childrenCount,
          custody_situation: data.custodyArrangement,
          preferred_focus: data.preferredFocus
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PersonalizationStep onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  )
}