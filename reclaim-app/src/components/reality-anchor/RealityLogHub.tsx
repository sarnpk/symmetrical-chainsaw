'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface RealityLogEntry {
  id: string
  date: string
  event: string
  fact: string
  npd_trait: string
  is_consistent: boolean
  pattern_note: string
  created_at: string
}

interface RealityLogHubProps {
  user: User
}

export default function RealityLogHub({ user }: RealityLogHubProps) {
  const [entries, setEntries] = useState<RealityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('reality_log_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        if (error) {
          console.error('Error loading entries:', error)
        } else {
          setEntries(data || [])
        }
      } catch (error) {
        console.error('Error loading entries:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user.id, supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return

    try {
      const { error } = await supabase
        .from('reality_log_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (!error) {
        setEntries(entries.filter((e) => e.id !== id))
      } else {
        console.error('Error deleting entry:', error)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const thisWeekEntries = entries.filter((e) => {
    const entryDate = new Date(e.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  })

  const traitCounts = entries.reduce(
    (acc, e) => {
      acc[e.npd_trait] = (acc[e.npd_trait] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topTrait = Object.entries(traitCounts).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Reality Anchor</h1>
          <button
            onClick={() => window.open('/docs/REALITY_ANCHOR_USER_GUIDE.html', '_blank')}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Reality Anchor User Guide"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
        <Link
          href="/reality-log/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </Link>
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-indigo-600">{thisWeekEntries.length} entries</p>
              </div>
              {topTrait && (
                <div>
                  <p className="text-sm text-gray-600">Top Trait</p>
                  <p className="text-lg font-bold text-purple-600">
                    {topTrait[0]} ({topTrait[1]}x)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No entries yet</p>
            <Link
              href="/reality-log/new"
              className="text-indigo-600 hover:underline font-medium"
            >
              Create your first entry
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/reality-log/${entry.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="font-semibold text-gray-900 mt-1">{entry.event}</div>
                      <div className="text-gray-700 mt-2 text-sm">{entry.fact}</div>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                          {entry.npd_trait}
                        </span>
                        {entry.is_consistent && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ✓ Consistent
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/reality-log/${entry.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(entry.id)
                        }}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
