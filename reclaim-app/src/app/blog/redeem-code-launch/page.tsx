'use client'

import Link from 'next/link'
import { Gift, Clock, Star, Users, Zap, Shield } from 'lucide-react'

export default function RedeemCodeLaunchPost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">Reclaim</Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-indigo-600 hover:underline">← Back to Blog</Link>
            <Link href="/auth" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gift className="h-4 w-4" />
              App Updates
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Introducing Free Trial Codes: Experience Premium Recovery Tools
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're excited to announce our new trial code system! Now you can experience our premium Recovery and Empowerment features completely free for up to 30 days.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">🎁 Exclusive Trial Codes Available Now!</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Recovery Trial</span>
                </div>
                <div className="text-2xl font-mono font-bold mb-2">YOUTUBE7DAY</div>
                <p className="text-indigo-100 text-sm mb-3">7 days of Recovery features - Perfect for getting started</p>
                <div className="text-xs text-indigo-200">Limited to first 100 users • Expires in 30 days</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">Empowerment Trial</span>
                </div>
                <div className="text-2xl font-mono font-bold mb-2">RECOVERY30</div>
                <p className="text-indigo-100 text-sm mb-3">30 days of full Empowerment access - Complete recovery suite</p>
                <div className="text-xs text-indigo-200">Limited to 25 users • Perfect for serious healing journey</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/auth" 
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <Gift className="h-4 w-4" />
                Claim Your Free Trial
              </Link>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Available Trial Codes</h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-indigo-600 mb-2">YouTube Subscribers</h4>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">YOUTUBE7DAY</code> - 7 days Recovery</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">YOUTUBE14DAY</code> - 14 days Empowerment</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-pink-600 mb-2">Instagram Followers</h4>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">INSTAGRAM7</code> - 7 days Recovery</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-purple-600 mb-2">TikTok Community</h4>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">TIKTOK3DAY</code> - 3 days Recovery</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-green-600 mb-2">Special Campaigns</h4>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">SURVIVOR7</code> - 7 days Recovery (Unlimited)</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">HEALING2024</code> - 10 days Recovery</div>
                </div>
              </div>
            </div>

            <h2>How to Redeem Your Code</h2>
            <div className="bg-gray-50 rounded-lg p-6 my-8">
              <h4 className="font-semibold mb-4">Step-by-Step Guide:</h4>
              <ol className="space-y-2">
                <li><strong>1. Sign Up</strong>: Create your free Reclaim account</li>
                <li><strong>2. Find the Gift Icon</strong>: Look for the gift icon in your dashboard</li>
                <li><strong>3. Enter Your Code</strong>: Type in your trial code (e.g., YOUTUBE7DAY)</li>
                <li><strong>4. Confirm Upgrade</strong>: Your account will instantly upgrade to the trial tier</li>
                <li><strong>5. Start Healing</strong>: Explore all premium features during your trial period</li>
              </ol>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
              <h4 className="font-semibold text-indigo-900 mb-2">🎯 Take Action Today</h4>
              <p className="text-indigo-700 mb-4">
                Don't let this opportunity pass by. Recovery is a journey that deserves the best tools and support available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/auth" 
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  <Gift className="h-4 w-4" />
                  Start Your Free Trial
                </Link>
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50"
                >
                  View All Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}