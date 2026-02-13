-- =============================================================================
-- Fix 400 on get_alert_distribution: "column reference \"count\" is ambiguous"
-- Run this in Supabase SQL Editor. Replaces the RPC so the CTE uses "cnt" and
-- "tot" instead of any column named "count". No GRANTs; use grant-hwi-anon-access.sql
-- for full permissions.
-- =============================================================================

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
