'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Shield, Brain } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import QuizShell from '@/components/marketing/QuizShell'

const questions = [
  "Do they lack empathy for your feelings or needs?",
  "Do they constantly need admiration and attention?",
  "Do they react with rage when criticized?",
  "Do they manipulate you with guilt or gaslighting?",
  "Do they take credit for your achievements?",
  "Do they have a sense of entitlement?",
  "Do they exploit others for personal gain?",
  "Do they show arrogance or haughty behaviors?",
  "Do they refuse to take responsibility for mistakes?",
  "Do they have shallow or superficial relationships?"
]

export default function FreeNarcissistTestPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [results, setResults] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    setUsageCount(parseInt(localStorage.getItem('narcissist_test_usage') || '0'))
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

    let type, severity, traits
    if (pct >= 70) {
      type = 'Malignant Narcissist'
      severity = 9
      traits = ['Lack of Empathy', 'Grandiosity', 'Manipulation', 'Rage', 'Exploitation']
    } else if (pct >= 50) {
      type = 'Overt Narcissist'
      severity = 7
      traits = ['Grandiosity', 'Need for Admiration', 'Entitlement', 'Arrogance']
    } else if (pct >= 30) {
      type = 'Covert Narcissist'
      severity = 5
      traits = ['Passive-Aggression', 'Victim Playing', 'Subtle Manipulation']
    } else {
      type = 'Low Narcissistic Traits'
      severity = 2
      traits = ['Some Self-Centeredness']
    }

    setResults({ type, severity, pct, traits, confidence: 85 + pct / 10 })
    localStorage.setItem('narcissist_test_usage', String(usageCount + 1))
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <QuizShell>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ðŸ” Free Test - No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Is Your Partner a <span className="text-purple-600">Narcissist</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Answer 10 quick questions. Get instant results in 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>50,000+ Tests Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>100% Private</span>
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
                    <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }}></div>
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
        <section id="results" className="py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Your Results</h2>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-bold">{results.type}</h3>
                </div>
                <p className="text-lg">Confidence: <strong>{Math.round(results.confidence)}%</strong></p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Severity Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-red-600 h-4 rounded-full" style={{ width: `${results.severity * 10}%` }}></div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{results.severity}/10</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Traits Detected</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {results.traits.map((trait: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Want More Tools?</h3>
                <p className="mb-4">Get 3 free analyses per month + Crisis Reframe and recovery tools</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                  />
                  <button
                    onClick={() => {
                      if (!email) return toast.error('Enter email')
                      localStorage.setItem('signup_email', email)
                      window.location.href = '/auth?email=' + encodeURIComponent(email)
                    }}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100"
                  >
                    Get Free Access
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
