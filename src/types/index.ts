export interface City {
  key: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface Segment {
  id: string;
  name: string;
  coordinates: [[number, number], [number, number]]; // [start, end]
  baseFlow: number;
  currentIntensity: number;
  length: number; // metre cinsinden
}

export type IncidentType = 'ACCIDENT' | 'ROADWORK' | 'BREAKDOWN';

export interface Incident {
  id: string;
  type: IncidentType;
  severity: number;
  location: {
    lat: number;
    lng: number;
  };
  affectedRadius: number;
  startedAt: number;
  estimatedClearMinutes: number;
  description: string;
}

export interface HistoricalDataPoint {
  time: string;
  avgIntensity: number;
}

export interface ResponseSuggestion {
  incidentId: string;
  incidentType: IncidentType;
  location: string;
  suggestions: string[];
}

