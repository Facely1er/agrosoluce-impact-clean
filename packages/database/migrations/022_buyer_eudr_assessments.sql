-- Migration: Buyer EUDR Assessments
-- Creates a table for buyers to store their EUDR self-assessments
-- Based on EU Regulation 2023/1115

INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES ('022_buyer_eudr_assessments', 'Add buyer EUDR self-assessment table for EU Regulation 2023/1115 compliance')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- BUYER EUDR ASSESSMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.buyer_eudr_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Buyer reference (nullable: allows anonymous/guest assessments too)
  buyer_profile_id uuid REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,

  -- Company profile captured during the assessment
  company_name         text,
  primary_commodity    text NOT NULL CHECK (primary_commodity IN ('cocoa','coffee','palm-oil','soya','cattle','wood','rubber')),
  company_size         text NOT NULL CHECK (company_size IN ('large','sme','micro')),
  source_countries     text[],
  supply_chain_role    text[],
  annual_volume        text,
  years_in_business    text,
  secondary_commodities text[],

  -- Full question responses stored as JSONB for flexibility
  responses            jsonb NOT NULL DEFAULT '{}',

  -- Scoring results
  overall_score        numeric(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  risk_level           text NOT NULL CHECK (risk_level IN ('low','standard','high')),
  section_scores       jsonb NOT NULL DEFAULT '{}',
  critical_gaps        jsonb NOT NULL DEFAULT '[]',
  action_plan          jsonb NOT NULL DEFAULT '[]',
  certification_benefit numeric(5,2) DEFAULT 0,

  -- Compliance metadata
  compliance_deadline  text,
  days_remaining       integer,

  -- Language used during the assessment
  language             text DEFAULT 'en' CHECK (language IN ('en','fr')),

  -- Timestamps
  completed_at         timestamptz DEFAULT now(),
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_buyer_eudr_assessments_buyer_profile_id
  ON agrosoluce.buyer_eudr_assessments(buyer_profile_id);

CREATE INDEX IF NOT EXISTS idx_buyer_eudr_assessments_primary_commodity
  ON agrosoluce.buyer_eudr_assessments(primary_commodity);

CREATE INDEX IF NOT EXISTS idx_buyer_eudr_assessments_risk_level
  ON agrosoluce.buyer_eudr_assessments(risk_level);

CREATE INDEX IF NOT EXISTS idx_buyer_eudr_assessments_completed_at
  ON agrosoluce.buyer_eudr_assessments(completed_at);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE agrosoluce.buyer_eudr_assessments ENABLE ROW LEVEL SECURITY;

-- Buyers can only see their own assessments
DROP POLICY IF EXISTS "Buyers can view own EUDR assessments" ON agrosoluce.buyer_eudr_assessments;
CREATE POLICY "Buyers can view own EUDR assessments"
  ON agrosoluce.buyer_eudr_assessments
  FOR SELECT
  USING (
    buyer_profile_id IS NULL
    OR buyer_profile_id = (
      SELECT id FROM agrosoluce.user_profiles
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- Authenticated users can insert (their own)
DROP POLICY IF EXISTS "Authenticated users can insert EUDR assessments" ON agrosoluce.buyer_eudr_assessments;
CREATE POLICY "Authenticated users can insert EUDR assessments"
  ON agrosoluce.buyer_eudr_assessments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Buyers can update their own assessments
DROP POLICY IF EXISTS "Buyers can update own EUDR assessments" ON agrosoluce.buyer_eudr_assessments;
CREATE POLICY "Buyers can update own EUDR assessments"
  ON agrosoluce.buyer_eudr_assessments
  FOR UPDATE
  USING (
    buyer_profile_id = (
      SELECT id FROM agrosoluce.user_profiles
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- Admins can see all
DROP POLICY IF EXISTS "Admins can view all EUDR assessments" ON agrosoluce.buyer_eudr_assessments;
CREATE POLICY "Admins can view all EUDR assessments"
  ON agrosoluce.buyer_eudr_assessments
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

CREATE OR REPLACE FUNCTION agrosoluce.update_buyer_eudr_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_buyer_eudr_assessments_updated_at ON agrosoluce.buyer_eudr_assessments;
CREATE TRIGGER trg_buyer_eudr_assessments_updated_at
  BEFORE UPDATE ON agrosoluce.buyer_eudr_assessments
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_buyer_eudr_assessments_updated_at();

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.buyer_eudr_assessments TO authenticated;
GRANT INSERT, SELECT ON agrosoluce.buyer_eudr_assessments TO anon;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.buyer_eudr_assessments IS 'Stores EUDR self-assessments completed by buyers, based on EU Regulation 2023/1115';
COMMENT ON COLUMN agrosoluce.buyer_eudr_assessments.responses IS 'All question responses as JSONB keyed by question ID';
COMMENT ON COLUMN agrosoluce.buyer_eudr_assessments.section_scores IS 'Scores per assessment section (0-100 each)';
COMMENT ON COLUMN agrosoluce.buyer_eudr_assessments.critical_gaps IS 'Array of critical gap objects requiring immediate action';
COMMENT ON COLUMN agrosoluce.buyer_eudr_assessments.action_plan IS 'Priority-ranked action items generated from the assessment';
