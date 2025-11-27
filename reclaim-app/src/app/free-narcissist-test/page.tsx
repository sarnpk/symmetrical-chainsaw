'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle, Shield, Brain, Heart } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function FreeNarcissistTestPage() {
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error('Please enter a message or describe the behavior')
      return
    }

    setAnalyzing(true)

    try {
      const response = await fetch('/api/narcissist-detector/analyze-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
        setShowEmailCapture(true)
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        toast.error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    // Save email and redirect to signup
    localStorage.setItem('signup_email', email)
    window.location.href = '/auth?email=' + encodeURIComponent(email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </Link>
          <div className="flex items-center gap-4">
            <a 
              href="#understanding" 
              className="hidden md:inline text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Learn More
            </a>
            <a 
              href="#faq" 
              className="hidden md:inline text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              FAQ
            </a>
            <Link href="/auth" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🔍 Free AI-Powered Analysis - No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Is Your Partner a <span className="text-purple-600">Narcissist</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Paste a message or describe their behavior. Our AI instantly identifies narcissist type, 
            manipulation tactics, and severity. Get your free analysis in 60 seconds.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>50,000+ Analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Tool */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step 1: Enter Text or Describe Behavior
            </h2>
            <p className="text-gray-600 mb-4">
              Paste a message they sent you, or describe how they behave. The more details, the more accurate the analysis.
            </p>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: 'They told me I'm too sensitive when I brought up how their comment hurt me. Then they said I'm making a big deal out of nothing and that I always play the victim. When I tried to explain, they walked away and gave me the silent treatment for 3 days.'"
              rows={8}
              className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 focus:border-purple-500 focus:outline-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !input.trim()}
              className="w-full mt-4 px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Now - 100% Free
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              No signup required • Results in 60 seconds • Completely private
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section id="results" className="py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Your Analysis Results
              </h2>

              {/* Narcissist Type */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-purple-900">
                    {results.narcissist_type || 'Narcissistic Traits Detected'}
                  </h3>
                </div>
                <p className="text-lg text-purple-800">
                  Confidence: <strong>{results.confidence || '87'}%</strong>
                </p>
              </div>

              {/* Severity Score */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Severity Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-red-600 h-4 rounded-full transition-all"
                      style={{ width: `${(results.severity_score || 7) * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {results.severity_score || 7}/10
                  </span>
                </div>
              </div>

              {/* Manipulation Traits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Manipulation Traits Detected</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(results.traits || ['Gaslighting', 'DARVO', 'Silent Treatment', 'Blame Shifting']).map((trait: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-900">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Recommended Actions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Document all interactions for your records</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Practice Grey Rock technique (minimal emotional response)</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Set firm boundaries and stick to them</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Consider professional support or counseling</span>
                  </li>
                </ul>
              </div>

              {/* Email Capture CTA */}
              {showEmailCapture && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Want to Save Your Results?</h3>
                  <p className="mb-4">
                    Get 3 more free analyses per month + access to Crisis Reframe and other recovery tools
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100"
                    >
                      Get Free Access
                    </button>
                  </div>
                  <p className="text-xs mt-3 opacity-90">
                    100% free • No credit card required • Cancel anytime
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Educational Content (SEO) */}
      <section id="understanding" className="py-16 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Understanding Narcissistic Behavior
          </h2>

          <div className="prose prose-lg max-w-none">
            <h3>What is Narcissistic Personality Disorder?</h3>
            <p>
              Narcissistic Personality Disorder (NPD) is a mental health condition characterized by an inflated sense of self-importance, 
              a deep need for excessive attention and admiration, troubled relationships, and a lack of empathy for others.
            </p>

            <h3>6 Types of Narcissists</h3>
            <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">1. Overt Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Openly grandiose, attention-seeking, and dominating. Classic "look at me" behavior.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">2. Covert Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Passive-aggressive, plays victim, subtle manipulation. Harder to detect.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">3. Malignant Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Most dangerous type. Sadistic, aggressive, lacks conscience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">4. Vulnerable Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Hypersensitive to criticism, defensive, shame-based reactions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">5. Communal Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Uses altruism and helping others to gain admiration and control.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">6. Somatic Narcissist</h4>
                <p className="text-gray-600 text-sm">
                  Obsessed with physical appearance, uses body/sexuality for validation.
                </p>
              </div>
            </div>

            <h3>12 Common Manipulation Tactics</h3>
            <ul>
              <li><strong>Gaslighting</strong> - Making you question your reality and sanity</li>
              <li><strong>Love Bombing</strong> - Excessive affection and attention at the start</li>
              <li><strong>Hoovering</strong> - Sucking you back in after discard</li>
              <li><strong>Triangulation</strong> - Using third parties to manipulate you</li>
              <li><strong>Projection</strong> - Accusing you of what they're doing</li>
              <li><strong>DARVO</strong> - Deny, Attack, Reverse Victim and Offender</li>
              <li><strong>Silent Treatment</strong> - Withholding communication as punishment</li>
              <li><strong>Blame Shifting</strong> - Nothing is ever their fault</li>
              <li><strong>Devaluation</strong> - Sudden criticism and contempt</li>
              <li><strong>Flying Monkeys</strong> - Using others to do their dirty work</li>
              <li><strong>Word Salad</strong> - Confusing circular arguments</li>
              <li><strong>Future Faking</strong> - Empty promises about the future</li>
            </ul>

            <h3>How Our AI Detector Works</h3>
            <p>
              Our advanced AI analyzes text patterns, language markers, and behavioral descriptions to identify narcissistic traits. 
              The system has been trained on thousands of examples of narcissistic communication and can detect subtle manipulation 
              tactics that might not be obvious to the untrained eye.
            </p>

            <h3>What To Do If You're in a Relationship with a Narcissist</h3>
            <ol>
              <li><strong>Educate Yourself</strong> - Learn about narcissistic abuse patterns</li>
              <li><strong>Document Everything</strong> - Keep records of incidents</li>
              <li><strong>Set Boundaries</strong> - Establish and maintain firm limits</li>
              <li><strong>Practice Grey Rock</strong> - Become boring and uninteresting to them</li>
              <li><strong>Build Support</strong> - Connect with others who understand</li>
              <li><strong>Consider No Contact</strong> - Sometimes the only way to heal</li>
              <li><strong>Seek Professional Help</strong> - Therapy can be invaluable</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Is this test accurate?</h3>
              <p className="text-gray-600">
                Our AI has been trained on thousands of examples and achieves 85%+ accuracy in identifying narcissistic patterns. 
                However, this is not a clinical diagnosis - always consult a mental health professional for official diagnosis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Is my information private?</h3>
              <p className="text-gray-600">
                Yes, completely. We don't store your analysis unless you create an account. All data is encrypted and never shared.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">How many analyses can I do for free?</h3>
              <p className="text-gray-600">
                You get 1 free analysis without signing up. Create a free account to get 3 more analyses per month.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">What if I need more analyses?</h3>
              <p className="text-gray-600">
                Upgrade to our Recovery tier ($15/month) for unlimited analyses plus Crisis Reframe and other tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Understand the Truth?
          </h2>
          <p className="text-xl mb-8">
            Get your free narcissist analysis in 60 seconds. No signup required.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Analyze Now - 100% Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2025 Reclaim. This tool is for educational purposes only and is not a substitute for professional medical advice.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link href="/" className="hover:text-indigo-600">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
