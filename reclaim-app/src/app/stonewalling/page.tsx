'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Clock, AlertCircle, Trash2, Download, BarChart3, Plus, Edit2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import PatternDashboard from '@/components/stonewalling/PatternDashboard'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function StonewallPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<any>(null)
  const [formData, setFormData] = useState({
    shutdown_type: 'silent_treatment',
    duration_minutes: '',
    trigger_context: '',
    emotional_state_before: 5,
    emotional_state_after: 5,
    impact_level: 5,
    your_response: '',
    what_you_needed: '',
    notes: ''
  })
  const [durationValue, setDurationValue] = useState('')
  const [durationUnit, setDurationUnit] = useState('minutes')
  const [filterType, setFilterType] = useState<string>('all')
  const [showInfo, setShowInfo] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadIncidents = async () => {
    try {
      const response = await fetch('/api/stonewalling/incidents')
      if (!response.ok) {
        setIncidents([])
        return
      }
      const data = await response.json()
      setIncidents(Array.isArray(data) ? data : [])
    } catch (error) {
      setIncidents([])
    }
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

      await loadIncidents()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async () => {
    if (!formData.trigger_context) {
      toast.error('Please describe what triggered it')
      return
    }

    // Convert duration to minutes
    let totalMinutes = parseInt(durationValue) || 0
    if (durationUnit === 'hours') totalMinutes *= 60
    else if (durationUnit === 'days') totalMinutes *= 1440
    else if (durationUnit === 'weeks') totalMinutes *= 10080
    else if (durationUnit === 'months') totalMinutes *= 43200

    const dataToSubmit = { ...formData, duration_minutes: totalMinutes || null }

    const response = await fetch('/api/stonewalling/incidents', {
      method: editingIncident ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingIncident ? { ...dataToSubmit, id: editingIncident.id } : dataToSubmit)
    })

    if (response.ok) {
      toast.success(editingIncident ? 'Entry updated' : 'Entry saved')
      resetForm()
      await loadIncidents()
    } else {
      toast.error('Failed to save')
    }
  }

  const handleEdit = (incident: any) => {
    setEditingIncident(incident)
    
    // Convert minutes back to appropriate unit
    const mins = incident.duration_minutes || 0
    let value = mins
    let unit = 'minutes'
    if (mins >= 43200) { value = Math.round(mins / 43200); unit = 'months' }
    else if (mins >= 10080) { value = Math.round(mins / 10080); unit = 'weeks' }
    else if (mins >= 1440) { value = Math.round(mins / 1440); unit = 'days' }
    else if (mins >= 60) { value = Math.round(mins / 60); unit = 'hours' }
    
    setDurationValue(value.toString())
    setDurationUnit(unit)
    
    setFormData({
      shutdown_type: incident.shutdown_type || 'silent_treatment',
      duration_minutes: incident.duration_minutes?.toString() || '',
      trigger_context: incident.trigger_context || '',
      emotional_state_before: incident.emotional_state_before || 5,
      emotional_state_after: incident.emotional_state_after || 5,
      impact_level: incident.impact_level || 5,
      your_response: incident.your_response || '',
      what_you_needed: incident.what_you_needed || '',
      notes: incident.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    const response = await fetch(`/api/stonewalling/incidents?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success('Entry deleted')
      await loadIncidents()
    } else {
      toast.error('Failed to delete')
    }
  }

  const resetForm = () => {
    setFormData({
      shutdown_type: 'silent_treatment',
      duration_minutes: '',
      trigger_context: '',
      emotional_state_before: 5,
      emotional_state_after: 5,
      impact_level: 5,
      your_response: '',
      what_you_needed: '',
      notes: ''
    })
    setDurationValue('')
    setDurationUnit('minutes')
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

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stonewalling Journal</h1>
                <Link 
                  href="/docs/STONEWALLING_TRACKER_GUIDE.html"
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700"
                  title="View User Guide"
                >
                  <HelpCircle className="h-6 w-6" />
                </Link>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Document and understand communication shutdown patterns</p>
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

        {showForm && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle>{editingIncident ? 'Edit Entry' : 'Document Stonewalling Incident'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type of Shutdown</label>
                <select
                  value={formData.shutdown_type}
                  onChange={(e) => setFormData({ ...formData, shutdown_type: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="silent_treatment">Silent Treatment</option>
                  <option value="physical_withdrawal">Physical Withdrawal</option>
                  <option value="topic_avoidance">Topic Avoidance</option>
                  <option value="emotional_unavailability">Emotional Unavailability</option>
                  <option value="intimacy_withdrawal">Intimacy Withdrawal</option>
                </select>
                {formData.shutdown_type && (
                  <p className="text-xs text-gray-600 mt-2 italic">
                    {formData.shutdown_type === 'silent_treatment' && 'ðŸ’¬ Refusing to speak or acknowledge you, creating a wall of silence'}
                    {formData.shutdown_type === 'physical_withdrawal' && 'ðŸšª Leaving the room, house, or physically removing themselves from the situation'}
                    {formData.shutdown_type === 'topic_avoidance' && 'ðŸš« Refusing to discuss specific topics or changing the subject when brought up'}
                    {formData.shutdown_type === 'emotional_unavailability' && 'ðŸ§Š Present physically but emotionally shut down, cold, or distant'}
                    {formData.shutdown_type === 'intimacy_withdrawal' && 'ðŸ’” Withholding physical affection, intimacy, or closeness as punishment or control'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    placeholder="e.g., 30"
                    className="flex-1 p-3 border rounded-lg"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="w-32 p-3 border rounded-lg"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What triggered it? *</label>
                <textarea
                  value={formData.trigger_context}
                  onChange={(e) => setFormData({ ...formData, trigger_context: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="e.g., Asked about finances, mentioned therapy, set a boundary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Before (1-10): <span className="text-blue-600 font-bold">{formData.emotional_state_before}</span></label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.emotional_state_before}
                    onChange={(e) => setFormData({ ...formData, emotional_state_before: parseInt(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-2">After (1-10): <span className="text-red-600 font-bold">{formData.emotional_state_after}</span></label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.emotional_state_after}
                    onChange={(e) => setFormData({ ...formData, emotional_state_after: parseInt(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Impact (1-10): <span className="text-purple-600 font-bold">{formData.impact_level}</span></label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.impact_level}
                    onChange={(e) => setFormData({ ...formData, impact_level: parseInt(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What did you need?</label>
                <textarea
                  value={formData.what_you_needed}
                  onChange={(e) => setFormData({ ...formData, what_you_needed: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="e.g., Acknowledgment, conversation, emotional support"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Response</label>
                <select
                  value={formData.your_response}
                  onChange={(e) => setFormData({ ...formData, your_response: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="gave_space">Gave them space</option>
                  <option value="asked_questions">Asked questions</option>
                  <option value="left_situation">Left the situation</option>
                  <option value="waited_it_out">Waited it out</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
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
              <CardTitle className="text-purple-800">ðŸ’¡ What is Stonewalling?</CardTitle>
              {showInfo ? <ChevronUp className="h-5 w-5 text-purple-600" /> : <ChevronDown className="h-5 w-5 text-purple-600" />}
            </div>
          </CardHeader>
          {showInfo && (
            <CardContent className="space-y-2 text-sm text-purple-900">
              <p>Emotional shutdown where someone refuses to communicate, creating a wall of silence.</p>
              <div className="space-y-1">
                <div><strong>âœ“ Silent treatment:</strong> Ignoring you completely</div>
                <div><strong>âœ“ Physical withdrawal:</strong> Leaving the room or situation</div>
                <div><strong>âœ“ Topic avoidance:</strong> Refusing to discuss certain subjects</div>
                <div><strong>âœ“ Track patterns:</strong> See what triggers shutdowns</div>
              </div>
            </CardContent>
          )}
        </Card>

        {incidents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Types ({incidents.length})</option>
              <option value="silent_treatment">Silent Treatment ({incidents.filter(i => i.shutdown_type === 'silent_treatment').length})</option>
              <option value="physical_withdrawal">Physical Withdrawal ({incidents.filter(i => i.shutdown_type === 'physical_withdrawal').length})</option>
              <option value="topic_avoidance">Topic Avoidance ({incidents.filter(i => i.shutdown_type === 'topic_avoidance').length})</option>
              <option value="emotional_unavailability">Emotional Unavailability ({incidents.filter(i => i.shutdown_type === 'emotional_unavailability').length})</option>
              <option value="intimacy_withdrawal">Intimacy Withdrawal ({incidents.filter(i => i.shutdown_type === 'intimacy_withdrawal').length})</option>
            </select>
            <a
              href="/api/stonewalling/export"
              download
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </a>
          </div>
        )}

        {incidents.length >= 3 && <PatternDashboard incidents={incidents} />}

        {incidents.length > 0 && (
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">All Incidents</h2>
          </div>
        )}

        {!incidents || incidents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Start documenting stonewalling patterns to protect your wellbeing</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
              >
                Add First Entry
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {(filterType === 'all' ? incidents : incidents.filter(i => i.shutdown_type === filterType)).length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-600">No incidents match the selected filter</p>
                </CardContent>
              </Card>
            ) : (
              (filterType === 'all' ? incidents : incidents.filter(i => i.shutdown_type === filterType)).map((incident) => (
              <Card key={incident.id} className="hover:shadow-md transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {incident.shutdown_type.replace('_', ' ')}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(incident.incident_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Trigger: </span>
                        <span className="text-sm text-gray-600">{incident.trigger_context}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {incident.duration_minutes && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {incident.duration_minutes >= 43200 ? `${Math.round(incident.duration_minutes / 43200)} months` :
                             incident.duration_minutes >= 10080 ? `${Math.round(incident.duration_minutes / 10080)} weeks` :
                             incident.duration_minutes >= 1440 ? `${Math.round(incident.duration_minutes / 1440)} days` :
                             incident.duration_minutes >= 60 ? `${Math.round(incident.duration_minutes / 60)} hours` :
                             `${incident.duration_minutes} min`}
                          </span>
                        )}
                        {incident.impact_level && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Impact: {incident.impact_level}/10
                          </span>
                        )}
                        {incident.emotional_state_before && incident.emotional_state_after && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {incident.emotional_state_before} â†’ {incident.emotional_state_after}
                          </span>
                        )}
                      </div>

                      {incident.what_you_needed && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-medium text-blue-900">What you needed: </span>
                          <p className="text-sm text-blue-800 mt-1">{incident.what_you_needed}</p>
                        </div>
                      )}

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
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
