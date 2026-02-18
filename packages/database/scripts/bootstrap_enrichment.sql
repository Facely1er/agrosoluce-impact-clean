-- Bootstrap enrichment: set coverage_metrics and readiness_status for cooperatives that have none.
-- Run after seed_cooperatives_minimal.sql (or when you have cooperatives). Safe to run multiple times.
-- After this, verify_enrichment_status.sql section 10 will show non-zero percentages.

-- 1. Set minimal coverage_metrics and readiness for cooperatives missing them
UPDATE agrosoluce.cooperatives
SET
    coverage_metrics = COALESCE(coverage_metrics, '{
        "farmers_total": 0,
        "farmers_with_declarations": 0,
        "plots_total": 0,
        "plots_with_geo": 0,
        "required_docs_total": 3,
        "required_docs_present": 0
    }'::jsonb),
    readiness_status = COALESCE(NULLIF(readiness_status, ''), 'in_progress'),
    contextual_risks = COALESCE(contextual_risks, '{}'::jsonb),
    updated_at = NOW()
WHERE coverage_metrics IS NULL
   OR readiness_status IS NULL
   OR contextual_risks IS NULL;

-- 2. Optional: refresh data_quality_score via DB function (requires migration 009).
--    If you get "numeric field overflow", run fix_data_quality_score_overflow.sql first.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_schema = 'agrosoluce' AND routine_name = 'calculate_cooperative_enrichment_score'
    ) THEN
        UPDATE agrosoluce.cooperatives
        SET data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(id),
            last_verified_at = NOW()
        WHERE data_quality_score IS NULL;
    END IF;
END $$;
