-- Add gratitude-specific columns to positive_moments table
ALTER TABLE positive_moments 
ADD COLUMN IF NOT EXISTS entry_type VARCHAR(20) DEFAULT 'moment' CHECK (entry_type IN ('moment', 'gratitude', 'both')),
ADD COLUMN IF NOT EXISTS gratitude_category VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_daily_gratitude BOOLEAN DEFAULT false;

-- Add gratitude streak tracking table
CREATE TABLE IF NOT EXISTS gratitude_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on gratitude_streaks
ALTER TABLE gratitude_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for gratitude_streaks
CREATE POLICY "Users can view their own gratitude streaks"
ON gratitude_streaks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gratitude streaks"
ON gratitude_streaks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gratitude streaks"
ON gratitude_streaks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update gratitude streaks
CREATE OR REPLACE FUNCTION update_gratitude_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
  has_today_entry BOOLEAN;
  current_streak_val INTEGER := 0;
  longest_streak_val INTEGER := 0;
BEGIN
  -- Check if user has gratitude entry today
  SELECT EXISTS(
    SELECT 1 FROM positive_moments 
    WHERE user_id = user_uuid 
    AND DATE(moment_date) = today_date 
    AND (entry_type = 'gratitude' OR entry_type = 'both' OR is_daily_gratitude = true)
  ) INTO has_today_entry;

  -- Get current streak info
  SELECT current_streak, longest_streak 
  INTO current_streak_val, longest_streak_val
  FROM gratitude_streaks 
  WHERE user_id = user_uuid;

  -- If no streak record exists, create one
  IF NOT FOUND THEN
    INSERT INTO gratitude_streaks (user_id, current_streak, longest_streak, last_entry_date)
    VALUES (user_uuid, 0, 0, NULL);
    current_streak_val := 0;
    longest_streak_val := 0;
  END IF;

  -- Update streak based on today's entry
  IF has_today_entry THEN
    -- Check if this continues a streak from yesterday
    IF EXISTS(
      SELECT 1 FROM positive_moments 
      WHERE user_id = user_uuid 
      AND DATE(moment_date) = yesterday_date 
      AND (entry_type = 'gratitude' OR entry_type = 'both' OR is_daily_gratitude = true)
    ) THEN
      current_streak_val := current_streak_val + 1;
    ELSE
      current_streak_val := 1; -- Start new streak
    END IF;
    
    -- Update longest streak if current is longer
    IF current_streak_val > longest_streak_val THEN
      longest_streak_val := current_streak_val;
    END IF;
    
    -- Update the streak record
    UPDATE gratitude_streaks 
    SET current_streak = current_streak_val,
        longest_streak = longest_streak_val,
        last_entry_date = today_date,
        updated_at = NOW()
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update streaks when positive moments are inserted
CREATE OR REPLACE FUNCTION trigger_update_gratitude_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update streak for gratitude entries
  IF NEW.entry_type IN ('gratitude', 'both') OR NEW.is_daily_gratitude = true THEN
    PERFORM update_gratitude_streak(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_gratitude_streak_trigger ON positive_moments;
CREATE TRIGGER update_gratitude_streak_trigger
  AFTER INSERT ON positive_moments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_gratitude_streak();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_positive_moments_entry_type ON positive_moments(entry_type);
CREATE INDEX IF NOT EXISTS idx_positive_moments_gratitude_category ON positive_moments(gratitude_category);
CREATE INDEX IF NOT EXISTS idx_positive_moments_daily_gratitude ON positive_moments(is_daily_gratitude);
CREATE INDEX IF NOT EXISTS idx_gratitude_streaks_user_id ON gratitude_streaks(user_id);