'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { Lightbulb, Copy, Save, RefreshCw, Heart, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function HopeReframePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [reframe, setReframe] = useState<string | null>(null)
  const [mantra, setMantra] = useState<string | null>(null)
  const [showTip, setShowTip] = useState(true)
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

      const hasSeenTip = localStorage.getItem('hope-reframe-tip-seen')
      if (hasSeenTip) setShowTip(false)
    }
    init()
  }, [router, supabase])

  const handleReframe = async () => {
    if (!input.trim()) return

    setGenerating(true)
    try {
      const res = await fetch('/api/hope-reframe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() })
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          toast.error(`Monthly limit reached. ${data.upgrade_required ? `Upgrade to ${data.upgrade_required} for more.` : ''}`)
        } else {
          toast.error(data.error || 'Failed to generate reframe')
        }
        return
      }

      setReframe(data.reframe)
      setMantra(data.mantra)
      toast.success('Your hope-focused reframe is ready')
    } catch (error) {
      console.error('Reframe error:', error)
      toast.error('I\'m here with you. Let\'s try again in a moment.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    if (reframe) {
      navigator.clipboard.writeText(`${reframe}\n\n${mantra}`)
      toast.success('Copied to clipboard')
    }
  }

  const handleSave = async () => {
    if (!reframe || !user) return

    try {
      const res = await fetch('/api/hope-reframe/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, reframe, mantra })
      })

      if (res.ok) {
        toast.success('Saved to your journal')
      } else {
        toast.error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save')
    }
  }

  const handleReset = () => {
    setInput('')
    setReframe(null)
    setMantra(null)
  }

  const dismissTip = () => {
    setShowTip(false)
    localStorage.setItem('hope-reframe-tip-seen', 'true')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reframe with Hope</h1>
          <p className="text-lg text-gray-600">Transform distress into grounded hope and resilience</p>
        </div>

        {/* First-use tip */}
        {showTip && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">How Hope Reframe Works</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Reframing helps shift perspective without denying pain. Share what's weighing on your heart, 
                  and receive a compassionate, hope-focused message that acknowledges your struggle while 
                  building realistic hope for healing.
                </p>
                <button
                  onClick={dismissTip}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        {!reframe ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share what's weighing on your heart...
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., My wife took my children away and I'm terrified for their well-being..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none text-gray-800 placeholder-gray-400"
              disabled={generating}
            />
            
            <button
              onClick={handleReframe}
              disabled={!input.trim() || generating}
              className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finding a hopeful perspective for you...
                </>
              ) : (
                <>
                  <Lightbulb className="h-5 w-5" />
                  Reframe
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reframe card */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Hope-Focused Reframe</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reframe}</p>
              </div>

              {mantra && (
                <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
                  <p className="text-sm font-medium text-amber-900 mb-2">Your Mantra</p>
                  <p className="text-lg font-bold text-amber-900 leading-relaxed">{mantra}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Save to Journal
              </button>
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="h-5 w-5" />
                Copy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleReframe}
                disabled={generating}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-md hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className="h-5 w-5" />
                Reframe Again
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-md hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="h-5 w-5" />
                I'm Feeling Better
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
