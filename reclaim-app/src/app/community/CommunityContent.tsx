'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Shield, 
  Star,
  Calendar,
  Clock,
  MapPin,
  Video,
  Lock,
  Globe,
  Plus,
  Search,
  AlertTriangle,
  ArrowRight,
  Flag,
  Ban,
  MoreVertical,
} from 'lucide-react'
import GroupChatRooms from './GroupChatRooms'
import UserStatsWidget from './UserStatsWidget'
import ChatPanel from './ChatPanel'

interface CommunityPost {
  id: string
  author: string
  title: string
  content: string
  timestamp: string
  replies: number
  likes: number
  isAnonymous: boolean
  category: string
  author_id?: string
  liked?: boolean
  liking?: boolean
}

interface SupportGroup {
  id: string
  name: string
  description: string
  members: number
  nextMeeting: string
  isPrivate: boolean
  category: string
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Anonymous',
    title: 'Finding strength after leaving',
    content: 'It\'s been 6 months since I left, and some days are still really hard. But I wanted to share that it does get easier. The fog lifts, and you start to remember who you are.',
    timestamp: '2 hours ago',
    replies: 12,
    likes: 28,
    isAnonymous: true,
    category: 'recovery'
  },
  {
    id: '2',
    author: 'Sarah M.',
    title: 'Grey rock method success story',
    content: 'I\'ve been practicing the grey rock method for co-parenting situations, and it\'s been a game changer. The drama has decreased significantly.',
    timestamp: '5 hours ago',
    replies: 8,
    likes: 15,
    isAnonymous: false,
    category: 'strategies'
  },
  {
    id: '3',
    author: 'Anonymous',
    title: 'Rebuilding self-trust',
    content: 'How do you learn to trust your own perceptions again? I find myself second-guessing everything, even in healthy relationships.',
    timestamp: '1 day ago',
    replies: 24,
    likes: 42,
    isAnonymous: true,
    category: 'healing'
  }
]

const mockGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'New Beginnings',
    description: 'Support group for those who have recently left narcissistic relationships',
    members: 24,
    nextMeeting: 'Tomorrow at 7 PM EST',
    isPrivate: true,
    category: 'recovery'
  },
  {
    id: '2',
    name: 'Co-Parenting Warriors',
    description: 'Strategies and support for co-parenting with a narcissistic ex',
    members: 18,
    nextMeeting: 'Friday at 6 PM EST',
    isPrivate: true,
    category: 'parenting'
  },
  {
    id: '3',
    name: 'Healing Circle',
    description: 'Long-term healing and personal growth focused group',
    members: 31,
    nextMeeting: 'Sunday at 3 PM EST',
    isPrivate: true,
    category: 'healing'
  }
]

export default function CommunityContent() {
  const [activeTab, setActiveTab] = useState<'posts' | 'chat' | 'resources'>('posts')
  const [searchTerm, setSearchTerm] = useState('')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingMorePosts, setLoadingMorePosts] = useState(false)
  const [postCursor, setPostCursor] = useState<string | null>(null)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isAnon, setIsAnon] = useState(true)
  const [postCategory, setPostCategory] = useState('general')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [chatEnabled, setChatEnabled] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ postId: string; userId: string } | null>(null)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDesc, setReportDesc] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [communityResources, setCommunityResources] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/community/resources')
      .then(r => r.json())
      .then(d => setCommunityResources(d.items || []))
      .catch(() => {})
  }, [])

  const reportPost = async () => {
    if (!reportTarget) return
    try {
      const res = await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_post_id: reportTarget.postId, target_user_id: reportTarget.userId, reason: reportReason, description: reportDesc })
      })
      if (res.ok) {
        toast.success('Report submitted')
        setReportOpen(false)
        setReportTarget(null)
        setReportDesc('')
      } else {
        toast.error('Failed to report')
      }
    } catch { toast.error('Failed to report') }
  }

  const blockUser = async (userId: string) => {
    try {
      const res = await fetch('/api/community/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked_id: userId })
      })
      if (res.ok) {
        toast.success('User blocked')
        setMenuOpen(null)
        fetchPosts({ append: false })
      }
    } catch { toast.error('Failed to block') }
  }


  // Load posts from API with simple search support and transform to view model
  const fetchPosts = async (opts?: { append?: boolean }) => {
    try {
      const append = !!opts?.append
      const limit = 20
      if (append) setLoadingMorePosts(true); else setLoadingPosts(true)
      const params = new URLSearchParams()
      params.set('limit', String(limit))
      if (searchTerm.trim()) params.set('q', searchTerm.trim())
      if (append && postCursor) params.set('cursor', postCursor)
      const res = await fetch(`/api/community/posts?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      const json = await res.json()
      const items = Array.isArray(json.items) ? json.items : []
      const mapped: CommunityPost[] = items.map((it: any) => ({
        id: it.id,
        author: it.is_anonymous ? 'Anonymous' : 'Member',
        title: it.title,
        content: it.content,
        timestamp: it.created_at ? new Date(it.created_at).toLocaleString() : '',
        replies: 0,
        likes: 0,
        isAnonymous: !!it.is_anonymous,
        category: it.category || 'general',
        author_id: it.author_id,
        liked: false,
        liking: false,
      }))
      // Set posts immediately for quick UI, then hydrate likes state for the fetched slice only
      setPosts(prev => append ? [...prev, ...mapped] : mapped)
      // Hydrate likes and replies in a single batch request
      if (mapped.length > 0) {
        const postIds = mapped.map(p => p.id).join(',')
        try {
          const r = await fetch(`/api/community/counts?post_ids=${encodeURIComponent(postIds)}`)
          if (r.ok) {
            const { counts } = await r.json()
            setPosts(prev => prev.map(p => {
              const c = counts?.[p.id]
              if (!c) return p
              return { ...p, likes: c.likes, replies: c.comments, liked: c.liked }
            }))
          }
        } catch {}
      }
      // update cursor and hasMore based on raw items
      if (items.length > 0) {
        const last = items[items.length - 1]
        if (last?.created_at) setPostCursor(last.created_at)
      }
      setHasMorePosts(items.length === limit)
    } catch (e) {
      console.error('fetchPosts error', e)
      setPosts([])
    } finally {
      if (opts?.append) setLoadingMorePosts(false); else setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // fetch current user id and preferences
    fetch('/api/me')
      .then(r => r.json())
      .then(j => {
        setCurrentUserId(j?.id || null)
        if (j?.id) {
          fetch('/api/community/preferences')
            .then(r => r.json())
            .then(p => setChatEnabled(p?.chat_enabled !== false))
            .catch(() => {})
        }
      })
      .catch(() => setCurrentUserId(null))
    
    // Auto-refresh posts every 30 seconds
    const interval = setInterval(() => {
      if (activeTab === 'posts' && !searchTerm) {
        fetchPosts({ append: false })
      }
    }, 30000)
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerm])

  // listen for comment create/delete events to keep replies count in sync
  useEffect(() => {
    const onCreated = (e: any) => {
      const pid = e?.detail?.postId
      if (!pid) return
      setPosts(prev => prev.map(p => p.id === pid ? { ...p, replies: (p.replies || 0) + 1 } : p))
    }
    const onDeleted = (e: any) => {
      const pid = e?.detail?.postId
      if (!pid) return
      setPosts(prev => prev.map(p => p.id === pid ? { ...p, replies: Math.max(0, (p.replies || 0) - 1) } : p))
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('community:comment:created', onCreated as EventListener)
      window.addEventListener('community:comment:deleted', onDeleted as EventListener)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('community:comment:created', onCreated as EventListener)
        window.removeEventListener('community:comment:deleted', onDeleted as EventListener)
      }
    }
  }, [])

  const onSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // reset pagination and fetch first page
      setPostCursor(null)
      fetchPosts({ append: false })
    }
  }

  const toggleLike = async (postId: string) => {
    // read current state to avoid race
    const current = posts.find(p => p.id === postId)
    if (!current) return
    if (current.liking) return // already processing
    const wasLiked = !!current.liked

    // set processing flag immediately
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, liking: true } : p))

    try {
      // optimistic update
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: !wasLiked, likes: Math.max(0, (p.likes || 0) + (wasLiked ? -1 : 1)) } : p))

      const method = wasLiked ? 'DELETE' : 'POST'
      const res = await fetch('/api/community/likes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId })
      })
      if (!res.ok) {
        // revert
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: wasLiked, likes: Math.max(0, (p.likes || 0) + (wasLiked ? 1 : -1)) } : p))
        throw new Error('Failed to update like')
      }

      // re-sync from server to ensure exact count/state
      try {
        const r = await fetch(`/api/community/likes?post_id=${encodeURIComponent(postId)}`)
        if (r.ok) {
          const j = await r.json()
          const count = typeof j.count === 'number' ? j.count : undefined
          const liked = typeof j.liked === 'boolean' ? j.liked : undefined
          if (count !== undefined || liked !== undefined) {
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: count ?? p.likes, liked: liked ?? p.liked } : p))
          }
        }
      } catch {}
    } catch (e) {
      console.error('toggleLike error', e)
      toast.error('Could not update like')
    } finally {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, liking: false } : p))
    }
  }

  const deletePost = (postId: string) => {
    setDeleteId(postId)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/community/posts?id=${encodeURIComponent(deleteId)}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        const j = await res.json().catch(() => ({} as any))
        throw new Error(j.error || 'Failed to delete')
      }
      setPosts(prev => prev.filter(p => p.id !== deleteId))
      toast.success('Post deleted')
      setDeleteId(null)
    } catch (e: any) {
      console.error('deletePost error', e)
      toast.error(e?.message || 'Could not delete')
    } finally {
      setDeleting(false)
    }
  }



  const tabs = [
    { id: 'posts', name: 'Community Posts', icon: MessageCircle },
    { id: 'chat', name: 'Chat Rooms', icon: Users },
    { id: 'resources', name: 'Resources', icon: Star }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recovery': return 'bg-green-100 text-green-800 border-green-200'
      case 'strategies': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'healing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'parenting': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Community Posts</h2>
      </div>
      <button onClick={() => setComposerOpen(true)} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
        <Plus className="h-4 w-4" />
        New Post
      </button>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={onSearchEnter}
        />
      </div>

      <div className="space-y-4">
        {(loadingPosts ? [] : (posts.length ? posts : mockPosts)).map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {post.isAnonymous ? (
                    <Shield className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <span className="text-indigo-600 font-medium">
                      {post.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h4>
            <p className="text-gray-600 mb-4">{post.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  disabled={post.liking}
                  className={`flex items-center gap-2 transition-colors ${post.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'} ${post.liking ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-red-600' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.replies} replies</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/community/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Read more
                </Link>

                {currentUserId && post.author_id === currentUserId && (
                  <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                )}
                {currentUserId && post.author_id !== currentUserId && (
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuOpen === post.id && (
                      <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
                        <button onClick={() => { setReportTarget({ postId: post.id, userId: post.author_id }); setReportOpen(true); setMenuOpen(null) }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Flag className="h-3 w-3" /> Report
                        </button>
                        <button onClick={() => blockUser(post.author_id)} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Ban className="h-3 w-3" /> Block user
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!loadingPosts && posts.length === 0) && (
          <div className="text-center text-sm text-gray-500">No posts found. Try adjusting your search.</div>
        )}
        {/* Load more */}
        {!loadingPosts && posts.length > 0 && hasMorePosts && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => fetchPosts({ append: true })}
              disabled={loadingMorePosts}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${loadingMorePosts ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'} border-gray-200`}
            >
              {loadingMorePosts ? 'Loading' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Support Groups</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Request to Join
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{group.members} members</span>
                    {group.isPrivate && (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(group.category)}`}>
                {group.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{group.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{group.nextMeeting}</span>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Join Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )



  const renderResources = () => {
    const grouped = {
      crisis: communityResources.filter(r => r.category === 'crisis'),
      reading: communityResources.filter(r => r.category === 'reading'),
      tools: communityResources.filter(r => r.category === 'tools'),
      external: communityResources.filter(r => r.category === 'external'),
      general: communityResources.filter(r => r.category === 'general'),
    }

    const categoryConfig: Record<string, { label: string; icon: any; bg: string; iconColor: string }> = {
      crisis: { label: 'Crisis Resources', icon: Shield, bg: 'bg-red-100', iconColor: 'text-red-600' },
      reading: { label: 'Recommended Reading', icon: Star, bg: 'bg-blue-100', iconColor: 'text-blue-600' },
      tools: { label: 'In-App Tools', icon: ArrowRight, bg: 'bg-green-100', iconColor: 'text-green-600' },
      external: { label: 'External Resources', icon: ArrowRight, bg: 'bg-purple-100', iconColor: 'text-purple-600' },
      general: { label: 'More Resources', icon: ArrowRight, bg: 'bg-gray-100', iconColor: 'text-gray-600' },
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Community Resources</h2>
        {Object.entries(grouped).filter(([_, items]) => items.length > 0).map(([cat, items]) => {
          const config = categoryConfig[cat] || categoryConfig.general
          const Icon = config.icon
          return (
            <div key={cat} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{config.label}</h3>
              </div>
              <div className="space-y-2">
                {items.map(r => (
                  r.link ? (
                    <a key={r.id} href={r.link} className="block p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-gray-800 text-sm">{r.title}</p>
                      {r.description && <p className="text-gray-600 text-xs">{r.description}</p>}
                    </a>
                  ) : (
                    <div key={r.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="font-medium text-gray-800 text-sm">{r.title}</p>
                      {r.description && <p className="text-gray-600 text-xs">{r.description}</p>}
                    </div>
                  )
                ))}
              </div>
            </div>
          )
        })}
        {communityResources.length === 0 && (
          <div className="text-center py-8 text-gray-500">Loading resources...</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Users className="h-8 w-8 text-indigo-600" />
          Community
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Connect with others who understand your journey. Share experiences, find support, and build meaningful connections in a safe space.
        </p>
      </div>

      {/* User Stats Widget */}
      {currentUserId && <UserStatsWidget />}

      {/* Tab Navigation - vertical card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="space-y-2">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={
                  `w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ` +
                  (isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50')
                }
              >
                <IconComponent className={isActive ? 'h-4 w-4 text-white' : 'h-4 w-4 text-gray-600'} />
                {tab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'chat' && <GroupChatRooms currentUserId={currentUserId} />}
        {activeTab === 'resources' && renderResources()}
      </div>

      {/* New Post Modal */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && setComposerOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
            {errorMsg && (
              <div className="mb-3 text-sm text-red-600">{errorMsg}</div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setErrorMsg(null)
                const t = title.trim()
                const b = body.trim()
                if (!t || !b) {
                  setErrorMsg('Title and content are required')
                  return
                }
                try {
                  setSubmitting(true)
                  const res = await fetch('/api/community/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: t, content: b, is_anonymous: isAnon, category: postCategory })
                  })
                  if (!res.ok) {
                    const j = await res.json().catch(() => ({}))
                    throw new Error(j.error || 'Failed to create post')
                  }
                  setTitle('')
                  setBody('')
                  setIsAnon(true)
                  setPostCategory('general')
                  setComposerOpen(false)
                  await fetchPosts()
                  toast.success('Post created')
                } catch (err: any) {
                  setErrorMsg(err?.message || 'Something went wrong')
                } finally {
                  setSubmitting(false)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What's on your mind?"
                  maxLength={140}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Share details..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">General</option>
                    <option value="recovery">Recovery</option>
                    <option value="strategies">Strategies</option>
                    <option value="healing">Healing</option>
                    <option value="parenting">Parenting</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={isAnon}
                      onChange={(e) => setIsAnon(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Post anonymously
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !submitting && setComposerOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white ${submitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {submitting ? 'Posting' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteId} onClose={() => !deleting && setDeleteId(null)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200 transition-all data-closed:opacity-0 data-closed:translate-y-2 data-enter:duration-200 data-leave:duration-150"
          >
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-3">
                <div className="mx-auto sm:mx-0 flex size-10 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-base font-semibold text-gray-900">Delete post</DialogTitle>
                  <p className="mt-1 text-sm text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => !deleting && setDeleteId(null)}
                className="px-4 py-2 rounded-md bg-white text-gray-900 text-sm font-medium ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting' : 'Delete'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReportOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Post</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="hate_speech">Hate speech</option>
                  <option value="self_harm">Self-harm content</option>
                  <option value="inappropriate">Inappropriate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]" placeholder="Add more details..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setReportOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={reportPost} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {/* 1-on-1 Direct Messages */}
      {currentUserId && <ChatPanel currentUserId={currentUserId} />}
    </div>
  )
}
