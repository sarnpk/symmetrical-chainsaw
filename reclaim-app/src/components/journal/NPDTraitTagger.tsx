'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Badge, X, Plus, Search, Lock, Zap } from 'lucide-react'

interface NPDTrait {
  id: string
  name: string
  description: string
  examples: string[]
}

interface NPDTraitTaggerProps {
  selectedTraits: string[]
  onTraitsChange: (traits: string[]) => void
  className?: string
}

export default function NPDTraitTagger({ selectedTraits, onTraitsChange, className = '' }: NPDTraitTaggerProps) {
  const [traits, setTraits] = useState<NPDTrait[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSelector, setShowSelector] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscriptionTier, setSubscriptionTier] = useState<string>('foundation')
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user subscription tier
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single()
          
          setSubscriptionTier(profile?.subscription_tier || 'foundation')
        }

        // Load NPD traits
        const { data, error } = await supabase
          .from('npd_traits')
          .select('*')
          .order('name')

        if (error) throw error
        setTraits(data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const filteredTraits = traits.filter(trait =>
    trait.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trait.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedTraitObjects = traits.filter(trait => selectedTraits.includes(trait.id))

  const handleTraitToggle = (traitId: string) => {
    // Only allow trait selection for Recovery+ users
    if (subscriptionTier === 'foundation') {
      return // Prevent selection for Foundation users
    }
    
    if (selectedTraits.includes(traitId)) {
      onTraitsChange(selectedTraits.filter(id => id !== traitId))
    } else {
      onTraitsChange([...selectedTraits, traitId])
    }
  }

  const handleRemoveTrait = (traitId: string) => {
    onTraitsChange(selectedTraits.filter(id => id !== traitId))
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Show upgrade prompt for Foundation users
  if (subscriptionTier === 'foundation') {
    return (
      <div className={`${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NPD Traits Identified
        </label>
        
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
          <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Recovery+ Feature
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tag specific NPD traits to track patterns and build stronger evidence for your recovery journey.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            onClick={() => window.open('/subscription', '_blank')}
          >
            <Zap className="h-4 w-4" />
            Upgrade to Recovery+
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        NPD Traits Identified
        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
          <Zap className="h-3 w-3" />
          Recovery+
        </span>
      </label>
      
      {/* Selected Traits */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTraitObjects.map(trait => (
          <div
            key={trait.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
          >
            <Badge className="h-3 w-3" />
            <span>{trait.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveTrait(trait.id)}
              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" />
          Add Trait
        </button>
      </div>

      {/* Trait Selector */}
      {showSelector && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search traits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredTraits.map(trait => (
              <div
                key={trait.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTraits.includes(trait.id)
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTraitToggle(trait.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{trait.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{trait.description}</p>
                  </div>
                  {selectedTraits.includes(trait.id) && (
                    <Badge className="h-4 w-4 text-red-600 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Tag specific NPD traits you observed to help identify patterns over time
      </p>
    </div>
  )
}