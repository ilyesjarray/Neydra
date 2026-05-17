'use client';

import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  borderGlow?: boolean;
}

const intensityMap = {
  light: 'bg-white/[0.02] backdrop-blur-md border-white/5',
  medium: 'bg-white/[0.04] backdrop-blur-xl border-white/10',
  heavy: 'bg-white/[0.08] backdrop-blur-2xl border-white/15',
};

/**
 * GlassmorphismCard — Galileo Glass UI-style card with true glassmorphism.
 * Uses backdrop-filter for real frosted glass effect.
 */
export function GlassmorphismCard({
  children,
  className = '',
  intensity = 'medium',
  borderGlow = true,
}: GlassmorphismCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl border p-6
        ${intensityMap[intensity]}
        ${borderGlow ? 'shadow-[0_0_30px_rgba(255,0,0,0.05)]' : ''}
        ${className}
      `}
    >
      {/* Inner light refraction simulation */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent rotate-12" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
