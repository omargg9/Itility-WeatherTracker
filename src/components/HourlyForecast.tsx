import { motion } from "framer-motion";
import { useForecast } from "../hooks/useWeather";
import WeatherAnimation from "./WeatherAnimation";

interface HourlyForecastProps {
  lat: number;
  lon: number;
}

export default function HourlyForecast({ lat, lon }: HourlyForecastProps) {
  const { data, isLoading, error } = useForecast(lat, lon);

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">24-Hour Forecast</h2>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 min-w-[90px] shrink-0 snap-start animate-pulse"
            >
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
              <div className="h-5 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return null;
  }

  // Get next 24 hours (8 entries at 3-hour intervals)
  const hourlyData = data.list.slice(0, 8);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">24-Hour Forecast</h2>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
        {hourlyData.map((item, index) => {
          const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          });

          return (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 min-w-[90px] shrink-0 snap-start"
            >
              <p className="text-sm text-white/80 text-center mb-2">{time}</p>
              <div className="flex justify-center mb-2">
                <WeatherAnimation
                  conditionCode={item.weather[0].icon}
                  size="sm"
                />
              </div>
              <p className="text-lg font-bold text-white text-center">
                {Math.round(item.main.temp)}°
              </p>
              {item.pop > 0 && (
                <p className="text-xs text-blue-200 text-center mt-1">
                  {Math.round(item.pop * 100)}%
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
