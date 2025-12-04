import { useMemo } from "react";

interface WeatherAnimationProps {
  conditionCode: string;
  size?: "sm" | "md" | "lg";
}

/** Size mapping for animation dimensions */
const sizeMap = {
  sm: 80,
  md: 150,
  lg: 200,
};

/**
 * Maps OpenWeatherMap icon codes to Lottie animation types
 * @param code - Weather icon code from API
 * @returns Animation type string
 */
const getAnimationType = (code: string): string => {
  const iconCode = code.substring(0, 2);

  const animationMap: Record<string, string> = {
    "01": "sunny", // clear sky
    "02": "partly-cloudy", // few clouds
    "03": "cloudy", // scattered clouds
    "04": "cloudy", // broken clouds
    "09": "rainy", // shower rain
    "10": "rainy", // rain
    "11": "stormy", // thunderstorm
    "13": "snowy", // snow
    "50": "foggy", // mist/fog
  };

  return animationMap[iconCode] || "sunny";
};

/**
 * Renders animated weather icon using Lottie animations
 * @param conditionCode - Weather condition icon code
 * @param size - Animation size ('sm', 'md', or 'lg')
 */
export default function WeatherAnimation({
  conditionCode,
  size = "md",
}: WeatherAnimationProps) {
  const animationType = useMemo(
    () => getAnimationType(conditionCode),
    [conditionCode]
  );
  const dimensions = sizeMap[size];

  // Fallback to emoji icons for now (until Lottie files are added)
  const emojiMap: Record<string, string> = {
    sunny: "☀️",
    "partly-cloudy": "⛅",
    cloudy: "☁️",
    rainy: "🌧️",
    stormy: "⛈️",
    snowy: "❄️",
    foggy: "🌫️",
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: dimensions, height: dimensions }}
      role="img"
      aria-label={`${animationType} weather`}
    >
      <span style={{ fontSize: dimensions * 0.6 }}>
        {emojiMap[animationType]}
      </span>
    </div>
  );
}
