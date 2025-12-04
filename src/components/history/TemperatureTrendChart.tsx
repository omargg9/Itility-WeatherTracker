import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { WeatherSnapshot } from '../../services/weatherHistoryService';
import { format } from 'date-fns';

interface TemperatureTrendChartProps {
  data: WeatherSnapshot[];
  className?: string;
}

export default function TemperatureTrendChart({
  data,
  className = '',
}: TemperatureTrendChartProps) {
  const { theme } = useTheme();

  // Transform data for Recharts
  const chartData = data.map((snapshot) => ({
    date: format(new Date(snapshot.timestamp), 'MMM d'),
    high: Math.round(snapshot.tempMax),
    low: Math.round(snapshot.tempMin),
    avg: Math.round(snapshot.temp),
  }));

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'rgba(255,255,255,0.7)' : '#6b7280';
  const highColor = '#ef4444'; // Red for high temps
  const lowColor = '#3b82f6'; // Blue for low temps
  const avgColor = isDark ? '#ffffff' : '#111827';

  if (data.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: '3rem',
          textAlign: 'center',
          color: textColor,
          background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
          borderRadius: '1rem',
        }}
      >
        <p style={{ fontSize: '1.125rem' }}>
          No historical data yet. Check back tomorrow!
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Weather snapshots are automatically saved daily.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} style={{ fontSize: '0.875rem' }} />
          <YAxis stroke={textColor} style={{ fontSize: '0.875rem' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '0.5rem',
              color: isDark ? '#ffffff' : '#111827',
            }}
            labelStyle={{ color: isDark ? '#ffffff' : '#111827' }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Line
            type="monotone"
            dataKey="high"
            stroke={highColor}
            strokeWidth={2}
            name="High"
            dot={{ fill: highColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke={avgColor}
            strokeWidth={2}
            name="Average"
            dot={{ fill: avgColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke={lowColor}
            strokeWidth={2}
            name="Low"
            dot={{ fill: lowColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
