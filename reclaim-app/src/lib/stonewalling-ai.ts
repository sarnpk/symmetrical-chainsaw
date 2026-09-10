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

interface RealTimeGuidance {
  immediate_actions: string[]
  self_care_tips: string[]
  what_to_say: string[]
  what_not_to_say: string[]
  exit_strategy: string
  emotional_regulation: string[]
}

export class StonewallAI {
  async getRealTimeGuidance(context: {
    shutdown_type: string
    duration_so_far: number
    trigger: string
    your_emotional_state: number
  }): Promise<RealTimeGuidance> {
    const prompt = `I'm experiencing stonewalling RIGHT NOW:
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
}

export const stonewallAI = new StonewallAI()
