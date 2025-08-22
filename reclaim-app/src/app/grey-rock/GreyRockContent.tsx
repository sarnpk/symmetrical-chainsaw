'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  RefreshCw,
  MessageCircle,
  Play,
  RotateCcw,
  CheckCircle,
  X,
  Lightbulb,
  AlertTriangle,
  Target,
  Book,
  Lock
} from 'lucide-react'
import { 
  checkFeatureLimit, 
  recordFeatureUsage,
  createGreyRockSession,
  createGreyRockAttempt,
  endGreyRockSession,
  GreyRockSession,
  getStreak,
  upsertStreakOnAttempt,
  getPackStats,
  incrementPackAttempts
} from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface Scenario {
  id: string
  title: string
  description: string
  trigger: string
  goodResponse: string
  badResponse: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  pack: 'Basics' | 'Boundaries' | 'High-Conflict'
  minTier: 'foundation' | 'recovery' | 'empowerment'
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Work Performance Criticism',
    description: 'Your ex criticizes your work performance in front of your children',
    trigger: '"You\'re so incompetent at your job, no wonder the kids don\'t respect you."',
    goodResponse: '"Okay." (then redirect conversation to the children)',
    badResponse: '"That\'s not true! I work very hard and my boss appreciates me!"',
    explanation: 'The good response avoids taking the bait and doesn\'t provide emotional fuel. The bad response shows you\'re affected and gives them ammunition.',
    difficulty: 'medium',
    pack: 'Basics',
    minTier: 'foundation'
  },
  {
    id: '2',
    title: 'Relationship Status Probing',
    description: 'They ask invasive questions about your dating life',
    trigger: '"So who are you seeing now? I bet they don\'t know how crazy you really are."',
    goodResponse: '"That\'s not something I discuss."',
    badResponse: '"I\'m not crazy! And my personal life is none of your business!"',
    explanation: 'Keep responses brief and don\'t defend yourself. Defending gives them the reaction they want.',
    difficulty: 'easy',
    pack: 'Basics',
    minTier: 'foundation'
  },
  {
    id: '3',
    title: 'Financial Accusations',
    description: 'They accuse you of misusing money or being financially irresponsible',
    trigger: '"You\'re wasting money on stupid things while our kids need new clothes!"',
    goodResponse: '"I\'ll look into that."',
    badResponse: '"I bought one coffee! You spent hundreds on your hobbies!"',
    explanation: 'Don\'t justify your spending or counter-attack. A neutral acknowledgment ends the conversation.',
    difficulty: 'hard',
    pack: 'Boundaries',
    minTier: 'recovery'
  },
  {
    id: '4',
    title: 'Parenting Criticism',
    description: 'They criticize your parenting decisions',
    trigger: '"You\'re too soft on the kids. That\'s why they don\'t listen to you."',
    goodResponse: '"I\'ll consider that."',
    badResponse: '"I\'m not too soft! You\'re the one who spoils them!"',
    explanation: 'Avoid defending your parenting style. A non-committal response doesn\'t give them fuel for argument.',
    difficulty: 'medium',
    pack: 'Boundaries',
    minTier: 'recovery'
  },
  {
    id: '5',
    title: 'Emotional Manipulation',
    description: 'They try to make you feel guilty about the relationship ending',
    trigger: '"The kids are so sad about us not being together. You\'ve ruined their family."',
    goodResponse: '"That must be difficult for them."',
    badResponse: '"I didn\'t ruin anything! You did this to yourself!"',
    explanation: 'Acknowledge without taking responsibility. Don\'t defend your decision or blame them back.',
    difficulty: 'hard',
    pack: 'High-Conflict',
    minTier: 'empowerment'
  }
]

interface GreyRockContentProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function GreyRockContent({ userId, subscriptionTier }: GreyRockContentProps) {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [practiceMode, setPracticeMode] = useState<'learn' | 'practice'>('learn')
  const [limitReached, setLimitReached] = useState<string | null>(null)
  const sessionStartRef = useRef<number | null>(null)
  const [session, setSession] = useState<GreyRockSession | null>(null)
  const scenarioShownAtRef = useRef<number | null>(null)

  // Micro-tips and pause state
  const [showTips, setShowTips] = useState<boolean>(true)
  const [tipsExpanded, setTipsExpanded] = useState<boolean>(false)
  const [isPausing, setIsPausing] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(0)
  const [showWhyPanel, setShowWhyPanel] = useState<boolean>(false)

  // TTS state
  const [autoplayAudio, setAutoplayAudio] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  // DB scenarios
  const [dbScenarios, setDbScenarios] = useState<Scenario[]>([])
  const [loadingScenarios, setLoadingScenarios] = useState<boolean>(false)
  const [scenarioLoadError, setScenarioLoadError] = useState<string | null>(null)
  // Gamification state
  const [streak, setStreak] = useState<{ current_streak: number, best_streak: number } | null>(null)
  const [packStats, setPackStats] = useState<Record<'Basics' | 'Boundaries' | 'High-Conflict', number>>({ Basics: 0, Boundaries: 0, 'High-Conflict': 0 })

  // Learn filters
  const packs = ['All', 'Basics', 'Boundaries', 'High-Conflict'] as const
  const difficulties = ['All', 'easy', 'medium', 'hard'] as const
  const [selectedPack, setSelectedPack] = useState<typeof packs[number]>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<typeof difficulties[number]>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Practice filters (separate from Learn view)
  const [practicePack, setPracticePack] = useState<typeof packs[number]>('All')
  const [practiceDifficulty, setPracticeDifficulty] = useState<typeof difficulties[number]>('All')

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const speakTrigger = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    stopSpeech()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 1
    utter.pitch = 1
    utter.onend = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utter)
  }

  useEffect(() => {
    if (currentScenario && autoplayAudio) {
      speakTrigger(currentScenario.trigger)
    }
  }, [currentScenario, autoplayAudio])

  // Initialize tip preference from localStorage
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('gr_show_tips') : null
      if (stored !== null) setShowTips(stored === '1')
      // Load practice filters
      const pPack = typeof window !== 'undefined' ? window.localStorage.getItem('gr_practice_pack') : null
      const pDiff = typeof window !== 'undefined' ? window.localStorage.getItem('gr_practice_diff') : null
      if (pPack && (['All','Basics','Boundaries','High-Conflict'] as any).includes(pPack)) setPracticePack(pPack as typeof packs[number])
      if (pDiff && (['All','easy','medium','hard'] as any).includes(pDiff)) setPracticeDifficulty(pDiff as typeof difficulties[number])
    } catch {}
  }, [])

  // Load gamification (streak + pack stats) on mount
  useEffect(() => {
    let cancelled = false
    async function loadStats() {
      try {
        const [s, p] = await Promise.all([
          getStreak(userId),
          getPackStats(userId)
        ])
        if (cancelled) return
        if (s.data) setStreak({ current_streak: s.data.current_streak, best_streak: s.data.best_streak })
        const agg: Record<'Basics' | 'Boundaries' | 'High-Conflict', number> = { Basics: 0, Boundaries: 0, 'High-Conflict': 0 }
        ;(p.data || []).forEach((row: any) => {
          const key = row.pack as keyof typeof agg
          if (key in agg) agg[key] = row.attempts as number
        })
        setPackStats(agg)
      } catch (e) {
        console.warn('Failed loading gamification stats', e)
      }
    }
    loadStats()
    return () => { cancelled = true }
  }, [userId])

  // Fetch scenarios from Supabase (active only)
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingScenarios(true)
      setScenarioLoadError(null)
      const { data, error } = await supabase
        .from('grey_rock_scenarios')
        .select('*')
        .eq('is_active', true)
      if (cancelled) return
      if (error) {
        setScenarioLoadError('Failed to load scenarios')
        setDbScenarios([])
      } else {
        // Map DB rows to Scenario type
        const mapped: Scenario[] = (data || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          trigger: r.trigger,
          goodResponse: r.good_response,
          badResponse: r.bad_response,
          explanation: r.explanation,
          difficulty: r.difficulty,
          pack: r.pack,
          minTier: r.min_tier,
        }))
        setDbScenarios(mapped)
      }
      setLoadingScenarios(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Persist tip preference
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('gr_show_tips', showTips ? '1' : '0')
      }
    } catch {}
  }, [showTips])

  // Persist practice filters
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('gr_practice_pack', practicePack)
        window.localStorage.setItem('gr_practice_diff', practiceDifficulty)
      }
    } catch {}
  }, [practicePack, practiceDifficulty])

  // Handle one-off pause countdown
  useEffect(() => {
    if (!isPausing || countdown <= 0) return
    const id = window.setTimeout(() => {
      setCountdown((c) => c - 1)
    }, 1000)
    if (countdown === 1) {
      // finishing next tick
      const doneId = window.setTimeout(() => {
        setIsPausing(false)
      }, 1000)
      return () => {
        window.clearTimeout(id)
        window.clearTimeout(doneId)
      }
    }
    return () => window.clearTimeout(id)
  }, [isPausing, countdown])

  const startPractice = async () => {
    // Enforce per-tier usage limits via RPC; if no limit configured, checkFeatureLimit returns true
    const { data: allowed, error } = await checkFeatureLimit(userId, 'grey_rock_practice', 'monthly_count')
    if (error) {
      console.error('Grey Rock: failed to check feature limit', error)
    }
    if (allowed === false) {
      setLimitReached(
        subscriptionTier === 'foundation' ? 'recovery' : 'empowerment'
      )
      return
    }

    const pool = practicePool
    if (pool.length === 0) {
      setCurrentScenario(null)
      return
    }
    const randomScenario = pickWeighted(pool) as Scenario
    setCurrentScenario(randomScenario)
    setSelectedResponse(null)
    setShowResult(false)
    setPracticeMode('practice')
    sessionStartRef.current = Date.now()
    scenarioShownAtRef.current = Date.now()
    setIsPausing(false)
    setCountdown(0)
    setTipsExpanded(false)
    setShowWhyPanel(false)

    // Create a session row
    const { data: sessionRow, error: sessErr } = await createGreyRockSession(userId, 'practice', {
      first_scenario_id: randomScenario.id,
    })
    if (sessErr) {
      console.error('Grey Rock: failed to create session', sessErr)
    }
    setSession(sessionRow || null)

    // Record session start (counts toward monthly usage)
    await recordFeatureUsage(userId, 'grey_rock_practice', 'monthly_count', 1, {
      event: 'start',
      scenario_id: randomScenario.id,
    })
  }

  const handleResponseSelect = async (response: string) => {
    setSelectedResponse(response)
    setShowResult(true)
    
    if (currentScenario) {
      const isCorrect = response === currentScenario.goodResponse
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }))

      // Record attempt in attempts table and analytics
      const latency = scenarioShownAtRef.current ? Date.now() - scenarioShownAtRef.current : undefined
      if (session) {
        await createGreyRockAttempt(userId, session.id, {
          scenario_id: currentScenario.id,
          difficulty: currentScenario.difficulty,
          selected_response: response,
          is_correct: isCorrect,
          latency_ms: latency,
          metadata: { scenario_title: currentScenario.title }
        })
      }
      await recordFeatureUsage(userId, 'grey_rock_practice', 'monthly_count', 0, {
        event: 'attempt',
        scenario_id: currentScenario.id,
        selected: response,
        is_correct: isCorrect,
        latency_ms: latency,
      })
      // Update gamification: streak and pack attempts
      try {
        const [s, p] = await Promise.all([
          upsertStreakOnAttempt(userId),
          incrementPackAttempts(userId, currentScenario.pack)
        ])
        if (s && s.data) {
          setStreak({ current_streak: s.data.current_streak, best_streak: s.data.best_streak })
        }
        if (p && p.data) {
          const packKey = p.data.pack as 'Basics' | 'Boundaries' | 'High-Conflict'
          const attempts = p.data.attempts as number
          setPackStats(prev => ({ ...prev, [packKey]: attempts }))
        }
      } catch (e) {
        console.warn('Gamification update failed', e)
      }
    }
  }

  const nextScenario = async () => {
    const pool = practicePool
    const randomScenario = pickWeighted(pool) as Scenario
    setCurrentScenario(randomScenario)
    setSelectedResponse(null)
    setShowResult(false)
    scenarioShownAtRef.current = Date.now()
    setIsPausing(false)
    setCountdown(0)
    setTipsExpanded(false)
    setShowWhyPanel(false)
    // Track moving to next scenario (no count increment)
    await recordFeatureUsage(userId, 'grey_rock_practice', 'monthly_count', 0, {
      event: 'next_scenario',
      scenario_id: randomScenario.id,
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tierRank = (t: 'foundation' | 'recovery' | 'empowerment') => (
    t === 'foundation' ? 0 : t === 'recovery' ? 1 : 2
  )
  const canAccess = (scenario: Scenario) => (
    tierRank(subscriptionTier) >= tierRank(scenario.minTier)
  )
  const sourceScenarios = dbScenarios.length > 0 ? dbScenarios : scenarios
  const availableScenarios = sourceScenarios.filter(canAccess)
  const lockedScenarios = sourceScenarios.filter(s => !canAccess(s))

  // Build practice pool based on selectors
  const practicePool = (() => {
    const base = sourceScenarios.filter(canAccess)
    return base.filter(s => {
      const pOk = practicePack === 'All' || s.pack === practicePack
      const dOk = practiceDifficulty === 'All' || s.difficulty === practiceDifficulty
      return pOk && dOk
    })
  })()

  // Weighted random pick to bias easier scenarios
  const pickWeighted = (pool: Scenario[]) => {
    if (pool.length === 0) return null
    const weightOf = (d: Scenario['difficulty']) => d === 'easy' ? 3 : d === 'medium' ? 2 : 1
    const weights = pool.map(s => weightOf(s.difficulty))
    const total = weights.reduce((a,b)=>a+b,0)
    let r = Math.random() * total
    for (let i = 0; i < pool.length; i++) {
      if (r < weights[i]) return pool[i]
      r -= weights[i]
    }
    return pool[pool.length - 1]
  }

  // Filtered list for Learn view
  const filteredScenarios = sourceScenarios.filter((s) => {
    const packOk = selectedPack === 'All' || s.pack === selectedPack
    const diffOk = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty
    const q = searchQuery.trim().toLowerCase()
    const qOk = q === '' || [s.title, s.description, s.trigger].some(v => v.toLowerCase().includes(q))
    return packOk && diffOk && qOk
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Target className="h-8 w-8 text-indigo-600" />
          Grey Rock Method
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Learn and practice the Grey Rock method - a technique to become uninteresting and unresponsive to narcissistic behavior, 
          reducing their motivation to engage with you.
        </p>
        <div className="mt-3">
          <a href="/grey-rock/history" className="text-sm font-medium text-indigo-700 hover:text-indigo-900 underline">View History</a>
        </div>
        {/* Gamification chips */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {streak && (
            <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
              🔥 Streak {streak.current_streak} {streak.best_streak > 0 ? `(best ${streak.best_streak})` : ''}
            </span>
          )}
          <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            Basics {packStats['Basics']}
          </span>
          <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            Boundaries {packStats['Boundaries']}
          </span>
          <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            High-Conflict {packStats['High-Conflict']}
          </span>
        </div>
      </div>

      {/* Limit reached notice */}
      {limitReached && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 max-w-3xl mx-auto">
          <p className="font-medium">Monthly practice limit reached for your plan.</p>
          <p className="text-sm mt-1">Upgrade to {limitReached} for more practice sessions.</p>
          <a href="/subscription" className="inline-block mt-3 text-sm font-medium text-indigo-700 hover:text-indigo-900 underline">View plans</a>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setPracticeMode('learn')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              practiceMode === 'learn'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Book className="h-4 w-4 inline mr-2" />
            Learn
          </button>
          <button
            onClick={() => setPracticeMode('practice')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              practiceMode === 'practice'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play className="h-4 w-4 inline mr-2" />
            Practice
          </button>
        </div>
      </div>

      {practiceMode === 'learn' ? (
        <div className="space-y-6">
          {/* Grey Rock Principles */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Grey Rock Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Be Boring</h3>
                    <p className="text-sm text-gray-600">Give short, uninteresting responses that don't invite further conversation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Stay Neutral</h3>
                    <p className="text-sm text-gray-600">Don't show emotion, anger, or defensiveness - this is what they're seeking.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Limit Information</h3>
                    <p className="text-sm text-gray-600">Share as little personal information as possible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">End Quickly</h3>
                    <p className="text-sm text-gray-600">Keep interactions as brief as possible while remaining civil.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-sm text-gray-600">Pack</label>
              <div className="flex flex-wrap gap-2">
                {packs.map(p => (
                  <button key={p} onClick={() => setSelectedPack(p)}
                    className={`px-3 py-1 rounded-full text-sm border ${selectedPack===p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-sm text-gray-600">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(d => (
                  <button key={d} onClick={() => setSelectedDifficulty(d)}
                    className={`px-3 py-1 rounded-full text-sm border ${selectedDifficulty===d ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                placeholder="Search title/trigger..."
                className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={()=>{setSelectedPack('All'); setSelectedDifficulty('All'); setSearchQuery('')}}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >Clear</button>
            </div>
          </div>

          {/* Visible counts */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
            {(() => {
              const visibleAvailable = filteredScenarios.filter(s => tierRank(subscriptionTier) >= tierRank(s.minTier)).length
              const visibleLocked = filteredScenarios.length - visibleAvailable
              return (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200">
                    <CheckCircle className="h-3.5 w-3.5" /> {visibleAvailable} available
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Lock className="h-3.5 w-3.5" /> {visibleLocked} locked
                  </span>
                </>
              )
            })()}
          </div>

          {/* Example Scenarios (with pack/tier gating visuals) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScenarios.map((scenario) => {
              const locked = !canAccess(scenario)
              return (
              <div key={scenario.id} className={`bg-white rounded-lg shadow-sm border p-6 relative ${locked ? 'border-gray-200 opacity-90' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{scenario.pack}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-1">Trigger:</h4>
                    <p className="text-red-700 text-sm italic">{scenario.trigger}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 mb-1">Grey Rock Response:</h4>
                    <p className="text-green-700 text-sm">{scenario.goodResponse}</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-800 mb-1">Why This Works:</h4>
                    <p className="text-yellow-700 text-sm">{scenario.explanation}</p>
                  </div>
                </div>

                {locked && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/80 backdrop-blur-sm" />
                    <div className="relative h-full w-full flex items-center justify-center p-4">
                      <div className="w-full max-w-xs text-center bg-white/90 border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Lock className="h-4 w-4 text-gray-700" />
                          <span>Locked content</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">Your plan: {subscriptionTier.charAt(0).toUpperCase()+subscriptionTier.slice(1)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Requires {scenario.minTier.charAt(0).toUpperCase()+scenario.minTier.slice(1)}</span>
                        </div>
                        <a
                          href="/subscription"
                          className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Upgrade to unlock
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Practice Mode */}
          {!currentScenario ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Practice?</h2>
              <p className="text-gray-600 mb-6">Test your Grey Rock skills with realistic scenarios</p>
              {/* Practice settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl mx-auto text-left mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Practice settings</h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-xs text-gray-600">Pack</label>
                    <div className="flex flex-wrap gap-2">
                      {packs.map(p => (
                        <button key={p} onClick={() => setPracticePack(p)}
                          className={`px-3 py-1 rounded-full text-xs border ${practicePack===p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-xs text-gray-600">Difficulty</label>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map(d => (
                        <button key={d} onClick={() => setPracticeDifficulty(d)}
                          className={`px-3 py-1 rounded-full text-xs border ${practiceDifficulty===d ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  {practicePool.length} scenarios in pool based on your plan and settings
                </div>
                {/* Gamification chips in pre-start */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {streak && (
                    <span className="inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                      🔥 Streak {streak.current_streak} {streak.best_streak > 0 ? `(best ${streak.best_streak})` : ''}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    Basics {packStats['Basics']}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    Boundaries {packStats['Boundaries']}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    High-Conflict {packStats['High-Conflict']}
                  </span>
                </div>
              </div>
              {loadingScenarios && (
                <div className="text-sm text-gray-500 mb-4">Loading scenarios…</div>
              )}
              {availableScenarios.length === 0 && (
                <div className="max-w-md mx-auto mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
                  <p className="text-sm">No scenarios available for your plan or no content yet. {dbScenarios.length === 0 ? 'Content will appear as scenarios are added.' : 'Upgrade to access more practice content.'}</p>
                  <a href="/subscription" className="inline-block mt-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 underline">View plans</a>
                </div>
              )}
              <button
                onClick={startPractice}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                disabled={!!limitReached || availableScenarios.length === 0}
              >
                <Play className="h-4 w-4" />
                Start Practice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Compact practice settings (affects next scenario) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="text-xs text-gray-600">Practice filters (affect next):</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {packs.map(p => (
                    <button key={p} onClick={() => setPracticePack(p)}
                      className={`px-2.5 py-1 rounded-full text-xs border ${practicePack===p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {difficulties.map(d => (
                    <button key={d} onClick={() => setPracticeDifficulty(d)}
                      className={`px-2.5 py-1 rounded-full text-xs border ${practiceDifficulty===d ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                {/* Gamification chips in-session */}
                <div className="flex items-center gap-2 flex-wrap">
                  {streak && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                      🔥 {streak.current_streak}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    B {packStats['Basics']}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    Bd {packStats['Boundaries']}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                    HC {packStats['High-Conflict']}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{currentScenario.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentScenario.difficulty)}`}>
                    {currentScenario.difficulty}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Score: {score.correct}/{score.total}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{currentScenario.description}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-red-800">They say:</h3>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-red-800/80">
                      <input
                        type="checkbox"
                        checked={autoplayAudio}
                        onChange={(e) => setAutoplayAudio(e.target.checked)}
                      />
                      Autoplay audio
                    </label>
                    <button
                      onClick={() => speakTrigger(currentScenario.trigger)}
                      className="text-sm text-red-800 hover:text-red-900 underline"
                    >
                      {isSpeaking ? 'Replay' : 'Play'}
                    </button>
                  </div>
                </div>
                <p className="text-red-700 italic">"{currentScenario.trigger}"</p>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">How do you respond?</h3>

              {/* Micro-coaching tips and controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {showTips && (
                    <div className="inline-flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full">
                      <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                      <span>
                        Keep it calm, brief, neutral. Acknowledge without defending.
                      </span>
                      <button
                        onClick={() => setTipsExpanded((v) => !v)}
                        className="ml-1 underline hover:text-slate-900"
                      >
                        {tipsExpanded ? 'Less' : 'More tips'}
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setShowTips((v) => !v)}
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    {showTips ? 'Hide tips' : 'Show tips'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isPausing) return
                      setIsPausing(true)
                      setCountdown(5)
                    }}
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    aria-pressed={isPausing}
                  >
                    {isPausing ? 'Pausing…' : 'Pause 5s before responding'}
                  </button>
                  <button
                    onClick={() => setShowWhyPanel(true)}
                    className="text-xs text-indigo-700 hover:text-indigo-900 underline"
                  >
                    Why this works
                  </button>
                </div>
              </div>

              {tipsExpanded && showTips && (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-700 mb-4">
                  • Use short, neutral phrases like “Okay.” “I’ll consider that.”
                  <br />• Don’t justify or defend; acknowledge without taking responsibility.
                  <br />• End quickly and redirect or disengage.
                </div>
              )}

              {/* Countdown live region for accessibility */}
              {isPausing && (
                <div
                  className="mb-3 text-xs text-gray-600"
                  role="status"
                  aria-live="assertive"
                >
                  Pause in progress… {countdown}s remaining
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleResponseSelect(currentScenario.goodResponse)}
                  disabled={showResult || isPausing}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedResponse === currentScenario.goodResponse
                      ? showResult
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } ${(showResult || isPausing) ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                >
                  {currentScenario.goodResponse}
                  {showResult && selectedResponse === currentScenario.goodResponse && (
                    <CheckCircle className="h-5 w-5 text-green-500 float-right mt-0.5" />
                  )}
                </button>
                
                <button
                  onClick={() => handleResponseSelect(currentScenario.badResponse)}
                  disabled={showResult || isPausing}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedResponse === currentScenario.badResponse
                      ? showResult
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } ${(showResult || isPausing) ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                >
                  {currentScenario.badResponse}
                  {showResult && selectedResponse === currentScenario.badResponse && (
                    <X className="h-5 w-5 text-red-500 float-right mt-0.5" />
                  )}
                </button>
              </div>
              
              {showWhyPanel && currentScenario && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Why this works</h4>
                      <p className="text-yellow-700 text-sm">{currentScenario.explanation}</p>
                    </div>
                    <button
                      onClick={() => setShowWhyPanel(false)}
                      className="text-yellow-800 hover:text-yellow-900 text-sm underline"
                      aria-label="Close why this works"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700 text-sm">{currentScenario.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    setCurrentScenario(null)
                    const startedAt = sessionStartRef.current
                    sessionStartRef.current = null
                    stopSpeech()
                    const duration = startedAt ? Date.now() - startedAt : undefined
                    await recordFeatureUsage(userId, 'grey_rock_practice', 'monthly_count', 0, {
                      event: 'end',
                      duration_ms: duration,
                      score: score,
                    })
                    if (session) {
                      await endGreyRockSession(session.id, {
                        ended_at: new Date().toISOString(),
                        duration_ms: duration,
                        total_attempts: score.total,
                        correct_count: score.correct,
                      })
                      setSession(null)
                    }
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  End Practice
                </button>
                {showResult && (
                  <button
                    onClick={nextScenario}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    Next Scenario
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
