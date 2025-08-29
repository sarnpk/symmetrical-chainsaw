'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Shield, Eye, Edit, MoreVertical } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface JournalEntryCardProps {
  entry: JournalEntry
  viewMode: 'grid' | 'list'
}

export default function JournalEntryCard({ entry, viewMode }: JournalEntryCardProps) {
  const safetyRating = entry.safety_rating || entry.ai_analysis?.safety_level || 5
  const moodRating = typeof entry.mood_rating === 'number' ? entry.mood_rating : null
  const entryDate = entry.incident_date || entry.created_at
  const behaviorTypes = entry.abuse_types || entry.pattern_flags || []

  const getSafetyColor = (rating: number) => {
    if (rating <= 2) return 'bg-red-100 text-red-800 border-red-200'
    if (rating === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

  if (viewMode === 'grid') {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-base sm:text-lg line-clamp-2 flex-1 mr-2">{entry.title}</CardTitle>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded" aria-label="More options">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">{new Date(entryDate).toLocaleDateString()}</span>
              <span className="sm:hidden">{new Date(entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSafetyColor(safetyRating)}`}>
                <Shield className="h-3 w-3 inline mr-1" />
                {safetyRating}/5
              </div>
              {moodRating !== null && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-lg">{getMoodEmoji(moodRating)}</span>
                  <span className="text-gray-600 hidden sm:inline">{moodRating}/10</span>
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
                  <span className="hidden sm:inline">{entry.ai_analysis.location}</span>
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
    )
  }

  // List View
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-500">
      <CardContent className="p-4 sm:pt-6 sm:pb-6 sm:pl-6 sm:pr-4">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 pr-2">{entry.title}</h3>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link 
                href={`/journal/${entry.id}/edit`}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit entry"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <Link 
                href={`/journal/${entry.id}`}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 flex-wrap">
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
                <span className="truncate max-w-[120px] sm:max-w-none">{entry.ai_analysis.location}</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 line-clamp-2 mb-4">
          {entry.description || entry.content}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getSafetyColor(safetyRating)}`}>
              <Shield className="h-3 sm:h-4 w-3 sm:w-4 inline mr-1" />
              <span className="hidden sm:inline">Safety: </span>{safetyRating}/5
            </div>
            {moodRating !== null && (
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-base sm:text-lg">{getMoodEmoji(moodRating)}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  <span className="hidden sm:inline">Mood: </span>{moodRating}/10
                </span>
              </div>
            )}
            {entry.is_evidence && (
              <div className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                Evidence
              </div>
            )}
          </div>
        </div>

        {/* Behavior Types Tags */}
        {behaviorTypes && behaviorTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
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
}