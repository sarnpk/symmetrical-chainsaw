'use client'
import { useState } from 'react'
import UnifiedHeader from '@/components/UnifiedHeader'
import UnifiedFooter from '@/components/UnifiedFooter'

export default function DonatePage() {
  const [customAmount, setCustomAmount] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const tiers = [
    { amount: 5, title: 'Supporter', impact: 'Funds 100 free AI coaching sessions' },
    { amount: 25, title: 'Advocate', impact: 'Keeps 50 survivors ad-free for a month' },
    { amount: 100, title: 'Champion', impact: 'Sponsors 10 survivors with premium access' },
  ]

  const handleDonate = (amount: number) => {
    window.open(`https://ko-fi.com/reclaimapp/donate?amount=${amount}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <UnifiedHeader />
      <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Keep Reclaim Free for Survivors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your donation helps us provide free AI-powered recovery tools to survivors of narcissistic abuse worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-gray-600">Survivors Helped</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Free Core Features</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">$2,000</div>
            <div className="text-gray-600">Monthly AI Costs</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Choose Your Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.amount} className="bg-white p-6 rounded-lg shadow-lg border-2 border-purple-200 hover:border-purple-400 transition">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-purple-600 mb-2">${tier.amount}</div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">{tier.title}</div>
                  <div className="text-sm text-gray-600">{tier.impact}</div>
                </div>
                <button
                  onClick={() => handleDonate(tier.amount)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Donate Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="w-full text-left font-semibold text-purple-600 mb-4"
          >
            {showCustom ? '▼' : '▶'} Donate Custom Amount
          </button>
          {showCustom && (
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={() => handleDonate(Number(customAmount))}
                disabled={!customAmount}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
              >
                Donate ${customAmount || '0'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-purple-50 p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-bold mb-4 text-center">Where Your Donation Goes</h3>
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-700">AI Coaching & Analysis</span>
              <span className="font-semibold">60%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Audio Transcription Services</span>
              <span className="font-semibold">20%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Server & Hosting</span>
              <span className="font-semibold">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Development & Support</span>
              <span className="font-semibold">5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Why Your Support Matters</h3>
          <div className="space-y-4 text-gray-700">
            <p>💜 <strong>Keep It Free:</strong> Every donation helps us keep core features free for survivors who can't afford paid subscriptions.</p>
            <p>🤖 <strong>AI Costs Money:</strong> Each AI coaching session, pattern analysis, and audio transcription costs us real money. Your support covers these costs.</p>
            <p>🌍 <strong>Global Impact:</strong> We serve survivors worldwide, many in countries where mental health resources are scarce or unaffordable.</p>
            <p>🚀 <strong>Build New Features:</strong> Donations help us develop new tools like group support rooms, crisis intervention, and mobile apps.</p>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">Reclaim is committed to transparency and survivor-first values.</p>
          <p className="text-sm">All donations are processed securely through Ko-fi.</p>
        </div>
      </div>
      </div>
      <UnifiedFooter />
    </div>
  )
}
