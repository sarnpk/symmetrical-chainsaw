'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Affirmation {
  id: string
  text: string
  category: string
  is_parent_focused: boolean
  target_audience: string[]
}

interface PersonalizedAffirmationSelectorProps {
  userId: string
  category: string
  onAffirmationSelected: (affirmation: Affirmation) => void
}

export default function PersonalizedAffirmationSelector({ 
  userId, 
  category, 
  onAffirmationSelected 
}: PersonalizedAffirmationSelectorProps) {
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getPersonalizedAffirmation = async () => {
      try {
        // Get user preferences and profile
        const { data: preferences } = await supabase
          .from('affirmation_preferences')
          .select('*')
          .eq('user_id', userId)
          .single()

        const { data: profile } = await supabase
          .from('profiles')
          .select('has_children')
          .eq('id', userId)
          .single()

        let affirmationQuery = supabase
          .from('affirmations')
          .select('*')
          .eq('category', category)
          .eq('is_default', true)

        // Prioritize parent-focused affirmations if user has children
        if (preferences?.has_children || profile?.has_children) {
          const { data: parentAffirmations } = await supabase
            .from('affirmations')
            .select('*')
            .eq('category', category)
            .eq('is_parent_focused', true)
            .eq('is_default', true)

          if (parentAffirmations && parentAffirmations.length > 0) {
            const selected = parentAffirmations[Math.floor(Math.random() * parentAffirmations.length)]
            setAffirmation(selected)
            onAffirmationSelected(selected)
            return
          }
        }

        // Fallback to general affirmations
        const { data: generalAffirmations } = await affirmationQuery.limit(10)
        if (generalAffirmations && generalAffirmations.length > 0) {
          const selected = generalAffirmations[Math.floor(Math.random() * generalAffirmations.length)]
          setAffirmation(selected)
          onAffirmationSelected(selected)
        }
      } catch (error) {
        console.error('Error fetching personalized affirmation:', error)
      }
    }

    getPersonalizedAffirmation()
  }, [userId, category, onAffirmationSelected, supabase])

  return null // This is a utility component that doesn't render anything
}