import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../hooks/useDebounce";
import { useCitySearch } from "../hooks/useCitySearch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { slideDown } from "@/utils/animations";
import { useTheme } from "../context/ThemeContext";

interface CitySearchProps {
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

/**
 * City search input with autocomplete suggestions
 * @param onCitySelect - Callback when a city is selected with lat, lon, and name
 */
export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: cities, isLoading } = useCitySearch(debouncedQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    if (cities && cities.length > 0 && query.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [cities, query]);

  const handleSelect = (
    lat: number,
    lon: number,
    name: string,
    country: string
  ) => {
    const displayName = `${name}, ${country}`;
    setQuery(displayName);
    setIsOpen(false);
    onCitySelect(lat, lon, displayName);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => cities && cities.length > 0 && setIsOpen(true)}
          placeholder={t("search.placeholder")}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background:
              theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
            border:
              theme === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid #d1d5db",
            borderRadius: "0.75rem",
            color: theme === "dark" ? "#ffffff" : "#111827",
            outline: "none",
            transition: "all 0.3s",
          }}
          aria-label="Search for a city"
        />
        {isLoading && (
          <div
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                width: "1.25rem",
                height: "1.25rem",
                border:
                  theme === "dark"
                    ? "2px solid rgba(255, 255, 255, 0.3)"
                    : "2px solid #d1d5db",
                borderTopColor: theme === "dark" ? "#ffffff" : "#2563eb",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen &&
          cities &&
          cities.length > 0 &&
          (reducedMotion ? (
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                width: "100%",
                marginTop: "0.5rem",
                background:
                  theme === "dark" ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
                border:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() =>
                    handleSelect(city.lat, city.lon, city.name, city.country)
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    borderBottom: "1px solid #f3f4f6",
                    minHeight: "2.75rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ fontWeight: 500, color: "#111827" }}>
                    {city.name}
                    {city.state && `, ${city.state}`}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    {city.country}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <motion.div
              variants={slideDown}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                position: "absolute",
                zIndex: 10,
                width: "100%",
                marginTop: "0.5rem",
                background:
                  theme === "dark" ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
                border:
                  theme === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() =>
                    handleSelect(city.lat, city.lon, city.name, city.country)
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    borderBottom: "1px solid #f3f4f6",
                    minHeight: "2.75rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ fontWeight: 500, color: "#111827" }}>
                    {city.name}
                    {city.state && `, ${city.state}`}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    {city.country}
                  </div>
                </button>
              ))}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
