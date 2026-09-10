'use client'

import Link from 'next/link'
import { Lightbulb, Heart, ArrowRight } from 'lucide-react'

export default function HopeReframeWidget() {
  return (
    <Link href="/hope-reframe">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border-2 border-amber-300 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-lg group-hover:shadow-md transition-all">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Hope Reframe</h3>
              <p className="text-sm text-gray-600">Transform distress into hope</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Heart className="h-4 w-4 text-amber-500" />
            <span>Acknowledges your pain</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Heart className="h-4 w-4 text-amber-500" />
            <span>Builds realistic hope</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Heart className="h-4 w-4 text-amber-500" />
            <span>Reinforces resilience</span>
          </div>
        </div>

        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-amber-900">
            ðŸ’› Shift perspective without denying pain
          </p>
        </div>
      </div>
    </Link>
  )
}
