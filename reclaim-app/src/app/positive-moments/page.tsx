'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Smile, Trash2, Search, Filter, Mic, MicOff, HelpCircle } from 'lucide-react'
import VoiceTextInput from '@/components/VoiceTextInput'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRef } from 'react'

export default function PositiveMomentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [moments, setMoments] = useState<any[]>([])
  const [filteredMoments, setFilteredMoments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [moodRating, setMoodRating] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [momentText, setMomentText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [entryType, setEntryType] = useState<'moment' | 'gratitude' | 'both'>('moment')
  const [gratitudeCategory, setGratitudeCategory] = useState<string>('')
  const [streakData, setStreakData] = useState<any>(null)
  const [showGratitudePrompts, setShowGratitudePrompts] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const recognitionRef = useRef<any>(null)

  const tags = ['achievement', 'kindness_received', 'self_care', 'connection', 'strength', 'boundary_success', 'progress', 'gratitude', 'joy', 'courage']
  const gratitudeCategories = ['people', 'experiences', 'personal_growth', 'simple_pleasures', 'opportunities', 'health', 'relationships', 'accomplishments']

  const loadMoments = async () => {
    const response = await fetch('/api/positive-moments')
    const data = await response.json()
    setMoments(data.moments || [])
    setFilteredMoments(data.moments || [])
    setStreakData(data.streak || null)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setMomentText(prev => prev + ' ' + transcript)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  useEffect(() => {
    let filtered = moments
    if (searchQuery) {
      filtered = filtered.filter(m => m.moment_text.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (filterTag) {
      filtered = filtered.filter(m => m.tags?.includes(filterTag))
    }
    setFilteredMoments(filtered)
  }, [searchQuery, filterTag, moments])

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

      if (profile?.subscription_tier === 'foundation') {
        toast.error('Positive Moments requires Recovery or Empowered tier')
        router.push('/dashboard')
        return
      }

      await loadMoments()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async (text: string) => {
    const response = await fetch('/api/positive-moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moment_text: text,
        tags: selectedTags,
        mood_rating: moodRating
      })
    })

    if (response.ok) {
      toast.success('Moment saved!')
      setSelectedTags([])
      setMoodRating(null)
      setShowForm(false)
      await loadMoments()
    } else {
      toast.error('Failed to save moment')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this moment?')) return

    const response = await fetch(`/api/positive-moments?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success('Moment deleted')
      await loadMoments()
    } else {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  if (profile.subscription_tier === 'foundation') {
    return (
      <DashboardLayout user={user} profile={profile}>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recovery Tier Feature</h2>
            <p className="text-gray-600 mb-6">Positive Moments Journal is available on Recovery and Empowered tiers.</p>
            <Link href="/subscription">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Upgrade Now</button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Positive Moments & Gratitude</h1>
              <p className="text-gray-600 mt-2">Capture good moments and daily gratitude to build counter-evidence</p>
            </div>
            <button
              onClick={() => window.open('/docs/GRATITUDE_MOMENTS_USER_GUIDE.html', '_blank')}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Gratitude & Moments User Guide"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEntryType('gratitude'); setShowForm(true); }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Daily Gratitude
            </button>
            <button
              onClick={() => { setEntryType('moment'); setShowForm(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Moment
            </button>
          </div>
        </div>

        {streakData && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">ðŸ”¥ Gratitude Streak</h3>
                <p className="text-green-700">Keep the momentum going!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{streakData.current_streak || 0}</div>
                <div className="text-sm text-green-600">Current â€¢ Best: {streakData.longest_streak || 0}</div>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">Capture a Positive Moment</h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedTags([])
                    setMoodRating(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                  <div className="flex gap-2 mb-4">
                    {[{id: 'moment', label: 'Positive Moment'}, {id: 'gratitude', label: 'Gratitude'}, {id: 'both', label: 'Both'}].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setEntryType(type.id as any)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          entryType === type.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {entryType === 'gratitude' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gratitude Category</label>
                    <select
                      value={gratitudeCategory}
                      onChange={(e) => setGratitudeCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category (optional)</option>
                      {gratitudeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {entryType === 'gratitude' ? 'What are you grateful for?' : 'What positive thing happened?'}
                  </label>
                  <textarea
                    value={momentText}
                    onChange={(e) => setMomentText(e.target.value)}
                    placeholder={entryType === 'gratitude' 
                      ? "e.g., 'I'm grateful for my friend's support today', 'Thankful for my health', 'Appreciate having a safe home'"
                      : "e.g., 'Friend called to check on me', 'Completed a project at work', 'Took care of myself today'"
                    }
                    className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                  />
                  {entryType === 'gratitude' && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowGratitudePrompts(!showGratitudePrompts)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {showGratitudePrompts ? 'Hide' : 'Show'} gratitude prompts
                      </button>
                      {showGratitudePrompts && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                          <p className="font-medium mb-2">Try these prompts:</p>
                          <ul className="space-y-1 text-xs">
                            <li>â€¢ Someone who made me smile today...</li>
                            <li>â€¢ A simple pleasure I enjoyed...</li>
                            <li>â€¢ Something about my body I appreciate...</li>
                            <li>â€¢ A challenge that helped me grow...</li>
                            <li>â€¢ A moment of peace I experienced...</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How did you feel? (1-10)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMoodRating(num)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          moodRating === num
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Tags (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-3">
                <button
                  onClick={toggleListening}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <><MicOff className="h-5 w-5" />Stop Recording</> : <><Mic className="h-5 w-5" />Voice Input</>}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setSelectedTags([])
                      setMoodRating(null)
                      setMomentText('')
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (momentText?.trim()) {
                        handleSubmit(momentText)
                        setMomentText('')
                      }
                    }}
                    disabled={!momentText?.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {entryType === 'gratitude' ? 'Save Gratitude' : 'Save Moment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {moments.length > 0 && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search moments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filterTag || ''}
                    onChange={(e) => setFilterTag(e.target.value || null)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Tags</option>
                    {tags.map(tag => (
                      <option key={tag} value={tag}>{tag.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredMoments.length === 0 && moments.length > 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600">No moments match your search</p>
            </CardContent>
          </Card>
        ) : filteredMoments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Smile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No moments yet</h3>
              <p className="text-gray-600 mb-6">
                Start capturing positive moments to build evidence against false beliefs
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Your First Moment
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMoments.map((moment) => (
              <Card key={moment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-900">{moment.moment_text}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-sm text-gray-600">
                          {new Date(moment.moment_date).toLocaleDateString()}
                        </span>
                        {moment.entry_type && (
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            moment.entry_type === 'gratitude' ? 'bg-green-100 text-green-700' :
                            moment.entry_type === 'both' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {moment.entry_type === 'gratitude' ? 'ðŸ™ Gratitude' :
                             moment.entry_type === 'both' ? 'âœ¨ Both' : 'ðŸ’« Moment'}
                          </span>
                        )}
                        {moment.gratitude_category && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                            {moment.gratitude_category.replace('_', ' ')}
                          </span>
                        )}
                        {moment.mood_rating && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Mood: {moment.mood_rating}/10
                          </span>
                        )}
                        {moment.tags && moment.tags.length > 0 && (
                          <div className="flex gap-2">
                            {moment.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(moment.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">ðŸ’¡ Positive Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Capture achievements, kind gestures, and positive experiences to build counter-evidence against false beliefs.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">ðŸ™ Daily Gratitude</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Practice daily gratitude to shift focus from trauma to appreciation. Build a streak to strengthen your healing routine!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
