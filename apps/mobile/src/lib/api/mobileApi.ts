/**
 * Mobile API — lightweight Supabase queries used by the three-tier PWA.
 * All functions return { data, error } and handle null supabase client gracefully.
 */

import { supabase } from '../supabase/client';

// ─── ERMITS ──────────────────────────────────────────────────────────────────

export interface ErmitsStats {
  cooperativeCount: number;
  farmerCount: number;
  compliantCount: number;
  actionRequiredCount: number;
  onboardedCount: number;
}

export interface CoopRow {
  id: string;
  name: string;
  region: string | null;
  readiness_status: string | null;
  coverage_metrics: Record<string, any> | null;
  farmer_count?: number;
}

export interface AssessmentRow {
  id: string;
  cooperative_id: string;
  cooperative_name?: string;
  overall_score: number;
  created_at: string;
}

export async function getErmitsStats(): Promise<{ data: ErmitsStats | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const [coopsRes, farmersRes] = await Promise.all([
      supabase.from('cooperatives').select('id, readiness_status', { count: 'exact' }),
      supabase.from('farmers').select('id', { count: 'exact' }).eq('is_active', true),
    ]);

    if (coopsRes.error) throw new Error(coopsRes.error.message);
    if (farmersRes.error) throw new Error(farmersRes.error.message);

    const coops = coopsRes.data || [];
    const compliant = coops.filter((c) => c.readiness_status === 'buyer_ready').length;
    const actionRequired = coops.filter((c) => c.readiness_status === 'not_ready').length;

    // Count onboarded cooperatives (those with completed onboarding)
    const { count: onboardedCount } = await supabase
      .from('cooperative_onboarding')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed');

    return {
      data: {
        cooperativeCount: coopsRes.count ?? coops.length,
        farmerCount: farmersRes.count ?? 0,
        compliantCount: compliant,
        actionRequiredCount: actionRequired,
        onboardedCount: onboardedCount ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getCooperativesList(limit = 20): Promise<{ data: CoopRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('cooperatives')
      .select('id, name, region, readiness_status, coverage_metrics')
      .order('name', { ascending: true })
      .limit(limit);

    if (error) throw new Error(error.message);
    return {
      data: (data || []).map((c) => ({
        id: String(c.id),
        name: c.name || '',
        region: c.region || null,
        readiness_status: c.readiness_status || null,
        coverage_metrics: c.coverage_metrics || null,
        farmer_count: c.coverage_metrics?.farmers_total ?? undefined,
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getRecentAssessments(limit = 10): Promise<{ data: AssessmentRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('id, cooperative_id, overall_score, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    const rows = data || [];
    if (rows.length === 0) return { data: [], error: null };

    // Enrich with cooperative names
    const coopIds = [...new Set(rows.map((r) => r.cooperative_id))];
    const { data: coops } = await supabase
      .from('cooperatives')
      .select('id, name')
      .in('id', coopIds);

    const coopMap = Object.fromEntries((coops || []).map((c) => [String(c.id), c.name]));

    return {
      data: rows.map((r) => ({
        id: String(r.id),
        cooperative_id: String(r.cooperative_id),
        cooperative_name: coopMap[String(r.cooperative_id)] || 'Unknown',
        overall_score: r.overall_score ?? 0,
        created_at: r.created_at,
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ─── COOPERATIVE DASHBOARD ───────────────────────────────────────────────────

export interface CoopDetail {
  id: string;
  name: string;
  region: string | null;
  readiness_status: string | null;
  coverage_metrics: Record<string, any> | null;
}

export interface MemberRow {
  id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface TrainingRow {
  id: string;
  session_title: string;
  session_type: string;
  status: string;
  attendance_count: number;
  scheduled_at: string | null;
}

export interface RemediationRow {
  id: string;
  action: string;
  status: string;
  beneficiaries: number;
  target_date: string | null;
}

export interface ComplianceRow {
  id: string;
  label: string;
  status: string;
  valid: boolean;
}

export async function getCooperativeById(id: string): Promise<{ data: CoopDetail | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('cooperatives')
      .select('id, name, region, readiness_status, coverage_metrics')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return { data: null, error: new Error('Cooperative not found') };
    return {
      data: {
        id: String(data.id),
        name: data.name || '',
        region: data.region || null,
        readiness_status: data.readiness_status || null,
        coverage_metrics: data.coverage_metrics || null,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getMembersByCooperative(cooperativeId: string): Promise<{ data: MemberRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('id, name, registration_number, phone, latitude, longitude')
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return {
      data: (data || []).map((f) => ({
        id: String(f.id),
        name: f.name,
        registration_number: f.registration_number || undefined,
        phone: f.phone || undefined,
        latitude: f.latitude || undefined,
        longitude: f.longitude || undefined,
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getTrainingSessionsByCooperative(cooperativeId: string): Promise<{ data: TrainingRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('id, session_title, session_type, status, attendance_count, scheduled_at')
      .eq('cooperative_id', cooperativeId)
      .order('scheduled_at', { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);
    return {
      data: (data || []).map((t) => ({
        id: String(t.id),
        session_title: t.session_title || '',
        session_type: t.session_type || '',
        status: t.status || 'scheduled',
        attendance_count: t.attendance_count ?? 0,
        scheduled_at: t.scheduled_at || null,
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getAssessmentsByCooperative(cooperativeId: string): Promise<{ data: AssessmentRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('id, cooperative_id, overall_score, created_at')
      .eq('cooperative_id', cooperativeId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw new Error(error.message);
    return {
      data: (data || []).map((r) => ({
        id: String(r.id),
        cooperative_id: String(r.cooperative_id),
        overall_score: r.overall_score ?? 0,
        created_at: r.created_at,
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getComplianceByCooperative(cooperativeId: string): Promise<{ data: ComplianceRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('compliance')
      .select('id, certification_type, status, expiry_date')
      .eq('cooperative_id', cooperativeId)
      .order('certification_type', { ascending: true });

    if (error) throw new Error(error.message);
    const now = new Date();
    return {
      data: (data || []).map((c) => {
        const expired = c.expiry_date && new Date(c.expiry_date) < now;
        const valid = c.status === 'valid' && !expired;
        return {
          id: String(c.id),
          label: c.certification_type || '',
          status: expired ? 'Expired' : c.status === 'valid' ? 'Valid' : 'Update Required',
          valid,
        };
      }),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ─── FARMER FIELD APP ────────────────────────────────────────────────────────

export interface FarmerProfile {
  id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  cooperative_id: string;
  cooperative_name?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeclarationRow {
  id: string;
  declaration_type: string;
  declaration_date: string;
  status: string;
}

export async function getFarmerProfile(farmerId: string): Promise<{ data: FarmerProfile | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('id, name, registration_number, phone, cooperative_id, latitude, longitude')
      .eq('id', farmerId)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return { data: null, error: new Error('Farmer not found') };

    let cooperative_name: string | undefined;
    const { data: coop } = await supabase
      .from('cooperatives')
      .select('name')
      .eq('id', data.cooperative_id)
      .single();
    if (coop) cooperative_name = coop.name;

    return {
      data: {
        id: String(data.id),
        name: data.name,
        registration_number: data.registration_number || undefined,
        phone: data.phone || undefined,
        cooperative_id: String(data.cooperative_id),
        cooperative_name,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getDeclarationsByFarmer(farmerId: string): Promise<{ data: DeclarationRow[]; error: Error | null }> {
  if (!supabase) return { data: [], error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('field_declarations')
      .select('id, declaration_type, declaration_date, status')
      .eq('farmer_id', farmerId)
      .order('declaration_date', { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);
    return {
      data: (data || []).map((d) => ({
        id: String(d.id),
        declaration_type: d.declaration_type || 'Declaration',
        declaration_date: d.declaration_date,
        status: d.status || 'submitted',
      })),
      error: null,
    };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
