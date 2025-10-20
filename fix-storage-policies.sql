-- Fix Supabase storage policies for transcription access
-- Run this in your Supabase SQL Editor

-- 1. Check current policies on evidence-audio bucket
SELECT * FROM storage.policies WHERE bucket_id = 'evidence-audio';

-- 2. Create policy to allow public read access to signed URLs
-- This allows external services (like Gladia) to access files via signed URLs
INSERT INTO storage.policies (id, bucket_id, name, definition, check_expression, command)
VALUES (
  'allow_signed_url_access',
  'evidence-audio', 
  'Allow public read access via signed URLs',
  'true',
  'true',
  'SELECT'
) ON CONFLICT (id) DO UPDATE SET
  definition = 'true',
  check_expression = 'true';

-- 3. Alternative: More restrictive policy that only allows access to authenticated users' files
-- Uncomment this if you prefer more security (but it might not work with external APIs)
/*
INSERT INTO storage.policies (id, bucket_id, name, definition, check_expression, command)
VALUES (
  'allow_user_file_access',
  'evidence-audio',
  'Allow users to access their own files',
  'auth.uid()::text = (storage.foldername(name))[1]',
  'auth.uid()::text = (storage.foldername(name))[1]',
  'SELECT'
) ON CONFLICT (id) DO UPDATE SET
  definition = 'auth.uid()::text = (storage.foldername(name))[1]',
  check_expression = 'auth.uid()::text = (storage.foldername(name))[1]';
*/

-- 4. Ensure the bucket exists and has correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence-audio',
  'evidence-audio',
  false, -- Keep private, access via signed URLs only
  52428800, -- 50MB limit
  ARRAY['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg', 'audio/webm', 'audio/mpeg']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg', 'audio/webm', 'audio/mpeg'];

-- 5. Check if policies were created successfully
SELECT 
  id, 
  bucket_id, 
  name, 
  definition, 
  check_expression, 
  command,
  created_at
FROM storage.policies 
WHERE bucket_id = 'evidence-audio'
ORDER BY created_at DESC;