'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  Mic, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Crown,
  ArrowUp
} from 'lucide-react'
import Link from 'next/link'

interface UsageStats {
  ai_interactions: {
    current: number
    limit: number
    remaining: number
  }
  audio_transcription: {
    current: number
    limit: number
    remaining: number
    duration_minutes: number
    minutes_limit: number
    minutes_remaining: number
  }
  pattern_analysis: {
    current: number
    limit: number
    remaining: number
  }
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
}

interface UsageTrackingDashboardProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowerment'
}

export default function UsageTrackingDashboard({ userId, subscriptionTier }: UsageTrackingDashboardProps) {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadUsageStats = async () => {
      try {
        const { data: sessionRes } = await supabase.auth.getSession()
        const token = sessionRes?.session?.access_token
        if (!token) throw new Error('No auth token')

        const res = await fetch('/api/usage/limits', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch usage limits')
        const data = await res.json()

        const mapped: UsageStats = {
          ai_interactions: {
            current: data.ai_interactions.current,
            limit: data.ai_interactions.limit,
            remaining: data.ai_interactions.remaining,
          },
          audio_transcription: {
            current: data.audio_transcription.current,
            limit: data.audio_transcription.limit,
            remaining: data.audio_transcription.remaining,
            duration_minutes: data.audio_transcription.duration_minutes,
            minutes_limit: data.audio_transcription.minutes_limit,
            minutes_remaining: data.audio_transcription.minutes_remaining,
          },
          pattern_analysis: {
            current: data.pattern_analysis.current,
            limit: data.pattern_analysis.limit,
            remaining: data.pattern_analysis.remaining,
          },
          subscription_tier: data.subscription_tier,
        }

        setUsageStats(mapped)
      } catch (error) {
        console.error('Failed to load usage stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsageStats()
  }, [userId, subscriptionTier, supabase])

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return 'text-green-600' // unlimited
    const percentage = (current / limit) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressBarColor = (current: number, limit: number) => {
    if (limit === -1) return 'bg-green-500' // unlimited
    const percentage = (current / limit) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTierInfo = () => {
    switch (subscriptionTier) {
      case 'foundation':
        return {
          name: 'Foundation (Free)',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <CheckCircle className="h-4 w-4" />
        }
      case 'recovery':
        return {
          name: 'Recovery',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <TrendingUp className="h-4 w-4" />
        }
      case 'empowerment':
        return {
          name: 'Empowerment',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          icon: <Crown className="h-4 w-4" />
        }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usageStats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load usage statistics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const tierInfo = getTierInfo()

  return (
    <div className="space-y-4">
      {/* Subscription Tier Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${tierInfo.bgColor}`}>
                {tierInfo.icon}
              </div>
              <div>
                <CardTitle className="text-lg">Current Plan</CardTitle>
                <CardDescription className={tierInfo.color}>
                  {tierInfo.name}
                </CardDescription>
              </div>
            </div>
            {subscriptionTier !== 'empowerment' && (
              <Link
                href="/subscription"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
              >
                <ArrowUp className="h-3 w-3" />
                Upgrade
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Interactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-indigo-600" />
              AI Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This month</span>
                <span className={`font-medium ${getUsageColor(usageStats.ai_interactions.current, usageStats.ai_interactions.limit)}`}>
                  {usageStats.ai_interactions.limit === -1 
                    ? `${usageStats.ai_interactions.current} (Unlimited)`
                    : `${usageStats.ai_interactions.current} / ${usageStats.ai_interactions.limit}`
                  }
                </span>
              </div>
              
              {usageStats.ai_interactions.limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(usageStats.ai_interactions.current, usageStats.ai_interactions.limit)}`}
                    style={{ 
                      width: `${Math.min(100, (usageStats.ai_interactions.current / usageStats.ai_interactions.limit) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}

              {usageStats.ai_interactions.remaining === 0 && usageStats.ai_interactions.limit !== -1 && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  Monthly limit reached
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audio Transcription */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="h-4 w-4 text-green-600" />
              Audio Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This month</span>
                <span className={`font-medium ${getUsageColor(usageStats.audio_transcription.duration_minutes, usageStats.audio_transcription.minutes_limit)}`}>
                  {usageStats.audio_transcription.minutes_limit === -1
                    ? `${usageStats.audio_transcription.current} (Unlimited)`
                    : `${usageStats.audio_transcription.current}`}
                </span>
              </div>
              
              {usageStats.audio_transcription.minutes_limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(usageStats.audio_transcription.duration_minutes, usageStats.audio_transcription.minutes_limit)}`}
                    style={{ 
                      width: `${Math.min(100, (usageStats.audio_transcription.duration_minutes / usageStats.audio_transcription.minutes_limit) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}

              <div className="text-xs text-gray-600 space-y-0.5">
                <div>
                  {usageStats.audio_transcription.duration_minutes} minutes transcribed
                </div>
                <div>
                  Minutes remaining: {usageStats.audio_transcription.minutes_limit === -1 
                    ? 'Unlimited' 
                    : `${usageStats.audio_transcription.minutes_remaining} / ${usageStats.audio_transcription.minutes_limit}`}
                </div>
              </div>

              {usageStats.audio_transcription.minutes_remaining === 0 && usageStats.audio_transcription.minutes_limit !== -1 && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  Monthly limit reached
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pattern Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This month</span>
                <span className={`font-medium ${getUsageColor(usageStats.pattern_analysis.current, usageStats.pattern_analysis.limit)}`}>
                  {usageStats.pattern_analysis.limit === -1 
                    ? `${usageStats.pattern_analysis.current} (Unlimited)`
                    : `${usageStats.pattern_analysis.current} / ${usageStats.pattern_analysis.limit}`
                  }
                </span>
              </div>

              {usageStats.pattern_analysis.limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(usageStats.pattern_analysis.current, usageStats.pattern_analysis.limit)}`}
                    style={{ 
                      width: `${Math.min(100, (usageStats.pattern_analysis.current / usageStats.pattern_analysis.limit) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}

              {usageStats.pattern_analysis.remaining === 0 && usageStats.pattern_analysis.limit !== -1 && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  Monthly limit reached
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
