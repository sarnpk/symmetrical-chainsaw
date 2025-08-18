'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, BookOpen, Brain, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }
      
      setUser(user)
      
      // Get or create user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            display_name: user.email?.split('@')[0],
            subscription_tier: 'foundation',
          })
          .select()
          .single()
        
        if (!error) {
          profile = newProfile
        }
      }
      
      setProfile(profile)
      
      // Get recent entries
      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      
      setRecentEntries(entries || [])
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.display_name || 'Friend'}
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your healing journey. You're making progress.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/journal/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200">
              <CardHeader className="text-center">
                <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-3">
                  <Plus className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">New Entry</CardTitle>
                <CardDescription>Document a new experience</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Journal</CardTitle>
                <CardDescription>View all your entries</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ai-coach">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit mb-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">AI Coach</CardTitle>
                <CardDescription>Get support and guidance</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Patterns</CardTitle>
                <CardDescription>Analyze your progress</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Entries */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Entries</h2>
            <button
              onClick={() => router.push('/journal')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium cursor-pointer"
              type="button"
            >
              View all
            </button>
          </div>

          {recentEntries && recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription>
                          {new Date(entry.incident_date).toLocaleDateString()} • 
                          Safety: {entry.safety_rating}/5
                        </CardDescription>
                      </div>
                      <Link 
                        href={`/journal/${entry.id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">
                      {entry.description}
                    </p>
                    {/* Behavior Types Tags */}
                    {entry.abuse_types && entry.abuse_types.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.abuse_types.slice(0, 3).map((type: string) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                          >
                            {type.replace('_', ' ')}
                          </span>
                        ))}
                        {entry.abuse_types.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{entry.abuse_types.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No entries yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start documenting your experiences to track patterns and progress.
                </p>
                <Link 
                  href="/journal/new"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create your first entry
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Safety Reminder */}
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-800">Safety First</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              If you're in immediate danger, please contact emergency services or a crisis helpline.
            </p>
            <div className="flex gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                Emergency Contacts
              </button>
              <Link 
                href="/safety-plan"
                className="border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Safety Plan
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 