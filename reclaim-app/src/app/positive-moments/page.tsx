'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Smile, Trash2 } from 'lucide-react'
import VoiceTextInput from '@/components/VoiceTextInput'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function PositiveMomentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [moments, setMoments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  const tags = ['achievement', 'kindness_received', 'self_care', 'connection', 'strength']

  const loadMoments = async () => {
    const response = await fetch('/api/positive-moments')
    const data = await response.json()
    setMoments(data.moments || [])
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
        tags: selectedTags
      })
    })

    if (response.ok) {
      toast.success('Moment saved!')
      setSelectedTags([])
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Positive Moments Journal</h1>
            <p className="text-gray-600 mt-2">Capture good moments to build counter-evidence</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Moment
          </button>
        </div>

        <VoiceTextInput
          isOpen={showForm}
          onClose={() => {
            setShowForm(false)
            setSelectedTags([])
          }}
          onSave={handleSubmit}
          placeholder="What positive thing happened? (e.g., 'Friend called to check on me', 'Completed a project at work', 'Took care of myself today')"
          title="Capture a Positive Moment"
          submitLabel="Save Moment"
        />

        {showForm && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle>Add Tags (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {moments.length === 0 ? (
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
            {moments.map((moment) => (
              <Card key={moment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-900">{moment.moment_text}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600">
                          {new Date(moment.moment_date).toLocaleDateString()}
                        </span>
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

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              These positive moments will be used by AI to find counter-evidence against your false beliefs. 
              The more you capture, the stronger your evidence becomes!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
