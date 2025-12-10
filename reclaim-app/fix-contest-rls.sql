-- Fix RLS policy for contest entries

DROP POLICY IF EXISTS contest_entries_read_all ON community_contest_entries;
DROP POLICY IF EXISTS contest_entries_insert_auto ON community_contest_entries;
DROP POLICY IF EXISTS contest_entries_update_auto ON community_contest_entries;

-- Anyone can read contest entries (for leaderboard)
CREATE POLICY contest_entries_read_all ON community_contest_entries
FOR SELECT USING (true);

-- Allow system/triggers to insert entries (bypass RLS for triggers)
CREATE POLICY contest_entries_insert_auto ON community_contest_entries
FOR INSERT WITH CHECK (true);

-- Allow system/triggers to update entries
CREATE POLICY contest_entries_update_auto ON community_contest_entries
FOR UPDATE USING (true);
