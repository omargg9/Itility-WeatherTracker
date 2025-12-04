import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

// Create custom icon to avoid Leaflet default icon issues with React 19
const customIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface WeatherMapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lon: number) => void;
  markers?: Array<{
    position: [number, number];
    label: string;
    temp?: number;
    isCurrent?: boolean;
  }>;
  weatherLayer?: "temp" | "precipitation" | "clouds" | "wind" | null;
}

/**
 * MapController - Handles map events and updates
 */
function MapController({
  center,
  onLocationSelect,
}: {
  center?: [number, number];
  onLocationSelect?: (lat: number, lon: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

/**
 * WeatherLayerControl - Adds OpenWeatherMap weather layers
 */
function WeatherLayerControl({ layer }: { layer: string | null }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    // Add new layer if specified
    if (layer && import.meta.env.VITE_OPENWEATHER_API_KEY) {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      let layerUrl = "";

      switch (layer) {
        case "temp":
          layerUrl = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;
          break;
        case "precipitation":
          layerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
          break;
        case "clouds":
          layerUrl = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`;
          break;
        case "wind":
          layerUrl = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`;
          break;
      }

      if (layerUrl) {
        layerRef.current = L.tileLayer(layerUrl, {
          attribution: "Weather data © OpenWeatherMap",
          opacity: 0.6,
        }).addTo(map);
      }
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [layer, map]);

  return null;
}

/**
 * WeatherMap - Interactive map with weather overlays
 */
export default function WeatherMap({
  center = [40.7128, -74.006],
  zoom = 10,
  onLocationSelect,
  markers = [],
  weatherLayer = null,
}: WeatherMapProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [mapReady, setMapReady] = useState(false);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        key="weather-map" // Stable key to prevent remounting
        center={center}
        zoom={zoom}
        className="w-full h-full z-0"
        style={{ minHeight: "400px" }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer url={tileUrl} attribution={attribution} />

        {mapReady && (
          <>
            <MapController
              center={center}
              onLocationSelect={onLocationSelect}
            />
            <WeatherLayerControl layer={weatherLayer} />

            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position} icon={customIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{marker.label}</p>
                    {marker.temp !== undefined && (
                      <p className="text-gray-600 dark:text-gray-300">
                        {Math.round(marker.temp)}°C
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {t("map.loading", "Loading map...")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
