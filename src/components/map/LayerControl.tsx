import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface LayerControlProps {
  activeLayer: "temp" | "precipitation" | "clouds" | "wind" | null;
  onLayerChange: (
    layer: "temp" | "precipitation" | "clouds" | "wind" | null
  ) => void;
  className?: string;
}

const layers = [
  {
    id: "temp" as const,
    label: "Temperature",
    icon: "🌡️",
    color: "bg-red-500",
  },
  {
    id: "precipitation" as const,
    label: "Precipitation",
    icon: "🌧️",
    color: "bg-blue-500",
  },
  { id: "clouds" as const, label: "Clouds", icon: "☁️", color: "bg-gray-500" },
  { id: "wind" as const, label: "Wind", icon: "💨", color: "bg-cyan-500" },
];

export default function LayerControl({
  activeLayer,
  onLayerChange,
  className = "",
}: LayerControlProps) {
  const { t } = useTranslation();

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t("map.layers", "Weather Layers")}
      </h3>

      <div className="space-y-2">
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;

          return (
            <motion.button
              key={layer.id}
              onClick={() => onLayerChange(isActive ? null : layer.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? `${layer.color} text-white shadow-lg`
                  : "bg-white/10 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{layer.icon}</span>
              <span className="font-medium">
                {t(`map.${layer.id}`, layer.label)}
              </span>
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {activeLayer && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onLayerChange(null)}
          className="w-full mt-4 px-4 py-2 text-sm bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          {t("map.clearLayer", "Clear Layer")}
        </motion.button>
      )}
    </div>
  );
}
