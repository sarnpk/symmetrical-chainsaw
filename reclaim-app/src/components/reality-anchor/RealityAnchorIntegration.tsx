'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Anchor, 
  AlertTriangle, 
  BookOpen,
  Eye,
  Plus,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface NPDTrait {
  id: string
  name: string
  severity: string
}

interface PatternAlert {
  id: string
  alert_type: string
  trait_id: string
  frequency_count: number
  alert_message: string
  is_acknowledged: boolean
  created_at: string
}

interface JournalEntry {
  id: string
  title: string
  npd_traits_identified: string[]
  created_at: string
}

interface RealityAnchorIntegrationProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function RealityAnchorIntegration({ userId, subscriptionTier }: RealityAnchorIntegrationProps) {
  const [traits, setTraits] = useState<NPDTrait[]>([])
  const [patternAlerts, setPatternAlerts] = useState<PatternAlert[]>([])
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [realityCheckNote, setRealityCheckNote] = useState('')

  const supabase = createClient()
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    loadRealityAnchorData()
  }, [userId])

  const loadRealityAnchorData = async () => {
    try {
      // Load NPD traits
      const { data: traitsData } = await supabase
        .from('npd_traits')
        .select('id, name, severity')
        .order('name')

      setTraits(traitsData || [])

      if (hasAccess) {
        // Load pattern alerts
        const { data: alertsData } = await supabase
          .from('pattern_alerts')
          .select('*, npd_traits(name)')
          .eq('user_id', userId)
          .eq('is_acknowledged', false)
          .order('created_at', { ascending: false })

        // Load recent journal entries with NPD traits
        const { data: entriesData } = await supabase
          .from('journal_entries')
          .select('id, title, npd_traits_identified, created_at')
          .eq('user_id', userId)
          .not('npd_traits_identified', 'is', null)
          .order('created_at', { ascending: false })
          .limit(5)

        setPatternAlerts(alertsData || [])
        setRecentEntries(entriesData || [])
      }
    } catch (error) {
      console.error('Failed to load reality anchor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase
        .from('pattern_alerts')
        .update({ is_acknowledged: true })
        .eq('id', alertId)

      loadRealityAnchorData()
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const addRealityCheck = async () => {
    if (selectedTraits.length === 0 || !realityCheckNote.trim()) return

    try {
      // Create a reality check journal entry
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          title: 'Reality Check - ' + new Date().toLocaleDateString(),
          description: realityCheckNote,
          npd_traits_identified: selectedTraits,
          reality_check_notes: realityCheckNote,
          incident_date: new Date().toISOString().split('T')[0],
          safety_rating: 3,
          is_draft: false
        })

      if (!error) {
        setSelectedTraits([])
        setRealityCheckNote('')
        loadRealityAnchorData()
      }
    } catch (error) {
      console.error('Failed to add reality check:', error)
    }
  }

  const toggleTraitSelection = (traitId: string) => {
    setSelectedTraits(prev => 
      prev.includes(traitId) 
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    )
  }

  const getTraitName = (traitId: string) => {
    return traits.find(t => t.id === traitId)?.name || 'Unknown Trait'
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

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-blue-500" />
            Reality Anchor Integration
          </CardTitle>
          <CardDescription>Link journal entries with NPD traits for pattern recognition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <Anchor className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-purple-900 mb-2">Unlock Reality Anchor Integration</h3>
              <p className="text-sm text-purple-700 mb-4">
                Tag journal entries with NPD traits and get pattern alerts
              </p>
              <Link 
                href="/subscription"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Upgrade to Recovery
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pattern Alerts */}
      {patternAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Pattern Alerts ({patternAlerts.length})
            </CardTitle>
            <CardDescription className="text-orange-700">
              Repeated NPD traits detected in your journal entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patternAlerts.map((alert) => (
                <div key={alert.id} className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-orange-900">
                        {alert.alert_message}
                      </div>
                      <div className="text-sm text-orange-700">
                        Frequency: {alert.frequency_count} times recently
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-xs px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reality Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-500" />
            Quick Reality Check
          </CardTitle>
          <CardDescription>Document what you're experiencing right now</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What NPD traits are you experiencing?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {traits.slice(0, 9).map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => toggleTraitSelection(trait.id)}
                  className={`p-2 text-xs border rounded-lg transition-colors ${
                    selectedTraits.includes(trait.id)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  {trait.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reality check notes
            </label>
            <textarea
              value={realityCheckNote}
              onChange={(e) => setRealityCheckNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What happened? Stick to facts, not feelings..."
            />
          </div>

          <button
            onClick={addRealityCheck}
            disabled={selectedTraits.length === 0 || !realityCheckNote.trim()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Reality Check
          </button>
        </CardContent>
      </Card>

      {/* Recent Tagged Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Recent Tagged Entries
          </CardTitle>
          <CardDescription>Journal entries with identified NPD traits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry) => (
                <div key={entry.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.npd_traits_identified?.map((traitId) => (
                      <span
                        key={traitId}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full"
                      >
                        {getTraitName(traitId)}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/journal/${entry.id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View entry â†’
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tagged entries yet</p>
                <p className="text-sm">Start tagging journal entries with NPD traits to see patterns</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NPD Trait Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-blue-500" />
            NPD Trait Quick Reference
          </CardTitle>
          <CardDescription>Common traits to watch for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {traits.slice(0, 8).map((trait) => (
              <div key={trait.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{trait.name}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trait.severity === 'severe' ? 'bg-red-100 text-red-700' :
                    trait.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {trait.severity}
                  </span>
                </div>
                <Link 
                  href={`/npd-traits/${trait.id}`}
                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 block"
                >
                  Learn more â†’
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              href="/npd-traits"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all NPD traits â†’
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}