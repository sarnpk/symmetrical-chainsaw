import Link from 'next/link'
import { Metadata } from 'next'
import {
  FileCheck2,
  BarChart3,
  Brain,
  Heart,
  Shield,
  ArrowRight,
  Users,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react'
import QuizShell from '@/components/marketing/QuizShell'
import FeatureCard from '@/components/marketing/FeatureCard'
import StatCounter from '@/components/marketing/StatCounter'

export const metadata: Metadata = {
  title: 'Free Narcissistic Abuse Recovery Tools | Reclaim',
  description:
    'Free AI-powered tools for narcissistic abuse survivors. Take assessments, detect manipulation patterns, and start understanding in 30 seconds. No signup required.',
  keywords:
    'free narcissist test, free gaslighting test, emotional abuse test online, narcissistic abuse assessment, relationship health check, discard stage test, manipulation detection',
  openGraph: {
    title: 'Free Narcissistic Abuse Recovery Tools | Reclaim',
    description:
      'Free AI-powered tools for narcissistic abuse survivors. Assessments, manipulation detection, and pattern recognition â€” no signup required.',
    type: 'website',
    url: 'https://reclaimyourlife.app/free-tools',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Free narcissistic abuse recovery tools â€” start understanding in 30 seconds',
      },
    ],
  },
  alternates: {
    canonical: 'https://reclaimyourlife.app/free-tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Narcissistic Abuse Recovery Tools | Reclaim',
    description:
      'Free AI-powered assessments and manipulation detectors for abuse survivors. No signup required.',
  },
  robots: 'index, follow',
}

const freeTools = [
  {
    icon: FileCheck2,
    title: 'Free Assessment',
    description:
      'A thorough 25-question screening of the abuse patterns in your life. Identify communication breakdowns, boundary violations, and emotional safety concerns with clinical precision.',
    href: '/free-assessment',
    accent: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Relationship Health Check',
    description:
      'Answer 10 questions to find out if your relationship is healthy or toxic. A quick, evidence-based snapshot that cuts through confusion and gives you a clear score.',
    href: '/relationship-health-check',
    accent: 'green',
  },
  {
    icon: Brain,
    title: 'Free Narcissist Test',
    description:
      'AI identifies the narcissist type and manipulation tactics from your situation. Describe what is happening and get instant insight into covert, overt, grandiose, or malignant patterns.',
    href: '/free-narcissist-test',
    accent: 'hope',
  },
  {
    icon: Heart,
    title: 'Discard Stage Test',
    description:
      'Understand which discard stage you are in and what comes next. Whether you are being devalued, stonewalled, or discarded entirely, this tool maps the cycle.',
    href: '/discard-stage-test',
    accent: 'red',
  },
  {
    icon: Shield,
    title: 'Gaslighting Reality Check',
    description:
      'See manipulation patterns clearly when your reality is being denied. Document specific incidents and receive AI-powered analysis that validates what actually happened.',
    href: '/gaslighting-reality-check',
    accent: 'brand',
  },
] as const

const stats = [
  { value: 80000, suffix: '+', label: 'people used these tools' },
  { value: 70, suffix: '+', label: 'languages supported' },
  { value: 100, suffix: '%', label: 'private and anonymous' },
] as const

const whoThisIsFor = [
  {
    title: 'You feel confused after every conversation',
    description:
      'You walk away from interactions questioning your own memory, your own feelings, your own judgment. You know something is wrong but you cannot name it. These tools help you name it.',
  },
  {
    title: 'You have been told you are the problem',
    description:
      'They said you are too sensitive. That you are the narcissist. That everything would be fine if you just listened. If this sounds familiar, you are not alone and you are not imagining it.',
  },
  {
    title: 'You are looking for proof that this is real',
    description:
      'Maybe you need evidence for yourself. Maybe you need it for court. Maybe you just need someone to tell you that what you are experiencing is not normal. These assessments give you language and evidence.',
  },
] as const

const howItWorks = [
  {
    step: '01',
    title: 'Pick a tool',
    description:
      'Choose the assessment that matches where you are right now. Not sure where to begin? The Free Assessment covers the broadest range of abuse patterns.',
  },
  {
    step: '02',
    title: 'Answer honestly',
    description:
      'Each tool takes 1 to 5 minutes. There are no right or wrong answers. Trust what you feel, not what you have been told to feel.',
  },
  {
    step: '03',
    title: 'Get your results',
    description:
      'Receive a clear, evidence-based breakdown of what is happening. See patterns you may have missed. Get next steps that actually help.',
  },
] as const

export default function FreeToolsPage() {
  return (
    <QuizShell>
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Free tools â€” no signup required
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl font-bold text-ink-900 leading-tight">
            Start understanding in 30 seconds
          </h1>
          <p className="mt-5 text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Five free, anonymous tools designed for survivors of narcissistic abuse. They help you
            recognize manipulation patterns, validate your experience, and see clearly when
            everything feels confusing. Share the ones that help you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" aria-hidden="true" />
              100% anonymous
            </span>
            <span className="hidden sm:block text-ink-300">|</span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" aria-hidden="true" />
              70+ languages
            </span>
            <span className="hidden sm:block text-ink-300">|</span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden="true" />
              80,000+ people trust these tools
            </span>
          </div>
        </section>

        {/* Tool cards */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12" id="tools">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">
              Choose the tool that fits your situation
            </h2>
            <p className="mt-3 text-ink-600 max-w-xl mx-auto">
              Every tool runs without signup. Your answers are never stored, tracked, or shared. You
              get your results immediately.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((tool) => (
              <FeatureCard
                key={tool.href}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                accent={tool.accent}
              />
            ))}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-6 text-center">
              <p className="font-display text-2xl font-semibold text-ink-900">80,000+</p>
              <p className="mt-2 text-sm text-ink-600">
                people used these tools to recognize abuse patterns. You are not imagining it.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-10">
            How it works
          </h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <li key={item.step} className="relative rounded-2xl border border-ink-200 bg-white p-7 text-center">
                <span className="font-display text-4xl font-semibold text-brand-200">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Who this is for */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-hope-50 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-10">
              You are not imagining it
            </h2>
            <p className="text-center text-ink-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              If something feels wrong in your relationship, trust that feeling. These tools exist to
              help you understand what is happening â€” without telling you what to think or do.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {whoThisIsFor.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-ink-200 bg-white p-6"
                >
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-ink-200/70 bg-ink-50 py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Full experience CTA */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">
            Ready for the full experience?
          </h2>
          <p className="mt-4 text-ink-600 max-w-xl mx-auto leading-relaxed">
            These free tools are a starting point. Reclaim gives you an AI-powered journal,
            manipulation decoder, evidence exports, safety planning, and much more â€” all private,
            all encrypted, all yours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 shadow-sm"
            >
              View pricing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 px-7 py-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
            >
              Start free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-500">
            No credit card required. Start with the free Foundation plan and upgrade only when you
            are ready.
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Free Narcissistic Abuse Recovery Tools',
              description:
                'Free AI-powered assessment tools for survivors of narcissistic abuse. Recognize manipulation patterns, detect gaslighting, and validate your experience in 30 seconds.',
              url: 'https://reclaimyourlife.app/free-tools',
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: freeTools.map((tool, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: tool.title,
                  url: `https://reclaimyourlife.app${tool.href}`,
                  description: tool.description,
                })),
              },
              provider: {
                '@type': 'Organization',
                name: 'Reclaim',
                url: 'https://reclaimyourlife.app',
              },
            }),
          }}
        />
      </main>
    </QuizShell>
  )
}
