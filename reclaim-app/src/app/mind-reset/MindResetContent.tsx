'use client'

import { useState } from 'react'
import {
  Lightbulb,
  RefreshCw,
  Heart,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  Volume2
} from 'lucide-react'

interface ThoughtPattern {
  id: string
  category: 'catastrophizing' | 'self-blame' | 'all-or-nothing' | 'mind-reading' | 'fortune-telling'
  title: string
  description: string
  example: string
  reframe: string
}

const thoughtPatterns: ThoughtPattern[] = [
  {
    id: '1',
    category: 'catastrophizing',
    title: 'Catastrophizing',
    description: 'Assuming the worst possible outcome will happen',
    example: "If I leave this relationship, I'll never find love again and I'll be alone forever.",
    reframe: "Ending an unhealthy relationship opens up space for healthier connections. Many people find fulfilling relationships after difficult ones."
  },
  {
    id: '2',
    category: 'self-blame',
    title: 'Self-Blame',
    description: 'Taking responsibility for things outside your control',
    example: "It's my fault they got angry. I should have known better than to bring that up.",
    reframe: "I am not responsible for someone else's emotional reactions. Their anger is their choice and responsibility."
  },
  {
    id: '3',
    category: 'all-or-nothing',
    title: 'All-or-Nothing Thinking',
    description: 'Seeing situations in black and white with no middle ground',
    example: "I'm either perfect or I'm a complete failure. There's no in-between.",
    reframe: "Life exists in shades of gray. I can make mistakes and still be a good person who is learning and growing."
  },
  {
    id: '4',
    category: 'mind-reading',
    title: 'Mind Reading',
    description: 'Assuming you know what others are thinking without evidence',
    example: "They're quiet today, so they must be angry with me about something I did.",
    reframe: "I don't know what others are thinking unless they tell me. There could be many reasons for their behavior that have nothing to do with me."
  },
  {
    id: '5',
    category: 'fortune-telling',
    title: 'Fortune Telling',
    description: 'Predicting negative outcomes without evidence',
    example: "I know this therapy won't work for me. Nothing ever helps.",
    reframe: "I can't predict the future. Each new approach is an opportunity to learn and grow, regardless of past experiences."
  }
]

const affirmations = [
  "I am worthy of love and respect",
  "My feelings and experiences are valid",
  "I have the strength to heal and grow",
  "I deserve healthy relationships",
  "I trust my own perceptions and instincts",
  "I am not responsible for others' actions",
  "I choose peace over drama",
  "I am enough, just as I am"
]

const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: "4 minutes"
  },
  {
    name: "Box Breathing",
    description: "Inhale 4, hold 4, exhale 4, hold 4",
    duration: "5 minutes"
  },
  {
    name: "Calm Breathing",
    description: "Slow, deep breaths to center yourself",
    duration: "3 minutes"
  }
]

export default function MindResetContent() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'affirmations' | 'breathing'>('patterns')
  const [selectedPattern, setSelectedPattern] = useState<ThoughtPattern | null>(null)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'catastrophizing': return 'bg-red-100 text-red-800 border-red-200'
      case 'self-blame': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'all-or-nothing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'mind-reading': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fortune-telling': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
  }

  const prevAffirmation = () => {
    setCurrentAffirmation((prev) => (prev - 1 + affirmations.length) % affirmations.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-indigo-600" />
          Mind Reset
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Reframe negative thought patterns, practice positive affirmations, and use breathing exercises to reset your mindset.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'patterns'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lightbulb className="h-4 w-4 inline mr-2" />
            Thought Patterns
          </button>
          <button
            onClick={() => setActiveTab('affirmations')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'affirmations'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Affirmations
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'breathing'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Breathing
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {!selectedPattern ? (
            <>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Common Thought Patterns</h2>
                <p className="text-gray-600">
                  Recognize and reframe negative thinking patterns that may be affecting your wellbeing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thoughtPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{pattern.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(pattern.category)}`}>
                        {pattern.category.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{pattern.description}</p>
                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedPattern(null)}
                className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2"
              >
                ← Back to patterns
              </button>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPattern.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedPattern.category)}`}>
                    {selectedPattern.category.replace('-', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 mb-8">{selectedPattern.description}</p>

                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Example Thought
                    </h3>
                    <p className="text-red-800 italic">"{selectedPattern.example}"</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Reframed Thought
                    </h3>
                    <p className="text-green-800">"{selectedPattern.reframe}"</p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Practice Exercise</h3>
                  <p className="text-blue-800 text-sm">
                    When you notice this thought pattern, pause and ask yourself: "Is this thought helpful? 
                    What evidence do I have for this? What would I tell a friend in this situation?"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'affirmations' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Daily Affirmations</h2>
            <p className="text-gray-600">
              Positive statements to help rewire your thinking and build self-compassion.
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 border border-pink-200">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-6" />
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "{affirmations[currentAffirmation]}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prevAffirmation}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-gray-600 rotate-180" />
                </button>
                
                <span className="text-sm text-gray-500">
                  {currentAffirmation + 1} of {affirmations.length}
                </span>
                
                <button
                  onClick={nextAffirmation}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">How to Use Affirmations</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Repeat each affirmation slowly and mindfully</li>
              <li>• Try to feel the meaning behind the words</li>
              <li>• Practice daily, especially during difficult moments</li>
              <li>• Write them down in your journal for reinforcement</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'breathing' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Breathing Exercises</h2>
            <p className="text-gray-600">
              Calm your nervous system and center yourself with guided breathing techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {breathingExercises.map((exercise, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-gray-600 text-sm">{exercise.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{exercise.duration}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isBreathingActive ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Stop Exercise
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Exercise
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {isBreathingActive && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <RefreshCw className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <p className="text-blue-900 text-lg font-medium mb-2">Breathe with the rhythm</p>
              <p className="text-blue-700 text-sm">Focus on your breath and let your mind settle</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
