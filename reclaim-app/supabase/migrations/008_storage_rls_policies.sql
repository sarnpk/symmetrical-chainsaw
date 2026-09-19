-- Storage RLS policies for all buckets
-- evidence-photos/evidence-audio use entry ID paths (DB controls access)
-- toxic-memories/evidence-files use user ID paths (path-scoped)

-- ============================================================
-- 1. toxic-memories bucket (user ID in path)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('toxic-memories', 'toxic-memories', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

CREATE POLICY "Users can upload to own toxic-memories folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'toxic-memories'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own toxic-memories files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'toxic-memories'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own toxic-memories files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'toxic-memories'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own toxic-memories files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'toxic-memories'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- 2. evidence-photos bucket (entry ID in path, DB controls access)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('evidence-photos', 'evidence-photos', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

CREATE POLICY "Authenticated users can upload evidence photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'evidence-photos');

CREATE POLICY "Authenticated users can read evidence photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'evidence-photos');

CREATE POLICY "Authenticated users can update evidence photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'evidence-photos');

CREATE POLICY "Authenticated users can delete evidence photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'evidence-photos');

-- ============================================================
-- 3. evidence-audio bucket (entry ID in path, DB controls access)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('evidence-audio', 'evidence-audio', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

CREATE POLICY "Authenticated users can upload evidence audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'evidence-audio');

CREATE POLICY "Authenticated users can read evidence audio"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'evidence-audio');

CREATE POLICY "Authenticated users can update evidence audio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'evidence-audio');

CREATE POLICY "Authenticated users can delete evidence audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'evidence-audio');

-- ============================================================
-- 4. evidence-files bucket (v3 journal, user ID in path)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('evidence-files', 'evidence-files', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

CREATE POLICY "Users can upload to own evidence-files folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'evidence-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own evidence-files files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'evidence-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own evidence-files files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'evidence-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own evidence-files files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'evidence-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- 5. avatars bucket (public read, user ID in path)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, NULL)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880;

CREATE POLICY "Anyone can read avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
