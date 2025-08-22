'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Lightbulb,
  RefreshCw,
  Heart,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  Volume2
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ThoughtPattern {
  id: string
  category: 'catastrophizing' | 'self-blame' | 'all-or-nothing' | 'mind-reading' | 'fortune-telling'
  title: string
  description: string
  example: string
  reframe: string
}

const thoughtPatterns: ThoughtPattern[] = [
  {
    id: '1',
    category: 'catastrophizing',
    title: 'Catastrophizing',
    description: 'Assuming the worst possible outcome will happen',
    example: "If I leave this relationship, I'll never find love again and I'll be alone forever.",
    reframe: "Ending an unhealthy relationship opens up space for healthier connections. Many people find fulfilling relationships after difficult ones."
  },
  {
    id: '2',
    category: 'self-blame',
    title: 'Self-Blame',
    description: 'Taking responsibility for things outside your control',
    example: "It's my fault they got angry. I should have known better than to bring that up.",
    reframe: "I am not responsible for someone else's emotional reactions. Their anger is their choice and responsibility."
  },
  {
    id: '3',
    category: 'all-or-nothing',
    title: 'All-or-Nothing Thinking',
    description: 'Seeing situations in black and white with no middle ground',
    example: "I'm either perfect or I'm a complete failure. There's no in-between.",
    reframe: "Life exists in shades of gray. I can make mistakes and still be a good person who is learning and growing."
  },
  {
    id: '4',
    category: 'mind-reading',
    title: 'Mind Reading',
    description: 'Assuming you know what others are thinking without evidence',
    example: "They're quiet today, so they must be angry with me about something I did.",
    reframe: "I don't know what others are thinking unless they tell me. There could be many reasons for their behavior that have nothing to do with me."
  },
  {
    id: '5',
    category: 'fortune-telling',
    title: 'Fortune Telling',
    description: 'Predicting negative outcomes without evidence',
    example: "I know this therapy won't work for me. Nothing ever helps.",
    reframe: "I can't predict the future. Each new approach is an opportunity to learn and grow, regardless of past experiences."
  }
]

const affirmations = [
  "I am worthy of love and respect",
  "My feelings and experiences are valid",
  "I have the strength to heal and grow",
  "I deserve healthy relationships",
  "I trust my own perceptions and instincts",
  "I am not responsible for others' actions",
  "I choose peace over drama",
  "I am enough, just as I am"
]

const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: "4 minutes"
  },
  {
    name: "Box Breathing",
    description: "Inhale 4, hold 4, exhale 4, hold 4",
    duration: "5 minutes"
  },
  {
    name: "Calm Breathing",
    description: "Slow, deep breaths to center yourself",
    duration: "3 minutes"
  }
]

export default function MindResetContent() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'affirmations' | 'breathing'>('patterns')
  const [selectedPattern, setSelectedPattern] = useState<ThoughtPattern | null>(null)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [usage, setUsage] = useState<{ limit: number; remaining: number; tier: string } | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [reframeInput, setReframeInput] = useState('')
  const [reframeLoading, setReframeLoading] = useState(false)
  const [reframeResult, setReframeResult] = useState<{ reframed_thought?: string; techniques_used?: string[]; error?: string } | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsPage, setSessionsPage] = useState(1)
  const [sessionsPageSize] = useState(5)
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [sessionsTotal, setSessionsTotal] = useState<number | null>(null)
  // Affirmations Phase 2 state
  const [playlists, setPlaylists] = useState<{ id: string; name: string; items: string[] }[]>([])
  const [playlistId, setPlaylistId] = useState<string>('self-worth')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  // Breathing state
  const [breathPattern, setBreathPattern] = useState<'box' | '478' | 'equal' | 'coherent'>('box')
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [breathTimeLeft, setBreathTimeLeft] = useState<number>(4)
  const [breathDurationMin, setBreathDurationMin] = useState<number>(3)
  const [breathRunning, setBreathRunning] = useState<boolean>(false)
  const [totalLeftSec, setTotalLeftSec] = useState<number>(3 * 60)
  const [breathsCompleted, setBreathsCompleted] = useState<number>(0)
  const [breathingDone, setBreathingDone] = useState<boolean>(false)

  // Breathing helpers
  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = Math.max(0, s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }
  const resetBreathing = () => {
    setBreathRunning(false)
    setBreathingDone(false)
    setBreathsCompleted(0)
    setBreathPhase('inhale')
    setBreathTimeLeft(4)
    setTotalLeftSec(breathDurationMin * 60)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'catastrophizing': return 'bg-red-100 text-red-800 border-red-200'
      case 'self-blame': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'all-or-nothing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'mind-reading': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fortune-telling': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCurrentAffirmations = () => {
    const found = playlists.find((p) => p.id === playlistId)
    return (found?.items && found.items.length > 0) ? found.items : affirmations
  }

  const nextAffirmation = () => {
    const list = getCurrentAffirmations()
    const next = (currentAffirmation + 1) % list.length
    setCurrentAffirmation(next)
    savePrefs({ affirmation_index: next })
  }

  const prevAffirmation = () => {
    const list = getCurrentAffirmations()
    const prevIdx = (currentAffirmation - 1 + list.length) % list.length
    setCurrentAffirmation(prevIdx)
    savePrefs({ affirmation_index: prevIdx })
  }

  // Load playlists, prefs, and favorites
  useEffect(() => {
    const initAffirmations = async () => {
      try {
        // Load default playlists
        const playlistsRes = await fetch('/api/mind-reset/affirmations')
        const playlistsJson = await playlistsRes.json().catch(() => null)
        if (playlistsRes.ok && playlistsJson?.playlists) setPlaylists(playlistsJson.playlists)

        // Load prefs and favorites if signed in
        const { data: session } = await supabase.auth.getSession()
        const token = session.session?.access_token
        if (!token) return
        const [prefsRes, favsRes] = await Promise.all([
          fetch('/api/mind-reset/affirmations/prefs', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/mind-reset/affirmations/favorites', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        const prefsJson = await prefsRes.json().catch(() => null)
        if (prefsRes.ok && prefsJson?.prefs) {
          if (typeof prefsJson.prefs.playlist_id === 'string') setPlaylistId(prefsJson.prefs.playlist_id)
          if (typeof prefsJson.prefs.affirmation_index === 'number') setCurrentAffirmation(prefsJson.prefs.affirmation_index)
          if (typeof prefsJson.prefs.auto_play === 'boolean') setAutoPlay(!!prefsJson.prefs.auto_play)
        }
        const favsJson = await favsRes.json().catch(() => null)
        if (favsRes.ok && Array.isArray(favsJson?.favorites)) {
          const set = new Set<string>()
          favsJson.favorites.forEach((f: any) => set.add(f.content))
          setFavorites(set)
        }
      } catch {}
    }
    initAffirmations()
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || !isPlaying) return
    const id = setInterval(() => {
      nextAffirmation()
    }, 5000)
    return () => clearInterval(id)
  }, [autoPlay, isPlaying, playlists, playlistId])

  // Keyboard controls for Affirmations
  useEffect(() => {
    if (activeTab !== 'affirmations') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextAffirmation() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevAffirmation() }
      if (e.key === ' ') { e.preventDefault(); setIsPlaying((v) => !v) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTab, currentAffirmation, playlists, playlistId])

  const savePrefs = async (patch: Partial<{ playlist_id: string; affirmation_index: number; auto_play: boolean }>) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      if (!token) return
      await fetch('/api/mind-reset/affirmations/prefs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch),
      })
    } catch {}
  }

  const toggleFavorite = async (text: string) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      if (!token) {
        // local optimistic only
        const copy = new Set(favorites)
        if (copy.has(text)) copy.delete(text); else copy.add(text)
        setFavorites(copy)
        return
      }
      const isFav = favorites.has(text)
      await fetch('/api/mind-reset/affirmations/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: text.slice(0, 64), content: text, favorite: !isFav }),
      })
      const copy = new Set(favorites)
      if (isFav) copy.delete(text); else copy.add(text)
      setFavorites(copy)
    } catch {}
  }

  // Keep totalLeftSec in sync with selected duration
  useEffect(() => {
    setTotalLeftSec(breathDurationMin * 60)
    setBreathingDone(false)
    setBreathsCompleted(0)
  }, [breathDurationMin])

  // Breathing timer scaffold
  useEffect(() => {
    if (!breathRunning) return
    const patternDurations: Record<string, { inhale: number; hold1: number; exhale: number; hold2: number }> = {
      box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      '478': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
      equal: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
      coherent: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    }
    const step = () => {
      // session total countdown
      setTotalLeftSec((T) => {
        if (T <= 1) {
          setBreathRunning(false)
          setBreathingDone(true)
          return 0
        }
        return T - 1
      })

      setBreathTimeLeft((t) => {
        if (t > 1) return t - 1
        // advance phase
        setBreathPhase((ph) => {
          const seq: ('inhale'|'hold1'|'exhale'|'hold2')[] = ['inhale','hold1','exhale','hold2']
          const idx = seq.indexOf(ph)
          let next = seq[(idx + 1) % seq.length]
          const d = patternDurations[breathPattern]
          // skip zero-length phases
          while ((d as any)[next] === 0) {
            next = seq[(seq.indexOf(next) + 1) % seq.length]
          }
          if (ph === 'exhale') setBreathsCompleted((b) => b + 1)
          setBreathTimeLeft((d as any)[next] || 4)
          return next
        })
        return t
      })
    }
    const id = setInterval(step, 1000)
    return () => clearInterval(id)
  }, [breathRunning, breathPattern])

  useEffect(() => {
    const loadUsage = async () => {
      try {
        setUsageLoading(true)
        const { data: session } = await supabase.auth.getSession()
        const token = session.session?.access_token
        if (!token) {
          setUsage({ limit: 0, remaining: 0, tier: 'foundation' })
          setUsageLoading(false)
          return
        }
        const res = await fetch('/api/usage/mind-reset', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load usage')
        setUsage({
          limit: json?.mind_reset_sessions?.limit ?? -1,
          remaining: json?.mind_reset_sessions?.remaining ?? -1,
          tier: json?.subscription_tier || 'foundation',
        })
      } catch (e: any) {
        setUsage({ limit: -1, remaining: -1, tier: 'foundation' })
      } finally {
        setUsageLoading(false)
      }
    }
    loadUsage()
  }, [])

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setSessionsLoading(true)
        const { data: session } = await supabase.auth.getSession()
        const token = session.session?.access_token
        if (!token) {
          setSessions([])
          setSessionsLoading(false)
          return
        }
        const res = await fetch(`/api/mind-reset/session?page=${sessionsPage}&page_size=${sessionsPageSize}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load sessions')
        setSessions(Array.isArray(json?.sessions) ? json.sessions : [])
        // Optional: if API returns total, use it; otherwise infer next/prev by length
        setSessionsTotal(typeof json?.total === 'number' ? json.total : null)
      } catch (e) {
        setSessions([])
      } finally {
        setSessionsLoading(false)
      }
    }
    loadSessions()
  }, [sessionsPage, sessionsPageSize])

  const handleAIReframe = async () => {
    try {
      setReframeLoading(true)
      setReframeResult(null)
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      if (!token) {
        setReframeResult({ error: 'You must be signed in.' })
        return
      }
      if (!reframeInput.trim()) {
        setReframeResult({ error: 'Please enter a thought to reframe.' })
        return
      }
      // Gating: if remaining is 0 (and finite), block and show prompt
      if (usage && usage.limit !== -1 && usage.remaining <= 0) {
        setReframeResult({ error: 'You have reached your monthly Mind Reset limit. Upgrade to continue.' })
        return
      }

      const res = await fetch('/api/mind-reset/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_type: 'thought_reframe',
          original_thought: reframeInput.trim(),
          context: {},
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setReframeResult({ error: json?.error || 'Mind Reset failed' })
        return
      }
      const sessionRow = json?.session || {}
      setReframeResult({
        reframed_thought: sessionRow?.reframed_thought,
        techniques_used: sessionRow?.techniques_used,
      })
      // Best-effort refresh usage
      const usageRes = await fetch('/api/usage/mind-reset', { headers: { Authorization: `Bearer ${token}` } })
      const usageJson = await usageRes.json().catch(() => null)
      if (usageRes.ok && usageJson) {
        setUsage({
          limit: usageJson?.mind_reset_sessions?.limit ?? -1,
          remaining: usageJson?.mind_reset_sessions?.remaining ?? -1,
          tier: usageJson?.subscription_tier || 'foundation',
        })
      }
      // Refresh sessions list to include the new one
      setSessionsPage(1)
      setReframeInput('')
    } catch (e: any) {
      setReframeResult({ error: e?.message || 'Unexpected error' })
    } finally {
      setReframeLoading(false)
    }
  };

  return (
    <div className="space-y-6">
    {/* Header */}
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
        <Brain className="h-8 w-8 text-indigo-600" />
        Mind Reset
      </h1>
      <p className="text-gray-600 max-w-3xl mx-auto">
        Reframe negative thought patterns, practice positive affirmations, and use breathing exercises to reset your mindset.
      </p>
    </div>

    {/* Usage / Upgrade Gating */}
    {!usageLoading && usage && usage.limit !== -1 && usage.remaining <= 0 && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg p-4 max-w-3xl mx-auto">
        <div className="font-semibold mb-1">Monthly limit reached</div>
        <div className="text-sm">You've used all Mind Reset sessions for this month on your {usage.tier} plan. Upgrade to continue.</div>
        <div className="mt-3">
          <Link href="/pricing" className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            Upgrade Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    )}

    {/* Tab Navigation */}
    <div className="flex justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Thought Patterns
        </button>
        <button
          onClick={() => setActiveTab('affirmations')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'affirmations'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart className="h-4 w-4 inline mr-2" />
          Affirmations
        </button>
        <button
          onClick={() => setActiveTab('breathing')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'breathing'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <RefreshCw className="h-4 w-4 inline mr-2" />
          Breathing
        </button>
      </div>
    </div>

    {/* Content */}
    {activeTab === 'patterns' && (
      <div className="space-y-6">
        {/* AI Reframe Tool */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Thought Reframe</h3>
          <p className="text-sm text-gray-600 mb-4">Enter a thought you'd like to reframe. We'll help generate a healthier perspective.</p>
          <textarea
            value={reframeInput}
            onChange={(e) => setReframeInput(e.target.value)}
            placeholder="e.g., I always mess things up"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            disabled={!!(usage && usage.limit !== -1 && usage.remaining <= 0)}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAIReframe}
              disabled={reframeLoading || !!(usage && usage.limit !== -1 && usage.remaining <= 0)}
              className={`px-4 py-2 rounded-md text-white text-sm font-medium ${reframeLoading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {reframeLoading ? 'Reframing...' : 'Reframe My Thought'}
            </button>
            {usage && usage.limit !== -1 && (
              <span className="text-xs text-gray-500">Remaining this month: {usage.remaining}</span>
            )}
          </div>
          {reframeResult?.error && (
            <div className="mt-3 text-sm text-red-600">{reframeResult.error}</div>
          )}
          {reframeResult?.reframed_thought && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-semibold text-green-900 mb-1">Reframed Thought</div>
              <div className="text-green-800">"{reframeResult.reframed_thought}"</div>
              {Array.isArray(reframeResult.techniques_used) && reframeResult.techniques_used.length > 0 && (
                <div className="mt-2 text-xs text-green-900">Techniques: {reframeResult.techniques_used.join(', ')}</div>
              )}
            </div>
          )}
        </div>
        {/* Patterns overview grid */}
        {!selectedPattern && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Common Thought Patterns</h2>
              <p className="text-gray-600">Recognize and reframe negative thinking patterns that may be affecting your wellbeing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thoughtPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(pattern.category)}`}>
                      {pattern.title}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{pattern.description}</p>
                </div>
              ))}
            </div>

            {/* Sessions History */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Recent Mind Reset Sessions</h3>
                <div className="text-xs text-gray-500">Page {sessionsPage}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y">
                {sessionsLoading && (
                  <div className="p-4 text-sm text-gray-500">Loading sessions...</div>
                )}
                {!sessionsLoading && sessions.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No sessions yet. Try creating your first reframe above.</div>
                )}
                {!sessionsLoading && sessions.map((s) => (
                  <div key={s.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{(s.session_type || '').replace('_', ' ') || 'session'}</div>
                        <div className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-gray-500">{s.used_ai ? 'AI-assisted' : 'Manual'}</div>
                    </div>
                    {s.original_thought && (
                      <div className="mt-2 text-sm text-gray-700"><span className="font-semibold">Original:</span> {s.original_thought}</div>
                    )}
                    {s.reframed_thought && (
                      <div className="mt-1 text-sm text-gray-900"><span className="font-semibold">Reframed:</span> {s.reframed_thought}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
                  disabled={sessionsPage <= 1 || sessionsLoading}
                  onClick={() => setSessionsPage((p) => Math.max(1, p - 1))}
                >Previous</button>
                <button
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
                  disabled={sessionsLoading || (sessionsTotal !== null ? sessionsPage * sessionsPageSize >= sessionsTotal : sessions.length < sessionsPageSize)}
                  onClick={() => setSessionsPage((p) => p + 1)}
                >Next</button>
              </div>
            </div>
          </>
        )}
        {selectedPattern && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Example Thought
              </h3>
              <p className="text-red-800 italic">"{selectedPattern?.example}"</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Reframed Thought
              </h3>
              <p className="text-green-800">"{selectedPattern?.reframe}"</p>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Practice Exercise</h3>
              <p className="text-blue-800 text-sm">
                When you notice this thought pattern, pause and ask yourself: "Is this thought helpful? 
                What evidence do I have for this? What would I tell a friend in this situation?"
              </p>
            </div>
          </div>
        )}
      </div>
    )}
    {activeTab === 'affirmations' && (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Positive Affirmations</h2>
          <p className="text-gray-600">
            Repeat these affirmations to help rewire your thinking and build self-compassion.
          </p>
        </div>
        {/* Controls */}
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Playlist</label>
            <select
              className="mt-1 w-full md:w-auto border border-gray-300 rounded-md p-2 text-sm"
              value={playlistId}
              onChange={(e) => { setPlaylistId(e.target.value); setCurrentAffirmation(0); savePrefs({ playlist_id: e.target.value }) }}
            >
              {(playlists.length ? playlists : [{ id: 'self-worth', name: 'Self-worth' }]).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsPlaying((v) => !v); savePrefs({ auto_play: !isPlaying }) }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm"
            >
              {isPlaying ? (<><Pause className="h-4 w-4"/> Pause</>) : (<><Play className="h-4 w-4"/> Play</>)}
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={autoPlay} onChange={(e) => { setAutoPlay(e.target.checked); savePrefs({ auto_play: e.target.checked }) }} />
              Auto-play
            </label>
          </div>
        </div>

        {(() => { const list = getCurrentAffirmations(); const text = list[currentAffirmation] || affirmations[0]; return (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 border border-pink-200">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-6" />
              <blockquote className="text-2xl font-medium text-gray-900 mb-6" aria-live="polite">
                "{text}"
              </blockquote>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={prevAffirmation}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-gray-600 rotate-180" />
                </button>
                <span className="text-sm text-gray-500">
                  {currentAffirmation + 1} of {list.length}
                </span>
                <button
                  onClick={nextAffirmation}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggleFavorite(text)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${favorites.has(text) ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(text) ? 'fill-pink-600 text-pink-600' : ''}`} />
                  {favorites.has(text) ? 'Favorited' : 'Favorite'}
                </button>
              </div>
            </div>
          </div>
        )})()}
      </div>
    )}
    {activeTab === 'breathing' && (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Breathing</h2>
          <p className="text-gray-600">Follow a guided rhythm to calm your nervous system.</p>
        </div>
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'box', label: 'Box 4-4-4-4' },
              { id: '478', label: '4-7-8' },
              { id: 'equal', label: 'Equal 5-5' },
              { id: 'coherent', label: 'Coherent 5-5' },
            ] as any[]).map((p) => (
              <button key={p.id} onClick={() => { setBreathPattern(p.id); setBreathPhase('inhale'); setBreathTimeLeft(4) }}
                className={`px-3 py-1.5 rounded-md border text-sm ${breathPattern === p.id ? 'bg-indigo-600 text-white' : ''}`}>{p.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-gray-700">Duration</label>
            <select className="border rounded-md p-1 text-sm" value={breathDurationMin} onChange={(e) => setBreathDurationMin(parseInt(e.target.value) || 3)}>
              {[2,3,4,5,6,7,8,9,10].map((m) => (<option key={m} value={m}>{m} min</option>))}
            </select>
            <div className="md:ml-auto flex items-center gap-3 w-full md:w-auto">
              <div className="text-sm text-gray-600 flex-1 md:flex-none">
                <span className="font-medium">Time left:</span> {formatSeconds(totalLeftSec)}
                <span className="mx-2">•</span>
                <span className="font-medium">Breaths:</span> {breathsCompleted}
              </div>
              <button
                onClick={() => {
                  if (breathingDone) resetBreathing()
                  setBreathRunning((v) => !v)
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm shrink-0"
              >
                {breathRunning ? (<><Pause className="h-4 w-4"/> Pause</>) : (<><Play className="h-4 w-4"/> {breathingDone ? 'Restart' : 'Start'}</>)}
              </button>
              <button onClick={resetBreathing} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm shrink-0">Reset</button>
            </div>
          </div>
          <div className="grid place-items-center py-6">
            <div className="h-48 w-48 rounded-full border-4 border-indigo-200 grid place-items-center">
              <div className="text-center">
                <div className="text-sm uppercase tracking-wide text-gray-500">{breathPhase === 'hold1' || breathPhase === 'hold2' ? 'Hold' : breathPhase.charAt(0).toUpperCase() + breathPhase.slice(1)}</div>
                <div className="text-4xl font-semibold text-indigo-700">{breathTimeLeft}s</div>
              </div>
            </div>
          </div>
          {breathingDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="text-green-900 text-sm">
                <div className="font-semibold mb-0.5">Session Complete</div>
                <div>Nice work. You completed approximately <span className="font-medium">{breathsCompleted}</span> breaths.</div>
              </div>
              <button onClick={() => { resetBreathing(); setBreathRunning(true) }} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm bg-white">Start Again</button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)

}
