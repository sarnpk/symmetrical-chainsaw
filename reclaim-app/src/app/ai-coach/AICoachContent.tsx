'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Zap,
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  helpful?: boolean
}

interface UsageInfo {
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
  monthly_limit: number
  remaining: number
}

const suggestedPrompts = [
  "I'm feeling confused about whether my experience was really abuse",
  "How do I know if I'm being gaslit?",
  "I'm struggling with self-doubt after leaving the relationship",
  "What are healthy boundaries and how do I set them?",
  "I feel guilty for wanting to leave. Is this normal?",
  "How do I rebuild my self-esteem after narcissistic abuse?"
]

export default function AICoachContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Coach, trained specifically to support survivors of narcissistic abuse. I'm here to listen, validate your experiences, and provide guidance on your healing journey. What would you like to talk about today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null)
  const [context, setContext] = useState<'general' | 'crisis' | 'pattern-analysis' | 'mind-reset' | 'grey-rock'>('general')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const [copyStatus, setCopyStatus] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [threads, setThreads] = useState<Array<{ id: string; title: string; updated_at: string }>>([])
  const [threadsCursor, setThreadsCursor] = useState<string | null>(null)
  const [messagesCursor, setMessagesCursor] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Small delay-clear for screen reader announcements
  useEffect(() => {
    if (!copyStatus) return
    const t = setTimeout(() => setCopyStatus(''), 1500)
    return () => clearTimeout(t)
  }, [copyStatus])

  // Load initial usage info
  useEffect(() => {
    const loadUsageInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Make a dummy request to get usage info (we could create a separate endpoint for this)
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            message: '__GET_USAGE_INFO__', // Special message to just get usage info
            context: 'general'
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.usage_info) {
            setUsageInfo(data.usage_info)
          }
        }
      } catch (error) {
        console.error('Failed to load usage info:', error)
      }
    }

    loadUsageInfo()
  }, [])

  // Load initial thread list
  useEffect(() => {
    const loadThreads = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const res = await fetch(`/api/ai/threads?limit=20`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (!res.ok) return
        const json = await res.json()
        setThreads(json.items || [])
        setThreadsCursor(json.next_cursor || null)
      } catch (e) {
        console.error('Failed to load threads', e)
      }
    }
    loadThreads()
  }, [])

  // Helpers to load a thread's messages (first page)
  const loadThreadMessages = async (convId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`/api/ai/thread-messages?conversation_id=${encodeURIComponent(convId)}&limit=30`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (!res.ok) return
      const json = await res.json()
      // API returns newest first; reverse to display oldest->newest
      const items = (json.items || []).slice().reverse()
      const mapped: Message[] = items.map((m: any) => ({
        id: m.id,
        type: m.role === 'user' ? 'user' : 'ai',
        content: m.content,
        timestamp: new Date(m.created_at)
      }))
      // Include greeting if empty
      const initial = mapped.length === 0 ? messages.slice(0, 1) : []
      setMessages([...(initial as any), ...mapped])
      setMessagesCursor(json.next_cursor || null)
    } catch (e) {
      console.error('Failed to load messages', e)
    }
  }

  const loadOlderMessages = async () => {
    if (!conversationId || !messagesCursor) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`/api/ai/thread-messages?conversation_id=${encodeURIComponent(conversationId)}&limit=30&cursor=${encodeURIComponent(messagesCursor)}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (!res.ok) return
      const json = await res.json()
      const items = (json.items || []).slice().reverse()
      const mapped: Message[] = items.map((m: any) => ({
        id: m.id,
        type: m.role === 'user' ? 'user' : 'ai',
        content: m.content,
        timestamp: new Date(m.created_at)
      }))
      setMessages(prev => [...mapped, ...prev])
      setMessagesCursor(json.next_cursor || null)
    } catch (e) {
      console.error('Failed to load older messages', e)
    }
  }

  const handleSelectThread = async (id: string) => {
    setConversationId(id)
    // Clear and load selected thread
    setMessages([{
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Coach, trained specifically to support survivors of narcissistic abuse. I'm here to listen, validate your experiences, and provide guidance on your healing journey. What would you like to talk about today?",
      timestamp: new Date()
    }])
    await loadThreadMessages(id)
  }

  const handleNewChat = () => {
    setConversationId(null)
    setMessages([{
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Coach, trained specifically to support survivors of narcissistic abuse. I'm here to listen, validate your experiences, and provide guidance on your healing journey. What would you like to talk about today?",
      timestamp: new Date()
    }])
    setMessagesCursor(null)
  }

  // Fetch with timeout helper
  const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit, timeoutMs: number) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(input, { ...init, signal: controller.signal })
      return res
    } finally {
      clearTimeout(id)
    }
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to use AI Coach')
        setIsLoading(false)
        return
      }

      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      // Make API call with timeout and single retry
      let response: Response | null = null
      let data: any = null
      let lastError: any = null
      const payload = {
        message: messageToSend,
        context,
        conversationHistory,
        ...(conversationId ? { conversation_id: conversationId } : {})
      }

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await fetchWithTimeout('/api/ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(payload)
          }, 20000)
          data = await response.json()
          break
        } catch (err: any) {
          lastError = err
          if (attempt === 0) {
            // brief backoff before retry
            await new Promise(r => setTimeout(r, 600))
            continue
          }
        }
      }

      if (!response) {
        throw lastError || new Error('Network error')
      }

      if (!response.ok) {
        if (response.status === 429) {
          // Usage limit reached
          toast.error(`Monthly AI limit reached. ${data.upgrade_required ? `Upgrade to ${data.upgrade_required} for more interactions.` : ''}`)
        } else {
          toast.error(data.error || 'Failed to get AI response')
        }
        setIsLoading(false)
        return
      }

      // Update usage info
      if (data.usage_info) {
        setUsageInfo(data.usage_info)
      }

      // Persist conversation id for subsequent messages and update thread list ordering
      if (data.conversation_id) {
        setConversationId((prev) => {
          const newId = data.conversation_id as string
          setThreads((prevThreads) => {
            const exists = prevThreads.find(t => t.id === newId)
            const title = userMessage.content.slice(0, 60)
            const nowIso = new Date().toISOString()
            if (exists) {
              // Move to top and update timestamp/title if empty
              const updated = prevThreads.map(t => t.id === newId ? {
                ...t,
                title: t.title || title,
                updated_at: nowIso
              } : t)
              // Reorder with this thread first
              const thisThread = updated.find(t => t.id === newId)!
              return [thisThread, ...updated.filter(t => t.id !== newId)]
            } else {
              // Prepend new thread
              return [
                { id: newId, title, updated_at: nowIso },
                ...prevThreads
              ]
            }
          })
          return newId
        })
      } else if (conversationId) {
        // Existing thread: bump it to top locally
        setThreads((prevThreads) => {
          const existing = prevThreads.find(t => t.id === conversationId)
          if (!existing) return prevThreads
          const nowIso = new Date().toISOString()
          const updated = prevThreads.map(t => t.id === conversationId ? { ...t, updated_at: nowIso } : t)
          const thisThread = updated.find(t => t.id === conversationId)!
          return [thisThread, ...updated.filter(t => t.id !== conversationId)]
        })
      }

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])

    } catch (error) {
      console.error('AI chat error:', error)
      toast.error('Failed to connect to AI Coach. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }



  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ))
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopyStatus('Copied to clipboard')
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex flex-col h-full max-w-full overflow-x-hidden">
      {/* SR-only live region for copy feedback */}
      <div className="sr-only" role="status" aria-live="polite">{copyStatus}</div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
              AI Coach
              <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-green-700">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span>Online</span>
              </span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Your personal AI companion trained in narcissistic abuse recovery
            </p>
          </div>
        </div>
      </div>

      {/* Threads, Usage Info & Context Selector */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Threads selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="thread-select" className="text-sm text-gray-600">Thread:</label>
            <select
              id="thread-select"
              value={conversationId || ''}
              onChange={(e) => e.target.value ? handleSelectThread(e.target.value) : undefined}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="" disabled>Select a thread</option>
              {threads.map(t => (
                <option key={t.id} value={t.id}>{t.title || 'Conversation'}</option>
              ))}
            </select>
            <button
              onClick={handleNewChat}
              className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              New chat
            </button>
          </div>
          {/* Usage Info */}
          {usageInfo && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span className="text-gray-600">
                {usageInfo.monthly_limit === -1
                  ? 'Unlimited AI interactions'
                  : `${usageInfo.remaining}/${usageInfo.monthly_limit} interactions remaining`
                }
              </span>
              {usageInfo.subscription_tier === 'foundation' && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Free Plan
                </span>
              )}
            </div>
          )}

          {/* Context Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Mode:</span>

            {/* Mobile segmented control */}
            <div className="sm:hidden">
              <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                {([
                  { id: 'general', label: 'General' },
                  { id: 'crisis', label: 'Crisis' },
                  { id: 'pattern-analysis', label: 'Patterns' },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setContext(opt.id)}
                    className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
                      context === opt.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-gray-900'
                    }`}
                    aria-pressed={context === opt.id}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop select */}
            <div className="hidden sm:block">
              <label htmlFor="ai-mode" className="sr-only">Mode</label>
              <select
                id="ai-mode"
                value={context}
                onChange={(e) => setContext(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
              >
                <option value="general">General Support</option>
                <option value="crisis">Crisis Mode</option>
                <option value="pattern-analysis">Pattern Analysis</option>
                <option value="mind-reset">Mind Reset</option>
                <option value="grey-rock">Grey Rock Technique</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-w-full">
        {conversationId && messagesCursor && (
          <div className="flex justify-center">
            <button
              onClick={loadOlderMessages}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Load older messages
            </button>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'} max-w-full`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] sm:max-w-2xl ${message.type === 'user' ? 'order-1' : ''} min-w-0`}> 
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              
              <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                
                {message.type === 'ai' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy message"
                      aria-label="Copy message"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`p-1 rounded ${message.helpful === true ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                      title="Helpful"
                      aria-label="Mark helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`p-1 rounded ${message.helpful === false ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                      title="Not helpful"
                      aria-label="Mark not helpful"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 max-w-full">
          <p className="text-sm font-medium text-gray-700 mb-3">Suggested topics to explore:</p>
          <div className="relative">
            <div className="grid grid-flow-col auto-cols-max grid-rows-2 gap-2 -mx-1 px-1 overflow-x-auto no-scrollbar snap-x snap-mandatory md:overflow-visible md:snap-none sm:mx-0 sm:px-0">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 text-left px-3 py-2 bg-white border border-gray-200 rounded-full hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-xs sm:text-sm snap-start"
                >
                  {prompt}
                </button>
              ))}
            </div>
            {/* Edge fade indicators on mobile */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-50 to-transparent sm:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-50 to-transparent sm:hidden" />
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1 sm:hidden">
            Swipe to see more
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-3 sm:p-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-w-full">
        <div className="flex items-end gap-2 sm:gap-3 max-w-full">
          <div className="flex-1 min-w-0">
            <label htmlFor="ai-input" className="sr-only">Message AI Coach</label>
            <div className="relative">
              <input
                id="ai-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share what's on your mind..."
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 max-w-full"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Desktop Send button text */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="hidden sm:inline-flex px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>

        <div className="mt-2 text-[11px] sm:text-xs text-gray-500 text-center px-2">
          This AI is trained to support abuse survivors. In crisis? Call 1-800-799-7233 (National Domestic Violence Hotline)
        </div>
      </div>
    </div>
  )
}
