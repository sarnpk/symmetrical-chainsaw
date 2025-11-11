'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, TrendingDown, Brain, Sparkles, Trash2, Image, Mic, FileText } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Belief {
  id: string
  belief_text: string
  current_strength: number
  initial_strength: number
  created_at: string
  counter_evidence: any[]
  belief_strength_log: any[]
}

export default function BeliefDetailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [belief, setBelief] = useState<Belief | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)
  const [evidenceText, setEvidenceText] = useState('')
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [memoryText, setMemoryText] = useState('')
  const [memoryAnalysis, setMemoryAnalysis] = useState<any>(null)
  const [analyzingMemories, setAnalyzingMemories] = useState(false)
  const [newStrength, setNewStrength] = useState(5)
  const [showStrengthUpdate, setShowStrengthUpdate] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const loadBelief = async () => {
    const response = await fetch(`/api/belief-reframe/${params.id}`)
    const data = await response.json()
    if (data.belief) {
      setBelief(data.belief)
      setNewStrength(data.belief.current_strength)
    }
  }

  useEffect(() => {
    const init = async () => {
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

      await loadBelief()
      setLoading(false)
    }
    init()
  }, [params.id, router, supabase])

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evidenceText.trim()) return

    const response = await fetch(`/api/belief-reframe/${params.id}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidence_text: evidenceText })
    })

    if (response.ok) {
      toast.success('Evidence added')
      setEvidenceText('')
      setShowEvidenceForm(false)
      await loadBelief()
    } else {
      toast.error('Failed to add evidence')
    }
  }

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memoryText.trim()) return

    const response = await fetch(`/api/belief-reframe/${params.id}/origin-memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memory_text: memoryText })
    })

    if (response.ok) {
      toast.success('Memory added')
      setMemoryText('')
      setShowMemoryForm(false)
      await loadBelief()
    } else {
      toast.error('Failed to add memory')
    }
  }

  const handleUpdateStrength = async () => {
    const response = await fetch(`/api/belief-reframe/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_strength: newStrength })
    })

    if (response.ok) {
      toast.success('Strength updated')
      setShowStrengthUpdate(false)
      await loadBelief()
    } else {
      toast.error('Failed to update strength')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || !profile || !belief) return null

  const strengthChange = belief.initial_strength - belief.current_strength
  const progressPercent = ((belief.initial_strength - belief.current_strength) / belief.initial_strength) * 100

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/belief-reframe" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Beliefs
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{belief.belief_text}</h1>
          <p className="text-gray-600 mt-2">Created {new Date(belief.created_at).toLocaleDateString()}</p>
        </div>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-800">Origin Memories</CardTitle>
                <p className="text-sm text-red-600 mt-1">When this belief was installed/reinforced</p>
              </div>
              <button
                onClick={() => setShowMemoryForm(!showMemoryForm)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Memory
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showMemoryForm && (
              <form onSubmit={handleAddMemory} className="p-4 bg-white rounded-lg border border-red-200 space-y-3">
                <textarea
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  placeholder="Describe when/how this belief was installed... (e.g., 'She told me I was unlovable during argument on Dec 2023')" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMemoryForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    Add Memory
                  </button>
                </div>
              </form>
            )}

            {belief.origin_memories && belief.origin_memories.length > 0 ? (
              <>
                <button
                  onClick={async () => {
                    setAnalyzingMemories(true)
                    const res = await fetch(`/api/belief-reframe/${params.id}/origin-memories/ai-analyze`, { method: 'POST' })
                    if (res.ok) {
                      const data = await res.json()
                      setMemoryAnalysis(data.analysis)
                      toast.success('Analysis complete')
                    } else {
                      toast.error('Failed to analyze')
                    }
                    setAnalyzingMemories(false)
                  }}
                  disabled={analyzingMemories}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Brain className="h-4 w-4" />
                  {analyzingMemories ? 'Analyzing...' : 'AI Analyze Memories'}
                </button>

                {memoryAnalysis && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
                    <h4 className="font-semibold text-purple-900">AI Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-purple-800">Pattern:</span>
                        <p className="text-gray-700 mt-1">{memoryAnalysis.pattern}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Manipulation Tactics:</span>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                          {memoryAnalysis.manipulation_tactics?.map((tactic: string, i: number) => (
                            <li key={i}>{tactic}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Reality Check:</span>
                        <p className="text-gray-700 mt-1">{memoryAnalysis.reality_check}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Healing Insight:</span>
                        <p className="text-green-700 mt-1 font-medium">{memoryAnalysis.healing_insight}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                {belief.origin_memories.map((memory: any) => (
                  <div key={memory.id} className="p-4 bg-white rounded-lg border border-red-200 flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-900">{memory.memory_text}</p>
                      {memory.memory_date && (
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(memory.memory_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this memory?')) {
                          const res = await fetch(`/api/belief-reframe/${params.id}/origin-memories?memoryId=${memory.id}`, { method: 'DELETE' })
                          if (res.ok) {
                            toast.success('Memory deleted')
                            await loadBelief()
                          } else {
                            toast.error('Failed to delete')
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center py-4 text-sm">
                No origin memories yet. Add memories of when this belief was installed.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{belief.current_strength}/10</div>
                {strengthChange > 0 && (
                  <div className="text-green-600 flex items-center gap-1 mt-1">
                    <TrendingDown className="h-4 w-4" />
                    Down {strengthChange} from {belief.initial_strength}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowStrengthUpdate(!showStrengthUpdate)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Update Strength
              </button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all" 
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              ></div>
            </div>

            {showStrengthUpdate && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newStrength}
                  onChange={(e) => setNewStrength(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New strength: {newStrength}/10</span>
                  <button
                    onClick={handleUpdateStrength}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Counter-Evidence ({belief.counter_evidence?.length || 0})</CardTitle>
              <button
                onClick={() => setShowEvidenceForm(!showEvidenceForm)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Evidence
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showEvidenceForm && (
              <form onSubmit={handleAddEvidence} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <textarea
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Describe evidence that contradicts this belief..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Add Evidence
                  </button>
                </div>
              </form>
            )}

            {belief.counter_evidence && belief.counter_evidence.length > 0 ? (
              <div className="space-y-3">
                {belief.counter_evidence.map((evidence: any) => (
                  <div key={evidence.id} className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-900">{evidence.evidence_text}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {evidence.evidence_source === 'journal' ? 'From journal entry' : 'Manual entry'} • 
                        {' '}{new Date(evidence.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this evidence?')) {
                          const res = await fetch(`/api/belief-reframe/${params.id}/evidence?evidenceId=${evidence.id}`, { method: 'DELETE' })
                          if (res.ok) {
                            toast.success('Evidence deleted')
                            await loadBelief()
                          } else {
                            toast.error('Failed to delete')
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete evidence"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No counter-evidence yet. Add evidence that contradicts this belief.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-purple-800">AI-Powered Tools</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 mb-4">
              Use AI to guide your healing journey with personalized support.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <Link href={`/belief-reframe/${params.id}/reality-test`}>
                <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Reality Testing
                </button>
              </Link>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/belief-reframe/${params.id}/ai-affirmation`, { method: 'POST' })
                  if (res.ok) {
                    toast.success('Affirmation generated!')
                    await loadBelief()
                  }
                }}
                className="w-full border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate Affirmation
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Manual Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Continue challenging this belief by collecting more counter-evidence and updating your belief strength regularly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEvidenceForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Add More Evidence
              </button>
              <button
                onClick={() => setShowStrengthUpdate(true)}
                className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 text-sm"
              >
                Update Strength
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
