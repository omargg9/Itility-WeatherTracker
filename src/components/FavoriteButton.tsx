import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buttonHover, buttonTap } from "@/utils/animations";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * Toggle button for favorites with animated heart icon
 * @param isFavorite - Whether location is currently favorited
 * @param onToggle - Callback when button is clicked
 * @param disabled - Whether button is disabled (max favorites reached)
 */
export default function FavoriteButton({
  isFavorite,
  onToggle,
  disabled,
}: FavoriteButtonProps) {
  const reducedMotion = useReducedMotion();

  const buttonClasses =
    "p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-11 min-h-11";

  if (reducedMotion) {
    return (
      <button
        onClick={onToggle}
        disabled={disabled}
        className={buttonClasses}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className="w-6 h-6 text-white"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>
    );
  }

  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={buttonClasses}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className="w-6 h-6 text-white"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </motion.button>
  );
}
