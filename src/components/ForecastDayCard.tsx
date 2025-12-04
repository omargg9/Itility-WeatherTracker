import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cardHover, staggerItem } from "@/utils/animations";
import WeatherAnimation from "./WeatherAnimation";

interface ForecastDayCardProps {
  date: string;
  high: number;
  low: number;
  condition: string;
  iconCode: string;
  precipProbability: number;
}

export default function ForecastDayCard({
  date,
  high,
  low,
  condition,
  iconCode,
  precipProbability,
}: ForecastDayCardProps) {
  const reducedMotion = useReducedMotion();
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });

  const cardClasses =
    "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[120px] shrink-0 snap-start cursor-pointer";

  if (reducedMotion) {
    return (
      <article className={cardClasses}>
        <h3 className="text-lg font-semibold text-center text-white mb-2">
          {dayOfWeek}
        </h3>
        <div className="flex justify-center my-2">
          <WeatherAnimation conditionCode={iconCode} size="sm" />
        </div>
        <p className="text-center text-sm font-medium capitalize text-white/90 mb-2">
          {condition}
        </p>
        <p className="text-center font-bold text-white text-lg">
          {Math.round(high)}° / {Math.round(low)}°
        </p>
        {precipProbability > 0 && (
          <p className="text-center text-xs text-blue-200 mt-2">
            {Math.round(precipProbability * 100)}% rain
          </p>
        )}
      </article>
    );
  }

  return (
    <motion.article
      className={cardClasses}
      whileHover={cardHover}
      variants={staggerItem}
      initial="initial"
      animate="animate"
    >
      <h3 className="text-lg font-semibold text-center text-white mb-2">
        {dayOfWeek}
      </h3>
      <div className="flex justify-center my-2">
        <WeatherAnimation conditionCode={iconCode} size="sm" />
      </div>
      <p className="text-center text-sm font-medium capitalize text-white/90 mb-2">
        {condition}
      </p>
      <p className="text-center font-bold text-white text-lg">
        {Math.round(high)}° / {Math.round(low)}°
      </p>
      {precipProbability > 0 && (
        <p className="text-center text-xs text-blue-200 mt-2">
          {Math.round(precipProbability * 100)}% rain
        </p>
      )}
    </motion.article>
  );
}
