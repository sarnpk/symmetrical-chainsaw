'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertCircle, Clock, Target } from 'lucide-react'

interface PatternDashboardProps {
  incidents: any[]
}

export default function PatternDashboard({ incidents }: PatternDashboardProps) {
  if (incidents.length < 3) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-3" />
          <p className="text-blue-800">Log 3+ incidents to see pattern analysis</p>
        </CardContent>
      </Card>
    )
  }

  const shutdownTypes = incidents.reduce((acc, i) => {
    acc[i.shutdown_type] = (acc[i.shutdown_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const avgDuration = Math.round(
    incidents.filter(i => i.duration_minutes).reduce((sum, i) => sum + i.duration_minutes, 0) / 
    incidents.filter(i => i.duration_minutes).length
  ) || 0

  const avgImpact = (
    incidents.filter(i => i.impact_level).reduce((sum, i) => sum + i.impact_level, 0) / 
    incidents.filter(i => i.impact_level).length
  ).toFixed(1)

  const emotionalToll = incidents.filter(i => i.emotional_state_before && i.emotional_state_after)
    .reduce((sum, i) => sum + (i.emotional_state_before - i.emotional_state_after), 0) / 
    incidents.filter(i => i.emotional_state_before && i.emotional_state_after).length

  const topTriggers = incidents.map(i => i.trigger_context.toLowerCase())
    .join(' ')
    .split(' ')
    .filter(w => w.length > 4)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topTriggerWords = Object.entries(topTriggers)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const recentIncidents = incidents.slice(0, 5)
  const olderIncidents = incidents.slice(5, 10)
  const trend = recentIncidents.length > olderIncidents.length ? 'increasing' : 
                recentIncidents.length < olderIncidents.length ? 'decreasing' : 'stable'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Incidents</p>
                <p className="text-3xl font-bold text-purple-600">{incidents.length}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-blue-600">{avgDuration}m</p>
              </div>
              <Clock className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Impact</p>
                <p className="text-3xl font-bold text-red-600">{avgImpact}/10</p>
              </div>
              <Target className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trend</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{trend}</p>
              </div>
              {trend === 'increasing' ? (
                <TrendingUp className="h-10 w-10 text-red-400" />
              ) : trend === 'decreasing' ? (
                <TrendingDown className="h-10 w-10 text-green-400" />
              ) : (
                <div className="h-10 w-10 text-yellow-400">â”</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(shutdownTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(count / incidents.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Trigger Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topTriggerWords.map(([word, count]) => (
                <span 
                  key={word}
                  className="px-3 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  style={{ fontSize: `${Math.min(12 + count * 2, 20)}px` }}
                >
                  {word} ({count})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <p className="font-semibold text-purple-900">Emotional Toll</p>
              <p className="text-purple-700">
                Average emotional drop: {emotionalToll.toFixed(1)} points per incident
                {emotionalToll > 3 && ' - This is significant and concerning'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <p className="font-semibold text-purple-900">Pattern Recognition</p>
              <p className="text-purple-700">
                {trend === 'increasing' && 'Incidents are increasing - consider safety planning'}
                {trend === 'decreasing' && 'Positive trend - your strategies may be working'}
                {trend === 'stable' && 'Pattern is consistent - document for evidence'}
              </p>
            </div>
          </div>

          {avgDuration > 60 && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <p className="font-semibold text-red-900">Duration Warning</p>
                <p className="text-red-700">
                  Average duration over 1 hour indicates severe emotional abuse pattern
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
