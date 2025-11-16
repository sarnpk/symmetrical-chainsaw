'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, RotateCcw, AlertCircle, Trash2, Edit2, HelpCircle, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ReactiveAbusePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<any>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [showInfo, setShowInfo] = useState(false)
  const [formData, setFormData] = useState({
    what_you_addressed: '',
    your_approach: '',
    reaction_type: '',
    what_they_said: '',
    what_they_accused_you_of: '',
    made_you_feel: '',
    did_you_apologize: false,
    original_issue_resolved: false,
    is_recurring_pattern: false,
    similar_topic_before: false,
    how_you_responded: '',
    maintained_boundary: false,
    notes: ''
  })
  const router = useRouter()
  const supabase = createClient()

  const loadIncidents = async () => {
    const { data } = await supabase
      .from('reactive_abuse_incidents')
      .select('*')
      .eq('user_id', user?.id)
      .order('incident_date', { ascending: false })
    setIncidents(data || [])
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

      const { data } = await supabase
        .from('reactive_abuse_incidents')
        .select('*')
        .eq('user_id', user.id)
        .order('incident_date', { ascending: false })
      
      setIncidents(data || [])
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async () => {
    if (!formData.what_you_addressed || !formData.reaction_type) {
      toast.error('Please fill required fields')
      return
    }

    if (editingIncident) {
      const { error } = await supabase
        .from('reactive_abuse_incidents')
        .update(formData)
        .eq('id', editingIncident.id)
      
      if (error) {
        toast.error('Failed to update')
      } else {
        toast.success('Incident updated')
        resetForm()
        await loadIncidents()
      }
    } else {
      const { error } = await supabase
        .from('reactive_abuse_incidents')
        .insert({ ...formData, user_id: user?.id })
      
      if (error) {
        toast.error('Failed to save')
      } else {
        toast.success('Incident logged')
        resetForm()
        await loadIncidents()
      }
    }
  }

  const handleEdit = (incident: any) => {
    setEditingIncident(incident)
    setFormData({
      what_you_addressed: incident.what_you_addressed || '',
      your_approach: incident.your_approach || '',
      reaction_type: incident.reaction_type || '',
      what_they_said: incident.what_they_said || '',
      what_they_accused_you_of: incident.what_they_accused_you_of || '',
      made_you_feel: incident.made_you_feel || '',
      did_you_apologize: incident.did_you_apologize || false,
      original_issue_resolved: incident.original_issue_resolved || false,
      is_recurring_pattern: incident.is_recurring_pattern || false,
      similar_topic_before: incident.similar_topic_before || false,
      how_you_responded: incident.how_you_responded || '',
      maintained_boundary: incident.maintained_boundary || false,
      notes: incident.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this incident?')) return
    const { error } = await supabase.from('reactive_abuse_incidents').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete')
    } else {
      toast.success('Incident deleted')
      await loadIncidents()
    }
  }

  const resetForm = () => {
    setFormData({
      what_you_addressed: '',
      your_approach: '',
      reaction_type: '',
      what_they_said: '',
      what_they_accused_you_of: '',
      made_you_feel: '',
      did_you_apologize: false,
      original_issue_resolved: false,
      is_recurring_pattern: false,
      similar_topic_before: false,
      how_you_responded: '',
      maintained_boundary: false,
      notes: ''
    })
    setEditingIncident(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  const filteredIncidents = filterType === 'all' 
    ? incidents 
    : incidents.filter(i => i.reaction_type === filterType)

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reactive Abuse Journal</h1>
                <Link 
                  href="/docs/REACTIVE_ABUSE_GUIDE.html"
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700"
                  title="View User Guide"
                >
                  <HelpCircle className="h-6 w-6" />
                </Link>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Track when your concerns get turned against you</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add Entry
          </button>
        </div>

        {incidents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Types ({incidents.length})</option>
              <option value="darvo">DARVO ({incidents.filter(i => i.reaction_type === 'darvo').length})</option>
              <option value="victim_reversal">Victim Reversal ({incidents.filter(i => i.reaction_type === 'victim_reversal').length})</option>
              <option value="counter_accusation">Counter-Accusation ({incidents.filter(i => i.reaction_type === 'counter_accusation').length})</option>
              <option value="deflection">Deflection ({incidents.filter(i => i.reaction_type === 'deflection').length})</option>
              <option value="gaslighting">Gaslighting ({incidents.filter(i => i.reaction_type === 'gaslighting').length})</option>
            </select>
            <a
              href="/api/reactive-abuse/export"
              download
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </a>
          </div>
        )}

        {showForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle>{editingIncident ? 'Edit Entry' : 'Document Reactive Abuse'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">What did you try to address? *</label>
                <textarea
                  value={formData.what_you_addressed}
                  onChange={(e) => setFormData({...formData, what_you_addressed: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="e.g., I asked why they yelled at me in front of the kids"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your approach</label>
                  <select
                    value={formData.your_approach}
                    onChange={(e) => setFormData({...formData, your_approach: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select how you approached it...</option>
                    <option value="calm_conversation">Calm conversation</option>
                    <option value="expressed_feelings">Expressed feelings</option>
                    <option value="set_boundary">Set boundary</option>
                    <option value="asked_question">Asked question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Their reaction type *</label>
                  <select
                    value={formData.reaction_type}
                    onChange={(e) => setFormData({...formData, reaction_type: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    <option value="">Select how they reacted...</option>
                    <option value="darvo">DARVO</option>
                    <option value="victim_reversal">Victim Reversal</option>
                    <option value="counter_accusation">Counter-Accusation</option>
                    <option value="deflection">Deflection</option>
                    <option value="gaslighting">Gaslighting</option>
                  </select>
                  {formData.reaction_type && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {formData.reaction_type === 'darvo' && '🔄 Deny, Attack, Reverse Victim & Offender - "I never did that, YOU\'RE the abusive one!"'}
                      {formData.reaction_type === 'victim_reversal' && '😢 Flipping the script to make themselves the victim - "You\'re hurting ME by bringing this up"'}
                      {formData.reaction_type === 'counter_accusation' && '👉 Accusing you of the same or worse - "Well YOU do this all the time!"'}
                      {formData.reaction_type === 'deflection' && '↪️ Changing the subject or bringing up your past mistakes to avoid accountability'}
                      {formData.reaction_type === 'gaslighting' && '🤯 Making you question your reality - "That never happened, you\'re imagining things"'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What they said</label>
                <textarea
                  value={formData.what_they_said}
                  onChange={(e) => setFormData({...formData, what_they_said: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="e.g., 'YOU'RE the one who's always starting fights! I'm the victim here!'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What they accused you of</label>
                <textarea
                  value={formData.what_they_accused_you_of}
                  onChange={(e) => setFormData({...formData, what_they_accused_you_of: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="e.g., Being too sensitive, attacking them, being the real abuser"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Made you feel</label>
                <select
                  value={formData.made_you_feel}
                  onChange={(e) => setFormData({...formData, made_you_feel: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select how it made you feel...</option>
                  <option value="guilty">Guilty</option>
                  <option value="confused">Confused</option>
                  <option value="crazy">Crazy</option>
                  <option value="like_the_abuser">Like the abuser</option>
                  <option value="defensive">Defensive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.did_you_apologize}
                    onChange={(e) => setFormData({...formData, did_you_apologize: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Did you end up apologizing?</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.original_issue_resolved}
                    onChange={(e) => setFormData({...formData, original_issue_resolved: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Was your original issue resolved?</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring_pattern}
                    onChange={(e) => setFormData({...formData, is_recurring_pattern: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Is this a recurring pattern?</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.similar_topic_before}
                    onChange={(e) => setFormData({...formData, similar_topic_before: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Have you tried discussing this topic before?</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.maintained_boundary}
                    onChange={(e) => setFormData({...formData, maintained_boundary: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Did you maintain your boundary?</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">How you responded</label>
                <textarea
                  value={formData.how_you_responded}
                  onChange={(e) => setFormData({...formData, how_you_responded: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="e.g., I apologized and dropped the subject, or I stood my ground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="Any additional context or observations..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingIncident ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-800">💡 What is Reactive Abuse?</CardTitle>
              {showInfo ? <ChevronUp className="h-5 w-5 text-purple-600" /> : <ChevronDown className="h-5 w-5 text-purple-600" />}
            </div>
          </CardHeader>
          {showInfo && (
            <CardContent className="space-y-2 text-sm text-purple-900">
              <p>When you try to address a concern and they flip it around, making YOU the problem instead.</p>
              <div className="space-y-1">
                <div><strong>✓ DARVO:</strong> Deny, Attack, Reverse Victim & Offender</div>
                <div><strong>✓ Track patterns:</strong> Topics you can't discuss without being blamed</div>
                <div><strong>✓ Reality check:</strong> See how often you apologize for their behavior</div>
              </div>
            </CardContent>
          )}
        </Card>

        {filteredIncidents.length === 0 && incidents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Start documenting when your concerns get turned against you
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
              >
                Add First Entry
              </button>
            </CardContent>
          </Card>
        ) : filteredIncidents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600">No incidents match the selected filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="hover:shadow-md transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {incident.reaction_type.replace('_', ' ')}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(incident.incident_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">What you addressed: </span>
                        <span className="text-sm text-gray-600">{incident.what_you_addressed}</span>
                      </div>
                      
                      {incident.what_they_accused_you_of && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">They accused you of: </span>
                          <span className="text-sm text-gray-600">{incident.what_they_accused_you_of}</span>
                        </div>
                      )}

                      {incident.what_they_said && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm font-medium text-red-900">What they said: </span>
                          <p className="text-sm text-red-800 mt-1">{incident.what_they_said}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {incident.did_you_apologize && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            You apologized
                          </span>
                        )}
                        {!incident.original_issue_resolved && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Issue unresolved</span>
                        )}
                        {incident.is_recurring_pattern && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Recurring pattern</span>
                        )}
                        {incident.maintained_boundary && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Boundary maintained</span>
                        )}
                      </div>

                      {incident.notes && (
                        <p className="text-sm text-gray-600 italic">{incident.notes}</p>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 self-start">
                      <button
                        onClick={() => handleEdit(incident)}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
