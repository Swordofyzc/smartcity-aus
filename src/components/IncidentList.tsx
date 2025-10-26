import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useTrafficStore } from '../store/trafficStore';
import { getIncidentIcon } from '../utils/simulation';

export default function IncidentList() {
  const incidents = useTrafficStore(state => state.incidents);
  const [filterHighSeverity, setFilterHighSeverity] = useState(false);

  const filteredIncidents = filterHighSeverity
    ? incidents.filter(i => i.severity >= 4)
    : incidents;

  const getIncidentTypeName = (type: string) => {
    switch (type) {
      case 'ACCIDENT': return 'Kaza';
      case 'ROADWORK': return 'Yol Çalışması';
      case 'BREAKDOWN': return 'Arıza';
      default: return type;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'text-red-500';
    if (severity >= 3) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Olay Listesi</h3>
        <button
          onClick={() => setFilterHighSeverity(!filterHighSeverity)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            filterHighSeverity
              ? 'bg-red-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Filter size={14} />
          {filterHighSeverity ? 'Tüm Olaylar' : 'Yüksek Şiddet'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-2 text-slate-400 font-medium">Tip</th>
              <th className="text-left py-2 px-2 text-slate-400 font-medium">Lokasyon</th>
              <th className="text-center py-2 px-2 text-slate-400 font-medium">Şiddet</th>
              <th className="text-center py-2 px-2 text-slate-400 font-medium">Süre (dk)</th>
              <th className="text-center py-2 px-2 text-slate-400 font-medium">Kalan</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  {filterHighSeverity
                    ? 'Yüksek şiddetli olay bulunmuyor'
                    : 'Aktif olay bulunmuyor'}
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident, index) => {
                const elapsedMinutes = Math.floor((Date.now() - incident.startedAt) / 60000);
                const remainingMinutes = Math.max(0, incident.estimatedClearMinutes - elapsedMinutes);
                
                return (
                  <motion.tr
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getIncidentIcon(incident.type)}</span>
                        <span className="text-slate-300 text-xs">
                          {getIncidentTypeName(incident.type)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 text-xs max-w-[200px] truncate">
                      {incident.description}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-bold ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}/5
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-400 text-xs">
                      {incident.estimatedClearMinutes}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
                        {remainingMinutes}dk
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

