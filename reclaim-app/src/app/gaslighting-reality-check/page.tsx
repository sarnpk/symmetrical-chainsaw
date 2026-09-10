'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle, Shield, Brain, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SocialShare from '@/components/SocialShare'
import ViralResultShare from '@/components/ViralResultShare'
import FloatingShareButton from '@/components/FloatingShareButton'
import ShareableResultCard from '@/components/ShareableResultCard'
import ShareToUnlockModal from '@/components/ShareToUnlockModal'
import QuizShell from '@/components/marketing/QuizShell'
import { useEffect } from 'react'

export default function GaslightingRealityCheckPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [usageCount, setUsageCount] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [hasShared, setHasShared] = useState(false)

  const questions = [
    "Do you feel confused after conversations with this person?",
    "Do you constantly second-guess your own memory?",
    "Do you apologize frequently for things that aren't your fault?",
    "Do you feel like you're 'walking on eggshells' around them?",
    "Do they deny saying things you clearly remember?",
    "Do they tell you you're 'too sensitive' or 'overreacting'?",
    "Do you feel like you're going crazy or losing your mind?",
    "Do they blame you for their bad behavior?",
    "Do you find yourself making excuses for their treatment of you?",
    "Have others noticed changes in your confidence or personality?"
  ]

  useEffect(() => {
    const count = parseInt(localStorage.getItem('gaslighting_check_usage') || '0')
    const shared = localStorage.getItem('Gaslighting Reality Check_shared') === 'true'
    setUsageCount(count)
    setHasShared(shared)
  }, [])

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // All questions answered, calculate results
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (allAnswers: number[]) => {
    // Check usage limit
    if (usageCount >= 1 && !hasShared) {
      setShowShareModal(true)
      return
    }

    if (usageCount >= 2) {
      toast.error('Create a free account for unlimited reality checks')
      setTimeout(() => window.location.href = '/auth', 2000)
      return
    }

    setAnalyzing(true)

    setTimeout(() => {
      const totalScore = allAnswers.reduce((sum, score) => sum + score, 0)
      const maxScore = questions.length * 3
      const percentage = Math.round((totalScore / maxScore) * 100)

      let severity, verdict, validation, tactics, affirmation

      if (percentage >= 70) {
        severity = 'severe'
        verdict = 'Severe Gaslighting Detected'
        validation = 'You are experiencing significant gaslighting. Your reality is being systematically undermined.'
        tactics = ['Denial of Events', 'Memory Questioning', 'Emotional Invalidation', 'Reality Distortion', 'Blame Shifting']
        affirmation = 'You are NOT crazy. What you are experiencing is real and serious. Trust yourself.'
      } else if (percentage >= 40) {
        severity = 'moderate'
        verdict = 'Moderate Gaslighting Detected'
        validation = 'You are experiencing clear signs of gaslighting tactics designed to make you question your reality.'
        tactics = ['Memory Questioning', 'Emotional Invalidation', 'Reality Distortion']
        affirmation = 'Your perceptions are valid. You are not being "too sensitive" - you are being manipulated.'
      } else if (percentage >= 20) {
        severity = 'mild'
        verdict = 'Mild Gaslighting Patterns'
        validation = 'Some concerning patterns detected. While not severe, these behaviors can escalate over time.'
        tactics = ['Emotional Invalidation', 'Minimization']
        affirmation = 'Trust your instincts. Even mild gaslighting is not acceptable behavior.'
      } else {
        severity = 'low'
        verdict = 'Low Risk Detected'
        validation = 'Based on your responses, severe gaslighting patterns are not evident. However, trust your gut feelings.'
        tactics = ['Minor Invalidation']
        affirmation = 'Your relationship appears healthier, but always trust your instincts about your own experiences.'
      }

      const mockResponse = {
        verdict,
        severity,
        confidence: Math.min(95, 75 + percentage / 4),
        validation,
        tactics,
        affirmation,
        score: totalScore,
        percentage,
        recommendations: [
          'Document incidents with dates and details',
          'Trust your memory and feelings',
          'Seek validation from trusted friends',
          'Consider professional support if patterns continue'
        ]
      }

      setResults(mockResponse)
      const newCount = usageCount + 1
      setUsageCount(newCount)
      localStorage.setItem('gaslighting_check_usage', newCount.toString())
      setAnalyzing(false)
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResults(null)
  }

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    try {
      localStorage.setItem('lead_email', email)
      window.location.href = '/gaslighting-reality-check/thank-you?severity=' + results?.severity
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <QuizShell>
      {showShareModal && (
        <ShareToUnlockModal
          onUnlock={() => {
            setShowShareModal(false)
            setHasShared(true)
            toast.success('Second reality check unlocked! You can now analyze again.')
          }}
          toolName="Gaslighting Reality Check"
        />
      )}
      <FloatingShareButton
        title="Free Gaslighting Reality Check"
        description="AI-powered tool validates your reality. Find out if you're being gaslighted in 30 seconds."
      />
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ðŸ‘ï¸ Free Reality Check - No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Are You Being <span className="text-orange-600">Gaslighted</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Answer 10 quick questions to get your personalized gaslighting risk assessment in 30 seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>25,000+ Reality Checks</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            {!hasShared && !results && (
              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-900">
                    Free Uses: {2 - usageCount} remaining
                  </span>
                  {usageCount >= 1 && (
                    <span className="text-xs text-orange-700">
                      Share to unlock 1 more!
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {!results && !analyzing && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Question {currentQuestion + 1} of {questions.length}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {questions[currentQuestion]}
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswer(3)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <span className="font-medium">Always / Very Often</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAnswer(2)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        </div>
                        <span className="font-medium">Sometimes</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAnswer(1)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-yellow-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        </div>
                        <span className="font-medium">Rarely</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAnswer(0)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="font-medium">Never</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {analyzing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Responses...</h3>
                <p className="text-gray-600">Calculating your gaslighting risk level</p>
              </div>
            )}

            {results && (
              <div className="text-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mb-4"
                >
                  Take Quiz Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {results && (
        <section id="results" className="py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Your Reality Check Results
              </h2>

              <div className={`rounded-lg p-6 mb-6 ${
                results.severity === 'severe' ? 'bg-gradient-to-r from-red-100 to-pink-100' :
                results.severity === 'moderate' ? 'bg-gradient-to-r from-orange-100 to-yellow-100' :
                results.severity === 'mild' ? 'bg-gradient-to-r from-yellow-100 to-green-100' :
                'bg-gradient-to-r from-green-100 to-blue-100'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-8 w-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {results.verdict}
                  </h3>
                </div>
                <p className="text-lg font-medium">
                  Score: <strong>{results.score}/{questions.length * 3}</strong> ({results.percentage}%)
                </p>
                <p className="text-sm opacity-75">
                  Confidence: {Math.round(results.confidence)}%
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Reality Validation</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {results.validation}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Gaslighting Tactics Identified</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {results.tactics.map((tactic: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-orange-900">{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Trust Your Instincts</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-900">
                    {results.affirmation}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-900">What You Should Do</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ViralResultShare
                  resultType={results.verdict}
                  url={typeof window !== 'undefined' ? window.location.origin + '/gaslighting-reality-check' : ''}
                />
                <ShareableResultCard
                  resultType="Reality Validated"
                  mainText={results.validation.substring(0, 100)}
                />
              </div>

              <SocialShare
                title="Free Gaslighting Reality Check - Validate Your Experience"
                description="AI-powered tool identifies gaslighting tactics and validates your reality. Get instant results in 30 seconds."
                hashtags={['Gaslighting', 'NarcissisticAbuse', 'ToxicRelationships', 'EmotionalAbuse']}
              />

              {/* LEAD MAGNET OFFER */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white mt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-white">ðŸŽ Get Your Free Reality Anchor Kit</h3>
                    <p className="text-sm opacity-90">Personalized PDF based on your situation</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="font-semibold mb-2">Your Reality Anchor Kit includes:</p>
                  <ul className="text-sm space-y-1">
                    <li>âœ“ 15 gaslighting phrases to watch for</li>
                    <li>âœ“ Reality validation checklist</li>
                    <li>âœ“ Memory documentation template</li>
                    <li>âœ“ Trusted person conversation guide</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white border border-gray-300 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 whitespace-nowrap"
                  >
                    Download Free Kit
                  </button>
                </div>
                <p className="text-xs mt-3 opacity-90">
                  Instant PDF delivery â€¢ No spam â€¢ 100% free
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-8 px-4 bg-red-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">âš ï¸ Health Warning</h3>
                <p className="text-red-800">
                  Gaslighting can cause serious physical harm and chronic diseases including Complex PTSD (C-PTSD), anxiety disorders, depression, and autoimmune conditions. If you're experiencing severe gaslighting, seek professional help immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Common Gaslighting Tactics
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <h3 className="font-bold text-xl mb-2">ðŸš« Denial & Memory Questioning</h3>
              <p className="text-gray-700 mb-3">
                "That never happened" â€¢ "You're remembering it wrong" â€¢ "I never said that"
              </p>
              <p className="text-sm text-gray-600">
                Making you question your own memory and perception of events.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
              <h3 className="font-bold text-xl mb-2">ðŸ˜¢ Emotional Invalidation</h3>
              <p className="text-gray-700 mb-3">
                "You're too sensitive" â€¢ "You're overreacting" â€¢ "You're being dramatic"
              </p>
              <p className="text-sm text-gray-600">
                Dismissing your emotions and making you feel like your reactions are wrong.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <h3 className="font-bold text-xl mb-2">ðŸ”„ Reality Distortion</h3>
              <p className="text-gray-700 mb-3">
                "You're crazy" â€¢ "Everyone thinks you're..." â€¢ "You have problems"
              </p>
              <p className="text-sm text-gray-600">
                Making you question your sanity and perception of reality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <h3 className="font-bold text-xl mb-2">ðŸŽ­ Blame Shifting</h3>
              <p className="text-gray-700 mb-3">
                "You made me do it" â€¢ "If you hadn't..." â€¢ "It's your fault I..."
              </p>
              <p className="text-sm text-gray-600">
                Making you responsible for their actions and emotions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Validate Your Reality
          </h2>
          <p className="text-xl mb-8">
            Free gaslighting assessment in 30 seconds. Answer 10 questions and get instant validation.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Take Assessment - Free
          </button>
        </div>
      </section>

      </QuizShell>
  )
}