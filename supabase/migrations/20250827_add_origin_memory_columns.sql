-- Add origin memory columns to existing false_beliefs table
ALTER TABLE false_beliefs ADD COLUMN IF NOT EXISTS origin_memory_text TEXT;
ALTER TABLE false_beliefs ADD COLUMN IF NOT EXISTS origin_memory_audio_url TEXT;
ALTER TABLE false_beliefs ADD COLUMN IF NOT EXISTS origin_memory_image_url TEXT;
