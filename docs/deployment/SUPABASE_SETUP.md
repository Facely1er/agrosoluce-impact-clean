# Supabase setup for AgroSoluce

## 1. Expose the schema

In **Supabase Dashboard** → **Project Settings** → **API**:

- Under **Exposed schemas**, add `agrosoluce` (so the REST API can see tables/views in that schema).

## 2. App access (anon key)

The web app uses the **anon** key. To avoid **401** (“permission denied for view”) on HWI and cooperatives:

**Quick fix for HWI:** Run **`docs/deployment/sql/grant-hwi-anon-access.sql`** in the Supabase **SQL Editor**. If the database linter reports "Security Definer View" on `v_hwi_latest` or `v_hwi_active_alerts`, run **`docs/deployment/sql/fix-hwi-views-security-invoker.sql`** first (it sets `security_invoker = on` on those views). It grants `SELECT` to `anon` on `household_welfare_index`, `v_hwi_latest`, and `v_hwi_active_alerts`, and creates the optional `get_alert_distribution` RPC (so you don’t get 400). The table and views must already exist (e.g. after `npm run vrac:migrate` or your schema migrations).

For other tables/views the app reads:

- Either **GRANT SELECT** to `anon` on each view/table in the `agrosoluce` schema, or
- If you use RLS on tables, add a policy that allows `anon` to SELECT.

Example grant (Postgres):

```sql
GRANT SELECT ON agrosoluce.household_welfare_index TO anon;
GRANT SELECT ON agrosoluce.v_hwi_latest TO anon;
GRANT SELECT ON agrosoluce.v_hwi_active_alerts TO anon;
```

Example RLS policy (only if the table has RLS enabled):

```sql
ALTER TABLE agrosoluce.household_welfare_index ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read"
  ON agrosoluce.household_welfare_index FOR SELECT
  TO anon USING (true);
```

## 3. Optional: RPC for alert distribution

The script **`docs/deployment/sql/grant-hwi-anon-access.sql`** creates `agrosoluce.get_alert_distribution(target_year integer)` and grants EXECUTE to `anon`. If you prefer not to create it, the app will compute distribution from latest scores when `v_hwi_latest` is readable.

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
