'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionTooltipProps {
    children: React.ReactNode;
    content: string;
}

export function ActionTooltip({ children, content }: ActionTooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute z-[100] px-3 py-1.5 mb-2 bottom-full left-1/2 -translate-x-1/2 bg-black border border-red-500/40 text-[10px] text-red-500 font-mono uppercase tracking-[0.3em] italic whitespace-nowrap pointer-events-none shadow-neon-red"
                    >
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black border-r border-b border-red-500/40 rotate-45" />
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
