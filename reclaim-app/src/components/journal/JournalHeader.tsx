'use client'

import Link from 'next/link'
import { BookOpen, Plus, List, Grid } from 'lucide-react'

interface JournalHeaderProps {
  entriesCount: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function JournalHeader({ entriesCount, viewMode, onViewModeChange }: JournalHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          Your Experiences
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {entriesCount} {entriesCount === 1 ? 'experience' : 'experiences'}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* New Entry Button - Prominent on mobile */}
        <Link 
          href="/journal/new"
          className="order-1 sm:order-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg font-medium"
        >
          <Plus className="h-5 w-5" />
          New Experience
        </Link>

        {/* View Toggle - Secondary on mobile */}
        <div className="order-2 sm:order-1 flex items-center justify-center sm:justify-start">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}