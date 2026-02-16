# Fix: 404 "Could not find the table 'public.XXX' in the schema cache"

If the 15-AgroSoluce (or any AgroSoluce) app shows errors like:

- `Failed to load resource: 404` on `/rest/v1/cooperatives`, `/rest/v1/cooperative_readiness_status`, `/rest/v1/farmers`, etc.
- `Could not find the table 'public.cooperatives' in the schema cache`
- `Could not find the table 'public.cooperative_readiness_status' in the schema cache`
- Similar for `farmers`, `farmer_declarations`, `training_sessions`, `baseline_measurements`, `monthly_progress`, `value_metrics`, `satisfaction_surveys`, `cooperative_onboarding`, `canonical_cooperative_directory`, `cooperative_compliance_status`

the Supabase project is missing the **agrosoluce** schema and/or it is not exposed to the API. The app expects all these tables in the **agrosoluce** schema, not in **public**.

## Root cause

1. **Migrations not run** – The `agrosoluce` schema and its tables have never been created on this Supabase project.
2. **Schema not exposed** – Even if tables exist, PostgREST only serves schemas listed under **Exposed schemas**. If `agrosoluce` is not there, the API falls back to `public` and returns 404 for those tables.

## Fix (in order)

### Step 1: Run database migrations

Create the `agrosoluce` schema and all required tables by running the migrations on your Supabase project.

**Option A – Single file (recommended)**  
In Supabase Dashboard → **SQL Editor**, run the combined migration file:

- **File:** `packages/database/migrations/ALL_MIGRATIONS.sql`  
- Copy its full content and execute it in the SQL Editor.

**Option B – Individual migrations**  
Run the migration files in numeric order (001, 002, 003, … 020) in the SQL Editor. Start with:

- `001_initial_schema_setup.sql`
- then `002_add_farmers_table.sql`, `004_add_compliance_tables.sql`, `008_farmers_first_toolkit.sql`, `012_canonical_cooperative_directory.sql`, `016_farmer_declarations.sql`, `020_rename_compliance_to_readiness.sql`, and any others in between as required.

After this, the database should have the `agrosoluce` schema and tables such as `cooperatives`, `cooperative_readiness_status`, `farmers`, `farmer_declarations`, `training_sessions`, `baseline_measurements`, `monthly_progress`, `value_metrics`, `satisfaction_surveys`, `cooperative_onboarding`, `canonical_cooperative_directory`, etc.

### Step 2: Expose the `agrosoluce` schema

1. In Supabase Dashboard go to **Project Settings** (gear) → **API**.
2. Under **Exposed schemas**, add **agrosoluce** (in addition to `public` if you use it).
3. Save.

PostgREST will then include `agrosoluce` in the schema cache and the app’s requests to tables in that schema will succeed (assuming the client is using the `agrosoluce` schema).

### Step 3: Ensure the app uses the `agrosoluce` schema

The web app is configured to use the schema from `VITE_SUPABASE_SCHEMA` (default `agrosoluce`). For production:

1. **Build-time env (e.g. Vercel)**  
   Set:
   ```bash
   VITE_SUPABASE_SCHEMA=agrosoluce
   ```
   (Optional if you’re happy with the default `agrosoluce` in code.)

2. **Supabase URL and anon key**  
   Ensure the same project (e.g. `nuwfdvwqiynzhbbsqagw.supabase.co`) has:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   set for the build and the deployed app.

After a new build and deploy, the client will send requests with the `agrosoluce` schema and the 404s for these tables should stop.

### Step 4: Grant anon read where needed

For unauthenticated (anon) access to read cooperatives, directory, readiness, etc.:

- Run `docs/deployment/sql/grant-hwi-anon-access.sql` in the SQL Editor (it grants SELECT to `anon` on several tables/views; comment out any that don’t exist yet).
- Migrations already grant `SELECT` to `anon` on tables like `cooperatives`, `canonical_cooperative_directory`, and the view `cooperative_readiness_status`. If you added RLS, ensure there is a policy that allows anon to SELECT where the app needs it.

## Verify

1. **In Supabase**  
   - SQL Editor: `SELECT * FROM agrosoluce.cooperatives LIMIT 1;`  
   - If this works, the schema and table exist.

2. **In the app**  
   - Reload the app and open the cooperative directory/dashboard.  
   - 404s for `cooperatives`, `cooperative_readiness_status`, `farmers`, etc. should be gone.

## Reference

- Main setup: `docs/deployment/SUPABASE_SETUP.md`
- Migrations: `packages/database/migrations/`
- Client schema config: `apps/web/src/lib/supabase/client.ts` (`defaultSchema` / `VITE_SUPABASE_SCHEMA`)
