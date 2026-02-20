import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegionCoordinates } from '@/lib/utils/cooperativeUtils';
import { aggregateGeoContext } from '@/lib/utils/geoContextUtils';
import type { CanonicalCooperativeDirectory } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';
import styles from './CanonicalDirectoryMap.module.css';

// Fix Leaflet default icon paths for Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/** Regional health metrics from VRAC pharmacy surveillance (antimalarial/antibiotic share, harvest risk) */
export interface RegionHealthInfo {
  antimalarialSharePct: number;
  antibioticSharePct?: number;
  harvestRisk?: 'low' | 'medium' | 'high';
}

interface CanonicalDirectoryMapProps {
  records: CanonicalCooperativeDirectory[];
  /** When provided, popups and legend show VRAC health metrics per region */
  regionHealth?: Record<string, RegionHealthInfo>;
  /** Map container height (e.g. '600px' or 'calc(100vh - 140px)') */
  height?: string | number;
  /** Called when user clicks "View cooperatives" for a region */
  onRegionClick?: (region: string) => void;
}

// Component to update map bounds when records change
function MapUpdater({ records }: { records: CanonicalCooperativeDirectory[] }) {
  const map = useMap();

  useEffect(() => {
    if (records.length === 0) return;

    const coordinates: [number, number][] = [];
    records.forEach(record => {
      const region = record.regionName || record.region;
      if (region) {
        const coords = getRegionCoordinates(region);
        coordinates.push(coords);
      }
    });

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [records, map]);

  return null;
}

export default function CanonicalDirectoryMap({
  records,
  regionHealth,
  height,
  onRegionClick,
}: CanonicalDirectoryMapProps) {
  // Calculate cooperative counts per region
  const regionData: Record<string, { count: number; records: CanonicalCooperativeDirectory[] }> = {};
  
  records.forEach(record => {
    const region = record.regionName || record.region || 'Unspecified';
    if (!regionData[region]) {
      regionData[region] = { count: 0, records: [] };
    }
    regionData[region].count += 1;
    regionData[region].records.push(record);
  });

  const hasHealth = regionHealth && Object.keys(regionHealth).length > 0;
  const mapHeight = height != null ? (typeof height === 'number' ? `${height}px` : height) : '600px';
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapWrapperRef.current?.style.setProperty('--map-height', mapHeight);
  }, [mapHeight]);

  // Default center for Côte d'Ivoire
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = records.length === 0 ? 7 : 8;

  return (
    <div ref={mapWrapperRef} className={`relative ${styles.mapWrapper}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className={`z-0 ${styles.mapContainer}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater records={records} />
        
        {Object.entries(regionData).map(([region, data]) => {
          const coords = getRegionCoordinates(region);
          const markerTier =
            data.count >= 100 ? 'markerTier4' : data.count >= 50 ? 'markerTier3' : data.count >= 20 ? 'markerTier2' : 'markerTier1';

          // Get commodities for this region
          const commodities = new Set<string>();
          data.records.forEach(record => {
            if (record.commodities && record.commodities.length > 0) {
              record.commodities.forEach(c => commodities.add(c));
            }
          });

          const commodityLabels = Array.from(commodities)
            .map(c => EUDR_COMMODITIES_IN_SCOPE.find(e => e.id === c)?.label || c)
            .join(', ');

          const health = hasHealth ? regionHealth![region] : undefined;
          const geoContext = aggregateGeoContext(data.records);

          return (
            <Marker key={region} position={coords} icon={L.divIcon({
              className: 'custom-marker',
              html: `<div class="${styles.markerBubble} ${styles[markerTier]}">${data.count}</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}>
              <Popup>
                <div className={styles.popupRoot}>
                  <h3 className={styles.popupTitle}>{region}</h3>
                  <div className={styles.popupCountWrap}>
                    <strong className={styles.popupCountNum}>{data.count}</strong>
                    <span className={styles.popupCountLabel}>
                      {' '}coopérative{data.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  {commodityLabels && (
                    <div className={styles.commoditiesBlock}>
                      <strong>Commodities:</strong> {commodityLabels}
                    </div>
                  )}
                  {health != null && (
                    <div className={styles.healthBlock}>
                      <strong className={styles.healthTitle}>Health (VRAC)</strong>
                      <div className={styles.healthContent}>
                        <span>Antimalarial share: <strong>{health.antimalarialSharePct.toFixed(1)}%</strong></span>
                        {health.antibioticSharePct != null && (
                          <div>Antibiotic share: <strong>{health.antibioticSharePct.toFixed(1)}%</strong></div>
                        )}
                        {health.harvestRisk && (
                          <div>Harvest risk: <strong>{health.harvestRisk}</strong></div>
                        )}
                      </div>
                    </div>
                  )}
                  {geoContext != null && (
                    <div className={styles.geoBlock}>
                      <strong className={styles.geoTitle}>Geo context</strong>
                      <div className={styles.geoContent}>
                        <span>Country: {geoContext.countryName}</span>
                        <div>Deforestation risk: <strong>{geoContext.deforestationLabel}</strong></div>
                      </div>
                    </div>
                  )}
                  <div className={styles.popupActions}>
                    <a
                      href={onRegionClick ? undefined : `/directory?region=${encodeURIComponent(region)}`}
                      onClick={onRegionClick ? (e) => { e.preventDefault(); onRegionClick(region); } : undefined}
                      className={styles.popupLink}
                    >
                      View cooperatives →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-[260px] border border-gray-200">
        <h4 className="font-semibold text-secondary-600 mb-3 text-sm">Légende</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span>100+ coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow"></div>
            <span>50-99 coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
            <span>20-49 coopératives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white shadow"></div>
            <span>1-19 coopératives</span>
          </div>
        </div>
        {hasHealth && (
          <>
            <div className="border-t border-gray-200 mt-3 pt-3">
              <h4 className="font-semibold text-primary-600 mb-2 text-sm">Health (VRAC)</h4>
              <p className="text-[10px] text-gray-500 mb-2">Antimalarial share by region</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`${styles.healthDot} ${styles.healthDotHigh}`} />
                  <span>High (≥15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${styles.healthDot} ${styles.healthDotMedium}`} />
                  <span>Medium (8–15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${styles.healthDot} ${styles.healthDotLower}`} />
                  <span>Lower (&lt;8%)</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Pharmacy surveillance data</p>
            </div>
          </>
        )}
        <div className="border-t border-gray-200 mt-3 pt-3">
          <p className="text-[10px] text-gray-500">Geo context: deforestation risk by country (EUDR)</p>
        </div>
      </div>
    </div>
  );
}

