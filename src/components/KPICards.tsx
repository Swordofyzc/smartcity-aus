import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Clock } from 'lucide-react';
import { useTrafficStore } from '../store/trafficStore';
import { getIntensityColor } from '../utils/simulation';

export default function KPICards() {
  const segments = useTrafficStore(state => state.segments);
  const incidents = useTrafficStore(state => state.incidents);

  // Calculate average traffic score
  const avgTraffic = segments.length > 0
    ? Math.floor(segments.reduce((sum, seg) => sum + seg.currentIntensity, 0) / segments.length)
    : 0;

  // Calculate total estimated delay
  const totalDelay = incidents.reduce((sum, incident) => sum + incident.severity * 3, 0);

  const trafficColor = getIntensityColor(avgTraffic);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Average Traffic Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Ortalama Trafik Skoru</p>
            <p className="text-3xl font-bold" style={{ color: trafficColor }}>
              {avgTraffic}
            </p>
            <p className="text-slate-500 text-xs mt-1">/ 100</p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${trafficColor}20` }}
          >
            <Activity size={28} style={{ color: trafficColor }} />
          </div>
        </div>
      </motion.div>

      {/* Active Incidents */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Aktif Olay Sayısı</p>
            <p className="text-3xl font-bold text-orange-500">{incidents.length}</p>
            <p className="text-slate-500 text-xs mt-1">devam ediyor</p>
          </div>
          <div className="p-3 rounded-full bg-orange-500/20">
            <AlertTriangle size={28} className="text-orange-500" />
          </div>
        </div>
      </motion.div>

      {/* Total Estimated Delay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Tahmini Toplam Gecikme</p>
            <p className="text-3xl font-bold text-red-500">{totalDelay}</p>
            <p className="text-slate-500 text-xs mt-1">dakika</p>
          </div>
          <div className="p-3 rounded-full bg-red-500/20">
            <Clock size={28} className="text-red-500" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

