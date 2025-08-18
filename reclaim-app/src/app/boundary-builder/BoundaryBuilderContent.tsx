'use client'

import { useState } from 'react'
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
  const [boundaries, setBoundaries] = useState<Boundary[]>([
    {
      id: '1',
      category: 'communication',
      statement: 'I will not engage in conversations that involve yelling or name-calling',
      isActive: true,
      createdAt: '2025-01-15'
    },
    {
      id: '2',
      category: 'emotional',
      statement: 'I will not take responsibility for other people\'s emotions',
      isActive: true,
      createdAt: '2025-01-14'
    }
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customBoundary, setCustomBoundary] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('communication')
  const [showAddForm, setShowAddForm] = useState(false)

  const addBoundary = (statement: string, category: string) => {
    const newBoundary: Boundary = {
      id: Date.now().toString(),
      category,
      statement,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setBoundaries([...boundaries, newBoundary])
    setCustomBoundary('')
    setShowAddForm(false)
  }

  const toggleBoundary = (id: string) => {
    setBoundaries(boundaries.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ))
  }

  const deleteBoundary = (id: string) => {
    setBoundaries(boundaries.filter(b => b.id !== id))
  }

  const getCategoryInfo = (categoryId: string) => {
    return boundaryTemplates.find(t => t.id === categoryId) || boundaryTemplates[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-indigo-600" />
          Boundary Builder
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Create and maintain healthy boundaries to protect your well-being and establish clear expectations in your relationships.
        </p>
      </div>

      {/* Your Boundaries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Boundaries</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Boundary
          </button>
        </div>

        {boundaries.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No boundaries set yet. Start by adding your first boundary!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {boundaries.map((boundary) => {
              const categoryInfo = getCategoryInfo(boundary.category)
              const IconComponent = categoryInfo.icon
              return (
                <div key={boundary.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 ${!boundary.isActive ? 'line-through opacity-50' : ''}`}>
                        {boundary.statement}
                      </p>
                      <p className="text-sm text-gray-500">
                        {categoryInfo.title} • Created {new Date(boundary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBoundary(boundary.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        boundary.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={boundary.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBoundary(boundary.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Boundary</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
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
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addBoundary(customBoundary, selectedCategory)}
                  disabled={!customBoundary.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Boundary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Boundary Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
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
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {template.examples.map((example, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{example}</span>
                        <button
                          onClick={() => {
                            addBoundary(example, template.id)
                            setSelectedTemplate(null)
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
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
