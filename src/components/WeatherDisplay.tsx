import type { CurrentWeatherResponse } from "../types/weather";
import { useTranslation } from "react-i18next";
import WeatherAnimation from "./WeatherAnimation";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import { WeatherBackground } from "./WeatherBackground";
import { useWeatherHistory } from "../hooks/useWeatherHistory";
import TemperatureTrendChart from "./history/TemperatureTrendChart";
import PrecipitationChart from "./history/PrecipitationChart";
import AirQualityIndex from "./AirQualityIndex";
import { generateSampleHistory } from "../services/weatherHistoryService";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WeatherDisplayProps {
  weather: CurrentWeatherResponse;
}

/**
 * Displays current weather information with temperature, conditions, and trends
 * @param weather - Current weather data from API
 */
export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const { t } = useTranslation();
  const { main, weather: conditions, wind, name, coord } = weather;
  const { isFavorite, toggleFavorite, canAddMore } = useFavorites();
  const [showHistory, setShowHistory] = useState(false);
  const [showAQI, setShowAQI] = useState(false);
  const queryClient = useQueryClient();

  const { data: historyData, isLoading: isLoadingHistory } = useWeatherHistory(
    coord.lat,
    coord.lon,
    30
  );

  const handleToggleFavorite = () => {
    toggleFavorite(name, coord.lat, coord.lon);
  };

  const handleGenerateSampleData = async () => {
    await generateSampleHistory(coord.lat, coord.lon, name, main.temp);
    // Refresh the history query
    queryClient.invalidateQueries({
      queryKey: ["weatherHistory", coord.lat, coord.lon, 30],
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-8 relative overflow-hidden"
      style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <WeatherBackground condition={conditions[0].main} />

      <div className="absolute top-4 right-4 z-10">
        <FavoriteButton
          isFavorite={isFavorite(coord.lat, coord.lon)}
          onToggle={handleToggleFavorite}
          disabled={!canAddMore && !isFavorite(coord.lat, coord.lon)}
        />
      </div>

      <div className="text-center mb-6 relative z-10">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 capitalize">
          {conditions[0].description}
        </p>
      </div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        <WeatherAnimation conditionCode={conditions[0].icon} size="lg" />
        <div className="text-7xl font-bold text-gray-900 dark:text-white mt-4">
          {Math.round(main.temp)}°C
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="bg-gray-100 dark:bg-gray-700/50 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("weather.feelsLike")}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.round(main.feels_like)}°C
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700/50 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("weather.humidity")}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {main.humidity}%
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700/50 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("weather.windSpeed")}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.round(wind.speed)} m/s
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700/50 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("weather.pressure")}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {main.pressure} hPa
          </p>
        </div>
      </div>

      {/* Air Quality Index Section */}
      <div className="mt-6 relative z-10">
        <button
          onClick={() => setShowAQI(!showAQI)}
          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
        >
          {showAQI ? "Hide" : "Show"} Air Quality
        </button>

        {showAQI && <AirQualityIndex lat={coord.lat} lon={coord.lon} />}
      </div>

      {/* Historical Weather Section */}
      <div className="mt-6 relative z-10">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
        >
          {showHistory ? "Hide" : "Show"} 30-Day History
        </button>

        {showHistory && (
          <div className="mt-6 space-y-6">
            {isLoadingHistory ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Loading history...
              </div>
            ) : historyData && historyData.length > 0 ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Temperature Trend ({historyData.length} days)
                  </h3>
                  <TemperatureTrendChart data={historyData} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Precipitation History
                  </h3>
                  <PrecipitationChart data={historyData} />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p className="text-lg">No historical data yet.</p>
                <p className="text-sm mt-2">
                  Weather data is automatically saved hourly.
                </p>
                <button
                  onClick={handleGenerateSampleData}
                  className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                >
                  Generate Sample Data (30 days)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
