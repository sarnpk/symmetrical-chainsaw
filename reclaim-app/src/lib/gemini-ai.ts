// Enhanced Google Gemini AI Integration
// Handles all AI features: chat, pattern analysis, mind reset, insights

interface GeminiRequest {
  contents: Array<{
    role?: 'user' | 'model'
    parts: Array<{
      text: string
    }>
  }>
  systemInstruction?: {
    parts: Array<{
      text: string
    }>
  }
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

  async chat(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    context: 'general' | 'crisis' | 'pattern-analysis' | 'mind-reset' | 'grey-rock' = 'general',
    model?: string,
    options?: { signal?: AbortSignal; preferredLanguage?: string }
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context, options?.preferredLanguage, message)
    
    const contents: Array<{ role?: 'user' | 'model'; parts: { text: string }[] }> = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am a trauma-informed AI coach specialized in helping survivors of narcissistic abuse. How can I help you today?' }]
      },
      ...conversationHistory.map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ]

    const response = await this.makeRequest(
      `${model || DEFAULT_PAID_TIER_MODEL}:generateContent`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: this.getSafetySettings()
      },
      { signal: options?.signal }
    )

    return this.extractTextFromResponse(response)
  }

  async mindReset(
    originalThought: string,
    context?: {
      emotional_state?: string
      trigger?: string
      situation?: string
    },
    model?: string
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

    const response = await this.makeRequest(`${model || DEFAULT_PAID_TIER_MODEL}:generateContent`, {
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

  private async makeRequest(endpoint: string, body: GeminiRequest, init?: { signal?: AbortSignal }): Promise<GeminiResponse> {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: init?.signal,
    };

    // Use proxy if configured
    if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
      const { HttpsProxyAgent } = require('https-proxy-agent');
      const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
      (fetchOptions as any).agent = new HttpsProxyAgent(proxyUrl);
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, fetchOptions)

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      throw new Error(`Gemini API error ${response.status}: ${errText || response.statusText}`)
    }

    return await response.json()
  }

  private extractTextFromResponse(response: GeminiResponse): string {
    return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
  }

  private getSystemPrompt(context: string, preferredLanguage?: string, userMessage?: string): string {
    const basePrompt = `You are a compassionate AI coach specialized in helping survivors of narcissistic abuse. You are trauma-informed, validating, and focused on empowerment and healing.`

    const contextPrompts = {
      general: `${basePrompt} Provide supportive guidance and validation.`,
      crisis: `${basePrompt} This is a crisis situation. Prioritize safety and provide immediate support resources.`,
      'pattern-analysis': `${basePrompt} Help identify patterns in abusive behavior and provide insights.`,
      'mind-reset': `${basePrompt} Help reframe negative thoughts and provide coping strategies.`,
      'grey-rock': `${basePrompt} Provide guidance on the grey rock technique for minimizing conflict.`
    }

    let prompt = (contextPrompts as any)[context] || contextPrompts.general

    // Add language instruction
    if (preferredLanguage && preferredLanguage !== 'auto' && preferredLanguage !== 'en') {
      const languageNames: { [key: string]: string } = {
        'ur': 'Urdu', 'ar': 'Arabic', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
        'pt': 'Portuguese', 'ru': 'Russian', 'hi': 'Hindi', 'bn': 'Bengali', 'zh': 'Chinese', 'ja': 'Japanese',
        'ko': 'Korean', 'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian', 'ms': 'Malay', 'tl': 'Filipino',
        'tr': 'Turkish', 'fa': 'Persian', 'he': 'Hebrew', 'sw': 'Swahili', 'am': 'Amharic', 'yo': 'Yoruba',
        'ig': 'Igbo', 'ha': 'Hausa', 'zu': 'Zulu', 'xh': 'Xhosa', 'af': 'Afrikaans', 'nl': 'Dutch',
        'sv': 'Swedish', 'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'is': 'Icelandic', 'pl': 'Polish',
        'cs': 'Czech', 'sk': 'Slovak', 'hu': 'Hungarian', 'ro': 'Romanian', 'bg': 'Bulgarian', 'hr': 'Croatian',
        'sr': 'Serbian', 'bs': 'Bosnian', 'mk': 'Macedonian', 'sl': 'Slovenian', 'lv': 'Latvian', 'lt': 'Lithuanian',
        'et': 'Estonian', 'mt': 'Maltese', 'ga': 'Irish', 'cy': 'Welsh', 'eu': 'Basque', 'ca': 'Catalan',
        'gl': 'Galician', 'el': 'Greek', 'uk': 'Ukrainian', 'be': 'Belarusian', 'kk': 'Kazakh', 'ky': 'Kyrgyz',
        'uz': 'Uzbek', 'tg': 'Tajik', 'mn': 'Mongolian', 'my': 'Burmese', 'km': 'Khmer', 'lo': 'Lao',
        'si': 'Sinhala', 'ta': 'Tamil', 'te': 'Telugu', 'kn': 'Kannada', 'ml': 'Malayalam', 'gu': 'Gujarati',
        'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ne': 'Nepali', 'mr': 'Marathi'
      }
      const langName = languageNames[preferredLanguage] || preferredLanguage
      prompt += ` IMPORTANT: Respond in ${langName} language.`
    } else if (preferredLanguage === 'auto' && userMessage) {
      prompt += ` IMPORTANT: Detect the language of the user's message and respond in the same language. If the user writes in English, respond in English. If they write in another language, respond in that language.`
    }

    return prompt
  }

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

export const DEFAULT_FREE_TIER_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
export const DEFAULT_PAID_TIER_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export const geminiAI = new GeminiAI(process.env.GOOGLE_AI_API_KEY || '')

export async function generateAIResponse(prompt: string, context?: string): Promise<string> {
  return geminiAI.chat(prompt, [], context as any)
}

export type { PatternAnalysisResult, MindResetResult }
