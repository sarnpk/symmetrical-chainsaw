"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { JournalEntry, Profile } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Calendar, 
  Search, 
  Filter, 
  Clock,
  MapPin,
  Shield,
  Heart,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  SortDesc,
  SortAsc,
  Grid,
  List,
  BookOpen,
  TrendingUp,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function JournalPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'safety' | 'mood'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterSafety, setFilterSafety] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const load = async () => {
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

      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('incident_date', { ascending: false })
      setEntries(entries || [])

      setLoading(false)
    }
    load()
  }, [router, supabase])

  // Filter and sort entries
  useEffect(() => {
    let filtered = [...entries]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply safety filter
    if (filterSafety !== null) {
      filtered = filtered.filter(entry => {
        const safetyRating = entry.safety_rating || entry.ai_analysis?.safety_level || 5
        return safetyRating <= filterSafety
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'safety':
          aValue = a.safety_rating || a.ai_analysis?.safety_level || 5
          bValue = b.safety_rating || b.ai_analysis?.safety_level || 5
          break
        case 'mood':
          aValue = a.mood_rating || 5
          bValue = b.mood_rating || 5
          break
        case 'date':
        default:
          aValue = new Date(a.incident_date || a.created_at).getTime()
          bValue = new Date(b.incident_date || b.created_at).getTime()
          break
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    setFilteredEntries(filtered)
  }, [entries, searchTerm, sortBy, sortOrder, filterSafety])

  const getSafetyColor = (rating: number) => {
    if (rating <= 3) return 'bg-red-100 text-red-800 border-red-200'
    if (rating <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getMoodEmoji = (rating: number) => {
    if (rating <= 3) return '😔'
    if (rating <= 6) return '😐'
    return '😊'
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const entryDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              Your Journal
            </h1>
            <p className="text-gray-600 mt-2">
              Document and track your experiences • {entries.length} entries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
            <Link 
              href="/journal/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Entry
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {entries.filter(e => {
                        const entryDate = new Date(e.incident_date || e.created_at)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return entryDate >= weekAgo
                      }).length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Safety</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(entries.reduce((acc, e) => acc + (e.safety_rating || e.ai_analysis?.safety_level || 5), 0) / entries.length).toFixed(1)}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Mood</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(entries.reduce((acc, e) => acc + (e.mood_rating || 5), 0) / entries.length).toFixed(1)}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'safety' | 'mood')}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="safety">Sort by Safety</option>
              <option value="mood">Sort by Mood</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors shadow-sm ${
                showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Level (show ≤)
                </label>
                <select
                  value={filterSafety || ''}
                  onChange={(e) => setFilterSafety(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All levels</option>
                  <option value="3">≤ 3 (High concern)</option>
                  <option value="6">≤ 6 (Medium concern)</option>
                  <option value="10">≤ 10 (All entries)</option>
                </select>
              </div>
              {(searchTerm || filterSafety) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterSafety(null)
                  }}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Journal entries */}
        {filteredEntries && filteredEntries.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredEntries.map((entry: JournalEntry) => {
              const safetyRating = entry.safety_rating || entry.ai_analysis?.safety_level || 5
              const moodRating = typeof entry.mood_rating === 'number' ? entry.mood_rating : null
              const entryDate = entry.incident_date || entry.created_at
              const behaviorTypes = entry.abuse_types || entry.pattern_flags || []
              
              return viewMode === 'grid' ? (
                // Grid View
                <Card key={entry.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1 mr-2">{entry.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entryDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{getTimeAgo(entryDate)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {entry.description || entry.content}
                    </p>
                    
                    {/* Metrics */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSafetyColor(safetyRating)}`}>
                          <Shield className="h-3 w-3 inline mr-1" />
                          {safetyRating}/10
                        </div>
                        {moodRating !== null && (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-lg">{getMoodEmoji(moodRating)}</span>
                            <span className="text-gray-600">{moodRating}/10</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Behavior Types */}
                    {behaviorTypes && behaviorTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {behaviorTypes.slice(0, 2).map((type: string) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                          >
                            {type.replace('_', ' ')}
                          </span>
                        ))}
                        {behaviorTypes.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{behaviorTypes.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {entry.ai_analysis?.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {entry.ai_analysis.location}
                          </span>
                        )}
                      </div>
                      <Link 
                        href={`/journal/${entry.id}`}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View
                <Card key={entry.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-500">
                  <CardContent className="pt-6 pb-6 pl-6 pr-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">{entry.title}</h3>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-6 mr-2">
                        <Link 
                          href={`/journal/${entry.id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit entry"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/journal/${entry.id}`}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(entryDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getTimeAgo(entryDate)}
                        </span>
                        {entry.ai_analysis?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {entry.ai_analysis.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {entry.description || entry.content}
                    </p>

                    {/* Metrics Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSafetyColor(safetyRating)}`}>
                          <Shield className="h-4 w-4 inline mr-1" />
                          Safety: {safetyRating}/10
                        </div>
                        {moodRating !== null && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                            <span className="text-lg">{getMoodEmoji(moodRating)}</span>
                            <span className="text-sm font-medium text-gray-700">Mood: {moodRating}/10</span>
                          </div>
                        )}
                        {entry.is_evidence && (
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Evidence
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Behavior Types Tags */}
                    {behaviorTypes && behaviorTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {behaviorTypes.slice(0, 4).map((type: string) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                          >
                            {type.replace('_', ' ')}
                          </span>
                        ))}
                        {behaviorTypes.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{behaviorTypes.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : entries.length > 0 ? (
          // No filtered results
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No entries match your search
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterSafety(null)
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all filters
              </button>
            </CardContent>
          </Card>
        ) : (
          // No entries at all
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No journal entries yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start documenting your experiences to track patterns and progress.
              </p>
              <Link 
                href="/journal/new"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create your first entry
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 