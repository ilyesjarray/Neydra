'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  duration?: number;
  glowColor?: string;
}

/**
 * GlowingBorder — Animated glowing border that rotates around the element.
 * Inspired by Magic UI / Aceternity animated borders.
 */
export function GlowingBorder({
  children,
  className = '',
  borderRadius = '1rem',
  duration = 4,
  glowColor = '#ff0000',
}: GlowingBorderProps) {
  return (
    <div className={`relative ${className}`} style={{ borderRadius }}>
      {/* Animated rotating gradient border */}
      <motion.div
        className="absolute -inset-[1px] z-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${glowColor}, transparent, transparent)`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Inner content with background to mask the gradient */}
      <div
        className="relative z-10 bg-black"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}
