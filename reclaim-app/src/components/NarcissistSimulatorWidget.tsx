'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Target, TrendingUp, Play } from 'lucide-react'
import Link from 'next/link'

export default function NarcissistSimulatorWidget() {
  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Bot className="h-5 w-5" />
          Narcissist Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-purple-700">
          Practice grey rock and BIFF responses in a safe environment. Get real-time feedback and predict their next moves.
        </p>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs text-purple-800">
            <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>3 narcissist types: Overt, Covert, Malignant</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-purple-800">
            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>AI predicts their next 3 likely moves</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-purple-800">
            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Real-time feedback on your technique</span>
          </div>
        </div>

        {/* Scenarios */}
        <div className="p-3 bg-white rounded-lg border border-purple-200">
          <div className="text-xs font-semibold text-purple-900 mb-2">Practice Scenarios:</div>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Custody</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Text</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Email</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Boundary</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Custom</span>
          </div>
        </div>

        {/* CTA */}
        <Link href="/narcissist-simulator">
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2">
            <Play className="h-4 w-4" />
            Start Practice Session
          </button>
        </Link>

        {/* Tip */}
        <div className="text-xs text-purple-600 bg-purple-100 p-2 rounded">
          ðŸ’¡ <strong>Tip:</strong> Use "Custom Context" to paste your real conversations for the most realistic practice
        </div>
      </CardContent>
    </Card>
  )
}
