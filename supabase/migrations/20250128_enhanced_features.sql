-- Enhanced Features Implementation
-- Reality Anchor Integration, Wellness Dashboard, Enhanced NPD Trait Library, Advanced Pattern Recognition

-- =====================================================
-- 1. REALITY ANCHOR INTEGRATION
-- =====================================================

-- Add NPD trait tagging to journal entries
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS npd_traits_identified UUID[] DEFAULT '{}';
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS reality_check_notes TEXT;

-- Pattern alerts for repeated traits
CREATE TABLE IF NOT EXISTS pattern_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type TEXT CHECK (alert_type IN ('repeated_trait', 'escalation_pattern', 'cycle_detected', 'safety_concern')),
  trait_id UUID REFERENCES npd_traits(id),
  frequency_count INTEGER,
  time_period_days INTEGER,
  alert_message TEXT NOT NULL,
  is_acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. WELLNESS DASHBOARD EXPANSION
-- =====================================================

-- Wellness goals tracking
CREATE TABLE IF NOT EXISTS wellness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT CHECK (goal_type IN ('daily_checkin', 'mood_improvement', 'coping_usage', 'self_compassion', 'boundary_setting')),
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habit tracking for wellness activities
CREATE TABLE IF NOT EXISTS wellness_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  habit_type TEXT CHECK (habit_type IN ('affirmation', 'mood_checkin', 'coping_strategy', 'self_care', 'boundary_practice')),
  target_frequency INTEGER DEFAULT 1, -- times per day
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily habit completions
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES wellness_habits(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, completion_date)
);

-- Weekly wellness reports
CREATE TABLE IF NOT EXISTS wellness_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  mood_average DECIMAL(3,1),
  energy_average DECIMAL(3,1),
  anxiety_average DECIMAL(3,1),
  coping_strategies_used INTEGER DEFAULT 0,
  journal_entries_count INTEGER DEFAULT 0,
  habits_completed INTEGER DEFAULT 0,
  ai_insights JSONB DEFAULT '{}',
  progress_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- =====================================================
-- 3. ENHANCED NPD TRAIT LIBRARY
-- =====================================================

-- User personal examples for traits
CREATE TABLE IF NOT EXISTS user_trait_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trait_id UUID NOT NULL REFERENCES npd_traits(id) ON DELETE CASCADE,
  personal_example TEXT NOT NULL,
  date_occurred DATE,
  emotional_impact TEXT CHECK (emotional_impact IN ('mild', 'moderate', 'severe')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trait frequency tracking over time
CREATE TABLE IF NOT EXISTS trait_frequency_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trait_id UUID NOT NULL REFERENCES npd_traits(id) ON DELETE CASCADE,
  occurrence_date DATE NOT NULL,
  intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 5),
  context TEXT,
  journal_entry_id UUID REFERENCES journal_entries(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trait combinations (when multiple traits occur together)
CREATE TABLE IF NOT EXISTS trait_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  primary_trait_id UUID NOT NULL REFERENCES npd_traits(id) ON DELETE CASCADE,
  secondary_trait_ids UUID[] NOT NULL,
  occurrence_date DATE NOT NULL,
  combination_frequency INTEGER DEFAULT 1,
  journal_entry_id UUID REFERENCES journal_entries(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. ADVANCED PATTERN RECOGNITION
-- =====================================================

-- Escalation patterns and predictors
CREATE TABLE IF NOT EXISTS escalation_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  trigger_events TEXT[] NOT NULL,
  escalation_stages JSONB NOT NULL,
  typical_duration_hours INTEGER,
  warning_signs TEXT[],
  safety_recommendations TEXT[],
  confidence_score DECIMAL(3,2),
  last_detected DATE,
  detection_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger calendar for high-risk dates/times
CREATE TABLE IF NOT EXISTS trigger_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trigger_type TEXT CHECK (trigger_type IN ('date_anniversary', 'time_pattern', 'seasonal', 'event_based')),
  trigger_name TEXT NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  date_pattern TEXT, -- e.g., "monthly:15", "yearly:2023-05-15", "weekly:friday"
  time_pattern TEXT, -- e.g., "evening", "morning", "18:00-20:00"
  description TEXT,
  coping_strategies TEXT[],
  safety_reminders TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Abuse cycle mapping
CREATE TABLE IF NOT EXISTS abuse_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_name TEXT NOT NULL,
  phases JSONB NOT NULL, -- [{phase: "tension", duration_days: 3, behaviors: []}, ...]
  average_cycle_length_days INTEGER,
  current_phase TEXT,
  cycle_start_date DATE,
  predicted_next_phase_date DATE,
  cycle_count INTEGER DEFAULT 1,
  pattern_confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pattern detection results
CREATE TABLE IF NOT EXISTS pattern_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  detection_type TEXT CHECK (detection_type IN ('escalation_risk', 'cycle_phase', 'trait_cluster', 'safety_concern')),
  pattern_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  recommendations TEXT[],
  is_acknowledged BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Reality Anchor Integration indexes
CREATE INDEX IF NOT EXISTS idx_pattern_alerts_user_id ON pattern_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_alerts_type ON pattern_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_journal_entries_npd_traits ON journal_entries USING GIN(npd_traits_identified);

-- Wellness Dashboard indexes
CREATE INDEX IF NOT EXISTS idx_wellness_goals_user_id ON wellness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_habits_user_id ON wellness_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_wellness_reports_user_week ON wellness_reports(user_id, week_start_date);

-- Enhanced NPD Trait Library indexes
CREATE INDEX IF NOT EXISTS idx_user_trait_examples_user_trait ON user_trait_examples(user_id, trait_id);
CREATE INDEX IF NOT EXISTS idx_trait_frequency_user_trait ON trait_frequency_tracking(user_id, trait_id);
CREATE INDEX IF NOT EXISTS idx_trait_frequency_date ON trait_frequency_tracking(occurrence_date);
CREATE INDEX IF NOT EXISTS idx_trait_combinations_user ON trait_combinations(user_id);

-- Advanced Pattern Recognition indexes
CREATE INDEX IF NOT EXISTS idx_escalation_patterns_user ON escalation_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_calendar_user ON trigger_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_calendar_active ON trigger_calendar(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_abuse_cycles_user ON abuse_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_detections_user ON pattern_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_detections_unack ON pattern_detections(user_id, is_acknowledged) WHERE is_acknowledged = false;

-- =====================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE pattern_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trait_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_frequency_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_detections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own pattern alerts" ON pattern_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wellness goals" ON wellness_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wellness habits" ON wellness_habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own habit completions" ON habit_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wellness reports" ON wellness_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own trait examples" ON user_trait_examples FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own trait frequency" ON trait_frequency_tracking FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own trait combinations" ON trait_combinations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own escalation patterns" ON escalation_patterns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own trigger calendar" ON trigger_calendar FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own abuse cycles" ON abuse_cycles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own pattern detections" ON pattern_detections FOR ALL USING (auth.uid() = user_id);