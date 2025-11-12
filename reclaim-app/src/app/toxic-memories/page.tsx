'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, AlertTriangle, Trash2, Brain, Image, Video, Mic, Link as LinkIcon, X, MicOff, Edit2 } from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import { useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ToxicMemoriesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [memories, setMemories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedMemory, setSelectedMemory] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [memoryText, setMemoryText] = useState('')
  const [showTextModal, setShowTextModal] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [editingMemory, setEditingMemory] = useState<any>(null)
  const [mediaUrls, setMediaUrls] = useState<{ audio?: string; video?: string; images?: string[] }>({})
  const router = useRouter()
  const supabase = createClient()
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const tags = ['gaslighting', 'manipulation', 'verbal_abuse', 'emotional_abuse', 'control']

  const loadMemories = async () => {
    const response = await fetch('/api/toxic-memories')
    const data = await response.json()
    setMemories(data.memories || [])
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
        setMemoryText(prev => prev + ' ' + transcript)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  useEffect(() => {
    if (showTextModal && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [showTextModal])

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
        toast.error('Toxic Memory Journal requires Recovery or Empowered tier')
        router.push('/dashboard')
        return
      }

      await loadMemories()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = async (text: string) => {
    const url = editingMemory ? `/api/toxic-memories?id=${editingMemory.id}` : '/api/toxic-memories'
    const method = editingMemory ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memory_text: text,
        tags: selectedTags,
        audio_url: mediaUrls.audio,
        video_url: mediaUrls.video,
        image_urls: mediaUrls.images || []
      })
    })

    if (response.ok) {
      toast.success(editingMemory ? 'Memory updated' : 'Memory documented')
      setMemoryText('')
      setSelectedTags([])
      setMediaUrls({})
      setShowForm(false)
      setEditingMemory(null)
      await loadMemories()
    } else {
      const error = await response.json()
      toast.error(`Failed to save memory: ${error.error || 'Unknown error'}`)
      console.error('Save error:', error)
    }
  }

  const handleEdit = (memory: any) => {
    setEditingMemory(memory)
    setMemoryText(memory.memory_text)
    setSelectedTags(memory.tags || [])
    setMediaUrls({
      audio: memory.audio_url,
      video: memory.video_url,
      images: memory.image_urls || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this memory?')) return

    const response = await fetch(`/api/toxic-memories?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success('Memory deleted')
      await loadMemories()
    } else {
      toast.error('Failed to delete')
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

  if (profile.subscription_tier === 'foundation') {
    return (
      <DashboardLayout user={user} profile={profile}>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recovery Tier Feature</h2>
            <p className="text-gray-600 mb-6">Toxic Memory Journal is available on Recovery and Empowered tiers.</p>
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
      {showTextModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-none sm:rounded-lg w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Describe Memory</h2>
              <button onClick={() => setShowTextModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <textarea
                ref={textareaRef}
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Describe the toxic/abusive memory... (e.g., 'She yelled at me for 2 hours because I forgot to text back immediately')"
                className="w-full h-full min-h-[250px] sm:min-h-[300px] p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-base sm:text-lg"
              />
            </div>
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isListening ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isListening ? <><MicOff className="h-5 w-5" />Stop Recording</> : <><Mic className="h-5 w-5" />Voice Input</>}
              </button>
              <button
                onClick={() => setShowTextModal(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Toxic Memory Journal</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Quick snapshots of toxic incidents - brief notes with evidence</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add Memory
          </button>
        </div>

        {showForm && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle>{editingMemory ? 'Edit Memory' : 'Document Toxic Memory'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Memory Description</label>
                <textarea
                  value={memoryText}
                  onFocus={() => setShowTextModal(true)}
                  readOnly
                  placeholder="Click to describe the toxic/abusive memory..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Evidence (Optional)</label>
                <MediaUpload onUploadComplete={(urls) => setMediaUrls(prev => ({ ...prev, ...urls }))} />
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
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setMemoryText('')
                    setSelectedTags([])
                    setMediaUrls({})
                    setEditingMemory(null)
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(memoryText)}
                  disabled={!memoryText.trim()}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {editingMemory ? 'Update Memory' : 'Save Memory'}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">💡 About Toxic Memory Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-purple-900">
            <p className="font-medium">
              A quick and short way to capture toxic/abusive incidents as they happen or shortly after. 
              Think of it as "evidence snapshots" - brief notes with optional media proof.
            </p>
            <div className="space-y-2">
              <div><strong>✓ Quick capture:</strong> Jot down what happened in a few sentences</div>
              <div><strong>✓ Add evidence:</strong> Attach audio, video, or images as proof</div>
              <div><strong>✓ AI analysis:</strong> Identify manipulation tactics (gaslighting, DARVO, etc.)</div>
              <div><strong>✓ Pattern tracking:</strong> See recurring abuse patterns over time</div>
              <div><strong>✓ Legal/therapeutic use:</strong> Timestamped evidence for professionals</div>
            </div>
            <p className="text-xs italic mt-2">
              Tip: Keep entries brief and factual. For deeper reflection, use your main journal.
            </p>
          </CardContent>
        </Card>

        {memories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No memories documented yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Document toxic memories to process them and track patterns of abuse
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
              >
                Add Your First Memory
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {memories.map((memory) => (
              <Card key={memory.id} className="hover:shadow-md transition-shadow border-red-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 space-y-3 min-w-0">
                      <p className="text-gray-900">{memory.memory_text}</p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-600">
                          {new Date(memory.memory_date).toLocaleDateString()}
                        </span>
                        {memory.tags && memory.tags.length > 0 && (
                          <div className="flex gap-2">
                            {memory.tags.map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                {tag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                        {memory.audio_url && (
                          <a href={memory.audio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Mic className="h-4 w-4" />
                          </a>
                        )}
                        {memory.video_url && (
                          <a href={memory.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Video className="h-4 w-4" />
                          </a>
                        )}
                        {memory.image_urls?.length > 0 && (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">({memory.image_urls.length})</span>
                          </span>
                        )}
                        {memory.linked_belief_ids?.length > 0 && <LinkIcon className="h-4 w-4 text-purple-500" />}
                      </div>

                      {memory.image_urls?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {memory.image_urls.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt="" className="h-20 w-20 object-cover rounded border hover:opacity-80" />
                            </a>
                          ))}
                        </div>
                      )}

                      {memory.ai_analysis && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-2 text-sm">
                          <div>
                            <strong className="text-purple-900">NPD Tactics:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {memory.ai_analysis.npd_tactics?.map((tactic: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                  {tactic}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <strong className="text-purple-900">Validation:</strong>
                            <p className="text-gray-700 mt-1">{memory.ai_analysis.validation}</p>
                          </div>
                          {memory.ai_analysis.suggested_beliefs?.length > 0 && (
                            <div>
                              <strong className="text-purple-900">May Have Installed:</strong>
                              <ul className="list-disc list-inside text-gray-700 mt-1">
                                {memory.ai_analysis.suggested_beliefs.map((belief: string, i: number) => (
                                  <li key={i}>{belief}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {!memory.ai_analysis && (
                        <button
                          onClick={async () => {
                            setAnalyzing(true)
                            const res = await fetch('/api/toxic-memories/ai-analyze', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ memory_id: memory.id })
                            })
                            if (res.ok) {
                              toast.success('Analysis complete')
                              await loadMemories()
                            } else {
                              toast.error('Analysis failed')
                            }
                            setAnalyzing(false)
                          }}
                          disabled={analyzing}
                          className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50 w-full sm:w-auto px-3 py-2 border border-purple-200 rounded-lg hover:bg-purple-50"
                        >
                          <Brain className="h-4 w-4" />
                          {analyzing ? 'Analyzing...' : 'AI Analyze Memory'}
                        </button>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 self-start">
                      <button
                        onClick={() => handleEdit(memory)}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(memory.id)}
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

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">💡 Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-red-700">
              Documenting toxic memories helps you recognize patterns of abuse and validate your experiences. 
              This is separate from your regular journal and can be used to identify manipulation tactics to prevent regret later.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
