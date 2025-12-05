-- Urge Surfing Feature Tables

-- Main urge surfing sessions table
CREATE TABLE IF NOT EXISTS public.urge_surfing_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date timestamptz NOT NULL DEFAULT now(),
  urge_type varchar(50) NOT NULL,
  urge_intensity_start int NOT NULL CHECK (urge_intensity_start >= 1 AND urge_intensity_start <= 10),
  urge_intensity_peak int CHECK (urge_intensity_peak >= 1 AND urge_intensity_peak <= 10),
  urge_intensity_end int CHECK (urge_intensity_end >= 1 AND urge_intensity_end <= 10),
  trigger_description text NOT NULL,
  body_sensations text,
  surf_script_used text,
  duration_minutes int,
  gave_in bool DEFAULT false,
  alternative_action text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Urge patterns analysis table
CREATE TABLE IF NOT EXISTS public.urge_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_date date NOT NULL DEFAULT CURRENT_DATE,
  most_common_urge_type varchar(50),
  most_common_trigger text,
  avg_intensity numeric(3,1),
  success_rate numeric(5,2),
  peak_time_of_day time,
  total_sessions int DEFAULT 0,
  successful_surfs int DEFAULT 0,
  ai_insights text,
  created_at timestamptz DEFAULT now()
);

-- Custom urge profiles table
CREATE TABLE IF NOT EXISTS public.custom_urge_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  urge_type varchar(50) NOT NULL,
  custom_trigger text NOT NULL,
  custom_sensations text NOT NULL,
  custom_surf_script text NOT NULL,
  times_used int DEFAULT 0,
  effectiveness_rating int CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_urge_sessions_user_date ON public.urge_surfing_sessions(user_id, session_date DESC);
CREATE INDEX idx_urge_sessions_type ON public.urge_surfing_sessions(urge_type);
CREATE INDEX idx_urge_patterns_user_date ON public.urge_patterns(user_id, analysis_date DESC);
CREATE INDEX idx_custom_profiles_user ON public.custom_urge_profiles(user_id);

-- Unique constraint
ALTER TABLE public.urge_patterns ADD CONSTRAINT urge_patterns_user_id_analysis_date_key UNIQUE (user_id, analysis_date);

-- RLS Policies
ALTER TABLE public.urge_surfing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urge_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_urge_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own urge sessions" ON public.urge_surfing_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own urge sessions" ON public.urge_surfing_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own urge sessions" ON public.urge_surfing_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own urge sessions" ON public.urge_surfing_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own urge patterns" ON public.urge_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own urge patterns" ON public.urge_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own custom profiles" ON public.custom_urge_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom profiles" ON public.custom_urge_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom profiles" ON public.custom_urge_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom profiles" ON public.custom_urge_profiles FOR DELETE USING (auth.uid() = user_id);

-- Streak tracking table
CREATE TABLE IF NOT EXISTS public.urge_surfing_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_success_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Community shared techniques table
CREATE TABLE IF NOT EXISTS public.shared_surf_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  urge_type varchar(50) NOT NULL,
  technique_title varchar(200) NOT NULL,
  technique_description text NOT NULL,
  what_worked text NOT NULL,
  is_anonymous bool DEFAULT true,
  helpful_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Helpful votes table
CREATE TABLE IF NOT EXISTS public.technique_helpful_votes (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technique_id uuid NOT NULL REFERENCES public.shared_surf_techniques(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, technique_id)
);

-- Indexes
CREATE INDEX idx_streaks_user ON public.urge_surfing_streaks(user_id);
CREATE INDEX idx_shared_techniques_type ON public.shared_surf_techniques(urge_type);
CREATE INDEX idx_shared_techniques_helpful ON public.shared_surf_techniques(helpful_count DESC);

-- RLS Policies
ALTER TABLE public.urge_surfing_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_surf_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technique_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.urge_surfing_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.urge_surfing_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.urge_surfing_streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared techniques" ON public.shared_surf_techniques FOR SELECT USING (true);
CREATE POLICY "Users can insert own techniques" ON public.shared_surf_techniques FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own techniques" ON public.shared_surf_techniques FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own votes" ON public.technique_helpful_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own votes" ON public.technique_helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.technique_helpful_votes FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_urge_sessions_updated_at BEFORE UPDATE ON public.urge_surfing_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_profiles_updated_at BEFORE UPDATE ON public.custom_urge_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON public.urge_surfing_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
