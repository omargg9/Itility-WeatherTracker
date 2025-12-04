import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buttonHover, buttonTap } from '@/utils/animations';

interface LocationButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Button to request user's current geolocation
 * Shows loading spinner when active
 */
export default function LocationButton({ onClick, loading = false, disabled = false }: LocationButtonProps) {
  const reducedMotion = useReducedMotion();

  const buttonClasses = "px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-11";

  const buttonContent = (
    <>
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
      <span>{loading ? 'Detecting...' : 'Use My Location'}</span>
    </>
  );

  if (reducedMotion) {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={buttonClasses}
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
      className={buttonClasses}
      aria-label="Use my current location"
    >
      {buttonContent}
    </motion.button>
  );
}
