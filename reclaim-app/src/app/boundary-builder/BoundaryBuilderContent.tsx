'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Heart,
  Users,
  Briefcase,
  MessageCircle,
  Clock,
  Target
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

// Mock data for demonstration
const boundaryTemplates = [
  {
    id: 'communication',
    title: 'Communication Boundaries',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-600',
    examples: [
      'I will not engage in conversations that involve yelling or name-calling',
      'I will not respond to messages immediately if I need time to think',
      'I will not discuss certain topics that are triggering for me',
      'I will end conversations that become disrespectful',
      'I will not accept blame for things that are not my responsibility'
    ]
  },
  {
    id: 'emotional',
    title: 'Emotional Boundaries',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    examples: [
      'I will not take responsibility for other people\'s emotions',
      'I will not allow others to guilt-trip me into doing things',
      'I will not suppress my own feelings to keep others comfortable',
      'I will not accept emotional manipulation or gaslighting',
      'I will prioritize my emotional well-being'
    ]
  },
  {
    id: 'time',
    title: 'Time Boundaries',
    icon: Clock,
    color: 'bg-green-100 text-green-600',
    examples: [
      'I will not be available 24/7 for non-emergency situations',
      'I will schedule specific times for difficult conversations',
      'I will not cancel my plans to accommodate last-minute demands',
      'I will take breaks when I need them',
      'I will not work beyond my designated hours'
    ]
  },
  {
    id: 'physical',
    title: 'Physical Boundaries',
    icon: Shield,
    color: 'bg-purple-100 text-purple-600',
    examples: [
      'I will not tolerate any form of physical intimidation',
      'I will maintain my personal space',
      'I will not allow unwanted physical contact',
      'I will remove myself from unsafe situations',
      'I will respect my body\'s need for rest and care'
    ]
  },
  {
    id: 'social',
    title: 'Social Boundaries',
    icon: Users,
    color: 'bg-yellow-100 text-yellow-600',
    examples: [
      'I will choose who I spend my time with',
      'I will not attend events that make me uncomfortable',
      'I will not tolerate disrespectful behavior from others',
      'I will maintain relationships that are healthy and supportive',
      'I will not engage in gossip or drama'
    ]
  },
  {
    id: 'financial',
    title: 'Financial Boundaries',
    icon: Briefcase,
    color: 'bg-indigo-100 text-indigo-600',
    examples: [
      'I will not lend money I cannot afford to lose',
      'I will not allow others to control my financial decisions',
      'I will not feel guilty about spending money on my needs',
      'I will not be financially responsible for other adults',
      'I will maintain transparency about my financial boundaries'
    ]
  }
]

interface Boundary {
  id: string
  category: string
  statement: string
  isActive: boolean
  createdAt: string
}

export default function BoundaryBuilderContent() {
  const supabase = createClient()
  const [boundaries, setBoundaries] = useState<Boundary[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customBoundary, setCustomBoundary] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('communication')
  const [showAddForm, setShowAddForm] = useState(false)

  // Map UI category to DB enum (schema doesn't have 'financial')
  const mapCategoryToDb = (cat: string): 'communication' | 'emotional' | 'physical' | 'time' | 'social' | 'workplace' => {
    if (cat === 'financial') return 'workplace'
    return cat as any
  }

  // Load existing boundaries from DB
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data, error } = await supabase
          .from('boundaries')
          .select('*')
          .order('updated_at', { ascending: false })
        if (error) throw error
        const mapped: Boundary[] = (data || []).map((row: any) => ({
          id: row.id,
          category: row.category,
          statement: row.title,
          isActive: !!row.is_active,
          createdAt: row.created_at,
        }))
        setBoundaries(mapped)
      } catch (err: any) {
        console.error('Failed to load boundaries', err)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addBoundary = async (statement: string, category: string) => {
    const dbCategory = mapCategoryToDb(category)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData?.user?.id
      if (!uid) {
        toast.error('Please sign in')
        return
      }
      const { data, error } = await supabase
        .from('boundaries')
        .insert({
          title: statement,
          description: '',
          category: dbCategory,
          priority: 'medium',
          status: 'active',
          is_active: true,
          user_id: uid,
        })
        .select('*')
        .single()
      if (error) throw error
      const row = data as any
      const newBoundary: Boundary = {
        id: row.id,
        category: row.category,
        statement: row.title,
        isActive: !!row.is_active,
        createdAt: row.created_at,
      }
      setBoundaries(prev => [newBoundary, ...prev])
      setCustomBoundary('')
      setShowAddForm(false)
      toast.success('Boundary added')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to add boundary')
    }
  }

  const toggleBoundary = async (id: string) => {
    const current = boundaries.find(b => b.id === id)
    if (!current) return
    const nextActive = !current.isActive
    // optimistic update
    setBoundaries(prev => prev.map(b => b.id === id ? { ...b, isActive: nextActive } : b))
    try {
      const { data, error } = await supabase
        .from('boundaries')
        .update({
          is_active: nextActive,
          status: nextActive ? 'active' : 'needs-attention',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      const row = data as any
      setBoundaries(prev => prev.map(b => b.id === id ? {
        ...b,
        isActive: !!row.is_active,
      } : b))
      toast.success(nextActive ? 'Boundary activated' : 'Boundary deactivated')
    } catch (err: any) {
      // revert
      setBoundaries(prev => prev.map(b => b.id === id ? { ...b, isActive: current.isActive } : b))
      console.error(err)
      toast.error(err.message || 'Failed to update boundary')
    }
  }

  const deleteBoundary = async (id: string) => {
    if (!confirm('Delete this boundary?')) return
    const prev = boundaries
    // optimistic remove
    setBoundaries(prev.filter(b => b.id !== id))
    try {
      const { error } = await supabase.from('boundaries').delete().eq('id', id)
      if (error) throw error
      toast.success('Boundary deleted')
    } catch (err: any) {
      // revert
      setBoundaries(prev)
      console.error(err)
      toast.error(err.message || 'Failed to delete boundary')
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return boundaryTemplates.find(t => t.id === categoryId) || boundaryTemplates[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <Shield className="h-8 w-8 text-indigo-600" />
          Boundary Builder
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
          Create and maintain healthy boundaries to protect your well-being and establish clear expectations in your relationships.
        </p>
      </div>

      {/* Your Boundaries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Boundaries</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Boundary
          </button>
        </div>

        {boundaries.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No boundaries set yet. Start by adding your first boundary!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {boundaries.map((boundary) => {
              const categoryInfo = getCategoryInfo(boundary.category)
              const IconComponent = categoryInfo.icon
              return (
                <div key={boundary.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 text-sm sm:text-base ${!boundary.isActive ? 'line-through opacity-50' : ''}`}>
                        {boundary.statement}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {categoryInfo.title} • Created {new Date(boundary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      href={`\/boundaries\/${boundary.id}`}
                      className="p-3 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Open"
                    >
                      <Target className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => toggleBoundary(boundary.id)}
                      className={`p-3 sm:p-2 rounded-lg transition-colors ${
                        boundary.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={boundary.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteBoundary(boundary.id)}
                      className="p-3 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Boundary Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-lg p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Boundary</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {boundaryTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boundary Statement
                </label>
                <textarea
                  value={customBoundary}
                  onChange={(e) => setCustomBoundary(e.target.value)}
                  placeholder="I will..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addBoundary(customBoundary, selectedCategory)}
                  disabled={!customBoundary.trim()}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Boundary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Boundary Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Boundary Templates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boundaryTemplates.map((template) => {
            const IconComponent = template.icon
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                </div>

                <div className="space-y-2">
                  {template.examples.slice(0, 2).map((example, index) => (
                    <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {example}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedTemplate(template.id)}
                  className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View All Examples
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-lg p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
            {(() => {
              const template = boundaryTemplates.find(t => t.id === selectedTemplate)!
              const IconComponent = template.icon
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{template.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {template.examples.map((example, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-gray-200 rounded-lg">
                        <span className="text-gray-700 text-sm sm:text-base">{example}</span>
                        <button
                          onClick={async () => {
                            await addBoundary(example, template.id)
                            setSelectedTemplate(null)
                          }}
                          className="w-full sm:w-auto text-indigo-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 border border-indigo-100 rounded-lg"
                        >
                          Add This
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
