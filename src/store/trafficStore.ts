import { create } from 'zustand';
import { Segment, Incident, HistoricalDataPoint, City } from '../types';
import { generateSegments } from '../utils/simulation';

export const CITIES: City[] = [
  { key: 'ankara', name: 'Ankara', lat: 39.9334, lng: 32.8597, zoom: 12 },
  { key: 'istanbul', name: 'İstanbul', lat: 41.0082, lng: 28.9784, zoom: 11 },
  { key: 'izmir', name: 'İzmir', lat: 38.4237, lng: 27.1428, zoom: 12 }
];

interface TrafficStore {
  currentCity: City;
  segments: Segment[];
  incidents: Incident[];
  isRunning: boolean;
  historicalData: HistoricalDataPoint[];
  
  setCity: (cityKey: string) => void;
  updateSegments: () => void;
  addIncident: (incident: Incident) => void;
  removeIncident: (id: string) => void;
  toggleSimulation: () => void;
  reset: () => void;
  addHistoricalData: (dataPoint: HistoricalDataPoint) => void;
  setSegments: (segments: Segment[]) => void;
}

export const useTrafficStore = create<TrafficStore>((set, get) => ({
  currentCity: CITIES[0],
  segments: [],
  incidents: [],
  isRunning: false,
  historicalData: [],
  
  setCity: (cityKey: string) => {
    const city = CITIES.find(c => c.key === cityKey);
    if (city) {
      const newSegments = generateSegments(city);
      set({ 
        currentCity: city,
        segments: newSegments,
        incidents: [],
        historicalData: []
      });
    }
  },
  
  updateSegments: () => {
    const { segments, incidents } = get();
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
    const rushMultiplier = isRushHour ? 1.4 : 1.0;
    const alpha = 0.3;
    
    const updatedSegments = segments.map(segment => {
      // Base traffic flow calculation
      let targetIntensity = segment.baseFlow * rushMultiplier * (0.8 + Math.random() * 0.4);
      
      // Calculate segment center point for distance calculation
      const segmentCenterLat = (segment.coordinates[0][0] + segment.coordinates[1][0]) / 2;
      const segmentCenterLng = (segment.coordinates[0][1] + segment.coordinates[1][1]) / 2;
      
      // Apply incident effects
      incidents.forEach(incident => {
        const distance = getDistance(
          segmentCenterLat, 
          segmentCenterLng, 
          incident.location.lat, 
          incident.location.lng
        );
        
        if (distance <= incident.affectedRadius) {
          const impactMultiplier = 1 - (distance / incident.affectedRadius) * 0.5;
          const incidentImpact = (incident.severity * 10 + Math.random() * 10 + 5) * impactMultiplier;
          targetIntensity += incidentImpact;
        }
      });
      
      // Cap at 100
      targetIntensity = Math.min(targetIntensity, 100);
      
      // Exponential smoothing
      const newIntensity = targetIntensity * alpha + segment.currentIntensity * (1 - alpha);
      
      return {
        ...segment,
        currentIntensity: newIntensity
      };
    });
    
    set({ segments: updatedSegments });
  },
  
  addIncident: (incident: Incident) => {
    set(state => ({
      incidents: [...state.incidents, incident]
    }));
  },
  
  removeIncident: (id: string) => {
    set(state => ({
      incidents: state.incidents.filter(i => i.id !== id)
    }));
  },
  
  toggleSimulation: () => {
    set(state => ({ isRunning: !state.isRunning }));
  },
  
  reset: () => {
    const { currentCity } = get();
    const newSegments = generateSegments(currentCity);
    set({
      segments: newSegments,
      incidents: [],
      historicalData: [],
      isRunning: false
    });
  },
  
  addHistoricalData: (dataPoint: HistoricalDataPoint) => {
    set(state => {
      const newData = [...state.historicalData, dataPoint];
      // Keep only last 30 data points
      return {
        historicalData: newData.slice(-30)
      };
    });
  },
  
  setSegments: (segments: Segment[]) => {
    set({ segments });
  }
}));

// Haversine formula to calculate distance in meters
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

