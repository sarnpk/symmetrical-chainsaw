'use client'

import { useState, useEffect, Suspense } from 'react'
import { CheckCircle, Clock, Download, ArrowRight, Shield, Book, FileText, Headphones } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const severity = searchParams.get('severity') || 'moderate'
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
              ✅ Check Your Email!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your "Reality Anchor Kit" is on its way to:
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
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg shadow-2xl p-8 text-white">
            
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
                ⚠️ WAIT! Your Reality Kit Is Just The Beginning...
              </h2>
              <p className="text-xl opacity-90">
                You've validated ONE incident. But what about the rest?
              </p>
            </div>

            {/* Problem Statement */}
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <p className="text-lg mb-4">Your free kit covers basic validation, but what about:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span>Advanced manipulation tactics (50+ techniques)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span>Response scripts for every gaslighting phrase</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span>How to rebuild your reality after abuse</span>
                </div>
              </div>
            </div>

            {/* Product Offer */}
            <div className="bg-white rounded-lg p-6 text-gray-900 mb-6">
              <h3 className="text-2xl font-bold mb-4 text-center">
                🎯 Complete Gaslighting Defense System
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Book className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">50+ Manipulation Tactics</p>
                    <p className="text-sm text-gray-600">Complete identification guide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">25 Response Scripts</p>
                    <p className="text-sm text-gray-600">What to say in every situation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Reality Rebuilding Plan</p>
                    <p className="text-sm text-gray-600">30-day recovery roadmap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Headphones className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Audio Affirmations</p>
                    <p className="text-sm text-gray-600">Daily reality validation (20 min)</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Regular Price:</p>
                <p className="text-2xl text-gray-400 line-through mb-2">$37</p>
                <p className="text-sm font-semibold text-green-700 mb-1">Today Only:</p>
                <p className="text-5xl font-bold text-green-600 mb-2">$9</p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-red-600">76% OFF</span> - Limited Time
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="https://buy.stripe.com/your-gaslighting-product-link" // Replace with actual payment link
                className="block w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-700 text-center flex items-center justify-center gap-2"
              >
                Get Complete Defense System - $9
                <ArrowRight className="h-5 w-5" />
              </a>

              <p className="text-xs text-gray-500 text-center mt-3">
                Instant download • 30-day money-back guarantee
              </p>
            </div>

            {/* Social Proof */}
            <div className="text-center text-sm opacity-90">
              <p className="mb-2">✨ Join 2,891 people who've downloaded the Complete Defense System</p>
              <div className="flex justify-center gap-4 text-xs">
                <span>⭐⭐⭐⭐⭐ 4.8/5</span>
                <span>•</span>
                <span>623 Reviews</span>
              </div>
            </div>
          </div>

          {/* Decline Option */}
          <div className="text-center mt-6">
            <Link 
              href="/auth"
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              No thanks, I'll stick with just the basic kit
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
                "The response scripts changed everything. I finally knew what to say when he tried to gaslight me."
              </p>
              <p className="text-xs font-semibold">- Maria T.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                "I wish I had this years ago. It would have saved me so much confusion and self-doubt."
              </p>
              <p className="text-xs font-semibold">- Rachel K.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                "The reality rebuilding plan helped me trust myself again. Worth every penny."
              </p>
              <p className="text-xs font-semibold">- Lisa M.</p>
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