// Animation variants and utilities for consistent Framer Motion animations

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// Transition presets
export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Custom easing curve
};

// Button interaction variants
export const buttonHover = {
  scale: 1.05,
  transition: springTransition,
};

export const buttonTap = {
  scale: 0.95,
};

// Card hover effects
export const cardHover = {
  y: -4,
  transition: smoothTransition,
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: smoothTransition,
};
