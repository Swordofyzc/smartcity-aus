import { City, Segment, Incident, IncidentType } from '../types';
import { getRoadsByCity } from '../data/roadNetworks';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // metres
}

// Generate road segments based on real city road networks
export function generateSegments(city: City): Segment[] {
  const roads = getRoadsByCity(city.key);
  const segments: Segment[] = [];
  
  roads.forEach((road, index) => {
    const length = calculateDistance(
      road.start[0], road.start[1],
      road.end[0], road.end[1]
    );
    
    segments.push({
      id: `seg-${city.key}-${index}`,
      name: road.name,
      coordinates: [road.start, road.end],
      baseFlow: road.baseFlow,
      currentIntensity: road.baseFlow * (0.6 + Math.random() * 0.4), // Initial 60-100% of baseFlow
      length: Math.floor(length)
    });
  });
  
  return segments;
}

// Generate random incident
export function generateIncident(segments: Segment[]): Incident {
  const types: IncidentType[] = ['ACCIDENT', 'ROADWORK', 'BREAKDOWN'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Pick a random segment
  const segment = segments[Math.floor(Math.random() * segments.length)];
  
  // Pick a random point along the segment (0 = start, 1 = end, 0.5 = middle)
  const t = Math.random();
  const lat = segment.coordinates[0][0] + (segment.coordinates[1][0] - segment.coordinates[0][0]) * t;
  const lng = segment.coordinates[0][1] + (segment.coordinates[1][1] - segment.coordinates[0][1]) * t;
  
  let severity: number;
  let duration: number;
  let description: string;
  let affectedRadius: number;
  
  switch (type) {
    case 'ACCIDENT':
      severity = 3 + Math.floor(Math.random() * 3); // 3-5
      duration = 15 + Math.floor(Math.random() * 31); // 15-45 min
      affectedRadius = 800 + Math.floor(Math.random() * 701); // 800-1500m
      description = `${segment.name} üzerinde trafik kazası`;
      break;
    case 'ROADWORK':
      severity = 2 + Math.floor(Math.random() * 3); // 2-4
      duration = 60 + Math.floor(Math.random() * 121); // 60-180 min
      affectedRadius = 600 + Math.floor(Math.random() * 601); // 600-1200m
      description = `${segment.name} üzerinde yol çalışması`;
      break;
    case 'BREAKDOWN':
      severity = 1 + Math.floor(Math.random() * 3); // 1-3
      duration = 10 + Math.floor(Math.random() * 21); // 10-30 min
      affectedRadius = 500 + Math.floor(Math.random() * 501); // 500-1000m
      description = `${segment.name} üzerinde araç arızası`;
      break;
  }
  
  return {
    id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    location: {
      lat,
      lng
    },
    affectedRadius,
    startedAt: Date.now(),
    estimatedClearMinutes: duration,
    description
  };
}

// Generate AI response suggestions
export function generateResponseSuggestions(incident: Incident): string[] {
  const suggestions: string[] = [];
  
  switch (incident.type) {
    case 'ACCIDENT':
      if (incident.severity >= 4) {
        suggestions.push(`🚑 ${incident.description.split('üzerinde')[0]} bölgesine ambulans yönlendir`);
        suggestions.push(`🚓 Trafik polisi ve kaza ekipleri konuşlandır`);
        suggestions.push(`📱 Sürücülere acil bildirim gönder: Alternatif rota kullanın`);
      } else {
        suggestions.push(`🚗 Çekici hizmeti yönlendir`);
        suggestions.push(`🚓 Trafik polisi desteği sağla`);
        suggestions.push(`📍 GPS navigasyonlarını güncelle`);
      }
      break;
      
    case 'ROADWORK':
      if (incident.severity >= 3) {
        suggestions.push(`🚧 Şerit kapatma için işaretleme ekipleri gönder`);
        suggestions.push(`🔀 Alternatif rota planlaması oluştur`);
        suggestions.push(`📢 Trafik bilgi levhalarını aktif et`);
      } else {
        suggestions.push(`⚠️ Uyarı levhaları yerleştir`);
        suggestions.push(`🚦 Trafik akışını yönlendir`);
      }
      break;
      
    case 'BREAKDOWN':
      suggestions.push(`🔧 En yakın çekici hizmetini bilgilendir`);
      suggestions.push(`⚡ Acil şerit kullanımını sağla`);
      if (incident.severity >= 2) {
        suggestions.push(`🚓 Emniyet ekibi desteği al`);
      }
      break;
  }
  
  return suggestions;
}

// Calculate 15-minute forecast
export function calculateForecast(
  segments: Segment[], 
  historicalData: { time: string; avgIntensity: number }[]
): { score: number; trend: 'up' | 'down' | 'stable' } {
  const currentAvg = segments.reduce((sum, seg) => sum + seg.currentIntensity, 0) / segments.length;
  
  // Use exponential weighted average if we have historical data
  let forecastScore = currentAvg;
  
  if (historicalData.length >= 3) {
    const weights = [0.15, 0.25, 0.30, 0.30]; // Last measurement gets highest weight
    const recentData = historicalData.slice(-4);
    
    forecastScore = recentData.reduce((sum, point, idx) => {
      const weight = weights[idx] || weights[weights.length - 1];
      return sum + point.avgIntensity * weight;
    }, 0);
  }
  
  // Check if 15 minutes from now will be rush hour
  const futureTime = new Date(Date.now() + 15 * 60 * 1000);
  const futureHour = futureTime.getHours();
  const willBeRushHour = (futureHour >= 8 && futureHour <= 10) || (futureHour >= 17 && futureHour <= 19);
  
  if (willBeRushHour) {
    forecastScore *= 1.2;
  }
  
  // Determine trend
  let trend: 'up' | 'down' | 'stable' = 'stable';
  const diff = forecastScore - currentAvg;
  
  if (diff > 3) {
    trend = 'up';
  } else if (diff < -3) {
    trend = 'down';
  }
  
  return {
    score: Math.floor(Math.min(forecastScore, 100)),
    trend
  };
}

// Get color based on intensity
export function getIntensityColor(intensity: number): string {
  if (intensity < 30) return '#22c55e'; // green
  if (intensity < 60) return '#eab308'; // yellow
  if (intensity < 80) return '#f97316'; // orange
  return '#ef4444'; // red
}

// Get incident icon
export function getIncidentIcon(type: IncidentType): string {
  switch (type) {
    case 'ACCIDENT': return '🚗';
    case 'ROADWORK': return '🚧';
    case 'BREAKDOWN': return '⚠️';
  }
}

// Get incident color
export function getIncidentColor(type: IncidentType): string {
  switch (type) {
    case 'ACCIDENT': return '#ef4444'; // red
    case 'ROADWORK': return '#f97316'; // orange
    case 'BREAKDOWN': return '#eab308'; // yellow
  }
}

