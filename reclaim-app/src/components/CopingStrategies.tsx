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

  const supabase = createClient()

  // Check if user has access to coping strategies
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

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
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Strategy
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
