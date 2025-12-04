import { useFavorites } from "../hooks/useFavorites";
import { useCurrentWeather } from "../hooks/useWeather";
import { useNavigate } from "react-router-dom";
import MiniWeatherWidget from "../components/widgets/MiniWeatherWidget";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

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

  const handleWidgetClick = (locationId: string) => {
    navigate(`/?city=${encodeURIComponent(locationId)}`);
  };

  console.log("WidgetsPage rendering", { favorites, theme });

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
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            {t("favorites.title")}
          </h1>
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
        ) : (
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              width: "100%",
            }}
            layout
          >
            {favorites.map((favorite, index) => (
              <WidgetWithData
                key={favorite.id}
                locationId={favorite.name}
                lat={favorite.lat}
                lon={favorite.lon}
                index={index}
                onClick={handleWidgetClick}
              />
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
