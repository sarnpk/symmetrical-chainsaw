'use client'

import { useState, useEffect, Suspense } from 'react'
import { CheckCircle, Clock, Download, ArrowRight, Shield, Book, FileText, Headphones } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const stage = searchParams.get('stage') || 'devaluation'
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes

  useEffect(() => {
    const savedEmail = localStorage.getItem('lead_email')
    if (savedEmail) setEmail(savedEmail)

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const stageName = {
    devaluation: 'Devaluation',
    discard: 'Discard',
    post_discard: 'Post-Discard',
    hoover: 'Hoovering'
  }[stage] || 'Devaluation'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </Link>
        </div>
      </header>

      {/* Success Message */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              âœ… Check Your Email!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your "{stageName} Stage Survival Guide" is on its way to:
            </p>
            <p className="text-xl font-semibold text-indigo-600 mb-4">{email}</p>
            <p className="text-sm text-gray-500">
              (Check spam folder if you don't see it in 2 minutes)
            </p>
          </div>
        </div>
      </section>

      {/* TRIPWIRE OFFER */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gradient-to-br from-red-600 to-purple-600 rounded-lg shadow-2xl p-8 text-white">
            
            {/* Countdown Timer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">This offer expires in:</span>
              </div>
              <div className="text-2xl font-bold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Warning Hook */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                âš ï¸ WAIT! You're Only 25% Prepared...
              </h2>
              <p className="text-xl opacity-90">
                Your free guide covers the {stageName} stage.
              </p>
            </div>

            {/* Problem Statement */}
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <p className="text-lg mb-4">But what about:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">âŒ</span>
                  <span>The Discard Phase (sudden abandonment)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">âŒ</span>
                  <span>Post-Discard Recovery (healing roadmap)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">âŒ</span>
                  <span>Hoover Attempts (when they come back)</span>
                </div>
              </div>
            </div>

            {/* Product Offer */}
            <div className="bg-white rounded-lg p-6 text-gray-900 mb-6">
              <h3 className="text-2xl font-bold mb-4 text-center">
                ðŸŽ¯ Complete Discard Stage Playbook
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Book className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">All 4 Stages Explained</p>
                    <p className="text-sm text-gray-600">Complete 20-page guide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">10 Response Scripts</p>
                    <p className="text-sm text-gray-600">Grey rock & boundary templates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">47-Point Checklist</p>
                    <p className="text-sm text-gray-600">Warning signs & transitions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Headphones className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Audio Guide (15 min)</p>
                    <p className="text-sm text-gray-600">Guided meditation for each stage</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Regular Price:</p>
                <p className="text-2xl text-gray-400 line-through mb-2">$27</p>
                <p className="text-sm font-semibold text-green-700 mb-1">Today Only:</p>
                <p className="text-5xl font-bold text-green-600 mb-2">$7</p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-red-600">74% OFF</span> - Limited Time
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="https://buy.stripe.com/your-product-link" // Replace with actual payment link
                className="block w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 text-center flex items-center justify-center gap-2"
              >
                Get Complete Playbook - $7
                <ArrowRight className="h-5 w-5" />
              </a>

              <p className="text-xs text-gray-500 text-center mt-3">
                Instant download â€¢ 30-day money-back guarantee
              </p>
            </div>

            {/* Social Proof */}
            <div className="text-center text-sm opacity-90">
              <p className="mb-2">âœ¨ Join 3,247 people who've downloaded the Complete Playbook</p>
              <div className="flex justify-center gap-4 text-xs">
                <span>â­â­â­â­â­ 4.9/5</span>
                <span>â€¢</span>
                <span>847 Reviews</span>
              </div>
            </div>
          </div>

          {/* Decline Option */}
          <div className="text-center mt-6">
            <Link 
              href="/auth"
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              No thanks, I'll take my chances with just the free guide
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-8">What Others Are Saying</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                "This playbook helped me recognize the hoovering attempts before I fell back in. Worth every penny."
              </p>
              <p className="text-xs font-semibold">- Sarah M.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                "The response scripts saved me. I finally knew what to say when he tried to manipulate me."
              </p>
              <p className="text-xs font-semibold">- Jennifer K.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                "I wish I had this during the discard. It would have saved me months of confusion."
              </p>
              <p className="text-xs font-semibold">- Amanda R.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2025 Reclaim. Educational purposes only.</p>
        </div>
      </footer>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  )
}
