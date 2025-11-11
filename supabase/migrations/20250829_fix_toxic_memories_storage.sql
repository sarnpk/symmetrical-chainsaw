-- Fix toxic memories storage bucket and policies

-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('toxic-memories', 'toxic-memories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop and recreate policies with correct syntax
DROP POLICY IF EXISTS "Users can upload toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their toxic memory media" ON storage.objects;

-- Upload policy
CREATE POLICY "Users can upload toxic memory media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Read policy
CREATE POLICY "Users can read their toxic memory media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Delete policy
CREATE POLICY "Users can delete their toxic memory media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
