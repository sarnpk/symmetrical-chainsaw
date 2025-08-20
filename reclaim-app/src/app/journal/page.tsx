"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { JournalEntry, Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import JournalHeader from '@/components/journal/JournalHeader'
import JournalStats from '@/components/journal/JournalStats'
import JournalFilters from '@/components/journal/JournalFilters'
import JournalEntryCard from '@/components/journal/JournalEntryCard'
import JournalEmptyStates from '@/components/journal/JournalEmptyStates'

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

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterSafety(null)
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <JournalHeader 
          entriesCount={entries.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Stats */}
        <JournalStats entries={entries} />

        {/* Filters */}
        <JournalFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterSafety={filterSafety}
          onFilterSafetyChange={setFilterSafety}
          onClearFilters={handleClearFilters}
        />

        {/* Journal Entries */}
        {filteredEntries && filteredEntries.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
            : 'space-y-3 sm:space-y-4'
          }>
            {filteredEntries.map((entry: JournalEntry) => (
              <JournalEntryCard 
                key={entry.id} 
                entry={entry} 
                viewMode={viewMode} 
              />
            ))}
          </div>
        ) : (
          <JournalEmptyStates 
            type={entries.length > 0 ? 'no-results' : 'no-entries'}
            onClearFilters={entries.length > 0 ? handleClearFilters : undefined}
          />
        )}
      </div>
    </DashboardLayout>
  )
}