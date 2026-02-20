// API functions for Cooperative EUDR Readiness Assessments
// Connects to agrosoluce.cooperative_eudr_readiness table (migration 023)

import { supabase } from '@/lib/supabase/client';

// =============================================
// TYPES
// =============================================

export type GeoResponse = 'none' | 'partial' | 'majority' | 'all';
export type TraceabilityResponse = 'none' | 'manual' | 'digital_partial' | 'digital_full';
export type DdProcedureResponse = 'no' | 'in_progress' | 'yes';
export type StaffTrainedResponse = 'no' | 'planned' | 'yes';
export type ReadinessBand = 'not_ready' | 'developing' | 'ready';

export interface CooperativeEudrReadinessForm {
  // Section 1: Geo-data
  plots_geo_response: GeoResponse | '';
  // Section 2: Declarations
  declarations_response: GeoResponse | '';
  // Section 3: Traceability
  traceability_response: TraceabilityResponse | '';
  // Section 4: Documentation
  has_social_policy: boolean;
  has_land_evidence: boolean;
  has_recent_audit: boolean;
  // Section 5: Certifications
  has_eudr_certification: boolean;
  certification_names: string[];
  // Section 6: Internal Processes
  has_dd_procedure: DdProcedureResponse | '';
  staff_trained: StaffTrainedResponse | '';
}

export interface CooperativeEudrReadiness {
  id: string;
  cooperative_id: string;
  submitted_by?: string;
  plots_geo_coverage_pct?: number;
  plots_geo_response?: GeoResponse;
  declarations_coverage_pct?: number;
  declarations_response?: GeoResponse;
  traceability_response?: TraceabilityResponse;
  has_social_policy: boolean;
  has_land_evidence: boolean;
  has_recent_audit: boolean;
  has_eudr_certification: boolean;
  certification_names?: string[];
  has_dd_procedure?: DdProcedureResponse;
  staff_trained?: StaffTrainedResponse;
  overall_score: number;
  section_scores: Record<string, number>;
  readiness_band: ReadinessBand;
  gaps: Array<{ section: string; message: string; priority: 'critical' | 'high' | 'medium' }>;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// =============================================
// SCORING LOGIC (pure, no side-effects)
// =============================================

const GEO_SCORES: Record<GeoResponse, number> = {
  none: 0,
  partial: 40,
  majority: 75,
  all: 100,
};

const TRACEABILITY_SCORES: Record<TraceabilityResponse, number> = {
  none: 0,
  manual: 30,
  digital_partial: 65,
  digital_full: 100,
};

const DD_PROCEDURE_SCORES: Record<DdProcedureResponse, number> = {
  no: 0,
  in_progress: 50,
  yes: 100,
};

const STAFF_TRAINED_SCORES: Record<StaffTrainedResponse, number> = {
  no: 0,
  planned: 40,
  yes: 100,
};

/** Convert geo coverage response to approximate coverage pct */
const GEO_COVERAGE_PCT: Record<GeoResponse, number> = {
  none: 0,
  partial: 30,
  majority: 70,
  all: 100,
};

export interface ScoredReadiness {
  section_scores: Record<string, number>;
  overall_score: number;
  readiness_band: ReadinessBand;
  gaps: Array<{ section: string; message: string; priority: 'critical' | 'high' | 'medium' }>;
  plots_geo_coverage_pct: number;
  declarations_coverage_pct: number;
}

export function scoreEudrReadiness(form: CooperativeEudrReadinessForm): ScoredReadiness {
  const geoScore = form.plots_geo_response ? GEO_SCORES[form.plots_geo_response as GeoResponse] : 0;
  const declScore = form.declarations_response ? GEO_SCORES[form.declarations_response as GeoResponse] : 0;
  const tracScore = form.traceability_response
    ? TRACEABILITY_SCORES[form.traceability_response as TraceabilityResponse]
    : 0;

  const docScore =
    ((form.has_social_policy ? 1 : 0) +
      (form.has_land_evidence ? 1 : 0) +
      (form.has_recent_audit ? 1 : 0)) *
    (100 / 3);

  const certScore = form.has_eudr_certification ? 100 : 0;

  const ddScore = form.has_dd_procedure ? DD_PROCEDURE_SCORES[form.has_dd_procedure as DdProcedureResponse] : 0;
  const staffScore = form.staff_trained ? STAFF_TRAINED_SCORES[form.staff_trained as StaffTrainedResponse] : 0;
  const processScore = (ddScore + staffScore) / 2;

  // Section weights: geo 25%, declarations 25%, traceability 15%, docs 20%, certs 5%, processes 10%
  const overall =
    geoScore * 0.25 +
    declScore * 0.25 +
    tracScore * 0.15 +
    docScore * 0.2 +
    certScore * 0.05 +
    processScore * 0.1;

  const readiness_band: ReadinessBand =
    overall >= 75 ? 'ready' : overall >= 40 ? 'developing' : 'not_ready';

  const gaps: ScoredReadiness['gaps'] = [];

  if (geoScore < 75) {
    gaps.push({
      section: 'geo',
      message:
        geoScore === 0
          ? 'No GPS plot data — geo-referencing of all farmer plots is required for EUDR due diligence.'
          : 'Less than majority of farmer plots have GPS coordinates. Aim for 100% coverage.',
      priority: geoScore === 0 ? 'critical' : 'high',
    });
  }
  if (declScore < 75) {
    gaps.push({
      section: 'declarations',
      message:
        declScore === 0
          ? 'No farmer deforestation-free declarations on file. All farmers must sign before export.'
          : 'Farmer declaration coverage is incomplete. Aim for 100% signed declarations.',
      priority: declScore === 0 ? 'critical' : 'high',
    });
  }
  if (tracScore < 65) {
    gaps.push({
      section: 'traceability',
      message:
        tracScore === 0
          ? 'No traceability system in place. Lot-level origin tracing is required.'
          : 'Manual-only traceability is insufficient for scale. Move toward digital tracking.',
      priority: tracScore === 0 ? 'critical' : 'medium',
    });
  }
  if (!form.has_social_policy) {
    gaps.push({
      section: 'documentation',
      message: 'No social / child labor policy document uploaded.',
      priority: 'high',
    });
  }
  if (!form.has_land_evidence) {
    gaps.push({
      section: 'documentation',
      message: 'No land-use or deforestation evidence document uploaded.',
      priority: 'high',
    });
  }
  if (!form.has_recent_audit) {
    gaps.push({
      section: 'documentation',
      message: 'No recent audit (internal or third-party) on record.',
      priority: 'medium',
    });
  }
  if (form.has_dd_procedure === 'no' || !form.has_dd_procedure) {
    gaps.push({
      section: 'processes',
      message: 'No internal EUDR due diligence procedure established.',
      priority: 'high',
    });
  }

  return {
    section_scores: {
      geo: Math.round(geoScore),
      declarations: Math.round(declScore),
      traceability: Math.round(tracScore),
      documentation: Math.round(docScore),
      certifications: Math.round(certScore),
      processes: Math.round(processScore),
    },
    overall_score: Math.round(overall * 10) / 10,
    readiness_band,
    gaps,
    plots_geo_coverage_pct: form.plots_geo_response
      ? GEO_COVERAGE_PCT[form.plots_geo_response as GeoResponse]
      : 0,
    declarations_coverage_pct: form.declarations_response
      ? GEO_COVERAGE_PCT[form.declarations_response as GeoResponse]
      : 0,
  };
}

// =============================================
// API
// =============================================

/** Get the most recent EUDR readiness assessment for a cooperative */
export async function getCooperativeEudrReadiness(cooperativeId: string): Promise<{
  data: CooperativeEudrReadiness | null;
  error: Error | null;
}> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('cooperative_eudr_readiness')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: data as CooperativeEudrReadiness | null, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/** Save (upsert) a cooperative EUDR readiness assessment */
export async function saveCooperativeEudrReadiness(
  cooperativeId: string,
  form: CooperativeEudrReadinessForm,
  existingId?: string
): Promise<{
  data: CooperativeEudrReadiness | null;
  error: Error | null;
}> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const scored = scoreEudrReadiness(form);

  const payload = {
    cooperative_id: cooperativeId,
    plots_geo_coverage_pct: scored.plots_geo_coverage_pct,
    plots_geo_response: form.plots_geo_response || null,
    declarations_coverage_pct: scored.declarations_coverage_pct,
    declarations_response: form.declarations_response || null,
    traceability_response: form.traceability_response || null,
    has_social_policy: form.has_social_policy,
    has_land_evidence: form.has_land_evidence,
    has_recent_audit: form.has_recent_audit,
    has_eudr_certification: form.has_eudr_certification,
    certification_names: form.certification_names.length > 0 ? form.certification_names : null,
    has_dd_procedure: form.has_dd_procedure || null,
    staff_trained: form.staff_trained || null,
    overall_score: scored.overall_score,
    section_scores: scored.section_scores,
    readiness_band: scored.readiness_band,
    gaps: scored.gaps,
    completed_at: new Date().toISOString(),
  };

  try {
    let result;
    if (existingId) {
      result = await supabase
        .from('cooperative_eudr_readiness')
        .update(payload)
        .eq('id', existingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('cooperative_eudr_readiness')
        .insert([payload])
        .select()
        .single();
    }

    if (result.error) return { data: null, error: new Error(result.error.message) };

    // Also update the cooperative's compliance_flags.eudrReady based on readiness band
    const eudrReady = scored.readiness_band === 'ready';
    await supabase
      .from('cooperatives')
      .update({
        compliance_flags: { eudrReady },
        updated_at: new Date().toISOString(),
      })
      .eq('id', cooperativeId);

    return { data: result.data as CooperativeEudrReadiness, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
