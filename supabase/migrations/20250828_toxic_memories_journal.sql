-- Create toxic memories journal table
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

CREATE INDEX idx_toxic_memories_user ON toxic_memories(user_id);
CREATE INDEX idx_toxic_memories_date ON toxic_memories(memory_date);
CREATE INDEX idx_toxic_memories_beliefs ON toxic_memories USING GIN(linked_belief_ids);

ALTER TABLE toxic_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own toxic memories" ON toxic_memories
  FOR ALL USING (auth.uid() = user_id);
