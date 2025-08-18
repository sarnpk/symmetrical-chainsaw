// Enhanced Google Gemini AI Integration
// Handles all AI features: chat, pattern analysis, mind reset, insights

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string
    }>
  }>
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
    stopSequences?: string[]
  }
  safetySettings?: Array<{
    category: string
    threshold: string
  }>
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
    finishReason: string
    safetyRatings: Array<{
      category: string
      probability: string
    }>
  }>
}

interface PatternAnalysisResult {
  patterns_identified: Array<{
    type: string
    frequency: number
    severity: 'low' | 'medium' | 'high'
    description: string
    examples: string[]
  }>
  insights: {
    summary: string
    risk_level: 'low' | 'medium' | 'high' | 'critical'
    trends: string[]
    recommendations: string[]
  }
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'urgent'
    category: 'safety' | 'healing' | 'documentation' | 'support'
    action: string
    description: string
  }>
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high' | 'critical'
    escalation_indicators: string[]
    safety_concerns: string[]
    immediate_actions: string[]
  }
}

interface MindResetResult {
  reframed_thought: string
  techniques_suggested: string[]
  affirmations: string[]
  coping_strategies: string[]
  effectiveness_prediction: number // 1-5 scale
}

class GeminiAI {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * General AI chat for trauma-informed support
   */
  async chat(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    context: 'general' | 'crisis' | 'pattern-analysis' | 'mind-reset' | 'grey-rock' = 'general'
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context)
    
    const contents = [
      {
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory.map(msg => ({
        parts: [{ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}` }]
      })),
      {
        parts: [{ text: `User: ${message}` }]
      }
    ]

    const response = await this.makeRequest('gemini-pro:generateContent', {
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: this.getSafetySettings()
    })

    return this.extractTextFromResponse(response)
  }

  /**
   * Analyze journal entries for patterns
   */
  async analyzePatterns(journalEntries: Array<{
    title: string
    description: string
    incident_date: string
    abuse_types: string[]
    safety_rating: number
    emotional_state_before?: string
    emotional_state_after?: string
    location?: string
  }>): Promise<PatternAnalysisResult> {
    const analysisPrompt = `
You are an AI specialist in narcissistic abuse pattern recognition. Analyze the following journal entries and provide a comprehensive pattern analysis.

Journal Entries:
${journalEntries.map((entry, index) => `
Entry ${index + 1}:
Date: ${entry.incident_date}
Title: ${entry.title}
Description: ${entry.description}
Abuse Types: ${entry.abuse_types.join(', ')}
Safety Rating: ${entry.safety_rating}/5
Emotional State Before: ${entry.emotional_state_before || 'Not specified'}
Emotional State After: ${entry.emotional_state_after || 'Not specified'}
Location: ${entry.location || 'Not specified'}
`).join('\n')}

Please provide a JSON response with the following structure:
{
  "patterns_identified": [
    {
      "type": "pattern_name",
      "frequency": number_of_occurrences,
      "severity": "low|medium|high",
      "description": "detailed_description",
      "examples": ["example1", "example2"]
    }
  ],
  "insights": {
    "summary": "overall_summary",
    "risk_level": "low|medium|high|critical",
    "trends": ["trend1", "trend2"],
    "recommendations": ["rec1", "rec2"]
  },
  "recommendations": [
    {
      "priority": "low|medium|high|urgent",
      "category": "safety|healing|documentation|support",
      "action": "specific_action",
      "description": "detailed_description"
    }
  ],
  "risk_assessment": {
    "overall_risk": "low|medium|high|critical",
    "escalation_indicators": ["indicator1", "indicator2"],
    "safety_concerns": ["concern1", "concern2"],
    "immediate_actions": ["action1", "action2"]
  }
}

Focus on identifying cycles, escalation patterns, triggers, and provide trauma-informed recommendations.`

    const response = await this.makeRequest('gemini-pro:generateContent', {
      contents: [{ parts: [{ text: analysisPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    })

    const responseText = this.extractTextFromResponse(response)
    
    try {
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse pattern analysis response:', error)
      throw new Error('Failed to analyze patterns - please try again')
    }
  }

  /**
   * Mind reset tool for reframing negative thoughts
   */
  async mindReset(
    originalThought: string,
    context?: {
      emotional_state?: string
      trigger?: string
      situation?: string
    }
  ): Promise<MindResetResult> {
    const mindResetPrompt = `
You are a trauma-informed AI therapist specializing in cognitive reframing for narcissistic abuse survivors.

Original Thought: "${originalThought}"
${context?.emotional_state ? `Current Emotional State: ${context.emotional_state}` : ''}
${context?.trigger ? `Trigger: ${context.trigger}` : ''}
${context?.situation ? `Situation: ${context.situation}` : ''}

Please help reframe this thought in a healthier, more balanced way. Provide a JSON response:

{
  "reframed_thought": "healthier_perspective",
  "techniques_suggested": ["technique1", "technique2"],
  "affirmations": ["affirmation1", "affirmation2"],
  "coping_strategies": ["strategy1", "strategy2"],
  "effectiveness_prediction": 1-5_scale_number
}

Focus on:
- Challenging cognitive distortions
- Promoting self-compassion
- Validating the survivor's experience
- Providing practical coping strategies
- Building resilience and self-worth`

    const response = await this.makeRequest('gemini-pro:generateContent', {
      contents: [{ parts: [{ text: mindResetPrompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1024,
      }
    })

    const responseText = this.extractTextFromResponse(response)
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse mind reset response:', error)
      throw new Error('Failed to process mind reset - please try again')
    }
  }

  /**
   * Generate personalized insights for users
   */
  async generateInsights(userData: {
    recent_entries: number
    safety_trend: 'improving' | 'stable' | 'declining'
    most_common_abuse_types: string[]
    boundary_violations: number
    coping_strategy_effectiveness: number
  }): Promise<{
    insights: Array<{
      type: 'pattern' | 'recommendation' | 'warning' | 'progress' | 'achievement'
      title: string
      description: string
      priority: 'low' | 'medium' | 'high' | 'urgent'
      action_items: string[]
    }>
  }> {
    const insightsPrompt = `
Based on the following user data, generate personalized insights for a narcissistic abuse survivor:

Recent Entries: ${userData.recent_entries}
Safety Trend: ${userData.safety_trend}
Most Common Abuse Types: ${userData.most_common_abuse_types.join(', ')}
Boundary Violations: ${userData.boundary_violations}
Coping Strategy Effectiveness: ${userData.coping_strategy_effectiveness}/5

Generate 3-5 insights in JSON format:
{
  "insights": [
    {
      "type": "pattern|recommendation|warning|progress|achievement",
      "title": "insight_title",
      "description": "detailed_description",
      "priority": "low|medium|high|urgent",
      "action_items": ["action1", "action2"]
    }
  ]
}

Focus on being supportive, trauma-informed, and actionable.`

    const response = await this.makeRequest('gemini-pro:generateContent', {
      contents: [{ parts: [{ text: insightsPrompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
      }
    })

    const responseText = this.extractTextFromResponse(response)
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse insights response:', error)
      throw new Error('Failed to generate insights - please try again')
    }
  }

  /**
   * Make request to Gemini API
   */
  private async makeRequest(endpoint: string, body: GeminiRequest): Promise<GeminiResponse> {
    const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Extract text from Gemini response
   */
  private extractTextFromResponse(response: GeminiResponse): string {
    return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
  }

  /**
   * Get system prompt based on context
   */
  private getSystemPrompt(context: string): string {
    const basePrompt = `You are a compassionate AI coach specialized in helping survivors of narcissistic abuse. You are trauma-informed, validating, and focused on empowerment and healing.`

    const contextPrompts = {
      general: `${basePrompt} Provide supportive guidance and validation.`,
      crisis: `${basePrompt} This is a crisis situation. Prioritize safety and provide immediate support resources.`,
      'pattern-analysis': `${basePrompt} Help identify patterns in abusive behavior and provide insights.`,
      'mind-reset': `${basePrompt} Help reframe negative thoughts and provide coping strategies.`,
      'grey-rock': `${basePrompt} Provide guidance on the grey rock technique for minimizing conflict.`
    }

    return contextPrompts[context] || contextPrompts.general
  }

  /**
   * Get safety settings for content filtering
   */
  private getSafetySettings() {
    return [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  }
}

// Export singleton instance
export const geminiAI = new GeminiAI(process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

// Export types
export type { PatternAnalysisResult, MindResetResult }
