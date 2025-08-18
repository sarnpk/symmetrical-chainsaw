-- RLS Policies for secure data access

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Evidence files policies
CREATE POLICY "Users can view own evidence files" ON evidence_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evidence files" ON evidence_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evidence files" ON evidence_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own evidence files" ON evidence_files
  FOR DELETE USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON ai_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- AI messages policies
CREATE POLICY "Users can view own messages" ON ai_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON ai_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User lesson progress policies
CREATE POLICY "Users can view own progress" ON user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Boundaries policies
CREATE POLICY "Users can view own boundaries" ON boundaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boundaries" ON boundaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boundaries" ON boundaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boundaries" ON boundaries
  FOR DELETE USING (auth.uid() = user_id);

-- Boundary interactions policies
CREATE POLICY "Users can view own boundary interactions" ON boundary_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boundary interactions" ON boundary_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boundary interactions" ON boundary_interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boundary interactions" ON boundary_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Boundary analytics policies
CREATE POLICY "Users can view own boundary analytics" ON boundary_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boundary analytics" ON boundary_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boundary analytics" ON boundary_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boundary analytics" ON boundary_analytics
  FOR DELETE USING (auth.uid() = user_id);

-- Boundary reviews policies
CREATE POLICY "Users can view own boundary reviews" ON boundary_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boundary reviews" ON boundary_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boundary reviews" ON boundary_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boundary reviews" ON boundary_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Safety plans policies
CREATE POLICY "Users can view own safety plans" ON safety_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety plans" ON safety_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety plans" ON safety_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own safety plans" ON safety_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Recovery lessons are public (read-only)
CREATE POLICY "Anyone can view recovery lessons" ON recovery_lessons
  FOR SELECT USING (true);