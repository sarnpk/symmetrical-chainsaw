import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AuthButton from '@/components/AuthButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, BookOpen, Brain, BarChart3, Heart, Lock } from 'lucide-react'

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
            <Shield className="h-8 w-8 text-indigo-600" />
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
            A secure, private platform designed specifically for survivors of narcissistic abuse. 
            Document your experiences, recognize patterns, and heal with AI-powered support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton variant="primary" />
            <button className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Tools for Your Recovery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Experience Journal</CardTitle>
                <CardDescription>
                  Document incidents with detailed descriptions, photos, and audio evidence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>AI Coach</CardTitle>
                <CardDescription>
                  Get personalized support and coping strategies from our trauma-informed AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Pattern Analysis</CardTitle>
                <CardDescription>
                  Identify abuse cycles and escalation patterns with intelligent analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Mind Reset Tools</CardTitle>
                <CardDescription>
                  Reframe negative thoughts and practice healthy coping mechanisms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Safety Planning</CardTitle>
                <CardDescription>
                  Create emergency plans and track personal boundaries
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="h-8 w-8 text-gray-600 mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  End-to-end encryption keeps your data safe and confidential
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
            Choose Your Recovery Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-green-600">Foundation</CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Basic tools to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Basic incident logging</li>
                  <li>✓ Photo evidence upload</li>
                  <li>✓ Educational content</li>
                  <li>✓ Safety planning tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative border-indigo-200 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-indigo-600">Recovery</CardTitle>
                <div className="text-3xl font-bold">$19.99<span className="text-base font-normal">/mo</span></div>
                <CardDescription>AI-powered recovery tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Foundation</li>
                  <li>✓ AI coach conversations</li>
                  <li>✓ Audio transcription</li>
                  <li>✓ Basic pattern analysis</li>
                  <li>✓ Mind reset exercises</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-purple-600">Empowerment</CardTitle>
                <div className="text-3xl font-bold">$39.99<span className="text-base font-normal">/mo</span></div>
                <CardDescription>Complete recovery suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Recovery</li>
                  <li>✓ Advanced AI features</li>
                  <li>✓ Pattern recognition</li>
                  <li>✓ Professional reports</li>
                  <li>✓ Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12 px-4">
        <div className="container mx-auto text-center text-gray-600">
          <p className="mb-4">
            &copy; 2024 Reclaim Platform. Your safety and privacy are our priority.
          </p>
          <p className="text-sm">
            This platform is designed for educational and support purposes. 
            Always consult with qualified professionals for medical or legal advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
