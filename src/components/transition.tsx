import { motion } from 'framer-motion';
import { ComponentProps, memo } from 'react';

const MOTION_VARIANTS = {
  initial: () => ({
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 2,
      delay: 0
    }
  }),
  in: () => ({
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 2,
      delay: 0
    }
  }),
  out: () => ({
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 2,
      delay: 0
    }
  })
};

export const TransitionDiv = memo(({ children, className }: { children: React.ReactNode, className?: ComponentProps<'div'>['className'] }) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={MOTION_VARIANTS}
    >
      {children}
    </motion.div>
  )
})
