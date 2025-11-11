'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Brain, Send } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RealityTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [belief, setBelief] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [question, setQuestion] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  const params = useParams()
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

      const response = await fetch(`/api/belief-reframe/${params.id}`)
      const data = await response.json()
      setBelief(data.belief)

      const startResponse = await fetch(`/api/belief-reframe/${params.id}/ai-reality-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 0 })
      })
      const startData = await startResponse.json()
      setQuestion(startData.question)
      setFollowUp(startData.followUp)
      setStep(startData.step)
      setLoading(false)
    }
    init()
  }, [params.id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAnswer.trim()) return

    setProcessing(true)
    const newHistory = [...conversationHistory, { role: 'user', content: userAnswer }]

    const response = await fetch(`/api/belief-reframe/${params.id}/ai-reality-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        step, 
        userAnswer, 
        conversationHistory: newHistory 
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('API error:', data)
      toast.error(data.details || 'Failed to process response. Please try again.')
      setProcessing(false)
      return
    }
    
    if (data.aiResponse) {
      setAiResponse(data.aiResponse)
      newHistory.push({ role: 'assistant', content: data.aiResponse })
      setConversationHistory(newHistory)
    }

    if (data.completed) {
      setCompleted(true)
      toast.success('Reality testing session completed!')
    } else {
      setQuestion(data.question)
      setFollowUp(data.followUp)
      setStep(data.step)
    }

    setUserAnswer('')
    setProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || !profile || !belief) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href={`/belief-reframe/${params.id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Belief
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Guided Reality Testing</h1>
          <p className="text-gray-600 mt-2">{belief.belief_text}</p>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-purple-800">
                Step {step} of 4
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!completed ? (
                <>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <p className="text-gray-900 font-medium mb-2">{question}</p>
                    <p className="text-sm text-gray-600">{followUp}</p>
                  </div>

                  {aiResponse && (
                    <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
                      <p className="text-sm text-purple-900">{aiResponse}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Your answer..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      disabled={processing}
                    />
                    <button
                      type="submit"
                      disabled={processing || !userAnswer.trim()}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Continue
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h3>
                  </div>
                  
                  {aiResponse && (
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-3">Session Summary</h4>
                      <p className="text-gray-800 whitespace-pre-line">{aiResponse}</p>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <Link href={`/belief-reframe/${params.id}`}>
                      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                        Update Belief Strength
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {conversationHistory.length > 0 && !completed && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {conversationHistory.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-100' : 'bg-purple-50'}`}>
                    <p className="text-sm text-gray-900">{msg.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
