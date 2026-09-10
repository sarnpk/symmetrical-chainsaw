'use client'

import Link from 'next/link'
import { AlertCircle, Shield, ArrowRight } from 'lucide-react'

export default function CrisisReframeWidget() {
  return (
    <Link href="/crisis-reframe">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Crisis Reframe</h3>
              <p className="text-sm text-gray-600">Immediate panic support</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-red-600 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Shield className="h-4 w-4 text-red-500" />
            <span>Restore sense of control</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Shield className="h-4 w-4 text-red-500" />
            <span>AI-powered hope building</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Shield className="h-4 w-4 text-red-500" />
            <span>Break trauma bonds</span>
          </div>
        </div>

        <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-red-900">
            ðŸš¨ Use when you're in panic or crisis
          </p>
        </div>
      </div>
    </Link>
  )
}
