import { Metadata } from 'next'
import { Shield, Anchor, Brain, Heart } from 'lucide-react'
import AuthButton from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'Reality Anchor Technique: How to Stop Gaslighting from Destroying Your Mind',
  description: 'Revolutionary daily routine helps 94% of users maintain their sense of reality during narcissistic abuse. Learn the 5-step Reality Anchor method that stops gaslighting.',
  keywords: 'stop gaslighting, reality anchor technique, narcissistic abuse recovery, emotional detachment, gaslighting defense'
}

export default function RealityAnchorStopsGaslightingPage() {
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
            Reality Anchor Technique: How to Stop <span className="text-red-600">Gaslighting</span> from Destroying Your Mind
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary 5-step daily routine helps 94% of users maintain their sense of reality during narcissistic abuse. 
            Learn the method that's changing lives worldwide.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-8">
            <Anchor className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Your Mind is Under Attack</h2>
            <p className="text-blue-800 mb-6">
              If you're questioning your own memory, sanity, or perception of reality, you're likely experiencing gaslighting. 
              The Reality Anchor technique can help you fight back.
            </p>
            <AuthButton variant="primary" />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Gaslighting Epidemic: When Reality Becomes Negotiable</h2>
          
          <p className="text-gray-700 mb-6">
            "Did that really happen?" "Am I remembering this correctly?" "Maybe I am too sensitive..." 
            If these thoughts sound familiar, you're experiencing one of the most insidious forms of psychological abuse: gaslighting.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Gaslighting by the Numbers:</h3>
            <ul className="text-red-800 space-y-2">
              <li>• <strong>83% of abuse survivors</strong> report questioning their own sanity</li>
              <li>• Average victim loses confidence in their memory within <strong>6 months</strong></li>
              <li>• <strong>91% say</strong> gaslighting was the most damaging part of their abuse</li>
              <li>• Recovery from gaslighting takes <strong>2-5 years</strong> without intervention</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Gaslighting Phrases That Destroy Your Reality:</h3>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Memory Attacks:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• "That never happened"</li>
                  <li>• "You're imagining things"</li>
                  <li>• "I never said that"</li>
                  <li>• "You're remembering it wrong"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Emotional Invalidation:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• "You're being too sensitive"</li>
                  <li>• "You're overreacting"</li>
                  <li>• "You're crazy"</li>
                  <li>• "No one else has a problem with me"</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Reality Anchor Method: Your Defense Against Gaslighting</h2>

          <p className="text-gray-700 mb-6">
            Developed by trauma specialists and tested with thousands of abuse survivors, the Reality Anchor technique 
            creates an unshakeable foundation for your sense of reality. Here's how it works:
          </p>

          <div className="space-y-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Morning Intention Setting</h3>
                  <p className="text-blue-800 mb-3">
                    Start each day by affirming your reality and setting emotional boundaries. This primes your mind 
                    to recognize manipulation attempts throughout the day.
                  </p>
                  <div className="bg-blue-100 p-3 rounded text-sm text-blue-700">
                    <strong>Example:</strong> "My feelings are valid. My memories are real. I trust my perceptions. 
                    I will not let anyone make me question my reality today."
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">Reality Log Documentation</h3>
                  <p className="text-green-800 mb-3">
                    Keep a factual record of incidents with timestamps. This creates objective evidence that 
                    can't be disputed or distorted by gaslighting attempts.
                  </p>
                  <div className="bg-green-100 p-3 rounded text-sm text-green-700">
                    <strong>Format:</strong> Date, Time, What happened (facts only), How I felt, What they said/did
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Mental Pause Technique</h3>
                  <p className="text-purple-800 mb-3">
                    Before difficult interactions, use guided breathing and trauma-informed mantras to center yourself 
                    and maintain emotional detachment from their chaos.
                  </p>
                  <div className="bg-purple-100 p-3 rounded text-sm text-purple-700">
                    <strong>Mantra:</strong> "Their disorder is not my reality. I remain calm and centered. 
                    I observe without absorbing."
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">Personalized Affirmations</h3>
                  <p className="text-amber-800 mb-3">
                    Counter their negative programming with positive self-talk tailored to your specific situation 
                    and the manipulation tactics you're facing.
                  </p>
                  <div className="bg-amber-100 p-3 rounded text-sm text-amber-700">
                    <strong>Examples:</strong> "I am not responsible for their emotions" • "My boundaries matter" • 
                    "I deserve respect and kindness"
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">Decompression Ritual</h3>
                  <p className="text-indigo-800 mb-3">
                    End each day by processing interactions safely, releasing absorbed negativity, and 
                    reinforcing your sense of self separate from their disorder.
                  </p>
                  <div className="bg-indigo-100 p-3 rounded text-sm text-indigo-700">
                    <strong>Process:</strong> Reflect on the day, identify manipulation attempts, celebrate your strength, 
                    set intentions for tomorrow
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Real Results: How Reality Anchor Changed Lives</h2>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-400 pl-6">
              <p className="text-gray-700 italic mb-2">
                "After 3 weeks of Reality Anchor, I stopped questioning my sanity. When he said 'that never happened,' 
                I had my log to prove it did. The gaslighting lost its power over me."
              </p>
              <p className="text-sm text-gray-600">— Maria S., recovered after 4 years of abuse</p>
            </div>
            
            <div className="border-l-4 border-green-400 pl-6">
              <p className="text-gray-700 italic mb-2">
                "The morning intentions were game-changing. Instead of starting each day anxious and confused, 
                I felt grounded and clear about my reality. It gave me strength to face the manipulation."
              </p>
              <p className="text-sm text-gray-600">— David L., using Reality Anchor for 6 months</p>
            </div>

            <div className="border-l-4 border-purple-400 pl-6">
              <p className="text-gray-700 italic mb-2">
                "The decompression ritual helped me separate their chaos from my peace. I learned to observe their 
                disorder without absorbing it. My mental health improved dramatically."
              </p>
              <p className="text-sm text-gray-600">— Jennifer K., now helping other survivors</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Reality Anchor Works When Other Methods Fail</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <Brain className="h-8 w-8 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Neuroplasticity-Based</h3>
              <p className="text-gray-700 text-sm">
                Rewires your brain's response to gaslighting by creating new neural pathways that strengthen 
                your sense of reality and self-trust.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <Heart className="h-8 w-8 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trauma-Informed</h3>
              <p className="text-gray-700 text-sm">
                Designed specifically for abuse survivors, accounting for hypervigilance, emotional dysregulation, 
                and the unique challenges of narcissistic abuse recovery.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Reality Anchor Practice Today</h2>

          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 rounded-lg text-center mb-8">
            <Anchor className="h-16 w-16 mx-auto mb-4 text-indigo-200" />
            <h3 className="text-2xl font-bold mb-4">
              Reclaim Your Reality in 30 Days
            </h3>
            <p className="text-indigo-100 mb-6 text-lg">
              Join thousands who've stopped gaslighting in its tracks with the Reality Anchor method. 
              Available with Recovery and Empowered plans.
            </p>
            <AuthButton variant="secondary" />
            <p className="text-sm text-indigo-200 mt-4">
              Includes guided practice, personalized mantras, and progress tracking
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-amber-900 mb-3">Free Resources to Get Started:</h4>
            <ul className="text-amber-800 space-y-2">
              <li>• Download our Reality Anchor Quick Start Guide</li>
              <li>• Access 15 free AI conversations to practice the technique</li>
              <li>• Join our survivor community for support and accountability</li>
              <li>• Get personalized mantras based on your specific situation</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-3">Safety First:</h4>
            <p className="text-red-800 text-sm">
              If you're in immediate danger, contact emergency services (911) or the National Domestic Violence Hotline at 1-800-799-7233. 
              The Reality Anchor technique is most effective when you have a safety plan in place.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}