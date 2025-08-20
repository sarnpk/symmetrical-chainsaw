'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart } from 'lucide-react'

interface EmotionalImpactCardProps {
  emotionalStateBefore?: string
  emotionalStateAfter?: string
  showUpgradePrompt?: boolean
}

export default function EmotionalImpactCard({ 
  emotionalStateBefore, 
  emotionalStateAfter, 
  showUpgradePrompt = false 
}: EmotionalImpactCardProps) {
  if (!emotionalStateBefore && !emotionalStateAfter && !showUpgradePrompt) return null

  if (showUpgradePrompt) {
    return (
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
        <CardContent className="p-4 sm:p-6 text-center">
          <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
            Track Emotional Impact
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Upgrade to Recovery or Empowerment to document how experiences affect your emotional state.
          </p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            Upgrade Plan
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          🛡️ How This Affected You
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {emotionalStateBefore && (
          <div className="flex items-start gap-3">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Before</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">{emotionalStateBefore}</p>
            </div>
          </div>
        )}
        {emotionalStateAfter && (
          <div className="flex items-start gap-3">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">After</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">{emotionalStateAfter}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}