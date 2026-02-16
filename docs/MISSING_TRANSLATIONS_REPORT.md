# Missing Translations Report – Pages & Navigation

This document lists **missing or hardcoded strings** that should use the i18n system (`useI18n` / `t.*`) for EN/FR support.

---

## 1. Navigation (Navbar)

**File:** `apps/web/src/components/layout/Navbar.tsx`

Nav links and footer taglines use `t.nav.*` / `t.footer.*`. The following are still **hardcoded** and should be moved to translations (e.g. `nav.languageMenu`, `nav.themeLight`, etc.):

| String | Location | Suggestion |
|--------|----------|------------|
| `"Change language"` | `aria-label` on language button | `nav.changeLanguage` or `common.changeLanguage` |
| `"🇬🇧 English"` | Desktop language dropdown | `nav.english` |
| `"🇫🇷 Français"` | Desktop language dropdown | `nav.french` |
| `"🇬🇧 EN"` | Mobile language button | `nav.enShort` or reuse |
| `"🇫🇷 FR"` | Mobile language button | `nav.frShort` or reuse |
| `"Close menu"` / `"Open menu"` | `aria-label` mobile menu button | `nav.closeMenu` / `nav.openMenu` |
| `"Dark"` / `"Light"` | Mobile theme toggle label | `nav.themeDark` / `nav.themeLight` |

---

## 2. Breadcrumbs

**File:** `apps/web/src/components/layout/Breadcrumbs.tsx`

- Default first item is hardcoded: `label: 'Home'`.
- Auto-generated labels from path segments use capitalized segment names (e.g. `"Health-Impact"`) and are not translated.

**Pages passing hardcoded breadcrumb items** (should use `t.nav.home`, `t.nav.directory`, etc., or a shared `breadcrumb.*` section):

| Page | Hardcoded labels |
|------|------------------|
| `DirectoryPage.tsx` | `'Home'`, `'Directory'` |
| `DirectoryDetailPage.tsx` | `'Home'`, `'Directory'` |
| `AggregatedDashboardPage.tsx` | `'Home'`, `'Directory'`, `'Aggregated dashboard'` |
| `CooperativeDirectory.tsx` | `'Home'`, `'Cooperatives'` |
| `CooperativeProfile.tsx` | `'Home'`, `'Cooperatives'` |
| `MonitoringPage.tsx` | `'Home'`, `'Monitoring'` |
| `HealthImpactOverview.tsx` | `'Home'`, `'Health & Impact'` |
| `MapPage.tsx` | `'Home'`, `'Map'` |
| `VracAnalysisPage.tsx` | `'Home'`, `'Health Intelligence'` |
| `AnalyticsDashboardPage.tsx` | `'Home'`, `'Analytics'` |
| `HouseholdWelfareIndex.tsx` | `'Home'`, `'Household Welfare Index'` |
| `FrameworkDemoPage.tsx` | `'Home'`, `'Health & Impact'`, `'Framework Demo'` |
| `PilotDashboardPage.tsx` | `'Home'`, `'Directory'` |

**Recommendation:** Add a `breadcrumb` (or reuse `nav`) section in `translations.ts` (e.g. `home`, `directory`, `monitoring`, `aggregatedDashboard`, `cooperatives`, `healthImpact`, `map`, `healthIntelligence`, `analytics`, `hwi`, `frameworkDemo`), use `useI18n()` in `Breadcrumbs` when items are not provided, and have pages pass translated labels or a path→key map.

---

## 3. Pages with Missing / Partial Translations

### 3.1 Directory & directory-related

| File | Missing / hardcoded |
|------|--------------------|
| **DirectoryPage.tsx** | No `useI18n`. Title "Canonical Cooperative Directory", subtitle, breadcrumbs; stats labels "Enregistrements dans le répertoire", "Actifs", "Pays", "Commodités"; filter labels "Commodity", "Country", "Region", "Coverage"; "All commodities", "All", "All levels", "Substantial", "Partial", "Limited"; placeholder "Search by name, region..."; "Show only cooperatives with workspace"; "Visualization dashboard". |
| **AggregatedDashboardPage.tsx** | No `useI18n`. Breadcrumbs; title "Aggregated Dashboard"; stat labels "Cooperatives", "Regions", "Countries", "Commodities"; filter labels; table headers "Region", "Country", "Cooperatives", "Deforestation risk", etc. |
| **DirectoryDetailPage.tsx** | No `useI18n`. Breadcrumbs; mix of FR ("Pays", "Culture Principale", "Source du Registre", "Risques Contextuels") and EN ("Coverage", "Documents", "No documentation submitted", "Required Documents Total", "EUDR Applicable", "Child Labor Due Diligence", "Land Tenure Overview", etc.). |
| **CooperativeDirectory.tsx** | No `useI18n`. Breadcrumbs; "Cooperative Space", "Structured Directory", "Due Diligence Support", "Progress Tracking"; placeholder "Rechercher par nom, département..."; "Filtrer par pays", "Filtrer par produit"; "All Countries", "All Commodities", "EUDR Context Available/Not Available". |
| **CooperativeProfile.tsx** | No `useI18n`. Breadcrumbs; "Producteurs", "Email", "Adresse", "Description", "EUDR Information", "Contextual Information", "Traceability Confidence". |

### 3.2 Health & Impact

| File | Missing / hardcoded |
|------|--------------------|
| **HealthImpactOverview.tsx** | Uses `useI18n` but most content is hardcoded: breadcrumbs "Home", "Health & Impact"; hero "Health-Agriculture Impact Analysis", "Health and Agricultural Productivity", intro paragraph; section "Understanding the Health-Agriculture Correlation", "Key Insight", "The Data Source", VRAC bullets; case study "Case Study: Gontougo Malaria Surge", "Antimalarial Surge", "Production Decline", "Cocoa harvest", "Week Lag", body text, "View Regional Map", "Health Intelligence Dashboard"; "Platform Features" and full `keyFeatures` array (titles, descriptions, linkText); "Business Value", "For Commodity Traders", "For Processors"; `partnerships` array (names, descriptions). Need a `healthImpactOverview` (or `healthImpact`) section in translations. |
| **VracAnalysisPage.tsx** | No `useI18n`. Breadcrumbs; "All Years", "All Pharmacies"; "By Period", "Overall Mix". |
| **HouseholdWelfareIndex.tsx** | No `useI18n`. Breadcrumbs "Home", "Household Welfare Index"; "Error"; config message (SUPABASE_SERVICE_ROLE_KEY, .env). |
| **MapPage.tsx** | No `useI18n`. Breadcrumbs only. |

### 3.3 Monitoring & compliance

| File | Missing / hardcoded |
|------|--------------------|
| **MonitoringPage.tsx** | No `useI18n`. Entire page: breadcrumbs; "Compliance & Monitoring", "Child Labor Monitoring & Compliance", hero description and CTAs "View Dashboard", "New Assessment"; feature cards "Documentation Tracking", "Farmer Engagement", "Progress Monitoring", "Risk Assessment", "Certification Tracking", "Regional Analysis"; "What You Can Monitor", "Documentation Coverage Rate", "Average Readiness Score", etc. Add a `monitoring` (or `complianceTools`) section. |

### 3.4 Analytics, pilot, references

| File | Missing / hardcoded |
|------|--------------------|
| **AnalyticsDashboardPage.tsx** | No `useI18n`. Breadcrumbs; "Compliance" and other UI labels. |
| **FrameworkDemoPage.tsx** | No `useI18n`. Breadcrumbs only (page content may be demo-specific). |
| **PilotDashboardPage.tsx** | No `useI18n`. Breadcrumbs; "Average Coverage", "Not Ready", "In Progress", "Buyer Ready"; "No Cooperatives Found in This Pilot", "What You Can Do", "Browse Directory", "Explore all cooperatives", "For Partners", "Learn about pilot programs", "Buyer Portal", "Access buyer tools", "Important Disclaimer". |
| **PilotListingPage.tsx** | Check for hardcoded titles and labels. |
| **NGORegistryPage.tsx** | No `useI18n`. Placeholder "Search by name, focus, or country..."; "All Focuses", "All Countries"; "Thematic Focus", "View Reports". |
| **RegulatoryReferencesPage.tsx** | No `useI18n`. "All Jurisdictions", "All Regulations". |

### 3.5 Cooperative space (dashboard)

| File | Missing / hardcoded |
|------|--------------------|
| **CooperativeDashboard.tsx** | No `useI18n`. French hardcoded: "Vue d'ensemble", "Producteurs", "Produits", "Traçabilité", "Conformité", "Preuves"; "Prêt pour les acheteurs", "En cours", "Non prêt"; "Documents Requis", "Risques Contextuels", "Producteurs", "Commandes actives", "Parcelles", "Preuves et Attestations", "Audits". Should use `t.cooperative.*` or a dedicated `cooperativeDashboard` section. |
| **CooperativeWorkspace.tsx** | Uses `useI18n` for workspace copy. Document type options hardcoded: "Certification", "Policy", "Land Evidence", "Other". |

### 3.6 Other

| File | Missing / hardcoded |
|------|--------------------|
| **NotFoundPage.tsx** | No `useI18n`. "Page Not Found", "The page you're looking for doesn't exist or has been moved.", "Go Home", "Browse Directory". Add e.g. `notFound.title`, `notFound.description`, `notFound.goHome`, `notFound.browseDirectory`. |

---

## 4. Summary

- **Navigation:** 7 strings in Navbar (language/theme/menu) not translated.
- **Breadcrumbs:** Component and 13+ pages use hardcoded breadcrumb labels; no shared breadcrumb/path i18n.
- **Pages without `useI18n`:** DirectoryPage, AggregatedDashboardPage, DirectoryDetailPage, CooperativeDirectory, CooperativeProfile, MonitoringPage, VracAnalysisPage, HouseholdWelfareIndex, MapPage, AnalyticsDashboardPage, FrameworkDemoPage, PilotDashboardPage, NGORegistryPage, RegulatoryReferencesPage, CooperativeDashboard, NotFoundPage.
- **Pages with partial i18n:** HealthImpactOverview (uses `t` but most content hardcoded), CooperativeWorkspace (document types hardcoded).

**Completed (this pass):**

1. **Navbar** – Added `nav.changeLanguage`, `nav.english`, `nav.french`, `nav.enShort`, `nav.frShort`, `nav.closeMenu`, `nav.openMenu`, `nav.themeDark`, `nav.themeLight`, `nav.frameworkDemo`. Navbar now uses these for language switcher, theme toggle, and menu aria-labels.
2. **NotFoundPage** – Added `notFound` section (title, description, goHome, browseDirectory). Page uses `useI18n` and `t.notFound.*`.
3. **Breadcrumbs** – Component uses `useI18n`; default first item is `t.nav.home`; when `items` are not provided, path segments are translated via `PATH_SEGMENT_TO_NAV_KEY` (e.g. directory, map, cooperatives, health-impact, vrac, analytics, hwi, monitoring, about, buyer, partners, pilot, workspace, aggregate, framework-demo, cooperative, ngos).
4. **MonitoringPage** – Added `monitoring` section (breadcrumb, badge, title, subtitle, intro, CTAs, 6 feature cards, whatYouCanMonitor, documentationCoverageRate, averageReadinessScore). Page uses `useI18n` and `t.monitoring.*` for hero and feature blocks.
5. **HealthImpactOverview** – Added `healthImpactOverview` section (breadcrumb, badge, hero, concept, key insight, data source, case study, platform features, keyFeatures, business value, partnerships). Page uses `t.healthImpactOverview` for all main content; key features and partnerships come from translations.

**Still to do (optional follow-up):**

- Add sections and wire i18n for: `directory`, `directoryDetail`, `cooperativeDirectory`, `cooperativeProfile`, `cooperativeDashboard`, `aggregatedDashboard`, `pilot`, `references`.
- Replace remaining hardcoded strings in MonitoringPage (“How Monitoring Works”, “Getting Started”, “Important Notice”, etc.) and other pages as needed.
