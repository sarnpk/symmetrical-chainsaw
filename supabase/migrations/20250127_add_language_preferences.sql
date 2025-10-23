-- Add language preferences to profiles table
ALTER TABLE profiles ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'auto';

-- Add comment for the new column
COMMENT ON COLUMN profiles.preferred_language IS 'User preferred language for AI responses (auto, en, ur, ar, es, fr, etc.)';

-- Update existing users to have 'auto' as default
UPDATE profiles SET preferred_language = 'auto' WHERE preferred_language IS NULL;