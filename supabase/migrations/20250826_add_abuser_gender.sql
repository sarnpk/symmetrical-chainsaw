-- Add abuser_gender to profiles for personalized content

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS abuser_gender VARCHAR(20) CHECK (abuser_gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say'));

-- Default to null (gender-neutral language)