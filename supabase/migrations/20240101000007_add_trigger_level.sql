-- Add missing trigger_level column to journal_entries to match application code
ALTER TABLE journal_entries 
  ADD COLUMN IF NOT EXISTS trigger_level INTEGER CHECK (trigger_level >= 1 AND trigger_level <= 10);

-- Optional: index for querying by trigger_level
CREATE INDEX IF NOT EXISTS idx_journal_entries_trigger_level ON journal_entries(trigger_level);
