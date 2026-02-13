-- =============================================================================
-- HWI + VRAC + readiness: Grant anon read access and optional RPC
-- Run this in Supabase SQL Editor to fix 401 "permission denied for view/table"
-- and 400 for get_alert_distribution. Schema must be agrosoluce and objects
-- must exist (e.g. after running vrac:migrate or your schema migrations).
--
-- If the Supabase linter flags "Security Definer View" on v_hwi_* views,
-- run docs/deployment/sql/fix-hwi-views-security-invoker.sql first.
-- =============================================================================

-- 1) Grant SELECT to anon on HWI table and views (fixes 401)
GRANT SELECT ON agrosoluce.household_welfare_index TO anon;
GRANT SELECT ON agrosoluce.v_hwi_latest TO anon;
GRANT SELECT ON agrosoluce.v_hwi_active_alerts TO anon;

-- 2) VRAC / pharmacy (fixes "permission denied for table pharmacy_profiles" etc.)
-- Run these only if the objects exist (e.g. after npm run vrac:migrate).
GRANT SELECT ON agrosoluce.pharmacy_profiles TO anon;
GRANT SELECT ON agrosoluce.vrac_regional_health_index TO anon;

-- 3) Readiness view (fixes 401 on cooperative_readiness_status)
GRANT SELECT ON agrosoluce.cooperative_readiness_status TO anon;

-- Optional: if you have these views, grant too
-- GRANT SELECT ON agrosoluce.v_hwi_timeseries_by_dept TO anon;
-- GRANT SELECT ON agrosoluce.vrac_category_aggregates TO anon;
-- GRANT SELECT ON agrosoluce.v_category_trends TO anon;
-- GRANT SELECT ON agrosoluce.vrac_period_aggregates TO anon;
-- GRANT SELECT ON agrosoluce.vrac_product_sales TO anon;

-- 4) Optional RPC: get_alert_distribution (fixes 400 "column reference count is ambiguous")
-- Returns alert_level, alert_count, percentage. Uses "cnt" in CTE so no column named "count".
-- The app maps alert_count -> count.
CREATE OR REPLACE FUNCTION agrosoluce.get_alert_distribution(target_year integer DEFAULT NULL)
RETURNS TABLE(alert_level text, alert_count bigint, percentage numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = agrosoluce
AS $$
  WITH base AS (
    SELECT h.alert_level, (count(*)) AS cnt
    FROM agrosoluce.household_welfare_index h
    WHERE (target_year IS NULL OR h.year = target_year)
    GROUP BY h.alert_level
  ),
  total AS (SELECT nullif(sum(base.cnt), 0)::numeric AS tot FROM base)
  SELECT base.alert_level::text, base.cnt::bigint AS alert_count,
    round((base.cnt::numeric / (SELECT total.tot FROM total)) * 100, 0)::numeric AS percentage
  FROM base;
$$;

GRANT EXECUTE ON FUNCTION agrosoluce.get_alert_distribution(integer) TO anon;
