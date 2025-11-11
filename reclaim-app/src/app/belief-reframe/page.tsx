'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, RefreshCw, TrendingDown, CheckCircle, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

interface Belief {
  id: string
  belief_text: string
  current_strength: number
  initial_strength: number
  status: string
  created_at: string
  updated_at: string
  counter_evidence: any[]
}

export default function BeliefReframePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
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

      const response = await fetch('/api/belief-reframe')
      const data = await response.json()
      setBeliefs(data.beliefs || [])
      setLoading(false)
    }
    init()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  const activeBeliefs = beliefs.filter(b => b.status === 'active')
  const resolvedBeliefs = beliefs.filter(b => b.status === 'resolved')

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Belief Reframe Journey</h1>
            <p className="text-gray-600 mt-2">Challenge false beliefs installed by abuse</p>
          </div>
          <Link href="/belief-reframe/new">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Belief
            </button>
          </Link>
        </div>

        {activeBeliefs.length === 0 && resolvedBeliefs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Healing Journey</h3>
              <p className="text-gray-600 mb-6">
                Identify and challenge false beliefs from narcissistic abuse using CBT techniques.
              </p>
              <Link href="/belief-reframe/new">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  Add Your First Belief
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {activeBeliefs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Active Beliefs ({activeBeliefs.length})
                </h2>
                <div className="space-y-4">
                  {activeBeliefs.map((belief) => {
                    const strengthChange = belief.initial_strength - belief.current_strength
                    const evidenceCount = belief.counter_evidence?.length || 0
                    const progressPercent = ((belief.initial_strength - belief.current_strength) / belief.initial_strength) * 100

                    return (
                      <Link key={belief.id} href={`/belief-reframe/${belief.id}`}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-green-300">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{belief.belief_text}</CardTitle>
                                <CardDescription className="mt-2">
                                  Strength: {belief.current_strength}/10
                                  {strengthChange > 0 && (
                                    <span className="text-green-600 ml-2">
                                      ↓ {strengthChange} from {belief.initial_strength}
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (confirm(`Delete belief "${belief.belief_text}"?`)) {
                                    const res = await fetch(`/api/belief-reframe/${belief.id}`, { method: 'DELETE' })
                                    if (res.ok) {
                                      toast.success('Belief deleted')
                                      const response = await fetch('/api/belief-reframe')
                                      const data = await response.json()
                                      setBeliefs(data.beliefs || [])
                                    } else {
                                      toast.error('Failed to delete')
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                                title="Delete belief"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all" 
                                style={{ width: `${Math.max(progressPercent, 5)}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{evidenceCount} counter-evidence</span>
                              <span>•</span>
                              <span>Last updated {new Date(belief.updated_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {resolvedBeliefs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Resolved Beliefs ({resolvedBeliefs.length})
                </h2>
                <div className="space-y-4">
                  {resolvedBeliefs.map((belief) => (
                    <Card key={belief.id} className="bg-green-50 border-green-200">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          <div className="flex-1">
                            <CardTitle className="text-lg text-green-900">{belief.belief_text}</CardTitle>
                            <CardDescription className="text-green-700">
                              Final strength: {belief.current_strength}/10 • 
                              Resolved {new Date(belief.updated_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeBeliefs.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{activeBeliefs.length}</div>
                      <div className="text-sm text-green-700">Active Beliefs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {activeBeliefs.reduce((sum, b) => sum + (b.counter_evidence?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-green-700">Evidence Collected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{resolvedBeliefs.length}</div>
                      <div className="text-sm text-green-700">Beliefs Resolved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
