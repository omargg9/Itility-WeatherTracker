import { useFavorites } from "../hooks/useFavorites";
import { useCurrentWeather } from "../hooks/useWeather";
import { useNavigate } from "react-router-dom";
import MiniWeatherWidget from "../components/widgets/MiniWeatherWidget";
import { motion, Reorder } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import type { FavoriteLocation } from "../context/FavoritesContext";

const STORAGE_KEY_VIEW = "weather_widgets_view_mode";
const STORAGE_KEY_ORDER = "weather_widgets_order";

/**
 * WidgetsPage - Display all favorite locations in a widget grid
 *
 * Shows compact weather widgets for all favorited locations,
 * allowing quick monitoring and navigation to full weather views.
 */
export default function WidgetsPage() {
  const { favorites } = useFavorites();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // View mode toggle (grid/list)
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const stored = localStorage.getItem(STORAGE_KEY_VIEW);
    return (stored as "grid" | "list") || "grid";
  });

  // Track custom order changes
  const [orderKey, setOrderKey] = useState(0);

  // Derive ordered favorites from favorites and stored order
  const orderedFavorites = useMemo(() => {
    if (favorites.length === 0) {
      return [];
    }

    const storedOrder = localStorage.getItem(STORAGE_KEY_ORDER);
    if (storedOrder) {
      try {
        const orderIds: string[] = JSON.parse(storedOrder);
        // Sort favorites based on stored order
        return [...favorites].sort((a, b) => {
          const aIndex = orderIds.indexOf(a.id);
          const bIndex = orderIds.indexOf(b.id);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
      } catch {
        return favorites;
      }
    } else {
      return favorites;
    }
  }, [favorites, orderKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VIEW, viewMode);
  }, [viewMode]);

  // Save order to localStorage and update the stored order
  const handleReorder = (newOrder: FavoriteLocation[]) => {
    const orderIds = newOrder.map((f) => f.id);
    localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(orderIds));
    setOrderKey((prev) => prev + 1); // Trigger re-render
  };

  const handleWidgetClick = (locationId: string) => {
    navigate(`/?city=${encodeURIComponent(locationId)}`);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "2rem 1rem",
        minHeight: "500px",
        display: "block",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <motion.div
          style={{ marginBottom: "2rem" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: theme === "dark" ? "#ffffff" : "#111827",
              }}
            >
              {t("favorites.title")}
            </h1>
            {favorites.length > 0 && (
              <button
                onClick={toggleViewMode}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  background:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(59,130,246,0.1)",
                  color: theme === "dark" ? "#ffffff" : "#3b82f6",
                  fontSize: "1.5rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme === "dark"
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(59,130,246,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(59,130,246,0.1)";
                }}
                title={
                  viewMode === "grid"
                    ? "Switch to list view"
                    : "Switch to grid view"
                }
              >
                {viewMode === "grid" ? "☰" : "▦"}
              </button>
            )}
          </div>
          <p
            style={{
              fontSize: "1.125rem",
              color: theme === "dark" ? "rgba(255,255,255,0.7)" : "#4b5563",
            }}
          >
            Quick view of all your favorite locations
          </p>
        </motion.div>

        {/* Widget Grid */}
        {favorites.length === 0 ? (
          <motion.div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              borderRadius: "1rem",
              background:
                theme === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(243,244,246,1)",
              border: `1px solid ${
                theme === "dark" ? "rgba(255,255,255,0.1)" : "#d1d5db"
              }`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: "3.75rem", marginBottom: "1rem" }}>⭐</div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: theme === "dark" ? "#ffffff" : "#111827",
              }}
            >
              No Favorites Yet
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#4b5563",
              }}
            >
              Add locations to your favorites to see them here!
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgb(59,130,246)",
                color: "#ffffff",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  theme === "dark" ? "rgba(255,255,255,0.2)" : "rgb(37,99,235)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgb(59,130,246)";
              }}
            >
              Search Locations
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              width: "100%",
            }}
          >
            <Reorder.Group
              axis="xy"
              values={orderedFavorites}
              onReorder={handleReorder}
              style={{
                display: "contents",
                listStyle: "none",
              }}
            >
              {orderedFavorites.map((favorite, index) => (
                <Reorder.Item
                  key={favorite.id}
                  value={favorite}
                  style={{
                    cursor: "grab",
                    touchAction: "none",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileDrag={{
                    scale: 1.05,
                    zIndex: 1000,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    cursor: "grabbing",
                  }}
                >
                  <WidgetWithData
                    locationId={favorite.name}
                    lat={favorite.lat}
                    lon={favorite.lon}
                    index={index}
                    onClick={handleWidgetClick}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        ) : (
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
            layout
          >
            {orderedFavorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <WidgetWithDataList
                  locationId={favorite.name}
                  lat={favorite.lat}
                  lon={favorite.lon}
                  onClick={handleWidgetClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * WidgetWithData - Wrapper to fetch and display weather data for a widget
 */
function WidgetWithData({
  locationId,
  lat,
  lon,
  index,
  onClick,
}: {
  locationId: string;
  lat: number;
  lon: number;
  index: number;
  onClick: (locationId: string) => void;
}) {
  const { data: weather, isLoading, error } = useCurrentWeather(lat, lon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <MiniWeatherWidget
        locationId={locationId}
        weather={weather}
        isLoading={isLoading}
        error={error}
        size="medium"
        onClick={onClick}
      />
    </motion.div>
  );
}

/**
 * WidgetWithDataList - Wrapper for list view with horizontal layout
 */
function WidgetWithDataList({
  locationId,
  lat,
  lon,
  onClick,
}: {
  locationId: string;
  lat: number;
  lon: number;
  onClick: (locationId: string) => void;
}) {
  const { data: weather, isLoading, error } = useCurrentWeather(lat, lon);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "1rem",
          background:
            theme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.9)",
          border: `1px solid ${
            theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: `4px solid ${
              theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
            }`,
            borderTopColor: theme === "dark" ? "#ffffff" : "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "1rem",
          background:
            theme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.9)",
          border: `1px solid ${
            theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
          }`,
          color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#6b7280",
          textAlign: "center",
        }}
      >
        Error loading weather
      </div>
    );
  }

  return (
    <motion.div
      onClick={() => onClick(locationId)}
      style={{
        padding: "1.5rem",
        borderRadius: "1rem",
        background:
          theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${
          theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
        }`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        transition: "all 0.2s",
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Location Name */}
      <div style={{ flex: "0 0 200px" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: theme === "dark" ? "#ffffff" : "#111827",
            marginBottom: "0.25rem",
          }}
        >
          {locationId}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#6b7280",
          }}
        >
          {weather.weather[0].description}
        </p>
      </div>

      {/* Temperature */}
      <div style={{ flex: "0 0 120px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: theme === "dark" ? "#ffffff" : "#111827",
          }}
        >
          {Math.round(weather.main.temp)}°
        </div>
      </div>

      {/* Weather Stats */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#9ca3af",
              marginBottom: "0.25rem",
            }}
          >
            Feels Like
          </div>
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            {Math.round(weather.main.feels_like)}°
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#9ca3af",
              marginBottom: "0.25rem",
            }}
          >
            Humidity
          </div>
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            {weather.main.humidity}%
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#9ca3af",
              marginBottom: "0.25rem",
            }}
          >
            Wind
          </div>
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            {Math.round(weather.wind.speed)} m/s
          </div>
        </div>
      </div>
    </motion.div>
  );
}
