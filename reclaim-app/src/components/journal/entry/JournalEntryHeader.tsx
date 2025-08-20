'use client'

import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MoreVertical } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface JournalEntryHeaderProps {
  entry: JournalEntry
  onDelete: () => void
}

export default function JournalEntryHeader({ entry, onDelete }: JournalEntryHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/journal"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600 hidden sm:inline">Back to Journal</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Title and Actions */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
            {entry.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {new Date(entry.incident_date).toLocaleDateString()} at{' '}
            {new Date(entry.incident_date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 ml-4">
          <Link
            href={`/journal/${entry.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="flex sm:hidden gap-3">
        <Link
          href={`/journal/${entry.id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          <Edit className="h-4 w-4" />
          Edit Entry
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden xs:inline">Delete</span>
        </button>
      </div>
    </div>
  )
}