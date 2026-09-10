'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { 
  AlertCircle, Heart, Flame, MessageSquareOff, 
  RefreshCw, TrendingDown, Repeat, HelpCircle,
  Clock, CheckCircle2, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'
import React from 'react'

// Helper function to render text with markdown formatting
function renderMarkdownText(text: string): JSX.Element[] {
  if (!text) return []
  
  // Handle bold text (**text**)
  let parts = text.split(/\*\*(.*?)\*\*/g)
  let elements = parts.map((part, partIndex) =>
    partIndex % 2 === 1 ? (
      <strong key={`bold-${partIndex}`} className="font-semibold">{part}</strong>
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
        return <React.Fragment key={`group-${index}`}>{italicElements}</React.Fragment>
      }
    }
    return element
  })
}

const crisisTypes = [
  { 
    id: 'discard', 
    icon: Heart, 
    label: 'Discard/Breakup',
    description: 'They suddenly ended it',
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  },
  { 
    id: 'rage', 
    icon: Flame, 
    label: 'Narcissistic Rage',
    description: 'They exploded at me',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  },
  { 
    id: 'silent_treatment', 
    icon: MessageSquareOff, 
    label: 'Silent Treatment',
    description: "They're ignoring me",
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  { 
    id: 'hoovering', 
    icon: RefreshCw, 
    label: 'Hoovering',
    description: "They're trying to come back",
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  { 
    id: 'devaluation', 
    icon: TrendingDown, 
    label: 'Devaluation',
    description: "They're treating me terribly",
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  },
  { 
    id: 'gaslighting', 
    icon: AlertCircle, 
    label: 'Gaslighting',
    description: "They're denying reality",
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  { 
    id: 'cycle_repeat', 
    icon: Repeat, 
    label: 'Cycle Repeat',
    description: "It's happening again",
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
  },
  { 
    id: 'custom', 
    icon: HelpCircle, 
    label: 'Describe Your Situation',
    description: 'Tell AI what happened in your own words',
    color: 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 hover:from-teal-100 hover:to-cyan-100'
  }
]

export default function CrisisReframeClient() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'select' | 'context' | 'confirm' | 'reframe'>('select')
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null)
  const [context, setContext] = useState<any>({})
  const [reframe, setReframe] = useState<any>(null)
  const [reframeId, setReframeId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)
      setLoading(false)

      // Load history
      const res = await fetch('/api/crisis-reframe/history')
      const data = await res.json()
      setHistory(data.reframes || [])
    }
    init()
  }, [router, supabase])

  const handleCrisisSelect = (crisisId: string) => {
    setSelectedCrisis(crisisId)
    setStep('context')
  }

  const handleContextSubmit = () => {
    setStep('confirm')
  }

  const handleConfirmControl = async () => {
    setGenerating(true)
    
    try {
      const res = await fetch('/api/crisis-reframe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crisis_type: selectedCrisis,
          context
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to generate reframe')
        setGenerating(false)
        return
      }

      setReframe(data.reframe)
      setReframeId(data.id)
      setStep('reframe')
      toast.success('Your reframe is ready')

    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate reframe')
    } finally {
      setGenerating(false)
    }
  }

  const handleRestart = () => {
    setStep('select')
    setSelectedCrisis(null)
    setContext({})
    setReframe(null)
    setReframeId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crisis Reframe</h1>
              <p className="text-gray-600 mt-2">Immediate support when you're in panic</p>
            </div>
            <button
              onClick={() => window.open('/docs/CRISIS_REFRAME_USER_GUIDE.html', '_blank')}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Crisis Reframe User Guide"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {step === 'select' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">What just happened?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {crisisTypes.map((crisis) => {
                const Icon = crisis.icon
                return (
                  <button
                    key={crisis.id}
                    onClick={() => handleCrisisSelect(crisis.id)}
                    className={`${crisis.color} border-2 rounded-lg p-6 text-left transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{crisis.label}</h3>
                        <p className="text-sm text-gray-600">{crisis.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {history.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Reframes</h2>
                <div className="space-y-3">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium capitalize">{item.crisis_type.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500 ml-3">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setReframe(item.ai_reframe)
                            setReframeId(item.id)
                            setStep('reframe')
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'context' && selectedCrisis && (
          <ContextQuestions
            crisisType={selectedCrisis}
            context={context}
            setContext={setContext}
            onSubmit={handleContextSubmit}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'confirm' && (
          <ControlConfirmation
            onConfirm={handleConfirmControl}
            onBack={() => setStep('context')}
            generating={generating}
          />
        )}

        {step === 'reframe' && reframe && reframeId && (
          <ReframeDisplay
            reframe={reframe}
            reframeId={reframeId}
            onRestart={handleRestart}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function ContextQuestions({ crisisType, context, setContext, onSubmit, onBack }: any) {
  const questions = getQuestionsForCrisis(crisisType)

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">
        {crisisType === 'custom' ? 'Tell me your story' : 'Help me understand'}
      </h2>
      <p className="text-gray-600 mb-6">
        {crisisType === 'custom' 
          ? 'Share as much or as little as you want. The AI will analyze your situation and provide a personalized reframe.'
          : 'Just a few quick questions (optional but helpful)'}
      </p>

      <div className="space-y-6">
        {questions.map((q: any, idx: number) => (
          <div key={idx}>
            <label className="block text-sm font-medium mb-2">{q.question}</label>
            {q.type === 'select' && (
              <select
                value={context[q.key] || ''}
                onChange={(e) => setContext({ ...context, [q.key]: e.target.value })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select...</option>
                {q.options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {q.type === 'boolean' && (
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={context[q.key] === true}
                    onChange={() => setContext({ ...context, [q.key]: true })}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={context[q.key] === false}
                    onChange={() => setContext({ ...context, [q.key]: false })}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            )}
            {q.type === 'text' && (
              <input
                type="text"
                value={context[q.key] || ''}
                onChange={(e) => setContext({ ...context, [q.key]: e.target.value })}
                placeholder={q.placeholder}
                className="w-full border rounded-lg p-2"
              />
            )}
            {q.type === 'textarea' && (
              <textarea
                value={context[q.key] || ''}
                onChange={(e) => setContext({ ...context, [q.key]: e.target.value })}
                placeholder={q.placeholder}
                rows={6}
                className="w-full border rounded-lg p-3 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      {crisisType === 'custom' && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-900">
            <strong>ðŸ’¡ Tip:</strong> The more details you share, the more personalized your reframe will be. 
            The AI will analyze your situation and turn it into hope, control, and encouragement.
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={crisisType === 'custom' && !context.custom_situation}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ControlConfirmation({ onConfirm, onBack, generating }: any) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 p-8 text-center">
      <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Before we continue...</h2>
      <p className="text-lg text-gray-700 mb-6">
        Take a deep breath. You're about to take control of this moment.
      </p>

      <div className="bg-white rounded-lg p-6 mb-6">
        <p className="text-gray-800 mb-4">
          By clicking below, you're choosing to pause, think, and respond with intention 
          instead of reacting from panic.
        </p>
        <p className="font-semibold text-indigo-900">
          You are in control right now.
        </p>
      </div>

      <button
        onClick={() => {
          setConfirmed(true)
          setTimeout(onConfirm, 500)
        }}
        disabled={generating || confirmed}
        className="w-full max-w-md mx-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-lg font-semibold transition-all transform hover:scale-105"
      >
        {generating ? 'Generating your reframe...' : confirmed ? 'Confirmed âœ“' : "I'm in control"}
      </button>

      <button
        onClick={onBack}
        disabled={generating}
        className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
      >
        Go back
      </button>
    </div>
  )
}

function ReframeDisplay({ reframe, reframeId, onRestart }: any) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [startTime] = useState(Date.now())
  const [survivedMinutes, setSurvivedMinutes] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - startTime) / 60000)
      setSurvivedMinutes(minutes)
    }, 60000)

    return () => clearInterval(interval)
  }, [startTime])

  const handleChecklistChange = async (key: string, checked: boolean) => {
    const newChecklist = { ...checklist, [key]: checked }
    setChecklist(newChecklist)

    // Save to database
    await fetch(`/api/crisis-reframe/${reframeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_control',
        checklist: newChecklist,
        survived_duration: survivedMinutes,
        prevented_contact: newChecklist.no_contact || false
      })
    })
  }

  const handleRate = async (rating: number) => {
    await fetch(`/api/crisis-reframe/${reframeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rate', rating })
    })
    toast.success('Thank you for your feedback')
  }

  return (
    <div className="space-y-6">
      {/* Survived Counter */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-900">You've survived this crisis for:</span>
        </div>
        <div className="text-3xl font-bold text-green-600">
          {survivedMinutes === 0 ? 'Just started' : `${survivedMinutes} minute${survivedMinutes !== 1 ? 's' : ''}`}
        </div>
        <p className="text-sm text-green-700 mt-2">Every minute you don't react is a victory</p>
      </div>

      {/* Control Section */}
      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-indigo-900">YOU ARE IN CONTROL RIGHT NOW</h3>
        </div>
        <p className="text-indigo-800 text-lg leading-relaxed whitespace-pre-line">
          {renderMarkdownText(reframe.control)}
        </p>
      </div>

      {/* Validation */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          What You're Feeling Is Real
        </h3>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
          {renderMarkdownText(reframe.validation)}
        </p>
      </div>

      {/* Pattern */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">ðŸŽ¯ What This Actually Is</h3>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
          {renderMarkdownText(reframe.pattern)}
        </p>
      </div>

      {/* Reframe */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-900">ðŸ’¡ The Reframe</h3>
        <p className="text-purple-900 leading-relaxed whitespace-pre-line">
          {renderMarkdownText(reframe.reframe)}
        </p>
      </div>

      {/* Hope Narrative */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-amber-900">ðŸŒ… Your Future</h3>
        <p className="text-amber-900 leading-relaxed whitespace-pre-line text-lg">
          {renderMarkdownText(reframe.hope)}
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">ðŸ›¡ï¸ Right Now, You Need To...</h3>
        <ul className="space-y-3">
          {reframe.actions.map((action: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-800">{renderMarkdownText(action)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coping Strategies */}
      {reframe.coping && reframe.coping.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">ðŸŒŸ How To Pass Through This Hard Time Successfully</h3>
          <p className="text-sm text-blue-800 mb-4">
            These positive activities and expert psychological techniques will help you be patient and get through this:
          </p>
          <ul className="space-y-3">
            {reframe.coping.map((strategy: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-blue-900 leading-relaxed">{renderMarkdownText(strategy)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Power Statement */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">ðŸ’ª Your Power In This Moment</h3>
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {renderMarkdownText(reframe.power)}
        </p>
      </div>

      {/* Control Checklist */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">âœ… My Commitments (Check what you'll do)</h3>
        <div className="space-y-3">
          {[
            { key: 'no_contact', label: 'I will not text/call them for the next hour' },
            { key: 'tell_someone', label: 'I will tell one person how I\'m feeling' },
            { key: 'reality_log', label: 'I will write down what happened' },
            { key: 'revisit', label: 'I will revisit this reframe if panic returns' },
            { key: 'self_kindness', label: 'I will be kind to myself today' }
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist[item.key] || false}
                onChange={(e) => handleChecklistChange(item.key, e.target.checked)}
                className="w-5 h-5 text-green-600 rounded"
              />
              <span className="text-gray-800">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-gray-50 border rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-3">How helpful was this reframe?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRate(rating)}
              className="px-4 py-2 border rounded-lg hover:bg-indigo-50 hover:border-indigo-300"
            >
              {'â­'.repeat(rating)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          New Crisis
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          Save/Print
        </button>
      </div>
    </div>
  )
}

function getQuestionsForCrisis(crisisType: string) {
  const commonQuestions = [
    {
      key: 'duration',
      question: 'How long were you together?',
      type: 'select',
      options: ['Less than 3 months', '3-6 months', '6-12 months', '1-2 years', '3-5 years', '5+ years']
    },
    {
      key: 'first_time',
      question: 'Is this the first time this has happened?',
      type: 'boolean'
    },
    {
      key: 'feeling',
      question: 'One word for how you feel right now?',
      type: 'text',
      placeholder: 'e.g., shattered, angry, confused...'
    }
  ]

  if (crisisType === 'custom') {
    return [
      {
        key: 'custom_situation',
        question: 'Describe your situation in detail',
        type: 'textarea',
        placeholder: 'Tell me what happened... Be as specific as you want. What did they do? How do you feel? What are you struggling with right now?'
      },
      {
        key: 'what_you_need',
        question: 'What kind of reframe do you need? (optional)',
        type: 'text',
        placeholder: 'e.g., help me see this differently, give me hope, help me stay strong...'
      },
      {
        key: 'feeling',
        question: 'How do you feel right now?',
        type: 'text',
        placeholder: 'e.g., devastated, confused, angry, numb...'
      }
    ]
  }

  return commonQuestions
}
