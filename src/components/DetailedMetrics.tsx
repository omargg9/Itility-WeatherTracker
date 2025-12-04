import type { CurrentWeatherResponse } from "../types/weather";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

interface DetailedMetricsProps {
  weather: CurrentWeatherResponse;
}

export default function DetailedMetrics({ weather }: DetailedMetricsProps) {
  const { t } = useTranslation();
  const { main, wind, sys, visibility } = weather;
  const { theme } = useTheme();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const visibilityKm = (visibility / 1000).toFixed(1);

  const cardStyle = {
    background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    padding: "1rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  };

  const labelStyle = {
    fontSize: "0.875rem",
    color: theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "#4b5563",
  };

  const valueStyle = {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme === "dark" ? "#ffffff" : "#111827",
  };

  const iconColor = theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "#4b5563";

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
        {t("detailedMetrics.title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div style={cardStyle}>
          <div className="flex items-center mb-2">
            <svg
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: iconColor,
                marginRight: "0.5rem",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p style={labelStyle}>{t("detailedMetrics.sunrise")}</p>
          </div>
          <p style={valueStyle}>{formatTime(sys.sunrise)}</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center mb-2">
            <svg
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: iconColor,
                marginRight: "0.5rem",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <p style={labelStyle}>{t("detailedMetrics.sunset")}</p>
          </div>
          <p style={valueStyle}>{formatTime(sys.sunset)}</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center mb-2">
            <svg
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: iconColor,
                marginRight: "0.5rem",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p style={labelStyle}>{t("detailedMetrics.visibility")}</p>
          </div>
          <p style={valueStyle}>{visibilityKm} km</p>
        </div>

        <div style={cardStyle}>
          <div className="flex items-center mb-2">
            <svg
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: iconColor,
                marginRight: "0.5rem",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <p style={labelStyle}>{t("detailedMetrics.windDir")}</p>
          </div>
          <p style={valueStyle}>
            {getWindDirection(wind.deg)} ({wind.deg}°)
          </p>
        </div>

        {wind.gust && (
          <div style={cardStyle}>
            <div className="flex items-center mb-2">
              <svg
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: iconColor,
                  marginRight: "0.5rem",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <p style={labelStyle}>{t("detailedMetrics.windGust")}</p>
            </div>
            <p style={valueStyle}>{Math.round(wind.gust)} m/s</p>
          </div>
        )}

        {main.sea_level && (
          <div style={cardStyle}>
            <div className="flex items-center mb-2">
              <svg
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: iconColor,
                  marginRight: "0.5rem",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <p style={labelStyle}>{t("detailedMetrics.seaLevel")}</p>
            </div>
            <p style={valueStyle}>{main.sea_level} hPa</p>
          </div>
        )}
      </div>
    </section>
  );
}
