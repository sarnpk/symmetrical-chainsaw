'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import SiteHeader from '@/components/marketing/SiteHeader'

function SuccessContent() {
  const searchParams = useSearchParams()
  const checkoutId = searchParams.get('checkout_id')
  const transactionId = searchParams.get('transaction_id')

  useEffect(() => {
    if (checkoutId || transactionId) {
      console.log('Paddle payment successful:', { checkoutId, transactionId })
    }
  }, [checkoutId, transactionId])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Recovery Journey!
          </h1>
          <p className="text-xl text-gray-600">
            Your subscription is now active. You have full access to all premium features.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What&apos;s Next?</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Access unlimited AI coaching sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Use advanced analysis tools without limits</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Get priority support when you need help</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Access early to new features</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Go to Dashboard
            </button>
          </Link>
          <Link href="/subscription">
            <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              View Subscription
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <SiteHeader />
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
