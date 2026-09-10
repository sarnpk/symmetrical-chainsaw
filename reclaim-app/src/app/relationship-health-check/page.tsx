'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Shield, Brain, Heart } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import QuizShell from '@/components/marketing/QuizShell'

const questions = [
  "Do you feel safe expressing your feelings and opinions?",
  "Does your partner respect your boundaries?",
  "Do you feel valued and appreciated in the relationship?",
  "Can you be yourself without fear of judgment?",
  "Does your partner support your goals and dreams?",
  "Do you trust your partner?",
  "Is communication open and honest?",
  "Do you feel emotionally supported?",
  "Are conflicts resolved respectfully?",
  "Do you feel happy more often than not?"
]

export default function RelationshipHealthCheckPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [results, setResults] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    setUsageCount(parseInt(localStorage.getItem('relationship_health_usage') || '0'))
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

    let status, severity, concerns, recommendations
    if (pct >= 70) {
      status = 'Healthy Relationship'
      severity = 2
      concerns = ['Minor Communication Improvements', 'Maintain Current Dynamics']
      recommendations = [
        'Continue open communication',
        'Keep nurturing the relationship',
        'Address small issues before they grow',
        'Celebrate what\'s working well'
      ]
    } else if (pct >= 50) {
      status = 'Needs Attention'
      severity = 5
      concerns = ['Communication Issues', 'Boundary Problems', 'Trust Concerns']
      recommendations = [
        'Have honest conversations about concerns',
        'Consider couples counseling',
        'Set clear boundaries',
        'Work on rebuilding trust'
      ]
    } else if (pct >= 30) {
      status = 'Unhealthy Patterns'
      severity = 7
      concerns = ['Lack of Respect', 'Poor Communication', 'Emotional Unsafety', 'Control Issues']
      recommendations = [
        'Seek professional help immediately',
        'Document concerning behaviors',
        'Build support network',
        'Consider safety planning'
      ]
    } else {
      status = 'Toxic/Abusive Relationship'
      severity = 10
      concerns = ['Emotional Abuse', 'Control', 'Manipulation', 'Safety Risk']
      recommendations = [
        'Contact domestic violence hotline: 1-800-799-7233',
        'Create safety plan',
        'Reach out to trusted friends/family',
        'Consider leaving when safe to do so'
      ]
    }

    setResults({ status, severity, pct, concerns, recommendations, confidence: 90 })
    localStorage.setItem('relationship_health_usage', String(usageCount + 1))
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <QuizShell>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ❤️ Free Assessment - No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Is Your Relationship <span className="text-green-600">Healthy</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Answer 10 quick questions. Get instant relationship health assessment in 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>20,000+ Assessments</span>
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
                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }}></div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-6">{questions[currentQ]}</h3>
                
                <div className="space-y-3">
                  {[
                    { label: 'Always / Very Often', score: 3, color: 'green' },
                    { label: 'Sometimes', score: 2, color: 'yellow' },
                    { label: 'Rarely', score: 1, color: 'orange' },
                    { label: 'Never', score: 0, color: 'red' }
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
                  Take Assessment Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {results && (
        <section id="results" className="py-8 px-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Your Results</h2>

              <div className={`rounded-lg p-6 mb-6 ${
                results.severity <= 3 ? 'bg-gradient-to-r from-green-100 to-blue-100' :
                results.severity <= 6 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' :
                'bg-gradient-to-r from-red-100 to-pink-100'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold">{results.status}</h3>
                </div>
                <p className="text-lg">Health Score: <strong>{results.pct}%</strong></p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Severity Level</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className={`h-4 rounded-full ${
                      results.severity <= 3 ? 'bg-green-600' :
                      results.severity <= 6 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`} style={{ width: `${results.severity * 10}%` }}></div>
                  </div>
                  <span className="text-2xl font-bold">{results.severity}/10</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Areas of Concern</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {results.concerns.map((concern: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">{concern}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Recommended Actions</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-blue-800">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {results.severity >= 7 && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-red-900 mb-2">âš ï¸ Safety Warning</h3>
                      <p className="text-red-800 mb-2">
                        Your responses indicate concerning patterns. Please reach out for help:
                      </p>
                      <p className="text-red-900 font-bold">
                        National Domestic Violence Hotline: 1-800-799-7233
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Want Professional Support?</h3>
                <p className="mb-4">Get access to AI coach, journaling tools, and recovery resources</p>
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
