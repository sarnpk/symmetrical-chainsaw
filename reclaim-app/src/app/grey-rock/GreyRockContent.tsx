'use client'

import { useState } from 'react'
import { 
  RefreshCw,
  MessageCircle,
  Play,
  RotateCcw,
  CheckCircle,
  X,
  Lightbulb,
  AlertTriangle,
  Target,
  Book
} from 'lucide-react'

interface Scenario {
  id: string
  title: string
  description: string
  trigger: string
  goodResponse: string
  badResponse: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Work Performance Criticism',
    description: 'Your ex criticizes your work performance in front of your children',
    trigger: '"You\'re so incompetent at your job, no wonder the kids don\'t respect you."',
    goodResponse: '"Okay." (then redirect conversation to the children)',
    badResponse: '"That\'s not true! I work very hard and my boss appreciates me!"',
    explanation: 'The good response avoids taking the bait and doesn\'t provide emotional fuel. The bad response shows you\'re affected and gives them ammunition.',
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'Relationship Status Probing',
    description: 'They ask invasive questions about your dating life',
    trigger: '"So who are you seeing now? I bet they don\'t know how crazy you really are."',
    goodResponse: '"That\'s not something I discuss."',
    badResponse: '"I\'m not crazy! And my personal life is none of your business!"',
    explanation: 'Keep responses brief and don\'t defend yourself. Defending gives them the reaction they want.',
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'Financial Accusations',
    description: 'They accuse you of misusing money or being financially irresponsible',
    trigger: '"You\'re wasting money on stupid things while our kids need new clothes!"',
    goodResponse: '"I\'ll look into that."',
    badResponse: '"I bought one coffee! You spent hundreds on your hobbies!"',
    explanation: 'Don\'t justify your spending or counter-attack. A neutral acknowledgment ends the conversation.',
    difficulty: 'hard'
  },
  {
    id: '4',
    title: 'Parenting Criticism',
    description: 'They criticize your parenting decisions',
    trigger: '"You\'re too soft on the kids. That\'s why they don\'t listen to you."',
    goodResponse: '"I\'ll consider that."',
    badResponse: '"I\'m not too soft! You\'re the one who spoils them!"',
    explanation: 'Avoid defending your parenting style. A non-committal response doesn\'t give them fuel for argument.',
    difficulty: 'medium'
  },
  {
    id: '5',
    title: 'Emotional Manipulation',
    description: 'They try to make you feel guilty about the relationship ending',
    trigger: '"The kids are so sad about us not being together. You\'ve ruined their family."',
    goodResponse: '"That must be difficult for them."',
    badResponse: '"I didn\'t ruin anything! You did this to yourself!"',
    explanation: 'Acknowledge without taking responsibility. Don\'t defend your decision or blame them back.',
    difficulty: 'hard'
  }
]

export default function GreyRockContent() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [practiceMode, setPracticeMode] = useState<'learn' | 'practice'>('learn')

  const startPractice = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    setCurrentScenario(randomScenario)
    setSelectedResponse(null)
    setShowResult(false)
    setPracticeMode('practice')
  }

  const handleResponseSelect = (response: string) => {
    setSelectedResponse(response)
    setShowResult(true)
    
    if (currentScenario) {
      const isCorrect = response === currentScenario.goodResponse
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }))
    }
  }

  const nextScenario = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    setCurrentScenario(randomScenario)
    setSelectedResponse(null)
    setShowResult(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Target className="h-8 w-8 text-indigo-600" />
          Grey Rock Method
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Learn and practice the Grey Rock method - a technique to become uninteresting and unresponsive to narcissistic behavior, 
          reducing their motivation to engage with you.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setPracticeMode('learn')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              practiceMode === 'learn'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Book className="h-4 w-4 inline mr-2" />
            Learn
          </button>
          <button
            onClick={() => setPracticeMode('practice')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              practiceMode === 'practice'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play className="h-4 w-4 inline mr-2" />
            Practice
          </button>
        </div>
      </div>

      {practiceMode === 'learn' ? (
        <div className="space-y-6">
          {/* Grey Rock Principles */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Grey Rock Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Be Boring</h3>
                    <p className="text-sm text-gray-600">Give short, uninteresting responses that don't invite further conversation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Stay Neutral</h3>
                    <p className="text-sm text-gray-600">Don't show emotion, anger, or defensiveness - this is what they're seeking.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Limit Information</h3>
                    <p className="text-sm text-gray-600">Share as little personal information as possible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">End Quickly</h3>
                    <p className="text-sm text-gray-600">Keep interactions as brief as possible while remaining civil.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Scenarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-1">Trigger:</h4>
                    <p className="text-red-700 text-sm italic">{scenario.trigger}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 mb-1">Grey Rock Response:</h4>
                    <p className="text-green-700 text-sm">{scenario.goodResponse}</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-800 mb-1">Why This Works:</h4>
                    <p className="text-yellow-700 text-sm">{scenario.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Practice Mode */}
          {!currentScenario ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Practice?</h2>
              <p className="text-gray-600 mb-6">Test your Grey Rock skills with realistic scenarios</p>
              <button
                onClick={startPractice}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="h-4 w-4" />
                Start Practice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{currentScenario.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentScenario.difficulty)}`}>
                    {currentScenario.difficulty}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Score: {score.correct}/{score.total}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{currentScenario.description}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-red-800 mb-2">They say:</h3>
                <p className="text-red-700 italic">"{currentScenario.trigger}"</p>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-4">How do you respond?</h3>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleResponseSelect(currentScenario.goodResponse)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedResponse === currentScenario.goodResponse
                      ? showResult
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {currentScenario.goodResponse}
                  {showResult && selectedResponse === currentScenario.goodResponse && (
                    <CheckCircle className="h-5 w-5 text-green-500 float-right mt-0.5" />
                  )}
                </button>
                
                <button
                  onClick={() => handleResponseSelect(currentScenario.badResponse)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedResponse === currentScenario.badResponse
                      ? showResult
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {currentScenario.badResponse}
                  {showResult && selectedResponse === currentScenario.badResponse && (
                    <X className="h-5 w-5 text-red-500 float-right mt-0.5" />
                  )}
                </button>
              </div>
              
              {showResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700 text-sm">{currentScenario.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentScenario(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  End Practice
                </button>
                {showResult && (
                  <button
                    onClick={nextScenario}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    Next Scenario
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
