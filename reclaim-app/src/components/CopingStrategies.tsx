'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  Wind,
  Activity,
  Palette,
  Brain,
  Heart,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { copingTemplates } from '@/lib/copingTemplates'

interface CopingStrategiesProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

interface CopingStrategy {
  id: string
  strategy_name: string
  description: string
  effectiveness_rating: number
  category: string
  is_active: boolean
  created_at: string
}

const categoryIcons = {
  breathing: <Wind className="h-4 w-4" />,
  physical: <Activity className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  grounding: <Brain className="h-4 w-4" />,
  emotional: <Heart className="h-4 w-4" />,
  other: <Star className="h-4 w-4" />
}

const categoryColors = {
  breathing: 'bg-blue-100 text-blue-700 border-blue-200',
  physical: 'bg-green-100 text-green-700 border-green-200',
  creative: 'bg-purple-100 text-purple-700 border-purple-200',
  grounding: 'bg-orange-100 text-orange-700 border-orange-200',
  emotional: 'bg-pink-100 text-pink-700 border-pink-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
}

export default function CopingStrategies({ userId, subscriptionTier }: CopingStrategiesProps) {
  const [strategies, setStrategies] = useState<CopingStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<CopingStrategy | null>(null)
  const [formData, setFormData] = useState({
    strategy_name: '',
    description: '',
    effectiveness_rating: 3,
    category: 'other'
  })
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAISuggest, setShowAISuggest] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<{
    strategy_name: string
    description: string
    category: string
    effectiveness_rating: number
    rationale?: string
  }>>([])
  const [aiContext, setAiContext] = useState<{
    mood?: number
    anxiety?: number
    energy?: number
    preferred_categories: string[]
    note?: string
  }>({ preferred_categories: [] })

  const supabase = createClient()

  // Check if user has access to coping strategies
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    if (hasAccess) {
      loadStrategies()
    }
  }, [hasAccess])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTemplates) setShowTemplates(false)
        if (showAISuggest) setShowAISuggest(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showTemplates, showAISuggest])

  useEffect(() => {
    if (hasAccess) {
      loadStrategies()
    }
    setLoading(false)
  }, [userId, hasAccess])

  const loadStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from('coping_strategies')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false })

      if (data && !error) {
        setStrategies(data)
      }
    } catch (error) {
      console.error('Failed to load coping strategies:', error)
    }
  }

  const handleSave = async () => {
    if (!hasAccess || !formData.strategy_name.trim()) return

    try {
      const strategyData = {
        user_id: userId,
        strategy_name: formData.strategy_name.trim(),
        description: formData.description.trim(),
        effectiveness_rating: formData.effectiveness_rating,
        category: formData.category,
        is_active: true
      }

      if (editingStrategy) {
        // Update existing strategy
        const { error } = await supabase
          .from('coping_strategies')
          .update(strategyData)
          .eq('id', editingStrategy.id)

        if (error) throw error
        toast.success('Coping strategy updated!')
      } else {
        // Create new strategy
        const { error } = await supabase
          .from('coping_strategies')
          .insert(strategyData)

        if (error) throw error
        toast.success('Coping strategy added!')
      }

      setFormData({
        strategy_name: '',
        description: '',
        effectiveness_rating: 3,
        category: 'other'
      })
      setShowAddForm(false)
      setEditingStrategy(null)
      await loadStrategies()
    } catch (error) {
      console.error('Failed to save coping strategy:', error)
      toast.error('Failed to save coping strategy')
    }
  }

  const handleEdit = (strategy: CopingStrategy) => {
    setEditingStrategy(strategy)
    setFormData({
      strategy_name: strategy.strategy_name,
      description: strategy.description,
      effectiveness_rating: strategy.effectiveness_rating,
      category: strategy.category
    })
    setShowAddForm(true)
  }

  const handleDelete = async (strategyId: string) => {
    if (!hasAccess) return

    try {
      const { error } = await supabase
        .from('coping_strategies')
        .update({ is_active: false })
        .eq('id', strategyId)

      if (error) throw error
      toast.success('Coping strategy removed!')
      await loadStrategies()
    } catch (error) {
      console.error('Failed to delete coping strategy:', error)
      toast.error('Failed to remove coping strategy')
    }
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingStrategy(null)
    setFormData({
      strategy_name: '',
      description: '',
      effectiveness_rating: 3,
      category: 'other'
    })
  }

  // Add from template
  const addFromTemplate = async (t: { strategy_name: string; description: string; category: string; effectiveness_rating: number }) => {
    if (!hasAccess) return
    try {
      const { error } = await supabase
        .from('coping_strategies')
        .insert({
          user_id: userId,
          strategy_name: t.strategy_name,
          description: t.description,
          category: t.category,
          effectiveness_rating: t.effectiveness_rating,
          is_active: true
        })
      if (error) throw error
      toast.success('Template added!')
      setShowTemplates(false)
      await loadStrategies()
    } catch (e) {
      console.error(e)
      toast.error('Failed to add template')
    }
  }

  // AI suggest
  const fetchAISuggestions = async (context?: { mood?: number; anxiety?: number; energy?: number; preferred_categories?: string[] }) => {
    try {
      setAiLoading(true)
      // keep modal open while generating
      const res = await fetch('/api/ai/suggest-coping-strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        const text = await res.text()
        throw new Error(`Unexpected response (not JSON): ${text.slice(0, 200)}`)
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI error')
      setAiSuggestions(data.suggestions || [])
    } catch (e) {
      console.error('AI suggest failed', e)
      toast.error('Failed to get AI suggestions')
      // keep modal so the user can try again
    } finally {
      setAiLoading(false)
    }
  }

  const addAISuggestion = async (s: { strategy_name: string; description: string; category: string; effectiveness_rating: number }) => {
    await addFromTemplate(s)
    setShowAISuggest(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <Heart className="h-5 w-5 text-green-500" />
            Coping Strategies
          </CardTitle>
          <CardDescription>Build your personal toolkit of coping mechanisms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">✨</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-purple-900 mb-1">
                  Unlock Coping Strategies with Recovery Plan
                </h4>
                <p className="text-sm text-purple-700 mb-3">
                  Create and track your personal coping strategies, rate their effectiveness, and build a toolkit for managing difficult moments.
                </p>
                <a
                  href="/subscription"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upgrade to Recovery
                  <span className="text-xs">→</span>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-500" />
              Coping Strategies
            </CardTitle>
            <CardDescription>Your personal toolkit for managing difficult moments</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap gap-y-2 justify-end">
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Templates
            </button>
            <button
              onClick={() => setShowAISuggest(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-indigo-300 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Suggest for me
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Strategy
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplates(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Choose a Template</h4>
                <button onClick={() => setShowTemplates(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                {copingTemplates.map((t, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[t.category as keyof typeof categoryColors]}`}>
                        {categoryIcons[t.category as keyof typeof categoryIcons]}
                        {t.category}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900">{t.strategy_name}</div>
                    <div className="text-sm text-gray-600 mb-2">{t.description}</div>
                    <button
                      onClick={() => addFromTemplate(t)}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Modal */}
        {showAISuggest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAISuggest(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">AI Suggestions</h4>
                <button onClick={() => setShowAISuggest(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              {/* Context inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mood (1–10)</label>
                  <input type="range" min={1} max={10} value={aiContext.mood ?? 5} onChange={(e) => setAiContext((c) => ({ ...c, mood: Number(e.target.value) }))} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Anxiety (1–10)</label>
                  <input type="range" min={1} max={10} value={aiContext.anxiety ?? 5} onChange={(e) => setAiContext((c) => ({ ...c, anxiety: Number(e.target.value) }))} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Energy (1–10)</label>
                  <input type="range" min={1} max={10} value={aiContext.energy ?? 5} onChange={(e) => setAiContext((c) => ({ ...c, energy: Number(e.target.value) }))} className="w-full" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">What's happening right now? (optional)</label>
                <textarea
                  value={aiContext.note ?? ''}
                  onChange={(e) => setAiContext((c) => ({ ...c, note: e.target.value }))}
                  rows={3}
                  placeholder="e.g., Had a stressful call; feeling overwhelmed and low energy"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-2">Preferred categories</label>
                <div className="flex flex-wrap gap-2">
                  {(['breathing','grounding','physical','creative','emotional','other'] as const).map((cat) => {
                    const active = aiContext.preferred_categories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAiContext((c) => ({
                          ...c,
                          preferred_categories: active
                            ? c.preferred_categories.filter((x) => x !== cat)
                            : [...c.preferred_categories, cat]
                        }))}
                        className={`px-2 py-1 rounded-full border text-xs ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => fetchAISuggestions(aiContext)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Generating…' : 'Generate suggestions'}
                </button>
              </div>
              {aiLoading ? (
                <div className="py-6 text-center text-gray-600">Generating suggestions…</div>
              ) : aiSuggestions.length === 0 ? (
                <div className="py-6 text-center text-gray-600">No suggestions returned</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                  {aiSuggestions.map((s, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[s.category as keyof typeof categoryColors] || categoryColors.other}`}>
                          {categoryIcons[s.category as keyof typeof categoryIcons] || categoryIcons.other}
                          {s.category}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900">{s.strategy_name}</div>
                      <div className="text-sm text-gray-600 mb-2">{s.description}</div>
                      {s.rationale && (
                        <div className="text-xs text-gray-500 mb-2">Why: {s.rationale}</div>
                      )}
                      <button
                        onClick={() => addAISuggestion(s)}
                        className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowAISuggest(false)}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {editingStrategy ? 'Edit Coping Strategy' : 'Add New Coping Strategy'}
              </h4>
              <button
                onClick={cancelForm}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strategy Name
              </label>
              <input
                type="text"
                value={formData.strategy_name}
                onChange={(e) => setFormData(prev => ({ ...prev, strategy_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Deep breathing exercise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Describe how to use this strategy..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="breathing">Breathing</option>
                  <option value="physical">Physical</option>
                  <option value="creative">Creative</option>
                  <option value="grounding">Grounding</option>
                  <option value="emotional">Emotional</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectiveness (1-5)
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, effectiveness_rating: rating }))}
                      className={`p-2 rounded ${
                        formData.effectiveness_rating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!formData.strategy_name.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingStrategy ? 'Update Strategy' : 'Add Strategy'}
              </button>
              <button
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Strategies List */}
        {strategies.length > 0 ? (
          <div className="space-y-3">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[strategy.category as keyof typeof categoryColors]}`}>
                        {categoryIcons[strategy.category as keyof typeof categoryIcons]}
                        {strategy.category}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-3 w-3 ${
                              strategy.effectiveness_rating >= rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{strategy.strategy_name}</h4>
                    {strategy.description && (
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(strategy)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(strategy.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No coping strategies yet</p>
            <p className="text-sm">Add your first strategy to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
