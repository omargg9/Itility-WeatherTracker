import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cardHover, staggerItem } from "@/utils/animations";
import WeatherAnimation from "./WeatherAnimation";
import { useTheme } from "../context/ThemeContext";

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
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });

  const cardStyle = {
    background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    padding: "1rem",
    minWidth: "120px",
    flexShrink: 0,
    scrollSnapAlign: "start",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  };

  if (reducedMotion) {
    return (
      <article style={cardStyle}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            textAlign: "center",
            color: theme === "dark" ? "#ffffff" : "#111827",
            marginBottom: "0.5rem",
          }}
        >
          {dayOfWeek}
        </h3>
        <div className="flex justify-center my-2">
          <WeatherAnimation conditionCode={iconCode} size="sm" />
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "capitalize",
            color: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "#374151",
            marginBottom: "0.5rem",
          }}
        >
          {condition}
        </p>
        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: theme === "dark" ? "#ffffff" : "#111827",
            fontSize: "1.125rem",
          }}
        >
          {Math.round(high)}° / {Math.round(low)}°
        </p>
        {precipProbability > 0 && (
          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: theme === "dark" ? "#93c5fd" : "#2563eb",
              marginTop: "0.5rem",
            }}
          >
            {Math.round(precipProbability * 100)}% {t("forecast.rain")}
          </p>
        )}
      </article>
    );
  }

  return (
    <motion.article
      style={cardStyle}
      whileHover={cardHover}
      variants={staggerItem}
      initial="initial"
      animate="animate"
    >
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          textAlign: "center",
          color: theme === "dark" ? "#ffffff" : "#111827",
          marginBottom: "0.5rem",
        }}
      >
        {dayOfWeek}
      </h3>
      <div className="flex justify-center my-2">
        <WeatherAnimation conditionCode={iconCode} size="sm" />
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          fontWeight: 500,
          textTransform: "capitalize",
          color: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "#374151",
          marginBottom: "0.5rem",
        }}
      >
        {condition}
      </p>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: theme === "dark" ? "#ffffff" : "#111827",
          fontSize: "1.125rem",
        }}
      >
        {Math.round(high)}° / {Math.round(low)}°
      </p>
      {precipProbability > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: theme === "dark" ? "#93c5fd" : "#2563eb",
            marginTop: "0.5rem",
          }}
        >
          {Math.round(precipProbability * 100)}% {t("forecast.rain")}
        </p>
      )}
    </motion.article>
  );
}
