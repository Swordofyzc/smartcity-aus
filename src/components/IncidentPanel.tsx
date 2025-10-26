import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';
import { useTrafficStore } from '../store/trafficStore';
import { calculateForecast, generateResponseSuggestions, getIntensityColor } from '../utils/simulation';
import { useState } from 'react';

export default function IncidentPanel() {
  const segments = useTrafficStore(state => state.segments);
  const incidents = useTrafficStore(state => state.incidents);
  const historicalData = useTrafficStore(state => state.historicalData);
  const [appliedIncidents, setAppliedIncidents] = useState<Set<string>>(new Set());

  // Calculate forecast
  const forecast = calculateForecast(segments, historicalData);
  const forecastColor = getIntensityColor(forecast.score);

  const handleApply = (incidentId: string) => {
    setAppliedIncidents(prev => new Set(prev).add(incidentId));
    setTimeout(() => {
      setAppliedIncidents(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Forecast Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-3">15 Dakika Tahmini</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold" style={{ color: forecastColor }}>
                {forecast.score}
              </span>
              <span className="text-slate-400">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {forecast.trend === 'up' && (
                <>
                  <TrendingUp size={20} className="text-red-500" />
                  <span className="text-sm text-red-500 font-medium">Artış bekleniyor</span>
                </>
              )}
              {forecast.trend === 'down' && (
                <>
                  <TrendingDown size={20} className="text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Azalış bekleniyor</span>
                </>
              )}
              {forecast.trend === 'stable' && (
                <>
                  <Minus size={20} className="text-yellow-500" />
                  <span className="text-sm text-yellow-500 font-medium">Stabil</span>
                </>
              )}
            </div>
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: `${forecastColor}20`, color: forecastColor }}
          >
            📊
          </div>
        </div>
      </motion.div>

      {/* Response Suggestions */}
      <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">Müdahale Önerileri</h3>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {incidents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-400 text-sm text-center py-8"
              >
                Şu anda aktif olay bulunmuyor
              </motion.div>
            )}
            
            {incidents.map((incident, index) => {
              const suggestions = generateResponseSuggestions(incident);
              const isApplied = appliedIncidents.has(incident.id);
              
              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm">
                      {incident.type === 'ACCIDENT' ? '🚗 Kaza' :
                       incident.type === 'ROADWORK' ? '🚧 Yol Çalışması' : '⚠️ Arıza'}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Şiddet: {incident.severity}/5
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 mb-3">{incident.description}</p>
                  
                  <ul className="space-y-2 mb-3">
                    {suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleApply(incident.id)}
                    disabled={isApplied}
                    className={`w-full py-2 px-4 rounded text-xs font-medium transition-all ${
                      isApplied
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isApplied ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle size={14} />
                        Uygulandı
                      </span>
                    ) : (
                      'Uygula'
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

