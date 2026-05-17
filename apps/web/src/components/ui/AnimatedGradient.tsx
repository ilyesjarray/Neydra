'use client';

import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * AnimatedGradient — Premium animated moving gradient background.
 * Creates a slow-moving, organic gradient atmosphere.
 */
export function AnimatedGradient({
  className = '',
  colors = ['#ff0000', '#000000', '#330000', '#000000'],
  speed = 8,
}: AnimatedGradientProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -inset-[100%]"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors[0]}22 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${colors[2]}22 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors[0]}11 0%, transparent 70%)
          `,
          filter: 'blur(80px)',
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: speed * 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: speed, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </div>
  );
}
