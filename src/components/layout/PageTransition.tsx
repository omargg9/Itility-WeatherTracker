import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { pageTransition } from '@/utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition wrapper for smooth page transitions
 * Respects user's reduced motion preferences
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
