'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BehaviorTypesCardProps {
  behaviorTypes: string[]
}

export default function BehaviorTypesCard({ behaviorTypes }: BehaviorTypesCardProps) {
  if (!behaviorTypes || behaviorTypes.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Behavior Types</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {behaviorTypes.map((type) => (
            <span
              key={type}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
            >
              {type.replace('_', ' ')}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}