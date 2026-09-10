'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

interface SafetyRatingCardProps {
  rating: string | number
}

export default function SafetyRatingCard({ rating }: SafetyRatingCardProps) {
  const getSafetyColor = (rating: string | number) => {
    const colors = {
      '1': 'text-red-600 bg-red-100 border-red-200',
      '2': 'text-orange-600 bg-orange-100 border-orange-200', 
      '3': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      '4': 'text-blue-600 bg-blue-100 border-blue-200',
      '5': 'text-green-600 bg-green-100 border-green-200'
    }
    const key = String(rating) as keyof typeof colors
    return colors[key] || 'text-gray-600 bg-gray-100 border-gray-200'
  }

  const getSafetyLabel = (rating: string | number) => {
    const labels = {
      '1': 'Very Unsafe',
      '2': 'Unsafe',
      '3': 'Neutral',
      '4': 'Safe',
      '5': 'Very Safe'
    }
    const key = String(rating) as keyof typeof labels
    return labels[key] || 'Unknown'
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm sm:text-base">Safety Rating</p>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium border ${getSafetyColor(rating)}`}>
                {String(rating)}/5
              </span>
              <span className="text-gray-500 text-sm sm:text-base">
                {getSafetyLabel(rating)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}