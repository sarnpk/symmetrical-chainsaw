'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  Clock,
  Target,
  Shield,
  Brain,
  Zap
} from 'lucide-react'

interface EscalationPattern {
  id: string
  pattern_name: string
  trigger_events: string[]
  warning_signs: string[]
  last_detected: string
  confidence_score: number
}

interface TriggerEvent {
  id: string
  trigger_name: string
  risk_level: string
  date_pattern: string
  time_pattern: string
  coping_strategies: string[]
}

interface PatternDetection {
  id: string
  detection_type: string
  pattern_data: any
  confidence_score: number
  risk_level: string
  recommendations: string[]
  created_at: string
}

interface PatternRecognitionProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function PatternRecognition({ userId, subscriptionTier }: PatternRecognitionProps) {
  const [escalationPatterns, setEscalationPatterns] = useState<EscalationPattern[]>([])
  const [triggerEvents, setTriggerEvents] = useState<TriggerEvent[]>([])
  const [recentDetections, setRecentDetections] = useState<PatternDetection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAlerts, setActiveAlerts] = useState(0)

  const supabase = createClient()
  const hasAccess = subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'

  useEffect(() => {
    if (hasAccess) {
      loadPatternData()
    }
    setLoading(false)
  }, [userId, hasAccess])

  const loadPatternData = async () => {
    try {
      // Load escalation patterns
      const { data: patternsData } = await supabase
        .from('escalation_patterns')
        .select('*')
        .eq('user_id', userId)
        .order('confidence_score', { ascending: false })

      // Load trigger calendar
      const { data: triggersData } = await supabase
        .from('trigger_calendar')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('risk_level', { ascending: false })

      // Load recent pattern detections
      const { data: detectionsData } = await supabase
        .from('pattern_detections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(5)

      setEscalationPatterns(patternsData || [])
      setTriggerEvents(triggersData || [])
      setRecentDetections(detectionsData || [])
      setActiveAlerts(detectionsData?.length || 0)
    } catch (error) {
      console.error('Failed to load pattern data:', error)
    }
  }

  const acknowledgeDetection = async (detectionId: string) => {
    try {
      await supabase
        .from('pattern_detections')
        .update({ is_acknowledged: true })
        .eq('id', detectionId)

      loadPatternData()
    } catch (error) {
      console.error('Failed to acknowledge detection:', error)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getUpcomingTriggers = () => {
    const today = new Date()
    const upcoming = []

    for (const trigger of triggerEvents) {
      if (trigger.date_pattern) {
        // Simple date pattern matching (could be enhanced)
        if (trigger.date_pattern.includes('weekly') || trigger.date_pattern.includes('monthly')) {
          upcoming.push({
            ...trigger,
            next_occurrence: 'This week' // Simplified
          })
        }
      }
    }

    return upcoming.slice(0, 3)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Advanced Pattern Recognition
          </CardTitle>
          <CardDescription>AI-powered pattern detection and risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-purple-900 mb-2">Unlock Pattern Recognition</h3>
              <p className="text-sm text-purple-700 mb-4">
                Get AI-powered escalation detection, trigger calendars, and safety alerts
              </p>
              <a
                href="/subscription"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Upgrade to Recovery
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      {activeAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-5 w-5" />
              Active Pattern Alerts ({activeAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDetections.map((detection) => (
                <div key={detection.id} className="bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-red-900 capitalize">
                        {detection.detection_type.replace('_', ' ')} Detected
                      </div>
                      <div className="text-sm text-red-700">
                        Confidence: {(detection.confidence_score * 100).toFixed(0)}%
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(detection.risk_level)}`}>
                      {detection.risk_level} risk
                    </span>
                  </div>
                  
                  <div className="text-sm text-red-800 mb-3">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {detection.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => acknowledgeDetection(detection.id)}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Escalation Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Escalation Patterns
          </CardTitle>
          <CardDescription>Identified patterns that lead to escalation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalationPatterns.length > 0 ? (
              escalationPatterns.map((pattern) => (
                <div key={pattern.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-medium">{pattern.pattern_name}</div>
                    <div className="text-sm text-gray-500">
                      {(pattern.confidence_score * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Triggers:</div>
                      <ul className="text-gray-600 space-y-1">
                        {pattern.trigger_events.map((trigger, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Warning Signs:</div>
                      <ul className="text-gray-600 space-y-1">
                        {pattern.warning_signs.map((sign, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {pattern.last_detected && (
                    <div className="mt-3 text-xs text-gray-500">
                      Last detected: {new Date(pattern.last_detected).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No escalation patterns detected yet</p>
                <p className="text-sm">Patterns will appear as you document more experiences</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trigger Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Trigger Calendar
          </CardTitle>
          <CardDescription>High-risk dates and times to watch for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUpcomingTriggers().length > 0 ? (
              getUpcomingTriggers().map((trigger) => (
                <div key={trigger.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{trigger.trigger_name}</div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(trigger.risk_level)}`}>
                      {trigger.risk_level} risk
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {trigger.date_pattern && (
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3" />
                        Pattern: {trigger.date_pattern}
                      </div>
                    )}
                    {trigger.time_pattern && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Time: {trigger.time_pattern}
                      </div>
                    )}
                  </div>
                  
                  {trigger.coping_strategies.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">Coping Strategies:</div>
                      <ul className="text-gray-600 space-y-1">
                        {trigger.coping_strategies.map((strategy, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Shield className="h-3 w-3 text-green-500" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No trigger patterns identified yet</p>
                <p className="text-sm">AI will learn your patterns over time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Pattern Insights
          </CardTitle>
          <CardDescription>AI-generated insights about your patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{escalationPatterns.length}</div>
              <div className="text-sm text-blue-700">Patterns Identified</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{triggerEvents.length}</div>
              <div className="text-sm text-orange-700">Active Triggers</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {escalationPatterns.length > 0 ? 
                  Math.round(escalationPatterns.reduce((acc, p) => acc + p.confidence_score, 0) / escalationPatterns.length * 100) : 0}%
              </div>
              <div className="text-sm text-green-700">Avg Confidence</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <strong>Next Steps:</strong> Continue documenting experiences to improve pattern recognition accuracy. 
              The AI learns from your journal entries and becomes more precise over time.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}