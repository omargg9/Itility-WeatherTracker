import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function HomePage() {
  const {
    latitude: geoLat,
    longitude: geoLon,
    error: geoError,
    loading: geoLoading,
    permissionDenied,
    retry: retryGeolocation,
  } = useGeolocation();

  const { savedLocation, saveLocation } = useLocationPersistence();

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name?: string;
  } | null>(null);

  const reducedMotion = useReducedMotion();

  // On mount, restore saved location if available
  useEffect(() => {
    if (savedLocation && !selectedLocation) {
      setSelectedLocation({
        lat: savedLocation.lat,
        lon: savedLocation.lon,
        name: savedLocation.name,
      });
    }
  }, [savedLocation, selectedLocation]);

  // Use selected location if available, otherwise use geolocation
  const latitude = selectedLocation?.lat ?? geoLat;
  const longitude = selectedLocation?.lon ?? geoLon;
  const locationName = selectedLocation?.name;

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
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-center"
          {...(!reducedMotion && {
            ...fadeIn,
            initial: "initial",
            animate: "animate",
          })}
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Detecting your location...</p>
          <p className="text-white/60 text-sm mt-2">
            This may take a few seconds
          </p>
        </LoadingComponent>
      </div>
    );
  }

  if (geoError && !selectedLocation) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-300 mx-auto mb-4"
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
          <p className="text-red-300 text-lg mb-2 font-semibold">
            Location Access Required
          </p>
          <p className="text-white/80 mb-4">{geoError}</p>
          {!permissionDenied && (
            <button
              onClick={retryGeolocation}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl text-white font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl max-w-md">
          <p className="text-white text-center mb-4">
            Search for a city instead:
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
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-center"
          {...(!reducedMotion && {
            ...fadeIn,
            initial: "initial",
            animate: "animate",
          })}
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading weather data...</p>
        </LoadingComponent>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl text-center">
          <svg
            className="w-16 h-16 text-red-300 mx-auto mb-4"
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
          <p className="text-red-300 text-lg mb-2 font-semibold">
            Weather Error
          </p>
          <p className="text-white/80 mb-4">
            Failed to load weather data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl text-white font-medium transition-colors"
          >
            Retry
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
