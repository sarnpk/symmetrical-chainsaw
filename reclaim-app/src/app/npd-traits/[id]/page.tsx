'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Shield, Lightbulb, AlertTriangle, Save } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface NPDTrait {
  id: string
  name: string
  category: string
  description: string
  examples: string[]
  response_strategies: string[]
  severity: string
}

export default function TraitDetailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [trait, setTrait] = useState<NPDTrait | null>(null)
  const [personalNote, setPersonalNote] = useState('')
  const [frequency, setFrequency] = useState<string>('occasional')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
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

      const response = await fetch('/api/npd-traits')
      const data = await response.json()
      const foundTrait = data.traits?.find((t: NPDTrait) => t.id === params.id)
      setTrait(foundTrait)

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (token) {
        const notesRes = await fetch('/api/npd-traits/notes', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const notesData = await notesRes.json()
        const existingNote = notesData.notes?.find((n: any) => n.trait_id === params.id)
        if (existingNote) {
          setPersonalNote(existingNote.personal_note || '')
          setFrequency(existingNote.frequency || 'occasional')
        }
      }

      setLoading(false)
    }
    getData()
  }, [params.id, router, supabase])

  const handleSaveNote = async () => {
    if (!user || !trait) return
    setSaving(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      const response = await fetch('/api/npd-traits/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          trait_id: trait.id,
          personal_note: personalNote,
          frequency
        })
      })

      if (!response.ok) throw new Error('Failed to save note')

      toast.success('Note saved successfully')
    } catch (error) {
      toast.error('Failed to save note')
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

  if (!user || !profile || !trait) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/npd-traits" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trait.name}</h1>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
                {trait.category}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                {trait.severity}
              </span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              What Is This?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{trait.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {trait.examples.map((example, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-1">•</span>
                  <span className="text-gray-700">{example}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              How to Respond
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {trait.response_strategies.map((strategy, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">{strategy}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-amber-600" />
              Your Personal Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How often do you experience this?
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="rare">Rare</option>
                <option value="occasional">Occasional</option>
                <option value="frequent">Frequent</option>
                <option value="constant">Constant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your observations (private)
              </label>
              <textarea
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                placeholder="Document specific examples you've experienced..."
              />
            </div>

            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
