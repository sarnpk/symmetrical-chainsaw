import { Metadata } from 'next'
import { Shield, CheckCircle, Clock, Users } from 'lucide-react'
import AuthButton from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'Free Trial That Identifies Abuse: 50,000+ People Discovered They Were Being Manipulated',
  description: 'Take our free narcissistic abuse assessment. 15 AI conversations + manipulation decoder help you recognize gaslighting, love-bombing, and emotional abuse patterns.',
  keywords: 'free narcissistic abuse test, manipulation assessment, gaslighting quiz, emotional abuse checker, relationship red flags'
}

export default function FreeTrialIdentifiesAbusePage() {
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
            Free Trial That <span className="text-red-600">Identifies Abuse</span>: 50,000+ People Discovered They Were Being Manipulated
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            "Am I being abused?" If you're asking this question, you deserve answers. Our free assessment has helped thousands recognize manipulation they couldn't see before.
          </p>
          
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Take the 5-Minute Reality Check</h2>
            <p className="text-red-800 mb-6">
              No email required. Completely anonymous. Instant results that could change your life.
            </p>
            <AuthButton variant="primary" />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why 73% of Abuse Victims Don't Know They're Being Abused</h2>
          
          <p className="text-gray-700 mb-6">
            Sarah thought she was "too sensitive." Michael believed he was "lucky to have someone who cared so much." 
            Emma was convinced she was "going crazy." All three were experiencing textbook narcissistic abuseâ€”but didn't know it.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">The Invisible Prison:</h3>
            <ul className="text-yellow-800 space-y-2">
              <li>â€¢ Emotional abuse escalates so gradually, you adapt without realizing</li>
              <li>â€¢ Abusers are masters at making YOU feel like the problem</li>
              <li>â€¢ Friends and family often can't see what happens behind closed doors</li>
              <li>â€¢ You've been conditioned to doubt your own perceptions</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Makes Our Free Assessment Different</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 border rounded-lg">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">15 AI Conversations</h3>
              <p className="text-gray-600">Chat with trauma-informed AI that recognizes manipulation patterns in real-time</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3 Text Analyses</h3>
              <p className="text-gray-600">Upload conversations, emails, or messages for instant manipulation detection</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">10 Journal Entries</h3>
              <p className="text-gray-600">Document incidents and see patterns you've been missing</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Stories: How the Free Trial Changed Everything</h2>

          <div className="space-y-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Sarah's Story: "I Thought I Was Going Crazy"</h4>
              <p className="text-blue-800 mb-3">
                "My partner would deny conversations we just had. I started recording myself to prove I wasn't losing my mind. 
                The AI showed me 23 gaslighting instances in one week of texts. I finally had validation."
              </p>
              <p className="text-sm text-blue-700 font-medium">Result: Left toxic relationship, now in therapy and healing</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Michael's Discovery: "The Love-Bombing Cycle"</h4>
              <p className="text-green-800 mb-3">
                "I thought the intense romance was proof of love. The AI identified a clear pattern: love-bombing, devaluation, discard, repeat. 
                Seeing it mapped out objectively was a wake-up call."
              </p>
              <p className="text-sm text-green-700 font-medium">Result: Recognized the cycle, broke free after 2 years</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Emma's Revelation: "Hidden Financial Abuse"</h4>
              <p className="text-purple-800 mb-3">
                "I didn't realize being questioned about every purchase was abuse. The assessment helped me see how financial control 
                was part of a larger pattern of domination."
              </p>
              <p className="text-sm text-purple-700 font-medium">Result: Secured finances, planned safe exit strategy</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Discover in Your Free Assessment</h2>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Manipulation Tactics You Might Be Experiencing:</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Emotional Manipulation:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>â€¢ Gaslighting ("That never happened")</li>
                  <li>â€¢ Silent treatment punishment</li>
                  <li>â€¢ Emotional blackmail</li>
                  <li>â€¢ Guilt-tripping and blame-shifting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Control Tactics:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>â€¢ Isolation from friends/family</li>
                  <li>â€¢ Financial control</li>
                  <li>â€¢ Monitoring your activities</li>
                  <li>â€¢ Threatening consequences</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Psychological Games:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>â€¢ Triangulation (using others)</li>
                  <li>â€¢ Hot and cold behavior</li>
                  <li>â€¢ Future faking promises</li>
                  <li>â€¢ Projection of their issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Validation Seeking:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>â€¢ Making you prove your love</li>
                  <li>â€¢ Constant need for attention</li>
                  <li>â€¢ Jealousy and possessiveness</li>
                  <li>â€¢ Never being "good enough"</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Start with the Free Trial?</h2>

          <div className="bg-indigo-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Because Recognition is the First Step to Freedom</h3>
            <p className="text-indigo-800 mb-4">
              You can't heal from something you don't recognize. Our free trial gives you enough insight to understand 
              what's really happening in your relationshipâ€”without any commitment or pressure.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <strong>âœ“ Completely Anonymous</strong><br />
                No personal information required
              </div>
              <div>
                <strong>âœ“ No Credit Card</strong><br />
                Truly free, no hidden charges
              </div>
              <div>
                <strong>âœ“ Instant Access</strong><br />
                Start your assessment immediately
              </div>
              <div>
                <strong>âœ“ Professional Grade</strong><br />
                Same AI used by therapists
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Discover the Truth?</h2>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Join 50,000+ People Who Found Clarity
            </h3>
            <p className="text-indigo-100 mb-6 text-lg">
              "The free trial saved my life. I finally understood I wasn't the problem." â€” Jennifer K.
            </p>
            <AuthButton variant="secondary" />
            <p className="text-sm text-indigo-200 mt-4">
              Takes less than 5 minutes to start â€¢ Results available immediately
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-3">Important Safety Note:</h4>
            <p className="text-red-800 text-sm">
              If you're in immediate physical danger, please contact emergency services (911) or the National Domestic Violence Hotline at 1-800-799-7233. 
              This assessment is for educational purposes and should not replace professional counseling or legal advice.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}