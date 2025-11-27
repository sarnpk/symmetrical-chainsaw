'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, RotateCcw, AlertCircle, Loader, Shield, HelpCircle, Eye, TrendingUp, History, Trash2, Clock, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'

interface Message {
  role: 'user' | 'narcissist'
  content: string
  timestamp: Date
  feedback?: {
    technique: string
    effectiveness: 'poor' | 'good' | 'excellent'
    suggestion: string
  }
}

const NARCISSIST_TYPES = [
  { id: 'overt', label: 'Overt (Grandiose)', description: 'Openly arrogant, demands attention' },
  { id: 'covert', label: 'Covert (Vulnerable)', description: 'Plays victim, passive-aggressive' },
  { id: 'malignant', label: 'Malignant', description: 'Cruel, vindictive, sadistic' },
]

const SCENARIOS = [
  { id: 'custody', label: 'Custody Exchange', description: 'Picking up/dropping off children' },
  { id: 'text', label: 'Text Message', description: 'Responding to provocative texts' },
  { id: 'email', label: 'Email Communication', description: 'Co-parenting email exchange' },
  { id: 'boundary', label: 'Boundary Violation', description: 'They crossed a boundary' },
  { id: 'live', label: 'Live Conversation', description: 'Continue an ongoing conversation' },
]

interface Prediction {
  likelyMoves: Array<{
    move: string
    probability: number
    reasoning: string
    howToRespond: string
  }>
  overallStrategy: string
  warningSign: string
}

function NarcissistSimulatorContent({ user, profile }: { user: SupabaseUser; profile: Profile }) {
  const [narcissistType, setNarcissistType] = useState('overt')
  const [scenario, setScenario] = useState('custody')
  const [customContext, setCustomContext] = useState('')
  const [situationContext, setSituationContext] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [showPrediction, setShowPrediction] = useState(false)
  const [predictingLoading, setPredictingLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [sessionHistory, setSessionHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [userName, setUserName] = useState<string>('You')
  const [narcissistName, setNarcissistName] = useState<string>('Them')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  const supabase = createClient()

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const checkIfNearBottom = () => {
    if (!chatContainerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const threshold = 150
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom < threshold
  }

  const handleScroll = () => {
    setShowScrollButton(!checkIfNearBottom())
    if (loading) {
      setUserHasScrolled(true)
    }
  }

  const startSession = async () => {
    // Validate live conversation if selected
    if (scenario === 'live') {
      if (!customContext.trim()) {
        toast.error('Please paste your conversation')
        return
      }
      if (!situationContext.trim()) {
        toast.error('Please describe what\'s happening (context)')
        return
      }
    }

    // Extract names from situation context or conversation, OR use profile information
    if (scenario === 'live' && (customContext || situationContext)) {
      // Check both situation context and conversation for names
      const combinedText = `${situationContext}\n${customContext}`
      
      // Try multiple patterns for name extraction
      
      // Pattern 1: Quoted names - I am "Name" ... My Wife/Husband "Name"
      const quotedUserPattern = /I\s+am\s+"([^"]+)"/i
      const quotedNarcPattern = /(?:My\s+(?:Wife|Husband|Partner|Ex)|(?:SHE|HE))\s+"([^"]+)"/i
      
      // Pattern 2: Traditional format - I AM Name AND SHE/HE IS Name
      const traditionalUserPattern = /I\s+AM\s+([^,\n]+?)(?:\s+AND|\s+in\s+Conversation)/i
      const traditionalNarcPattern = /(?:SHE|HE)\s+IS\s+([^,\n.]+)/i
      
      let userName = ''
      let narcName = ''
      
      // Try quoted pattern first
      const quotedUserMatch = combinedText.match(quotedUserPattern)
      const quotedNarcMatch = combinedText.match(quotedNarcPattern)
      
      if (quotedUserMatch) {
        userName = quotedUserMatch[1].trim()
      } else {
        // Try traditional pattern
        const traditionalUserMatch = combinedText.match(traditionalUserPattern)
        if (traditionalUserMatch) {
          userName = traditionalUserMatch[1].trim()
        }
      }
      
      if (quotedNarcMatch) {
        narcName = quotedNarcMatch[1].trim()
      } else {
        // Try traditional pattern
        const traditionalNarcMatch = combinedText.match(traditionalNarcPattern)
        if (traditionalNarcMatch) {
          narcName = traditionalNarcMatch[1].trim()
        }
      }
      
      // Set user name
      if (userName) {
        setUserName(userName)
      } else if (profile?.display_name) {
        setUserName(profile.display_name)
      }
      
      // Set narcissist name
      if (narcName) {
        setNarcissistName(narcName)
      } else {
        // Fallback to generic name based on gender
        const gender = profile?.abuser_gender?.toLowerCase()
        if (gender === 'female') {
          setNarcissistName('Her')
        } else if (gender === 'male') {
          setNarcissistName('Him')
        } else {
          setNarcissistName('Them')
        }
      }
    }

    setSessionStarted(true)
    setMessages([])
    setLoading(true)

    try {
      const response = await fetch('/api/narcissist-simulator/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          narcissistType, 
          scenario,
          customContext: scenario === 'live' ? customContext : undefined,
          situationContext: scenario === 'live' ? situationContext : undefined,
          userProfile: profile // Send profile data for context
        }),
      })

      if (!response.ok) throw new Error('Failed to start session')

      const data = await response.json()
      const initialMessages = [{
        role: 'narcissist' as const,
        content: data.initialMessage,
        timestamp: new Date()
      }]
      setMessages(initialMessages)

      // Save session to database
      const { data: sessionData, error } = await supabase
        .from('narcissist_simulator_sessions')
        .insert({
          user_id: user.id,
          narcissist_type: narcissistType,
          scenario: scenario,
          conversation_history: initialMessages,
          total_messages: 1,
          status: 'active'
        })
        .select()
        .single()

      if (!error && sessionData) {
        setSessionId(sessionData.id)
      }
    } catch (error) {
      toast.error('Failed to start simulator')
      setSessionStarted(false)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Scroll to bottom after message is added
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToBottom('smooth'))
    })

    try {
      const response = await fetch('/api/narcissist-simulator/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narcissistType,
          scenario,
          conversationHistory: messages,
          userMessage: inputMessage,
          customContext: scenario === 'live' ? customContext : undefined,
          situationContext: scenario === 'live' ? situationContext : undefined,
          userProfile: profile // Send profile data for context
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      // Add narcissist response
      const narcissistMessage = {
        role: 'narcissist' as const,
        content: data.narcissistResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, narcissistMessage])

      // Add feedback to user's message
      const userMsgWithFeedback = { ...userMessage, feedback: data.feedback }
      setMessages(prev => prev.map((msg, idx) =>
        idx === prev.length - 2 ? userMsgWithFeedback : msg
      ))

      // Update database
      if (sessionId) {
        const allMessages = [...messages, userMsgWithFeedback, narcissistMessage]
        
        await supabase
          .from('narcissist_simulator_sessions')
          .update({
            conversation_history: allMessages,
            total_messages: allMessages.length
          })
          .eq('id', sessionId)
      }

      if (data.feedback.effectiveness === 'excellent') {
        toast.success('Excellent response!')
      }
    } catch (error) {
      toast.error('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const predictNextMove = async () => {
    if (messages.length < 2) {
      toast.error('Need at least one exchange to predict')
      return
    }

    setPredictingLoading(true)
    try {
      const response = await fetch('/api/narcissist-simulator/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narcissistType,
          scenario,
          conversationHistory: messages,
          customContext: scenario === 'live' ? customContext : undefined
        }),
      })

      if (!response.ok) throw new Error('Failed to predict')

      const data = await response.json()
      setPrediction(data.prediction)
      setShowPrediction(true)
    } catch (error) {
      toast.error('Failed to predict next move')
    } finally {
      setPredictingLoading(false)
    }
  }

  const resetSession = async () => {
    // Mark session as completed in database
    if (sessionId) {
      await supabase
        .from('narcissist_simulator_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    }

    setSessionStarted(false)
    setMessages([])
    setInputMessage('')
    setPrediction(null)
    setShowPrediction(false)
    setSessionId(null)
  }

  const loadSessionHistory = async () => {
    setLoadingHistory(true)
    try {
      const { data, error } = await supabase
        .from('narcissist_simulator_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setSessionHistory(data || [])
      setShowHistory(true)
    } catch (error) {
      toast.error('Failed to load session history')
    } finally {
      setLoadingHistory(false)
    }
  }

  const loadOldSession = (session: any) => {
    setNarcissistType(session.narcissist_type)
    setScenario(session.scenario)
    setSessionId(session.id)
    setSessionStarted(true)
    
    // Convert stored messages to proper format
    const loadedMessages = session.conversation_history.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
    setMessages(loadedMessages)
    setShowHistory(false)
    toast.success('Session loaded!')
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const { error } = await supabase
        .from('narcissist_simulator_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error
      
      setSessionHistory(prev => prev.filter(s => s.id !== sessionId))
      toast.success('Session deleted')
    } catch (error) {
      toast.error('Failed to delete session')
    }
  }

  return (
    <div className="fixed inset-0 lg:left-64 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 mt-16 lg:mt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Narcissist Simulator</h1>
                <Link 
                  href="/docs/NARCISSIST_SIMULATOR_CUSTOM_CONTEXT_GUIDE.md"
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-700"
                  title="View User Guide"
                >
                  <HelpCircle className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Practice grey rock, BIFF, and boundary-setting in a safe environment
              </p>
            </div>
          </div>
          <button
            onClick={loadSessionHistory}
            disabled={loadingHistory}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
          >
            {loadingHistory ? <Loader className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
            History
          </button>
        </div>
      </div>

      {/* Info Banners */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 shrink-0">
        <div className="flex gap-2 text-xs text-blue-800">
          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Safe Practice Space:</strong> This is a simulation. Practice your responses without real-world consequences. The AI will provide feedback on your technique.
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-purple-50 border-b border-purple-200 shrink-0">
        <div className="flex gap-2 text-xs text-purple-800">
          <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Don't know your narcissist type?</strong> Visit the{' '}
            <Link href="/narcissist-detector" className="underline hover:text-purple-900 font-medium">
              Narcissist Detector
            </Link>
            {' '}to analyze their patterns and identify their type before practicing here.
          </div>
        </div>
      </div>

      {!sessionStarted ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Configure Simulation</h2>

            <div className="space-y-4">
              {/* Narcissist Type - Compact Dropdown */}
              <div>
                <label htmlFor="narcissist-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Narcissist Type
                </label>
                <select
                  id="narcissist-type"
                  value={narcissistType}
                  onChange={(e) => setNarcissistType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {NARCISSIST_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario - Compact Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scenario
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SCENARIOS.map(s => (
                    <label key={s.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="scenario"
                        value={s.id}
                        checked={scenario === s.id}
                        onChange={(e) => setScenario(e.target.value)}
                        className="flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm">{s.label}</div>
                        <div className="text-xs text-gray-600">{s.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Conversation Fields */}
              {scenario === 'live' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
                  {/* Important Notice */}
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="font-semibold text-yellow-900">⚠️ Include names: I am "Your Name" and My Wife/Husband "Their Name"</p>
                  </div>

                  {/* Situation Context Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      What's Happening? (Context)
                    </label>
                    <textarea
                      value={situationContext}
                      onChange={(e) => setSituationContext(e.target.value)}
                      placeholder="I am &quot;Michael Davis&quot; and My Wife &quot;Jennifer Williams.&quot; She took my kids last week without notice..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  {/* Conversation Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Paste Your Conversation
                    </label>
                    <textarea
                      value={customContext}
                      onChange={(e) => setCustomContext(e.target.value)}
                      placeholder="[10:30 AM] Michael: Can we talk?&#10;[10:32 AM] Jennifer: You're always difficult&#10;[10:33 AM] Michael: I just want what's best"
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={startSession}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Bot className="w-5 h-5" />
                Start Simulation
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="font-medium">Type:</span> {NARCISSIST_TYPES.find(t => t.id === narcissistType)?.label} • 
                  <span className="font-medium ml-2">Scenario:</span> {SCENARIOS.find(s => s.id === scenario)?.label}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={predictNextMove}
                    disabled={messages.length < 2 || predictingLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {predictingLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    Predict Next Move
                  </button>
                  <button
                    onClick={resetSession}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {showPrediction && prediction && (
                <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Predicted Next Moves
                    </h3>
                    <button
                      onClick={() => setShowPrediction(false)}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      Hide
                    </button>
                  </div>

                  <div className="space-y-3">
                    {prediction.likelyMoves.map((move, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900">{move.move}</div>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {Math.round(move.probability * 100)}% likely
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{move.reasoning}</p>
                        <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                          <strong>How to respond:</strong> {move.howToRespond}
                        </div>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-purple-200">
                      <div className="text-sm">
                        <strong className="text-purple-900">Overall Strategy:</strong>
                        <p className="text-gray-700 mt-1">{prediction.overallStrategy}</p>
                      </div>
                      {prediction.warningSign && (
                        <div className="mt-2 text-sm text-red-700 bg-red-50 p-2 rounded flex gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Warning:</strong> {prediction.warningSign}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp-style Chat Container */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overflow-x-hidden bg-[#e5ddd5]" 
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M20 10h60v2H20zm0 20h40v2H20zm0 20h50v2H20z\' fill=\'%23d1ccc0\' opacity=\'.1\'/%3E%3C/svg%3E")'
              }}>
              <div className="p-4 space-y-2">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    {/* Name label above message */}
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-1`}>
                      <span className="text-xs font-semibold text-gray-600 px-2">
                        {msg.role === 'user' ? userName : narcissistName}
                      </span>
                    </div>
                    
                    <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                        {/* WhatsApp-style message bubble */}
                        <div className={`relative px-3 py-2 rounded-lg shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-[#dcf8c6] text-gray-900'
                            : 'bg-white text-gray-900'
                        }`}>
                          {/* Message tail */}
                          <div className={`absolute top-0 w-0 h-0 ${
                            msg.role === 'user'
                              ? 'right-[-8px] border-l-[8px] border-l-[#dcf8c6] border-t-[8px] border-t-transparent'
                              : 'left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent'
                          }`}></div>
                          
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                          
                          {/* WhatsApp-style timestamp */}
                          <div className={`flex items-center gap-1 justify-end mt-1 ${
                            msg.role === 'user' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            <span className="text-[10px]">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.role === 'user' && (
                              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 16 15" fill="currentColor">
                                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback badge below message */}
                    {msg.feedback && (
                      <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mt-1 mb-2`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-lg text-xs ${
                          msg.feedback.effectiveness === 'excellent' ? 'bg-green-100 text-green-800 border border-green-300' :
                          msg.feedback.effectiveness === 'good' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                          'bg-orange-100 text-orange-800 border border-orange-300'
                        }`}>
                          <div className="font-semibold mb-1">
                            {msg.feedback.effectiveness === 'excellent' ? '✅' : msg.feedback.effectiveness === 'good' ? '👍' : '⚠️'} {msg.feedback.technique}
                          </div>
                          <div>{msg.feedback.suggestion}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-white rounded-lg shadow-sm px-4 py-3 max-w-[75%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && messages.length > 0 && (
              <div className="fixed bottom-20 sm:bottom-32 right-4 z-50">
                <button
                  onClick={() => scrollToBottom('smooth')}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-gray-900"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            {/* WhatsApp-style Input */}
            <div className="bg-[#f0f0f0] border-t border-gray-200 p-3 shrink-0">
              <div className="flex gap-2 items-end">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#25d366] text-sm"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || loading}
                  className="w-12 h-12 bg-[#25d366] text-white rounded-full hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-md transition-all"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 px-2">
                💡 Try grey rock (boring, brief) or BIFF (brief, informative, friendly, firm)
              </p>
            </div>
        </div>
      )}

      {/* Session History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <History className="w-6 h-6" />
                Session History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {sessionHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No practice sessions yet</p>
                  <p className="text-sm mt-2">Start a new session to begin practicing!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionHistory.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-700' :
                              session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {session.status}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {NARCISSIST_TYPES.find(t => t.id === session.narcissist_type)?.label}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {SCENARIOS.find(s => s.id === session.scenario)?.label}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <strong>{session.total_messages}</strong> messages • 
                            Started {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          {session.conversation_history && session.conversation_history.length > 0 && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2 line-clamp-2">
                              {session.conversation_history[0]?.content?.substring(0, 100)}...
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => loadOldSession(session)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Load
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NarcissistSimulatorPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
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

      setUser(session.user as SupabaseUser)
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

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <NarcissistSimulatorContent user={user} profile={profile} />
    </DashboardLayout>
  )
}
