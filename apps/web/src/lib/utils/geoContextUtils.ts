/**
 * Geo-context utilities for map and dashboard contextualization.
 * Uses same country-risk lists as enrichment (deforestation, EUDR producer).
 */

import {
  HIGH_DEFORESTATION_RISK_COUNTRIES,
  MEDIUM_DEFORESTATION_RISK_COUNTRIES,
} from '@/config/enrichmentConfig';

/** ISO code to full name for risk list matching */
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  CI: "Côte d'Ivoire",
  GH: 'Ghana',
  ID: 'Indonesia',
  MY: 'Malaysia',
  BR: 'Brazil',
  CO: 'Colombia',
  CM: 'Cameroon',
  EC: 'Ecuador',
  PE: 'Peru',
  VN: 'Vietnam',
};

export type DeforestationRiskLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface GeoContext {
  deforestationRisk: DeforestationRiskLevel;
  deforestationLabel: string;
  countryName: string;
}

/**
 * Resolve country name from record (countryCode or country field).
 */
function resolveCountryName(record: { country?: string; countryCode?: string }): string {
  const code = (record.countryCode || record.country || '').trim().toUpperCase();
  const full = (record.country || '').trim();
  if (COUNTRY_CODE_TO_NAME[code]) return COUNTRY_CODE_TO_NAME[code];
  if (full && full.length > 2) return full; // Full name
  if (code && code.length === 2) return code; // Fallback to code
  return '';
}

/**
 * Get geo-context for a record (e.g. cooperative or region) for display on map and dashboards.
 */
export function getGeoContextForRecord(record: {
  country?: string;
  countryCode?: string;
}): GeoContext {
  const countryName = resolveCountryName(record);
  let deforestationRisk: DeforestationRiskLevel = 'unknown';
  let deforestationLabel = 'Unknown';

  if (countryName) {
    if (HIGH_DEFORESTATION_RISK_COUNTRIES.includes(countryName as any)) {
      deforestationRisk = 'high';
      deforestationLabel = 'High';
    } else if (MEDIUM_DEFORESTATION_RISK_COUNTRIES.includes(countryName as any)) {
      deforestationRisk = 'medium';
      deforestationLabel = 'Medium';
    } else {
      deforestationRisk = 'low';
      deforestationLabel = 'Low';
    }
  }

  return {
    deforestationRisk,
    deforestationLabel,
    countryName: countryName || '—',
  };
}

/**
 * Aggregate geo-context for a set of records (e.g. a region): use worst risk if mixed.
 */
export function aggregateGeoContext(
  records: Array<{ country?: string; countryCode?: string }>
): GeoContext | null {
  if (records.length === 0) return null;
  const contexts = records.map((r) => getGeoContextForRecord(r));
  const hasHigh = contexts.some((c) => c.deforestationRisk === 'high');
  const hasMedium = contexts.some((c) => c.deforestationRisk === 'medium');
  const first = contexts[0];
  const risk: DeforestationRiskLevel = hasHigh ? 'high' : hasMedium ? 'medium' : first.deforestationRisk;
  const label = risk === 'high' ? 'High' : risk === 'medium' ? 'Medium' : risk === 'low' ? 'Low' : 'Unknown';
  return {
    deforestationRisk: risk,
    deforestationLabel: label,
    countryName: first.countryName,
  };
}
