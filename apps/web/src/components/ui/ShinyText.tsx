'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
  shimmerColor?: string;
}

/**
 * ShinyText — Magic UI-style text with an animated metallic shimmer sweep.
 * Creates a traveling highlight effect across the text.
 */
export function ShinyText({
  children,
  className = '',
  shimmerWidth = 100,
  shimmerColor = 'rgba(255, 0, 0, 0.3)',
}: ShinyTextProps) {
  return (
    <motion.span
      className={`relative inline-block bg-clip-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          currentColor 0%,
          currentColor 35%,
          ${shimmerColor} 50%,
          currentColor 65%,
          currentColor 100%
        )`,
        backgroundSize: `${shimmerWidth * 3}% 100%`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={{
        backgroundPosition: [`${shimmerWidth * 3}% 0%`, `-${shimmerWidth}% 0%`],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}
