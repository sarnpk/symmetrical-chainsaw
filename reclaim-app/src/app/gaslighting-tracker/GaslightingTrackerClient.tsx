'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Shield, Trash2, HelpCircle, ChevronDown, ChevronUp, X, Image, Video, Mic, Download, Filter, Edit2 } from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import ContradictionDetector from '@/components/gaslighting/ContradictionDetector'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function GaslightingTrackerClient() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [statements, setStatements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [filterTopic, setFilterTopic] = useState('all')
  const [editingStatement, setEditingStatement] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    their_claim: '',
    actual_truth: '',
    your_memory: '',
    topic: 'relationship',
    evidence_text: ''
  })
  const [mediaUrls, setMediaUrls] = useState<{ audio?: string; video?: string; images?: string[] }>({})
  const [transcribing, setTranscribing] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const topics = ['finances', 'parenting', 'relationship', 'past_events', 'your_behavior', 'their_behavior']

  const loadStatements = async () => {
    const response = await fetch('/api/gaslighting/statements')
    const data = await response.json()
    setStatements(Array.isArray(data) ? data : [])
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

      await loadStatements()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async () => {
    if (!formData.their_claim.trim() || !formData.actual_truth.trim()) {
      toast.error('Please fill required fields')
      return
    }

    const url = editingStatement ? `/api/gaslighting/statements?id=${editingStatement.id}` : '/api/gaslighting/statements'
    const method = editingStatement ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        statement_date: new Date().toISOString(),
        ...formData,
        audio_url: mediaUrls.audio,
        video_url: mediaUrls.video,
        image_urls: mediaUrls.images || [],
        gaslighting_severity: 5,
        impact_on_you: 5
      })
    })

    if (response.ok) {
      toast.success(editingStatement ? 'Statement updated' : 'Statement documented')
      setFormData({ their_claim: '', actual_truth: '', your_memory: '', topic: 'relationship', evidence_text: '' })
      setMediaUrls({})
      setShowForm(false)
      setEditingStatement(null)
      await loadStatements()
    } else {
      const errorData = await response.json()
      console.error('Save error:', errorData)
      toast.error(`Failed: ${errorData.error || 'Unknown error'}`)
    }
  }

  const handleEdit = (statement: any) => {
    setEditingStatement(statement)
    setFormData({
      their_claim: statement.their_claim,
      actual_truth: statement.actual_truth,
      your_memory: statement.your_memory || '',
      topic: statement.topic,
      evidence_text: statement.evidence_text || ''
    })
    setMediaUrls({
      audio: statement.audio_url,
      video: statement.video_url,
      images: statement.image_urls || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this statement?')) return

    const response = await fetch(`/api/gaslighting/statements?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success('Statement deleted')
      await loadStatements()
    } else {
      toast.error('Failed to delete')
    }
  }

  const handleTranscribe = async () => {
    if (!mediaUrls.audio) {
      toast.error('Please upload audio first')
      return
    }

    setTranscribing(true)
    try {
      const response = await fetch('/api/test/gladia-transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_url: mediaUrls.audio })
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, evidence_text: data.transcription })
        toast.success('Audio transcribed!')
      } else {
        toast.error('Transcription failed')
      }
    } catch (error) {
      toast.error('Transcription error')
    } finally {
      setTranscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  const filteredStatements = statements.filter(s => filterTopic === 'all' || s.topic === filterTopic)

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gaslighting Journal</h1>
                <a 
                  href="/docs/GASLIGHTING_TRUTH_JOURNAL_GUIDE.html"
                  target="_blank"
                  className="text-red-600 hover:text-red-700"
                  title="View User Guide"
                >
                  <HelpCircle className="h-6 w-6" />
                </a>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Document their lies vs the truth with evidence</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              {showForm ? 'Cancel' : 'Journal Gaslighting'}
            </button>
            {statements.length > 0 && (
              <a
                href="/api/gaslighting/export"
                download
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial whitespace-nowrap"
              >
                <Download className="h-5 w-5" />
                Export Report
              </a>
            )}
          </div>
        </div>

        {showForm && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle>{editingStatement ? 'Edit Statement' : 'Document Gaslighting'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What They Claimed *</label>
                <textarea
                  value={formData.their_claim}
                  onChange={(e) => setFormData({ ...formData, their_claim: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="e.g., 'I never said that', 'You are remembering it wrong'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What Actually Happened *</label>
                <textarea
                  value={formData.actual_truth}
                  onChange={(e) => setFormData({ ...formData, actual_truth: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="The objective truth of what happened"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Memory (Optional)</label>
                <textarea
                  value={formData.your_memory}
                  onChange={(e) => setFormData({ ...formData, your_memory: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  placeholder="Your detailed recollection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Evidence (Optional)</label>
                <MediaUpload onUploadComplete={(urls) => setMediaUrls(prev => ({ ...prev, ...urls }))} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Evidence Text (Messages/Emails/Transcription)</label>
                  {mediaUrls.audio && (
                    <button
                      type="button"
                      onClick={handleTranscribe}
                      disabled={transcribing}
                      className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Mic className="h-3 w-3" />
                      {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
                    </button>
                  )}
                </div>
                <textarea
                  value={formData.evidence_text}
                  onChange={(e) => setFormData({ ...formData, evidence_text: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Paste text messages, emails, or transcribe audio evidence here..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ their_claim: '', actual_truth: '', your_memory: '', topic: 'relationship', evidence_text: '' })
                    setMediaUrls({})
                    setEditingStatement(null)
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingStatement ? 'Update Statement' : 'Save Statement'}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-800">About Gaslighting Journal</CardTitle>
              {showInfo ? <ChevronUp className="h-5 w-5 text-purple-600" /> : <ChevronDown className="h-5 w-5 text-purple-600" />}
            </div>
          </CardHeader>
          {showInfo && (
            <CardContent className="space-y-3 text-sm text-purple-900">
              <p className="font-medium">
                Document when they deny, distort, or contradict reality. Track their lies vs the truth with evidence.
              </p>
              <div className="space-y-2">
                <div><strong>Document lies:</strong> Record what they claimed vs what actually happened</div>
                <div><strong>Add evidence:</strong> Attach audio, video, or images as proof</div>
                <div><strong>AI detection:</strong> Automatically detect contradictions between statements</div>
                <div><strong>Pattern tracking:</strong> See which topics they gaslight about most</div>
                <div><strong>Export reports:</strong> Generate evidence for therapy or legal use</div>
              </div>
            </CardContent>
          )}
        </Card>

        {statements.length >= 2 && <ContradictionDetector statements={statements} />}

        {statements.length > 0 && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">All Statements ({statements.length})</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="p-2 border rounded text-sm"
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {statements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No statements documented yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Start documenting gaslighting to track patterns and contradictions
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
              >
                Add Your First Statement
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStatements.map((statement) => (
              <Card key={statement.id} className="hover:shadow-md transition-shadow border-red-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-600">
                          {new Date(statement.statement_date).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded capitalize">
                          {statement.topic.replace('_', ' ')}
                        </span>
                        {statement.gaslighting_severity && (
                          <span className="text-sm font-semibold text-red-600">
                            Severity: {statement.gaslighting_severity}/10
                          </span>
                        )}
                      </div>

                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-xs font-semibold text-red-900 mb-1">THEIR CLAIM:</div>
                        <div className="text-gray-900">"{statement.their_claim}"</div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-xs font-semibold text-green-900 mb-1">ACTUAL TRUTH:</div>
                        <div className="text-gray-900">{statement.actual_truth}</div>
                      </div>

                      {statement.your_memory && (
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-xs font-semibold text-blue-900 mb-1">YOUR MEMORY:</div>
                          <div className="text-gray-900">{statement.your_memory}</div>
                        </div>
                      )}

                      {statement.evidence_text && (
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                          <div className="text-xs font-semibold text-yellow-900 mb-1">EVIDENCE TEXT:</div>
                          <div className="text-gray-900 whitespace-pre-wrap">{statement.evidence_text}</div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 flex-wrap">
                        {statement.audio_url && (
                          <a href={statement.audio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Mic className="h-4 w-4" />
                          </a>
                        )}
                        {statement.video_url && (
                          <a href={statement.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Video className="h-4 w-4" />
                          </a>
                        )}
                        {statement.image_urls?.length > 0 && (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">({statement.image_urls.length})</span>
                          </span>
                        )}
                      </div>

                      {statement.image_urls?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {statement.image_urls.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt="" className="h-20 w-20 object-cover rounded border hover:opacity-80" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 self-start">
                      <button
                        onClick={() => handleEdit(statement)}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(statement.id)}
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
