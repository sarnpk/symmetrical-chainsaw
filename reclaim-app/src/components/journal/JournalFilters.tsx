'use client'

import { Search, Filter, SortDesc, SortAsc } from 'lucide-react'

interface JournalFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: 'date' | 'safety' | 'mood'
  onSortByChange: (sortBy: 'date' | 'safety' | 'mood') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  showFilters: boolean
  onToggleFilters: () => void
  filterSafety: number | null
  onFilterSafetyChange: (safety: number | null) => void
  onClearFilters: () => void
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
  onClearFilters
}: JournalFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
        
        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'safety' | 'mood')}
            className="px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm sm:text-base"
          >
            <option value="date">Sort by Date</option>
            <option value="safety">Sort by Safety</option>
            <option value="mood">Sort by Mood</option>
          </select>
          
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            aria-label={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
          </button>
          
          <button 
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 border rounded-lg transition-colors shadow-sm text-sm sm:text-base ${
              showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
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
                <option value="3">≤ 3 (High concern)</option>
                <option value="6">≤ 6 (Medium concern)</option>
                <option value="10">≤ 10 (All entries)</option>
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