# Enrichment Status & Quality Verification

This guide explains how to verify that database enrichment is in place and how to interpret the results.

## How to run

1. **Supabase SQL Editor**  
   - Open your project → SQL Editor.  
   - Paste the contents of `packages/database/scripts/verify_enrichment_status.sql`.  
   - Run the script.  
   - Results appear as multiple result sets (one per section).

2. **psql**  
   - From the repo root:  
     `psql "<connection-string>" -f packages/database/scripts/verify_enrichment_status.sql`  
   - Section labels in the script are comments; result sets are in order 1–10.

**Note:** If you see errors on **sections 8 or 9** (enrichment_log, market_prices, geographic_data, certification_standards), run migration `009_dataset_enrichment_guide.sql` first. Sections 1–7 and 10 use core schema and cooperatives only.

**If you get "numeric field overflow"** when running `bootstrap_enrichment.sql` or when inserting/updating cooperatives, the `data_quality_score` column is too narrow for 0–100 scores. Run `packages/database/scripts/fix_data_quality_score_overflow.sql` once, then retry.

## What each section checks

| Section | What it checks |
|--------|-----------------|
| **1**  | Which enrichment-related migrations have run (001, 009, 011, 013, 014, 021). |
| **2**  | Enrichment columns on `cooperatives`: contextual_risks, regulatory_context, coverage_metrics, readiness_status, data_quality_score, metadata. |
| **3**  | Enrichment tables/views: enrichment_log, market_prices, geographic_data, certification_standards, coverage_metrics, readiness_snapshots, enriched_cooperatives. |
| **4**  | Enrichment functions: calculate_cooperative_enrichment_score, auto_enrich_cooperative, update_enrichment_scores. |
| **5**  | Counts of cooperatives with each enrichment field (coverage, readiness, metadata). |
| **6**  | Distribution of `readiness_status` (e.g. not_ready, in_progress, buyer_ready). |
| **7**  | Sample rows with `coverage_metrics` to spot-check content. |
| **8**  | Recent activity in `enrichment_log` by entity_type and enrichment_type (requires 009). |
| **9**  | Row counts in reference tables: market_prices, geographic_data, certification_standards (requires 009). |
| **10** | Quality summary: % with contextual_risks, % with coverage_metrics, % buyer_ready, % in_progress. |

## Interpreting quality

- **Schema (2–4):** All expected columns, tables, and functions should be present after running the relevant migrations. Missing items → run or fix the corresponding migration.
- **Coverage (5, 10):** Higher percentages mean more cooperatives have been enriched. Use these to track progress and data quality over time.
- **Readiness (6):** Use the distribution to see how many cooperatives are `buyer_ready` vs `in_progress` vs `not_ready`.
- **Log (8):** Confirms that enrichment jobs have been running and when they last ran.
- **Reference data (9):** Non-zero counts indicate seed/reference data is loaded for enrichment logic.

## Next steps when verification shows 0%

If section 5 shows **total_cooperatives = 0** or section 10 shows **all percentages = 0**:

1. **If you already have cooperatives**  
   Run **only** the bootstrap script in Supabase SQL Editor:  
   `packages/database/scripts/bootstrap_enrichment.sql`  
   It fills `coverage_metrics`, `contextual_risks`, and `readiness_status` (and optionally `data_quality_score`) for cooperatives that are missing them. Then re-run `verify_enrichment_status.sql` to see non-zero percentages.

2. **If the cooperatives table is empty**  
   Run `packages/database/scripts/seed_cooperatives_minimal.sql` first (inserts two sample cooperatives only when the table has no rows), then run `bootstrap_enrichment.sql`, then re-run verification.

3. **Ongoing enrichment**  
   - **From the app:** Use the cooperative dashboard “Recalculer” (recalculate) to run full enrichment (farmers, plots, documents).  
   - **From SQL:** Use `packages/database/scripts/enrich_cooperatives_example.sql` for batch updates from metadata, market prices, geographic data, etc.

For a full enrichment workflow, see [ENRICHMENT_QUICK_START.md](./ENRICHMENT_QUICK_START.md).
