import { NextRequest, NextResponse } from 'next/server'

interface CopingStrategy {
  type: 'immediate' | 'mindset' | 'empowerment'
  title: string
  action: string
  icon: string
}

interface AIInsight {
  detectedTactics: string[]
  emotionalTone: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis'
  copingStrategies: CopingStrategy[]
  suggestedActions: string[]
}

const manipulationTactics = {
  gaslighting: ['question', 'reality', 'remember', 'crazy', 'imagining', 'never happened', 'overreacting'],
  lovebombing: ['perfect', 'soulmate', 'amazing', 'incredible', 'gifts', 'special', 'meant to be'],
  triangulation: ['other people', 'everyone thinks', 'compared to', 'jealous', 'third party'],
  projection: ['you always', 'you never', 'your fault', 'blame', 'accusing'],
  silenttreatment: ['ignoring', 'silent', 'won\'t talk', 'shutting out', 'cold shoulder'],
  financial: ['money', 'control', 'spending', 'account', 'budget', 'allowance']
}

const copingStrategies = {
  gaslighting: [
    { type: 'immediate', title: 'Reality Anchor', action: 'Write down 3 facts you know are true right now', icon: '⚓' },
    { type: 'mindset', title: 'Self-Validation', action: 'Your feelings and memories are valid, regardless of what they say', icon: '💪' },
    { type: 'empowerment', title: 'Grey Rock Response', action: '"I see we remember things differently" - then disengage', icon: '🗿' }
  ],
  lovebombing: [
    { type: 'immediate', title: 'Pause & Breathe', action: 'Take 3 deep breaths before responding to excessive praise', icon: '🫁' },
    { type: 'mindset', title: 'Pattern Recognition', action: 'Remember: love bombing is followed by devaluation', icon: '🔄' },
    { type: 'empowerment', title: 'Boundary Script', action: '"I need time to process this" - create space', icon: '🛡️' }
  ],
  triangulation: [
    { type: 'immediate', title: 'Detachment Mantra', action: '"Their drama is not my emergency" - repeat 3 times', icon: '🧘' },
    { type: 'mindset', title: 'Focus Redirect', action: 'List 3 things you\'re grateful for today', icon: '🎯' },
    { type: 'empowerment', title: 'No Defense Needed', action: 'You don\'t need to defend yourself to flying monkeys', icon: '🚫' }
  ],
  projection: [
    { type: 'immediate', title: 'Mirror Shield', action: '"That sounds like your experience, not mine"', icon: '🪞' },
    { type: 'mindset', title: 'Ownership Check', action: 'Ask: "Is this actually my responsibility?"', icon: '🤔' },
    { type: 'empowerment', title: 'Boundary Reinforcement', action: 'State your truth once, then stop engaging', icon: '⛔' }
  ],
  silenttreatment: [
    { type: 'immediate', title: 'Self-Care Mode', action: 'Use this time for activities that bring you joy', icon: '💆' },
    { type: 'mindset', title: 'Reframe Perspective', action: 'Their silence is a gift - enjoy the peace', icon: '🎁' },
    { type: 'empowerment', title: 'No Chasing', action: 'Don\'t pursue them - maintain your dignity', icon: '👑' }
  ],
  financial: [
    { type: 'immediate', title: 'Document Everything', action: 'Screenshot/photo any financial restrictions or threats', icon: '📸' },
    { type: 'mindset', title: 'Future Planning', action: 'Start thinking about financial independence steps', icon: '💡' },
    { type: 'empowerment', title: 'Secret Savings', action: 'If safe, start a small emergency fund they don\'t know about', icon: '🏦' }
  ]
}

function analyzeText(text: string): AIInsight {
  const lowerText = text.toLowerCase()
  const detectedTactics: string[] = []
  
  Object.entries(manipulationTactics).forEach(([tactic, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedTactics.push(tactic)
    }
  })

  const negativeWords = ['hurt', 'angry', 'frustrated', 'confused', 'scared', 'exhausted', 'helpless']
  const crisisWords = ['suicide', 'kill', 'die', 'end it', 'can\'t take', 'breaking point']
  
  let emotionalTone = 'neutral'
  let urgencyLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low'

  if (crisisWords.some(word => lowerText.includes(word))) {
    urgencyLevel = 'crisis'
    emotionalTone = 'crisis'
  } else if (negativeWords.some(word => lowerText.includes(word))) {
    emotionalTone = 'distressed'
    urgencyLevel = lowerText.length > 200 ? 'high' : 'medium'
  }

  const relevantStrategies: CopingStrategy[] = []
  detectedTactics.forEach(tactic => {
    if (copingStrategies[tactic as keyof typeof copingStrategies]) {
      relevantStrategies.push(...copingStrategies[tactic as keyof typeof copingStrategies])
    }
  })

  if (relevantStrategies.length === 0) {
    relevantStrategies.push(
      { type: 'immediate', title: 'Grounding Exercise', action: 'Name 5 things you can see, 4 you can touch, 3 you can hear', icon: '🌱' },
      { type: 'mindset', title: 'Validation', action: 'Your experience matters and your feelings are valid', icon: '❤️' },
      { type: 'empowerment', title: 'Self-Care', action: 'Do one small thing just for you right now', icon: '🌟' }
    )
  }

  const suggestedActions = []
  if (urgencyLevel === 'crisis') {
    suggestedActions.push('Contact crisis hotline', 'Reach out to trusted friend', 'Use Safety Plan')
  } else if (detectedTactics.includes('gaslighting')) {
    suggestedActions.push('Start Reality Log entry', 'Talk to AI Coach', 'Review Grey Rock techniques')
  } else {
    suggestedActions.push('Continue journaling', 'Practice Mind Reset', 'Review coping strategies')
  }

  return {
    detectedTactics,
    emotionalTone,
    urgencyLevel,
    copingStrategies: relevantStrategies.slice(0, 3),
    suggestedActions
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text || text.trim().length < 10) {
      return NextResponse.json({ 
        insights: null,
        message: 'Add more details to get personalized coping strategies'
      })
    }

    const insights = analyzeText(text)
    
    return NextResponse.json({ insights })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze text' }, { status: 500 })
  }
}