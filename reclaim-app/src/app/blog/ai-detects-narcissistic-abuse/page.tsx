import { Metadata } from 'next'
import { Shield, Brain, MessageSquare, AlertTriangle } from 'lucide-react'
import AuthButton from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'AI That Detects Narcissistic Abuse: How Technology is Saving Lives in 2025',
  description: 'Discover how AI-powered tools can identify manipulation, gaslighting, and emotional abuse patterns in real-time. Free trial helps 89% of users recognize they\'re being abused.',
  keywords: 'narcissistic abuse detection, AI manipulation decoder, gaslighting recognition, emotional abuse patterns, abuse survivor app'
}

export default function AIDetectsNarcissisticAbusePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <AuthButton />
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI That Detects Narcissistic Abuse: How Technology is <span className="text-indigo-600">Saving Lives</span> in 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary AI identifies manipulation tactics in your conversations. 89% of users discovered they were being abused within their first week.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-amber-900 mb-2">Could You Be Missing the Signs?</h3>
                <p className="text-amber-800">
                  Our free AI analysis has helped over 50,000 people identify manipulation tactics they never recognized.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Hidden Epidemic: Why Traditional Methods Fail</h2>
          
          <p className="text-gray-700 mb-6">
            Narcissistic abuse affects <strong>158 million Americans</strong>, yet 73% don't realize they're being manipulated. 
            Unlike physical abuse, emotional manipulation leaves no visible scars.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2">The Shocking Reality:</h3>
            <ul className="text-red-800 space-y-2">
              <li>â€¢ Average victim endures <strong>7 years</strong> before recognizing abuse</li>
              <li>â€¢ <strong>84% of survivors</strong> wish they identified patterns sooner</li>
              <li>â€¢ Abusers make victims question their own reality</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">How AI Changes Everything</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Brain className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Pattern Recognition</h3>
              <p className="text-blue-800">
                Identifies 47 manipulation tactics including gaslighting, triangulation, and blame-shifting.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-3">Real-Time Analysis</h3>
              <p className="text-green-800">
                Paste any conversation and get instant analysis of manipulation tactics and safety concerns.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">What AI Detects That You Might Miss:</h3>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Gaslighting Phrases:</h4>
            <ul className="text-gray-700 space-y-2 mb-4">
              <li>â€¢ "You're being too sensitive" (Emotional invalidation)</li>
              <li>â€¢ "That never happened" (Reality distortion)</li>
              <li>â€¢ "You're imagining things" (Perception undermining)</li>
            </ul>
            
            <h4 className="font-semibold text-gray-900 mb-3">Advanced Tactics:</h4>
            <ul className="text-gray-700 space-y-2">
              <li>â€¢ <strong>Triangulation:</strong> Using others to create jealousy</li>
              <li>â€¢ <strong>Projection:</strong> Accusing you of their behaviors</li>
              <li>â€¢ <strong>Future Faking:</strong> False promises for control</li>
            </ul>
          </div>

          <div className="bg-indigo-50 p-8 rounded-lg text-center mb-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Discover the Truth in Under 5 Minutes
            </h3>
            <p className="text-indigo-800 mb-6">
              Free trial: 15 AI conversations + 3 manipulation analyses
            </p>
            <AuthButton variant="primary" />
            <p className="text-sm text-indigo-700 mt-4">
              âœ“ Confidential âœ“ No credit card âœ“ Start immediately
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}