-- Notification markers for idempotent one-time notifications.
-- Run this in Supabase SQL Editor.
--
-- The notification-check sweep routes use this table to guarantee each
-- natural notification moment (trial expiry, payment failure, safety plan
-- review due, journal streak milestone, badge, level-up) fires exactly once.

CREATE TABLE IF NOT EXISTS notification_markers (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  marker_key TEXT NOT NULL,
  marker_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, marker_key)
);

ALTER TABLE notification_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own markers" ON notification_markers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own markers" ON notification_markers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own markers" ON notification_markers
  FOR UPDATE USING (auth.uid() = user_id);