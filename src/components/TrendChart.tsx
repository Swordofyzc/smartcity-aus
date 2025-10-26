import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrafficStore } from '../store/trafficStore';
import { getIntensityColor } from '../utils/simulation';

export default function TrendChart() {
  const historicalData = useTrafficStore(state => state.historicalData);

  // Custom dot component with color based on intensity
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = getIntensityColor(payload.avgIntensity);
    
    return (
      <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getIntensityColor(data.avgIntensity);
      
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-xs mb-1">{data.time}</p>
          <p className="font-bold" style={{ color }}>
            Yoğunluk: {data.avgIntensity}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-lg border border-slate-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Trafik Trend Grafiği</h3>
      
      {historicalData.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-slate-400 text-sm">
          Veri toplanıyor...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="30%" stopColor="#f97316" stopOpacity={1} />
                <stop offset="60%" stopColor="#eab308" stopOpacity={1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avgIntensity"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

