'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Zap,
  ChevronRight,
  ArrowDown,
  Trash2,
  Volume2,
  VolumeX
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

// Helper function to decode HTML entities and format text
function decodeAndFormatText(text: string): string {
  // Decode HTML entities and remove invalid characters
  const decoded = text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\r/g, '\n')
    .trim()

  return decoded
}

// Helper function to render text with markdown formatting
function renderMarkdownText(text: string): JSX.Element[] {
  // Handle bold text (**text**)
  let parts = text.split(/\*\*(.*?)\*\*/g)
  let elements = parts.map((part, partIndex) =>
    partIndex % 2 === 1 ? (
      <strong key={`bold-${partIndex}`} className="font-semibold text-gray-900">{part}</strong>
    ) : (
      <React.Fragment key={`text-${partIndex}`}>{part}</React.Fragment>
    )
  )
  
  // Handle italic text (*text*)
  return elements.map((element, index) => {
    if (typeof element === 'object' && element.type === React.Fragment) {
      const text = element.props.children
      if (typeof text === 'string') {
        const italicParts = text.split(/\*(.*?)\*/g)
        const italicElements = italicParts.map((part, partIndex) =>
          partIndex % 2 === 1 ? (
            <em key={`italic-${index}-${partIndex}`} className="italic">{part}</em>
          ) : (
            <React.Fragment key={`text-${index}-${partIndex}`}>{part}</React.Fragment>
          )
        )
        return <React.Fragment key={`processed-${index}`}>{italicElements}</React.Fragment>
      }
    }
    return element
  })
}

// Helper function to format text with proper line breaks and structure
function formatAIResponse(text: string): JSX.Element {
  const decoded = decodeAndFormatText(text)
  const lines = decoded.split('\n')
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip empty lines
    if (!line) {
      i++
      continue
    }

    // Handle bullet points (lines starting with *)
    if (line.startsWith('*')) {
      const bulletItems: string[] = []
      
      // Collect all consecutive bullet items
      while (i < lines.length) {
        const currentLine = lines[i].trim()
        if (!currentLine) {
          i++
          continue
        }
        if (currentLine.startsWith('*')) {
          bulletItems.push(currentLine.replace(/^\*\s*/, ''))
          i++
        } else {
          break
        }
      }

      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 ml-2 my-3">
          {bulletItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderMarkdownText(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Handle numbered lists
    if (/^\d+\./.test(line)) {
      const numberedItems: string[] = []
      
      // Collect all consecutive numbered items
      while (i < lines.length) {
        const currentLine = lines[i].trim()
        if (!currentLine) {
          i++
          continue
        }
        if (/^\d+\./.test(currentLine)) {
          numberedItems.push(currentLine.replace(/^\d+\.\s*/, ''))
          i++
        } else {
          break
        }
      }

      elements.push(
        <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-2 ml-2 my-3">
          {numberedItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderMarkdownText(item)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Handle headings (lines with **text** as the only content)
    if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      const headingText = line.replace(/\*\*/g, '').replace(/:$/, '')
      elements.push(
        <h3 key={`h-${elements.length}`} className="font-semibold text-base mt-4 mb-2">
          {headingText}
        </h3>
      )
      i++
      continue
    }

    // Handle regular paragraphs (collect multi-line paragraphs)
    let paragraph = line
    i++
    
    // Continue collecting lines until we hit an empty line or special formatting
    while (i < lines.length) {
      const nextLine = lines[i].trim()
      if (!nextLine || nextLine.startsWith('*') || /^\d+\./.test(nextLine) || /^\*\*[^*]+\*\*:?$/.test(nextLine)) {
        break
      }
      paragraph += ' ' + nextLine
      i++
    }

    elements.push(
      <p key={`p-${elements.length}`} className="text-sm leading-relaxed my-2">
        {renderMarkdownText(paragraph)}
      </p>
    )
  }

  return <div className="space-y-1">{elements}</div>
}

interface UsageInfo {
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
  monthly_limit: number
  remaining: number
}

type ResponseLength = 'concise' | 'balanced' | 'detailed'

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
  const [responseLength, setResponseLength] = useState<ResponseLength>('balanced')
  const [showLengthPrompt, setShowLengthPrompt] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const [copyStatus, setCopyStatus] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [threads, setThreads] = useState<Array<{ id: string; title: string; updated_at: string }>>([])
  const [threadsCursor, setThreadsCursor] = useState<string | null>(null)
  const [messagesCursor, setMessagesCursor] = useState<string | null>(null)

  const [showScrollButton, setShowScrollButton] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [autoReadEnabled, setAutoReadEnabled] = useState(false)
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Check if user is near bottom of chat
  const checkIfNearBottom = () => {
    if (!chatContainerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const threshold = 150 // Increased threshold for better detection
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom < threshold
  }

  // Handle scroll events to show/hide scroll button
  const handleScroll = () => {
    setShowScrollButton(!checkIfNearBottom())
    // Detect if user manually scrolled during AI response generation
    if (isLoading) {
      setUserHasScrolled(true)
    }
  }

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

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`/api/ai/threads/${threadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (res.ok) {
        toast.success('Conversation deleted')
        setThreads(prev => prev.filter(t => t.id !== threadId))
        
        // If we deleted the current conversation, start a new one
        if (conversationId === threadId) {
          handleNewChat()
        }
      } else {
        toast.error('Failed to delete conversation')
      }
    } catch (error) {
      console.error('Failed to delete thread:', error)
      toast.error('Failed to delete conversation')
    }
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

    // Scroll to bottom after message is added
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToBottom('smooth'))
    })

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
        responseLength,
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

      // Add AI response with typing animation
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])

      // Simulate typing effect like ChatGPT
      const fullText = data.response
      let currentIndex = 0
      const typingSpeed = 20 // ms per character (slower for more natural feel)
      let shouldAutoScroll = checkIfNearBottom() // Initial check
      
      // Reset user scroll detection for this new message
      setUserHasScrolled(false)

      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentIndex += 2 // Type 2 characters at once for natural speed
          setMessages(prev => prev.map(msg =>
            msg.id === aiResponse.id
              ? { ...msg, content: fullText.substring(0, Math.min(currentIndex, fullText.length)) }
              : msg
          ))

          // Only auto-scroll if:
          // 1. We initially decided to auto-scroll
          // 2. User hasn't manually scrolled during typing
          // 3. User is still near the bottom
          if (shouldAutoScroll && !userHasScrolled && chatContainerRef.current) {
            const isStillNearBottom = checkIfNearBottom()
            if (isStillNearBottom) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
            } else {
              // User has scrolled up, stop auto-scrolling
              shouldAutoScroll = false
            }
          }
        } else {
          clearInterval(typeInterval)
          
          // Auto-read the response if enabled
          if (autoReadEnabled) {
            setTimeout(() => {
              speakMessage(aiResponse.id, fullText)
            }, 500) // Small delay after typing completes
          }
        }
      }, typingSpeed)

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

  // Text-to-speech functions
  const speakMessage = (messageId: string, content: string) => {
    // Stop any currently playing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
    }

    // Clean the content for better speech (remove markdown formatting)
    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\n+/g, '. ') // Replace line breaks with pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanContent)
    
    // Configure speech settings
    utterance.rate = 0.9 // Slightly slower for better comprehension
    utterance.pitch = 1.0
    utterance.volume = 0.8

    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Enhanced') || voice.name.includes('Premium'))
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0]
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    // Event handlers
    utterance.onstart = () => {
      setSpeakingMessageId(messageId)
    }

    utterance.onend = () => {
      setSpeakingMessageId(null)
      speechSynthesisRef.current = null
    }

    utterance.onerror = () => {
      setSpeakingMessageId(null)
      speechSynthesisRef.current = null
      toast.error('Speech synthesis failed')
    }

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
    toast.success('Reading message aloud')
  }

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
      setSpeakingMessageId(null)
      speechSynthesisRef.current = null
      toast.success('Stopped reading')
    }
  }

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Keyboard shortcut to read the latest AI message (Ctrl/Cmd + R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !e.shiftKey) {
        e.preventDefault()
        
        // Find the latest AI message
        const latestAIMessage = [...messages].reverse().find(msg => msg.type === 'ai' && msg.content.trim())
        
        if (latestAIMessage) {
          if (speakingMessageId === latestAIMessage.id) {
            stopSpeaking()
          } else {
            speakMessage(latestAIMessage.id, latestAIMessage.content)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [messages, speakingMessageId])

  return (
    <div className="fixed inset-0 lg:left-64 flex flex-col bg-gray-50">
      {/* SR-only live region for copy feedback */}
      <div className="sr-only" role="status" aria-live="polite">{copyStatus}</div>
      {/* Compact Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 shrink-0 mt-16 lg:mt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Bot className="h-5 w-5 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                AI Coach
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="hidden sm:inline">Online</span>
                </span>
              </h1>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-1">
            {/* Auto-read toggle - mobile */}
            <label className="flex items-center cursor-pointer" title="Auto-read responses">
              <input
                type="checkbox"
                checked={autoReadEnabled}
                onChange={(e) => setAutoReadEnabled(e.target.checked)}
                className="sr-only"
              />
              <Volume2 className={`w-4 h-4 ${autoReadEnabled ? 'text-indigo-600' : 'text-gray-400'}`} />
            </label>
            
            {/* Usage indicator - mobile */}
            {usageInfo && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Zap className="h-3 w-3 text-indigo-600" />
                <span className="hidden sm:inline">
                  {usageInfo.monthly_limit === -1 ? '∞' : `${usageInfo.remaining}/${usageInfo.monthly_limit}`}
                </span>
                <span className="sm:hidden">{usageInfo.remaining}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 shrink-0">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {/* Thread selector - compact */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <select
              value={conversationId || ''}
              onChange={(e) => e.target.value ? handleSelectThread(e.target.value) : undefined}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white min-w-0 max-w-[120px] truncate"
            >
              <option value="" disabled>Thread</option>
              {threads.map(t => (
                <option key={t.id} value={t.id}>{(t.title || 'Conversation').slice(0, 20)}</option>
              ))}
            </select>
            
            <button
              onClick={handleNewChat}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 flex-shrink-0"
              title="New chat"
            >
              New
            </button>
            
            {conversationId && (
              <button
                onClick={() => handleDeleteThread(conversationId)}
                className="text-xs p-1 rounded border border-red-300 text-red-600 hover:bg-red-50 flex-shrink-0"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Response controls - compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Length selector */}
            <select
              value={responseLength}
              onChange={(e) => setResponseLength(e.target.value as ResponseLength)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              title="Response length"
            >
              <option value="concise">Brief</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </select>

            {/* Mode selector - mobile segmented */}
            <div className="flex rounded border border-gray-300 bg-white overflow-hidden">
              {([
                { id: 'general', label: 'General', short: 'Gen' },
                { id: 'crisis', label: 'Crisis', short: 'SOS' },
                { id: 'pattern-analysis', label: 'Patterns', short: 'Pat' },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setContext(opt.id)}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    context === opt.id 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={opt.label}
                >
                  <span className="hidden sm:inline">{opt.label}</span>
                  <span className="sm:hidden">{opt.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages - Single scroll container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-white"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 space-y-2 sm:space-y-4">
          {conversationId && messagesCursor && (
            <div className="flex justify-center py-2">
              <button
                onClick={loadOlderMessages}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 bg-white"
              >
                Load older
              </button>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'} max-w-full`}
            >
              {message.type === 'ai' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                </div>
              )}

              <div className={`max-w-[90%] sm:max-w-[85%] lg:max-w-2xl ${message.type === 'user' ? 'order-1' : ''} min-w-0`}>
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 shadow-sm'
                    }`}
                >
                  {message.type === 'ai' ? (
                    formatAIResponse(message.content)
                  ) : (
                    <p className="text-sm leading-relaxed text-white">{message.content}</p>
                  )}
                </div>

                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                  <span className="text-[10px] sm:text-xs">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  {message.type === 'ai' && (
                    <div className="flex items-center gap-0.5 ml-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-gray-100 rounded-sm"
                        title="Copy"
                      >
                        <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                      {speakingMessageId === message.id ? (
                        <button
                          onClick={stopSpeaking}
                          className="p-1 hover:bg-gray-100 rounded-sm bg-blue-100 text-blue-600"
                          title="Stop"
                        >
                          <VolumeX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => speakMessage(message.id, message.content)}
                          className="p-1 hover:bg-gray-100 rounded-sm"
                          title="Read"
                        >
                          <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleFeedback(message.id, true)}
                        className={`p-1 rounded-sm ${message.helpful === true ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                        title="👍"
                      >
                        <ThumbsUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, false)}
                        className={`p-1 rounded-sm ${message.helpful === false ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                        title="👎"
                      >
                        <ThumbsDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && messages.length > 2 && (
        <div className="fixed bottom-20 sm:bottom-32 right-4 z-50">
          <button
            onClick={() => scrollToBottom('smooth')}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-gray-900"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {isLoading && userHasScrolled && (
            <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Auto-scroll paused
            </div>
          )}
        </div>
      )}

      {/* Response Length Preference Prompt */}
      {messages.length <= 1 && showLengthPrompt && (
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-blue-50 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-blue-900 mb-2">
                  Response length preference?
                </p>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <button
                    onClick={() => {
                      setResponseLength('concise')
                      setShowLengthPrompt(false)
                      toast.success('Preference saved: Brief responses')
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm text-left"
                  >
                    <strong>Brief</strong> - Quick answers
                  </button>
                  <button
                    onClick={() => {
                      setResponseLength('balanced')
                      setShowLengthPrompt(false)
                      toast.success('Preference saved: Balanced responses')
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm text-left"
                  >
                    <strong>Balanced</strong> - Moderate detail ⭐
                  </button>
                  <button
                    onClick={() => {
                      setResponseLength('detailed')
                      setShowLengthPrompt(false)
                      toast.success('Preference saved: Detailed responses')
                    }}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm text-left"
                  >
                    <strong>Detailed</strong> - Full explanations
                  </button>
                </div>
                <p className="text-xs text-blue-700 mt-1 hidden sm:block">
                  Change anytime in toolbar above
                </p>
              </div>
              <button
                onClick={() => setShowLengthPrompt(false)}
                className="text-blue-400 hover:text-blue-600 p-1 flex-shrink-0"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-gray-50 shrink-0">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick topics:</p>
            <div className="relative overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(prompt)}
                    className="flex-shrink-0 text-left px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-gray-200 rounded-full hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-xs sm:text-sm whitespace-nowrap max-w-[200px] sm:max-w-none truncate sm:whitespace-normal"
                    title={prompt}
                  >
                    {prompt.length > 30 ? `${prompt.slice(0, 30)}...` : prompt}
                  </button>
                ))}
              </div>
              {/* Mobile scroll indicator */}
              <div className="mt-1 text-xs text-gray-500 flex items-center gap-1 sm:hidden">
                <ChevronRight className="h-2.5 w-2.5" />
                Swipe for more
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-3 sm:p-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 max-w-full">
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
                  className="w-full rounded-full border border-gray-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-indigo-600 p-1.5 sm:p-2 text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 text-center px-1">
            <div className="leading-tight">Crisis? Call 1-800-799-7233 (National DV Hotline)</div>
            <div className="mt-0.5 hidden sm:block text-[10px]">Press Ctrl+R (Cmd+R) to read/stop latest response</div>
          </div>
        </div>
      </div>
    </div>
  )
}
