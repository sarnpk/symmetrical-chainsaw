-- Boundary review notifications
-- Run this in Supabase SQL Editor.

-- 1) Allow a 'boundary' notification type in the notifications table
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('milestone', 'community', 'journal', 'safety', 'system', 'streak', 'boundary'));

-- 2) Track whether a due-review reminder has already been sent.
--    Idempotent: the due-check only fires once per scheduled review.
ALTER TABLE boundary_reviews ADD COLUMN IF NOT EXISTS reminder_notified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_boundary_reviews_reminder
  ON boundary_reviews (user_id, review_status, scheduled_date)
  WHERE review_status = 'pending' AND reminder_notified_at IS NULL;