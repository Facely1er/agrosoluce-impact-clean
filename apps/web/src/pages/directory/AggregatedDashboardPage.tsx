/**
 * Aggregated Dashboard — same structure as Canonical Directory, with filters
 * that browse data across regions bidirectionally (overview ↔ drill-down by region).
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  X,
  ClipboardList,
  Grid3x3,
  List,
  MapPin,
  ArrowLeft,
  Layers,
  RefreshCw,
} from 'lucide-react';
import {
  getCanonicalDirectoryRecords,
  getCanonicalDirectoryRecordsByStatus,
} from '@/features/cooperatives/api/canonicalDirectoryApi';
import CanonicalDirectoryCard from '@/features/cooperatives/components/CanonicalDirectoryCard';
import CanonicalDirectoryMap from '@/features/cooperatives/components/CanonicalDirectoryMap';
import type { RegionHealthInfo } from '@/features/cooperatives/components/CanonicalDirectoryMap';
import RegionAggregateCard from '@/features/cooperatives/components/RegionAggregateCard';
import type { RegionAggregateData } from '@/features/cooperatives/components/RegionAggregateCard';
import PageShell from '@/components/layout/PageShell';
import { aggregateGeoContext } from '@/lib/utils/geoContextUtils';
import { useVracData } from '@/hooks/useVracData';
import type { CanonicalCooperativeDirectory } from '@/types';
import type { EudrCommodity } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

const VRAC_REGION_TO_DISPLAY: Record<string, string> = {
  gontougo: 'Gontougo',
  la_me: 'La Mé',
  abidjan: 'Abidjan',
};

function getCommoditiesFromRecord(record: CanonicalCooperativeDirectory): EudrCommodity[] {
  if (record.commodities && record.commodities.length > 0) return record.commodities;
  if (record.primary_crop) {
    const cropLower = record.primary_crop.toLowerCase();
    const map: Record<string, EudrCommodity> = {
      cocoa: 'cocoa', cacao: 'cocoa', coffee: 'coffee', café: 'coffee',
      palm: 'palm_oil', 'palm oil': 'palm_oil', rubber: 'rubber', soy: 'soy',
      soja: 'soy', cattle: 'cattle', wood: 'wood', timber: 'wood',
    };
    for (const [key, value] of Object.entries(map)) {
      if (cropLower.includes(key)) return [value];
    }
  }
  return [];
}

export default function AggregatedDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { healthIndex } = useVracData();
  const [records, setRecords] = useState<CanonicalCooperativeDirectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const regionFromUrl = searchParams.get('region');
  const [selectedCountry, setSelectedCountry] = useState<string>('CI');
  const [selectedRegion, setSelectedRegion] = useState<string>(regionFromUrl || 'all');
  const [selectedCommodity, setSelectedCommodity] = useState<EudrCommodity | 'all'>('all');
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');

  useEffect(() => {
    if (regionFromUrl && regionFromUrl !== selectedRegion) {
      setSelectedRegion(regionFromUrl);
      setViewMode('grid');
    }
  }, [regionFromUrl]);

  useEffect(() => {
    if (selectedRegion !== 'all' && selectedRegion !== regionFromUrl) {
      setSearchParams({ region: selectedRegion }, { replace: true });
    } else if (selectedRegion === 'all' && regionFromUrl) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedRegion, regionFromUrl, setSearchParams]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCanonicalDirectoryRecordsByStatus('active');
      if (result.error) throw result.error;
      setRecords(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const regionHealth = useMemo((): Record<string, RegionHealthInfo> => {
    if (!healthIndex.length) return {};
    const byRegion: Record<string, { shares: number[]; antibiotic?: number[]; risks: ('low' | 'medium' | 'high')[] }> = {};
    for (const h of healthIndex) {
      const regionKey = (h as any).regionId || (h.regionLabel && (h.regionLabel as string).replace(/\s*\(.*\)$/, '').trim()) || '';
      const displayName = VRAC_REGION_TO_DISPLAY[regionKey.toLowerCase()] || regionKey || (h.regionLabel?.split(' ')[0]);
      if (!displayName) continue;
      if (!byRegion[displayName]) byRegion[displayName] = { shares: [], antibiotic: [], risks: [] };
      byRegion[displayName].shares.push(h.antimalarialShare * 100);
      if ((h as any).antibioticShare != null) (byRegion[displayName].antibiotic ??= []).push((h as any).antibioticShare * 100);
      if ((h as any).harvestAlignedRisk) byRegion[displayName].risks.push((h as any).harvestAlignedRisk);
    }
    const out: Record<string, RegionHealthInfo> = {};
    for (const [name, data] of Object.entries(byRegion)) {
      const avgShare = data.shares.length ? data.shares.reduce((a, b) => a + b, 0) / data.shares.length : 0;
      const avgAntibiotic = data.antibiotic?.length
        ? data.antibiotic.reduce((a, b) => a + b, 0) / data.antibiotic.length
        : undefined;
      const worstRisk = data.risks.includes('high') ? 'high' : data.risks.includes('medium') ? 'medium' : data.risks[0];
      out[name] = { antimalarialSharePct: avgShare, antibioticSharePct: avgAntibiotic, harvestRisk: worstRisk };
    }
    return out;
  }, [healthIndex]);

  const countries = useMemo(
    () =>
      Array.from(new Set(records.map((c) => c.countryCode || c.country).filter(Boolean))).sort(),
    [records]
  );

  const regions = useMemo(
    () =>
      Array.from(
        new Set(
          records
            .filter((c) => selectedCountry === 'all' || (c.countryCode || c.country) === selectedCountry)
            .map((c) => c.regionName || c.region || 'Unspecified')
        )
      ).sort(),
    [records, selectedCountry]
  );

  const availableCommodities = useMemo(() => {
    const set = new Set<EudrCommodity>();
    records.forEach((r) => getCommoditiesFromRecord(r).forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => {
      const la = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === a)?.label || a;
      const lb = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === b)?.label || b;
      return la.localeCompare(lb);
    });
  }, [records]);

  const regionAggregates = useMemo((): RegionAggregateData[] => {
    const byRegion: Record<string, { country: string; records: CanonicalCooperativeDirectory[]; commodities: Record<string, number> }> = {};
    const base = records.filter(
      (r) =>
        (selectedCountry === 'all' || (r.countryCode || r.country) === selectedCountry) &&
        (selectedCommodity === 'all' || getCommoditiesFromRecord(r).includes(selectedCommodity))
    );
    base.forEach((r) => {
      const region = r.regionName || r.region || 'Unspecified';
      const country = r.countryCode || r.country || 'CI';
      if (!byRegion[region]) byRegion[region] = { country, records: [], commodities: {} };
      byRegion[region].records.push(r);
      getCommoditiesFromRecord(r).forEach((c) => {
        byRegion[region].commodities[c] = (byRegion[region].commodities[c] || 0) + 1;
      });
    });
    return Object.entries(byRegion)
      .map(([region, data]) => ({
        region,
        country: data.country,
        count: data.records.length,
        commodities: data.commodities,
        health: regionHealth[region],
        geoContext: aggregateGeoContext(data.records),
      }))
      .sort((a, b) => b.count - a.count);
  }, [records, selectedCountry, selectedCommodity, regionHealth]);

  const recordsInSelectedRegion = useMemo(() => {
    if (selectedRegion === 'all') return [];
    return records.filter((r) => {
      const region = r.regionName || r.region || 'Unspecified';
      const country = r.countryCode || r.country;
      return (
        region === selectedRegion &&
        (selectedCountry === 'all' || country === selectedCountry) &&
        (selectedCommodity === 'all' || getCommoditiesFromRecord(r).includes(selectedCommodity))
      );
    });
  }, [records, selectedRegion, selectedCountry, selectedCommodity]);

  const stats = useMemo(() => {
    const total = records.length;
    const regionCount = regionAggregates.length;
    const countryCount = new Set(records.map((r) => r.countryCode || r.country).filter(Boolean)).size;
    const commodityCount = availableCommodities.length;
    return { total, regionCount, countryCount, commodityCount };
  }, [records, regionAggregates.length, availableCommodities.length]);

  const clearFilters = () => {
    setSelectedCountry('CI');
    setSelectedRegion('all');
    setSelectedCommodity('all');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    selectedCountry !== 'CI' ||
    selectedRegion !== 'all' ||
    selectedCommodity !== 'all';

  const isDrillDown = selectedRegion !== 'all';

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    setViewMode('grid');
    setSearchParams({ region }, { replace: true });
  };

  const handleBackToAllRegions = () => {
    setSelectedRegion('all');
    setSearchParams({}, { replace: true });
  };

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load data: {error}</p>
          <button
            onClick={fetchRecords}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageShell breadcrumbs={[
      { label: 'Home', path: '/' },
      { label: 'Directory', path: '/directory' },
      { label: 'Aggregated dashboard', path: '/directory/aggregate' },
    ]}>
      <div>

        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Aggregated Dashboard</h1>
                <p className="text-white/90 text-lg">
                  Browse data by region bidirectionally: overview by region or drill down into a single region
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-primary-500">
            <div className="text-3xl font-bold text-primary-600 mb-1">{stats.total.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Cooperatives</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.regionCount}</div>
            <div className="text-gray-600 text-sm">Regions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-secondary-500">
            <div className="text-3xl font-bold text-secondary-600 mb-1">{stats.countryCount}</div>
            <div className="text-gray-600 text-sm">Countries</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.commodityCount}</div>
            <div className="text-gray-600 text-sm">Commodities</div>
          </div>
        </div>

        <section className="mb-4 space-y-2 bg-white rounded-lg shadow-md p-6">
          <p className="text-xs text-gray-600 mb-4">
            Filter by country and region. Choose &quot;All&quot; regions for an overview, or select a region to drill down. Navigate back with &quot;All regions&quot; or the back button.
          </p>

          <div className="flex flex-wrap gap-3 items-center text-xs">
            <label className="flex items-center gap-1">
              <span className="font-medium">Country</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                {countries.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1">
              <span className="font-medium">Region</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All regions (overview)</option>
                {regions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-1">
              <span className="font-medium">Commodity</span>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value as EudrCommodity | 'all')}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                {EUDR_COMMODITIES_IN_SCOPE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            {isDrillDown && (
              <button
                type="button"
                onClick={handleBackToAllRegions}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-secondary-700 bg-secondary-100 rounded hover:bg-secondary-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All regions
              </button>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-900 bg-gray-100 rounded"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </section>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isDrillDown
                ? `${selectedRegion} (${recordsInSelectedRegion.length} cooperatives)`
                : `Regions (${regionAggregates.length})`}
            </h2>
          </div>

          {isDrillDown && recordsInSelectedRegion.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No cooperatives in this region for the current filters.</p>
              <button
                type="button"
                onClick={handleBackToAllRegions}
                className="mt-4 text-secondary-600 hover:underline text-sm"
              >
                Back to all regions
              </button>
            </div>
          ) : !isDrillDown && regionAggregates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No regions match the current filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-secondary-600 hover:underline text-sm"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Map view"
                  aria-label="Map view"
                  aria-pressed={viewMode === 'map'}
                >
                  <MapPin className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Grid view"
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-secondary-100 text-secondary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="List view"
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {viewMode === 'map' && (
                <div className="rounded-lg overflow-hidden">
                  <CanonicalDirectoryMap
                    records={
                      isDrillDown ? recordsInSelectedRegion : records.filter(
                        (r) =>
                          (selectedCountry === 'all' || (r.countryCode || r.country) === selectedCountry) &&
                          (selectedCommodity === 'all' || getCommoditiesFromRecord(r).includes(selectedCommodity))
                      )
                    }
                    regionHealth={Object.keys(regionHealth).length > 0 ? regionHealth : undefined}
                    onRegionClick={handleRegionClick}
                  />
                </div>
              )}

              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isDrillDown
                    ? recordsInSelectedRegion.map((coop) => (
                        <CanonicalDirectoryCard key={coop.coop_id} record={coop} />
                      ))
                    : regionAggregates.map((agg) => (
                        <RegionAggregateCard
                          key={agg.region}
                          data={agg}
                          onSelectRegion={handleRegionClick}
                        />
                      ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="overflow-x-auto">
                  {isDrillDown ? (
                    <ul className="space-y-3">
                      {recordsInSelectedRegion.map((coop) => {
                        const regionLabel = coop.regionName || coop.region || '—';
                        const countryLabel = coop.countryCode || coop.country || '—';
                        const comm = getCommoditiesFromRecord(coop)[0];
                        const commLabel = comm ? EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === comm)?.label || comm : '—';
                        return (
                          <li
                            key={coop.coop_id}
                            className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 flex flex-wrap items-center justify-between gap-2"
                          >
                            <div>
                              <div className="text-xs text-gray-600">
                                {commLabel} · {countryLabel} · {regionLabel}
                              </div>
                              <h3 className="font-semibold text-gray-900">{coop.name}</h3>
                            </div>
                            <a
                              href={`/directory/${coop.coop_id}`}
                              className="text-sm text-secondary-600 hover:underline"
                            >
                              View profile →
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-600">
                          <th className="py-2 pr-4">Region</th>
                          <th className="py-2 pr-4">Country</th>
                          <th className="py-2 pr-4 text-right">Cooperatives</th>
                          <th className="py-2 pr-4 text-right">Antimalarial %</th>
                          <th className="py-2 pr-4 text-right">Deforestation risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionAggregates.map((agg) => (
                          <tr
                            key={agg.region}
                            onClick={() => handleRegionClick(agg.region)}
                            className="border-b border-gray-100 hover:bg-secondary-50 cursor-pointer"
                          >
                            <td className="py-3 pr-4 font-medium text-gray-900">{agg.region}</td>
                            <td className="py-3 pr-4 text-gray-600">{agg.country}</td>
                            <td className="py-3 pr-4 text-right font-semibold text-primary-600">
                              {agg.count}
                            </td>
                            <td className="py-3 pr-4 text-right text-gray-600">
                              {agg.health != null ? `${agg.health.antimalarialSharePct.toFixed(1)}%` : '—'}
                            </td>
                            <td className="py-3 pr-4 text-right text-gray-600">
                              {agg.geoContext?.deforestationLabel ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
