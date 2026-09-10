'use client'

import { useState, useEffect } from 'react'
import { Brain, Shield, Heart, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

interface CopingStrategy {
  type: 'immediate' | 'mindset' | 'empowerment'
  title: string
  action: string
  icon: string
}

interface AIInsight {
  detectedTactics: string[]
  emotionalTone: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis'
  copingStrategies: CopingStrategy[]
  suggestedActions: string[]
}

interface AICopingInsightsProps {
  text: string
  onActionSelect: (action: string) => void
}

export default function AICopingInsights({ text, onActionSelect }: AICopingInsightsProps) {
  const [insights, setInsights] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(false)
  const [showInsights, setShowInsights] = useState(false)

  useEffect(() => {
    const analyzeText = async () => {
      if (!text || text.trim().length < 10) {
        setInsights(null)
        setShowInsights(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/npd-traits/ai-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
        
        const data = await response.json()
        if (data.insights) {
          setInsights(data.insights)
          setShowInsights(true)
        }
      } catch (error) {
        console.error('Failed to get AI insights:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(analyzeText, 1000)
    return () => clearTimeout(debounceTimer)
  }, [text])

  if (!showInsights || !insights) return null

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'crisis': return 'bg-red-100 border-red-300 text-red-800'
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'immediate': return <Shield className="h-4 w-4" />
      case 'mindset': return <Brain className="h-4 w-4" />
      case 'empowerment': return <Zap className="h-4 w-4" />
      default: return <Heart className="h-4 w-4" />
    }
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">AI Coping Insights</h3>
        {loading && <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />}
      </div>

      {insights.urgencyLevel === 'crisis' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Crisis Support Needed</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            If you're in immediate danger, please contact emergency services or a crisis hotline.
          </p>
        </div>
      )}

      {insights.detectedTactics.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Detected patterns:</strong> {insights.detectedTactics.join(', ')}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Recommended Coping Strategies:</h4>
        
        {insights.copingStrategies.map((strategy, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{strategy.icon}</span>
                {getTypeIcon(strategy.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-gray-900">{strategy.title}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    strategy.type === 'immediate' ? 'bg-red-100 text-red-700' :
                    strategy.type === 'mindset' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {strategy.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{strategy.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {insights.suggestedActions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-purple-200">
          <h4 className="font-medium text-gray-900 mb-2">Suggested Next Steps:</h4>
          <div className="flex flex-wrap gap-2">
            {insights.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onActionSelect(action)}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-purple-200">
        <p className="text-xs text-gray-500">
          ðŸ’¡ These insights are generated based on your notes and are meant to support, not replace, professional help.
        </p>
      </div>
    </div>
  )
}