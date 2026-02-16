# Database configuration & schema migration verification

Use this checklist to confirm the AgroSoluce database is correctly configured and all migrations are applied.

## 1. Repo configuration (verified)

- **Migrations on disk:** `packages/database/migrations/` contains 001–020 and `ALL_MIGRATIONS.sql`.
- **Combined file:** `ALL_MIGRATIONS.sql` includes all 20 migrations (run `npm run migrate:generate` from `packages/database` or `npx tsx scripts/run-migrations.ts --generate` from repo root to regenerate).
- **App schema:** `apps/web/src/lib/supabase/client.ts` uses `VITE_SUPABASE_SCHEMA` (default `agrosoluce`) and `db.schema` is set accordingly.

## 2. Supabase Dashboard checks

| Step | Action | Expected |
|------|--------|----------|
| **Exposed schema** | Project Settings → API → **Exposed schemas** | `agrosoluce` is listed (in addition to `public` if used). |
| **Schema exists** | SQL Editor: `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'agrosoluce';` | One row: `agrosoluce`. |
| **Core table** | SQL Editor: `SELECT * FROM agrosoluce.cooperatives LIMIT 1;` | No error; table exists. |
| **Readiness view** | SQL Editor: `SELECT * FROM agrosoluce.cooperative_readiness_status LIMIT 1;` | No error; view exists. |
| **Migration tracking** | SQL Editor: `SELECT migration_name, executed_at FROM agrosoluce.migrations ORDER BY executed_at;` | Rows for 001 through 020 (if you ran the full combined migration). |

## 3. Local migration status (optional)

From repo root, with Supabase env vars set (e.g. in `.env` or `apps/web/.env`):

```bash
# Uses VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (or SUPABASE_URL, SUPABASE_ANON_KEY)
npx tsx scripts/run-migrations.ts --check
```

- If the **migrations** table is missing or schema is not exposed, you’ll see a clear error.
- If migrations have been run, you’ll see the list of executed migration names.

## 4. App-level verification

The app exposes `verifySupabaseConfiguration()` (see `apps/web/src/lib/supabase/client.ts`). It checks env and queries `agrosoluce.canonical_cooperative_directory` with `limit(1)`. Use it in a health/debug screen or console in development to confirm:

- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` set.
- Schema: default `agrosoluce` (or value of `VITE_SUPABASE_SCHEMA`).
- Connectivity: no 404/403 on that table.

## 5. If something is missing

- **404 on tables (e.g. cooperatives, cooperative_readiness_status):**  
  See [PRODUCTION_SUPABASE_404_FIX.md](./PRODUCTION_SUPABASE_404_FIX.md): run migrations (e.g. `ALL_MIGRATIONS.sql` in SQL Editor) and expose the `agrosoluce` schema.
- **Permission errors (anon):**  
  See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md): run `docs/deployment/sql/grant-hwi-anon-access.sql` and any other grant scripts as needed.
- **Regenerate combined migration:**  
  `npx tsx scripts/run-migrations.ts --generate` (from repo root).

## Summary

- **Configuration:** Env vars set; app uses schema `agrosoluce`; Supabase has `agrosoluce` in Exposed schemas.
- **Schema migration:** All 20 migrations applied (either via `ALL_MIGRATIONS.sql` in SQL Editor or 001–020 in order); `agrosoluce.migrations` and key objects (e.g. `cooperatives`, `cooperative_readiness_status`) exist.
- **Verification:** Dashboard SQL checks above + optional `--check` script + app `verifySupabaseConfiguration()`.
