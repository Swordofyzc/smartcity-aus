import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { useTrafficStore } from '../store/trafficStore';
import { getIntensityColor, getIncidentIcon, getIncidentColor } from '../utils/simulation';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view updates
function MapUpdater() {
  const map = useMap();
  const currentCity = useTrafficStore(state => state.currentCity);
  const prevCityRef = useRef(currentCity);

  useEffect(() => {
    if (prevCityRef.current.key !== currentCity.key) {
      map.flyTo([currentCity.lat, currentCity.lng], currentCity.zoom, {
        duration: 1.5
      });
      prevCityRef.current = currentCity;
    }
  }, [currentCity, map]);

  return null;
}

// Create custom incident icon
function createIncidentIcon(type: string, color: string): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${type}
      </div>
    `,
    className: 'custom-incident-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

export default function Map() {
  const currentCity = useTrafficStore(state => state.currentCity);
  const segments = useTrafficStore(state => state.segments);
  const incidents = useTrafficStore(state => state.incidents);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-2xl">
      <MapContainer
        center={[currentCity.lat, currentCity.lng]}
        zoom={currentCity.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater />
        
        {/* Render road segments */}
        {segments.map(segment => {
          const color = getIntensityColor(segment.currentIntensity);
          
          return (
            <Polyline
              key={segment.id}
              positions={segment.coordinates}
              pathOptions={{
                color: color,
                weight: 6,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => {
                  console.log('Tıklanan yol:', segment.name, 'Yoğunluk:', Math.floor(segment.currentIntensity));
                }
              }}
            >
              <Tooltip direction="top" opacity={0.9} permanent={false}>
                <div className="text-xs">
                  <div className="font-bold mb-1">{segment.name}</div>
                  <div>Yoğunluk: <span className="font-bold" style={{ color }}>{Math.floor(segment.currentIntensity)}</span>/100</div>
                  <div className="text-slate-300">Uzunluk: {segment.length}m</div>
                  <div className="text-slate-300">Baz Akış: {Math.floor(segment.baseFlow)}</div>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}
        
        {/* Render incidents */}
        {incidents.map(incident => {
          const icon = createIncidentIcon(
            getIncidentIcon(incident.type),
            getIncidentColor(incident.type)
          );
          
          const elapsedMinutes = Math.floor((Date.now() - incident.startedAt) / 60000);
          const remainingMinutes = Math.max(0, incident.estimatedClearMinutes - elapsedMinutes);
          
          return (
            <Marker
              key={incident.id}
              position={[incident.location.lat, incident.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="font-bold text-base mb-2">{incident.description}</div>
                  <div className="space-y-1">
                    <div>
                      <span className="font-semibold">Tip:</span>{' '}
                      {incident.type === 'ACCIDENT' ? 'Kaza' :
                       incident.type === 'ROADWORK' ? 'Yol Çalışması' : 'Arıza'}
                    </div>
                    <div>
                      <span className="font-semibold">Şiddet:</span>{' '}
                      <span className="text-red-600 font-bold">{incident.severity}/5</span>
                    </div>
                    <div>
                      <span className="font-semibold">Etki Yarıçapı:</span> {incident.affectedRadius}m
                    </div>
                    <div>
                      <span className="font-semibold">Kalan Süre:</span>{' '}
                      <span className="text-orange-600 font-bold">{remainingMinutes} dakika</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

