'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, Send, Copy, Trash2, Download, Loader, MessageSquare, MessageCircle, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'

interface Analysis {
  primaryType: string
  primaryConfidence: number
  traits: Record<string, number>
  manipulationTactics: string[]
  severityScore: number
  keyPhrases: Array<{
    phrase: string
    tactic: string
    explanation: string
  }>
  recommendedStrategies: string[]
}

interface ConversationAnalysis {
  overallAnalysis: {
    primaryType: string
    primaryConfidence: number
    traits: Record<string, number>
    severityScore: number
  }
  patterns: {
    recurringTactics: string[]
    cycleDetected: string
    escalationIndicators: string[]
    triggers: string[]
  }
  predictions: {
    likelyResponses: Array<{
      response: string
      probability: number
      reasoning: string
      emotionalImpact: string
    }>
    nextPhase: string
    timing: string
  }
}

const TRAIT_QUESTIONS = [
  { id: 'grandiosity', label: 'Constantly needs admiration and attention' },
  { id: 'entitlement', label: 'Believes they deserve special treatment' },
  { id: 'lack_empathy', label: 'Shows little concern for others\' feelings' },
  { id: 'manipulative', label: 'Uses manipulation to get what they want' },
  { id: 'rage', label: 'Becomes extremely angry when criticized' },
  { id: 'love_bombing', label: 'Showers with excessive praise then becomes cold' },
  { id: 'gaslighting', label: 'Denies things they clearly said or did' },
  { id: 'victim', label: 'Always plays the victim in conflicts' },
  { id: 'no_accountability', label: 'Never takes responsibility for mistakes' },
  { id: 'passive_aggressive', label: 'Uses sarcasm and indirect hostility' },
]

interface NarcissistDetectorContentProps {
  user: User | null
}

function NarcissistDetectorContent({ user }: NarcissistDetectorContentProps) {
  const [tab, setTab] = useState<'traits' | 'behavior' | 'message' | 'conversation'>('traits')
  const [inputText, setInputText] = useState('')
  const [conversationText, setConversationText] = useState('')
  const [behaviorDescription, setBehaviorDescription] = useState('')
  const [selectedTraits, setSelectedTraits] = useState<Record<string, boolean>>({})
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null)
  const [traitAnalysis, setTraitAnalysis] = useState<any>(null)
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null)
  const supabase = createClient()

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return
      const { data } = await supabase
        .from('narcissist_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      if (data) setHistory(data)
    }
    loadHistory()
  }, [user])

  // Save analysis to database
  const saveAnalysis = async (analysisData: any, inputType: string, inputText: string) => {
    if (!user) {
      console.log('No user found, cannot save analysis')
      return
    }
    
    try {
      console.log('Saving analysis:', { inputType, analysisData })
      
      // Map the analysis data to match database schema
      const insertData = {
        user_id: user.id,
        input_text: inputText.slice(0, 500), // Limit text length
        input_type: inputType,
        primary_type: analysisData.primaryType || 'Unknown',
        primary_confidence: Number(analysisData.primaryConfidence) || 0,
        traits_detected: analysisData.traits || {},
        manipulation_tactics: Array.isArray(analysisData.manipulationTactics) 
          ? analysisData.manipulationTactics 
          : (Array.isArray(analysisData.tactics) ? analysisData.tactics : []),
        severity_score: Number(analysisData.severityScore) || 5,
        key_phrases: Array.isArray(analysisData.keyPhrases) ? analysisData.keyPhrases : [],
        recommended_strategies: Array.isArray(analysisData.recommendedStrategies) 
          ? analysisData.recommendedStrategies 
          : (Array.isArray(analysisData.recommendations) ? analysisData.recommendations : [])
      }

      console.log('Insert data:', insertData)

      const { data: insertedData, error } = await supabase
        .from('narcissist_analyses')
        .insert(insertData)
        .select()
      
      if (error) {
        console.error('Database insert error:', error)
        toast.error(`Failed to save: ${error.message}`)
        return
      }

      console.log('Analysis saved successfully:', insertedData)
      toast.success('Analysis saved to history')

      // Reload history
      const { data: historyData } = await supabase
        .from('narcissist_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (historyData) {
        console.log('History loaded:', historyData)
        setHistory(historyData)
      }
    } catch (error) {
      console.error('Failed to save analysis:', error)
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleAnalyzeTraits = async () => {
    const selectedCount = Object.values(selectedTraits).filter(Boolean).length
    if (selectedCount === 0) {
      toast.error('Please select at least one trait')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/narcissist-detector/trait-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traits: selectedTraits }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setTraitAnalysis(result)
      await saveAnalysis(result, 'trait_checklist', Object.keys(selectedTraits).filter(k => selectedTraits[k]).join(', '))
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to analyze traits')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeBehavior = async () => {
    if (!behaviorDescription.trim()) {
      toast.error('Please describe the behaviors you\'ve observed')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/narcissist-detector/behavior-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: behaviorDescription }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setBehaviorAnalysis(result)
      await saveAnalysis(result, 'behavior_description', behaviorDescription)
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to analyze behaviors')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeMessage = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to analyze')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/narcissist-detector/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysis(result)
      await saveAnalysis(result, 'message', inputText)
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to analyze text')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeConversation = async () => {
    if (!conversationText.trim()) {
      toast.error('Please enter conversation to analyze')
      return
    }

    setLoading(true)
    try {
      const lines = conversationText.split('\n').filter(l => l.trim())
      const messages = lines.map(line => {
        if (line.startsWith('You:')) {
          return { role: 'user', content: line.replace('You:', '').trim() }
        } else if (line.startsWith('Them:')) {
          return { role: 'narcissist', content: line.replace('Them:', '').trim() }
        }
        return null
      }).filter(Boolean)

      if (messages.length === 0) {
        toast.error('Could not parse conversation. Use format: "You: message\\nThem: message"')
        setLoading(false)
        return
      }

      const response = await fetch('/api/narcissist-detector/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setConversationAnalysis(result)
      await saveAnalysis(result.overallAnalysis || result, 'conversation', conversationText.slice(0, 200))
      toast.success('Conversation analysis complete!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to analyze conversation')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800'
    if (score >= 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Overt':
        return 'bg-red-100 text-red-800'
      case 'Covert':
        return 'bg-yellow-100 text-yellow-800'
      case 'Malignant':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Modal */}
      {showModal && selectedHistoryItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Details</h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedHistoryItem.created_at).toLocaleString()} ⬢ {selectedHistoryItem.input_type}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Primary Type & Confidence */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Primary Type</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getTypeColor(selectedHistoryItem.primary_type)}`}>
                    {selectedHistoryItem.primary_type}
                  </div>
                  <div className={`text-sm font-medium mt-1 ${getConfidenceColor(selectedHistoryItem.primary_confidence)}`}>
                    {Math.round(selectedHistoryItem.primary_confidence)}% confidence
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Severity Score</h3>
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-lg font-semibold ${getSeverityColor(selectedHistoryItem.severity_score)}`}>
                      {selectedHistoryItem.severity_score}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Types - if available */}
              {(() => {
                // Try to get secondary types from different possible locations
                const secondaryTypes = selectedHistoryItem.secondary_types || 
                                     selectedHistoryItem.analysis_result?.secondaryTypes ||
                                     (selectedHistoryItem.traits_detected && typeof selectedHistoryItem.traits_detected === 'object' && 
                                      'secondaryTypes' in selectedHistoryItem.traits_detected ? 
                                      selectedHistoryItem.traits_detected.secondaryTypes : null)
                
                if (secondaryTypes && Array.isArray(secondaryTypes) && secondaryTypes.length > 0) {
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-3">Secondary Types</h3>
                      <div className="space-y-2">
                        {secondaryTypes.map((secondary: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="font-medium text-gray-900">{secondary.type}</span>
                            <span className={`text-sm font-semibold ${getConfidenceColor(secondary.confidence)}`}>
                              {Math.round(secondary.confidence)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })()}

              {/* Profile Analysis/Description - if available */}
              {(() => {
                const description = selectedHistoryItem.description || 
                                  selectedHistoryItem.analysis_result?.description ||
                                  (selectedHistoryItem.traits_detected && typeof selectedHistoryItem.traits_detected === 'object' && 
                                   'description' in selectedHistoryItem.traits_detected ? 
                                   selectedHistoryItem.traits_detected.description : null)
                
                if (description) {
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Profile Analysis</h3>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  )
                }
                return null
              })()}

              {/* Severity Score Progress Bar */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Severity Progress</h3>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      selectedHistoryItem.severity_score >= 8 ? 'bg-red-500' :
                      selectedHistoryItem.severity_score >= 5 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(selectedHistoryItem.severity_score / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Input Text */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Analyzed Text</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedHistoryItem.input_text}</p>
                </div>
              </div>

              {/* Traits Detected */}
              {selectedHistoryItem.traits_detected && Object.keys(selectedHistoryItem.traits_detected).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Traits Detected</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(selectedHistoryItem.traits_detected).map(([trait, value]: [string, any]) => (
                      <div key={trait} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-sm font-medium text-indigo-900 capitalize">
                          {trait.replace(/_/g, ' ')}
                        </div>
                        {typeof value === 'number' && (
                          <div className="text-xs text-indigo-600 mt-1">
                            {Math.round(value * 100)}% confidence
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manipulation Tactics */}
              {selectedHistoryItem.manipulation_tactics && selectedHistoryItem.manipulation_tactics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Manipulation Tactics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHistoryItem.manipulation_tactics.map((tactic: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Strategies */}
              {selectedHistoryItem.recommended_strategies && selectedHistoryItem.recommended_strategies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Recommended Strategies</h3>
                  <div className="space-y-2">
                    {selectedHistoryItem.recommended_strategies.map((strategy: string, idx: number) => (
                      <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200 flex gap-2">
                        <span className="text-green-600 font-bold">âœ“</span>
                        <span className="text-sm text-green-900">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedHistoryItem, null, 2))
                    toast.success('Analysis copied to clipboard')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this analysis?')) {
                      const { error } = await supabase
                        .from('narcissist_analyses')
                        .delete()
                        .eq('id', selectedHistoryItem.id)
                      
                      if (!error) {
                        toast.success('Analysis deleted')
                        setShowModal(false)
                        setHistory(history.filter(h => h.id !== selectedHistoryItem.id))
                      } else {
                        toast.error('Failed to delete')
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Narcissist Detector</h1>
              <Link 
                href="/docs/NARCISSIST_DETECTOR_GUIDE.md"
                target="_blank"
                className="text-indigo-600 hover:text-indigo-700"
                title="View User Guide"
              >
                <HelpCircle className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Analyze text to identify narcissistic patterns and manipulation tactics
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Educational Tool:</strong> This analysis is for educational purposes only and is not a professional diagnosis. Always consult with qualified professionals for medical or legal advice.
        </div>
      </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setTab('traits')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'traits'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            âœ“ Trait Checklist
          </button>
          <button
            onClick={() => setTab('behavior')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'behavior'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ðŸ“ Behavior Description
          </button>
          <button
            onClick={() => setTab('message')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'message'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Single Message
          </button>
          <button
            onClick={() => setTab('conversation')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'conversation'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Full Conversation
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tab === 'traits' && 'Select Traits You\'ve Observed'}
                {tab === 'behavior' && 'Describe Their Behaviors'}
                {tab === 'message' && 'Paste Single Message'}
                {tab === 'conversation' && 'Paste Full Conversation'}
              </h2>
              
              {tab === 'traits' ? (
                <>
                  <div className="space-y-3 mb-6">
                    {TRAIT_QUESTIONS.map(trait => (
                      <label key={trait.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTraits[trait.id] || false}
                          onChange={(e) => setSelectedTraits({
                            ...selectedTraits,
                            [trait.id]: e.target.checked
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{trait.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAnalyzeTraits}
                      disabled={loading || Object.values(selectedTraits).filter(Boolean).length === 0}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Analyze Traits
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : tab === 'behavior' ? (
                <>
                  <textarea
                    value={behaviorDescription}
                    onChange={(e) => setBehaviorDescription(e.target.value)}
                    placeholder="Describe the behaviors you've observed. For example:&#10;- They denied saying something they clearly said&#10;- They suddenly switched from loving to cold&#10;- They made me feel like I was crazy&#10;- They blame me for everything&#10;- They use my vulnerabilities against me"
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAnalyzeBehavior}
                      disabled={loading || !behaviorDescription.trim()}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Analyze Behaviors
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : tab === 'message' ? (
                <>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste a message or email from your narcissist here..."
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAnalyzeMessage}
                      disabled={loading || !inputText.trim()}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Analyze Message
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    placeholder="Paste conversation here. Format:&#10;You: your message&#10;Them: their response&#10;You: your message&#10;Them: their response"
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAnalyzeConversation}
                      disabled={loading || !conversationText.trim()}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Analyze Conversation
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Your analysis is saved privately to your account
              </p>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Analyses
            </h3>
            
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No analyses yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedHistoryItem(item)
                        setShowModal(true)
                      }}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 truncate pr-8">
                        {item.primary_type || item.analysis_result?.primaryType}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.input_type} ⬢ Severity: {item.severity_score || item.analysis_result?.severityScore}/10
                      </div>
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (confirm('Delete this analysis?')) {
                          const { error } = await supabase
                            .from('narcissist_analyses')
                            .delete()
                            .eq('id', item.id)
                          
                          if (!error) {
                            toast.success('Analysis deleted')
                            setHistory(history.filter(h => h.id !== item.id))
                          } else {
                            toast.error('Failed to delete')
                          }
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {tab === 'traits' && traitAnalysis && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Trait Analysis Results
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Primary Type</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getTypeColor(traitAnalysis.primaryType)}`}>
                    {traitAnalysis.primaryType}
                  </div>
                  <div className={`mt-2 text-lg font-bold ${getConfidenceColor(traitAnalysis.primaryConfidence)}`}>
                    {traitAnalysis.primaryConfidence}% confidence
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Severity Score</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getSeverityColor(traitAnalysis.severityScore)}`}>
                    {traitAnalysis.severityScore}/10
                  </div>
                </div>
              </div>

              {traitAnalysis.secondaryTypes && traitAnalysis.secondaryTypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Secondary Types</h3>
                  <div className="space-y-2">
                    {traitAnalysis.secondaryTypes.map((type: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-900">{type.type}</span>
                        <span className={`font-bold ${getConfidenceColor(type.confidence)}`}>{type.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Analysis</h3>
                <p className="text-gray-700">{traitAnalysis.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {traitAnalysis.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900">
                      âœ“ {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(traitAnalysis, null, 2))
                  toast.success('Copied to clipboard')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Copy Results
              </button>
              <button
                onClick={() => {
                  setTraitAnalysis(null)
                  setSelectedTraits({})
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        {tab === 'behavior' && behaviorAnalysis && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Behavior Analysis Results
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Primary Type</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getTypeColor(behaviorAnalysis.primaryType)}`}>
                    {behaviorAnalysis.primaryType}
                  </div>
                  <div className={`mt-2 text-lg font-bold ${getConfidenceColor(behaviorAnalysis.primaryConfidence)}`}>
                    {behaviorAnalysis.primaryConfidence}% confidence
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Severity Score</h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getSeverityColor(behaviorAnalysis.severityScore)}`}>
                    {behaviorAnalysis.severityScore}/10
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detected Patterns</h3>
                <div className="flex flex-wrap gap-2">
                  {behaviorAnalysis.detectedPatterns.map((pattern: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Traits Detected</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(behaviorAnalysis.traits).map(([trait, confidence]: [string, any]) => (
                    <div key={trait} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {trait.replace(/_/g, ' ')}
                        </span>
                        <span className={`font-bold ${getConfidenceColor(confidence)}`}>
                          {confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            confidence >= 80
                              ? 'bg-red-500'
                              : confidence >= 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis</h3>
                <p className="text-gray-700">{behaviorAnalysis.analysis}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {behaviorAnalysis.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900">
                      âœ“ {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(behaviorAnalysis, null, 2))
                  toast.success('Copied to clipboard')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Copy Results
              </button>
              <button
                onClick={() => {
                  setBehaviorAnalysis(null)
                  setBehaviorDescription('')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        {tab === 'message' && analysis && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Analysis Results
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Primary Type
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getTypeColor(analysis.primaryType)}`}>
                    {analysis.primaryType}
                  </div>
                  <div className={`mt-2 text-lg font-bold ${getConfidenceColor(analysis.primaryConfidence)}`}>
                    {analysis.primaryConfidence}% confidence
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Severity Score
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getSeverityColor(analysis.severityScore)}`}>
                    {analysis.severityScore}/10
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Traits Detected
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(analysis.traits).map(([trait, confidence]) => (
                    <div key={trait} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {trait.replace(/_/g, ' ')}
                        </span>
                        <span className={`font-bold ${getConfidenceColor(confidence)}`}>
                          {confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            confidence >= 80
                              ? 'bg-red-500'
                              : confidence >= 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manipulation Tactics Identified
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.manipulationTactics.map((tactic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Phrases Detected
                </h3>
                <div className="space-y-3">
                  {analysis.keyPhrases.map((item, idx) => (
                    <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="font-mono text-sm text-gray-900 mb-2 italic">
                        "{item.phrase}"
                      </div>
                      <div className="text-xs font-medium text-yellow-800 mb-1">
                        Tactic: {item.tactic}
                      </div>
                      <div className="text-sm text-gray-700">
                        {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended Response Strategies
                </h3>
                <div className="space-y-2">
                  {analysis.recommendedStrategies.map((strategy, idx) => (
                    <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900">
                      âœ“ {strategy}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(analysis, null, 2))
                  toast.success('Copied to clipboard')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Copy Results
              </button>
              <button
                onClick={() => {
                  setAnalysis(null)
                  setInputText('')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
        </div>
      )}
    </div>
  )
}

export default function NarcissistDetectorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(session.user as User)
      setProfile(profileData as Profile | null)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <NarcissistDetectorContent user={user} />
    </DashboardLayout>
  )
}
