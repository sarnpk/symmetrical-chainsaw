'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Search, BookOpen, Plus } from 'lucide-react'

interface JournalEmptyStatesProps {
  type: 'no-entries' | 'no-results'
  onClearFilters?: () => void
}

export default function JournalEmptyStates({ type, onClearFilters }: JournalEmptyStatesProps) {
  if (type === 'no-results') {
    return (
      <Card className="text-center py-8 sm:py-12">
        <CardContent>
          <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No entries match your search
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
            Try adjusting your search terms or filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base"
            >
              Clear all filters
            </button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="text-center py-8 sm:py-12">
      <CardContent>
        <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          No journal entries yet
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
          Start documenting your experiences to track patterns and progress.
        </p>
        <Link 
          href="/journal/new"
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 text-sm sm:text-base font-medium"
        >
          <Plus className="h-4 w-4" />
          Create your first entry
        </Link>
      </CardContent>
    </Card>
  )
}