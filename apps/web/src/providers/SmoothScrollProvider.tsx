'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * SmoothScrollProvider — Integrates Lenis for buttery smooth scrolling.
 * Wraps the entire app to provide momentum-based scroll behavior.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;
    let rafId: number;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn('Lenis smooth scroll init failed (non-critical):', err);
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
