import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { score, riskLevel, answers } = await request.json()

    // Generate AI-powered insights based on assessment results
    const insights = generatePersonalizedInsights(score, riskLevel, answers)
    
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}

function generatePersonalizedInsights(score: number, riskLevel: string, answers: Record<string, number>) {
  const insights = {
    summary: '',
    keyStrengths: [] as string[],
    areasOfConcern: [] as string[],
    actionSteps: [] as string[],
    resources: [] as string[],
    marketingMessage: ''
  }

  // Analyze specific answer patterns
  const safetyScore = (answers.q2 + answers.q6) / 2
  const boundariesScore = (answers.q4 + answers.q8) / 2
  const communicationScore = (answers.q1 + answers.q7) / 2

  // Generate summary
  if (score >= 70) {
    insights.summary = "Your relationship shows many healthy patterns. You demonstrate good communication, mutual respect, and emotional safety."
    insights.keyStrengths.push("Strong foundation of trust and respect", "Healthy communication patterns", "Good boundary maintenance")
    insights.actionSteps.push("Continue nurturing these positive dynamics", "Consider relationship enrichment activities", "Share healthy patterns with others")
  } else if (score >= 40) {
    insights.summary = "Your relationship has some positive aspects but also areas that need attention. This is common and can be improved with effort."
    if (communicationScore >= 3) insights.keyStrengths.push("Good communication foundation")
    if (safetyScore < 2) insights.areasOfConcern.push("Safety and emotional security")
    if (boundariesScore < 2) insights.areasOfConcern.push("Personal boundaries and autonomy")
    insights.actionSteps.push("Focus on improving communication", "Set clear boundaries", "Consider couples counseling")
  } else {
    insights.summary = "Your assessment indicates significant concerns that deserve immediate attention and support."
    insights.areasOfConcern.push("Multiple relationship dynamics need attention", "Safety may be a concern", "Professional support recommended")
    insights.actionSteps.push("Prioritize your safety and wellbeing", "Reach out to trusted friends or family", "Contact professional support services")
    insights.resources.push("National Domestic Violence Hotline: 1-800-799-7233", "Crisis Text Line: Text HOME to 741741")
  }

  // Add specific insights based on low scores
  if (safetyScore < 2) {
    insights.areasOfConcern.push("Emotional or physical safety concerns")
    insights.actionSteps.push("Create a safety plan", "Document concerning incidents")
    insights.resources.push("Safety planning resources", "Local domestic violence services")
  }

  if (boundariesScore < 2) {
    insights.areasOfConcern.push("Difficulty maintaining personal boundaries")
    insights.actionSteps.push("Practice saying 'no' in low-stakes situations", "Reconnect with supportive friends and family")
  }

  // Marketing message based on results
  if (riskLevel === 'high') {
    insights.marketingMessage = "Reclaim provides specialized tools for those navigating difficult relationships, including safety planning, trauma-informed journaling, and connection to professional resources."
  } else if (riskLevel === 'moderate') {
    insights.marketingMessage = "Reclaim offers relationship tracking tools, communication guides, and personalized insights to help strengthen your relationship dynamics."
  } else {
    insights.marketingMessage = "Reclaim helps maintain healthy relationships with tools for gratitude, positive moment tracking, and continued growth."
  }

  return insights
}