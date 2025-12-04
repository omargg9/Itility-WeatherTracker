import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useCurrentWeather } from "@/hooks/useWeather";
import WeatherMap from "@/components/map/WeatherMap";
import LayerControl from "@/components/map/LayerControl";

export default function MapPage() {
  const { t } = useTranslation();
  const { latitude: geoLat, longitude: geoLon } = useGeolocation();
  const { favorites } = useFavorites();

  const [center, setCenter] = useState<[number, number]>(() => {
    // Use geolocation if available, otherwise default to NYC
    if (geoLat !== null && geoLon !== null) {
      return [geoLat, geoLon];
    }
    return [40.7128, -74.006];
  });
  const [zoom] = useState(10);
  const [activeLayer, setActiveLayer] = useState<
    "temp" | "precipitation" | "clouds" | "wind" | null
  >("temp");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Update center when geolocation changes
  useEffect(() => {
    if (geoLat !== null && geoLon !== null) {
      setCenter([geoLat, geoLon]); // eslint-disable-line react-hooks/set-state-in-effect -- intentional sync update for map center
    }
  }, [geoLat, geoLon]);

  const { data: selectedWeather } = useCurrentWeather(
    selectedLocation?.lat ?? null,
    selectedLocation?.lon ?? null
  );

  const markers = [
    ...(geoLat !== null && geoLon !== null
      ? [
          {
            position: [geoLat, geoLon] as [number, number],
            label: t("map.currentLocation", "Current Location"),
            isCurrent: true,
          },
        ]
      : []),
    ...favorites.map((fav) => ({
      position: [fav.lat, fav.lon] as [number, number],
      label: fav.name,
      temp: undefined,
    })),
  ];

  const handleLocationSelect = (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setCenter([lat, lon]);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute left-0 top-0 bottom-0 w-80 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl"
          >
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("map.title", "Weather Map")}
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
                  aria-label="Close sidebar"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <LayerControl
                  activeLayer={activeLayer}
                  onLayerChange={setActiveLayer}
                />
              </div>

              {selectedWeather && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-auto p-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg text-white"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedWeather.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold">
                      {Math.round(selectedWeather.main.temp)}°C
                    </div>
                    <div className="flex-1">
                      <p className="capitalize">
                        {selectedWeather.weather[0].description}
                      </p>
                      <p className="text-sm opacity-80">
                        Feels like {Math.round(selectedWeather.main.feels_like)}
                        °C
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">
                  {t("map.help.title", "How to use:")}
                </p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • {t("map.help.click", "Click map to select location")}
                  </li>
                  <li>• {t("map.help.layer", "Toggle layers to view data")}</li>
                  <li>
                    • {t("map.help.zoom", "Zoom in/out with mouse wheel")}
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSidebarOpen(true)}
          className="absolute left-4 top-4 z-20 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>
      )}

      <div
        className={`absolute inset-0 transition-all duration-300 ${
          sidebarOpen ? "lg:left-80" : "left-0"
        }`}
      >
        <WeatherMap
          center={center}
          zoom={zoom}
          onLocationSelect={handleLocationSelect}
          markers={markers}
          weatherLayer={activeLayer}
        />
      </div>
    </div>
  );
}
