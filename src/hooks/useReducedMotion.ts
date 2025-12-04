import { useEffect, useState } from 'react';

/**
 * Hook to detect if user has enabled reduced motion in their OS settings
 * Returns true if prefers-reduced-motion: reduce is set
 */
/**
 * Detect if user prefers reduced motion for accessibility
 * @returns True if reduced motion is preferred
 */
export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
};
