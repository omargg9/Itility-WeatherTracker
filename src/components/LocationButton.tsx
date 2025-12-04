import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buttonHover, buttonTap } from "@/utils/animations";
import { useTheme } from "../context/ThemeContext";

interface LocationButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Button to request user's current geolocation
 * Shows loading spinner when active
 */
export default function LocationButton({
  onClick,
  loading = false,
  disabled = false,
}: LocationButtonProps) {
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  const buttonStyle = {
    padding: "0.5rem 1rem",
    background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid #d1d5db",
    borderRadius: "0.75rem",
    color: theme === "dark" ? "#ffffff" : "#111827",
    transition: "all 0.3s",
    opacity: disabled || loading ? 0.5 : 1,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    minHeight: "2.75rem",
  };

  const buttonContent = (
    <>
      {loading ? (
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
      ) : (
        <svg
          style={{ width: "1.25rem", height: "1.25rem" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
      <span>{loading ? "Detecting..." : "Use My Location"}</span>
    </>
  );

  if (reducedMotion) {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        style={buttonStyle}
        aria-label="Use my current location"
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!loading && !disabled ? buttonHover : undefined}
      whileTap={!loading && !disabled ? buttonTap : undefined}
      style={buttonStyle}
      aria-label="Use my current location"
    >
      {buttonContent}
    </motion.button>
  );
}
