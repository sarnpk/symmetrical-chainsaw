'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  BarChart3,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface NPDTrait {
  id: string
  name: string
  category: string
  severity: string
}

interface TraitFrequency {
  trait_id: string
  trait_name: string
  occurrence_count: number
  last_occurrence: string
  intensity_average: number
}

interface PersonalExample {
  id: string
  trait_id: string
  personal_example: string
  date_occurred: string
  emotional_impact: string
}

interface EnhancedTraitLibraryProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function EnhancedTraitLibrary({ userId, subscriptionTier }: EnhancedTraitLibraryProps) {
  const [traits, setTraits] = useState<NPDTrait[]>([])
  const [frequencies, setFrequencies] = useState<TraitFrequency[]>([])
  const [examples, setExamples] = useState<PersonalExample[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)
  const [newExample, setNewExample] = useState({ example: '', date: '', impact: 'moderate' })

  const supabase = createClient()
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    loadTraitData()
  }, [userId])

  const loadTraitData = async () => {
    try {
      // Load all traits
      const { data: traitsData } = await supabase
        .from('npd_traits')
        .select('*')
        .order('name')

      setTraits(traitsData || [])

      if (hasAccess) {
        // Load frequency data
        const { data: frequencyData } = await supabase
          .from('trait_frequency_tracking')
          .select(`
            trait_id,
            npd_traits(name),
            occurrence_date,
            intensity_level
          `)
          .eq('user_id', userId)

        // Process frequency data
        const frequencyMap = new Map()
        frequencyData?.forEach((item: any) => {
          const traitId = item.trait_id
          if (!frequencyMap.has(traitId)) {
            frequencyMap.set(traitId, {
              trait_id: traitId,
              trait_name: item.npd_traits.name,
              occurrence_count: 0,
              last_occurrence: item.occurrence_date,
              intensity_sum: 0
            })
          }
          const freq = frequencyMap.get(traitId)
          freq.occurrence_count++
          freq.intensity_sum += item.intensity_level
          if (item.occurrence_date > freq.last_occurrence) {
            freq.last_occurrence = item.occurrence_date
          }
        })

        const processedFrequencies = Array.from(frequencyMap.values()).map(freq => ({
          ...freq,
          intensity_average: freq.intensity_sum / freq.occurrence_count
        }))

        setFrequencies(processedFrequencies)

        // Load personal examples
        const { data: examplesData } = await supabase
          .from('user_trait_examples')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        setExamples(examplesData || [])
      }
    } catch (error) {
      console.error('Failed to load trait data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPersonalExample = async () => {
    if (!selectedTrait || !newExample.example.trim()) return

    try {
      const { error } = await supabase
        .from('user_trait_examples')
        .insert({
          user_id: userId,
          trait_id: selectedTrait,
          personal_example: newExample.example,
          date_occurred: newExample.date || null,
          emotional_impact: newExample.impact
        })

      if (!error) {
        setNewExample({ example: '', date: '', impact: 'moderate' })
        setSelectedTrait(null)
        loadTraitData()
      }
    } catch (error) {
      console.error('Failed to add example:', error)
    }
  }

  const recordTraitOccurrence = async (traitId: string, intensity: number) => {
    try {
      await supabase
        .from('trait_frequency_tracking')
        .insert({
          user_id: userId,
          trait_id: traitId,
          occurrence_date: new Date().toISOString().split('T')[0],
          intensity_level: intensity
        })

      loadTraitData()
    } catch (error) {
      console.error('Failed to record occurrence:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trait Frequency Dashboard */}
      {hasAccess && frequencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-500" />
              Most Frequent Traits
            </CardTitle>
            <CardDescription>Patterns in your experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frequencies.slice(0, 5).map((freq) => (
                <div key={freq.trait_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{freq.trait_name}</div>
                    <div className="text-sm text-gray-600">
                      {freq.occurrence_count} times ⬢ Avg intensity: {freq.intensity_average.toFixed(1)}/5
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Last seen</div>
                    <div className="text-sm font-medium">
                      {new Date(freq.last_occurrence).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Trait Tracker */}
      {hasAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" />
              Quick Trait Tracker
            </CardTitle>
            <CardDescription>Record when you experience these behaviors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {traits.slice(0, 6).map((trait) => (
                <div key={trait.id} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-2">{trait.name}</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => recordTraitOccurrence(trait.id, intensity)}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                        title={`Intensity ${intensity}/5`}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Examples */}
      {hasAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              Your Personal Examples
            </CardTitle>
            <CardDescription>Document specific instances you've experienced</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTrait && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                <div className="font-medium">
                  Adding example for: {traits.find(t => t.id === selectedTrait)?.name}
                </div>
                <textarea
                  placeholder="Describe what happened..."
                  value={newExample.example}
                  onChange={(e) => setNewExample(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newExample.date}
                    onChange={(e) => setNewExample(prev => ({ ...prev, date: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <select
                    value={newExample.impact}
                    onChange={(e) => setNewExample(prev => ({ ...prev, impact: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="mild">Mild Impact</option>
                    <option value="moderate">Moderate Impact</option>
                    <option value="severe">Severe Impact</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addPersonalExample}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add Example
                  </button>
                  <button
                    onClick={() => setSelectedTrait(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {examples.length > 0 ? (
                examples.slice(0, 5).map((example) => (
                  <div key={example.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">
                        {traits.find(t => t.id === example.trait_id)?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {example.date_occurred && new Date(example.date_occurred).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{example.personal_example}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      example.emotional_impact === 'severe' ? 'bg-red-100 text-red-700' :
                      example.emotional_impact === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {example.emotional_impact} impact
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No personal examples yet</p>
                  <p className="text-sm">Click on a trait below to add your first example</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trait Library Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            NPD Trait Library
          </CardTitle>
          <CardDescription>
            {hasAccess ? 'Click traits to add personal examples' : 'Educational resource for identifying manipulation tactics'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traits.map((trait) => {
              const frequency = frequencies.find(f => f.trait_id === trait.id)
              return (
                <div 
                  key={trait.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    hasAccess ? 'cursor-pointer hover:border-purple-300 hover:bg-purple-50' : ''
                  }`}
                  onClick={() => hasAccess && setSelectedTrait(trait.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{trait.name}</div>
                    <div className="flex gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trait.category === 'covert' ? 'bg-purple-100 text-purple-700' :
                        trait.category === 'overt' ? 'bg-blue-100 text-blue-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {trait.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trait.severity === 'severe' ? 'bg-red-100 text-red-700' :
                        trait.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {trait.severity}
                      </span>
                    </div>
                  </div>
                  
                  {frequency && (
                    <div className="text-xs text-gray-600 mb-2">
                      Experienced {frequency.occurrence_count} times
                    </div>
                  )}
                  
                  <Link 
                    href={`/npd-traits/${trait.id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View details â†’
                  </Link>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {!hasAccess && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-purple-900 mb-2">Unlock Enhanced Trait Tracking</h3>
            <p className="text-sm text-purple-700 mb-4">
              Track frequency, add personal examples, and identify patterns with Recovery plan
            </p>
            <Link 
              href="/subscription"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Upgrade to Recovery
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}