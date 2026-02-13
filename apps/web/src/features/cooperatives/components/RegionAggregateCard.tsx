import { MapPin, Building2, Activity, Package, Globe } from 'lucide-react';
import type { RegionHealthInfo } from '@/features/cooperatives/components/CanonicalDirectoryMap';
import type { GeoContext } from '@/lib/utils/geoContextUtils';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

export interface RegionAggregateData {
  region: string;
  country: string;
  count: number;
  commodities: Record<string, number>;
  health?: RegionHealthInfo;
  geoContext?: GeoContext | null;
}

interface RegionAggregateCardProps {
  data: RegionAggregateData;
  onSelectRegion: (region: string) => void;
}

export default function RegionAggregateCard({ data, onSelectRegion }: RegionAggregateCardProps) {
  const commodityLabels = Object.entries(data.commodities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, n]) => {
      const label = EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === id)?.label || id;
      return `${label} (${n})`;
    })
    .join(', ');

  return (
    <button
      type="button"
      onClick={() => onSelectRegion(data.region)}
      className="w-full text-left bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-secondary-300 transition-all focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-secondary-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{data.region}</h3>
            <p className="text-xs text-gray-500">{data.country}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-lg">
          <Building2 className="h-4 w-4" />
          <span className="font-bold text-lg">{data.count}</span>
        </div>
      </div>
      {commodityLabels && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
          <Package className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{commodityLabels}</span>
        </div>
      )}
      {data.health != null && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
          <Activity className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
          <span>
            Antimalarial {data.health.antimalarialSharePct.toFixed(1)}%
            {data.health.antibioticSharePct != null &&
              ` · Antibiotic ${data.health.antibioticSharePct.toFixed(1)}%`}
          </span>
        </div>
      )}
      {data.geoContext != null && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
          <Globe className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span>
            Deforestation risk: <strong>{data.geoContext.deforestationLabel}</strong>
            {data.geoContext.countryName && data.geoContext.countryName !== '—' && ` · ${data.geoContext.countryName}`}
          </span>
        </div>
      )}
      <p className="text-xs text-secondary-600 mt-3 font-medium">View cooperatives →</p>
    </button>
  );
}
