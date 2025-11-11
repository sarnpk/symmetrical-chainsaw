'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Preset {
  text: string
  category: string
}

export default function NewBeliefPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [customBelief, setCustomBelief] = useState('')
  const [strength, setStrength] = useState(5)
  const [originMemory, setOriginMemory] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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

      const response = await fetch('/api/belief-reframe/presets')
      const data = await response.json()
      setPresets(data.presets || [])
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const beliefText = selectedPreset || customBelief
    if (!beliefText.trim()) {
      toast.error('Please select or enter a belief')
      setSubmitting(false)
      return
    }

    const preset = presets.find(p => p.text === selectedPreset)
    const category = preset?.category || 'self_worth'

    const response = await fetch('/api/belief-reframe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        belief_text: beliefText,
        belief_category: category,
        current_strength: strength,
        origin_memory_text: originMemory || null
      })
    })

    if (response.ok) {
      const { belief } = await response.json()
      toast.success('Belief added successfully')
      router.push(`/belief-reframe/${belief.id}`)
    } else {
      toast.error('Failed to add belief')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/belief-reframe" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Beliefs
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add a Belief to Challenge</h1>
          <p className="text-gray-600 mt-2">Identify a false belief you want to work on</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Beliefs from Narcissistic Abuse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {presets.map((preset) => (
                <label key={preset.text} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="belief"
                    value={preset.text}
                    checked={selectedPreset === preset.text}
                    onChange={(e) => {
                      setSelectedPreset(e.target.value)
                      setCustomBelief('')
                    }}
                    className="mt-1"
                  />
                  <span className="text-gray-900">{preset.text}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-gray-500 font-medium">OR</div>

          <Card>
            <CardHeader>
              <CardTitle>Write Your Own</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={customBelief}
                onChange={(e) => {
                  setCustomBelief(e.target.value)
                  setSelectedPreset('')
                }}
                placeholder="I believe that..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Origin Memory (Optional)</CardTitle>
              <p className="text-sm text-red-600 mt-1">When/how was this belief installed?</p>
            </CardHeader>
            <CardContent>
              <textarea
                value={originMemory}
                onChange={(e) => setOriginMemory(e.target.value)}
                placeholder="Describe the moment or memory when this belief was created... (e.g., 'She told me I was unlovable during an argument in 2023')" 
                className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <p className="text-xs text-red-600 mt-2">
                💡 Recording the origin helps you see this belief came from abuse, not reality
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How strongly do you believe this?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strength}
                  onChange={(e) => setStrength(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1 (Weak)</span>
                  <span className="text-lg font-bold text-green-600">{strength}/10</span>
                  <span>10 (Very Strong)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link href="/belief-reframe" className="flex-1">
              <button type="button" className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Belief'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
