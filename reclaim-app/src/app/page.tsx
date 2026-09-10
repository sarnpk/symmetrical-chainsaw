import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  HeartPulse,
  Brain,
  Shield,
  Heart,
  BookOpen,
  BarChart3,
  FileCheck2,
  MessageSquare,
  AlertTriangle,
  Wind,
  Anchor,
  Sparkles,
  Lock,
} from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'

export const metadata: Metadata = {
  title: 'Reclaim - Private AI Recovery Journal for Abuse Survivors',
  description:
    'Turn your history into evidence. A private AI-assisted journal for survivors of narcissistic abuse — free assessment, gaslighting tracker, and trauma-informed support in 70+ languages.',
  openGraph: {
    title: 'Reclaim - Turn your history into evidence.',
    description:
      'Private AI-assisted journal for survivors of narcissistic abuse. Free assessment and recovery tools.',
    type: 'website',
    url: 'https://reclaimyourlife.app',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Reclaim' }],
  },
  alternates: { canonical: 'https://reclaimyourlife.app/' },
  robots: 'index, follow',
}

const features = [
  { icon: HeartPulse, title: 'Reality Anchor Routine', description: 'Daily emotional detachment practice with Morning Intentions, Mental Pause, and Decompression Rituals.', color: 'amber', isNew: true },
  { icon: Brain, title: 'Belief Reframe System', description: 'Challenge false beliefs from abuse with CBT techniques, AI-guided reality testing, and counter-evidence tracking.', color: 'green', isNew: true },
  { icon: Heart, title: 'Positive Moments Journal', description: 'Capture good experiences to build counter-evidence against false beliefs and track your healing progress.', color: 'blue', isNew: true },
  { icon: Brain, title: 'Multilingual AI Coach', description: 'Get trauma-informed support in 70+ languages including Urdu, Arabic, Hindi, Spanish, and more.', color: 'purple' },
  { icon: BookOpen, title: 'Reality Log & Journal', description: 'Document incidents objectively and track emotional patterns with structured templates.', color: 'indigo' },
  { icon: BarChart3, title: 'Manipulation Decoder', description: 'Analyze messages and conversations to identify NPD tactics and get Grey Rock responses.', color: 'green' },
  { icon: Heart, title: 'Mind Reset & Wellness', description: 'Guided breathing, thought reframing, and personalized coping strategies.', color: 'pink' },
  { icon: Shield, title: 'Safety & Boundaries', description: 'Emergency planning, Grey Rock techniques, and boundary-setting tools.', color: 'blue' },
]

const pricingTiers = [
  {
    name: 'Foundation',
    price: 'Free',
    description: 'Basic access to get started',
    color: 'green',
    features: [
      'Reality Anchor: Morning Intentions & Mental Pause',
      'Journal & Reality Log: up to 3 entries per day',
      'Multilingual AI Coach: up to 5 chats per day',
      'Manipulation Decoder: 1 analysis per day',
      'Mind Reset & Wellness: 1 exercise per day',
      'Safety Plan & Grey Rock: full access',
      '100 MB secure file storage',
    ],
    cta: { label: 'Start free', href: '/auth' },
  },
  {
    name: 'Recovery',
    price: '$15',
    period: '/mo',
    description: 'AI-powered recovery tools',
    color: 'indigo',
    popular: true,
    features: [
      'Reality Anchor: Complete routine with streak tracking',
      'Journal & Reality Log: plenty of entries daily',
      'Belief Reframe: AI-guided CBT reality testing',
      'Positive Moments: Counter-evidence journal',
      'Multilingual AI Coach: frequent daily conversations',
      'Manipulation Decoder: multiple analyses per day',
      'Mind Reset & Wellness: several exercises daily',
      'Advanced NPD trait library & pattern insights',
      '60 minutes of audio transcription monthly',
      '10 GB secure file storage',
      'Priority support & early feature access',
    ],
    cta: { label: 'Subscribe now', href: '/pricing' },
  },
  {
    name: 'Empowered',
    price: '$24.99',
    period: '/mo',
    description: 'Complete recovery suite',
    color: 'purple',
    features: [
      'Reality Anchor: Unlimited with advanced analytics',
      'Journal & Reality Log: unlimited daily entries',
      'Belief Reframe: Unlimited AI reality testing',
      'Positive Moments: Unlimited entries',
      'Multilingual AI Coach: unlimited conversations',
      'Manipulation Decoder: unlimited analyses',
      'Mind Reset & Wellness: unlimited exercises',
      'Advanced behavior pattern dashboard',
      '300 minutes of audio transcription monthly',
      '100 GB secure file storage',
      '24/7 priority support & beta features',
    ],
    cta: { label: 'Subscribe now', href: '/pricing' },
  },
]

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  amber: { border: 'border-amber-200', bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
  green: { border: 'border-green-200', bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-800' },
  blue: { border: 'border-blue-200', bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' },
  indigo: { border: 'border-indigo-200', bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-800' },
  pink: { border: 'border-pink-200', bg: 'bg-pink-100', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-800' },
  red: { border: 'border-red-200', bg: 'bg-red-100', text: 'text-red-600', badge: 'bg-red-100 text-red-800' },
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Journey to <span className="text-indigo-600">Recovery</span> Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A secure, private platform designed specifically for survivors of narcissistic abuse.
              Build emotional boundaries, get multilingual AI support, and heal at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Get Started — Free
              </Link>
              <Link
                href="/learn-more"
                className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white/80 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Powerful Tools for Your Recovery
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature) => {
                const c = colorMap[feature.color] || colorMap.indigo
                return (
                  <div
                    key={feature.title}
                    className={`rounded-lg border bg-white shadow-sm hover:shadow-lg transition-shadow p-6 ${c.border}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <feature.icon className={`h-8 w-8 ${c.text}`} />
                      {feature.isNew && (
                        <span className={`${c.badge} text-xs px-2 py-0.5 rounded-full font-medium`}>
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4 bg-white/60">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Choose Your Recovery Plan
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-lg border bg-white shadow-sm relative ${tier.popular ? `border-${tier.color}-200 shadow-lg` : ''}`}
                >
                  {tier.popular && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-${tier.color}-600 text-white px-4 py-1 rounded-full text-sm font-medium`}>
                      Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className={`text-2xl font-semibold text-${tier.color}-600`}>{tier.name}</h3>
                    <div className="text-3xl font-bold mt-2">
                      {tier.price}
                      {tier.period && <span className="text-base font-normal">{tier.period}</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <ul className="space-y-2 text-sm">
                      {tier.features.map((f) => (
                        <li key={f}>✓ {f}</li>
                      ))}
                    </ul>
                    <Link
                      href={tier.cta.href}
                      className={`mt-6 block w-full text-center py-2.5 rounded-lg font-medium transition-colors ${
                        tier.popular
                          ? `bg-${tier.color}-600 text-white hover:bg-${tier.color}-700`
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {tier.cta.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/pricing" className="text-indigo-600 hover:text-indigo-700 font-medium">
                View full comparison →
              </Link>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="h-6 w-6 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Privacy First</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your data is encrypted. Period.
            </h2>
            <p className="text-gray-600 mb-8">
              AES-256 encryption. We can't read your entries. No one can. Not us, not advertisers, not anyone.
              Your healing stays private — always.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span>No data selling</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-green-600" />
                <span>Trauma-informed</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
