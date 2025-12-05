/** Animation variants and utilities for consistent Framer Motion animations */

/** Fade in/out animation */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Slide up animation */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/** Slide down animation */
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/** Scale in animation */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/** Container for staggered children animations */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/** Individual stagger item animation */
export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/** Spring transition preset */
export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

/** Smooth cubic-bezier transition */
export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number], // Custom easing curve
};

/** Button hover scale effect */
export const buttonHover = {
  scale: 1.05,
  transition: springTransition,
};

/** Button tap/press effect */
export const buttonTap = {
  scale: 0.95,
};

/** Card hover lift effect */
export const cardHover = {
  y: -4,
  transition: smoothTransition,
};

/** Page transition animation */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: smoothTransition,
};
