import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../hooks/useFavorites";
import { useTheme } from "../context/ThemeContext";

interface FavoritesListProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
}

export default function FavoritesList({
  onSelectLocation,
}: FavoritesListProps) {
  const { t } = useTranslation();
  const { favorites, removeFavorite } = useFavorites();
  const { theme } = useTheme();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: theme === "dark" ? "#ffffff" : "#111827",
        }}
      >
        {t("favorites.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -100 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              style={{
                background: theme === "dark" ? "#1f2937" : "#ffffff",
                border:
                  theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "1rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <button
                onClick={() =>
                  onSelectLocation(favorite.lat, favorite.lon, favorite.name)
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "#ffffff" : "#111827",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      theme === "dark" ? "#93c5fd" : "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      theme === "dark" ? "#ffffff" : "#111827";
                  }}
                >
                  {favorite.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color:
                      theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "#4b5563",
                    marginTop: "0.25rem",
                  }}
                >
                  {favorite.lat.toFixed(2)}, {favorite.lon.toFixed(2)}
                </p>
              </button>

              <button
                onClick={() => removeFavorite(favorite.id)}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  padding: "0.375rem",
                  borderRadius: "9999px",
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "all 0.2s",
                }}
                className="group-hover-visible"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.4)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                }}
                aria-label={t("favorites.remove")}
              >
                <svg
                  style={{
                    width: "1rem",
                    height: "1rem",
                    color: theme === "dark" ? "#ffffff" : "#dc2626",
                  }}
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
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
