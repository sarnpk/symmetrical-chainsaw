'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount') || '0'

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white p-12 rounded-lg shadow-xl">
          <div className="text-6xl mb-6">💜</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Support!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your ${amount} donation helps keep Reclaim free for survivors who need it most.
          </p>
          
          <div className="bg-purple-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
            <div className="space-y-3 text-left">
              <p className="text-gray-700">✅ You've helped fund AI coaching sessions for survivors</p>
              <p className="text-gray-700">✅ You've supported free access to recovery tools</p>
              <p className="text-gray-700">✅ You've contributed to building new features</p>
              <p className="text-gray-700">✅ You've joined a community of supporters making a difference</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              A confirmation email has been sent to you. You can request a tax receipt by replying to that email.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Back to Dashboard
              </Link>
              <Link 
                href="/donate"
                className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50"
              >
                Share with Others
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500">
              Want to make a bigger impact? Consider becoming a monthly sponsor.
            </p>
            <Link href="/sponsor" className="text-purple-600 font-semibold hover:underline">
              Learn about monthly sponsorship →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  )
}
