import type { CurrentWeatherResponse } from '../types/weather';

interface DetailedMetricsProps {
  weather: CurrentWeatherResponse;
}

export default function DetailedMetrics({ weather }: DetailedMetricsProps) {
  const { main, wind, sys, visibility } = weather;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const visibilityKm = (visibility / 1000).toFixed(1);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Detailed Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-sm text-white/60">Sunrise</p>
          </div>
          <p className="text-xl font-semibold text-white">{formatTime(sys.sunrise)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <p className="text-sm text-white/60">Sunset</p>
          </div>
          <p className="text-xl font-semibold text-white">{formatTime(sys.sunset)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-white/60">Visibility</p>
          </div>
          <p className="text-xl font-semibold text-white">{visibilityKm} km</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <p className="text-sm text-white/60">Wind Dir</p>
          </div>
          <p className="text-xl font-semibold text-white">
            {getWindDirection(wind.deg)} ({wind.deg}°)
          </p>
        </div>

        {wind.gust && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <p className="text-sm text-white/60">Wind Gust</p>
            </div>
            <p className="text-xl font-semibold text-white">{Math.round(wind.gust)} m/s</p>
          </div>
        )}

        {main.sea_level && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-white/60 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm text-white/60">Sea Level</p>
            </div>
            <p className="text-xl font-semibold text-white">{main.sea_level} hPa</p>
          </div>
        )}
      </div>
    </section>
  );
}
