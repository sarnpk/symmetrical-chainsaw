'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface BeliefReframeWidgetProps {
  userId: string
}

interface Belief {
  id: string
  belief_text: string
  current_strength: number
  initial_strength: number
  counter_evidence: any[]
}

export default function BeliefReframeWidget({ userId }: BeliefReframeWidgetProps) {
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBeliefs = async () => {
      const response = await fetch('/api/belief-reframe')
      const data = await response.json()
      const activeBeliefs = (data.beliefs || []).filter((b: any) => b.status === 'active').slice(0, 2)
      setBeliefs(activeBeliefs)
      setLoading(false)
    }
    loadBeliefs()
  }, [userId])

  if (loading) return null

  if (beliefs.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">Belief Reframe Journey</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Start challenging false beliefs from abuse using CBT techniques
          </p>
          <Link href="/belief-reframe/new">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
              Begin Journey
            </button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">Belief Reframe Journey</CardTitle>
          </div>
          <Link href="/belief-reframe" className="text-green-600 text-sm font-medium hover:text-green-700">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {beliefs.map((belief) => {
          const strengthChange = belief.initial_strength - belief.current_strength
          const progressPercent = ((belief.initial_strength - belief.current_strength) / belief.initial_strength) * 100
          const evidenceCount = belief.counter_evidence?.length || 0

          return (
            <div key={belief.id} className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-green-900 flex-1">{belief.belief_text}</h3>
                <Link href={`/belief-reframe/${belief.id}`} className="text-green-600 text-sm font-medium hover:text-green-700">
                  View
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                <span>{belief.current_strength}/10</span>
                {strengthChange > 0 && (
                  <>
                    <TrendingDown className="h-3 w-3" />
                    <span>â†“ {strengthChange}</span>
                  </>
                )}
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.max(progressPercent, 5)}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600">{evidenceCount} pieces of counter-evidence</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
