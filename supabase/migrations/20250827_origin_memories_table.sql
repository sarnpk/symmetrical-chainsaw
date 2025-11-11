-- Create origin memories table (similar to counter_evidence)
CREATE TABLE IF NOT EXISTS origin_memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  belief_id UUID REFERENCES false_beliefs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  memory_text TEXT NOT NULL,
  memory_date DATE,
  memory_audio_url TEXT,
  memory_image_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_origin_memories_belief ON origin_memories(belief_id);

ALTER TABLE origin_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own origin memories" ON origin_memories
  FOR ALL USING (auth.uid() = user_id);
