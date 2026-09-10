'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { Activity, Music, BookOpen, Footprints, Check } from 'lucide-react'

const INTERACTION_TYPES = [
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

const RITUAL_TYPES = [
  { value: 'walk', label: 'Walk', icon: Footprints, color: 'green' },
  { value: 'exercise', label: 'Exercise', icon: Activity, color: 'blue' },
  { value: 'meditation', label: 'Meditation', icon: 'ðŸ§˜', color: 'purple' },
  { value: 'music', label: 'Music', icon: Music, color: 'pink' },
  { value: 'journaling', label: 'Journaling', icon: BookOpen, color: 'indigo' },
  { value: 'other', label: 'Other', icon: 'âœ¨', color: 'gray' },
]

export default function DecompressionPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'start' | 'ritual' | 'complete'>('start')
  const [formData, setFormData] = useState({
    interaction_type: '',
    mood_before: 5,
    mood_after: 5,
    ritual_type: '',
    duration_minutes: 15,
    notes: '',
  })
  const [saving, setSaving] = useState(false)

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
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSave = async () => {
    if (!user?.id) return
    setSaving(true)

    try {
      await supabase
        .from('decompression_sessions')
        .insert({
          user_id: user.id,
          interaction_type: formData.interaction_type,
          mood_before: formData.mood_before,
          mood_after: formData.mood_after,
          ritual_type: formData.ritual_type,
          duration_minutes: formData.duration_minutes,
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

  const moodImprovement = formData.mood_after - formData.mood_before

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Decompression Ritual</h1>
          <p className="text-gray-600 mt-2">Discharge emotional static after interaction</p>
        </div>

        {step === 'start' && (
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What interaction did you just have?
                </label>
                <select
                  value={formData.interaction_type}
                  onChange={(e) => setFormData({ ...formData, interaction_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                >
                  <option value="">Select...</option>
                  {INTERACTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood right now (1-10)
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
                <p className="text-xs text-gray-500 mt-1">1 = Very Stressed, 10 = Very Calm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose your ritual:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {RITUAL_TYPES.map((ritual) => (
                    <button
                      key={ritual.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, ritual_type: ritual.value })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.ritual_type === ritual.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {typeof ritual.icon === 'string' ? ritual.icon : <ritual.icon className="h-6 w-6" />}
                      </div>
                      <div className="font-medium text-gray-900">{ritual.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long? (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="5"
                  max="120"
                />
              </div>

              <button
                onClick={() => setStep('ritual')}
                disabled={!formData.ritual_type}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Start Ritual
              </button>
            </CardContent>
          </Card>
        )}

        {step === 'ritual' && (
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle>Take Your Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <p className="text-lg text-gray-700 mb-4">
                  Take {formData.duration_minutes} minutes for your {formData.ritual_type}.
                </p>
                <p className="text-gray-600">
                  This is your time to discharge the emotional static and return to yourself.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you feel now? (1-10)
                </label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood_after: num })}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        formData.mood_after === num
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {moodImprovement > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-900 font-medium">
                    âœ¨ Mood improved by {moodImprovement} points!
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="How do you feel? What helped?"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
              >
                {saving ? 'Saving...' : 'Complete Ritual'}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Well Done</h2>
              <p className="text-gray-600 mb-2">
                You've discharged the emotional static.
              </p>
              {moodImprovement > 0 && (
                <p className="text-green-600 font-medium mb-6">
                  Your mood improved by {moodImprovement} points
                </p>
              )}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep('start')
                    setFormData({
                      interaction_type: '',
                      mood_before: 5,
                      mood_after: 5,
                      ritual_type: '',
                      duration_minutes: 15,
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