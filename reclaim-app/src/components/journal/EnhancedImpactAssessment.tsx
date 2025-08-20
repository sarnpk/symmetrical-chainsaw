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

  const getTriggerColor = (rating: number, selected: boolean) => {
    if (!selected) return 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
    
    switch (rating) {
      case 1: return 'border-green-500 bg-green-50 text-green-700 shadow-md'
      case 2: return 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md'
      case 3: return 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
      case 4: return 'border-red-500 bg-red-50 text-red-700 shadow-md'
      case 5: return 'border-red-600 bg-red-100 text-red-800 shadow-md'
      default: return 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
    }
  }

  const getMoodColor = (rating: number, selected: boolean) => {
    if (!selected) return 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
    return 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
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
      <CardContent className="space-y-6 sm:space-y-8">
        {/* Mood Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How would you rate your mood during this incident? (1-10)
          </label>
          
          {/* Mobile: 2 rows of 5, Desktop: 2 rows of 5. Wrap in overflow container to avoid clipping on very small screens */}
          <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onMoodRatingChange(rating)}
                className={`w-full p-2 sm:p-4 text-center rounded-lg border-2 transition-all transform sm:hover:scale-105 ${
                  getMoodColor(rating, moodRating === rating)
                }`}
              >
                <div className="font-bold text-sm sm:text-lg">{rating}</div>
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-1 sm:gap-3 mt-2">
            {[6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onMoodRatingChange(rating)}
                className={`w-full p-2 sm:p-4 text-center rounded-lg border-2 transition-all transform hover:scale-105 ${
                  getMoodColor(rating, moodRating === rating)
                }`}
              >
                <div className="font-bold text-sm sm:text-lg">{rating}</div>
              </button>
            ))}
          </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
          <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            Selected: <span className="font-medium text-purple-700">{moodRating}</span> — {getMoodDescriptor(moodRating)}
          </div>
        </div>

        {/* Trigger Level - Mobile Optimized */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How triggering was this experience? (1-5)
          </label>
          
          {/* Mobile: Single column full-width buttons; Desktop: 5 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onTriggerLevelChange(rating)}
                className={`w-full p-4 sm:p-3 text-center rounded-xl sm:rounded-lg border-2 transition-all transform sm:hover:scale-105 ${
                  getTriggerColor(rating, triggerLevel === rating)
                }`}
              >
                <div className="flex items-center justify-between sm:flex-col sm:justify-center">
                  <div className="flex items-center gap-3 sm:gap-0 sm:flex-col">
                    <div className="font-bold text-xl sm:text-lg">{rating}</div>
                    <div className="text-sm sm:text-xs font-medium">
                      {getTriggerDescriptor(rating)}
                    </div>
                  </div>
                  {/* Mobile: Show checkmark when selected */}
                  <div className="sm:hidden">
                    {triggerLevel === rating && (
                      <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Desktop: Show range labels */}
          <div className="hidden sm:flex justify-between text-xs text-gray-500 mt-3">
            <span>Mild</span>
            <span>Severe</span>
          </div>
          
          <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            Selected: <span className="font-medium text-purple-700">{triggerLevel}</span> — {getTriggerDescriptor(triggerLevel)}
            <div className="text-xs text-gray-600 mt-1">
              This helps track patterns and intensity over time
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}