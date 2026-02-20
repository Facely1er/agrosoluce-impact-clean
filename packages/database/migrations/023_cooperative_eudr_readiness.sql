-- Migration: Cooperative EUDR Readiness Assessments
-- Creates a table for cooperatives to complete a structured EUDR readiness self-assessment
-- Based on EU Regulation 2023/1115 supply-side obligations
-- Next migration: 023

INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES ('023_cooperative_eudr_readiness', 'Add cooperative EUDR readiness self-assessment table for supply-side EU Regulation 2023/1115 compliance')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- COOPERATIVE EUDR READINESS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.cooperative_eudr_readiness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Cooperative reference
  cooperative_id uuid NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,

  -- Who submitted (user profile of a cooperative manager)
  submitted_by uuid REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,

  -- ---- SECTION 1: Geo-data & Plot Coverage ----
  -- Percentage of farmers with GPS-referenced plots (0-100)
  plots_geo_coverage_pct  numeric(5,2) CHECK (plots_geo_coverage_pct >= 0 AND plots_geo_coverage_pct <= 100),
  -- Response: 'none' | 'partial' | 'majority' | 'all'
  plots_geo_response      text CHECK (plots_geo_response IN ('none','partial','majority','all')),

  -- ---- SECTION 2: Farmer Declarations ----
  -- Percentage of farmers with signed deforestation-free declarations
  declarations_coverage_pct numeric(5,2) CHECK (declarations_coverage_pct >= 0 AND declarations_coverage_pct <= 100),
  -- Response: 'none' | 'partial' | 'majority' | 'all'
  declarations_response   text CHECK (declarations_response IN ('none','partial','majority','all')),

  -- ---- SECTION 3: Traceability ----
  -- Does the cooperative track origin per farmer/plot at batch level?
  traceability_response   text CHECK (traceability_response IN ('none','manual','digital_partial','digital_full')),

  -- ---- SECTION 4: Documentation ----
  -- Social / child labor policy document uploaded?
  has_social_policy       boolean DEFAULT false,
  -- Land-use / deforestation evidence document uploaded?
  has_land_evidence       boolean DEFAULT false,
  -- Third-party or internal audit conducted in last 2 years?
  has_recent_audit        boolean DEFAULT false,

  -- ---- SECTION 5: Certifications ----
  -- Active certification relevant to EUDR (Rainforest Alliance, Fairtrade, organic, etc.)
  has_eudr_certification  boolean DEFAULT false,
  certification_names     text[],

  -- ---- SECTION 6: Internal Processes ----
  -- Does the cooperative have an internal EUDR due diligence procedure?
  has_dd_procedure        text CHECK (has_dd_procedure IN ('no','in_progress','yes')),
  -- Staff trained on EUDR obligations?
  staff_trained           text CHECK (staff_trained IN ('no','planned','yes')),

  -- ---- Scoring ----
  -- Overall readiness score (0-100), computed on save
  overall_score           numeric(5,2) NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  -- Per-section scores as JSONB { geo: 0-100, declarations: 0-100, traceability: 0-100, documentation: 0-100, certifications: 0-100, processes: 0-100 }
  section_scores          jsonb NOT NULL DEFAULT '{}',
  -- Readiness band: 'not_ready' | 'developing' | 'ready'
  readiness_band          text NOT NULL DEFAULT 'not_ready' CHECK (readiness_band IN ('not_ready','developing','ready')),
  -- Key gaps identified
  gaps                    jsonb NOT NULL DEFAULT '[]',

  -- Timestamps
  completed_at            timestamptz DEFAULT now(),
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_coop_eudr_readiness_cooperative_id
  ON agrosoluce.cooperative_eudr_readiness(cooperative_id);

CREATE INDEX IF NOT EXISTS idx_coop_eudr_readiness_readiness_band
  ON agrosoluce.cooperative_eudr_readiness(readiness_band);

CREATE INDEX IF NOT EXISTS idx_coop_eudr_readiness_overall_score
  ON agrosoluce.cooperative_eudr_readiness(overall_score);

CREATE INDEX IF NOT EXISTS idx_coop_eudr_readiness_completed_at
  ON agrosoluce.cooperative_eudr_readiness(completed_at);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE agrosoluce.cooperative_eudr_readiness ENABLE ROW LEVEL SECURITY;

-- Cooperatives and admins can view
DROP POLICY IF EXISTS "Cooperatives can view own EUDR readiness" ON agrosoluce.cooperative_eudr_readiness;
CREATE POLICY "Cooperatives can view own EUDR readiness"
  ON agrosoluce.cooperative_eudr_readiness
  FOR SELECT
  USING (true);  -- readiness data is visible to buyers browsing the marketplace too

-- Authenticated users (cooperative managers) can insert
DROP POLICY IF EXISTS "Authenticated users can insert EUDR readiness" ON agrosoluce.cooperative_eudr_readiness;
CREATE POLICY "Authenticated users can insert EUDR readiness"
  ON agrosoluce.cooperative_eudr_readiness
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Cooperative managers can update their own assessments
DROP POLICY IF EXISTS "Cooperatives can update own EUDR readiness" ON agrosoluce.cooperative_eudr_readiness;
CREATE POLICY "Cooperatives can update own EUDR readiness"
  ON agrosoluce.cooperative_eudr_readiness
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Admins can manage all
DROP POLICY IF EXISTS "Admins can manage all EUDR readiness" ON agrosoluce.cooperative_eudr_readiness;
CREATE POLICY "Admins can manage all EUDR readiness"
  ON agrosoluce.cooperative_eudr_readiness
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM agrosoluce.user_profiles
      WHERE user_id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- =============================================
-- TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION agrosoluce.update_coop_eudr_readiness_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coop_eudr_readiness_updated_at ON agrosoluce.cooperative_eudr_readiness;
CREATE TRIGGER trg_coop_eudr_readiness_updated_at
  BEFORE UPDATE ON agrosoluce.cooperative_eudr_readiness
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_coop_eudr_readiness_updated_at();

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.cooperative_eudr_readiness TO authenticated;
GRANT SELECT ON agrosoluce.cooperative_eudr_readiness TO anon;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.cooperative_eudr_readiness IS 'Stores EUDR supply-side readiness self-assessments completed by cooperatives, based on EU Regulation 2023/1115';
COMMENT ON COLUMN agrosoluce.cooperative_eudr_readiness.plots_geo_coverage_pct IS 'Percentage of farmers with GPS-referenced plots (0-100)';
COMMENT ON COLUMN agrosoluce.cooperative_eudr_readiness.declarations_coverage_pct IS 'Percentage of farmers with signed deforestation-free declarations (0-100)';
COMMENT ON COLUMN agrosoluce.cooperative_eudr_readiness.overall_score IS 'Composite readiness score (0-100) computed from all section scores';
COMMENT ON COLUMN agrosoluce.cooperative_eudr_readiness.readiness_band IS 'Readiness tier: not_ready (<40), developing (40-74), ready (>=75)';
COMMENT ON COLUMN agrosoluce.cooperative_eudr_readiness.gaps IS 'Array of identified gap objects { section, message, priority }';
