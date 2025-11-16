// AI-Enhanced Stonewalling Analysis
import { geminiAI } from './gemini-ai'

interface StonewallIncident {
  shutdown_type: string
  duration_minutes?: number
  trigger_context: string
  emotional_state_before?: number
  emotional_state_after?: number
  impact_level?: number
  your_response?: string
  reconnection_successful?: boolean
}

interface StonewallPatternAnalysis {
  patterns: Array<{
    type: string
    frequency: number
    severity: 'low' | 'medium' | 'high'
    description: string
    triggers: string[]
  }>
  insights: {
    summary: string
    escalation_risk: 'low' | 'medium' | 'high'
    emotional_toll: string
    relationship_impact: string
  }
  recommendations: Array<{
    strategy: string
    description: string
    when_to_use: string
    effectiveness: number
  }>
}

interface RealTimeGuidance {
  immediate_actions: string[]
  self_care_tips: string[]
  what_to_say: string[]
  what_not_to_say: string[]
  exit_strategy: string
  emotional_regulation: string[]
}

export class StonewallAI {
  /**
   * Analyze stonewalling patterns from multiple incidents
   */
  async analyzePatterns(incidents: StonewallIncident[]): Promise<StonewallPatternAnalysis> {
    const prompt = `
Analyze these stonewalling incidents for patterns:

${incidents.map((inc, i) => `
Incident ${i + 1}:
Type: ${inc.shutdown_type}
Duration: ${inc.duration_minutes || 'unknown'} minutes
Trigger: ${inc.trigger_context}
Emotional Impact: ${inc.emotional_state_before || '?'} → ${inc.emotional_state_after || '?'}
Your Response: ${inc.your_response || 'none'}
Reconnection: ${inc.reconnection_successful ? 'Yes' : 'No'}
`).join('\n')}

Provide JSON:
{
  "patterns": [{"type": "", "frequency": 0, "severity": "", "description": "", "triggers": []}],
  "insights": {"summary": "", "escalation_risk": "", "emotional_toll": "", "relationship_impact": ""},
  "recommendations": [{"strategy": "", "description": "", "when_to_use": "", "effectiveness": 0}]
}`

    const response = await geminiAI.chat(prompt, [], 'pattern-analysis')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : this.getDefaultAnalysis()
  }

  /**
   * Real-time guidance during active stonewalling
   */
  async getRealTimeGuidance(context: {
    shutdown_type: string
    duration_so_far: number
    trigger: string
    your_emotional_state: number
  }): Promise<RealTimeGuidance> {
    const prompt = `
I'm experiencing stonewalling RIGHT NOW:
Type: ${context.shutdown_type}
Duration: ${context.duration_so_far} minutes
Trigger: ${context.trigger}
My emotional state: ${context.your_emotional_state}/10

Provide immediate guidance in JSON:
{
  "immediate_actions": ["action1", "action2"],
  "self_care_tips": ["tip1", "tip2"],
  "what_to_say": ["phrase1", "phrase2"],
  "what_not_to_say": ["avoid1", "avoid2"],
  "exit_strategy": "how to leave situation",
  "emotional_regulation": ["technique1", "technique2"]
}`

    const response = await geminiAI.chat(prompt, [], 'crisis')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : this.getDefaultGuidance()
  }

  /**
   * Predict stonewalling likelihood based on context
   */
  async predictStonewalling(context: {
    topic: string
    time_of_day: string
    recent_conflicts: number
    stress_level: number
  }): Promise<{
    likelihood: number
    risk_factors: string[]
    prevention_tips: string[]
  }> {
    const prompt = `
Predict stonewalling risk:
Topic: ${context.topic}
Time: ${context.time_of_day}
Recent conflicts: ${context.recent_conflicts}
Stress level: ${context.stress_level}/10

JSON response:
{
  "likelihood": 0-100,
  "risk_factors": ["factor1"],
  "prevention_tips": ["tip1"]
}`

    const response = await geminiAI.chat(prompt, [], 'pattern-analysis')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { likelihood: 50, risk_factors: [], prevention_tips: [] }
  }

  /**
   * Generate response strategies based on past effectiveness
   */
  async suggestResponseStrategy(incident: StonewallIncident, pastSuccesses: string[]): Promise<{
    recommended_approach: string
    step_by_step: string[]
    expected_outcome: string
    backup_plan: string
  }> {
    const prompt = `
Current stonewalling:
Type: ${incident.shutdown_type}
Trigger: ${incident.trigger_context}
Past successful responses: ${pastSuccesses.join(', ')}

Suggest best response strategy in JSON:
{
  "recommended_approach": "",
  "step_by_step": ["step1"],
  "expected_outcome": "",
  "backup_plan": ""
}`

    const response = await geminiAI.chat(prompt, [], 'grey-rock')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : this.getDefaultStrategy()
  }

  private getDefaultAnalysis(): StonewallPatternAnalysis {
    return {
      patterns: [],
      insights: { summary: 'Insufficient data', escalation_risk: 'medium', emotional_toll: 'Unknown', relationship_impact: 'Unknown' },
      recommendations: []
    }
  }

  private getDefaultGuidance(): RealTimeGuidance {
    return {
      immediate_actions: ['Take deep breaths', 'Remove yourself if unsafe'],
      self_care_tips: ['Ground yourself', 'Call support person'],
      what_to_say: ['I need space to process this'],
      what_not_to_say: ['Why are you ignoring me?'],
      exit_strategy: 'Calmly leave the room',
      emotional_regulation: ['5-4-3-2-1 grounding', 'Box breathing']
    }
  }

  private getDefaultStrategy() {
    return {
      recommended_approach: 'Give space and revisit later',
      step_by_step: ['State your need', 'Set time boundary', 'Leave calmly'],
      expected_outcome: 'Reduced escalation',
      backup_plan: 'Exit situation completely'
    }
  }
}

export const stonewallAI = new StonewallAI()
