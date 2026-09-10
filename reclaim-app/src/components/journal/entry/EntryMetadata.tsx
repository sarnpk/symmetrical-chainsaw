'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Edit } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface EntryMetadataProps {
  entry: JournalEntry
}

export default function EntryMetadata({ entry }: EntryMetadataProps) {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Created: {new Date(entry.created_at).toLocaleDateString()}</span>
          </div>
          {entry.updated_at !== entry.created_at && (
            <div className="flex items-center gap-1">
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Updated: {new Date(entry.updated_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}