-- =============================================================================
-- HWI: Grant anon read access and optional RPC
-- Run this in Supabase SQL Editor to fix 401 "permission denied for view"
-- and 400 for get_alert_distribution. Schema must be agrosoluce and objects
-- must exist (e.g. after running vrac:migrate or your schema migrations).
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
-- Returns alert_level, count, percentage for the app. If you skip this,
-- the app will compute distribution from v_hwi_latest when that works.
CREATE OR REPLACE FUNCTION agrosoluce.get_alert_distribution(target_year integer DEFAULT NULL)
RETURNS TABLE(alert_level text, count bigint, percentage numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = agrosoluce
AS $$
  WITH base AS (
    SELECT h.alert_level, count(*) AS cnt
    FROM agrosoluce.household_welfare_index h
    WHERE (target_year IS NULL OR h.year = target_year)
    GROUP BY h.alert_level
  ),
  total AS (SELECT nullif(sum(cnt), 0)::numeric AS t FROM base)
  SELECT b.alert_level::text, b.cnt::bigint,
    round((b.cnt::numeric / (SELECT t FROM total)) * 100, 0)::numeric
  FROM base b;
$$;

GRANT EXECUTE ON FUNCTION agrosoluce.get_alert_distribution(integer) TO anon;
