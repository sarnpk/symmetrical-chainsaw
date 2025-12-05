'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, TrendingUp, Waves, Sparkles, Timer, Target, Volume2, VolumeX, Flame, Users, ThumbsUp, Share2, HelpCircle, Mic } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

const URGE_TYPES = [
  { value: 'anger', label: 'Lashing Out & Anger', color: 'red', trigger: 'Feeling unheard, disrespected, unloved, or overstimulated', sensations: 'Heat in face, racing heart, pressure behind eyes', script: "Whoa. I am at a level 10. My face feels hot. The urge to attack is huge. This is just energy moving through me. It is important energy, but it needs to be packaged better before it's delivered. I will not speak while the wave is this high. I'm going to unclench my hands and ride this wave until it cools down to a simmer. I can understand this anger and know it's allowed to be here, without acting on it." },
  { value: 'spending', label: 'Impulsive Spending', color: 'purple', trigger: 'Insecurity, boredom, promise of dopamine', sensations: 'Rush of excitement, tunnel vision, itch to click', script: "I'm noticing that my brain is seeking a rush of dopamine. My brain thinks buying this will fix my mood. It's right, but only for about 30 seconds. Then dread and guilt will kick in. The urgency to click is high, but I'm going to close the tab. I will surf this 'wanting' sensation. It feels like an itch, but an itch is just uncomfortable. It doesn't kill you if you don't scratch it." },
  { value: 'texting', label: 'Anxious Attachment (Ex/Partner/Children)', color: 'pink', trigger: 'Uncertainty, fear of abandonment', sensations: 'Knot in stomach, shallow breath, frantic grasping energy', script: "This is an attachment spike. I feel terrified right now. My brain is telling me to text them to make the anxiety stop. But texting is a compulsion, not a connection. I will place my hand on my heart and ride this wave of uncertainty. I am safe even if they don't reply right now. I can do this." },
  { value: 'substances', label: 'Alcohol & Substances', color: 'orange', trigger: 'Transition anxiety, habit loop', sensations: 'Buzzing feeling, irritability, can\'t settle down', script: "Here is the 5 PM wave. I'm noticing how jittery my mind feels. My brain is saying, 'Just one to relax.' I'm not going to fight the thought, but I'm not going to obey it. I will breathe into this jittery feeling. Just for today, instead of numbing, I am going to do the hard thing and lean into my anxiety." },
  { value: 'food', label: 'Emotional Eating', color: 'yellow', trigger: 'Emotional hunger vs physical hunger', sensations: 'Empty feeling, restlessness, mouth watering', script: "I notice the urge to eat when I'm not hungry. This is emotional hunger, not physical hunger. My body is trying to soothe something. I'm going to pause and ask: what am I really hungry for? Connection? Comfort? Rest? I can give myself what I truly need." },
  { value: 'porn', label: 'Pornography & Compulsive Behaviors', color: 'indigo', trigger: 'Seeking escape, dopamine, numbing', sensations: 'Restlessness, tunnel vision, urgency', script: "I notice the urge for escape. My brain is seeking dopamine and numbing. This urge feels urgent, but it's just a wave. It will peak and pass. I don't need to act on it. I can sit with this discomfort. What am I really seeking? Connection? Validation? I can meet that need in a healthier way. This urge is temporary. I am in control." },
  { value: 'other', label: 'Other', color: 'gray', trigger: 'Various triggers', sensations: 'Varies by situation', script: "I feel the urge rising. This feeling is temporary. Urges peak and then they pass. I don't have to act on this. I can ride this wave. I am safe. This will pass." }
]

export default function UrgeSurfingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [streak, setStreak] = useState<any>(null)
  const [sharedTechniques, setSharedTechniques] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCommunity, setShowCommunity] = useState(false)
  const [showShareForm, setShowShareForm] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [usageRemaining, setUsageRemaining] = useState<number | null>(null)
  const [surfing, setSurfing] = useState(false)
  const [timer, setTimer] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceTyping, setVoiceTyping] = useState<string | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<any>(null)
  const [formData, setFormData] = useState({
    urge_type: '',
    urge_intensity_start: 5,
    urge_intensity_peak: 5,
    urge_intensity_end: 5,
    trigger_description: '',
    body_sensations: '',
    surf_script_used: '',
    duration_minutes: 0,
    gave_in: false,
    alternative_action: '',
    notes: ''
  })
  const [shareForm, setShareForm] = useState({
    urge_type: '',
    technique_title: '',
    technique_description: '',
    what_worked: '',
    is_anonymous: true
  })
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

      await loadData(user.id)
      setLoading(false)
    }
    init()
  }, [router, supabase])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (surfing) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [surfing])

  const loadData = async (userId: string) => {
    const [sessionsData, streakData, techniquesData] = await Promise.all([
      supabase.from('urge_surfing_sessions').select('*').eq('user_id', userId).order('session_date', { ascending: false }).limit(30),
      supabase.from('urge_surfing_streaks').select('*').eq('user_id', userId).single(),
      supabase.from('shared_surf_techniques').select('*').order('helpful_count', { ascending: false }).limit(20)
    ])
    
    setSessions(sessionsData.data || [])
    setStreak(streakData.data)
    setSharedTechniques(techniquesData.data || [])
  }

  const speakScript = (script: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  const startVoiceTyping = (field: string) => {
    if (!('webkitSpeechRecognition' in window)) return
    
    if (voiceTyping === field) {
      recognitionRef.current?.stop()
      setVoiceTyping(null)
      return
    }

    recognitionRef.current?.stop()
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e: any) => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setFormData(prev => ({ ...prev, [field]: transcript }))
    }
    recognition.onend = () => setVoiceTyping(null)
    recognition.start()
    recognitionRef.current = recognition
    setVoiceTyping(field)
  }

  const startSurfing = () => {
    setSurfing(true)
    setTimer(0)
    const selectedType = URGE_TYPES.find(t => t.value === formData.urge_type)
    if (selectedType && voiceEnabled) {
      speakScript(selectedType.script)
      setFormData({...formData, surf_script_used: selectedType.script})
    }
  }

  const stopSurfing = () => {
    setSurfing(false)
    stopSpeaking()
    setFormData({ ...formData, duration_minutes: Math.floor(timer / 60) })
  }

  const updateStreak = async (success: boolean) => {
    if (!user) return
    
    const today = new Date().toISOString().split('T')[0]
    
    if (streak) {
      const lastDate = streak.last_success_date
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      let newStreak = success ? (lastDate === yesterday ? streak.current_streak + 1 : 1) : 0
      let newLongest = Math.max(streak.longest_streak, newStreak)
      
      await supabase.from('urge_surfing_streaks').update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_success_date: success ? today : lastDate
      }).eq('user_id', user.id)
    } else if (success) {
      await supabase.from('urge_surfing_streaks').insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_success_date: today
      })
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    const { error } = await supabase.from('urge_surfing_sessions').insert({
      user_id: user.id,
      ...formData
    })

    if (error) {
      toast.error('Failed to save session')
    } else {
      await updateStreak(!formData.gave_in)
      toast.success(formData.gave_in ? 'Session saved' : '🎉 Success! Streak updated!')
      setShowForm(false)
      setSurfing(false)
      setTimer(0)
      resetForm()
      await loadData(user.id)
    }
  }

  const handleShareTechnique = async () => {
    if (!user) return

    const { error } = await supabase.from('shared_surf_techniques').insert({
      user_id: user.id,
      ...shareForm
    })

    if (error) {
      toast.error('Failed to share technique')
    } else {
      toast.success('Technique shared with community!')
      setShowShareForm(false)
      setShareForm({ urge_type: '', technique_title: '', technique_description: '', what_worked: '', is_anonymous: true })
      await loadData(user.id)
    }
  }

  const toggleHelpful = async (techniqueId: string) => {
    if (!user) return

    const { data: existing } = await supabase
      .from('technique_helpful_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('technique_id', techniqueId)
      .single()

    if (existing) {
      await supabase.from('technique_helpful_votes').delete().eq('user_id', user.id).eq('technique_id', techniqueId)
      await supabase.rpc('decrement', { row_id: techniqueId, table_name: 'shared_surf_techniques', column_name: 'helpful_count' })
    } else {
      await supabase.from('technique_helpful_votes').insert({ user_id: user.id, technique_id: techniqueId })
      await supabase.from('shared_surf_techniques').update({ helpful_count: supabase.raw('helpful_count + 1') }).eq('id', techniqueId)
    }
    
    await loadData(user.id)
  }

  const resetForm = () => {
    setFormData({
      urge_type: '',
      urge_intensity_start: 5,
      urge_intensity_peak: 5,
      urge_intensity_end: 5,
      trigger_description: '',
      body_sensations: '',
      surf_script_used: '',
      duration_minutes: 0,
      gave_in: false,
      alternative_action: '',
      notes: ''
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  const successRate = sessions.length > 0 ? Math.round(sessions.filter(s => !s.gave_in).length / sessions.length * 100) : 0

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-4 px-4 sm:px-0">
        {/* Header - Mobile First */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Urge Surfing</h1>
                <Link 
                  href="/docs/URGE_SURFING_GUIDE.html"
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-700"
                  title="View User Guide"
                >
                  <HelpCircle className="h-6 w-6" />
                </Link>
              </div>
              <p className="text-sm text-gray-600 mt-1">Ride the wave—urges are temporary</p>
            </div>
            {streak && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600" />
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">{streak.current_streak}</div>
                  <div className="text-xs text-orange-700">day streak</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              Start Surfing
            </button>
            <button
              onClick={() => setShowCommunity(!showCommunity)}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{sessions.length}</div>
                <div className="text-xs text-gray-600">Surfs</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{streak?.longest_streak || 0}</div>
                <div className="text-xs text-gray-600">Best</div>
              </div>
            </Card>
          </div>
        )}

        {/* Community Techniques */}
        {showCommunity && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Techniques
                </CardTitle>
                <button
                  onClick={() => setShowShareForm(!showShareForm)}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showShareForm && (
                <div className="p-3 bg-purple-50 rounded-lg space-y-3 border border-purple-200">
                  <select
                    value={shareForm.urge_type}
                    onChange={(e) => setShareForm({...shareForm, urge_type: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="">Select urge type...</option>
                    {URGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input
                    value={shareForm.technique_title}
                    onChange={(e) => setShareForm({...shareForm, technique_title: e.target.value})}
                    placeholder="Technique title..."
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <textarea
                    value={shareForm.technique_description}
                    onChange={(e) => setShareForm({...shareForm, technique_description: e.target.value})}
                    placeholder="Describe the technique..."
                    className="w-full p-2 border rounded-lg text-sm"
                    rows={2}
                  />
                  <textarea
                    value={shareForm.what_worked}
                    onChange={(e) => setShareForm({...shareForm, what_worked: e.target.value})}
                    placeholder="Why it worked for you..."
                    className="w-full p-2 border rounded-lg text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowShareForm(false)} className="flex-1 px-3 py-2 border rounded-lg text-sm">Cancel</button>
                    <button onClick={handleShareTechnique} className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">Share</button>
                  </div>
                </div>
              )}
              
              {sharedTechniques.map(tech => (
                <div key={tech.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tech.technique_title}</div>
                      <div className="text-xs text-gray-500 capitalize">{tech.urge_type}</div>
                    </div>
                    <button
                      onClick={() => toggleHelpful(tech.id)}
                      className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-lg border"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {tech.helpful_count}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{tech.technique_description}</p>
                  <p className="text-xs text-gray-600 italic">"{tech.what_worked}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Surf Form - Mobile First */}
        {showForm && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Surf This Urge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={formData.urge_type}
                onChange={(e) => setFormData({...formData, urge_type: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select urge type...</option>
                {URGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              {formData.urge_type && (() => {
                const selected = URGE_TYPES.find(t => t.value === formData.urge_type)
                return selected ? (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-blue-900 mb-1">Trigger:</div>
                        <div className="text-sm text-blue-800">{selected.trigger}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-purple-900 mb-1">Body Sensations:</div>
                        <div className="text-sm text-purple-800">{selected.sensations}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-900 mb-1">Surf Script:</div>
                        <div className="text-sm text-indigo-800 italic">"{selected.script}"</div>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}

              <div className="relative">
                <textarea
                  value={formData.trigger_description}
                  onChange={(e) => setFormData({...formData, trigger_description: e.target.value})}
                  className="w-full p-3 border rounded-lg pr-12"
                  rows={3}
                  placeholder="What triggered this urge?"
                />
                <button
                  type="button"
                  onClick={() => startVoiceTyping('trigger_description')}
                  className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${voiceTyping === 'trigger_description' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={formData.body_sensations}
                  onChange={(e) => setFormData({...formData, body_sensations: e.target.value})}
                  className="w-full p-3 border rounded-lg pr-12"
                  rows={2}
                  placeholder="Body sensations (heat, tension, etc)..."
                />
                <button
                  type="button"
                  onClick={() => startVoiceTyping('body_sensations')}
                  className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${voiceTyping === 'body_sensations' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Starting Intensity: <span className="text-indigo-600 font-bold">{formData.urge_intensity_start}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.urge_intensity_start}
                  onChange={(e) => setFormData({...formData, urge_intensity_start: parseInt(e.target.value)})}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Voice Toggle */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 border-2 ${voiceEnabled ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                Voice Guidance {voiceEnabled ? 'ON' : 'OFF'}
              </button>

              {surfing ? (
                <div className="space-y-3">
                  <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer className="h-8 w-8 text-blue-600 animate-pulse" />
                      <div className="text-4xl font-bold text-blue-600">{formatTime(timer)}</div>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">You're riding the wave. Keep breathing.</p>
                    {speaking && <div className="text-xs text-blue-600 animate-pulse">🎙️ Voice guidance playing...</div>}
                  </div>
                  <button
                    onClick={stopSurfing}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Stop Timer
                  </button>
                </div>
              ) : formData.duration_minutes === 0 ? (
                <button
                  onClick={startSurfing}
                  disabled={!formData.urge_type}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium disabled:bg-gray-300"
                >
                  <Waves className="h-5 w-5" />
                  Start Timer
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Peak: <span className="text-orange-600 font-bold">{formData.urge_intensity_peak}/10</span>
                    </label>
                    <input type="range" min="1" max="10" value={formData.urge_intensity_peak} onChange={(e) => setFormData({...formData, urge_intensity_peak: parseInt(e.target.value)})} className="w-full accent-orange-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ending: <span className="text-green-600 font-bold">{formData.urge_intensity_end}/10</span>
                    </label>
                    <input type="range" min="1" max="10" value={formData.urge_intensity_end} onChange={(e) => setFormData({...formData, urge_intensity_end: parseInt(e.target.value)})} className="w-full accent-green-600" />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.gave_in} onChange={(e) => setFormData({...formData, gave_in: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm">I gave in to the urge</span>
                  </label>
                  {!formData.gave_in && (
                    <div className="relative">
                      <textarea
                        value={formData.alternative_action}
                        onChange={(e) => setFormData({...formData, alternative_action: e.target.value})}
                        className="w-full p-3 border rounded-lg pr-12"
                        rows={2}
                        placeholder="What did you do instead?"
                      />
                      <button
                        type="button"
                        onClick={() => startVoiceTyping('alternative_action')}
                        className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${voiceTyping === 'alternative_action' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => { setShowForm(false); setSurfing(false); setTimer(0); resetForm(); }} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium">Save</button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions List - Mobile Optimized */}
        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your First Surf</h3>
              <p className="text-sm text-gray-600 mb-6">Learn to ride the wave of urges</p>
              <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">Start Surfing</button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Your Sessions
            </h2>
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-indigo-600 capitalize">{session.urge_type}</div>
                      <div className="text-xs text-gray-500">{new Date(session.session_date).toLocaleDateString()}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${session.gave_in ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {session.gave_in ? 'Gave In' : 'Success!'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="font-bold">{session.urge_intensity_start} → {session.urge_intensity_peak || '?'} → {session.urge_intensity_end || '?'}</span>
                    </div>
                    {session.duration_minutes > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span>{session.duration_minutes}m</span>
                      </div>
                    )}
                    <div className="p-2 bg-gray-50 rounded text-sm">{session.trigger_description}</div>
                    {session.alternative_action && (
                      <div className="p-2 bg-green-50 rounded text-sm text-green-800">{session.alternative_action}</div>
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
