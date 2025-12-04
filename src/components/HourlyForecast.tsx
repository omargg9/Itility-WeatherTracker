import { motion } from "framer-motion";
import { useForecast } from "../hooks/useWeather";
import WeatherAnimation from "./WeatherAnimation";
import { useTheme } from "../context/ThemeContext";

interface HourlyForecastProps {
  lat: number;
  lon: number;
}

export default function HourlyForecast({ lat, lon }: HourlyForecastProps) {
  const { data, isLoading, error } = useForecast(lat, lon);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: theme === "dark" ? "#ffffff" : "#111827",
          }}
        >
          24-Hour Forecast
        </h2>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-xl p-3 min-w-[90px] shrink-0 snap-start animate-pulse"
            >
              <div className="h-4 bg-gray-300 dark:bg-white/20 rounded mb-2"></div>
              <div className="w-12 h-12 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-2"></div>
              <div className="h-5 bg-gray-300 dark:bg-white/20 rounded"></div>
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
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: theme === "dark" ? "#ffffff" : "#111827",
        }}
      >
        24-Hour Forecast
      </h2>
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
              style={{
                background:
                  theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
                border:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                minWidth: "90px",
                flexShrink: 0,
                scrollSnapAlign: "start",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color:
                    theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "#374151",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                {time}
              </p>
              <div className="flex justify-center mb-2">
                <WeatherAnimation
                  conditionCode={item.weather[0].icon}
                  size="sm"
                />
              </div>
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  textAlign: "center",
                }}
              >
                {Math.round(item.main.temp)}°
              </p>
              {item.pop > 0 && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: theme === "dark" ? "#93c5fd" : "#2563eb",
                    textAlign: "center",
                    marginTop: "0.25rem",
                  }}
                >
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
