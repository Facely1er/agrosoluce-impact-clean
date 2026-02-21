# Deploy the main project (web app)

Deploy the **AgroSoluce web app** to Vercel. The mobile app (`apps/mobile`) is separate and can be deployed after.

## 1. Prerequisites

**Required**

- Node.js 18+
- Vercel account: [vercel.com/signup](https://vercel.com/signup)

**Optional**

- Git repo connected for auto-deploy
- Supabase project (only required for live database; without it the app runs with static/fallback data)

## 2. One-time setup

### Install Vercel CLI and log in

```powershell
npm install -g vercel
vercel login
```

### Link this repo to a Vercel project (first time only)

From the **repo root**:

```powershell
vercel link
```

- Choose “Create new project” or link to an existing one.
- Project name: e.g. `agrosoluce-impact` or `agrosoluce-marketplace`.
- Use the existing `vercel.json` (no overrides).

### Set environment variables in Vercel (optional for database)

In [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**, add:

| Name | Required | Value | Environments |
|------|----------|--------|--------------|
| `VITE_SUPABASE_URL` | Only for DB | Your Supabase project URL | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | Only for DB | Your Supabase anon key | Production, Preview |
| `VITE_SUPABASE_SCHEMA` | Only for DB | `agrosoluce` | Production, Preview |

None of these are required for a successful deploy. Without them, the app runs with static/fallback data (e.g. `cooperatives_cote_ivoire.json`).

## 3. Deploy

### Option A: Script (recommended)

From the **repo root**:

```powershell
.\scripts\deploy-vercel.ps1
```

This runs `npm run build` (builds `apps/web`) then `vercel --prod`.

### Option B: Manual

From the **repo root**:

```powershell
npm run build
vercel --prod
```

Root `vercel.json` is already set to:

- **Build:** `npm run build`
- **Output:** `apps/web/build`
- **Framework:** Vite  
So the **main project** (web app) is what gets deployed.

## 4. After deploy

- Open the deployment URL from the CLI or from Vercel Dashboard.
- Optional: add a custom domain in **Settings** → **Domains** (e.g. `www.agrosoluce.com`).
- For database features (Supabase): ensure migrations are applied and RLS/grants are set (see `docs/deployment/SUPABASE_SETUP.md`).

## 5. Future deploys

- If Git is connected: push to `main` to trigger production deploy; open PRs for previews.
- Without Git: run `.\scripts\deploy-vercel.ps1` or `vercel --prod` from the repo root.

---

## 6. Deploy the mobile app (PWA)

The mobile PWA lives in `apps/mobile` and is a **separate Vercel project** (so you get two URLs: one for the web app, one for the mobile app).

### One-time: create a second Vercel project for mobile

1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New** → **Project**.
2. **Import** the same Git repository as the web app (or use **Import Git Repository** and select the repo).
3. Configure the project:
   - **Project Name:** e.g. `agrosoluce-mobile` or `agrosoluce-intel`.
   - **Root Directory:** click **Edit** and set to **`apps/mobile`** (important).
   - **Framework Preset:** Vite (or leave as auto).
   - **Build Command:** leave default (uses `apps/mobile/package.json` → `npm run build`).
   - **Output Directory:** `dist` (already in `apps/mobile/vercel.json`).
4. **Deploy.** No env vars are required for the mobile app unless you add Supabase later.

### Deploy mobile from CLI (alternative)

From the repo root, deploy only the mobile app by pointing Vercel at `apps/mobile`:

```powershell
cd apps/mobile
vercel --prod
```

When prompted, create a new project (e.g. `agrosoluce-mobile`). The mobile app’s `vercel.json` sets build command, output directory, SPA rewrites, and PWA-friendly headers.

### Optional: custom domain for mobile

In the **mobile** Vercel project → **Settings** → **Domains**, add e.g. `app.agrosoluce.com` or `mobile.agrosoluce.com` and follow DNS instructions.

### Optional: link mobile to web app URL

To show an “Open full platform” link in the mobile app, set in the **mobile** Vercel project’s Environment Variables:

- **`VITE_WEB_APP_URL`** = your main web app URL (e.g. `https://www.agrosoluce.com` or your Vercel web URL).

Then redeploy the mobile project.
