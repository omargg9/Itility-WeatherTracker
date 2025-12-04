import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import type { WidgetProps } from "../../types/widget";
import WeatherAnimation from "../WeatherAnimation";

/**
 * MiniWeatherWidget - Compact weather display component
 *
 * Displays essential weather information in a small, clickable card.
 * Supports two size variants and includes loading/error states.
 *
 * @component
 * @example
 * ```tsx
 * <MiniWeatherWidget
 *   locationId="London"
 *   weather={weatherData}
 *   size="compact"
 *   onClick={(id) => navigateToFullView(id)}
 * />
 * ```
 */
export default function MiniWeatherWidget({
  locationId,
  size = "medium",
  weather,
  isLoading = false,
  error = null,
  onClick,
  className = "",
}: WidgetProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick && weather) {
      onClick(locationId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick && weather) {
      e.preventDefault();
      onClick(locationId);
    }
  };

  // Size-specific styles
  const sizeClasses = {
    compact: "w-[120px] h-[120px] p-2",
    medium: "w-[200px] h-[160px] p-4",
  };

  const iconSizes = {
    compact: 40,
    medium: 60,
  };

  const textSizes = {
    compact: {
      location: "text-xs",
      temp: "text-xl",
      condition: "text-[10px]",
    },
    medium: {
      location: "text-sm",
      temp: "text-3xl",
      condition: "text-xs",
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        className={`${
          sizeClasses[size]
        } ${className} relative overflow-hidden rounded-2xl ${
          theme === "dark"
            ? "bg-white/10 border border-white/20"
            : "bg-white/90 border border-gray-300 shadow-lg"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <motion.div
            className={`w-8 h-8 rounded-full ${
              theme === "dark" ? "bg-white/20" : "bg-gray-300"
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p
            className={`mt-2 ${textSizes[size].condition} ${
              theme === "dark" ? "text-white/60" : "text-gray-600"
            }`}
          >
            {t("common.loading")}
          </p>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className={`${
          sizeClasses[size]
        } ${className} relative overflow-hidden rounded-2xl ${
          theme === "dark"
            ? "bg-red-500/10 border border-red-500/30"
            : "bg-red-50 border border-red-300 shadow-lg"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full text-center px-2">
          <span className="text-2xl mb-1">⚠️</span>
          <p
            className={`${textSizes[size].condition} ${
              theme === "dark" ? "text-red-300" : "text-red-700"
            }`}
          >
            {t("errors.loadFailed")}
          </p>
        </div>
      </motion.div>
    );
  }

  // No data state
  if (!weather) {
    return (
      <motion.div
        className={`${
          sizeClasses[size]
        } ${className} relative overflow-hidden rounded-2xl ${
          theme === "dark"
            ? "bg-white/5 border border-white/10"
            : "bg-gray-100 border border-gray-300 shadow-lg"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <p
            className={`${textSizes[size].condition} ${
              theme === "dark" ? "text-white/40" : "text-gray-500"
            }`}
          >
            {t("widget.noData")}
          </p>
        </div>
      </motion.div>
    );
  }

  // Use the weather icon code from the API
  const weatherIconCode = weather.weather[0].icon;

  return (
    <motion.div
      className={`${
        sizeClasses[size]
      } ${className} relative overflow-hidden rounded-2xl cursor-pointer ${
        theme === "dark"
          ? "bg-white/10 border border-white/20 backdrop-blur-md"
          : "bg-white/90 border border-gray-300 shadow-lg backdrop-blur-md"
      } transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${weather.name} weather widget. ${Math.round(
        weather.main.temp
      )}°, ${weather.weather[0].description}`}
    >
      {/* Weather Animation Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <WeatherAnimation conditionCode={weatherIconCode} size="sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Location Name */}
        <div className="truncate">
          <h3
            className={`${textSizes[size].location} font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
            title={weather.name}
          >
            {weather.name}
          </h3>
        </div>

        {/* Temperature & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`${textSizes[size].temp} font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {Math.round(weather.main.temp)}°
            </div>
            {size === "medium" && (
              <div
                className={`${textSizes[size].condition} ${
                  theme === "dark" ? "text-white/80" : "text-gray-700"
                } capitalize truncate`}
              >
                {weather.weather[0].description}
              </div>
            )}
          </div>

          {/* Weather Icon */}
          <div className="shrink-0">
            <WeatherAnimation conditionCode={weatherIconCode} size="sm" />
          </div>
        </div>

        {/* Additional Info (medium size only) */}
        {size === "medium" && (
          <div
            className={`flex justify-between ${textSizes[size].condition} ${
              theme === "dark" ? "text-white/60" : "text-gray-600"
            }`}
          >
            <span>💧 {weather.main.humidity}%</span>
            <span>💨 {Math.round(weather.wind.speed)} m/s</span>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className={`absolute inset-0 ${
          theme === "dark" ? "bg-white/5" : "bg-black/5"
        } opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />
    </motion.div>
  );
}
