'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NarcissistDetectorWidget() {
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecentAnalyses()
  }, [])

  const loadRecentAnalyses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('narcissist_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentAnalyses(data || [])
    } catch (error) {
      console.error('Error loading analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Narcissist Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recentAnalyses.length === 0) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Narcissist Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-4">
            Identify narcissist types and manipulation tactics from text, behavior, or conversations
          </p>
          <Link href="/narcissist-detector">
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              Analyze Now
            </button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const latestAnalysis = recentAnalyses[0]

  return (
    <Card className="border-red-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Narcissist Detector
          </CardTitle>
          <Link href="/narcissist-detector" className="text-xs text-red-600 hover:text-red-700 font-medium">
            View All â†’
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Analysis */}
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-semibold text-red-900">{latestAnalysis.primary_type}</div>
              <div className="text-xs text-red-600">
                {Math.round(latestAnalysis.primary_confidence)}% confidence
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className={`px-2 py-1 rounded-full ${
                latestAnalysis.severity_score >= 7 ? 'bg-red-200 text-red-800' :
                latestAnalysis.severity_score >= 4 ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                Severity: {latestAnalysis.severity_score}/10
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">
            {latestAnalysis.input_text}
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(latestAnalysis.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{recentAnalyses.length}</div>
            <div className="text-xs text-gray-600">Analyses</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
              <TrendingUp className="h-4 w-4" />
              {Math.round(recentAnalyses.reduce((sum, a) => sum + a.severity_score, 0) / recentAnalyses.length)}
            </div>
            <div className="text-xs text-gray-600">Avg Severity</div>
          </div>
        </div>

        {/* CTA */}
        <Link href="/narcissist-detector">
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2">
            <Eye className="h-4 w-4" />
            New Analysis
          </button>
        </Link>
      </CardContent>
    </Card>
  )
}
