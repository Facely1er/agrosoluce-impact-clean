-- =============================================================================
-- HWI: Grant anon read access and optional RPC
-- Run this in Supabase SQL Editor to fix 401 "permission denied for view"
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

-- Optional: if you have these views, grant too
-- GRANT SELECT ON agrosoluce.v_hwi_timeseries_by_dept TO anon;
-- GRANT SELECT ON agrosoluce.vrac_category_aggregates TO anon;
-- GRANT SELECT ON agrosoluce.v_category_trends TO anon;

-- 2) Optional RPC: get_alert_distribution (fixes 400 when app calls it)
-- Returns alert_level, alert_count, percentage. (We use alert_count to avoid
-- SQL ambiguity with the aggregate count(). The app maps alert_count -> count.)
CREATE OR REPLACE FUNCTION agrosoluce.get_alert_distribution(target_year integer DEFAULT NULL)
RETURNS TABLE(alert_level text, alert_count bigint, percentage numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = agrosoluce
AS $$
  WITH base AS (
    SELECT h.alert_level, count(*) AS n
    FROM agrosoluce.household_welfare_index h
    WHERE (target_year IS NULL OR h.year = target_year)
    GROUP BY h.alert_level
  ),
  total AS (SELECT nullif(sum(n), 0)::numeric AS t FROM base)
  SELECT b.alert_level::text, b.n::bigint AS alert_count,
    round((b.n::numeric / (SELECT t FROM total)) * 100, 0)::numeric AS percentage
  FROM base b;
$$;

GRANT EXECUTE ON FUNCTION agrosoluce.get_alert_distribution(integer) TO anon;
