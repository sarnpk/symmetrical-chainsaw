'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Star, Shield, Heart, Brain, Users, Zap } from 'lucide-react'
import UnifiedHeader from '@/components/UnifiedHeader'
import UnifiedFooter from '@/components/UnifiedFooter'
import { createClient } from '@supabase/supabase-js'

interface SubscriptionPlan {
  plan_tier: string
  display_name: string
  description: string
  price_monthly: number
  price_yearly: number
}

interface FeatureComparison {
  category: string
  icon: any
  features: {
    name: string
    foundation: string | boolean
    recovery: string | boolean
    empowerment: string | boolean
  }[]
}

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    { plan_tier: 'foundation', display_name: 'Foundation (Free)', description: 'Basic access for getting started', price_monthly: 0, price_yearly: 0 },
    { plan_tier: 'recovery', display_name: 'Recovery', description: 'AI-powered recovery tools', price_monthly: 14.99, price_yearly: 150.00 },
    { plan_tier: 'empowerment', display_name: 'Empowered', description: 'Complete recovery suite', price_monthly: 24.99, price_yearly: 250.00 }
  ])
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  const handleSubscribe = async (tier: string) => {
    setSubscribing(tier)
    try {
      const priceIds: Record<string, string> = {
        'recovery-monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_RECOVERY_MONTHLY || '',
        'recovery-yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_RECOVERY_YEARLY || '',
        'empowerment-monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_EMPOWERMENT_MONTHLY || '',
        'empowerment-yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_EMPOWERMENT_YEARLY || ''
      }
      const priceId = priceIds[`${tier}-${isYearly ? 'yearly' : 'monthly'}`]
      
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email: '' })
      })
      const { sessionId } = await res.json()
      
      const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setSubscribing(null)
    }
  }

  useEffect(() => {
    fetch('/api/subscription-plans')
      .then(res => res.json())
      .then(data => {
        if (data.plans?.length > 0) setPlans(data.plans)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getPlanData = (tier: string) => {
    return plans.find(p => p.plan_tier === tier)
  }

  const getPrice = (tier: string) => {
    const plan = getPlanData(tier)
    if (!plan) return '0.00'
    const price = isYearly ? plan.price_yearly : plan.price_monthly
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }

  const featureComparison: FeatureComparison[] = [
    {
      category: 'Core Features',
      icon: Heart,
      features: [
        { name: 'Journal Entries', foundation: '3/day', recovery: '15/day', empowerment: 'Unlimited' },
        { name: 'AI Coach Chats', foundation: '5/day', recovery: '25/day', empowerment: 'Unlimited' },
        { name: 'Pattern Analysis', foundation: '1/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Mind Reset Exercises', foundation: '1/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Safety Plan', foundation: true, recovery: true, empowerment: true }
      ]
    },
    {
      category: 'Protection Tools',
      icon: Shield,
      features: [
        { name: 'Grey Rock Practice', foundation: '2/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Grey Rock Templates', foundation: '3/day', recovery: '15/day', empowerment: 'Unlimited' },
        { name: 'BIFF Assistant', foundation: '2/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Boundary Builder', foundation: '5/month', recovery: '25/month', empowerment: 'Unlimited' },
        { name: 'Boundary Templates', foundation: false, recovery: true, empowerment: true }
      ]
    },
    {
      category: 'Wellness & Healing',
      icon: Brain,
      features: [
        { name: 'Mood Check-ins', foundation: false, recovery: true, empowerment: true },
        { name: 'Coping Strategies', foundation: false, recovery: '15/month', empowerment: 'Unlimited' },
        { name: 'Wellness Tracking', foundation: '2/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Crisis Reframing', foundation: '3/day', recovery: '15/day', empowerment: 'Unlimited' },
        { name: 'Healing Sessions', foundation: '1/day', recovery: '5/day', empowerment: 'Unlimited' }
      ]
    },
    {
      category: 'Analysis Tools',
      icon: Zap,
      features: [
        { name: 'Narcissist Detector', foundation: '1/day', recovery: '5/day', empowerment: 'Unlimited' },
        { name: 'Manipulation Decoder', foundation: '1/day', recovery: '5/day', empowerment: 'Unlimited' },
        { name: 'Gaslighting Tracker', foundation: '2/day', recovery: '10/day', empowerment: 'Unlimited' },
        { name: 'Relationship Health Check', foundation: '1/week', recovery: '3/day', empowerment: 'Unlimited' },
        { name: 'Narcissist Simulator', foundation: false, recovery: '3/day', empowerment: 'Unlimited' }
      ]
    },
    {
      category: 'Storage & Support',
      icon: Users,
      features: [
        { name: 'File Storage', foundation: '100 MB', recovery: '10 GB', empowerment: '100 GB' },
        { name: 'Audio Transcription', foundation: false, recovery: '60 min/month', empowerment: '300 min/month' },
        { name: 'Priority Support', foundation: false, recovery: 'Email', empowerment: '24/7 Chat' },
        { name: 'Export Data', foundation: '1/month', recovery: '5/month', empowerment: 'Unlimited' },
        { name: 'Early Access Features', foundation: false, recovery: true, empowerment: true }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <UnifiedHeader />

      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Choose Your Recovery Plan</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transparent, simple pricing. Upgrade anytime. Downgrade or cancel easily.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>
                Yearly <span className="text-green-600 font-semibold">(Save 17%)</span>
              </span>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* Foundation */}
                <Card className="relative">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      {getPlanData('foundation')?.display_name || 'Foundation (Free)'}
                    </CardTitle>
                    <div className="text-4xl font-bold">
                      ${getPrice('foundation')}
                      <span className="text-lg font-normal text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                    </div>
                    <CardDescription className="text-base">{getPlanData('foundation')?.description || 'Basic access for getting started'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/auth" className="block w-full">
                      <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Get Started Free
                      </button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recovery (Popular) */}
                <Card className="relative border-indigo-200 shadow-lg">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                  <CardHeader>
                    <CardTitle className="text-indigo-700 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {getPlanData('recovery')?.display_name || 'Recovery'}
                    </CardTitle>
                    <div className="text-4xl font-bold">
                      ${getPrice('recovery')}
                      <span className="text-lg font-normal text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                      {isYearly && (
                        <div className="text-sm text-green-600 font-medium">Save $30/year</div>
                      )}
                    </div>
                    <CardDescription className="text-base">{getPlanData('recovery')?.description || 'AI-powered recovery tools'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button 
                      onClick={() => handleSubscribe('recovery')}
                      disabled={subscribing === 'recovery'}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {subscribing === 'recovery' ? 'Loading...' : 'Subscribe Now'}
                    </button>
                  </CardContent>
                </Card>

                {/* Empowered */}
                <Card className="relative">
                  <CardHeader>
                    <CardTitle className="text-purple-700 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      {getPlanData('empowerment')?.display_name || 'Empowered'}
                    </CardTitle>
                    <div className="text-4xl font-bold">
                      ${getPrice('empowerment')}
                      <span className="text-lg font-normal text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                      {isYearly && (
                        <div className="text-sm text-green-600 font-medium">Save $50/year</div>
                      )}
                    </div>
                    <CardDescription className="text-base">{getPlanData('empowerment')?.description || 'Complete recovery suite'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button 
                      onClick={() => handleSubscribe('empowerment')}
                      disabled={subscribing === 'empowerment'}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {subscribing === 'empowerment' ? 'Loading...' : 'Subscribe Now'}
                    </button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Feature Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Compare All Features</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-4 font-semibold text-green-700">Foundation</th>
                    <th className="text-center p-4 font-semibold text-indigo-700">Recovery</th>
                    <th className="text-center p-4 font-semibold text-purple-700">Empowered</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((category, categoryIndex) => (
                    <React.Fragment key={category.category}>
                      <tr className="bg-gray-25">
                        <td colSpan={4} className="p-4 font-semibold text-gray-800 border-t">
                          <div className="flex items-center gap-2">
                            <category.icon className="h-5 w-5" />
                            {category.category}
                          </div>
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={feature.name} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                          <td className="p-4 text-gray-700">{feature.name}</td>
                          <td className="p-4 text-center">
                            {typeof feature.foundation === 'boolean' ? (
                              feature.foundation ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-gray-700">{feature.foundation}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof feature.recovery === 'boolean' ? (
                              feature.recovery ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-indigo-700">{feature.recovery}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof feature.empowerment === 'boolean' ? (
                              feature.empowerment ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-purple-700">{feature.empowerment}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-6 max-w-4xl mx-auto">
              All limits are per day unless specified. "Unlimited" features are subject to fair use policy. 
              Storage and transcription limits are monthly allowances.
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Recovery Journey?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of survivors who are reclaiming their lives with our evidence-based tools and supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth" 
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Free Today
              </Link>
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Read Recovery Stories
              </Link>
            </div>
          </div>
        </div>
      </main>
      <UnifiedFooter />
    </div>
  )
}