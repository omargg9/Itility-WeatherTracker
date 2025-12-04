import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeIn } from "@/utils/animations";
import { useForecast } from "../hooks/useWeather";
import { processForecastData } from "../utils/forecastUtils";
import ForecastDayCard from "./ForecastDayCard";
import { useTheme } from "../context/ThemeContext";

interface ForecastDisplayProps {
  lat: number;
  lon: number;
}

export default function ForecastDisplay({ lat, lon }: ForecastDisplayProps) {
  const { data, isLoading, error } = useForecast(lat, lon);
  const reducedMotion = useReducedMotion();
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
          5-Day Forecast
        </h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-xl p-4 min-w-[120px] shrink-0 snap-start animate-pulse"
            >
              <div className="h-6 bg-gray-300 dark:bg-white/20 rounded mb-2"></div>
              <div className="w-20 h-20 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-white/20 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
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
          5-Day Forecast
        </h2>
        <div className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-8 text-center">
          <p className="text-red-600 dark:text-red-300 text-lg mb-2">
            Failed to load forecast
          </p>
          <p className="text-gray-700 dark:text-white/80">
            Please try again later
          </p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const dailySummaries = processForecastData(data.list);
  const ContainerComponent = reducedMotion ? "div" : motion.div;

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
        5-Day Forecast
      </h2>
      <ContainerComponent
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible pb-4"
        {...(!reducedMotion && {
          variants: staggerContainer,
          initial: "initial",
          animate: "animate",
        })}
      >
        {dailySummaries.map((day) => (
          <ForecastDayCard key={day.date} {...day} />
        ))}
      </ContainerComponent>
    </section>
  );
}
