-- =============================================================================
-- HWI views: fix "Security Definer View" linter (use invoker, not definer)
-- Run in Supabase SQL Editor. Resolves lint 0010_security_definer_view.
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view
-- =============================================================================

ALTER VIEW agrosoluce.v_hwi_latest SET (security_invoker = on);
ALTER VIEW agrosoluce.v_hwi_active_alerts SET (security_invoker = on);
