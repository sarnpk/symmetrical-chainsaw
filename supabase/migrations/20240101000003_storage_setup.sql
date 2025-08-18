-- Create storage buckets for evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('evidence-photos', 'evidence-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('evidence-audio', 'evidence-audio', false, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac']);

-- Storage policies for evidence photos bucket
CREATE POLICY "Users can upload their own evidence photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidence-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own evidence photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'evidence-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own evidence photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'evidence-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own evidence photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'evidence-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for evidence audio bucket
CREATE POLICY "Users can upload their own evidence audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidence-audio' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own evidence audio" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'evidence-audio' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own evidence audio" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'evidence-audio' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own evidence audio" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'evidence-audio' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );