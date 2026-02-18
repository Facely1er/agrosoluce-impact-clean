-- Fix: data_quality_score overflow (function returns 0-100, column was NUMERIC(3,1) with CHECK 0-10).
-- Run once in Supabase SQL Editor if you get "numeric field overflow" from update_enrichment_scores trigger.
-- Also fixes "cannot alter type of a column used by a view" by dropping and recreating enriched_cooperatives.

-- 1. Drop view that depends on data_quality_score so we can alter the column
DROP VIEW IF EXISTS agrosoluce.enriched_cooperatives;

-- 2. Drop the existing check constraint that limits score to 10
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

-- 3. Widen column to hold 0-100 (e.g. 100.0)
ALTER TABLE agrosoluce.cooperatives
  ALTER COLUMN data_quality_score TYPE NUMERIC(4, 1);

-- 4. Re-add check for 0-100 (drop first so script is safe to run again)
ALTER TABLE agrosoluce.cooperatives
  DROP CONSTRAINT IF EXISTS cooperatives_data_quality_score_check;
ALTER TABLE agrosoluce.cooperatives
  ADD CONSTRAINT cooperatives_data_quality_score_check
  CHECK (data_quality_score IS NULL OR (data_quality_score >= 0 AND data_quality_score <= 100));

-- 5. Recreate view (same definition as in migration 009)
CREATE OR REPLACE VIEW agrosoluce.enriched_cooperatives WITH (security_invoker = on) AS
SELECT
    c.*,
    COUNT(DISTINCT f.id) AS total_farmers,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT cert.id) AS total_certifications,
    AVG(baseline.total_admin_hours_per_week) AS avg_baseline_admin_hours,
    MAX(progress.progress_month) AS last_progress_report_month,
    AVG(survey.overall_satisfaction) AS avg_satisfaction_score,
    (
        CASE WHEN c.name IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.country IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.commodity IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.annual_volume_tons IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.member_count IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.established_year IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.financial_health_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.sustainability_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.website_url IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.contact_email IS NOT NULL THEN 1 ELSE 0 END
    ) * 10 AS data_completeness_score,
    mp.price_per_ton_usd AS current_market_price_per_ton,
    gd.climate_zone,
    gd.agricultural_potential_score
FROM agrosoluce.cooperatives c
LEFT JOIN agrosoluce.farmers f ON f.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.baseline_measurements baseline ON baseline.cooperative_id = c.id
LEFT JOIN agrosoluce.monthly_progress progress ON progress.cooperative_id = c.id
LEFT JOIN agrosoluce.satisfaction_surveys survey ON survey.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT price_per_ton_usd
    FROM agrosoluce.market_prices
    WHERE commodity = c.commodity AND country = c.country
    ORDER BY price_date DESC
    LIMIT 1
) mp ON true
LEFT JOIN agrosoluce.geographic_data gd ON
    gd.country = c.country AND gd.region = c.region AND gd.department = c.department
GROUP BY c.id, mp.price_per_ton_usd, gd.climate_zone, gd.agricultural_potential_score;

GRANT SELECT ON agrosoluce.enriched_cooperatives TO authenticated;
GRANT SELECT ON agrosoluce.enriched_cooperatives TO anon;
COMMENT ON VIEW agrosoluce.enriched_cooperatives IS 'Cooperative data enriched with calculated metrics, market prices, and geographic information';
