'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

export default function ContradictionDetector({ statements }: { statements: any[] }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const runAnalysis = async () => {
    setAnalyzing(true)
    const response = await fetch('/api/gaslighting/analyze', { method: 'POST' })
    const data = await response.json()
    setAnalysis(data)
    setAnalyzing(false)
  }

  if (statements.length < 2) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-blue-400 mx-auto mb-3" />
          <p className="text-blue-800">Log 2+ statements to detect contradictions</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Contradiction Detector</span>
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              {analyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <p className="text-gray-600">Click "Run Analysis" to detect contradictions in their statements</p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{analysis.summary.total_contradictions}</div>
                  <div className="text-sm text-red-800">Contradictions Found</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{analysis.summary.credibility_score}%</div>
                  <div className="text-sm text-yellow-800">Credibility Score</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-purple-600 capitalize">{analysis.summary.pattern_severity}</div>
                  <div className="text-sm text-purple-800">Pattern Severity</div>
                </div>
              </div>

              {analysis.contradictions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Detected Contradictions</h3>
                  {analysis.contradictions.map((c: any, i: number) => (
                    <Card key={i} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                          <div className="flex-1">
                            <div className="font-semibold text-red-900 capitalize mb-1">
                              {c.contradiction_type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {c.days_apart} days apart ⬢ {Math.round(c.confidence * 100)}% confidence
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">
                              {new Date(c.statement_1.statement_date).toLocaleDateString()}
                            </div>
                            <div className="font-medium text-gray-900">"{c.statement_1.their_claim}"</div>
                          </div>

                          <div className="text-center text-red-600 font-bold">â†“ CONTRADICTS â†“</div>

                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">
                              {new Date(c.statement_2.statement_date).toLocaleDateString()}
                            </div>
                            <div className="font-medium text-gray-900">"{c.statement_2.their_claim}"</div>
                          </div>

                          <div className="bg-blue-50 p-3 rounded">
                            <div className="text-sm text-blue-900">{c.explanation}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
