'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Users, X, Send, AlertCircle, Reply } from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatRoom {
  id: string
  name: string
  description: string
  category: string
  max_participants: number
  participant_count: number
  level_required: number
}

interface Message {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  user_id: string
}

export default function GroupChatRooms({ currentUserId }: { currentUserId: string | null }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isParticipant, setIsParticipant] = useState(false)
  const [recentJoins, setRecentJoins] = useState<Record<string, number>>({})
  const [userLevel, setUserLevel] = useState(1)
  const [sessionNames, setSessionNames] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)

  useEffect(() => {
    loadRooms()
    loadUserLevel()
    const interval = setInterval(loadRooms, 10000) // Refresh room counts every 10s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      loadMessages()
      const interval = setInterval(loadMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedRoom])

  const loadUserLevel = async () => {
    if (!currentUserId) return
    try {
      const res = await fetch('/api/community/user-stats')
      if (res.ok) {
        const data = await res.json()
        setUserLevel(data.stats?.level || 1)
      }
    } catch (err) {
      console.error('loadUserLevel error:', err)
    }
  }

  const loadRooms = async () => {
    try {
      const res = await fetch('/api/community/rooms')
      if (!res.ok) throw new Error('Failed to load rooms')
      const data = await res.json()
      const newRooms = data.rooms || []
      
      // Calculate recent joins (new participants since last check)
      const newRecentJoins: Record<string, number> = {}
      newRooms.forEach((room: ChatRoom) => {
        const oldRoom = rooms.find(r => r.id === room.id)
        if (oldRoom && room.participant_count > oldRoom.participant_count) {
          newRecentJoins[room.id] = room.participant_count - oldRoom.participant_count
        }
      })
      setRecentJoins(newRecentJoins)
      setRooms(newRooms)
    } catch (err) {
      console.error('loadRooms error:', err)
    }
  }

  const getSessionName = (userId: string) => {
    if (userId === currentUserId) return 'You'
    if (sessionNames[userId]) return sessionNames[userId]
    
    const names = [
      'Butterfly 🦋', 'Phoenix 🔥', 'Moonlight 🌙', 'Warrior ⚔️', 'Sunrise 🌅',
      'Ocean 🌊', 'Mountain ⛰️', 'Star ⭐', 'Rainbow 🌈', 'Lotus 🪷',
      'Eagle 🦅', 'Rose 🌹', 'Thunder ⚡', 'Willow 🌿', 'Crystal 💎',
      'Dove 🕊️', 'Flame 🔥', 'River 🏞️', 'Cloud ☁️', 'Breeze 🍃'
    ]
    
    const usedNames = Object.values(sessionNames)
    const availableNames = names.filter(n => !usedNames.includes(n))
    const newName = availableNames[Math.floor(Math.random() * availableNames.length)] || `Member ${Object.keys(sessionNames).length + 1}`
    
    setSessionNames(prev => ({ ...prev, [userId]: newName }))
    return newName
  }

  const loadMessages = async () => {
    if (!selectedRoom) return
    try {
      const res = await fetch(`/api/community/room-messages?room_id=${selectedRoom.id}&limit=50`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages((data.messages || []).reverse())
    } catch (err) {
      console.error('loadMessages error:', err)
    }
  }

  const joinRoom = async (room: ChatRoom) => {
    if (!currentUserId) {
      toast.error('Please log in to join rooms')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/community/room-participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: room.id })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join')
      }
      setSelectedRoom(room)
      setIsParticipant(true)
      setSessionNames({}) // Reset session names when joining new room
      toast.success(`Joined ${room.name}`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const leaveRoom = async () => {
    if (!selectedRoom) return
    try {
      const res = await fetch(`/api/community/room-participants?room_id=${selectedRoom.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to leave')
      setSelectedRoom(null)
      setIsParticipant(false)
      setMessages([])
      toast.success('Left room')
    } catch (err) {
      toast.error('Failed to leave room')
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedRoom) return
    setSending(true)
    try {
      let content = messageText.trim()
      if (replyingTo) {
        content = `@${getSessionName(replyingTo.user_id)}: ${content}`
      }
      const res = await fetch('/api/community/room-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          content,
          is_anonymous: true
        })
      })
      if (!res.ok) throw new Error('Failed to send')
      setMessageText('')
      setReplyingTo(null)
      loadMessages()
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return 'bg-blue-100 text-blue-800'
      case 'healing': return 'bg-green-100 text-green-800'
      case 'parenting': return 'bg-orange-100 text-orange-800'
      case 'venting': return 'bg-purple-100 text-purple-800'
      case 'anxiety': return 'bg-yellow-100 text-yellow-800'
      case 'ptsd': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCapacityStatus = (count: number, max: number) => {
    const percent = (count / max) * 100
    if (percent >= 90) return { color: 'text-red-600', bg: 'bg-red-50', label: '🔥 Almost Full!' }
    if (percent >= 70) return { color: 'text-orange-600', bg: 'bg-orange-50', label: '⚡ Filling Fast' }
    if (percent >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: '✨ Active' }
    return { color: 'text-green-600', bg: 'bg-green-50', label: '✓ Available' }
  }

  if (selectedRoom) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                <p className="text-xs text-gray-500">{selectedRoom.participant_count} participants</p>
              </div>
            </div>
            <button onClick={leaveRoom} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Messages are anonymous and auto-delete after 24 hours. Be respectful and supportive.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.user_id === currentUserId ? 'justify-end' : 'justify-start'} group`}>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 px-2 font-medium">{getSessionName(msg.user_id)}</span>
                  <div className="flex items-start gap-2">
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.user_id === currentUserId ? 'bg-indigo-600' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${msg.user_id === currentUserId ? 'text-white' : 'text-gray-900'}`}>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.user_id === currentUserId ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.user_id !== currentUserId && (
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                        title="Reply"
                      >
                        <Reply className="h-3 w-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="space-y-2">
            {replyingTo && (
              <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg text-sm">
                <span className="text-gray-700">
                  Replying to <span className="font-medium">{getSessionName(replyingTo.user_id)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={replyingTo ? `Reply to ${getSessionName(replyingTo.user_id)}...` : "Type your message..."}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Chat Rooms</h2>
        <p className="text-gray-600">Join anonymous group chats for real-time support and connection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => {
          const status = getCapacityStatus(room.participant_count, room.max_participants)
          const recentJoin = recentJoins[room.id]
          const isLocked = userLevel < room.level_required
          return (
            <div key={room.id} className={`bg-white rounded-lg shadow-sm border p-5 relative overflow-hidden ${isLocked ? 'border-gray-300 opacity-75' : 'border-gray-200'}`}>
              {/* Level lock badge */}
              {isLocked && (
                <div className="absolute top-0 right-0 bg-gray-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
                  🔒 Level {room.level_required}
                </div>
              )}
              
              {/* Urgency badge */}
              {!isLocked && status.label !== '✓ Available' && (
                <div className={`absolute top-0 right-0 ${status.bg} ${status.color} px-3 py-1 text-xs font-semibold rounded-bl-lg`}>
                  {status.label}
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="h-3 w-3" />
                      <span className={status.color + ' font-semibold'}>
                        {room.participant_count}/{room.max_participants}
                      </span>
                      {room.participant_count > 0 && (
                        <span className="text-gray-500">• {room.participant_count} active</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(room.category)}`}>
                  {room.category}
                </span>
              </div>
              
              {/* Recent activity indicator */}
              {recentJoin && recentJoin > 0 && (
                <div className="mb-3 flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  <span className="animate-pulse">🔴</span>
                  <span className="font-medium">{recentJoin} {recentJoin === 1 ? 'person' : 'people'} joined recently</span>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-4">{room.description}</p>
              
              {isLocked ? (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-600 mb-2">Unlock at Level {room.level_required}</p>
                  <div className="text-xs text-gray-500">Keep posting and engaging to level up!</div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => joinRoom(room)}
                  disabled={loading || room.participant_count >= room.max_participants}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {room.participant_count >= room.max_participants ? '🔒 Room Full' : 'Join Room'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
