-- Add missing NPD traits from recommendations plus 5 additional important traits
-- This expands the library from 10 to 17 traits total

INSERT INTO npd_traits (name, category, description, examples, response_strategies, severity) VALUES
-- Missing from recommendations
(
  'Emotional Manipulation',
  'both',
  'Using your emotions, fears, or insecurities against you to control your behavior and decisions.',
  ARRAY[
    'Threatening suicide or self-harm when you try to leave',
    'Using your love for children to manipulate decisions',
    'Exploiting your fears and insecurities',
    'Emotional blackmail: "If you loved me, you would..."'
  ],
  ARRAY[
    'Recognize emotional blackmail for what it is',
    'Don''t make decisions based on their emotional threats',
    'Seek professional help if they threaten self-harm',
    'Document threats for safety and legal purposes'
  ],
  'severe'
),
(
  'Withholding Affection/Resources',
  'both',
  'Deliberately withholding love, attention, money, or necessities as punishment or control.',
  ARRAY[
    'Refusing intimacy or affection when displeased',
    'Withholding financial support or access to money',
    'Denying basic needs or comforts',
    'Giving you the "cold shoulder" for extended periods'
  ],
  ARRAY[
    'Don''t beg or chase for what''s being withheld',
    'Develop financial independence when possible',
    'Recognize withholding as abuse, not your fault',
    'Build support networks outside the relationship'
  ],
  'severe'
),

-- 5 Additional important NPD traits
(
  'Rage and Explosive Anger',
  'overt',
  'Disproportionate anger outbursts designed to intimidate, control, and shut down opposition.',
  ARRAY[
    'Screaming, yelling, or throwing objects',
    'Explosive reactions to minor inconveniences',
    'Road rage or public outbursts',
    'Threatening physical violence during arguments'
  ],
  ARRAY[
    'Remove yourself from the situation if safe to do so',
    'Don''t try to reason with them during a rage episode',
    'Document incidents for safety planning',
    'Have an escape plan ready'
  ],
  'severe'
),
(
  'Smear Campaigns',
  'both',
  'Systematically destroying your reputation by spreading lies, half-truths, or private information to others.',
  ARRAY[
    'Telling friends and family lies about you',
    'Sharing private information to embarrass you',
    'Painting themselves as the victim of your "abuse"',
    'Turning your children against you with false narratives'
  ],
  ARRAY[
    'Don''t defend yourself to every person - it feeds the drama',
    'Focus on maintaining relationships with those who matter',
    'Document the truth for your own records',
    'Let your actions speak louder than their words'
  ],
  'severe'
),
(
  'Future Faking',
  'both',
  'Making elaborate promises about the future to keep you invested, with no intention of following through.',
  ARRAY[
    'Promising to change after therapy or treatment',
    'Planning elaborate vacations or life changes that never happen',
    'Promising marriage, children, or commitment to string you along',
    'Career or financial promises that never materialize'
  ],
  ARRAY[
    'Judge them by past actions, not future promises',
    'Don''t make major life decisions based on their promises',
    'Set deadlines for promised changes with consequences',
    'Focus on present reality, not potential future'
  ],
  'moderate'
),
(
  'Intermittent Reinforcement',
  'both',
  'Unpredictably alternating between kindness and cruelty to create addiction-like attachment.',
  ARRAY[
    'Being loving one day, cold the next',
    'Giving attention randomly and unpredictably',
    'Alternating between praise and criticism',
    'Hot and cold communication patterns'
  ],
  ARRAY[
    'Recognize this creates trauma bonding',
    'Don''t chase the "good" version of them',
    'Maintain consistent boundaries regardless of their mood',
    'Seek therapy to understand trauma bonding'
  ],
  'severe'
),
(
  'Parentification',
  'both',
  'Making you responsible for their emotional needs, problems, or well-being - reversing normal roles.',
  ARRAY[
    'Expecting you to manage their emotions',
    'Making you feel responsible for their happiness',
    'Leaning on you like you''re their parent or therapist',
    'Expecting you to solve their problems or clean up their messes'
  ],
  ARRAY[
    'Recognize you''re not responsible for their emotions',
    'Set boundaries around what you will and won''t do',
    'Don''t enable their helplessness',
    'Encourage them to seek appropriate professional help'
  ],
  'moderate'
),
(
  'Devaluation and Discard',
  'both',
  'Systematically tearing down your self-worth, then discarding you when you''re no longer useful.',
  ARRAY[
    'Constant criticism after initial love-bombing phase',
    'Comparing you unfavorably to others',
    'Suddenly ending the relationship without explanation',
    'Treating you as if you never mattered'
  ],
  ARRAY[
    'Remember: this reflects their disorder, not your worth',
    'Don''t try to win back their approval',
    'Use the discard as an opportunity to heal',
    'Rebuild your self-worth independent of their opinion'
  ],
  'severe'
),
(
  'Word Salad and Circular Arguments',
  'both',
  'Using confusing, contradictory, or nonsensical communication to avoid accountability and exhaust you.',
  ARRAY[
    'Changing the subject when confronted',
    'Using big words or complex explanations that make no sense',
    'Circular logic that goes nowhere',
    'Bringing up past grievances to deflect current issues'
  ],
  ARRAY[
    'Don''t try to make sense of nonsensical arguments',
    'Stick to one topic at a time',
    'Use written communication when possible',
    'End conversations that become circular'
  ],
  'moderate'
);