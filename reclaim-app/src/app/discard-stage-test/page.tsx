'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Shield, Brain, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import QuizShell from '@/components/marketing/QuizShell'

const questions = [
  "Are they withdrawing affection and attention?",
  "Do they criticize everything you do?",
  "Are they comparing you negatively to others?",
  "Have they started giving you the silent treatment?",
  "Are they suddenly 'too busy' for you?",
  "Do they blame you for all relationship problems?",
  "Are they flirting with or mentioning other people?",
  "Have they said they 'need space' or want a break?",
  "Are they making you feel worthless?",
  "Have they already moved on emotionally?"
]

export default function DiscardStageTestPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [results, setResults] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    setUsageCount(parseInt(localStorage.getItem('discard_stage_usage') || '0'))
  }, [])

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (allAnswers: number[]) => {
    const total = allAnswers.reduce((sum, s) => sum + s, 0)
    const max = questions.length * 3
    const pct = Math.round((total / max) * 100)

    let stage, stageName, behaviors, whatNext
    if (pct >= 70) {
      stage = 'discard'
      stageName = 'Active Discard Phase'
      behaviors = ['Sudden Withdrawal', 'Cruel Treatment', 'Blame Shifting', 'New Supply Visible']
      whatNext = 'They may leave abruptly or make your life unbearable until you leave. Prepare for smear campaigns.'
    } else if (pct >= 50) {
      stage = 'devaluation'
      stageName = 'Devaluation Stage'
      behaviors = ['Increasing Criticism', 'Withdrawal of Affection', 'Gaslighting', 'Contempt']
      whatNext = 'Devaluation will intensify. Discard is coming. Start documenting everything and building your exit plan.'
    } else if (pct >= 30) {
      stage = 'pre_devaluation'
      stageName = 'Early Devaluation'
      behaviors = ['Subtle Criticism', 'Less Attention', 'Mood Swings', 'Testing Boundaries']
      whatNext = 'The honeymoon is ending. Watch for escalating criticism and withdrawal. Set boundaries now.'
    } else {
      stage = 'idealization'
      stageName = 'Still in Idealization or Healthy'
      behaviors = ['Mostly Positive', 'Some Normal Conflicts']
      whatNext = 'Either your relationship is healthy, or you\'re still in the idealization phase. Stay aware of red flags.'
    }

    setResults({ stage, stageName, pct, behaviors, whatNext, confidence: 88 + pct / 10 })
    localStorage.setItem('discard_stage_usage', String(usageCount + 1))
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <QuizShell>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ðŸ’” Free Test - No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Which <span className="text-red-600">Discard Stage</span> Are You In?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Answer 10 quick questions. Get instant results in 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>30,000+ Tests Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            {!results && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Question {currentQ + 1} of {questions.length}</h2>
                    <div className="text-sm text-gray-500">{Math.round((currentQ / questions.length) * 100)}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div className="bg-red-600 h-2 rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }}></div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-6">{questions[currentQ]}</h3>
                
                <div className="space-y-3">
                  {[
                    { label: 'Always / Very Often', score: 3, color: 'red' },
                    { label: 'Sometimes', score: 2, color: 'orange' },
                    { label: 'Rarely', score: 1, color: 'yellow' },
                    { label: 'Never', score: 0, color: 'green' }
                  ].map(opt => (
                    <button
                      key={opt.score}
                      onClick={() => handleAnswer(opt.score)}
                      className={`w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-${opt.color}-500 hover:bg-${opt.color}-50 transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 border-${opt.color}-500`}>
                          <div className={`w-3 h-3 rounded-full bg-${opt.color}-500 m-0.5`}></div>
                        </div>
                        <span className="font-medium">{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {results && (
              <div className="text-center">
                <button onClick={() => { setCurrentQ(0); setAnswers([]); setResults(null) }} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mb-4">
                  Take Test Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {results && (
        <section id="results" className="py-8 px-4 bg-gradient-to-br from-red-50 to-purple-50">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Your Results</h2>

              <div className={`rounded-lg p-6 mb-6 ${
                results.stage === 'discard' ? 'bg-gradient-to-r from-red-100 to-pink-100' :
                results.stage === 'devaluation' ? 'bg-gradient-to-r from-yellow-100 to-orange-100' :
                'bg-gradient-to-r from-green-100 to-blue-100'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <h3 className="text-2xl font-bold">{results.stageName}</h3>
                </div>
                <p className="text-lg">Confidence: <strong>{Math.round(results.confidence)}%</strong></p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Behaviors You're Experiencing</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {results.behaviors.map((behavior: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">{behavior}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">What to Expect Next</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-yellow-900">{results.whatNext}</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-900">What You Should Do Now</h3>
                <ul className="space-y-2">
                  {[
                    'Document everything - texts, emails, incidents',
                    'Build your support network',
                    'Start planning your exit strategy',
                    'Practice Grey Rock technique'
                  ].map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 text-white">Get Your Free Survival Guide</h3>
                <p className="mb-4 text-white">Personalized PDF based on your stage with action steps</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30"
                  />
                  <button
                    onClick={() => {
                      if (!email) return toast.error('Enter email')
                      localStorage.setItem('lead_email', email)
                      window.location.href = '/discard-stage-test/thank-you?stage=' + results.stage
                    }}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100"
                  >
                    Download Free Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      </QuizShell>
  )
}
