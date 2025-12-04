import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGeolocation } from "../hooks/useGeolocation";
import { useCurrentWeather } from "../hooks/useWeather";
import { useLocationPersistence } from "../hooks/useLocationPersistence";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeIn } from "@/utils/animations";
import WeatherDisplay from "../components/WeatherDisplay";
import ForecastDisplay from "../components/ForecastDisplay";
import HourlyForecast from "../components/HourlyForecast";
import CitySearch from "../components/CitySearch";
import FavoritesList from "../components/FavoritesList";
import DetailedMetrics from "../components/DetailedMetrics";
import LocationButton from "../components/LocationButton";

/**
 * Main weather application page showing current weather and forecasts
 * Supports geolocation, city search, and favorites
 */
export default function HomePage() {
  const { t } = useTranslation();
  const {
    latitude: geoLat,
    longitude: geoLon,
    error: geoError,
    loading: geoLoading,
    permissionDenied,
    retry: retryGeolocation,
  } = useGeolocation();

  const { savedLocation, saveLocation } = useLocationPersistence();

  const reducedMotion = useReducedMotion();

  // Initialize selectedLocation from savedLocation if available
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(() => {
    if (savedLocation) {
      return {
        lat: savedLocation.lat,
        lon: savedLocation.lon,
        name: savedLocation.name || '',
      };
    }
    return null;
  });

  // Use selected location if available, otherwise use geolocation
  const latitude = selectedLocation?.lat ?? geoLat;
  const longitude = selectedLocation?.lon ?? geoLon;

  const {
    data: weather,
    isLoading,
    error,
  } = useCurrentWeather(latitude, longitude);

  const handleCitySelect = (lat: number, lon: number, name: string) => {
    const newLocation = { lat, lon, name };
    setSelectedLocation(newLocation);
    saveLocation(lat, lon, name); // Persist to localStorage
  };

  const handleUseMyLocation = () => {
    setSelectedLocation(null); // Clear selected location to use geolocation
    retryGeolocation();
  };

  if (geoLoading) {
    const LoadingComponent = reducedMotion ? "div" : motion.div;
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingComponent
          className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-8 shadow-xl text-center"
          {...(!reducedMotion && {
            ...fadeIn,
            initial: "initial",
            animate: "animate",
          })}
        >
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white text-lg">
            {t("loading.location")}
          </p>
          <p className="text-gray-600 dark:text-white/60 text-sm mt-2">
            {t("loading.wait")}
          </p>
        </LoadingComponent>
      </div>
    );
  }

  if (geoError && !selectedLocation) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-6">
        <div className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-8 shadow-xl text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-600 dark:text-red-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-600 dark:text-red-300 text-lg mb-2 font-semibold">
            {t("errors.locationRequired")}
          </p>
          <p className="text-gray-700 dark:text-white/80 mb-4">{geoError}</p>
          {!permissionDenied && (
            <button
              onClick={retryGeolocation}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/20 dark:hover:bg-white/30 border border-gray-300 dark:border-white/40 rounded-xl text-gray-900 dark:text-white font-medium transition-colors"
            >
              {t("errors.tryAgain")}
            </button>
          )}
        </div>

        <div className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-6 shadow-xl max-w-md">
          <p className="text-gray-900 dark:text-white text-center mb-4">
            {t("errors.searchInstead")}
          </p>
          <CitySearch onCitySelect={handleCitySelect} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    const LoadingComponent = reducedMotion ? "div" : motion.div;
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingComponent
          className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-8 shadow-xl text-center"
          {...(!reducedMotion && {
            ...fadeIn,
            initial: "initial",
            animate: "animate",
          })}
        >
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white text-lg">
            {t("loading.weather")}
          </p>
        </LoadingComponent>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="bg-white border-gray-200 dark:bg-white/10 dark:border-white/20 backdrop-blur-md border rounded-2xl p-8 shadow-xl text-center">
          <svg
            className="w-16 h-16 text-red-600 dark:text-red-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-red-600 dark:text-red-300 text-lg mb-2 font-semibold">
            {t("errors.weatherError")}
          </p>
          <p className="text-gray-700 dark:text-white/80 mb-4">
            {t("errors.failedToLoad")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/20 dark:hover:bg-white/30 border border-gray-300 dark:border-white/40 rounded-xl text-gray-900 dark:text-white font-medium transition-colors"
          >
            {t("errors.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <CitySearch onCitySelect={handleCitySelect} />
        <LocationButton onClick={handleUseMyLocation} loading={geoLoading} />
      </div>

      <FavoritesList onSelectLocation={handleCitySelect} />

      <WeatherDisplay weather={weather} />

      <DetailedMetrics weather={weather} />

      {latitude !== null && longitude !== null && (
        <>
          <HourlyForecast lat={latitude} lon={longitude} />
          <ForecastDisplay lat={latitude} lon={longitude} />
        </>
      )}
    </div>
  );
}
