'use client'

import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Star, Shield, Heart, Brain, Zap, Users } from 'lucide-react'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'
import SectionHeading from '@/components/marketing/SectionHeading'
import CtaBanner from '@/components/marketing/CtaBanner'
import Reveal from '@/components/marketing/Reveal'
import { initPaddle, getPaddlePriceId } from '@/lib/paddle'

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

const defaultPlans: SubscriptionPlan[] = [
  { plan_tier: 'foundation', display_name: 'Foundation (Free)', description: 'Basic access for getting started', price_monthly: 0, price_yearly: 0 },
  { plan_tier: 'recovery', display_name: 'Recovery', description: 'AI-powered recovery tools', price_monthly: 14.99, price_yearly: 150.00 },
  { plan_tier: 'empowerment', display_name: 'Empowered', description: 'Complete recovery suite', price_monthly: 24.99, price_yearly: 250.00 }
]

const tierMeta: Record<string, { accent: 'green' | 'brand' | 'hope'; icon: any; popular?: boolean }> = {
  foundation: { accent: 'green', icon: Heart },
  recovery: { accent: 'brand', icon: Shield, popular: true },
  empowerment: { accent: 'hope', icon: Star }
}

export default function PricingClient() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans)
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  const handleSubscribe = async (tier: string) => {
    setSubscribing(tier)
    try {
      const paddle = await initPaddle()
      const priceId = getPaddlePriceId(tier, isYearly ? 'yearly' : 'monthly')

      if (!priceId) {
        alert('Price not configured. Please try again later.')
        setSubscribing(null)
        return
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      })
    } catch (error) {
      console.error('Paddle checkout error:', error)
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

  const cellValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value
        ? <Check className="h-5 w-5 text-success-600 mx-auto" aria-label="Included" />
        : <X className="h-5 w-5 text-ink-300 mx-auto" aria-label="Not included" />
    }
    return <span className="text-sm font-medium text-ink-700">{value}</span>
  }

  const colLabel = (key: string) => (key === 'foundation' ? 'Foundation' : key === 'recovery' ? 'Recovery' : 'Empowered')

  const headerColClass = (key: string) =>
    key === 'foundation' ? 'text-green-700' : key === 'recovery' ? 'text-brand-700' : 'text-hope-600'

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Simple, honest pricing"
              title="Choose your recovery plan"
              lead="Transparent pricing. Upgrade anytime. Downgrade or cancel easily â€” your data never disappears."
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isYearly ? 'text-brand-700' : 'text-ink-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                role="switch"
                aria-checked={isYearly}
                aria-label="Toggle yearly billing"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-brand-600' : 'bg-ink-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-brand-700' : 'text-ink-500'}`}>
                Yearly <span className="font-semibold text-success-600">(Save 17%)</span>
              </span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
            {loading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-600" aria-label="Loading plans" />
              </div>
            ) : (
              defaultPlans.map((plan, i) => {
                const meta = tierMeta[plan.plan_tier]
                const active = getPlanData(plan.plan_tier)
                const name = active?.display_name || plan.display_name
                return (
                  <Reveal key={plan.plan_tier} delay={i * 100} className="h-full">
                    <div
                      className={`relative flex h-full flex-col rounded-panel border bg-white p-7 shadow-soft transition-shadow hover:shadow-lift ${
                        meta.popular ? 'border-brand-300 ring-1 ring-brand-200' : 'border-ink-200'
                      }`}
                    >
                      {meta.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-sm font-semibold text-white">
                          Popular
                        </div>
                      )}
                      <div className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
                        <meta.icon className={`h-5 w-5 ${meta.accent === 'green' ? 'text-success-600' : meta.accent === 'hope' ? 'text-hope-600' : 'text-brand-600'}`} />
                        {name}
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-ink-600">
                        {active?.description || plan.description}
                      </p>
                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="font-display text-5xl font-semibold text-ink-900">${getPrice(plan.plan_tier)}</span>
                        <span className="text-lg text-ink-500">/{isYearly ? 'year' : 'month'}</span>
                      </div>
                      {isYearly && plan.plan_tier === 'recovery' && (
                        <p className="mt-1 text-sm font-medium text-success-600">Save $30/year</p>
                      )}
                      {isYearly && plan.plan_tier === 'empowerment' && (
                        <p className="mt-1 text-sm font-medium text-success-600">Save $50/year</p>
                      )}
                      <div className="mt-7 flex-1" />
                      {plan.plan_tier === 'foundation' ? (
                        <Link
                          href="/auth"
                          className={`flex w-full items-center justify-center rounded-lg py-3 text-center font-semibold transition-colors ${
                            meta.accent === 'green'
                              ? 'bg-success-600 text-white hover:bg-success-700'
                              : 'bg-brand-600 text-white hover:bg-brand-700'
                          }`}
                        >
                          Start free
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan.plan_tier)}
                          disabled={subscribing === plan.plan_tier}
                          className={`flex w-full items-center justify-center rounded-lg py-3 font-semibold transition-colors disabled:opacity-50 ${
                            meta.accent === 'brand'
                              ? 'bg-brand-600 text-white hover:bg-brand-700'
                              : 'bg-hope-600 text-white hover:bg-hope-700'
                          }`}
                        >
                          {subscribing === plan.plan_tier ? 'Starting checkout...' : 'Subscribe now'}
                        </button>
                      )}
                    </div>
                  </Reveal>
                )
              })
            )}
          </div>

          <Reveal delay={200}>
            <div className="mt-20">
              <h2 className="text-center font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                Compare all features
              </h2>

              <div className="mt-12 overflow-x-auto rounded-panel border border-ink-200 bg-white shadow-soft">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 bg-ink-50/60">
                      <th className="p-4 text-left font-display text-[15px] font-semibold text-ink-900">Features</th>
                      {(['foundation', 'recovery', 'empowerment'] as const).map(key => (
                        <th key={key} className={`p-4 text-center font-display text-[15px] font-semibold ${headerColClass(key)}`}>
                          {colLabel(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((category) => (
                      <Fragment key={category.category}>
                        <tr className="border-t border-ink-200 bg-ink-50/40">
                          <td colSpan={4} className="p-4 font-display text-[15px] font-semibold text-ink-900">
                            <div className="flex items-center gap-2">
                              <category.icon className="h-5 w-5 text-brand-600" />
                              {category.category}
                            </div>
                          </td>
                        </tr>
                        {category.features.map((feature, i) => (
                          <tr key={feature.name} className={`border-t border-ink-100 ${i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'}`}>
                            <td className="p-4 text-ink-700">{feature.name}</td>
                            <td className="p-4 text-center">{cellValue(feature.foundation)}</td>
                            <td className="p-4 text-center">{cellValue(feature.recovery)}</td>
                            <td className="p-4 text-center">{cellValue(feature.empowerment)}</td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mx-auto mt-6 max-w-4xl text-center text-sm text-ink-500">
                All limits are per day unless specified. "Unlimited" features are subject to a fair use policy.
                Storage and transcription limits are monthly allowances.
              </p>
            </div>
          </Reveal>
        </div>

        <CtaBanner
          title="Ready to start your recovery journey?"
          lead="Join thousands of survivors who are reclaiming their lives with evidence-based tools â€” start free today."
          cta={{ label: 'Start free today', href: '/auth' }}
        />
        <div className="bg-white pb-16 -mt-4">
          <p className="text-center">
            <Link href="/blog" className="font-semibold text-brand-700 hover:text-brand-800 transition-colors">
              Read recovery stories -&gt;
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
