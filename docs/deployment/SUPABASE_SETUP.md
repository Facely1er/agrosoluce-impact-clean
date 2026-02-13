# Supabase setup for AgroSoluce

## 1. Expose the schema

In **Supabase Dashboard** → **Project Settings** → **API**:

- Under **Exposed schemas**, add `agrosoluce` (so the REST API can see tables/views in that schema).

## 2. App access (anon key)

The web app uses the **anon** key. To avoid **401** on HWI and cooperatives:

- In the **agrosoluce** schema, add **RLS policies** so the `anon` role can **SELECT** on:
  - `household_welfare_index`
  - `v_hwi_latest` (view)
  - `v_hwi_active_alerts` (view)
  - `pharmacy_profiles`, `vrac_periods`, and any other tables/views the app reads.

Example policy (Postgres):

```sql
-- Example: allow anon to read HWI table (run in SQL Editor)
ALTER TABLE agrosoluce.household_welfare_index ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read"
  ON agrosoluce.household_welfare_index FOR SELECT
  TO anon USING (true);
```

Repeat for other tables/views the app uses, or use a single policy per table/view with `USING (true)` for read-only access.

## 3. Optional: RPC for alert distribution

If you want the server to compute alert distribution:

- Create the function `agrosoluce.get_alert_distribution(target_year integer)` in the SQL Editor.
- Grant **EXECUTE** to `anon` (or the role your app uses).

If the RPC is missing, the app computes distribution from latest scores when possible.

## 4. Running the VRAC migration (`npm run vrac:migrate`)

The migration **inserts** data (pharmacy profiles, VRAC periods, HWI scores). The **anon** key usually has no INSERT rights, so the script will fail with “permission denied” if you only set the anon key.

Use the **service_role** key for the migration (never in client-side code):

1. In Supabase Dashboard → **Project Settings** → **API**, copy the **service_role** key.
2. In the project root or `apps/web`, add to `.env`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as they are.

3. Run the migration from the repo root:
   ```bash
   npm run vrac:migrate
   ```

The script loads `.env` from the repo root, or from `apps/web/.env` if the root has no Supabase URL.

**Security:** Do not commit the service_role key or use it in the browser. Use it only in local or CI scripts that need to write to the database.

## 5. Readiness / compliance view (Analytics)

The analytics and child-labor dashboards use the view **`agrosoluce.cooperative_readiness_status`**. If you see "Could not find the table … cooperative_compliance_status" or "… cooperative_readiness_status", the view does not exist yet.

- Run the schema migrations in **`packages/database/migrations/`** (in order), or at least **`020_rename_compliance_to_readiness.sql`** (and any earlier migrations it depends on), in the Supabase SQL Editor against the `agrosoluce` schema.
- That migration creates the view `cooperative_readiness_status` and grants `SELECT` to `anon`.

## 6. After migration

- The app will still use the **anon** key; ensure RLS allows **SELECT** on the tables/views the app reads (step 2).
- If you see “Database has no cooperatives yet, falling back to JSON”, the cooperatives table is empty; the app will use static JSON until you run a cooperatives migration or seed.
