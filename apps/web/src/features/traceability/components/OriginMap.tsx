import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Batch } from '@/types';
import styles from './OriginMap.module.css';

interface OriginMapProps {
  batch: Batch;
  height?: string;
}

export default function OriginMap({ batch, height = '400px' }: OriginMapProps) {
  const hasLocation = batch.origin_gps_latitude && batch.origin_gps_longitude;
  const placeholderRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    placeholderRef.current?.style.setProperty('--origin-map-height', height);
    mapRef.current?.style.setProperty('--origin-map-height', height);
  }, [height]);

  if (!hasLocation) {
    return (
      <div ref={placeholderRef} className={`bg-gray-100 rounded-lg flex items-center justify-center ${styles.placeholderHeight}`}>
        <p className="text-gray-500">Aucune coordonnée GPS disponible</p>
      </div>
    );
  }

  const position: LatLngExpression = [
    batch.origin_gps_latitude!,
    batch.origin_gps_longitude!,
  ];

  return (
    <div ref={mapRef} className={`rounded-lg overflow-hidden border border-gray-200 ${styles.mapOuter}`}>
      <MapContainer
        center={position}
        zoom={13}
        className={styles.mapFullSize}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <strong>Origine du lot</strong>
              <br />
              {batch.batch_number || `Lot #${batch.id.slice(0, 8)}`}
              <br />
              <small>
                {batch.origin_gps_latitude?.toFixed(6)}, {batch.origin_gps_longitude?.toFixed(6)}
              </small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

