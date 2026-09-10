'use client'

import Link from 'next/link'
import { Shield, HelpCircle, Plus } from 'lucide-react'

export default function StonewallHeader() {
  return (
    <div className="space-y-4">
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            Stonewalling Journal
          </h1>
          <Link 
            href="/docs/STONEWALLING_TRACKER_GUIDE.html"
            target="_blank"
            className="text-purple-600 hover:text-purple-700 transition-colors"
            title="View User Guide"
          >
            <HelpCircle className="h-6 w-6" />
          </Link>
        </div>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Document and understand communication shutdown patterns
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link 
          href="/stonewalling/log"
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </Link>
      </div>
    </div>
  )
}
