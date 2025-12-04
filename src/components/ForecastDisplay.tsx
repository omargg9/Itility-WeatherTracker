import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeIn } from "@/utils/animations";
import { useForecast } from "../hooks/useWeather";
import { processForecastData } from "../utils/forecastUtils";
import ForecastDayCard from "./ForecastDayCard";

interface ForecastDisplayProps {
  lat: number;
  lon: number;
}

export default function ForecastDisplay({ lat, lon }: ForecastDisplayProps) {
  const { data, isLoading, error } = useForecast(lat, lon);
  const reducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">5-Day Forecast</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[120px] shrink-0 snap-start animate-pulse"
            >
              <div className="h-6 bg-white/20 rounded mb-2"></div>
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-6 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">5-Day Forecast</h2>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
          <p className="text-red-300 text-lg mb-2">Failed to load forecast</p>
          <p className="text-white/80">Please try again later</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const dailySummaries = processForecastData(data.list);
  const ContainerComponent = reducedMotion ? "div" : motion.div;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">5-Day Forecast</h2>
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
