'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Mic, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'

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

interface RealityLogFormProps {
  user?: User
  onSuccess?: () => void
}

export default function RealityLogForm({ user, onSuccess }: RealityLogFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    event: '',
    fact: '',
    npd_trait: '',
    is_consistent: false,
    pattern_note: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFullScreenEditor, setShowFullScreenEditor] = useState(false)
  const [editorMode, setEditorMode] = useState<'event' | 'fact'>('event')
  const [editorText, setEditorText] = useState('')
  const [isDictating, setIsDictating] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported(!!((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition))
    }
  }, [])

  const openFullScreenEditor = (mode: 'event' | 'fact') => {
    setEditorMode(mode)
    setEditorText(mode === 'event' ? formData.event : formData.fact)
    setShowFullScreenEditor(true)
  }

  const closeFullScreenEditor = () => {
    setShowFullScreenEditor(false)
    setIsDictating(false)
    stopDictation()
  }

  const saveEditorText = () => {
    if (editorMode === 'event') {
      setFormData({ ...formData, event: editorText })
    } else {
      setFormData({ ...formData, fact: editorText })
    }
    closeFullScreenEditor()
  }

  const startDictation = () => {
    if (!speechSupported) return
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onresult = (event: any) => {
        let addition = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i]
          if (res.isFinal) {
            addition += res[0].transcript + ' '
          }
        }
        if (addition) {
          setEditorText((prev) => (prev ? prev + (prev.endsWith(' ') ? '' : ' ') : '') + addition.trim())
        }
      }

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error', e)
      }

      rec.onend = () => {
        if (showFullScreenEditor && isDictating) {
          try {
            rec.start()
          } catch {}
        }
      }

      recognitionRef.current = rec
      rec.start()
      setIsDictating(true)
    } catch (e) {
      console.warn('Failed to start dictation', e)
    }
  }

  const stopDictation = () => {
    try {
      const rec = recognitionRef.current
      if (rec) {
        rec.onend = null
        rec.stop()
      }
    } catch {}
    setIsDictating(false)
  }

  useEffect(() => {
    if (showFullScreenEditor && speechSupported) {
      startDictation()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        stopDictation()
      }
    }
  }, [showFullScreenEditor, speechSupported])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user?.id) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('reality_log_entries')
        .insert({
          user_id: user.id,
          date: formData.date,
          event: formData.event,
          fact: formData.fact,
          npd_trait: formData.npd_trait,
          is_consistent: formData.is_consistent,
          pattern_note: formData.pattern_note,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        event: '',
        fact: '',
        npd_trait: '',
        is_consistent: false,
        pattern_note: '',
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/reality-log')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Full-screen editor modal
  if (showFullScreenEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-indigo-50">
          <button
            type="button"
            onClick={closeFullScreenEditor}
            className="text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-sm text-gray-800 flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${isDictating ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {isDictating ? 'Dictatingâ€¦' : speechSupported ? 'Tap mic to dictate' : 'Dictation not supported'}
          </div>
          <button
            type="button"
            onClick={saveEditorText}
            className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>

        {/* Title */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <p className="text-sm font-medium text-gray-700">
            {editorMode === 'event' ? 'ðŸŽ¯ Event (What happened?)' : 'ðŸ“‹ Fact (What exactly happened?)'}
          </p>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-y-auto">
          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            className="w-full h-full resize-none outline-none text-base p-4 border border-gray-300 rounded-lg"
            placeholder={editorMode === 'event' ? 'Speak or type what happenedâ€¦' : 'Speak or type the factsâ€¦'}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={() => (isDictating ? stopDictation() : startDictation())}
            disabled={!speechSupported}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
              isDictating
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } disabled:bg-gray-300 disabled:text-gray-600`}
          >
            <Mic className="h-4 w-4" />
            {isDictating ? 'Stop' : 'Start'} Mic
          </button>
          <div className="text-xs text-gray-500">
            {editorText.length} characters
          </div>
        </div>
      </div>
    )
  }

  // Normal form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Reality Anchor Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ðŸ“… Date
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
              ðŸŽ¯ Event (What happened?)
            </label>
            <div
              onClick={() => openFullScreenEditor('event')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
            >
              <p className={formData.event ? 'text-gray-900' : 'text-gray-500'}>
                {formData.event || 'Tap to add event (or use voice)...'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{formData.event.length} characters</p>
          </div>

          {/* Fact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ðŸ“‹ Fact (What exactly happened?)
            </label>
            <div
              onClick={() => openFullScreenEditor('fact')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-white hover:bg-gray-50 transition-colors min-h-24"
            >
              <p className={formData.fact ? 'text-gray-900' : 'text-gray-500'}>
                {formData.fact || 'Tap to add facts (or use voice)...'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{formData.fact.length} characters</p>
          </div>

          {/* NPD Trait */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ðŸ·ï¸ NPD Trait (What trait is this?)
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
                ðŸ“Œ This is consistent with past behavior
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

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
