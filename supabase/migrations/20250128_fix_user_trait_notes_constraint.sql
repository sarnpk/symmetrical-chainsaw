-- Fix user_trait_notes table to add unique constraint for upsert operations
-- This allows the API to properly save/update personal notes

-- Add unique constraint on user_id and trait_id combination
ALTER TABLE user_trait_notes 
ADD CONSTRAINT user_trait_notes_user_trait_unique 
UNIQUE (user_id, trait_id);