// API functions for Canonical Cooperative Directory
// Table lives in agrosoluce schema. We use .schema('agrosoluce') so it works regardless of client default.
import { supabase } from '@/lib/supabase/client';
import { getStaticDataUrl } from '@/lib/staticDataUrl';
import { formatCooperativeName } from '@/lib/utils/cooperativeUtils';
import type { CanonicalCooperativeDirectory, RecordStatus, EudrCommodity } from '@/types';

const SCHEMA = 'agrosoluce';
/** Supabase/PostgREST default max rows per request; we paginate to fetch all */
const PAGE_SIZE = 1000;

/**
 * Derive EUDR commodities from static JSON "secteur" (and optional primary_crop).
 * Used so the directory filter shows all commodities present in the data (e.g. Cocoa, Rubber, Cattle),
 * not only cocoa. Secteur values in cooperatives_cote_ivoire.json include CULTURES DIVERSES, HEVEA, ELEVAGE ET PECHE, etc.
 */
function deriveCommoditiesFromSecteur(secteur: string | null | undefined, primaryCrop?: string | null): EudrCommodity[] {
  const combined = [secteur ?? '', primaryCrop ?? ''].join(' ').toUpperCase();
  if (!combined.trim()) return [];

  // Explicit EUDR mappings from secteur / primary_crop
  if (/\bHEVEA\b|RUBBER|CAOUTCHOUC/.test(combined)) return ['rubber'];
  if (/\bELEVAGE\b|PECHE|CATTLE|BETAIL|BŒUF|Boeuf/.test(combined)) return ['cattle'];
  if (/\bCACAO\b|COCOA|CACAOYER/.test(combined)) return ['cocoa'];
  if (/\bCAFE\b|COFFEE|CAFÉ/.test(combined)) return ['coffee'];
  if (/\bPALM|HUILE DE PALME|OIL PALM/.test(combined)) return ['palm_oil'];
  if (/\bSOJA\b|SOY|SOJA/.test(combined)) return ['soy'];
  if (/\bBOIS\b|WOOD|TIMBER|FOREST/.test(combined)) return ['wood'];

  // CULTURES DIVERSES in Côte d'Ivoire context is predominantly cocoa; default to cocoa so records are filterable
  if (/\bCULTURES DIVERSES\b/.test(combined)) return ['cocoa'];

  return [];
}

function transformStaticCooperative(raw: any): CanonicalCooperativeDirectory {
  const name = formatCooperativeName(raw.name);
  const region = (raw.region || '').trim();
  const commodities = deriveCommoditiesFromSecteur(raw.secteur, raw.primary_crop);
  // If no EUDR commodity derived, default to cocoa for backward compatibility (CI directory is mostly cocoa)
  const finalCommodities = commodities.length > 0 ? commodities : (['cocoa'] as EudrCommodity[]);
  const primaryCrop = finalCommodities[0] === 'cocoa' ? 'cocoa' : finalCommodities[0] === 'rubber' ? 'rubber' : finalCommodities[0] === 'cattle' ? 'cattle' : raw.primary_crop || undefined;
  return {
    coop_id: String(raw.id ?? raw.registrationNumber ?? `static-${raw.name?.replace(/\s+/g, '-').toLowerCase() ?? 'unknown'}`),
    name,
    country: raw.metadata?.country || "Côte d'Ivoire",
    countryCode: 'CI',
    region,
    regionName: region || undefined,
    department: raw.departement || raw.department,
    primary_crop: primaryCrop,
    commodities: finalCommodities,
    source_registry: raw.metadata?.source,
    record_status: (raw.status === 'active' || raw.status === 'verified') ? 'active' : 'active',
    pilot_id: null,
    pilot_label: undefined,
    coverageBand: undefined,
    created_at: raw.metadata?.importedAt,
  };
}

/** Load all cooperatives from static JSON (no cap — supports 2000+ records) */
async function getCanonicalDirectoryRecordsStaticFallback(): Promise<CanonicalCooperativeDirectory[]> {
  try {
    const res = await fetch(getStaticDataUrl('cooperatives_cote_ivoire.json'));
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json.cooperatives) ? json.cooperatives : [];
    return list.map(transformStaticCooperative);
  } catch {
    return [];
  }
}

/**
 * Fetch all canonical cooperative directory records
 */
export async function getCanonicalDirectoryRecords(): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    const fallback = await getCanonicalDirectoryRecordsStaticFallback();
    return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : new Error('Supabase not configured') };
  }

  try {
    const allRows: any[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .schema(SCHEMA)
        .from('canonical_cooperative_directory')
        .select('*')
        .order('name', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error('Error fetching canonical directory records:', error);
        const fallback = await getCanonicalDirectoryRecordsStaticFallback();
        return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : new Error(error.message) };
      }

      const chunk = data || [];
      allRows.push(...chunk);
      hasMore = chunk.length === PAGE_SIZE;
      offset += PAGE_SIZE;
    }

    const transformed = allRows.map(transformCanonicalRecord);
    if (transformed.length === 0) {
      const fallback = await getCanonicalDirectoryRecordsStaticFallback();
      if (fallback.length > 0) return { data: fallback, error: null };
    }
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    const fallback = await getCanonicalDirectoryRecordsStaticFallback();
    return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : error };
  }
}

/**
 * Fetch canonical directory records by status
 */
export async function getCanonicalDirectoryRecordsByStatus(
  status: RecordStatus
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    const fallback = await getCanonicalDirectoryRecordsStaticFallback();
    return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : new Error('Supabase not configured') };
  }

  try {
    const allRows: any[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .schema(SCHEMA)
        .from('canonical_cooperative_directory')
        .select('*')
        .eq('record_status', status)
        .order('name', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error('Error fetching canonical directory records by status:', error);
        const fallback = await getCanonicalDirectoryRecordsStaticFallback();
        return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : new Error(error.message) };
      }

      const chunk = data || [];
      allRows.push(...chunk);
      hasMore = chunk.length === PAGE_SIZE;
      offset += PAGE_SIZE;
    }

    const transformed = allRows.map(transformCanonicalRecord);
    if (transformed.length === 0) {
      const fallback = await getCanonicalDirectoryRecordsStaticFallback();
      if (fallback.length > 0) return { data: fallback, error: null };
    }
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    const fallback = await getCanonicalDirectoryRecordsStaticFallback();
    return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : error };
  }
}

/**
 * Fetch canonical directory records by country
 */
export async function getCanonicalDirectoryRecordsByCountry(
  country: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('country', country)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by country:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch canonical directory records by primary crop
 */
export async function getCanonicalDirectoryRecordsByPrimaryCrop(
  primaryCrop: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('primary_crop', primaryCrop)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by primary crop:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch a single canonical directory record by ID
 */
export async function getCanonicalDirectoryRecordById(
  coopId: string
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('coop_id', coopId)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Record not found') };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Search canonical directory records by name
 */
export async function searchCanonicalDirectoryRecords(
  query: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching canonical directory records:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new canonical directory record
 */
export async function createCanonicalDirectoryRecord(
  record: Omit<CanonicalCooperativeDirectory, 'coop_id' | 'created_at'>
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .insert({
        name: record.name,
        country: record.country,
        region: record.region,
        department: record.department,
        primary_crop: record.primary_crop,
        source_registry: record.source_registry,
        record_status: record.record_status || 'active',
        pilot_id: record.pilot_id || null,
        pilot_label: record.pilot_label,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating canonical directory record:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update a canonical directory record
 */
export async function updateCanonicalDirectoryRecord(
  coopId: string,
  updates: Partial<Omit<CanonicalCooperativeDirectory, 'coop_id' | 'created_at'>>
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .update(updates)
      .eq('coop_id', coopId)
      .select()
      .single();

    if (error) {
      console.error('Error updating canonical directory record:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Record not found') };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Delete a canonical directory record (admin only)
 */
export async function deleteCanonicalDirectoryRecord(
  coopId: string
): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .delete()
      .eq('coop_id', coopId);

    if (error) {
      console.error('Error deleting canonical directory record:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

/**
 * Fetch canonical directory records by pilot_id
 */
export async function getCanonicalDirectoryRecordsByPilotId(
  pilotId: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('pilot_id', pilotId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by pilot_id:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper function to derive commodities from primary_crop
function deriveCommoditiesFromPrimaryCrop(primaryCrop: string | null | undefined): EudrCommodity[] {
  if (!primaryCrop) return [];
  
  const cropLower = primaryCrop.toLowerCase();
  const commodityMap: Record<string, EudrCommodity> = {
    'cocoa': 'cocoa',
    'cacao': 'cocoa',
    'coffee': 'coffee',
    'café': 'coffee',
    'cafe': 'coffee',
    'palm': 'palm_oil',
    'palm oil': 'palm_oil',
    'palm_oil': 'palm_oil',
    'rubber': 'rubber',
    'soy': 'soy',
    'soja': 'soy',
    'cattle': 'cattle',
    'wood': 'wood',
    'timber': 'wood',
  };
  
  for (const [key, value] of Object.entries(commodityMap)) {
    if (cropLower.includes(key)) {
      return [value];
    }
  }
  
  return [];
}

// Helper function to transform database records to TypeScript types
// Note: canonical_cooperative_directory has primary_crop but no commodities column. Commodities are
// derived from primary_crop here. To get multiple commodities in the directory filter when using
// Supabase, ensure primary_crop (or a future commodities column) is populated with varied values
// (e.g. cocoa, rubber, coffee) when importing or seeding data.
function transformCanonicalRecord(data: any): CanonicalCooperativeDirectory {
  // Use display_name if available, otherwise fall back to name
  // Format the name according to workflow requirements (names should not be displayed directly)
  const rawName = data.display_name || data.name;
  const formattedName = formatCooperativeName(rawName);
  
  // Ensure commodities array is populated - use existing or derive from primary_crop
  let commodities = data.commodities;
  if (!commodities || !Array.isArray(commodities) || commodities.length === 0) {
    commodities = deriveCommoditiesFromPrimaryCrop(data.primary_crop);
  }
  
  return {
    coop_id: data.coop_id.toString(),
    name: formattedName, // Formatted name ready for display (not displayed directly)
    country: data.country,
    countryCode: data.country_code || data.countryCode,
    region: data.region,
    regionName: data.region_name || data.regionName,
    department: data.department,
    primary_crop: data.primary_crop,
    commodities: commodities.length > 0 ? commodities as any : undefined, // Ensure commodities array is populated
    source_registry: data.source_registry,
    record_status: data.record_status || 'active',
    pilot_id: data.pilot_id || null,
    pilot_label: data.pilot_label,
    coverageBand: data.coverage_band || data.coverageBand,
    created_at: data.created_at,
  };
}

