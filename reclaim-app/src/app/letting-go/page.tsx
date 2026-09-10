'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, TrendingUp, Heart, HelpCircle, ChevronDown, ChevronUp, Sparkles, Award, Mic } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LettingGoPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [affirmations, setAffirmations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [usageRemaining, setUsageRemaining] = useState<number | null>(null)
  const [activeRecognition, setActiveRecognition] = useState<any>(null)
  const [recordingField, setRecordingField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    raw_thoughts: '',
    gratitude_list: ['', '', ''],
    present_moment_focus: '',
    mindfulness_practice: '',
    old_pattern: '',
    pattern_interrupt_action: '',
    new_response: '',
    third_person_perspective: '',
    objective_truth: '',
    emotional_state_before: 5,
    emotional_state_after: 5,
    notes: ''
  })
  const router = useRouter()
  const supabase = createClient()

  const loadData = async (userId: string) => {
    const { data: entriesData } = await supabase
      .from('letting_go_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(30)
    
    const { data: milestonesData } = await supabase
      .from('detachment_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('milestone_date', { ascending: false })
      .limit(10)
    
    const { data: affirmationsData } = await supabase
      .from('letting_go_affirmations')
      .select('*')
      .eq('is_default', true)
    
    setEntries(entriesData || [])
    setMilestones(milestonesData || [])
    setAffirmations(affirmationsData || [])
  }

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

      await loadData(user.id)
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async () => {
    if (!user) return

    const { error } = await supabase
      .from('letting_go_entries')
      .upsert({
        user_id: user.id,
        entry_date: new Date().toISOString().split('T')[0],
        ...formData
      })

    if (error) {
      toast.error('Failed to save entry')
    } else {
      toast.success('Entry saved')
      setShowForm(false)
      resetForm()
      await loadData(user.id)
    }
  }

  const resetForm = () => {
    setFormData({
      raw_thoughts: '',
      gratitude_list: ['', '', ''],
      present_moment_focus: '',
      mindfulness_practice: '',
      old_pattern: '',
      pattern_interrupt_action: '',
      new_response: '',
      third_person_perspective: '',
      objective_truth: '',
      emotional_state_before: 5,
      emotional_state_after: 5,
      notes: ''
    })
  }

  const calculateProgress = (entry: any) => {
    if (!entry.emotional_state_before || !entry.emotional_state_after) return 0
    return entry.emotional_state_after - entry.emotional_state_before
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  const latestProgress = entries.length > 0 ? calculateProgress(entries[0]) : 0
  const avgProgress = entries.length > 0 
    ? Math.round(entries.reduce((sum, e) => sum + calculateProgress(e), 0) / entries.length * 10) / 10
    : 0
  const completedSteps = entries.length > 0 ? entries[0].raw_thoughts ? 1 : 0 + 
    (entries[0].gratitude_list?.filter((g: string) => g).length > 0 ? 1 : 0) +
    (entries[0].present_moment_focus ? 1 : 0) +
    (entries[0].pattern_interrupt_action ? 1 : 0) +
    (entries[0].third_person_perspective ? 1 : 0) : 0

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Letting Go Tracker</h1>
                <Link 
                  href="/docs/LETTING_GO_GUIDE.html"
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-700"
                  title="View User Guide"
                >
                  <HelpCircle className="h-6 w-6" />
                </Link>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Track your journey from attachment to freedom</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add Entry
          </button>
        </div>

        {entries.length > 0 && (
          <>
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  setAnalyzing(true)
                  try {
                    const res = await fetch('/api/letting-go/ai-analyze', {
                      method: 'POST'
                    })
                    const data = await res.json()
                    
                    if (res.status === 403) {
                      if (data.requiresUpgrade) {
                        toast.error('AI Analysis requires Recovery tier or higher')
                        router.push('/subscription?feature=letting-go-ai')
                      } else {
                        toast.error(data.error)
                      }
                    } else if (res.ok) {
                      setAiAnalysis(data.analysis)
                      setUsageRemaining(data.usageRemaining)
                      toast.success('Analysis complete!')
                    } else {
                      toast.error(data.error || 'Analysis failed')
                    }
                  } catch (error) {
                    toast.error('Failed to analyze progress')
                  }
                  setAnalyzing(false)
                }}
                disabled={analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
              >
                <Sparkles className="h-4 w-4" />
                {analyzing ? 'Analyzing...' : 'AI Analyze Progress'}
              </button>
            </div>

            {aiAnalysis && (
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Sparkles className="h-5 w-5" />
                    AI Progress Analysis
                    {usageRemaining !== null && (
                      <span className="text-xs font-normal text-purple-600">({usageRemaining} left today)</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Overall Assessment</h3>
                    <p className="text-purple-800">{aiAnalysis.overallAssessment}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Your Strengths</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {aiAnalysis.strengths?.map((strength: string, i: number) => (
                        <li key={i} className="text-purple-800">{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Areas to Focus</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {aiAnalysis.areasToFocus?.map((area: string, i: number) => (
                        <li key={i} className="text-purple-800">{area}</li>
                      ))}
                    </ul>
                  </div>

                  {aiAnalysis.cognitiveDistortions && aiAnalysis.cognitiveDistortions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">ðŸ§  Cognitive Distortions Detected</h3>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.cognitiveDistortions.map((distortion: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {distortion}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-purple-700 mt-2 italic">These thinking patterns keep you stuck. Notice them without judgment.</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Core Attachment Triggers</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.attachmentTriggers?.map((trigger: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>

                  {aiAnalysis.patternInterruptSuggestions && aiAnalysis.patternInterruptSuggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">âš¡ Pattern Interrupt Suggestions</h3>
                      <div className="space-y-2">
                        {aiAnalysis.patternInterruptSuggestions.map((suggestion: string, i: number) => (
                          <div key={i} className="p-2 bg-orange-50 rounded border border-orange-200 text-sm text-orange-900">
                            {i + 1}. {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiAnalysis.thirdPersonReframe && (
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <h3 className="font-semibold text-pink-900 mb-2">ðŸ‘¥ Third Person Perspective</h3>
                      <p className="text-sm text-pink-800 italic">"{aiAnalysis.thirdPersonReframe}"</p>
                    </div>
                  )}

                  {aiAnalysis.gratitudePrompts && aiAnalysis.gratitudePrompts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">ðŸ™ Gratitude Prompts for You</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                        {aiAnalysis.gratitudePrompts.map((prompt: string, i: number) => (
                          <li key={i}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.mostEffectiveStep && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-1">ðŸŽ¯ Most Effective Step for You</h3>
                      <p className="text-sm text-blue-800">{aiAnalysis.mostEffectiveStep}</p>
                    </div>
                  )}

                  {aiAnalysis.personalizedExercises && aiAnalysis.personalizedExercises.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">Personalized Exercises</h3>
                      <div className="space-y-3">
                        {aiAnalysis.personalizedExercises.map((exercise: any, i: number) => (
                          <div key={i} className="p-3 bg-white rounded-lg border border-purple-200">
                            <div className="font-medium text-purple-900">{exercise.title}</div>
                            <div className="text-sm text-purple-800 mt-1">{exercise.description}</div>
                            <div className="text-xs text-purple-600 mt-1 italic">Why: {exercise.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiAnalysis.affirmationSuggestion && (
                    <div className="p-4 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                      <div className="text-sm font-medium text-indigo-900 mb-1">Personalized Affirmation:</div>
                      <div className="text-indigo-800 italic font-medium">"{aiAnalysis.affirmationSuggestion}"</div>
                    </div>
                  )}

                  {aiAnalysis.nextMilestone && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="text-sm font-medium text-yellow-900">Next Milestone:</div>
                          <div className="text-sm text-yellow-800">{aiAnalysis.nextMilestone}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800">{aiAnalysis.encouragement}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{completedSteps}/5</div>
                  <div className="text-sm text-gray-600 mt-1">Steps Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{latestProgress > 0 ? '+' : ''}{latestProgress}</div>
                  <div className="text-sm text-gray-600 mt-1">Mood Shift Today</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{entries.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Days Tracked</div>
                </div>
              </CardContent>
            </Card>
          </div>
          </>
        )}

        {showForm && (
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle>Today's Letting Go Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">The 5-Step Art of Letting Go</h3>
                <p className="text-sm text-gray-600">Complete as many steps as you can today. Even one step helps.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Step 1: Raw Thought Journaling (Brain Dump)</h4>
                  <p className="text-xs text-blue-700 mb-3">Write every fear, worry, obsessive thought. No filter, no judgment.</p>
                  <div className="relative">
                    <textarea
                      value={formData.raw_thoughts}
                      onChange={(e) => setFormData({...formData, raw_thoughts: e.target.value})}
                      className="w-full p-3 border rounded-lg pr-10"
                      rows={4}
                      placeholder="I'm scared that... I keep thinking about... I can't stop worrying that..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (recordingField === 'raw_thoughts') {
                          activeRecognition?.stop()
                          setActiveRecognition(null)
                          setRecordingField(null)
                        } else {
                          if ('webkitSpeechRecognition' in window) {
                            activeRecognition?.stop()
                            const recognition = new (window as any).webkitSpeechRecognition()
                            recognition.continuous = true
                            recognition.interimResults = true
                            recognition.onresult = (e: any) => {
                              let transcript = ''
                              for (let i = 0; i < e.results.length; i++) {
                                transcript += e.results[i][0].transcript
                              }
                              setFormData(prev => ({...prev, raw_thoughts: transcript}))
                            }
                            recognition.start()
                            setActiveRecognition(recognition)
                            setRecordingField('raw_thoughts')
                          }
                        }
                      }}
                      className={`absolute right-2 top-2 p-1.5 transition-colors ${recordingField === 'raw_thoughts' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Step 2: Thankfulness Journal</h4>
                  <p className="text-xs text-green-700 mb-3">List 3 things you're grateful for right now.</p>
                  <div className="space-y-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="relative">
                        <input
                          type="text"
                          value={formData.gratitude_list[i]}
                          onChange={(e) => {
                            const newList = [...formData.gratitude_list]
                            newList[i] = e.target.value
                            setFormData({...formData, gratitude_list: newList})
                          }}
                          className="w-full p-2 border rounded pr-10"
                          placeholder={`${i + 1}. I'm grateful for...`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const fieldName = `gratitude_${i}`
                            if (recordingField === fieldName) {
                              activeRecognition?.stop()
                              setActiveRecognition(null)
                              setRecordingField(null)
                            } else {
                              if ('webkitSpeechRecognition' in window) {
                                activeRecognition?.stop()
                                const recognition = new (window as any).webkitSpeechRecognition()
                                recognition.continuous = true
                                recognition.interimResults = true
                                recognition.onresult = (e: any) => {
                                  let transcript = ''
                                  for (let j = 0; j < e.results.length; j++) {
                                    transcript += e.results[j][0].transcript
                                  }
                                  setFormData(prev => {
                                    const newList = [...prev.gratitude_list]
                                    newList[i] = transcript
                                    return {...prev, gratitude_list: newList}
                                  })
                                }
                                recognition.start()
                                setActiveRecognition(recognition)
                                setRecordingField(fieldName)
                              }
                            }
                          }}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-colors ${recordingField === `gratitude_${i}` ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                          title="Voice input"
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Step 3: Mindfulness (Present Moment)</h4>
                  <p className="text-xs text-purple-700 mb-3">What are you doing RIGHT NOW? Stay in this moment.</p>
                  <div className="relative">
                    <textarea
                      value={formData.present_moment_focus}
                      onChange={(e) => setFormData({...formData, present_moment_focus: e.target.value})}
                      className="w-full p-3 border rounded-lg pr-10"
                      rows={2}
                      placeholder="Right now I am... I can see/hear/feel..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (recordingField === 'present_moment_focus') {
                          activeRecognition?.stop()
                          setActiveRecognition(null)
                          setRecordingField(null)
                        } else {
                          if ('webkitSpeechRecognition' in window) {
                            activeRecognition?.stop()
                            const recognition = new (window as any).webkitSpeechRecognition()
                            recognition.continuous = true
                            recognition.interimResults = true
                            recognition.onresult = (e: any) => {
                              let transcript = ''
                              for (let i = 0; i < e.results.length; i++) {
                                transcript += e.results[i][0].transcript
                              }
                              setFormData(prev => ({...prev, present_moment_focus: transcript}))
                            }
                            recognition.start()
                            setActiveRecognition(recognition)
                            setRecordingField('present_moment_focus')
                          }
                        }
                      }}
                      className={`absolute right-2 top-2 p-1.5 transition-colors ${recordingField === 'present_moment_focus' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <select
                    value={formData.mindfulness_practice}
                    onChange={(e) => setFormData({...formData, mindfulness_practice: e.target.value})}
                    className="w-full p-2 border rounded mt-2"
                  >
                    <option value="">Mindfulness practice used...</option>
                    <option value="breathing">Deep breathing</option>
                    <option value="body_scan">Body scan</option>
                    <option value="observation">5 senses observation</option>
                    <option value="meditation">Meditation</option>
                    <option value="grounding">Grounding exercise</option>
                  </select>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Step 4: Pattern Interrupt</h4>
                  <p className="text-xs text-orange-700 mb-3">Catch the automatic negative thought and choose a new response.</p>
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        value={formData.old_pattern}
                        onChange={(e) => setFormData({...formData, old_pattern: e.target.value})}
                        className="w-full p-2 border rounded pr-10"
                        rows={2}
                        placeholder="Old pattern: I always... I can't help but..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (recordingField === 'old_pattern') {
                            activeRecognition?.stop()
                            setActiveRecognition(null)
                            setRecordingField(null)
                          } else {
                            if ('webkitSpeechRecognition' in window) {
                              activeRecognition?.stop()
                              const recognition = new (window as any).webkitSpeechRecognition()
                              recognition.continuous = true
                              recognition.interimResults = true
                              recognition.onresult = (e: any) => {
                                let transcript = ''
                                for (let i = 0; i < e.results.length; i++) {
                                  transcript += e.results[i][0].transcript
                                }
                                setFormData(prev => ({...prev, old_pattern: transcript}))
                              }
                              recognition.start()
                              setActiveRecognition(recognition)
                              setRecordingField('old_pattern')
                            }
                          }
                        }}
                        className={`absolute right-2 top-2 p-1 transition-colors ${recordingField === 'old_pattern' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.pattern_interrupt_action}
                        onChange={(e) => setFormData({...formData, pattern_interrupt_action: e.target.value})}
                        className="w-full p-2 border rounded pr-10"
                        rows={2}
                        placeholder="What I did to interrupt: I stopped and... I chose to..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (recordingField === 'pattern_interrupt_action') {
                            activeRecognition?.stop()
                            setActiveRecognition(null)
                            setRecordingField(null)
                          } else {
                            if ('webkitSpeechRecognition' in window) {
                              activeRecognition?.stop()
                              const recognition = new (window as any).webkitSpeechRecognition()
                              recognition.continuous = true
                              recognition.interimResults = true
                              recognition.onresult = (e: any) => {
                                let transcript = ''
                                for (let i = 0; i < e.results.length; i++) {
                                  transcript += e.results[i][0].transcript
                                }
                                setFormData(prev => ({...prev, pattern_interrupt_action: transcript}))
                              }
                              recognition.start()
                              setActiveRecognition(recognition)
                              setRecordingField('pattern_interrupt_action')
                            }
                          }
                        }}
                        className={`absolute right-2 top-2 p-1 transition-colors ${recordingField === 'pattern_interrupt_action' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.new_response}
                        onChange={(e) => setFormData({...formData, new_response: e.target.value})}
                        className="w-full p-2 border rounded pr-10"
                        rows={2}
                        placeholder="New response: Instead I... This time I..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (recordingField === 'new_response') {
                            activeRecognition?.stop()
                            setActiveRecognition(null)
                            setRecordingField(null)
                          } else {
                            if ('webkitSpeechRecognition' in window) {
                              activeRecognition?.stop()
                              const recognition = new (window as any).webkitSpeechRecognition()
                              recognition.continuous = true
                              recognition.interimResults = true
                              recognition.onresult = (e: any) => {
                                let transcript = ''
                                for (let i = 0; i < e.results.length; i++) {
                                  transcript += e.results[i][0].transcript
                                }
                                setFormData(prev => ({...prev, new_response: transcript}))
                              }
                              recognition.start()
                              setActiveRecognition(recognition)
                              setRecordingField('new_response')
                            }
                          }
                        }}
                        className={`absolute right-2 top-2 p-1 transition-colors ${recordingField === 'new_response' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-pink-900 mb-2">Step 5: Third Person Thinking</h4>
                  <p className="text-xs text-pink-700 mb-3">Imagine advising a friend. What would you tell them?</p>
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        value={formData.third_person_perspective}
                        onChange={(e) => setFormData({...formData, third_person_perspective: e.target.value})}
                        className="w-full p-2 border rounded pr-10"
                        rows={2}
                        placeholder="If my friend told me this, I would say..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (recordingField === 'third_person_perspective') {
                            activeRecognition?.stop()
                            setActiveRecognition(null)
                            setRecordingField(null)
                          } else {
                            if ('webkitSpeechRecognition' in window) {
                              activeRecognition?.stop()
                              const recognition = new (window as any).webkitSpeechRecognition()
                              recognition.continuous = true
                              recognition.interimResults = true
                              recognition.onresult = (e: any) => {
                                let transcript = ''
                                for (let i = 0; i < e.results.length; i++) {
                                  transcript += e.results[i][0].transcript
                                }
                                setFormData(prev => ({...prev, third_person_perspective: transcript}))
                              }
                              recognition.start()
                              setActiveRecognition(recognition)
                              setRecordingField('third_person_perspective')
                            }
                          }
                        }}
                        className={`absolute right-2 top-2 p-1 transition-colors ${recordingField === 'third_person_perspective' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.objective_truth}
                        onChange={(e) => setFormData({...formData, objective_truth: e.target.value})}
                        className="w-full p-2 border rounded pr-10"
                        rows={2}
                        placeholder="The objective truth is... What's actually happening is..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (recordingField === 'objective_truth') {
                            activeRecognition?.stop()
                            setActiveRecognition(null)
                            setRecordingField(null)
                          } else {
                            if ('webkitSpeechRecognition' in window) {
                              activeRecognition?.stop()
                              const recognition = new (window as any).webkitSpeechRecognition()
                              recognition.continuous = true
                              recognition.interimResults = true
                              recognition.onresult = (e: any) => {
                                let transcript = ''
                                for (let i = 0; i < e.results.length; i++) {
                                  transcript += e.results[i][0].transcript
                                }
                                setFormData(prev => ({...prev, objective_truth: transcript}))
                              }
                              recognition.start()
                              setActiveRecognition(recognition)
                              setRecordingField('objective_truth')
                            }
                          }
                        }}
                        className={`absolute right-2 top-2 p-1 transition-colors ${recordingField === 'objective_truth' ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">How do you feel?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Before: <span className="text-red-600 font-bold">{formData.emotional_state_before}</span></label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.emotional_state_before}
                      onChange={(e) => setFormData({...formData, emotional_state_before: parseInt(e.target.value)})}
                      className="w-full accent-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">After: <span className="text-green-600 font-bold">{formData.emotional_state_after}</span></label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.emotional_state_after}
                      onChange={(e) => setFormData({...formData, emotional_state_after: parseInt(e.target.value)})}
                      className="w-full accent-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Entry
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader className="cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-indigo-800">ðŸ’¡ About Letting Go</CardTitle>
              {showInfo ? <ChevronUp className="h-5 w-5 text-indigo-600" /> : <ChevronDown className="h-5 w-5 text-indigo-600" />}
            </div>
          </CardHeader>
          {showInfo && (
            <CardContent className="space-y-2 text-sm text-indigo-900">
              <p>Track your journey from emotional attachment to healthy detachment.</p>
              <div className="space-y-1">
                <div><strong>âœ“ Measure progress:</strong> See your detachment levels improve over time</div>
                <div><strong>âœ“ Identify patterns:</strong> What triggers attachment feelings?</div>
                <div><strong>âœ“ Celebrate milestones:</strong> First day without thinking about them</div>
                <div><strong>âœ“ Build new identity:</strong> Who are you becoming without them?</div>
              </div>
            </CardContent>
          )}
        </Card>

        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Milestones Achieved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{milestone.title}</div>
                      <div className="text-sm text-gray-600">{milestone.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(milestone.milestone_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Start Your Letting Go Journey</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Track your progress from attachment to freedom
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
              >
                Add First Entry
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Your Progress
            </h2>
            {entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow border-indigo-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">{calculateDetachmentScore(entry)}%</div>
                      <div className="text-sm text-gray-500">{new Date(entry.entry_date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entry.raw_thoughts && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Step 1: Raw Thoughts</div>
                        <div className="text-sm text-blue-800">{entry.raw_thoughts}</div>
                      </div>
                    )}

                    {entry.gratitude_list && entry.gratitude_list.filter((g: string) => g).length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xs font-semibold text-green-900 mb-1">Step 2: Gratitude</div>
                        <ul className="list-disc list-inside text-sm text-green-800">
                          {entry.gratitude_list.filter((g: string) => g).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.present_moment_focus && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-xs font-semibold text-purple-900 mb-1">Step 3: Mindfulness</div>
                        <div className="text-sm text-purple-800">{entry.present_moment_focus}</div>
                        {entry.mindfulness_practice && (
                          <div className="text-xs text-purple-600 mt-1">Practice: {entry.mindfulness_practice}</div>
                        )}
                      </div>
                    )}

                    {entry.pattern_interrupt_action && (
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-xs font-semibold text-orange-900 mb-1">Step 4: Pattern Interrupt</div>
                        {entry.old_pattern && <div className="text-xs text-orange-700 mb-1">Old: {entry.old_pattern}</div>}
                        <div className="text-sm text-orange-800">{entry.pattern_interrupt_action}</div>
                        {entry.new_response && <div className="text-xs text-orange-700 mt-1">New: {entry.new_response}</div>}
                      </div>
                    )}

                    {entry.third_person_perspective && (
                      <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="text-xs font-semibold text-pink-900 mb-1">Step 5: Third Person View</div>
                        <div className="text-sm text-pink-800">{entry.third_person_perspective}</div>
                        {entry.objective_truth && <div className="text-xs text-pink-700 mt-1">Truth: {entry.objective_truth}</div>}
                      </div>
                    )}

                    {entry.emotional_state_before && entry.emotional_state_after && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Mood shift:</span>
                        <span className="font-bold">{entry.emotional_state_before} â†’ {entry.emotional_state_after}</span>
                        <span className={`font-bold ${entry.emotional_state_after > entry.emotional_state_before ? 'text-green-600' : 'text-gray-600'}`}>
                          ({entry.emotional_state_after > entry.emotional_state_before ? '+' : ''}{entry.emotional_state_after - entry.emotional_state_before})
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
