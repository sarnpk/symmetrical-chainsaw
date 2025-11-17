'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Heart, AlertTriangle, Shield, CheckCircle, XCircle, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface AssessmentQuestion {
  id: string
  question: string
  category: 'communication' | 'respect' | 'safety' | 'support' | 'boundaries'
  weight: number
}

const assessmentQuestions: AssessmentQuestion[] = [
  { id: 'q1', question: 'My partner listens to me without interrupting', category: 'communication', weight: 1 },
  { id: 'q2', question: 'I feel safe expressing my opinions and feelings', category: 'safety', weight: 2 },
  { id: 'q3', question: 'My partner respects my decisions and choices', category: 'respect', weight: 2 },
  { id: 'q4', question: 'I can maintain friendships and family relationships', category: 'boundaries', weight: 2 },
  { id: 'q5', question: 'My partner supports my goals and dreams', category: 'support', weight: 1 },
  { id: 'q6', question: 'I never feel afraid of my partner\'s reactions', category: 'safety', weight: 3 },
  { id: 'q7', question: 'We can disagree without name-calling or insults', category: 'communication', weight: 2 },
  { id: 'q8', question: 'My partner doesn\'t try to control my activities', category: 'boundaries', weight: 2 },
  { id: 'q9', question: 'I feel valued and appreciated in the relationship', category: 'respect', weight: 1 },
  { id: 'q10', question: 'My partner doesn\'t threaten or intimidate me', category: 'safety', weight: 3 },
  { id: 'q11', question: 'We share household and financial responsibilities fairly', category: 'respect', weight: 1 },
  { id: 'q12', question: 'I can say "no" without fear of consequences', category: 'boundaries', weight: 2 }
]

export default function RelationshipHealthAssessment() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [savedAssessments, setSavedAssessments] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadSavedAssessments()
  }, [])

  const loadSavedAssessments = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('relationship_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    setSavedAssessments(data || [])
  }

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

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateResults = async () => {
    let totalScore = 0
    let maxScore = 0
    const categoryScores: Record<string, { score: number; max: number }> = {}

    assessmentQuestions.forEach(q => {
      const answer = answers[q.id] || 0
      const weightedScore = answer * q.weight
      const weightedMax = 4 * q.weight // Max answer is 4

      totalScore += weightedScore
      maxScore += weightedMax

      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { score: 0, max: 0 }
      }
      categoryScores[q.category].score += weightedScore
      categoryScores[q.category].max += weightedMax
    })

    const overallScore = Math.round((totalScore / maxScore) * 100)
    
    const categoryResults = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      score: Math.round((scores.score / scores.max) * 100),
      status: scores.score / scores.max >= 0.7 ? 'healthy' : scores.score / scores.max >= 0.4 ? 'concerning' : 'unhealthy'
    }))

    const assessmentResults = {
      overallScore,
      categoryResults,
      riskLevel: overallScore >= 70 ? 'low' : overallScore >= 40 ? 'moderate' : 'high',
      recommendations: generateRecommendations(overallScore, categoryResults)
    }

    setResults(assessmentResults)
    setIsComplete(true)

    // Save to database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('relationship_assessments').insert({
        user_id: user.id,
        overall_score: overallScore,
        category_scores: categoryResults,
        risk_level: assessmentResults.riskLevel,
        answers: answers
      })
    }
  }

  const generateRecommendations = (score: number, categories: any[]) => {
    const recommendations = []

    if (score < 40) {
      recommendations.push({
        type: 'urgent',
        title: 'Consider Professional Support',
        description: 'Your assessment indicates concerning patterns. Consider speaking with a counselor or domestic violence advocate.',
        action: 'Find Support'
      })
    }

    categories.forEach(cat => {
      if (cat.status === 'unhealthy') {
        switch (cat.category) {
          case 'safety':
            recommendations.push({
              type: 'safety',
              title: 'Safety Concerns Identified',
              description: 'Create a safety plan and consider reaching out to the National Domestic Violence Hotline.',
              action: 'Safety Plan'
            })
            break
          case 'boundaries':
            recommendations.push({
              type: 'boundaries',
              title: 'Boundary Issues',
              description: 'Practice setting and maintaining healthy boundaries. Consider boundary-setting exercises.',
              action: 'Boundary Tools'
            })
            break
          case 'communication':
            recommendations.push({
              type: 'communication',
              title: 'Communication Patterns',
              description: 'Explore healthy communication techniques and consider couples counseling.',
              action: 'Communication Guide'
            })
            break
        }
      }
    })

    if (score >= 70) {
      recommendations.push({
        type: 'positive',
        title: 'Healthy Relationship Patterns',
        description: 'Your relationship shows many healthy signs. Continue nurturing these positive dynamics.',
        action: 'Maintain Health'
      })
    }

    return recommendations
  }

  const resetAssessment = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setIsComplete(false)
    setResults(null)
  }

  if (isComplete && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className={`h-6 w-6 ${results.riskLevel === 'low' ? 'text-green-600' : results.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`} />
              Relationship Health Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{results.overallScore}/100</div>
              <div className={`text-lg font-medium ${results.riskLevel === 'low' ? 'text-green-600' : results.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                {results.riskLevel === 'low' ? 'Healthy Relationship' : results.riskLevel === 'moderate' ? 'Some Concerns' : 'Significant Concerns'}
              </div>
              <Progress value={results.overallScore} className="mt-4" />
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.categoryResults.map((category: any) => (
                  <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {category.status === 'healthy' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : category.status === 'concerning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium capitalize">{category.category}</span>
                    </div>
                    <span className="font-semibold">{category.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                {results.recommendations.map((rec: any, index: number) => (
                  <Card key={index} className={`border-l-4 ${
                    rec.type === 'urgent' || rec.type === 'safety' ? 'border-red-500 bg-red-50' :
                    rec.type === 'boundaries' || rec.type === 'communication' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={resetAssessment} variant="outline">
                Take Again
              </Button>
              <Button onClick={() => window.print()}>
                Save Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = assessmentQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Card - Moved to top */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">About This Assessment</p>
              <p>This tool helps evaluate relationship dynamics and identify areas that may need attention. It's not a substitute for professional counseling but can guide you toward appropriate resources.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-600" />
            Relationship Health Assessment
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            <div className="space-y-3">
              {[
                { value: 4, label: 'Always true', color: 'green' },
                { value: 3, label: 'Often true', color: 'blue' },
                { value: 2, label: 'Sometimes true', color: 'yellow' },
                { value: 1, label: 'Rarely true', color: 'orange' },
                { value: 0, label: 'Never true', color: 'red' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                    answers[question.id] === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[question.id] && answers[question.id] !== 0}
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}