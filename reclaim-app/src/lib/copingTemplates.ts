export type CopingTemplate = {
  strategy_name: string
  description: string
  category: 'breathing' | 'grounding' | 'physical' | 'creative' | 'emotional' | 'other'
  effectiveness_rating: 1 | 2 | 3 | 4 | 5
  tags?: string[]
}

export const copingTemplates: CopingTemplate[] = [
  {
    strategy_name: 'Box Breathing (4-4-4-4)',
    description: 'Inhale for 4, hold 4, exhale 4, hold 4. Repeat 4 cycles. Focus on the counting.',
    category: 'breathing',
    effectiveness_rating: 4,
    tags: ['calming', 'anxiety']
  },
  {
    strategy_name: '4-7-8 Breathing',
    description: 'Inhale 4, hold 7, exhale 8. Repeat 3–4 times to reduce stress and help sleep.',
    category: 'breathing',
    effectiveness_rating: 4,
    tags: ['sleep', 'stress']
  },
  {
    strategy_name: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste. Describe each briefly.',
    category: 'grounding',
    effectiveness_rating: 5,
    tags: ['panic', 'grounding']
  },
  {
    strategy_name: 'Progressive Muscle Relaxation',
    description: 'Tense and release each muscle group from toes to head. Breathe slowly as you go.',
    category: 'physical',
    effectiveness_rating: 4,
    tags: ['tension', 'sleep']
  },
  {
    strategy_name: 'Five-Minute Walk',
    description: 'Go outside or around your space for 5 minutes. Notice 3 pleasant details.',
    category: 'physical',
    effectiveness_rating: 3,
    tags: ['energy', 'reset']
  },
  {
    strategy_name: 'Color or Doodle for 5 Minutes',
    description: 'Choose any color and fill a page without judgment. Focus on the movement.',
    category: 'creative',
    effectiveness_rating: 3,
    tags: ['expression', 'calm']
  },
  {
    strategy_name: 'Self-Compassion Break',
    description: 'Place a hand on your chest. Say: "This is hard. I am not alone. May I be kind to myself."',
    category: 'emotional',
    effectiveness_rating: 4,
    tags: ['self-kindness']
  },
  {
    strategy_name: 'Gratitude 3',
    description: 'Write 3 small things you appreciate right now. One can be very simple.',
    category: 'emotional',
    effectiveness_rating: 3,
    tags: ['mood', 'journal']
  },
  {
    strategy_name: 'Thought Reframe',
    description: 'Identify a negative thought and write one balanced alternative with evidence.',
    category: 'grounding',
    effectiveness_rating: 4,
    tags: ['cognitive', 'cbt']
  },
  {
    strategy_name: 'Text a Safe Friend',
    description: 'Send a brief check-in or ask for a supportive message. Keep it specific and kind.',
    category: 'emotional',
    effectiveness_rating: 3,
    tags: ['connection', 'support']
  }
]
