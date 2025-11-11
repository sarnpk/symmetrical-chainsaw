-- Apply toxic memories migrations

-- 1. Create table
CREATE TABLE IF NOT EXISTS toxic_memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  memory_text TEXT NOT NULL,
  memory_date DATE DEFAULT CURRENT_DATE,
  tags TEXT[] DEFAULT '{}',
  
  audio_url TEXT,
  video_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  
  ai_analysis JSONB,
  linked_belief_ids UUID[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_toxic_memories_user ON toxic_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_toxic_memories_date ON toxic_memories(memory_date);
CREATE INDEX IF NOT EXISTS idx_toxic_memories_beliefs ON toxic_memories USING GIN(linked_belief_ids);

ALTER TABLE toxic_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own toxic memories" ON toxic_memories;
CREATE POLICY "Users can manage their own toxic memories" ON toxic_memories
  FOR ALL USING (auth.uid() = user_id);

-- 2. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('toxic-memories', 'toxic-memories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Storage policies
DROP POLICY IF EXISTS "Users can upload toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their toxic memory media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their toxic memory media" ON storage.objects;

CREATE POLICY "Users can upload toxic memory media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their toxic memory media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their toxic memory media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'toxic-memories' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
