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
  const [sortBy, setSortBy] = useState<'date' | 'draft' | 'mood'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterSafety, setFilterSafety] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [draftFilter, setDraftFilter] = useState<'all' | 'published' | 'drafts'>('published')
  const [draftFilterSyncedBySort, setDraftFilterSyncedBySort] = useState(false)

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

  // If user selects 'Draft' in sort segmented control, treat it as a quick filter to show drafts only.
  // When switching back to Date/Mood, reset to published if it was applied via sort.
  useEffect(() => {
    if (sortBy === 'draft') {
      if (draftFilter !== 'drafts') setDraftFilter('drafts')
      setDraftFilterSyncedBySort(true)
    } else {
      if (draftFilterSyncedBySort) {
        setDraftFilter('published')
        setDraftFilterSyncedBySort(false)
      }
    }
  }, [sortBy])

  // If user manually changes draftFilter (e.g., via dropdown), stop syncing via sort chip
  useEffect(() => {
    if (draftFilter !== 'drafts') {
      setDraftFilterSyncedBySort(false)
    }
  }, [draftFilter])

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

    // Apply draft filter (client-side safeguard in addition to server-side query)
    if (draftFilter === 'drafts') {
      filtered = filtered.filter(e => e.is_draft === true)
    } else if (draftFilter === 'published') {
      filtered = filtered.filter(e => e.is_draft !== true)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'draft':
          // Drafts first when asc (0 = published, 1 = draft)
          aValue = a.is_draft ? 1 : 0
          bValue = b.is_draft ? 1 : 0
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
  }, [entries, searchTerm, sortBy, sortOrder, filterSafety, draftFilter])

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterSafety(null)
    setDraftFilter('all')
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
          draftFilter={draftFilter}
          onDraftFilterChange={setDraftFilter}
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
            type={(entries.length > 0 || draftFilter !== 'all' || filterSafety !== null || !!searchTerm) ? 'no-results' : 'no-entries'}
            onClearFilters={(entries.length > 0 || draftFilter !== 'all' || filterSafety !== null || !!searchTerm) ? handleClearFilters : undefined}
            titleOverride={draftFilter === 'drafts' && sortBy === 'draft' ? 'No draft entries available' : undefined}
            subtitleOverride={draftFilter === 'drafts' && sortBy === 'draft' ? 'You don\'t have any draft entries yet.' : undefined}
          />
        )}
      </div>
    </DashboardLayout>
  )
}