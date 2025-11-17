'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Heart, AlertTriangle, Shield, CheckCircle, XCircle, Info, ArrowRight, Brain } from 'lucide-react'
import Link from 'next/link'

const assessmentQuestions = [
  { id: 'q1', question: 'My partner listens to me without interrupting', category: 'communication', weight: 1 },
  { id: 'q2', question: 'I feel safe expressing my opinions and feelings', category: 'safety', weight: 2 },
  { id: 'q3', question: 'My partner respects my decisions and choices', category: 'respect', weight: 2 },
  { id: 'q4', question: 'I can maintain friendships and family relationships', category: 'boundaries', weight: 2 },
  { id: 'q5', question: 'My partner supports my goals and dreams', category: 'support', weight: 1 },
  { id: 'q6', question: 'I never feel afraid of my partner\'s reactions', category: 'safety', weight: 3 },
  { id: 'q7', question: 'We can disagree without name-calling or insults', category: 'communication', weight: 2 },
  { id: 'q8', question: 'My partner doesn\'t try to control my activities', category: 'boundaries', weight: 2 }
]

export default function FreeAssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    let totalScore = 0
    let maxScore = 0

    assessmentQuestions.forEach(q => {
      const answer = answers[q.id] || 0
      const weightedScore = answer * q.weight
      const weightedMax = 4 * q.weight
      totalScore += weightedScore
      maxScore += weightedMax
    })

    const overallScore = Math.round((totalScore / maxScore) * 100)
    const riskLevel = overallScore >= 70 ? 'low' : overallScore >= 40 ? 'moderate' : 'high'

    // AI insights only for signed-up users
    setResults({ overallScore, riskLevel })
    
    setIsComplete(true)
  }

  const resetAssessment = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setIsComplete(false)
    setResults(null)
  }

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-3">
                <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">Reclaim</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sign In
                </Link>
                <Link href="/auth" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Results Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Results Header */}
            <div className={`px-8 py-8 text-white bg-gradient-to-r ${
              results.riskLevel === 'low' ? 'from-green-500 to-emerald-600' :
              results.riskLevel === 'moderate' ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-red-600'
            }`}>
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h1 className="text-3xl font-bold mb-2">Your Relationship Health Score</h1>
                <div className="text-6xl font-bold mb-2">{results.overallScore}/100</div>
                <div className="text-xl font-medium opacity-90">
                  {results.riskLevel === 'low' ? 'Healthy Patterns' : results.riskLevel === 'moderate' ? 'Some Concerns' : 'Significant Concerns'}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    results.riskLevel === 'low' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    results.riskLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  style={{ width: `${results.overallScore}%` }}
                />
              </div>

              {/* AI Insights Preview */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Brain className="h-8 w-8 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-indigo-900">AI-Powered Insights Available</h3>
                  </div>
                  <p className="text-indigo-700 text-lg">
                    Get personalized strengths analysis, specific areas to focus on, and tailored action steps
                  </p>
                  <div className="bg-white/70 p-4 rounded-lg border border-indigo-300 max-w-md mx-auto">
                    <p className="text-gray-700 italic">"Your relationship shows strong communication patterns but may benefit from boundary work..."</p>
                  </div>
                </div>
              </div>

              {/* Safety Alert */}
              {results.riskLevel !== 'low' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-2">Important Resources</h4>
                      <p className="text-red-800 leading-relaxed">
                        If you're experiencing abuse, help is available. National Domestic Violence Hotline: 1-800-799-7233
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Take Action?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Get AI-powered insights, personalized tools, track your progress, and access professional resources with Reclaim.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Link href="/auth">
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                      Start Your Journey Free <ArrowRight className="ml-2 h-5 w-5 inline" />
                    </button>
                  </Link>
                  <button 
                    onClick={resetAssessment}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all"
                  >
                    Retake Assessment
                  </button>
                </div>
                <div className="flex justify-center items-center gap-6 text-sm opacity-90">
                  <span>✓ No credit card required</span>
                  <span>✓ Private & secure</span>
                  <span>✓ Evidence-based tools</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const question = assessmentQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">Reclaim</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/auth" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Free Relationship Health Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take our evidence-based relationship health check to identify potential concerns and get personalized insights for healthier relationships
          </p>
        </section>

        {/* Assessment Card */}
        <div className="max-w-2xl mx-auto">
          {/* Info Banner */}
          <aside className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8" role="complementary">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-blue-900 mb-2">About This Relationship Health Assessment</h2>
                <p className="text-blue-800 leading-relaxed">
                  This evidence-based tool evaluates communication, safety, boundaries, respect, and support in relationships. 
                  Used by thousands to identify unhealthy patterns and access appropriate resources. Not a substitute for professional counseling.
                </p>
              </div>
            </div>
          </aside>

          {/* Progress Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-7 w-7" />
                <h2 className="text-2xl font-bold">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm opacity-90">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>{assessmentQuestions.length - currentQuestion - 1} remaining</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Content */}
            <section className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                {question.question}
              </h2>
              
              <div className="space-y-4">
                {[
                  { value: 4, label: 'Always true', gradient: 'from-green-500 to-emerald-600' },
                  { value: 3, label: 'Often true', gradient: 'from-blue-500 to-indigo-600' },
                  { value: 2, label: 'Sometimes true', gradient: 'from-yellow-500 to-orange-500' },
                  { value: 1, label: 'Rarely true', gradient: 'from-orange-500 to-red-500' },
                  { value: 0, label: 'Never true', gradient: 'from-red-500 to-red-600' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 group ${
                      answers[question.id] === option.value
                        ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg transform scale-[1.02]`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <span className={`text-lg font-medium ${
                      answers[question.id] === option.value ? 'text-white' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                ← Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={!answers[question.id] && answers[question.id] !== 0}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                  (!answers[question.id] && answers[question.id] !== 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {currentQuestion === assessmentQuestions.length - 1 ? 'Get Results' : 'Next'} →
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <p className="text-purple-700">
              Powered by <span className="font-bold">Reclaim</span> - Trusted by thousands for relationship health and abuse recovery
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}