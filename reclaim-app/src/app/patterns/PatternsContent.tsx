'use client'

import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  AlertTriangle,
  Clock,
  Download,
  Lock
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { exportPatternsPdf } from '@/lib/exportPatternsPdf'
import toast from 'react-hot-toast'

interface Analysis {
  totalEntries: number
  abuseTypeFrequency: Record<string, number>
  safetyRatingTrends: Record<string | number, number>
  timePatterns: Record<string, number>
  monthlyCounts?: Record<string, number>
}

interface EvidenceRef {
  entry_id: string
  incident_date: string
  matched_signals: string[]
  snippet: string
}

interface RiskAssessment {
  risk_label: 'low' | 'moderate' | 'high'
  score: number
  binary_summary: 'abusive_patterns_likely' | 'insufficient_evidence'
  top_reasons: { reason: string; weight: number }[]
  evidence_refs: EvidenceRef[]
  timeframe: { start: string; end: string }
  model: string
  disclaimer_version: string
}

export default function PatternsContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedView, setSelectedView] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [insights, setInsights] = useState<string>('')
  const [insightsError, setInsightsError] = useState<string>('')
  const [generatedAt, setGeneratedAt] = useState<string>('')
  const [risk, setRisk] = useState<RiskAssessment | null>(null)
  const supabase = createClient()

  const [gated, setGated] = useState<boolean>(false)
  const [gatedFeatures, setGatedFeatures] = useState<string[]>([])
  const [subscriptionTier, setSubscriptionTier] = useState<string>('foundation')
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false)
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null)

  const handleExportPdf = () => {
    if (!analysis) {
      toast.error('Run analysis first')
      return
    }
    if (subscriptionTier === 'foundation') {
      toast((t) => (
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5" />
          <div>
            <div className="font-medium">PDF export is premium</div>
            <div className="text-sm">Upgrade to download a professional PDF report. <a href="/pricing" className="underline">See plans</a>.</div>
          </div>
        </div>
      ))
      return
    }
    const timeframeLabelMap: Record<string,string> = {
      '30days': 'Last 30 days',
      '3months': 'Last 3 months',
      '6months': 'Last 6 months',
      '12months': 'Last 12 months',
    }
    const timeframeLabel = timeframeLabelMap[selectedTimeframe] || selectedTimeframe
    exportPatternsPdf({
      analysis,
      risk,
      insights,
      timeframeLabel,
      generatedAt,
      reportId: savedAnalysisId || undefined,
      modelVersion: risk?.model || undefined,
    })
  }

  // Lightweight Markdown renderer (headings, bullet lists, bold, italics) — component scope
  const escapeHtml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // Inline formatter: converts **bold** and *italic* or _italic_ while keeping HTML safe
  const renderInline = (raw: string) => {
    if (!raw) return ''
    let s = String(raw)
    // Mark placeholders before escaping
    s = s.replace(/\*\*(.+?)\*\*/g, (_m, t) => `::STRONG_OPEN::${t}::STRONG_CLOSE::`)
    // underline italics _text_
    s = s.replace(/(^|\s)_(.+?)_(?=\s|$|[.,!?:;])/g, (_m, pre, t) => `${pre}::EM_OPEN::${t}::EM_CLOSE::`)
    // asterisk italics *text*
    s = s.replace(/(^|\s)\*(.+?)\*(?=\s|$|[.,!?:;])/g, (_m, pre, t) => `${pre}::EM_OPEN::${t}::EM_CLOSE::`)
    // Escape all HTML
    s = escapeHtml(s)
    // Restore placeholders as tags
    s = s
      .replace(/::STRONG_OPEN::/g, '<strong>')
      .replace(/::STRONG_CLOSE::/g, '</strong>')
      .replace(/::EM_OPEN::/g, '<em>')
      .replace(/::EM_CLOSE::/g, '</em>')
    return s
  }

  const renderLiteMarkdown = (md: string) => {
    if (!md) return null
    const lines = md.split(/\r?\n/)
    const nodes: JSX.Element[] = []
    let inList = false
    let listItems: string[] = []

    const flushList = () => {
      if (inList) {
        nodes.push(
          <ul className="list-disc pl-5 space-y-1" key={`ul-${nodes.length}`}>
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: renderInline(item.trim()) }} />
            ))}
          </ul>
        )
        inList = false
        listItems = []
      }
    }

    lines.forEach((raw, i) => {
      const line = raw.trimEnd()
      if (/^\s*[-*]\s+/.test(line)) {
        inList = true
        listItems.push(line.replace(/^\s*[-*]\s+/, ''))
        return
      }
      if (inList && line === '') {
        flushList()
        return
      }
      if (/^#{1,4}\s+/.test(line)) {
        flushList()
        const level = (line.match(/^#{1,4}/)![0].length)
        const text = line.replace(/^#{1,4}\s+/, '')
        const Tag = (`h${Math.min(4, level+2)}` as any)
        nodes.push(<Tag className="font-semibold mt-2" key={`h-${i}`} dangerouslySetInnerHTML={{ __html: renderInline(text) }} />)
        return
      }
      if (line.trim().length === 0) {
        flushList()
        nodes.push(<div className="h-2" key={`sp-${i}`} />)
        return
      }
      flushList()
      nodes.push(<p className="whitespace-pre-wrap" key={`p-${i}`} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />)
    })
    flushList()
    return <div className="prose prose-sm max-w-none">{nodes}</div>
  }

  // Small presentational badge for risk label
  const RiskBadge = ({ label }: { label?: 'low' | 'moderate' | 'high' | string }) => {
    const map: Record<string, { text: string; cls: string }> = {
      low: { text: 'Low Risk', cls: 'bg-green-100 text-green-800 border-green-200' },
      moderate: { text: 'Moderate Risk', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
      high: { text: 'High Risk', cls: 'bg-red-100 text-red-800 border-red-200' }
    }

    const fallback = { text: 'Risk', cls: 'bg-gray-100 text-gray-700 border-gray-200' }
    const item = (label && map[String(label).toLowerCase()]) || fallback
    return <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${item.cls}`}>{item.text}</span>
  }

  // Full analysis (Risk + Insights) for Analyze button
  const fetchAnalysis = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please sign in to view patterns')
        return
      }
      const { data, error } = await supabase.functions.invoke('analyze-patterns', {
        method: 'POST',
        body: { timeframe: selectedTimeframe, skip_risk: false, skip_insights: false }
      })
      if (error) throw error
      if (data) {
        setAnalysis(data.analysis)
        setInsights(data.insights)
        setInsightsError(data.insights_error || '')
        setGeneratedAt(data.generatedAt)
        setRisk(data.risk_assessment || null)
        setGated(Boolean(data.gated))
        setGatedFeatures(Array.isArray(data.gated_features) ? data.gated_features : [])
        setSubscriptionTier(data.subscription_tier || 'foundation')
        setSavedAnalysisId(data.savedAnalysisId || null)
        setHasAnalyzed(true)
      }
    } catch (err: any) {
      console.error('Pattern analysis error:', err)
      toast.error(err.message || 'Failed to load pattern analysis')
    } finally {
      setLoading(false)
    }
  }

  // Lightweight preview on mount and timeframe change (no risk/insights)
  const fetchAnalysisLight = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please sign in to view patterns')
        return
      }
      const { data, error } = await supabase.functions.invoke('analyze-patterns', {
        method: 'POST',
        body: { timeframe: selectedTimeframe, skip_risk: true, skip_insights: true }
      })
      if (error) throw error
      if (data) {
        setAnalysis(data.analysis)
        setInsights(data.insights || '')
        setInsightsError(data.insights_error || '')
        setGeneratedAt(data.generatedAt)
        setRisk(null) // preview mode: no risk
        setGated(Boolean(data.gated))
        setGatedFeatures(Array.isArray(data.gated_features) ? data.gated_features : [])
        setSubscriptionTier(data.subscription_tier || 'foundation')
        setSavedAnalysisId(data.savedAnalysisId || null)
        setHasAnalyzed(false)
      }
    } catch (err: any) {
      console.error('Pattern analysis preview error:', err)
      toast.error(err.message || 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysisLight()
  }, [])

  useEffect(() => {
    fetchAnalysisLight()
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            Pattern Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify patterns in your experiences to better understand and prepare for situations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => {
              setLoading(true)
              fetchAnalysis()
            }}
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
            disabled={loading}
            title="Analyze patterns for the selected timeframe"
          >
            <TrendingUp className="w-4 h-4" />
            Analyze
          </button>
          <button
            onClick={handleExportPdf}
            disabled={!hasAnalyzed || !analysis}
            title={!hasAnalyzed ? 'Run Analyze first to enable export' : undefined}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex w-full md:inline-flex overflow-x-auto">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-700 flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">No analysis yet</div>
            <div className="text-sm text-gray-600">Click Analyze to compute Risk Indicator and AI Insights. Charts and counts load automatically.</div>
          </div>
          <button
            onClick={() => { setLoading(true); fetchAnalysis() }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> Analyze
          </button>
        </div>
      )}

      {!loading && analysis && (
        <>
          {hasAnalyzed && (
            <div className="bg-gradient-to-tr from-white to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Risk Indicator</h3>
                </div>
                {risk && <RiskBadge label={risk.risk_label} />}
              </div>
              {gated ? (
                <div className="mb-3 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800 flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="font-medium">Premium feature</div>
                    <div className="text-indigo-900/80">Upgrade to access Risk Indicator and AI Insights. <a href="/pricing" className="underline">See plans</a>.</div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-700 mb-3">
                    {risk?.binary_summary === 'abusive_patterns_likely' ? 'Abusive patterns likely based on your entries.' : 'Insufficient evidence of abusive patterns.'}
                    {risk && <span className="ml-2 text-gray-500">Score: {risk.score}/20</span>}
                  </p>
                  {risk && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Why we think this</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          {risk.top_reasons?.slice(0,3).map((r, i) => (
                            <li key={i}>{r.reason} <span className="text-gray-500">(weight {r.weight})</span></li>
                          ))}
                        </ul>
                      </div>
                      {risk.evidence_refs?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Related entries</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-700">
                            {risk.evidence_refs.slice(0,5).map((e) => (
                              <li key={e.entry_id} className="truncate">
                                <a className="text-indigo-600 hover:underline" href={`/journal/${e.entry_id}`}>{new Date(e.incident_date).toLocaleDateString()} · {e.matched_signals.join(', ') || 'signals'}</a>
                                <div className="text-gray-500 line-clamp-2">{e.snippet}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">This indicator is informational and not a diagnosis. If you feel unsafe, contact local emergency services. US: 911, 988; text HOME to 741741.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        {selectedView === 'overview' ? (
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
                {analysis.monthlyCounts && Object.keys(analysis.monthlyCounts).length > 0 ? (
                  <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end gap-3 overflow-x-auto">
                    {Object.entries(analysis.monthlyCounts)
                      .sort((a,b)=> a[0].localeCompare(b[0]))
                      .map(([month,count]) => {
                        const max = Math.max(...Object.values(analysis.monthlyCounts!)) || 1
                        const h = Math.round((count as number / max) * 100)
                        return (
                          <div key={month} className="flex flex-col items-end w-10 h-full">
                            <div className="relative w-8 bg-indigo-500/80 rounded-t" style={{ height: `${h}%` }} title={`${month}: ${count}`}>
                              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 select-none">{count as number}</span>
                            </div>
                            <div className="text-[10px] text-gray-600 mt-1 whitespace-nowrap">{month}</div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No monthly data available.</p>
                    </div>
                  </div>
                )}
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
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .map(([type, count]) => {
                    const percentage = analysis.totalEntries ? Math.round(((count as number) / analysis.totalEntries) * 100) : 0
                    return (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getTrendIcon('stable')}
                            <span className="font-medium text-gray-900">{type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{count as number} incidents</span>
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
                  const total = Object.values(analysis.timePatterns).reduce((a, b) => (a as number) + (b as number), 0 as number)
                  return Object.entries(analysis.timePatterns)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([day, count]) => {
                      const pct = total ? Math.round(((count as number) / total) * 100) : 0
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

            {/* AI Insights - only after Analyze */}
            {hasAnalyzed && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                </div>
                {gated ? (
                  <div className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800 flex items-start gap-2">
                    <Lock className="w-4 h-4 mt-0.5" />
                    <div>
                      <div className="font-medium">Premium feature</div>
                      <div className="text-indigo-900/80">Upgrade to view AI Insights. <a href="/pricing" className="underline">See plans</a>.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insightsError && (
                      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium">AI Insights unavailable</div>
                          <div className="text-amber-900/80 break-words">{insightsError}</div>
                        </div>
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {insights ? renderLiteMarkdown(insights) : <span>No insights available.</span>}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                      <li>• Top behavior types: {Object.entries(analysis.abuseTypeFrequency).sort((a,b)=> (b[1] as number)-(a[1] as number)).slice(0,3).map(([t,c])=>`${t} (${c as number})`).join(', ') || 'N/A'}</li>
                      <li>• Peak days: {Object.entries(analysis.timePatterns).sort((a,b)=> (b[1] as number)-(a[1] as number)).slice(0,2).map(([d])=>d).join(', ') || 'N/A'}</li>
                      <li>• See AI-generated insights below.</li>
                    </>
                  ) : (
                    <li>No data available.</li>
                  )}
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
                {insightsError && (
                  <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <div>
                      <div className="font-medium">AI Insights unavailable</div>
                      <div className="text-amber-900/80 break-words">{insightsError}</div>
                    </div>
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-gray-700">
                  {insights ? renderLiteMarkdown(insights) : <span>No insights available.</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>
)
}
