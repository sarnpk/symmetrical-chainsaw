import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AuthButton from '@/components/AuthButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, BookOpen, Brain, BarChart3, Heart, Lock } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reclaim - Recovery Platform for Narcissistic Abuse Survivors | Free Relationship Health Check',
  description: 'AI-powered recovery platform for narcissistic abuse survivors. Free relationship health assessment, BIFF communication tools, gaslighting tracker, and trauma-informed support in 70+ languages.',
  keywords: 'narcissistic abuse recovery, relationship health assessment, gaslighting tracker, BIFF communication, trauma recovery, emotional abuse support, toxic relationship help',
  openGraph: {
    title: 'Reclaim - Your Journey to Recovery Starts Here',
    description: 'Secure platform for narcissistic abuse survivors with AI-powered tools, free relationship assessment, and multilingual support.',
    type: 'website',
    url: 'https://reclaim.app',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Reclaim Recovery Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reclaim - Recovery Platform for Abuse Survivors',
    description: 'Free relationship health check and AI-powered recovery tools for narcissistic abuse survivors.',
  },
  robots: 'index, follow',
  canonical: 'https://reclaim.app'
}

export default async function HomePage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Journey to <span className="text-indigo-600">Recovery</span> Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The #1 recovery platform for narcissistic abuse survivors. Get your free relationship health assessment, AI-powered tools for healing, and evidence-based support in 70+ languages. Start your recovery journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton variant="primary" />
            <a href="/free-assessment" className="px-8 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors inline-block">
              Free Relationship Check
            </a>
            <a href="/learn-more" className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-block">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Evidence-Based Recovery Tools for Narcissistic Abuse Survivors
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-amber-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-8 w-8 text-amber-600" />
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Reality Anchor Routine</CardTitle>
                <CardDescription>
                  Daily emotional detachment practice with Morning Intentions, Mental Pause, and Decompression Rituals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-8 w-8 text-green-600" />
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Belief Reframe System</CardTitle>
                <CardDescription>
                  Challenge false beliefs from abuse with CBT techniques, AI-guided reality testing, and counter-evidence tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Positive Moments Journal</CardTitle>
                <CardDescription>
                  Capture good experiences to build counter-evidence against false beliefs and track your healing progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-amber-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-8 w-8 text-amber-600" />
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Cognitive Dissonance Alerts</CardTitle>
                <CardDescription>
                  AI detects conflicting beliefs across journals and helps resolve them with side-by-side comparisons
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-indigo-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-8 w-8 text-indigo-600" />
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>BIFF Assistant (Radical Non-Engagement)</CardTitle>
                <CardDescription>
                  Master Brief, Informative, Friendly, Firm communication with JADE detection and success metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-8 w-8 text-red-600" />
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Gaslighting Truth Journal</CardTitle>
                <CardDescription>
                  Document their lies vs reality with evidence (audio/video/images) and AI contradiction detection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Reactive Abuse Tracker</CardTitle>
                <CardDescription>
                  Track DARVO patterns when your concerns get turned against you with export reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-8 w-8 text-gray-600" />
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                </div>
                <CardTitle>Stonewalling Journal</CardTitle>
                <CardDescription>
                  Document silent treatment, withdrawal, and emotional unavailability with pattern tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-purple-200">
              <CardHeader>
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Multilingual AI Coach</CardTitle>
                <CardDescription>
                  Get trauma-informed support in 70+ languages including Urdu, Arabic, Hindi, Spanish, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Reality Log & Journal</CardTitle>
                <CardDescription>
                  Document incidents objectively and track emotional patterns with structured templates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Manipulation Decoder</CardTitle>
                <CardDescription>
                  Analyze messages and conversations to identify NPD tactics and get Grey Rock responses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Mind Reset & Wellness</CardTitle>
                <CardDescription>
                  Guided breathing, thought reframing, and personalized coping strategies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Safety & Boundaries</CardTitle>
                <CardDescription>
                  Emergency planning, Grey Rock techniques, and boundary-setting tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Affordable Recovery Plans - Start Free Today
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Foundation */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-green-600">Foundation</CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Basic access to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Reality Anchor: Morning Intentions & Mental Pause</li>
                  <li>✓ Journal & Reality Log: up to 3 entries per day</li>
                  <li>✓ Multilingual AI Coach: up to 5 chats per day</li>
                  <li>✓ Manipulation Decoder: 1 analysis per day</li>
                  <li>✓ Mind Reset & Wellness: 1 exercise per day</li>
                  <li>✓ Safety Plan & Grey Rock: full access</li>
                  <li>✗ Audio transcription not included</li>
                  <li>✓ 100 MB secure file storage</li>
                </ul>
              </CardContent>
            </Card>

            {/* Recovery (Popular) */}
            <Card className="relative border-indigo-200 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-indigo-600">Recovery</CardTitle>
                <div className="text-3xl font-bold">$15.00<span className="text-base font-normal">/mo</span></div>
                <CardDescription>AI-powered recovery tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Reality Anchor: Complete routine with streak tracking</li>
                  <li>✓ Journal & Reality Log: plenty of entries daily</li>
                  <li>✓ Belief Reframe: AI-guided CBT reality testing</li>
                  <li>✓ Positive Moments: Counter-evidence journal</li>
                  <li>✓ Multilingual AI Coach: frequent daily conversations</li>
                  <li>✓ Manipulation Decoder: multiple analyses per day</li>
                  <li>✓ Mind Reset & Wellness: several exercises daily</li>
                  <li>✓ Advanced NPD trait library & pattern insights</li>
                  <li>✓ 60 minutes of audio transcription monthly</li>
                  <li>✓ 10 GB secure file storage</li>
                  <li>✓ Priority support & early feature access</li>
                </ul>
              </CardContent>
            </Card>

            {/* Empowered */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-purple-600">Empowered</CardTitle>
                <div className="text-3xl font-bold">$24.99<span className="text-base font-normal">/mo</span></div>
                <CardDescription>Complete recovery suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Reality Anchor: Unlimited with advanced analytics</li>
                  <li>✓ Journal & Reality Log: unlimited daily entries</li>
                  <li>✓ Belief Reframe: Unlimited AI reality testing</li>
                  <li>✓ Positive Moments: Unlimited entries</li>
                  <li>✓ Multilingual AI Coach: unlimited conversations</li>
                  <li>✓ Manipulation Decoder: unlimited analyses</li>
                  <li>✓ Mind Reset & Wellness: unlimited exercises</li>
                  <li>✓ Advanced behavior pattern dashboard</li>
                  <li>✓ 300 minutes of audio transcription monthly</li>
                  <li>✓ 100 GB secure file storage</li>
                  <li>✓ 24/7 priority support & beta features</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <a href="/pricing" className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">View Full Comparison</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-gray-600 mb-6">
            <p className="mb-4">
              &copy; 2025 Reclaim Platform. Your safety and privacy are our priority.
            </p>
            <p className="text-sm mb-6">
              This platform is designed for educational and support purposes. 
              Always consult with qualified professionals for medical or legal advice.
            </p>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 border-t pt-6">
            <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
            <a href="/gdpr" className="hover:text-indigo-600 transition-colors">Data Rights</a>
            <a href="mailto:support@reclaim.app" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
