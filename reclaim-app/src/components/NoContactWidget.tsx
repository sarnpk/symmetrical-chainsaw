'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function NoContactWidget() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/no-contact-anchor/stats')
        if (res.ok) {
          const data = await res.json()
          console.log('No Contact Stats:', data)
          setStats(data)
        }
      } catch (error) {
        console.error('Error loading no contact stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return null
  if (!stats || !stats.daysNoContact || stats.daysNoContact <= 0) return null

  return (
    <Link href="/no-contact-anchor" className="block">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            No Contact Streak
          </h3>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{stats.daysNoContact}</div>
          <div className="text-lg opacity-90">Days Strong ðŸ›¡ï¸</div>
          {stats.totalUrgesLogged > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm opacity-90">
              <TrendingDown className="h-4 w-4" />
              <span>{stats.totalUrgesLogged} urges resisted</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
