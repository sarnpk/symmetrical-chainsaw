-- Create storage bucket for toxic memories media
INSERT INTO storage.buckets (id, name, public)
VALUES ('toxic-memories', 'toxic-memories', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their toxic memory media" ON storage.objects;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload toxic memory media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Users can read their toxic memory media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their toxic memory media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
