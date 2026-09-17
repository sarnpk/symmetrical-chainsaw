'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Plus, Edit, Trash2, HelpCircle, Sunrise, FileText, Wind, Moon, Clock } from 'lucide-react'
import { User } from '@supabase/supabase-js'

const routineSteps = [
  {
    step: 1,
    name: 'Morning Intention',
    duration: '5-10 min',
    when: 'First thing in the morning',
    purpose: 'Set your emotional boundaries for the day and anchor to your values',
    href: '/morning-intention',
    icon: Sunrise,
    color: 'blue',
  },
  {
    step: 2,
    name: 'Reality Log',
    duration: '2-3 min',
    when: 'After each incident',
    purpose: 'Record facts and patterns that can\u2019t be distorted or denied',
    href: '/reality-log',
    icon: FileText,
    color: 'green',
    current: true,
  },
  {
    step: 3,
    name: 'Mental Pause',
    duration: '2-3 min',
    when: 'Before difficult interactions',
    purpose: 'Reset your nervous system and reconnect with reality',
    href: '/mental-pause',
    icon: Wind,
    color: 'purple',
  },
  {
    step: 4,
    name: 'Decompression Ritual',
    duration: '15-30 min',
    when: 'End of day',
    purpose: 'Release absorbed negativity and reinforce your sense of self',
    href: '/decompression',
    icon: Moon,
    color: 'indigo',
  },
]

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

      {/* Daily Routine Hub */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Daily Routine</h2>
        <p className="text-gray-600 text-sm mb-4">
          The 5-step Reality Anchor method to stay grounded against gaslighting and manipulation
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {routineSteps.map((tool) => {
            const Icon = tool.icon
            const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
              blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
              green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
              purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
              amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
              indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
            }
            const colors = colorClasses[tool.color] || colorClasses.blue
            return (
              <Link
                key={tool.step}
                href={tool.href}
                className={`group relative block p-4 rounded-xl border transition-all hover:shadow-md ${
                  tool.current
                    ? `border-2 ${colors.border} ${colors.bg}`
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                {tool.current && (
                  <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    Current
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-xs text-gray-400">Step {tool.step}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {tool.duration}
                  <span className="text-gray-300">|</span>
                  {tool.when}
                </div>
                <p className="text-sm text-gray-600">{tool.purpose}</p>
              </Link>
            )
          })}
        </div>
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
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium inline-flex items-center gap-1">
                            <Check className="h-3 w-3" /> Consistent
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
