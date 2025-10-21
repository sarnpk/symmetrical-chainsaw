'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'

interface NPDTrait {
  id: string
  name: string
  category: 'covert' | 'overt' | 'both'
  description: string
  examples: string[]
  response_strategies: string[]
  severity: 'mild' | 'moderate' | 'severe'
}

export default function NPDTraitsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [traits, setTraits] = useState<NPDTrait[]>([])
  const [filteredTraits, setFilteredTraits] = useState<NPDTrait[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)

      const response = await fetch('/api/npd-traits')
      const data = await response.json()
      setTraits(data.traits || [])
      setFilteredTraits(data.traits || [])
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  useEffect(() => {
    let filtered = traits

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter || t.category === 'both')
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTraits(filtered)
  }, [searchQuery, categoryFilter, traits])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-700 border-red-300'
      case 'moderate': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'mild': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'covert': return 'bg-purple-100 text-purple-700'
      case 'overt': return 'bg-blue-100 text-blue-700'
      case 'both': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            NPD Trait Library
          </h1>
          <p className="text-gray-600 mt-2">
            Learn to recognize and name manipulation tactics. Knowledge is power.
          </p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Understanding NPD Traits</p>
                <p>These traits help you identify patterns and objectify behavior. This isn't about hatred—it's about clarity and protection.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search traits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter('covert')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'covert'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Covert
            </button>
            <button
              onClick={() => setCategoryFilter('overt')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === 'overt'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overt
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredTraits.map((trait) => (
            <Link key={trait.id} href={`/npd-traits/${trait.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{trait.name}</CardTitle>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadge(trait.category)}`}>
                        {trait.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(trait.severity)}`}>
                        {trait.severity}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{trait.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {trait.examples.slice(0, 2).map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                      {trait.examples.length > 2 && (
                        <p className="text-sm text-indigo-600 mt-2">+{trait.examples.length - 2} more examples</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredTraits.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No traits found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
