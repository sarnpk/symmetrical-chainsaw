'use client'

import { useEffect, useState, useRef } from 'react'
import { MessageCircle, Send, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  is_mine: boolean
}

interface Conversation {
  id: string
  other_user: { id: string; email: string } | null
  last_message: { content: string; created_at: string } | null
}

export default function ChatPanel({ currentUserId }: { currentUserId: string }) {
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (open) loadConversations()
  }, [open])

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv)
      const channel = supabase
        .channel(`messages:${activeConv}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `conversation_id=eq.${activeConv}`
        }, (payload) => {
          const msg = payload.new as any
          setMessages(prev => [...prev, {
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            created_at: msg.created_at,
            is_mine: msg.sender_id === currentUserId
          }])
        })
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
  }, [activeConv, currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    const res = await fetch('/api/community/conversations')
    if (res.ok) {
      const json = await res.json()
      setConversations(json.items || [])
    }
  }

  const loadMessages = async (convId: string) => {
    const res = await fetch(`/api/community/messages?conversation_id=${convId}`)
    if (res.ok) {
      const json = await res.json()
      const msgs = (json.items || []).reverse().map((m: any) => ({
        id: m.id,
        content: m.content,
        sender_id: m.sender_id,
        created_at: m.created_at,
        is_mine: m.sender_id === currentUserId
      }))
      setMessages(msgs)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConv || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: activeConv, content })
      })
      if (!res.ok) throw new Error('Failed to send')
    } catch (e) {
      toast.error('Failed to send message')
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-600 text-white rounded-t-lg">
        <h3 className="font-semibold">Messages</h3>
        <button onClick={() => { setOpen(false); setActiveConv(null) }} className="hover:bg-indigo-700 p-1 rounded">
          <X className="h-5 w-5" />
        </button>
      </div>

      {!activeConv ? (
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>No conversations yet</p>
              <p className="text-xs mt-2">Like or comment on posts to connect with others</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">{conv.other_user?.email || 'User'}</div>
                {conv.last_message && (
                  <div className="text-sm text-gray-500 truncate">{conv.last_message.content}</div>
                )}
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <button onClick={() => setActiveConv(null)} className="text-indigo-600 hover:text-indigo-700">
              ← Back
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.is_mine ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
