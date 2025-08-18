'use client'

import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  AlertTriangle,
  Clock,
  Download
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Analysis {
  totalEntries: number
  abuseTypeFrequency: Record<string, number>
  safetyRatingTrends: Record<string | number, number>
  timePatterns: Record<string, number>
}

export default function PatternsContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedView, setSelectedView] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [insights, setInsights] = useState<string>('')
  const [generatedAt, setGeneratedAt] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setLoading(false)
          toast.error('Please sign in to view patterns')
          return
        }

        // Invoke Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('analyze-patterns', {
          method: 'POST',
          body: { timeframe: selectedTimeframe }
        })

        if (error) throw error
        if (data) {
          setAnalysis(data.analysis)
          setInsights(data.insights)
          setGeneratedAt(data.generatedAt)
        }
      } catch (err: any) {
        console.error('Pattern analysis error:', err)
        toast.error(err.message || 'Failed to load pattern analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeframe])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            Pattern Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify patterns in your experiences to better understand and prepare for situations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => {
              if (!analysis) return
              const blob = new Blob([JSON.stringify({ analysis, insights, generatedAt }, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `patterns-analysis-${new Date().toISOString()}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
            disabled={!analysis}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
        {['overview', 'detailed'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === view
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view === 'overview' ? 'Overview' : 'Detailed Analysis'}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600">
          Loading pattern analysis...
        </div>
      )}

      {!loading && !analysis && (
        <div className="bg-white rounded-lg border border-yellow-200 p-6 text-yellow-800">
          Unable to load analysis. Try again later.
        </div>
      )}

      {!loading && analysis && (selectedView === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequency Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Incident Frequency</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="text-gray-700">
                Total incidents analyzed: <span className="font-semibold">{analysis.totalEntries}</span>
              </div>
              {generatedAt && (
                <div className="text-xs text-gray-500">Generated at {new Date(generatedAt).toLocaleString()}</div>
              )}
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Charts can be added here (e.g., by month)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Behavior Types</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {Object.entries(analysis.abuseTypeFrequency)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const percentage = analysis.totalEntries ? Math.round((count / analysis.totalEntries) * 100) : 0
                  return (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTrendIcon('stable')}
                          <span className="font-medium text-gray-900">{type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{count} incidents</span>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Time Patterns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Time Patterns</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {(() => {
                const total = Object.values(analysis.timePatterns).reduce((a, b) => a + b, 0)
                return Object.entries(analysis.timePatterns)
                  .sort((a, b) => b[1] - a[1])
                  .map(([day, count]) => {
                    const pct = total ? Math.round((count / total) * 100) : 0
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-gray-700">{day}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{pct}%</span>
                        </div>
                      </div>
                    )
                  })
              })()}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              <AlertTriangle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">{insights || 'No insights available.'}</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
              <ul className="space-y-2 text-gray-600">
                {analysis && analysis.totalEntries > 0 ? (
                  <>
                    <li>• Total incidents analyzed: {analysis.totalEntries}</li>
                    <li>• Top behavior types: {Object.entries(analysis.abuseTypeFrequency).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t,c])=>`${t} (${c})`).join(', ') || 'N/A'}</li>
                    <li>• Peak days: {Object.entries(analysis.timePatterns).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([d])=>d).join(', ') || 'N/A'}</li>
                    <li>• See AI-generated insights below.</li>
                  </>
                ) : (
                  <li>No data available.</li>
                )}
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
              <p className="text-gray-600 whitespace-pre-line">{insights || 'No insights available.'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

