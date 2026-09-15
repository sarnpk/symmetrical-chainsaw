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
  },
  {
    strategy_name: 'Cold Water on Face',
    description: 'Splash cold water on your face or hold ice cubes. Activates the dive reflex to calm panic.',
    category: 'physical',
    effectiveness_rating: 5,
    tags: ['panic', 'emergency']
  },
  {
    strategy_name: 'Butterfly Hug',
    description: 'Cross arms over chest, tap alternating shoulders slowly. Bilateral stimulation for trauma.',
    category: 'grounding',
    effectiveness_rating: 4,
    tags: ['trauma', 'emdr']
  },
  {
    strategy_name: 'Safe Place Visualization',
    description: 'Close eyes. Picture a safe place (real or imagined). Notice colors, sounds, feelings.',
    category: 'grounding',
    effectiveness_rating: 4,
    tags: ['visualization', 'safety']
  },
  {
    strategy_name: 'Dance to One Song',
    description: 'Put on a favorite song and move your body however feels good. Release stuck energy.',
    category: 'physical',
    effectiveness_rating: 4,
    tags: ['energy', 'release']
  },
  {
    strategy_name: 'Journaling Brain Dump',
    description: 'Write everything in your head for 5 minutes. No editing, no judgment. Just dump it out.',
    category: 'creative',
    effectiveness_rating: 4,
    tags: ['processing', 'release']
  },
  {
    strategy_name: 'Humming or Singing',
    description: 'Hum or sing for 2 minutes. Vibrations stimulate vagus nerve and calm nervous system.',
    category: 'breathing',
    effectiveness_rating: 3,
    tags: ['vagus', 'calm']
  },
  {
    strategy_name: 'Weighted Blanket or Pressure',
    description: 'Use weighted blanket or hug a pillow tightly. Deep pressure calms the nervous system.',
    category: 'physical',
    effectiveness_rating: 4,
    tags: ['sensory', 'calm']
  },
  {
    strategy_name: 'Affirmation Repetition',
    description: 'Choose one affirmation. Say it out loud 10 times while looking in a mirror.',
    category: 'emotional',
    effectiveness_rating: 3,
    tags: ['self-worth', 'affirmation']
  },
  {
    strategy_name: 'Stretch for 3 Minutes',
    description: 'Gentle stretches: neck rolls, shoulder shrugs, forward fold. Breathe into tight spots.',
    category: 'physical',
    effectiveness_rating: 3,
    tags: ['tension', 'body']
  },
  {
    strategy_name: 'Watch Comfort Content',
    description: 'Watch 10 minutes of a comfort show or funny videos. Give yourself permission to zone out.',
    category: 'other',
    effectiveness_rating: 2,
    tags: ['distraction', 'rest']
  },
  {
    strategy_name: 'Scent Grounding',
    description: 'Smell something strong: coffee, essential oil, perfume. Describe the scent in detail.',
    category: 'grounding',
    effectiveness_rating: 3,
    tags: ['sensory', 'grounding']
  },
  {
    strategy_name: 'Body Scan Meditation',
    description: 'Lie down. Notice each body part from toes to head. No judgment, just awareness.',
    category: 'grounding',
    effectiveness_rating: 4,
    tags: ['mindfulness', 'body']
  },
  {
    strategy_name: 'Cry It Out',
    description: 'Give yourself 10 minutes to cry. Set a timer. Let it all out, then wash your face.',
    category: 'emotional',
    effectiveness_rating: 4,
    tags: ['release', 'grief']
  },
  {
    strategy_name: 'Puzzle or Game',
    description: 'Do a crossword, sudoku, or mobile game for 10 minutes. Engage your logical brain.',
    category: 'other',
    effectiveness_rating: 3,
    tags: ['distraction', 'focus']
  },
  {
    strategy_name: 'Pet Therapy',
    description: 'Spend 5 minutes with a pet (yours or someone else\'s). Pet, play, or just sit together.',
    category: 'emotional',
    effectiveness_rating: 5,
    tags: ['connection', 'calm']
  }
]
