-- Add media fields to gaslighting_statements
ALTER TABLE gaslighting_statements 
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[],
ADD COLUMN IF NOT EXISTS evidence_text TEXT;
