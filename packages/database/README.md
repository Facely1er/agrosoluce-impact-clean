# AgroSoluce Database

Database migrations and scripts for the AgroSoluce platform (Supabase/PostgreSQL).

## Applying migrations

To keep the database up to date, run migrations in order. From the repo root:

- **Check migration status:** `pnpm --filter @agrosoluce/database run migrate:check`
- **Run pending migrations:** `pnpm --filter @agrosoluce/database run migrate:run`

Or apply the consolidated schema (e.g. for a fresh DB):

- Run `packages/database/migrations/ALL_MIGRATIONS.sql` in your Supabase SQL editor (or via `psql`), then run any **individual** migration files whose names are **after** the last one included in `ALL_MIGRATIONS.sql` (e.g. 024, 025, …) so new changes are not missed.

## Key migrations

- **001** – Initial schema (cooperatives, user_profiles, etc.)
- **007** – v1 scope: `cooperatives.country`, `commodity`, `compliance_flags` (JSONB)
- **022** – Buyer EUDR assessments
- **023** – Cooperative EUDR readiness self-assessments
- **024** – Syncs `cooperatives.compliance_flags.eudrReady` from the latest `cooperative_eudr_readiness` row so directory filters (e.g. EUDR ready) work; includes trigger and backfill.

After applying 024, whenever a cooperative completes or updates an EUDR readiness assessment, their `compliance_flags.eudrReady` is updated automatically.
