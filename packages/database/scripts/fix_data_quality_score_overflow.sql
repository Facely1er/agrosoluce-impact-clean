-- Fix: data_quality_score overflow (function returns 0-100, column was NUMERIC(3,1) with CHECK 0-10).
-- Run once in Supabase SQL Editor if you get "numeric field overflow" from update_enrichment_scores trigger.

-- 1. Drop the existing check constraint that limits score to 10
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey) AND NOT a.attisdropped
    WHERE c.conrelid = 'agrosoluce.cooperatives'::regclass
      AND c.contype = 'c'
      AND a.attname = 'data_quality_score'
  LOOP
    EXECUTE format('ALTER TABLE agrosoluce.cooperatives DROP CONSTRAINT IF EXISTS %I', r.conname);
    EXIT;
  END LOOP;
END $$;

-- 2. Widen column to hold 0-100 (e.g. 100.0)
ALTER TABLE agrosoluce.cooperatives
  ALTER COLUMN data_quality_score TYPE NUMERIC(4, 1);

-- 3. Re-add check for 0-100
ALTER TABLE agrosoluce.cooperatives
  ADD CONSTRAINT cooperatives_data_quality_score_check
  CHECK (data_quality_score IS NULL OR (data_quality_score >= 0 AND data_quality_score <= 100));
