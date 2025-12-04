import {
  BarChart,
  Bar,
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

interface PrecipitationChartProps {
  data: WeatherSnapshot[];
  className?: string;
}

export default function PrecipitationChart({
  data,
  className = '',
}: PrecipitationChartProps) {
  const { theme } = useTheme();

  // Transform data for Recharts
  const chartData = data.map((snapshot) => ({
    date: format(new Date(snapshot.timestamp), 'MMM d'),
    precipitation: snapshot.precipitation,
    condition: snapshot.weatherCondition,
  }));

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'rgba(255,255,255,0.7)' : '#6b7280';
  const barColor = '#3b82f6'; // Blue for precipitation

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
          No precipitation data yet. Check back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} style={{ fontSize: '0.875rem' }} />
          <YAxis stroke={textColor} style={{ fontSize: '0.875rem' }} label={{ value: 'mm', angle: -90, position: 'insideLeft', fill: textColor }} />
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
          <Bar
            dataKey="precipitation"
            fill={barColor}
            name="Precipitation (mm)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
