-- =============================================================================
-- Grant service_role full access to agrosoluce (required for npm run vrac:migrate)
-- Run in Supabase SQL Editor if you get "permission denied for schema/table agrosoluce".
-- =============================================================================

GRANT USAGE ON SCHEMA agrosoluce TO service_role;
GRANT CREATE ON SCHEMA agrosoluce TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA agrosoluce TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA agrosoluce TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA agrosoluce GRANT ALL ON TABLES TO service_role;
