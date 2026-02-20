-- Migration: Sync EUDR readiness to cooperatives.compliance_flags
-- Keeps cooperatives.compliance_flags.eudrReady in sync with the latest cooperative_eudr_readiness
-- so directory filters (e.g. CooperativeDirectory EUDR filter) work from a single source of truth.

INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES ('024_sync_eudr_ready_to_compliance_flags', 'Sync eudrReady in cooperatives.compliance_flags from cooperative_eudr_readiness for directory filtering')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- FUNCTION: Sync one cooperative's compliance_flags.eudrReady
-- =============================================

CREATE OR REPLACE FUNCTION agrosoluce.sync_cooperative_eudr_ready_from_readiness()
RETURNS TRIGGER AS $$
DECLARE
  is_ready boolean;
BEGIN
  -- Use NEW.readiness_band for the row just inserted/updated
  is_ready := (NEW.readiness_band = 'ready');

  UPDATE agrosoluce.cooperatives
  SET compliance_flags = jsonb_set(
    COALESCE(compliance_flags, '{}'::jsonb),
    '{eudrReady}',
    to_jsonb(is_ready::boolean)
  )
  WHERE id = NEW.cooperative_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGER: After insert or update on cooperative_eudr_readiness
-- =============================================

DROP TRIGGER IF EXISTS trg_sync_eudr_ready_to_compliance_flags ON agrosoluce.cooperative_eudr_readiness;
CREATE TRIGGER trg_sync_eudr_ready_to_compliance_flags
  AFTER INSERT OR UPDATE OF readiness_band
  ON agrosoluce.cooperative_eudr_readiness
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.sync_cooperative_eudr_ready_from_readiness();

-- =============================================
-- BACKFILL: Set compliance_flags.eudrReady from latest readiness per cooperative
-- =============================================

UPDATE agrosoluce.cooperatives c
SET compliance_flags = jsonb_set(
  COALESCE(c.compliance_flags, '{}'::jsonb),
  '{eudrReady}',
  to_jsonb((r.readiness_band = 'ready')::boolean)
)
FROM (
  SELECT DISTINCT ON (cooperative_id)
    cooperative_id,
    readiness_band
  FROM agrosoluce.cooperative_eudr_readiness
  ORDER BY cooperative_id, completed_at DESC NULLS LAST, updated_at DESC
) r
WHERE c.id = r.cooperative_id;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON FUNCTION agrosoluce.sync_cooperative_eudr_ready_from_readiness() IS 'Trigger function: updates cooperatives.compliance_flags.eudrReady when cooperative_eudr_readiness is inserted or readiness_band changes';
