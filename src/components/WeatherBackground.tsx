import { motion } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTheme } from "../context/ThemeContext";

/**
 * Props for WeatherBackground component
 * @property {string} condition - Weather condition (Clear, Rain, Clouds, etc.)
 */
interface WeatherBackgroundProps {
  condition: string;
}

/**
 * Weather-aware background image component with smooth transitions
 *
 * Features:
 * - Maps weather conditions to high-quality Unsplash images:
 *   - Clear: Blue sky with clouds
 *   - Rain: Rainy weather scene
 *   - Clouds: Cloudy sky
 *   - Snow: Snowy landscape
 *   - Thunderstorm: Dramatic storm clouds
 *   - Drizzle: Light rain scene
 *   - Mist/Fog/Haze: Foggy atmosphere
 *   - Default: Clear sky
 * - Smooth fade transition (1s) when condition changes via key-based re-render
 * - Dark gradient overlay (40-50% black) for text readability
 * - Absolute positioning within parent container
 * - Object-cover for container fill
 * - Error fallback via ImageWithFallback component
 *
 * @component
 * @param {WeatherBackgroundProps} props - Component props
 * @returns {JSX.Element} Animated background with image and gradient overlay
 *
 * @example
 * <div className="relative">
 *   <WeatherBackground condition="Rain" />
 *   <div className="relative z-10">Content here</div>
 * </div>
 */
export function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const getBackgroundImage = () => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "https://images.unsplash.com/photo-1601297183305-6df142704ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "rain":
        return "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "clouds":
        return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "snow":
        return "https://images.unsplash.com/photo-1491002052546-bf38f186af56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "thunderstorm":
        return "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "drizzle":
        return "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      case "mist":
      case "fog":
      case "haze":
        return "https://images.unsplash.com/photo-1487621167305-5d248087c724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      default:
        return "https://images.unsplash.com/photo-1601297183305-6df142704ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
  };

  return (
    <motion.div
      key={condition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 overflow-hidden rounded-2xl"
      aria-hidden="true"
    >
      <ImageWithFallback
        src={getBackgroundImage()}
        alt=""
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div
        className={`absolute inset-0 bg-linear-to-b ${
          isLight
            ? "from-white/20 via-white/10 to-white/30"
            : "from-black/40 via-black/30 to-black/50"
        }`}
      />
    </motion.div>
  );
}
