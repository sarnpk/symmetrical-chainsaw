'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function StonewallWidget() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stonewalling/stats')
        if (!response.ok) {
          setStats(null)
          setLoading(false)
          return
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Stats error:', error)
        setStats(null)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) return null

  if (!stats?.total_incidents) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-purple-800">Stonewalling Tracker</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-purple-700 mb-4">
            Track and understand stonewalling patterns to protect your wellbeing
          </p>
          <Link href="/stonewalling/log">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
              Log First Incident
            </button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const trend = stats.escalation_trend || 'stable'
  const TrendIcon = trend === 'improving' ? TrendingDown : trend === 'worsening' ? TrendingUp : Shield

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-purple-800">Stonewalling Tracker</CardTitle>
          </div>
          <Link href="/stonewalling" className="text-purple-600 text-sm font-medium hover:text-purple-700">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{stats.total_incidents}</div>
            <div className="text-sm text-purple-600">Total Incidents</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{stats.avg_duration || 0}m</div>
            <div className="text-sm text-purple-600">Avg Duration</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendIcon className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900 capitalize">{trend}</span>
          </div>
          <p className="text-sm text-purple-700">
            Most common: {stats.most_common_type?.replace('_', ' ') || 'N/A'}
          </p>
        </div>

        <Link href="/stonewalling/log">
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">
            Log New Incident
          </button>
        </Link>
      </CardContent>
    </Card>
  )
}
