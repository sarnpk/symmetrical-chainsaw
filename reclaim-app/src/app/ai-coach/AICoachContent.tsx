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
  Zap
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

      // Make API call to real AI endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          message: messageToSend,
          context,
          conversationHistory
        })
      })

      const data = await response.json()

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
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="h-7 w-7 text-indigo-600" />
              AI Coach
            </h1>
            <p className="text-gray-600 mt-1">
              Your personal AI companion trained in narcissistic abuse recovery
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </div>
        </div>
      </div>

      {/* Usage Info & Context Selector */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            <label className="text-sm text-gray-600">Mode:</label>
            <select
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
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
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`p-1 rounded ${message.helpful === true ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`p-1 rounded ${message.helpful === false ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                      title="Not helpful"
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
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-3">Suggested topics to explore:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share what's on your mind..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          This AI is trained to support abuse survivors. In crisis? Call 1-800-799-7233 (National Domestic Violence Hotline)
        </div>
      </div>
    </div>
  )
}
