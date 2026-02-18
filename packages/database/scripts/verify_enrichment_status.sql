-- =============================================
-- Database Enrichment Status & Quality Verification
-- Run this in Supabase SQL Editor or psql to verify enrichment migrations and data quality
-- =============================================

-- 1. MIGRATION STATUS
SELECT
    migration_name,
    executed_at,
    description
FROM agrosoluce.migrations
WHERE migration_name IN (
    '001_initial_schema_setup',
    '009_dataset_enrichment_guide',
    '011_phase1_data_enrichment',
    '013_coverage_metrics_table',
    '014_readiness_snapshots',
    '021_onboarding_system'
)
ORDER BY executed_at;

-- 2. SCHEMA: ENRICHMENT COLUMNS ON cooperatives
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'agrosoluce'
  AND table_name = 'cooperatives'
  AND column_name IN (
    'contextual_risks',
    'regulatory_context',
    'coverage_metrics',
    'readiness_status',
    'data_quality_score',
    'metadata'
)
ORDER BY ordinal_position;

-- 3. SCHEMA: ENRICHMENT TABLES & VIEWS
SELECT
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'agrosoluce'
  AND table_name IN (
    'enrichment_log',
    'market_prices',
    'geographic_data',
    'certification_standards',
    'coverage_metrics',
    'readiness_snapshots',
    'enriched_cooperatives'
)
ORDER BY table_type, table_name;

-- 4. SCHEMA: ENRICHMENT FUNCTIONS
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'agrosoluce'
  AND routine_name IN (
    'calculate_cooperative_enrichment_score',
    'auto_enrich_cooperative',
    'update_enrichment_scores'
)
ORDER BY routine_name;

-- 5. COOPERATIVES: ENRICHMENT COVERAGE (COUNTS)
SELECT
    COUNT(*) AS total_cooperatives,
    COUNT(contextual_risks) AS with_contextual_risks,
    COUNT(regulatory_context) AS with_regulatory_context,
    COUNT(coverage_metrics) AS with_coverage_metrics,
    COUNT(CASE WHEN readiness_status IS NOT NULL AND readiness_status != 'not_ready' THEN 1 END) AS with_non_default_readiness,
    COUNT(data_quality_score) AS with_data_quality_score,
    COUNT(metadata) FILTER (WHERE metadata IS NOT NULL AND metadata != '{}'::jsonb) AS with_non_empty_metadata
FROM agrosoluce.cooperatives;

-- 6. COOPERATIVES: READINESS STATUS DISTRIBUTION
SELECT
    COALESCE(readiness_status, '(null)') AS readiness_status,
    COUNT(*) AS count
FROM agrosoluce.cooperatives
GROUP BY readiness_status
ORDER BY count DESC;

-- 7. COOPERATIVES: SAMPLE ENRICHMENT DATA (first 3 with coverage_metrics)
SELECT
    id,
    name,
    readiness_status,
    coverage_metrics,
    contextual_risks IS NOT NULL AS has_contextual_risks,
    regulatory_context IS NOT NULL AS has_regulatory_context
FROM agrosoluce.cooperatives
WHERE coverage_metrics IS NOT NULL
LIMIT 3;

-- 8. ENRICHMENT LOG: RECENT ACTIVITY (skip if 009_dataset_enrichment_guide not run)
SELECT
    entity_type,
    enrichment_type,
    COUNT(*) AS count,
    MAX(performed_at) AS last_performed
FROM agrosoluce.enrichment_log
GROUP BY entity_type, enrichment_type
ORDER BY entity_type, count DESC;

-- 9. REFERENCE DATA: SEED COUNTS (skip if 009 not run)
SELECT 'market_prices' AS table_name, COUNT(*) AS row_count FROM agrosoluce.market_prices
UNION ALL
SELECT 'geographic_data', COUNT(*) FROM agrosoluce.geographic_data
UNION ALL
SELECT 'certification_standards', COUNT(*) FROM agrosoluce.certification_standards;

-- 10. QUALITY SUMMARY (percent of cooperatives with enrichment data)
SELECT
    ROUND(100.0 * COUNT(contextual_risks) / NULLIF(COUNT(*), 0), 1) AS pct_with_contextual_risks,
    ROUND(100.0 * COUNT(coverage_metrics) / NULLIF(COUNT(*), 0), 1) AS pct_with_coverage_metrics,
    ROUND(100.0 * COUNT(CASE WHEN readiness_status = 'buyer_ready' THEN 1 END) / NULLIF(COUNT(*), 0), 1) AS pct_buyer_ready,
    ROUND(100.0 * COUNT(CASE WHEN readiness_status = 'in_progress' THEN 1 END) / NULLIF(COUNT(*), 0), 1) AS pct_in_progress
FROM agrosoluce.cooperatives;

-- Verification complete. See docs/guides/ENRICHMENT_VERIFICATION.md for interpretation.
