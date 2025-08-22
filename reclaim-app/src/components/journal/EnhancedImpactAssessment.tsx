'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EnhancedImpactAssessmentProps {
  moodRating: number
  triggerLevel: number
  onMoodRatingChange: (rating: number) => void
  onTriggerLevelChange: (level: number) => void
}

export default function EnhancedImpactAssessment({
  moodRating,
  triggerLevel,
  onMoodRatingChange,
  onTriggerLevelChange
}: EnhancedImpactAssessmentProps) {
  
  const getMoodDescriptor = (val: number) => {
    if (val <= 2) return 'Very Low'
    if (val <= 4) return 'Low'
    if (val <= 7) return 'Moderate'
    if (val <= 9) return 'High'
    return 'Very High'
  }

  const getTriggerDescriptor = (val: number) => {
    if (val === 1) return 'Mild'
    if (val === 2) return 'Light'
    if (val === 3) return 'Moderate'
    if (val === 4) return 'Strong'
    return 'Severe'
  }

  // Slider background helpers
  const moodGradient = (val: number) => {
    const pct = ((val - 1) / 9) * 100
    return {
      background: `linear-gradient(90deg, rgba(147,51,234,0.35) 0%, rgba(79,70,229,0.35) ${pct}%, #e5e7eb ${pct}%)`
    }
  }

  const triggerGradient = (val: number) => {
    const pct = ((val - 1) / 4) * 100
    return {
      background: `linear-gradient(90deg, rgba(16,185,129,0.35) 0%, rgba(239,68,68,0.35) ${pct}%, #e5e7eb ${pct}%)`
    }
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          📊 Impact Assessment
        </CardTitle>
        <CardDescription className="text-sm">
          Detailed analysis of emotional and psychological impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 md:space-y-8">
        {/* Mood Rating (1-10) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate your mood during this incident? (1-10)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={moodRating}
              onChange={(e) => onMoodRatingChange(Number(e.target.value))}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer bg-gray-200"
              style={moodGradient(moodRating)}
              aria-label="Mood rating from 1 to 10"
            />
            <div className="w-12 text-center text-sm font-semibold text-purple-700">
              {moodRating}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
          <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            Selected: <span className="font-medium text-purple-700">{moodRating}</span> — {getMoodDescriptor(moodRating)}
          </div>
        </div>

        {/* Trigger Level (1-5) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How triggering was this experience? (1-5)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={triggerLevel}
              onChange={(e) => onTriggerLevelChange(Number(e.target.value))}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer bg-gray-200"
              style={triggerGradient(triggerLevel)}
              aria-label="Trigger level from 1 to 5"
            />
            <div className="w-12 text-center text-sm font-semibold text-purple-700">
              {triggerLevel}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Mild</span>
            <span>Severe</span>
          </div>
          <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            Selected: <span className="font-medium text-purple-700">{triggerLevel}</span> — {getTriggerDescriptor(triggerLevel)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}