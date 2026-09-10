import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  Shield,
  BookOpen,
  Brain,
  BarChart3,
  Heart,
  Lock,
  FileCheck2,
  Wind,
  HeartPulse,
  PenLine,
  Eye,
  Compass,
  Anchor,
  Users,
  Baby,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'
import Hero from '@/components/marketing/Hero'
import TrustBar from '@/components/marketing/TrustBar'
import SectionHeading from '@/components/marketing/SectionHeading'
import FeatureCard from '@/components/marketing/FeatureCard'
import TestimonialCard from '@/components/marketing/TestimonialCard'
import StatCounter from '@/components/marketing/StatCounter'
import PricingCard from '@/components/marketing/PricingCard'
import FaqAccordion from '@/components/marketing/FaqAccordion'
import CtaBanner from '@/components/marketing/CtaBanner'
import Reveal from '@/components/marketing/Reveal'

export const metadata: Metadata = {
  title: 'Reclaim - Private AI Recovery Journal for Abuse Survivors | Free Health Check',
  description:
    'Turn your history into evidence. A private AI-assisted journal and evidence platform for survivors of narcissistic abuse — free relationship health check, gaslighting tracker, and trauma-informed support in 70+ languages.',
  keywords:
    'narcissistic abuse recovery, relationship health assessment, gaslighting tracker, BIFF communication, trauma recovery, emotional abuse support, toxic relationship help, evidence journal',
  openGraph: {
    title: 'Reclaim - Turn your history into evidence. Your truth into recovery.',
    description:
      'Private AI-assisted journal and evidence platform for survivors of narcissistic abuse. Free relationship health assessment in 70+ languages.',
    type: 'website',
    url: 'https://reclaim.app',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Reclaim — turn your history into evidence. Your truth into recovery.' }],
  },
  alternates: {
    canonical: 'https://reclaim.app/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reclaim - Private Recovery Journal for Abuse Survivors',
    description: 'Free relationship health check and AI-powered recovery tools for narcissistic abuse survivors.',
  },
  robots: 'index, follow',
}

const valueProps = [
  { icon: PenLine, title: 'Document your reality', description: "Stop second-guessing yourself. Every entry is timestamped, encrypted, and stored exactly as you wrote it. No one can alter it. No one can deny it. When you need proof, you'll have it.", accent: 'brand' },
  { icon: Eye, title: 'See the patterns', description: "AI trained on thousands of real abuse scenarios. It recognizes gaslighting, DARVO, love bombing, stonewalling \u2014 even when you can't name them yourself. It shows you what's happening in plain language.", accent: 'hope' },
  { icon: Compass, title: 'Rebuild and protect', description: "Grey rock templates. BIFF responses. Boundary scripts. Crisis reframes. Everything you need to navigate conversations with someone who twists the truth \u2014 without losing yourself.", accent: 'green' },
] as const

const aboutPoints = [
  { icon: Shield, title: 'Trauma-informed by design', description: "Every interaction is built on clinical frameworks (CBT, DBT, distress tolerance) \u2014 but it never feels clinical." },
  { icon: Lock, title: 'Privacy is non-negotiable', description: "Your data is encrypted end-to-end. We can't read it. No one can. Not us. Not advertisers. Not anyone." },
  { icon: Brain, title: 'AI as a mirror, not a therapist', description: "Reclaim doesn't diagnose. It doesn't replace your therapist. It helps you see your own patterns more clearly." },
] as const

const audienceSegments = [
  { icon: Heart, title: "If you're in a relationship", description: "You love them. You also feel crazy. The highs are incredible and the lows are devastating. You've started to wonder if you're the narcissist. You're not. But you need clarity — and Reclaim gives it to you.", accent: 'brand' },
  { icon: Baby, title: "If you're co-parenting", description: 'Every pickup is a battle. Every text is a trap. They use the kids as messengers, weaponize the schedule, and tell the court you\'re the problem. Reclaim helps you document everything — clearly, credibly, and admissibly.', accent: 'hope' },
  { icon: Anchor, title: "If you've left", description: "The hardest part isn't leaving. It's staying gone. The hoovering. The \"I've changed\" texts. The mutual friends who don't believe you. Reclaim keeps you grounded in reality when the manipulation pulls you back.", accent: 'green' },
  { icon: Briefcase, title: "If you're at work", description: 'Your boss takes credit for your work. Your colleague gaslights you in meetings. HR doesn\'t help. You need documentation that\'s timestamped, organized, and ready for when you need it.', accent: 'blue' },
] as const

const freeTools = [
  { icon: BarChart3, title: 'Relationship Health Check', description: 'Answer 10 questions to find out if your relationship is healthy or toxic.', href: '/relationship-health-check', accent: 'green' },
  { icon: Brain, title: 'Free Narcissist Test', description: 'AI identifies the narcissist type and manipulation tactics from your situation.', href: '/free-narcissist-test', accent: 'hope' },
  { icon: Heart, title: 'Discard Stage Test', description: 'Understand which discard stage you are in — and what comes next.', href: '/discard-stage-test', accent: 'red' },
  { icon: Shield, title: 'Gaslighting Reality Check', description: 'See manipulation patterns clearly when your reality is being denied.', href: '/gaslighting-reality-check', accent: 'brand' },
  { icon: FileCheck2, title: 'Free Assessment', description: 'A thorough 25-question screening of the abuse patterns in your life.', href: '/free-assessment', accent: 'blue' },
] as const

const featuredTools = [
  { icon: Shield, title: 'Crisis Reframe', description: 'Immediate, trauma-informed intervention when you are in a panic moment — STOP, grounding, and hope-building narratives.', href: '/crisis-reframe', badge: 'Urgent', accent: 'red' },
  { icon: BarChart3, title: 'Narcissist Detector', description: 'Paste a message or describe behavior. AI identifies the narcissist type, 12 manipulation tactics, and a severity score.', href: '/narcissist-detector', badge: 'AI', accent: 'hope' },
  { icon: Brain, title: 'Narcissist Simulator', description: 'Practice Grey Rock, BIFF, and boundary setting in a safe AI simulation before you face the real thing.', href: '/narcissist-simulator', badge: 'AI', accent: 'brand' },
] as const

const features = [
  { icon: HeartPulse, title: 'Reality Anchor Routine', description: 'Morning Intentions, Mental Pause, and daily emotional detachment practice.', accent: 'amber' },
  { icon: Brain, title: 'Belief Reframe System', description: 'Challenge abuse-driven false beliefs with CBT techniques and AI-guided reality testing.', accent: 'green' },
  { icon: Heart, title: 'Positive Moments Journal', description: 'Capture counter-evidence that builds a truer record of your experience.', accent: 'blue' },
  { icon: Brain, title: 'Cognitive Dissonance Alerts', description: 'AI detects conflicting beliefs across journals and helps resolve them.', accent: 'amber' },
  { icon: Shield, title: 'BIFF Assistant', description: 'Master Brief, Informative, Friendly, Firm communication — with JADE detection.', accent: 'brand' },
  { icon: FileCheck2, title: 'Gaslighting Truth Journal', description: 'Document their lies vs. reality with audio, video, and image evidence.', accent: 'red' },
  { icon: BarChart3, title: 'Reactive Abuse Tracker', description: 'Track DARVO patterns and export clean reports when your concerns get turned around.', accent: 'hope' },
  { icon: Shield, title: 'Stonewalling Journal', description: 'Log silent treatment and emotional withdrawal with pattern tracking.', accent: 'green' },
  { icon: Wind, title: 'Urge Surfing', description: 'Ride the wave of urges without giving in — voice-guided and streak-backed.', accent: 'blue' },
  { icon: HeartPulse, title: 'Multilingual AI Coach', description: 'Trauma-informed support in 70+ languages including Urdu, Hindi, Arabic, and Spanish.', accent: 'hope' },
  { icon: BookOpen, title: 'Reality Log & Journal', description: 'Document incidents objectively with structured, evidence-grade templates.', accent: 'brand' },
  { icon: Lock, title: 'Safety & Boundaries', description: 'Emergency planning, Grey Rock techniques, and boundary-setting tools.', accent: 'green' },
] as const

const stats = [
  { value: 80000, suffix: '+', label: 'free assessments completed' },
  { value: 70, suffix: '+', label: 'languages supported' },
  { value: 100, suffix: '%', label: 'private by design' },
  { value: 24, suffix: '/7', label: 'crisis support access' },
] as const

const testimonials = [
  {
    quote:
      'I used Reclaim during my divorce. The journal helped me see the gaslighting clearly, and the export format was accepted by my attorney. It kept me sane through the hardest year of my life.',
    name: 'Amara R.',
    context: 'Survivor · divorce proceedings',
    verified: true,
  },
  {
    quote:
      'For the first time I had a record that proved I was not the crazy one. The manipulation decoder showed me the patterns I had been blaming myself for.',
    name: 'Daniel M.',
    context: 'Survivor · workplace gaslighting',
    verified: true,
  },
  {
    quote:
      'The crisis reframe tool talked me down in a moment I could not have handled alone. Knowing it is always there, private and judgment-free, changed everything.',
    name: 'Sofia L.',
    context: 'Survivor · 2 years in recovery',
    verified: false,
  },
  {
    quote:
      "Reclaim\u2019s documentation helped me win my custody case. My attorney said the evidence was the strongest he\u2019d seen in 20 years.",
    name: 'Jennifer K.',
    context: 'Survivor \u00b7 custody proceedings',
    verified: true,
  },
] as const

const howItWorks = [
  { step: '01', title: 'Document your reality', description: 'Journal incidents with timestamps, locations, and evidence — voice, photo, or video. Structured templates keep it objective.' },
  { step: '02', title: 'See the patterns', description: 'AI decodes gaslighting, love-bombing, triangulation, and other tactics. Watch your own history reveal the truth.' },
  { step: '03', title: 'Rebuild — and protect', description: 'Practice responses, build your safety plan, and export court-ready records. Your healing stays in your hands.' },
] as const

const pricingTiers = [
  {
    name: 'Foundation',
    price: '$0',
    period: 'free forever',
    description: 'Everything you need to start documenting.',
    accent: 'green',
    cta: { label: 'Start free', href: '/auth' },
    features: [
      { label: 'Journal & Reality Log: 3 entries/day', included: true },
      { label: 'Multilingual AI Coach: 5 chats/day', included: true },
      { label: 'Manipulation Decoder: 1 analysis/day', included: true },
      { label: 'Safety Plan & Grey Rock: full access', included: true },
      { label: '100 MB secure file storage', included: true },
      { label: 'Audio transcription & full AI analysis', included: false },
      { label: 'Court-ready PDF evidence exports', included: false },
    ],
  },
  {
    name: 'Recovery',
    price: '$15',
    period: '/mo',
    description: 'AI-powered recovery tools for the full journey.',
    popular: true,
    accent: 'brand',
    cta: { label: 'Start 7-day free trial', href: '/auth' },
    features: [
      { label: 'Belief Reframe: AI-guided CBT reality testing', included: true },
      { label: 'Positive Moments counter-evidence journal', included: true },
      { label: 'Advanced NPD trait library & pattern insights', included: true },
      { label: '60 min audio transcription / month', included: true },
      { label: '10 GB secure file storage', included: true },
      { label: 'Priority support & early feature access', included: true },
      { label: 'Unlimited journal & coach access', included: false },
    ],
  },
  {
    name: 'Empowered',
    price: '$24.99',
    period: '/mo',
    description: 'The complete recovery and evidence suite.',
    accent: 'hope',
    cta: { label: 'Go Empowered', href: '/auth' },
    features: [
      { label: 'Unlimited journal & reality-log entries', included: true },
      { label: 'Unlimited AI coach conversations', included: true },
      { label: 'Unlimited analyses & reality testing', included: true },
      { label: '300 min audio transcription / month', included: true },
      { label: '100 GB secure file storage', included: true },
      { label: 'Advanced behavior pattern dashboard', included: true },
      { label: '24/7 priority support & beta features', included: true },
    ],
  },
] as const

const faqItems = [
  {
    question: 'Is my data really private?',
    answer:
      'Yes. Your data is encrypted with AES-256 — the same standard banks use. We can\u2019t read it. We don\u2019t sell it. We don\u2019t use it to train AI models. It\u2019s yours, encrypted, and protected.',
  },
  {
    question: 'Can the person I\u2019m documenting find out I\u2019m using Reclaim?',
    answer:
      'No. Reclaim has no visible branding, no push notifications with sensitive content, and can be accessed from any device. Your usage is completely invisible.',
  },
  {
    question: 'Can I use this as evidence in court?',
    answer:
      'Yes. Every entry is timestamped, cryptographically signed, and stored with GPS location. Reclaim exports are formatted for court admissibility and have been accepted in family court, divorce proceedings, and workplace harassment cases.',
  },
  {
    question: 'Do I have to create an account to try the free tools?',
    answer:
      'No. The free assessment, relationship health check, narcissist test, discard stage test, and gaslighting check all run without signup \u2014 entirely anonymous. Create an account only when you want to save your history.',
  },
  {
    question: 'I\u2019m not sure I\u2019m being abused. Should I use this?',
    answer:
      "That\u2019s exactly who this is for. You don\u2019t need a diagnosis. You don\u2019t need proof. If something feels wrong, Reclaim helps you understand what\u2019s happening \u2014 without telling you what to think.",
  },
  {
    question: 'What if I\u2019m still in the relationship?',
    answer:
      'Reclaim is designed for people at every stage \u2014 whether you\u2019re in it, leaving, or long gone. Safety features like decoy mode and encrypted storage are built specifically for active situations.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. No contracts, no penalties, no \u201care you sure?\u201d screens. One click and you\u2019re done. Your data stays accessible even on the free plan.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your data never disappears. You can export everything before canceling, and your account stays accessible even on the free Foundation tier.',
  },
] as const

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        {/* Hero + trust bar */}
        <Hero />
        <div className="mt-4 pb-4">
          <TrustBar />
        </div>

        {/* Value propositions */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Why Reclaim"
              title="You're not imagining it. The patterns are real."
              lead="If you've ever left a conversation feeling confused, guilty, or crazy — when you know what they said happened differently — that's not you. That's a manipulation tactic. Reclaim helps you see it clearly for the first time."
            />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {valueProps.map((prop, i) => (
              <Reveal key={prop.title} delay={i * 100}>
                <div className="text-center">
                  <div className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${prop.accent === 'brand' ? 'bg-brand-100 text-brand-600' : prop.accent === 'hope' ? 'bg-hope-100 text-hope-600' : 'bg-green-100 text-green-600'}`}>
                    <prop.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{prop.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600 max-w-sm mx-auto">{prop.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Free tools (lead magnets) */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24" id="free-tools">
          <Reveal>
            <SectionHeading
              eyebrow="Free AI tools — no signup"
              title="Start understanding in 30 seconds"
              lead="Five free, anonymous tools that help you recognize abuse patterns and see clearly. Share the ones that help."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((tool, i) => (
              <Reveal key={tool.href} delay={i * 80} className="h-full">
                <FeatureCard {...tool} />
              </Reveal>
            ))}
            <Reveal delay={freeTools.length * 80} className="h-full">
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-6 text-center">
                <p className="font-display text-2xl font-semibold text-ink-900">80,000+</p>
                <p className="mt-2 text-sm text-ink-600">
                  people used these tools to recognize abuse patterns. You are not imagining it.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Featured AI tools */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-hope-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="The healing toolkit"
                title="Expert psychology, powered by AI"
                lead="Each tool pairs evidence-based methods with trauma-informed AI so you can react, document, and recover with confidence."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featuredTools.map((tool, i) => (
                <Reveal key={tool.href} delay={i * 100} className="h-full">
                  <FeatureCard {...tool} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Three steps from confusion to clarity" />
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Reveal key={step.step} delay={i * 100}>
                <li className="relative rounded-2xl border border-ink-200 bg-white p-7">
                  <span className="font-display text-4xl font-semibold text-brand-200">{step.step}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* About */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-hope-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Our story"
                title="Built by people who understand"
                lead="Reclaim was created for the person who sits in their car after a conversation, replaying every word, wondering if they're the problem. We know because we've been there."
              />
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {aboutPoints.map((point, i) => (
                <Reveal key={point.title} delay={i * 100}>
                  <div className="rounded-2xl border border-ink-200 bg-white p-7">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <point.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{point.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Learn More — Internal Links for SEO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Learn more"
              title="Understanding is the first step to healing"
              lead="Explore our guides to understand what you have been through and how to move forward."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'What Is Gaslighting?', description: 'Signs, real examples, and how to stop doubting your reality.', href: '/learn-more/gaslighting', accent: 'brand' },
              { title: 'Co-Parenting with a Narcissist', description: 'Communication strategies and documentation for court.', href: '/learn-more/co-parenting', accent: 'hope' },
              { title: 'Document Abuse for Court', description: 'How to build timestamped, court-admissible evidence.', href: '/learn-more/evidence', accent: 'green' },
              { title: 'How to Leave Safely', description: 'Safety planning, no contact, and recovery resources.', href: '/learn-more/leaving', accent: 'red' },
            ].map((item, i) => (
              <Reveal key={item.href} delay={i * 80}>
                <Link href={item.href} className="block h-full">
                  <div className={`h-full rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lift ${item.accent === 'brand' ? 'border-brand-200 bg-white' : item.accent === 'hope' ? 'border-hope-200 bg-white' : item.accent === 'green' ? 'border-green-200 bg-white' : 'border-dawn-100 bg-white'}`}>
                    <h3 className="font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                      Read more <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stats rail */}
        <section className="border-y border-ink-200/70 bg-ink-50 py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Evidence-based toolkit"
              title="Everything a survivor needs, in one private space"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 4) * 80} className="h-full">
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="bg-gradient-to-br from-hope-50 via-white to-brand-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Who this is for"
                title="You're not alone — and this was never your fault"
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {audienceSegments.map((segment, i) => (
                <Reveal key={segment.title} delay={i * 80}>
                  <div className={`h-full rounded-2xl border p-6 ${segment.accent === 'brand' ? 'border-brand-200 bg-white' : segment.accent === 'hope' ? 'border-hope-200 bg-white' : segment.accent === 'green' ? 'border-green-200 bg-white' : 'border-blue-200 bg-white'}`}>
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${segment.accent === 'brand' ? 'bg-brand-50 text-brand-600' : segment.accent === 'hope' ? 'bg-hope-50 text-hope-600' : segment.accent === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      <segment.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{segment.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{segment.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-br from-hope-50 via-white to-brand-50 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading eyebrow="Stories of reclaiming" title="You are heard, believed, and not alone" />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 100} className="h-full">
                  <TestimonialCard {...t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Simple, honest pricing"
              title="Start free. Upgrade when your healing deepens."
              lead="Every paid plan is month-to-month, cancel anytime. Your data never disappears if you downgrade."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3 items-stretch">
            {pricingTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100} className="h-full">
                <PricingCard {...tier} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-10 text-center">
              <a
                href="/pricing"
                className="inline-flex items-center gap-1 text-[15px] font-semibold text-brand-700 hover:text-brand-800 transition-colors"
              >
                View full comparison
                <span aria-hidden="true">→</span>
              </a>
            </p>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:pb-20">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="What people ask before they begin" />
          </Reveal>
          <div className="mt-12">
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Safety & Crisis */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <Reveal>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <Shield className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-red-900">Your safety comes first — always</h2>
              <p className="mt-3 text-sm text-red-800 max-w-xl mx-auto">
                If you're in immediate danger, please reach out. Reclaim is a tool for documentation and healing — not a replacement for professional support.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="text-red-900 font-semibold">Emergency: Call 911</div>
                <div className="hidden sm:block text-red-300">|</div>
                <div className="text-red-900">National DV Hotline: <span className="font-semibold">1-800-799-7233</span></div>
                <div className="hidden sm:block text-red-300">|</div>
                <div className="text-red-900">Crisis Text: Text <span className="font-semibold">HOME to 741741</span></div>
              </div>
              <div className="mt-6">
                <Link
                  href="/safety-plan"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Build your safety plan
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Final CTA */}
        <CtaBanner
          title="Begin today. Reclaim your peace."
          lead="Your history can become evidence, and your recovery can start tonight — privately, on your terms."
          cta={{ label: 'Start the free assessment', href: '/free-assessment' }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'SoftwareApplication',
                  name: 'Reclaim',
                  applicationCategory: 'HealthApplication',
                  operatingSystem: 'Web',
                  description:
                    'Private AI-assisted journal and evidence platform for survivors of narcissistic abuse. Free relationship health assessment and gaslighting tracker in 70+ languages.',
                  url: 'https://reclaim.app',
                  offers: {
                    '@type': 'AggregateOffer',
                    lowPrice: '0',
                    highPrice: '24.99',
                    priceCurrency: 'USD',
                    offerCount: '3',
                  },
                },
                {
                  '@type': 'Organization',
                  name: 'Reclaim',
                  url: 'https://reclaim.app',
                  description:
                    'Evidence-based recovery tools for survivors of narcissistic abuse, including free AI-powered health checks and a private journal.',
                },
              ],
            }),
          }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}