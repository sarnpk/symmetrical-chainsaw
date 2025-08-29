'use client'

import { Search, Filter, SortDesc, SortAsc } from 'lucide-react'

interface JournalFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: 'date' | 'draft' | 'mood'
  onSortByChange: (sortBy: 'date' | 'draft' | 'mood') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  showFilters: boolean
  onToggleFilters: () => void
  filterSafety: number | null
  onFilterSafetyChange: (safety: number | null) => void
  onClearFilters: () => void
  draftFilter: 'all' | 'published' | 'drafts'
  onDraftFilterChange: (val: 'all' | 'published' | 'drafts') => void
}

export default function JournalFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showFilters,
  onToggleFilters,
  filterSafety,
  onFilterSafetyChange,
  onClearFilters,
  draftFilter,
  onDraftFilterChange
}: JournalFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        {/* Search Input (input-with-icon pattern) */}
        <div className="flex-1">
          <label htmlFor="journal-search" className="sr-only">Search entries</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              id="journal-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile: select */}
          <div className="sm:hidden">
            <label htmlFor="journal-sort" className="sr-only">Sort by</label>
            <select
              id="journal-sort"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'date' | 'draft' | 'mood')}
              className="px-3 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="draft">Sort by Draft</option>
              <option value="mood">Sort by Mood</option>
            </select>
          </div>

          {/* Desktop: segmented control */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {([
              { id: 'date', label: 'Date' },
              { id: 'draft', label: 'Draft' },
              { id: 'mood', label: 'Mood' },
            ] as const).map(opt => (
              <button
                key={opt.id}
                onClick={() => onSortByChange(opt.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  sortBy === opt.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-pressed={sortBy === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            aria-label={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
            title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
          </button>

          {/* Filters toggle */}
          <button 
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 border rounded-lg transition-colors shadow-sm text-sm ${
              showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Safety Level (show ≤)
              </label>
              <select
                value={filterSafety || ''}
                onChange={(e) => onFilterSafetyChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All levels</option>
                <option value="2">≤ 2 (High concern)</option>
                <option value="3">≤ 3 (Medium)</option>
                <option value="5">≤ 5 (All entries)</option>
              </select>
            </div>

            {/* Draft Status filter */}
            <div className="sm:min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Draft Status
              </label>
              <select
                value={draftFilter}
                onChange={(e) => onDraftFilterChange(e.target.value as 'all' | 'published' | 'drafts')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All</option>
                <option value="published">Published only</option>
                <option value="drafts">Drafts only</option>
              </select>
            </div>

            {(searchTerm || filterSafety) && (
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}