import { useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { useTrafficStore, CITIES } from './store/trafficStore';
import { generateSegments, generateIncident } from './utils/simulation';
import { format } from 'date-fns';
import Map from './components/Map';
import KPICards from './components/KPICards';
import IncidentPanel from './components/IncidentPanel';
import TrendChart from './components/TrendChart';
import IncidentList from './components/IncidentList';

function App() {
  const {
    currentCity,
    segments,
    incidents,
    isRunning,
    setCity,
    updateSegments,
    addIncident,
    removeIncident,
    toggleSimulation,
    reset,
    addHistoricalData,
    setSegments
  } = useTrafficStore();

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const incidentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const historicalIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize segments on mount
  useEffect(() => {
    if (segments.length === 0) {
      const initialSegments = generateSegments(currentCity);
      setSegments(initialSegments);
    }
  }, []);

  // Simulation update loop (every 5 seconds)
  useEffect(() => {
    if (isRunning) {
      updateIntervalRef.current = setInterval(() => {
        updateSegments();
      }, 5000);
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isRunning, updateSegments]);

  // Incident generation loop (every 20-40 seconds)
  useEffect(() => {
    if (isRunning && segments.length > 0) {
      console.log('🚀 Olay üretme sistemi başlatıldı');
      
      // İlk olayı hemen oluştur (5 saniye sonra)
      const firstIncidentTimeout = setTimeout(() => {
        const newIncident = generateIncident(currentCity, segments);
        console.log('🚨 Yeni olay oluşturuldu:', {
          id: newIncident.id,
          type: newIncident.type,
          severity: newIncident.severity,
          description: newIncident.description,
          duration: newIncident.estimatedClearMinutes + ' dakika'
        });
        addIncident(newIncident);
        
        // Olay temizleme zamanlayıcısı
        setTimeout(() => {
          console.log('✅ Olay temizlendi:', newIncident.id);
          removeIncident(newIncident.id);
        }, newIncident.estimatedClearMinutes * 60000);
      }, 5000);
      
      // Sonraki olaylar için interval
      incidentIntervalRef.current = setInterval(() => {
        const randomDelay = 20000 + Math.random() * 20000; // 20-40 saniye
        
        setTimeout(() => {
          if (!useTrafficStore.getState().isRunning) return;
          
          const currentSegments = useTrafficStore.getState().segments;
          if (currentSegments.length === 0) return;
          
          const newIncident = generateIncident(currentCity, currentSegments);
          console.log('🚨 Yeni olay oluşturuldu:', {
            id: newIncident.id,
            type: newIncident.type,
            severity: newIncident.severity,
            description: newIncident.description,
            duration: newIncident.estimatedClearMinutes + ' dakika'
          });
          addIncident(newIncident);
          
          // Olay temizleme zamanlayıcısı
          setTimeout(() => {
            console.log('✅ Olay temizlendi:', newIncident.id);
            removeIncident(newIncident.id);
          }, newIncident.estimatedClearMinutes * 60000);
        }, randomDelay);
      }, 30000); // Her 30 saniyede bir yeni olay planlama döngüsü
      
      return () => {
        console.log('🛑 Olay üretme sistemi durduruldu');
        clearTimeout(firstIncidentTimeout);
        if (incidentIntervalRef.current) {
          clearInterval(incidentIntervalRef.current);
        }
      };
    }
  }, [isRunning, segments.length, currentCity, addIncident, removeIncident]);

  // Historical data collection (every 60 seconds)
  useEffect(() => {
    if (isRunning && segments.length > 0) {
      historicalIntervalRef.current = setInterval(() => {
        const avgIntensity = Math.floor(
          segments.reduce((sum, seg) => sum + seg.currentIntensity, 0) / segments.length
        );
        
        addHistoricalData({
          time: format(new Date(), 'HH:mm'),
          avgIntensity
        });
      }, 60000);

      // Add initial data point immediately
      const avgIntensity = Math.floor(
        segments.reduce((sum, seg) => sum + seg.currentIntensity, 0) / segments.length
      );
      addHistoricalData({
        time: format(new Date(), 'HH:mm'),
        avgIntensity
      });
    } else {
      if (historicalIntervalRef.current) {
        clearInterval(historicalIntervalRef.current);
      }
    }

    return () => {
      if (historicalIntervalRef.current) {
        clearInterval(historicalIntervalRef.current);
      }
    };
  }, [isRunning, segments, addHistoricalData]);

  // Auto-remove expired incidents
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      incidents.forEach(incident => {
        const elapsed = now - incident.startedAt;
        if (elapsed >= incident.estimatedClearMinutes * 60000) {
          removeIncident(incident.id);
        }
      });
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [incidents, removeIncident]);

  const handleCityChange = (cityKey: string) => {
    setCity(cityKey);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">🚦 SmartCity AUS</h1>
              <p className="text-slate-400 text-sm">Trafik Simülasyonu ve Olay Yönetim Sistemi</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* City Selector */}
              <select
                value={currentCity.key}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              >
                {CITIES.map(city => (
                  <option key={city.key} value={city.key}>
                    {city.name}
                  </option>
                ))}
              </select>

              {/* Start/Stop Button */}
              <button
                onClick={toggleSimulation}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <PauseCircle size={18} />
                    Durdur
                  </>
                ) : (
                  <>
                    <PlayCircle size={18} />
                    Başlat
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                disabled={isRunning}
              >
                <RotateCcw size={18} />
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Map */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="h-[600px]">
              <Map />
            </div>

            {/* Bottom Row: Trend Chart and Incident List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendChart />
              <IncidentList />
            </div>
          </div>

          {/* Right Column: KPIs and Incident Panel */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <KPICards />
            <IncidentPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 px-6 mt-8">
        <div className="max-w-[1920px] mx-auto text-center text-slate-400 text-sm">
          <p>© 2024 SmartCity AUS - Türkiye Trafik Simülasyonu Sistemi</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

