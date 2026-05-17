'use client';

import { motion } from 'framer-motion';

interface RetroGridProps {
  className?: string;
  gridColor?: string;
  angle?: number;
}

/**
 * RetroGrid — Magic UI-style animated perspective grid background.
 * Creates an 80s-retro vanishing-point grid effect.
 */
export function RetroGrid({
  className = '',
  gridColor = 'rgba(255, 0, 0, 0.12)',
  angle = 65,
}: RetroGridProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          perspective: '200px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `rotateX(${angle}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <motion.div
            className="absolute inset-[-50%]"
            style={{
              backgroundImage: `
                linear-gradient(${gridColor} 1px, transparent 1px),
                linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
            animate={{ y: [0, 60] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
      {/* Fade edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />
    </div>
  );
}
