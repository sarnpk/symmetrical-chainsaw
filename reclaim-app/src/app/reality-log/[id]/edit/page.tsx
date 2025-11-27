'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

const NPD_TRAITS = [
  'Playing the Victim',
  'Gaslighting',
  'Triangulation',
  'Love-bombing',
  'Hoovering',
  'Flying Monkeys',
  'Covert Criticism',
  'Boundary Violations',
  'Withholding Affection/Resources',
  'Emotional Manipulation',
]

export default function EditRealityLogEntryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entry, setEntry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    event: '',
    fact: '',
    npd_trait: '',
    is_consistent: false,
    pattern_note: '',
  })

  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  useEffect(() => {
    const loadEntry = async () => {
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

      // Get the reality log entry
      const { data: entry, error } = await supabase
        .from('reality_log_entries')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (error || !entry) {
        router.push('/reality-log')
        return
      }

      setEntry(entry)
      
      // Populate form fields
      setFormData({
        date: entry.date,
        event: entry.event,
        fact: entry.fact,
        npd_trait: entry.npd_trait,
        is_consistent: entry.is_consistent,
        pattern_note: entry.pattern_note || '',
      })
      
      setLoading(false)
    }

    loadEntry()
  }, [router, supabase, params])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!entry || !user) return

      const { error } = await supabase
        .from('reality_log_entries')
        .update({
          date: formData.date,
          event: formData.event,
          fact: formData.fact,
          npd_trait: formData.npd_trait,
          is_consistent: formData.is_consistent,
          pattern_note: formData.pattern_note,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id)

      if (error) throw error

      router.push(`/reality-log/${entry.id}`)
    } catch (error: any) {
      console.error('Failed to update entry:', error.message)
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

  if (!user || !profile || !entry) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/reality-log/${entry.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Reality Anchor Entry</h1>
              <p className="text-gray-600 mt-1">Update your documented experience</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Event (What happened?)
                </label>
                <textarea
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Describe what happened..."
                  required
                />
              </div>

              {/* Fact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 Fact (What exactly happened?)
                </label>
                <textarea
                  value={formData.fact}
                  onChange={(e) => setFormData({ ...formData, fact: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Document the facts..."
                  required
                />
              </div>

              {/* NPD Trait */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏷️ NPD Trait (What trait is this?)
                </label>
                <select
                  value={formData.npd_trait}
                  onChange={(e) => setFormData({ ...formData, npd_trait: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a trait...</option>
                  {NPD_TRAITS.map((trait) => (
                    <option key={trait} value={trait}>
                      {trait}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consistency */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_consistent}
                    onChange={(e) => setFormData({ ...formData, is_consistent: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    📌 This is consistent with past behavior
                  </span>
                </label>
              </div>

              {/* Pattern Note */}
              {formData.is_consistent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pattern Note (optional)
                  </label>
                  <textarea
                    value={formData.pattern_note}
                    onChange={(e) => setFormData({ ...formData, pattern_note: e.target.value })}
                    placeholder="e.g., She always plays victim when I ask for help (Documented 5 times in past month)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href={`/reality-log/${entry.id}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Updating...' : 'Update Entry'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}