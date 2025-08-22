'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Edit, Trash2, MoreVertical, Download } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface JournalEntryHeaderProps {
  entry: JournalEntry
  onDelete: () => void
}

export default function JournalEntryHeader({ entry, onDelete }: JournalEntryHeaderProps) {
  const [showExport, setShowExport] = useState(false)
  const [format, setFormat] = useState<'md' | 'pdf'>('md')
  const [redact, setRedact] = useState<boolean>(false)
  const [downloading, setDownloading] = useState(false)
  const [includeLinks, setIncludeLinks] = useState<boolean>(true)

  const handleExport = async () => {
    try {
      setDownloading(true)
      const url = `/api/journal/${entry.id}/export?format=${format}&redact=${redact}&includeLinks=${includeLinks}`
      const res = await fetch(url)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Export failed (${res.status})`)
      }
      const blob = await res.blob()
      const ext = format === 'pdf' ? 'pdf' : 'md'
      const fileName = `${entry.title?.replace(/[^a-z0-9-_]+/gi, '_') || 'journal-entry'}_${entry.id}.${ext}`
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      setShowExport(false)
    } catch (e: any) {
      alert(e.message || 'Export failed')
    } finally {
      setDownloading(false)
    }
  }

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
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
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
        <button
          onClick={() => setShowExport(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
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

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowExport(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Export Entry</h3>
              <button onClick={() => setShowExport(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat('md')}
                    className={`px-3 py-2 rounded-lg text-sm border ${format==='md' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >Markdown (.md)</button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`px-3 py-2 rounded-lg text-sm border ${format==='pdf' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >PDF (.pdf)</button>
                </div>
                <p className="mt-1 text-xs text-gray-500">PDF is available for paid tiers. Markdown is available to all users.</p>
              </div>
              <div className="flex items-center gap-2">
                <input id="redact" type="checkbox" checked={redact} onChange={(e) => setRedact(e.target.checked)} className="h-4 w-4" />
                <label htmlFor="redact" className="text-sm text-gray-700">Redact sensitive content</label>
              </div>
              {format === 'pdf' && (
                <div className="flex items-center gap-2">
                  <input id="includeLinks" type="checkbox" checked={includeLinks} onChange={(e) => setIncludeLinks(e.target.checked)} className="h-4 w-4" />
                  <label htmlFor="includeLinks" className="text-sm text-gray-700">Include clickable links to audio files</label>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowExport(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300">Cancel</button>
                <button onClick={handleExport} disabled={downloading} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                  {downloading ? 'Preparing…' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}