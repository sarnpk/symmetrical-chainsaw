'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { Shield, Wind, Brain, Check } from 'lucide-react'

const INTERACTION_TYPES = [
  { value: 'live_interaction', label: 'ðŸ”´ Live Interaction (Happening Now)' },
  { value: 'pickup', label: 'Child Pickup' },
  { value: 'dropoff', label: 'Child Dropoff' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'video_call', label: 'Video Call' },
  { value: 'text_exchange', label: 'Text/Message Exchange' },
  { value: 'email', label: 'Email' },
  { value: 'in_person', label: 'In-Person Meeting' },
  { value: 'court_hearing', label: 'Court/Legal Hearing' },
  { value: 'mediation', label: 'Mediation Session' },
  { value: 'school_event', label: 'School/Child Event' },
  { value: 'family_gathering', label: 'Family Gathering' },
  { value: 'other', label: 'Other Interaction' },
]

const getMantras = (abuserGender?: string | null) => {
  const pronoun = abuserGender === 'male' ? 'his' : abuserGender === 'female' ? 'her' : 'their'
  const possessive = abuserGender === 'male' ? 'He' : abuserGender === 'female' ? 'She' : 'They'
  
  return [
    'This is a transaction, not a relationship',
    'I am a project manager for a difficult co-parenting project',
    `${possessive === 'They' ? 'Their' : pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} emotions are not my responsibility`,
    'I choose peace over engagement',
    'I am protected by my boundaries',
    'I am calm, detached, and focused',
    `My peace is more important than ${pronoun} approval`,
    `I will not absorb ${pronoun} chaos`,
    'I am safe in my emotional armor',
    'This interaction does not define me',
  ]
}

export default function MentalPausePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'setup' | 'breathing' | 'visualization' | 'complete'>('setup')
  const [mantras, setMantras] = useState<string[]>([])
  const [formData, setFormData] = useState({
    interaction_type: '',
    mood_before: 5,
    mantra_used: '',
    notes: '',
  })
  const [breathCount, setBreathCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle')
  const [countdown, setCountdown] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
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
      
      // Set mantras based on abuser gender
      const personalizedMantras = getMantras(profile?.abuser_gender)
      setMantras(personalizedMantras)
      setFormData(prev => ({ ...prev, mantra_used: personalizedMantras[0] }))
      
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const startBreathingCycle = () => {
    // Inhale phase (4 seconds)
    setBreathingPhase('inhale')
    setCountdown(4)
    
    const inhaleInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(inhaleInterval)
          // Hold phase (7 seconds)
          setBreathingPhase('hold')
          setCountdown(7)
          
          const holdInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(holdInterval)
                // Exhale phase (8 seconds)
                setBreathingPhase('exhale')
                setCountdown(8)
                
                const exhaleInterval = setInterval(() => {
                  setCountdown(prev => {
                    if (prev <= 1) {
                      clearInterval(exhaleInterval)
                      // Cycle complete
                      setBreathingPhase('idle')
                      setBreathCount(prev => prev + 1)
                      setIsBreathingActive(false)
                      return 0
                    }
                    return prev - 1
                  })
                }, 1000)
                
                return prev - 1
              }
              return prev - 1
            })
          }, 1000)
          
          return prev - 1
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSave = async () => {
    if (!user?.id) return
    setSaving(true)

    try {
      await supabase
        .from('mental_pause_sessions')
        .insert({
          user_id: user.id,
          interaction_type: formData.interaction_type,
          mood_before: formData.mood_before,
          breathing_completed: true,
          visualization_completed: true,
          mantra_used: formData.mantra_used,
          notes: formData.notes,
        })

      setStep('complete')
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mental Pause</h1>
          <p className="text-gray-600 mt-2">10-second prep before interaction</p>
        </div>

        {step === 'setup' && (
          <Card>
            <CardHeader>
              <CardTitle>Prepare Yourself</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of interaction?
                </label>
                <select
                  value={formData.interaction_type}
                  onChange={(e) => setFormData({ ...formData, interaction_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select...</option>
                  {INTERACTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you feel right now? (1-10)
                </label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood_before: num })}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        formData.mood_before === num
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">1 = Very Anxious, 10 = Very Calm</p>
              </div>

              <button
                onClick={() => setStep('breathing')}
                disabled={!formData.interaction_type}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Start Mental Pause
              </button>
            </CardContent>
          </Card>
        )}

        {step === 'breathing' && isBreathingActive && (
          <Card className="border-2 border-indigo-200">
            <CardContent className="pt-6 text-center py-12">
              <div className="mb-8">
                <div className="text-6xl font-bold text-indigo-600 mb-4">{breathCount + 1}/3</div>
                <p className="text-sm text-gray-600">Breath Cycle</p>
              </div>

              <div className="relative w-48 h-48 mx-auto mb-8">
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathingPhase === 'inhale' ? 'bg-blue-400' :
                    breathingPhase === 'hold' ? 'bg-yellow-400' :
                    breathingPhase === 'exhale' ? 'bg-green-400' :
                    'bg-gray-300'
                  }`}
                  style={{
                    transform: breathingPhase === 'inhale' ? 'scale(1.2)' : 
                               breathingPhase === 'exhale' ? 'scale(0.8)' : 'scale(1)',
                    transition: 'transform 1s ease-in-out'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
                    <div className="text-xl font-medium text-white">
                      {breathingPhase === 'inhale' && 'â†‘ Breathe In'}
                      {breathingPhase === 'hold' && 'â¸ Hold'}
                      {breathingPhase === 'exhale' && 'â†“ Breathe Out'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-gray-600">
                {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
                {breathingPhase === 'hold' && 'Hold your breath gently...'}
                {breathingPhase === 'exhale' && 'Breathe out slowly through your mouth...'}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'breathing' && !isBreathingActive && (
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-indigo-600" />
                4-7-8 Breathing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-indigo-900">
                  <strong>Why this works:</strong> This breathing pattern activates your parasympathetic nervous system, 
                  calming your fight-or-flight response. It's scientifically proven to reduce anxiety.
                </p>
              </div>
              
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-indigo-600 mb-4">{breathCount}/3</div>
                
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">â†‘</span>
                    </div>
                    <p className="text-gray-700"><strong>Breathe IN</strong> through nose for <strong>4 seconds</strong></p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">â¸</span>
                    </div>
                    <p className="text-gray-700"><strong>HOLD</strong> for <strong>7 seconds</strong></p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">â†“</span>
                    </div>
                    <p className="text-gray-700"><strong>Breathe OUT</strong> through mouth for <strong>8 seconds</strong></p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (breathCount < 3) {
                      setIsBreathingActive(true)
                      startBreathingCycle()
                    } else {
                      setStep('visualization')
                    }
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {breathCount < 3 ? 'Start Guided Breathing' : 'Continue to Visualization'}
                </button>
                
                {breathCount > 0 && breathCount < 3 && (
                  <p className="text-sm text-gray-600 mt-4">
                    Great! {3 - breathCount} more {3 - breathCount === 1 ? 'cycle' : 'cycles'} to go.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'visualization' && (
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Visualization & Mantra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg space-y-4">
                <div>
                  <p className="font-medium text-purple-900 mb-2">ðŸ›¡ï¸ Visualize Your Protection</p>
                  <p className="text-gray-700">
                    Imagine yourself wearing emotional armor. Nothing they say can penetrate it. Their words bounce off harmlessly.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-purple-900 mb-2">ðŸ§˜ Ground Yourself</p>
                  <p className="text-gray-700">
                    You are calm, detached, and focused. This is a business transaction, not a personal relationship.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-purple-900 mb-2">ðŸ’ª Remember Your Strength</p>
                  <p className="text-gray-700">
                    You have survived every difficult interaction before this. You will survive this one too.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose your mantra:
                </label>
                <select
                  value={formData.mantra_used}
                  onChange={(e) => setFormData({ ...formData, mantra_used: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {mantras.map((mantra) => (
                    <option key={mantra} value={mantra}>{mantra}</option>
                  ))}
                </select>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-900 font-medium text-center text-lg">
                  "{formData.mantra_used}"
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
              >
                {saving ? 'Saving...' : 'Complete Mental Pause'}
              </button>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Ready</h2>
              <p className="text-gray-600 mb-6">
                You've prepared yourself. Remember your mantra.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep('setup')
                    setBreathCount(0)
                    setFormData({
                      interaction_type: '',
                      mood_before: 5,
                      mantra_used: MANTRAS[0],
                      notes: '',
                    })
                  }}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Start Another
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}