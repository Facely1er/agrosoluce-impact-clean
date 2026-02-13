/**
 * HWI Service - API layer for accessing Household Welfare Index data
 * 
 * Provides functions to fetch, filter, and export HWI scores from Supabase.
 * When Supabase is not configured, returns empty data so the app can show a graceful empty state.
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';

let hwiConfigWarned = false;
function warnIfNotConfigured(): void {
  if (import.meta.env.DEV && !hwiConfigWarned && !isSupabaseConfigured()) {
    hwiConfigWarned = true;
    console.warn('Supabase not configured, HWI data unavailable. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or in your host env.');
  }
}

/** Treat API errors (401 RLS, 400 missing RPC/view, etc.) as empty data and log once. */
let hwiAccessWarned = false;
function warnAccessAndReturnEmpty<T>(err: unknown, empty: T): T {
  if (!hwiAccessWarned) {
    hwiAccessWarned = true;
    const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : String(err);
    console.warn(
      'HWI: database access issue (RLS policies or missing views/RPC). Showing empty data. Details:',
      msg
    );
  }
  return empty;
}

export interface HWIScore {
  id: string;
  pharmacy_id: string;
  departement: string;
  region: string | null;
  period_label: string;
  year: number;
  hwi_score: number;
  workforce_health_score: number | null;
  child_welfare_score: number | null;
  womens_health_score: number | null;
  womens_empowerment_score: number | null;
  nutrition_score: number | null;
  chronic_illness_score: number | null;
  acute_illness_score: number | null;
  alert_level: 'green' | 'yellow' | 'red' | 'black';
  total_quantity: number;
  category_breakdown: Record<string, number> | null;
  created_at: string;
  updated_at: string;
}

export interface HWIScoreWithPharmacy extends HWIScore {
  pharmacy_name?: string;
  pharmacy_region?: string;
  location?: string;
}

export interface CategoryAggregate {
  id: string;
  pharmacy_id: string;
  period_label: string;
  year: number;
  category: string;
  quantity: number;
  share: number;
  created_at: string;
  updated_at: string;
}

export interface HWIFilters {
  year?: number;
  years?: number[];
  departement?: string;
  departements?: string[];
  alertLevel?: string;
  alertLevels?: string[];
  pharmacyId?: string;
  pharmacyIds?: string[];
}

/**
 * Get HWI scores with optional filters
 */
export async function getHWIScores(filters?: HWIFilters): Promise<HWIScore[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  let query = supabase
    .from('household_welfare_index')
    .select('*')
    .order('year', { ascending: false })
    .order('period_label', { ascending: false });

  // Apply filters
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.years && filters.years.length > 0) {
    query = query.in('year', filters.years);
  }
  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.departements && filters.departements.length > 0) {
    query = query.in('departement', filters.departements);
  }
  if (filters?.alertLevel) {
    query = query.eq('alert_level', filters.alertLevel);
  }
  if (filters?.alertLevels && filters.alertLevels.length > 0) {
    query = query.in('alert_level', filters.alertLevels);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }
  if (filters?.pharmacyIds && filters.pharmacyIds.length > 0) {
    query = query.in('pharmacy_id', filters.pharmacyIds);
  }

  const { data, error } = await query;

  if (error) return warnAccessAndReturnEmpty(error, [] as HWIScore[]);
  return data || [];
}

/**
 * Get latest HWI scores for each pharmacy
 */
export async function getLatestHWIScores(): Promise<HWIScoreWithPharmacy[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  const { data, error } = await supabase
    .from('v_hwi_latest')
    .select('*')
    .order('hwi_score', { ascending: false });

  if (error) return warnAccessAndReturnEmpty(error, [] as HWIScoreWithPharmacy[]);
  return data || [];
}

/**
 * Get active alerts (non-green alert levels)
 */
export async function getActiveAlerts(): Promise<HWIScoreWithPharmacy[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  const { data, error } = await supabase
    .from('v_hwi_active_alerts')
    .select('*');

  if (error) return warnAccessAndReturnEmpty(error, [] as HWIScoreWithPharmacy[]);
  return data || [];
}

/**
 * Get HWI time series data
 */
export async function getHWITimeSeries(filters?: {
  departement?: string;
  pharmacyId?: string;
}): Promise<HWIScore[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  let query = supabase
    .from('household_welfare_index')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }

  const { data, error } = await query;

  if (error) return warnAccessAndReturnEmpty(error, [] as HWIScore[]);
  return data || [];
}

/**
 * Get category aggregates
 */
export async function getCategoryAggregates(filters?: {
  year?: number;
  pharmacyId?: string;
  category?: string;
}): Promise<CategoryAggregate[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  let query = supabase
    .from('vrac_category_aggregates')
    .select('*')
    .order('year', { ascending: false })
    .order('period_label', { ascending: false });

  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error) return warnAccessAndReturnEmpty(error, [] as CategoryAggregate[]);
  return data || [];
}

/**
 * Get HWI summary statistics
 */
export async function getHWISummary(
  departement?: string,
  year?: number
): Promise<any[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  const { data, error } = await supabase.rpc('get_hwi_summary', {
    dept_name: departement || null,
    target_year: year || null,
  });

  if (error) return warnAccessAndReturnEmpty(error, [] as any[]);
  return data || [];
}

/**
 * Get alert distribution (counts by alert_level with percentage).
 * Falls back to computing from latest scores if RPC is missing or returns 400.
 */
export async function getAlertDistribution(year?: number): Promise<{ alert_level: string; count: number; percentage: number }[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  const { data, error } = await supabase.rpc('get_alert_distribution', {
    target_year: year || null,
  });

  if (!error && data && Array.isArray(data) && data.length > 0) return data as { alert_level: string; count: number; percentage: number }[];

  if (error) warnAccessAndReturnEmpty(error, []);

  // Fallback: compute from latest scores when RPC is missing or fails
  const scores = await getLatestHWIScores();
  if (scores.length === 0) return [];

  const total = scores.length;
  const counts: Record<string, number> = { green: 0, yellow: 0, red: 0, black: 0 };
  for (const s of scores) {
    if (s.alert_level in counts) counts[s.alert_level]++;
  }
  return (['green', 'yellow', 'red', 'black'] as const).map((alert_level) => ({
    alert_level,
    count: counts[alert_level],
    percentage: total ? Math.round((counts[alert_level] / total) * 100) : 0,
  }));
}

/**
 * Get timeseries by departement
 */
export async function getTimeSeriesByDepartement(filters?: {
  departement?: string;
  year?: number;
}): Promise<any[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  let query = supabase
    .from('v_hwi_timeseries_by_dept')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }

  const { data, error } = await query;

  if (error) return warnAccessAndReturnEmpty(error, [] as any[]);
  return data || [];
}

/**
 * Get category trends
 */
export async function getCategoryTrends(filters?: {
  category?: string;
  year?: number;
}): Promise<any[]> {
  if (!isSupabaseConfigured() || !supabase) {
    warnIfNotConfigured();
    return [];
  }
  let query = supabase
    .from('v_category_trends')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }

  const { data, error } = await query;

  if (error) return warnAccessAndReturnEmpty(error, [] as any[]);
  return data || [];
}

/**
 * Export HWI scores to CSV format
 */
export function exportToCSV(scores: HWIScore[]): string {
  if (scores.length === 0) {
    return '';
  }

  // Define headers
  const headers = [
    'Pharmacy ID',
    'Departement',
    'Region',
    'Period',
    'Year',
    'HWI Score',
    'Alert Level',
    'Workforce Health',
    'Child Welfare',
    "Women's Health",
    "Women's Empowerment",
    'Nutrition',
    'Chronic Illness',
    'Acute Illness',
    'Total Quantity',
  ];

  // Build rows
  const rows = scores.map(score => [
    score.pharmacy_id,
    score.departement,
    score.region || '',
    score.period_label,
    score.year,
    score.hwi_score.toFixed(2),
    score.alert_level,
    (score.workforce_health_score || 0).toFixed(2),
    (score.child_welfare_score || 0).toFixed(2),
    (score.womens_health_score || 0).toFixed(2),
    (score.womens_empowerment_score || 0).toFixed(2),
    (score.nutrition_score || 0).toFixed(2),
    (score.chronic_illness_score || 0).toFixed(2),
    (score.acute_illness_score || 0).toFixed(2),
    score.total_quantity,
  ]);

  // Combine into CSV
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Export HWI scores to JSON format
 */
export function exportToJSON(scores: HWIScore[]): string {
  return JSON.stringify(scores, null, 2);
}

/**
 * Download exported data
 */
export function downloadExport(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
