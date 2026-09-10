'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Users } from 'lucide-react'

interface AdditionalDetailsCardProps {
  location?: string
  witnesses?: string[]
}

export default function AdditionalDetailsCard({ location, witnesses }: AdditionalDetailsCardProps) {
  if (!location && (!witnesses || witnesses.length === 0)) return null

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Additional Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Location</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1 break-words">{location}</p>
            </div>
          </div>
        )}
        {witnesses && witnesses.length > 0 && (
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Witnesses</p>
              <p className="text-gray-700 text-sm sm:text-base mt-1">{witnesses.join(', ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}