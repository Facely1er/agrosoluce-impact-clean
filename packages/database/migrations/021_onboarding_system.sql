-- Migration: 021 — Cooperative Onboarding System
-- Adds cooperative_requests (lead capture) and cooperative_onboarding / onboarding_steps tables

-- =============================================
-- COOPERATIVE REQUESTS (lead capture, no auth required)
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.cooperative_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    region VARCHAR(100),
    department VARCHAR(100),
    primary_product VARCHAR(100),
    farmer_count VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'invited', 'converted', 'rejected')),
    admin_notes TEXT,
    invited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow anonymous inserts (public lead capture)
ALTER TABLE agrosoluce.cooperative_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a cooperative request"
    ON agrosoluce.cooperative_requests
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all requests"
    ON agrosoluce.cooperative_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid()
            AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can update requests"
    ON agrosoluce.cooperative_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid()
            AND user_type = 'admin'
        )
    );

-- Index for admin filtering
CREATE INDEX IF NOT EXISTS idx_coop_requests_status ON agrosoluce.cooperative_requests(status);
CREATE INDEX IF NOT EXISTS idx_coop_requests_created_at ON agrosoluce.cooperative_requests(created_at);

-- =============================================
-- COOPERATIVE ONBOARDING (7-step wizard state)
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.cooperative_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
    current_step INTEGER DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    welcome_call_scheduled_at TIMESTAMP WITH TIME ZONE,
    welcome_call_completed_at TIMESTAMP WITH TIME ZONE,
    onboarding_champion_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id)
);

-- RLS for cooperative_onboarding
ALTER TABLE agrosoluce.cooperative_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cooperatives can view own onboarding"
    ON agrosoluce.cooperative_onboarding
    FOR SELECT
    USING (
        cooperative_id IN (
            SELECT id FROM agrosoluce.cooperatives
            WHERE user_profile_id IN (
                SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Cooperatives can insert own onboarding"
    ON agrosoluce.cooperative_onboarding
    FOR INSERT
    WITH CHECK (
        cooperative_id IN (
            SELECT id FROM agrosoluce.cooperatives
            WHERE user_profile_id IN (
                SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Cooperatives can update own onboarding"
    ON agrosoluce.cooperative_onboarding
    FOR UPDATE
    USING (
        cooperative_id IN (
            SELECT id FROM agrosoluce.cooperatives
            WHERE user_profile_id IN (
                SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- =============================================
-- ONBOARDING STEPS (individual step completion)
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onboarding_id UUID REFERENCES agrosoluce.cooperative_onboarding(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name VARCHAR(255),
    step_description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(onboarding_id, step_number)
);

ALTER TABLE agrosoluce.onboarding_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Onboarding steps — same access as parent onboarding"
    ON agrosoluce.onboarding_steps
    FOR ALL
    USING (
        onboarding_id IN (
            SELECT id FROM agrosoluce.cooperative_onboarding
            WHERE cooperative_id IN (
                SELECT id FROM agrosoluce.cooperatives
                WHERE user_profile_id IN (
                    SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
                )
            )
        )
        OR EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE INDEX IF NOT EXISTS idx_onboarding_cooperative_id ON agrosoluce.cooperative_onboarding(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON agrosoluce.cooperative_onboarding(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_onboarding_id ON agrosoluce.onboarding_steps(onboarding_id);

-- =============================================
-- ADMIN VIEW: onboarding pipeline summary
-- =============================================

CREATE OR REPLACE VIEW agrosoluce.admin_onboarding_pipeline AS
SELECT
    cr.id AS request_id,
    cr.cooperative_name,
    cr.contact_name,
    cr.phone,
    cr.email,
    cr.region,
    cr.primary_product,
    cr.farmer_count,
    cr.status AS request_status,
    cr.created_at AS request_date,
    co.id AS onboarding_id,
    co.status AS onboarding_status,
    co.current_step,
    co.started_at AS onboarding_started,
    co.completed_at AS onboarding_completed,
    co.welcome_call_scheduled_at,
    c.id AS cooperative_id,
    c.name AS cooperative_db_name
FROM
    agrosoluce.cooperative_requests cr
LEFT JOIN
    agrosoluce.cooperatives c ON LOWER(c.name) = LOWER(cr.cooperative_name)
LEFT JOIN
    agrosoluce.cooperative_onboarding co ON co.cooperative_id = c.id
ORDER BY
    cr.created_at DESC;

-- Record this migration
INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES (
    '021_onboarding_system',
    'Adds cooperative_requests lead capture table, cooperative_onboarding wizard state, onboarding_steps, and admin pipeline view'
)
ON CONFLICT (migration_name) DO NOTHING;
