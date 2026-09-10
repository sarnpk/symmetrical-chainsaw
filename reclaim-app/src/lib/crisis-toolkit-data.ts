// Static crisis intervention data based on evidence-based techniques

export type ConditionType = 'anxiety' | 'depression' | 'ptsd' | 'social_anxiety' | 'ocd';

export interface CrisisIntervention {
  condition: ConditionType;
  label: string;
  ruleOut: string;
  skills: Skill[];
  affirmation: string;
  futureVision: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  duration?: number; // seconds
  interactive?: boolean;
}

export const CRISIS_INTERVENTIONS: Record<ConditionType, CrisisIntervention> = {
  anxiety: {
    condition: 'anxiety',
    label: 'Anxiety',
    ruleOut: 'Am I unsafe, or am I uncomfortable?',
    skills: [
      {
        id: 'cold_water',
        name: 'Cold Water Reset',
        description: 'Run cold water over my wrists for 30 seconds',
        duration: 30,
        interactive: true
      },
      {
        id: 'breathing_4_6',
        name: '4-6 Breathing',
        description: 'Practice a 4-6 breath (inhale 4, exhale 6)',
        duration: 60,
        interactive: true
      },
      {
        id: 'grounding_5_4_3',
        name: '5-4-3 Grounding',
        description: 'Name 5 things I see, 4 things I hear, and 3 things I can feel',
        interactive: true
      }
    ],
    affirmation: 'My anxiety is loud, not necessarily accurate. I am safe in this moment.',
    futureVision: 'This wave will pass. It always does.',
    color: 'blue'
  },
  
  depression: {
    condition: 'depression',
    label: 'Depression',
    ruleOut: 'Is this physical exhaustion, emotional exhaustion, or both?',
    skills: [
      {
        id: 'drink_water',
        name: 'Hydration Reset',
        description: 'Drink a full glass of cold water',
        interactive: false
      },
      {
        id: 'sunlight',
        name: 'Sunlight Exposure',
        description: 'Step outside for 2 minutes, and direct your face towards the sun',
        duration: 120,
        interactive: true
      },
      {
        id: 'micro_task',
        name: 'Micro Task',
        description: 'Complete one task that takes under 3 minutes',
        interactive: false
      }
    ],
    affirmation: 'This is heavy. I\'m doing what I can with what I have and that is more than enough.',
    futureVision: 'This feeling is temporary. I have survived this before, and will get myself through it again, stronger.',
    color: 'purple'
  },
  
  ptsd: {
    condition: 'ptsd',
    label: 'PTSD/Flashback',
    ruleOut: 'Am I having a reaction to the past, or to a danger that is tangible in the present?',
    skills: [
      {
        id: 'color_naming',
        name: 'Color Grounding',
        description: 'Look around and name 3 colors in the room',
        interactive: true
      },
      {
        id: 'feet_grounding',
        name: 'Physical Grounding',
        description: 'Press both feet firmly into the floor',
        interactive: false
      },
      {
        id: 'present_moment',
        name: 'Present Moment Statement',
        description: 'Say out loud: "Today is [date]. I am here."',
        interactive: true
      }
    ],
    affirmation: 'My body is remembering something painful. I can hold that feeling while remembering that now, it doesn\'t mean I\'m unsafe.',
    futureVision: 'This flashback will end. My body is learning safety again.',
    color: 'red'
  },
  
  social_anxiety: {
    condition: 'social_anxiety',
    label: 'Social Anxiety',
    ruleOut: 'Is this emotion a prediction, or an observable truth?',
    skills: [
      {
        id: 'slow_exhale',
        name: 'Voice Steadying',
        description: 'Slow my exhale to steady my voice',
        duration: 30,
        interactive: true
      },
      {
        id: 'brief_eye_contact',
        name: 'Brief Eye Contact',
        description: 'Make brief eye contact for 1â€“2 seconds',
        interactive: false
      },
      {
        id: 'grounding_sentence',
        name: 'Light Conversation',
        description: 'Say one grounding sentence in a light voice ("How\'s your day going?")',
        interactive: false
      },
      {
        id: 'act_opposite',
        name: 'Act Opposite',
        description: 'Act opposite to my fear, and show up',
        interactive: false
      }
    ],
    affirmation: 'Feeling nervous doesn\'t make me awkward. It makes me human.',
    futureVision: 'Confidence comes from showing up and believing in my worth, not from being perfect.',
    color: 'green'
  },
  
  ocd: {
    condition: 'ocd',
    label: 'OCD/Intrusive Thoughts',
    ruleOut: 'Is this an intrusive thought, or a risk someone I trust would tell me to worry about?',
    skills: [
      {
        id: 'label_thought',
        name: 'Label the Thought',
        description: 'Label the thought: "This is a sticky/intrusive/monster thought."',
        interactive: false
      },
      {
        id: 'delay_compulsion',
        name: 'Delay Compulsion',
        description: 'Delay the compulsion by even 1 minute',
        duration: 60,
        interactive: true
      },
      {
        id: 'exposure',
        name: 'Exposure Response',
        description: 'If OCD is telling you to do something, respond back by doing the opposite',
        interactive: false
      }
    ],
    affirmation: 'My brain is sending a false alarm. I don\'t have to respond to it.',
    futureVision: 'Every minute I delay the compulsion, I retrain my brain and body. This is how I build a life worth living.',
    color: 'orange'
  }
};
