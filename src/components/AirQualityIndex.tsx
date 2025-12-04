import { useAirQuality } from "../hooks/useAirQuality";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AirQualityIndexProps {
  lat: number;
  lon: number;
}

/**
 * Displays air quality index with pollutant details and health advice
 * @param lat - Latitude
 * @param lon - Longitude
 */

const AQI_LEVELS = {
  1: { label: "Good", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  2: { label: "Fair", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
  3: { label: "Moderate", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  4: { label: "Poor", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  5: { label: "Very Poor", color: "#991b1b", bg: "rgba(153, 27, 27, 0.1)" },
};

const HEALTH_ADVICE = {
  1: {
    general: "Air quality is excellent. Perfect day for outdoor activities!",
    sensitive: "Enjoy your outdoor activities.",
  },
  2: {
    general:
      "Air quality is acceptable. Outdoor activities are fine for most people.",
    sensitive:
      "Unusually sensitive individuals should consider reducing prolonged outdoor exertion.",
  },
  3: {
    general:
      "Acceptable air quality. Sensitive groups may experience minor breathing discomfort.",
    sensitive: "Consider reducing prolonged or heavy outdoor exertion.",
  },
  4: {
    general: "Unhealthy air quality. Everyone may experience health effects.",
    sensitive:
      "Avoid prolonged outdoor exertion. Keep outdoor activities short.",
  },
  5: {
    general: "Hazardous air quality. Health warnings of emergency conditions.",
    sensitive:
      "Avoid all outdoor physical activities. Stay indoors with windows closed.",
  },
};

export default function AirQualityIndex({ lat, lon }: AirQualityIndexProps) {
  const { data, isLoading, error } = useAirQuality(lat, lon);
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          padding: "1rem",
          textAlign: "center",
          color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#6b7280",
        }}
      >
        Loading air quality...
      </div>
    );
  }

  if (error || !data || !data.list || data.list.length === 0) {
    return null;
  }

  const aqiData = data.list[0];
  const aqi = aqiData.main.aqi as 1 | 2 | 3 | 4 | 5;
  const aqiInfo = AQI_LEVELS[aqi];
  const healthInfo = HEALTH_ADVICE[aqi];

  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1.5rem",
        borderRadius: "1rem",
        background: theme === "dark" ? "rgba(255,255,255,0.05)" : "#ffffff",
        border: `1px solid ${
          theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
        }`,
      }}
    >
      {/* AQI Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            background: aqiInfo.bg,
            border: `2px solid ${aqiInfo.color}`,
          }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: aqiInfo.color,
            }}
          >
            AQI {aqi}
          </span>
        </div>
        <div>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            {aqiInfo.label}
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#6b7280",
            }}
          >
            Air Quality Index
          </div>
        </div>
      </div>

      {/* Health Advice */}
      <div
        style={{
          padding: "1rem",
          borderRadius: "0.5rem",
          background: theme === "dark" ? "rgba(255,255,255,0.05)" : "#f9fafb",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            color: theme === "dark" ? "rgba(255,255,255,0.9)" : "#374151",
            marginBottom: "0.5rem",
          }}
        >
          💡 {healthInfo.general}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: theme === "dark" ? "rgba(255,255,255,0.6)" : "#6b7280",
          }}
        >
          🏥 Sensitive groups: {healthInfo.sensitive}
        </div>
      </div>

      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          background: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb",
          color: theme === "dark" ? "#ffffff" : "#111827",
          fontWeight: "500",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            theme === "dark" ? "rgba(255,255,255,0.15)" : "#d1d5db";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb";
        }}
      >
        {showDetails ? "▲ Hide" : "▼ Show"} Pollutant Details
      </button>

      {/* Pollutant Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <PollutantCard
                name="PM2.5"
                value={aqiData.components.pm2_5}
                unit="μg/m³"
                safeLevel={25}
                theme={theme}
              />
              <PollutantCard
                name="PM10"
                value={aqiData.components.pm10}
                unit="μg/m³"
                safeLevel={50}
                theme={theme}
              />
              <PollutantCard
                name="O₃"
                value={aqiData.components.o3}
                unit="μg/m³"
                safeLevel={100}
                theme={theme}
              />
              <PollutantCard
                name="NO₂"
                value={aqiData.components.no2}
                unit="μg/m³"
                safeLevel={40}
                theme={theme}
              />
              <PollutantCard
                name="SO₂"
                value={aqiData.components.so2}
                unit="μg/m³"
                safeLevel={20}
                theme={theme}
              />
              <PollutantCard
                name="CO"
                value={aqiData.components.co}
                unit="μg/m³"
                safeLevel={4000}
                theme={theme}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PollutantCard({
  name,
  value,
  unit,
  safeLevel,
  theme,
}: {
  name: string;
  value: number;
  unit: string;
  safeLevel: number;
  theme: string;
}) {
  const percentage = Math.min((value / safeLevel) * 100, 100);
  const isHigh = value > safeLevel;

  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: "0.5rem",
        background: theme === "dark" ? "rgba(255,255,255,0.05)" : "#ffffff",
        border: `1px solid ${
          theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"
        }`,
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: "600",
          color: theme === "dark" ? "rgba(255,255,255,0.7)" : "#6b7280",
          marginBottom: "0.25rem",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: isHigh ? "#ef4444" : theme === "dark" ? "#10b981" : "#059669",
          marginBottom: "0.5rem",
        }}
      >
        {value.toFixed(1)}{" "}
        <span style={{ fontSize: "0.75rem", fontWeight: "normal" }}>
          {unit}
        </span>
      </div>
      <div
        style={{
          height: "4px",
          borderRadius: "9999px",
          background: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: isHigh ? "#ef4444" : "#10b981",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
