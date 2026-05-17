'use client';

import { motion } from 'framer-motion';
import {
    Binary, Sword, BrainCircuit, Clock, Users,
    HardDrive, ShieldAlert, Radio, Search, MessageSquare,
    Wallet, Zap, BarChart3, Activity, Radar,
    Calendar, Mic, Target, Bot, LayoutGrid, Crown, Eye, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV_ITEMS = [
    { id: 'neydra-exchange', label: 'EXCHANGE', icon: Binary, iconPath: '/assets/free_button.png' },
    { id: 'market-oracle', label: 'AI AGENTS', icon: Binary, iconPath: '/assets/engine.png' },
    { id: 'neydra-news', label: 'NEWS', icon: Binary, iconPath: '/assets/gl-neydra-news.png' },
    { id: 'neydra-social', label: 'COMMUNITY', icon: Users },
    { id: 'neydra-pae', label: 'PREDICT', icon: Binary, iconPath: '/assets/Predictive_Analytics.png' },
];

interface MobileNavProps {
    currentSector: string;
    onSectorChange: (id: string) => void;
    onExpandMenu: () => void;
}

export function MobileNav({ currentSector, onSectorChange, onExpandMenu }: MobileNavProps) {
    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[200] bg-black/90 backdrop-blur-2xl border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)] safe-area-bottom"
        >
            <div className="flex items-center justify-around h-16">
                {MOBILE_NAV_ITEMS.map((item) => {
                    const isActive = currentSector === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectorChange(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px]",
                                isActive
                                    ? "text-neydra-accent"
                                    : "text-white/30"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all overflow-hidden",
                                isActive ? "bg-[#FF0000]/20 shadow-[0_0_15px_#FF0000]" : ""
                            )}>
                                {item.iconPath ? (
                                    <img src={item.iconPath} alt={item.label} className="w-5 h-5 object-contain filter drop-shadow-[0_0_5px_#FF0000]" />
                                ) : (
                                    <item.icon size={18} />
                                )}
                            </div>
                            <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute bottom-0 w-8 h-0.5 bg-neydra-accent rounded-full shadow-neon-cyan"
                                />
                            )}
                        </button>
                    );
                })}
                {/* More button */}
                <button
                    onClick={onExpandMenu}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-white/30"
                >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <LayoutGrid size={18} />
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-widest">MORE</span>
                </button>
            </div>
        </motion.nav>
    );
}

// Full sector list — matches PC DIRECTORATES order exactly
export const ALL_MOBILE_SECTORS = [
    {
        group: 'NEYDRA_ECOSYSTEM', sectors: [
            { id: 'neydra-exchange', label: 'Safe Exchange', icon: Binary, iconPath: '/assets/free_button.png' },
            { id: 'market-oracle', label: 'AI Assistants', icon: Binary, iconPath: '/assets/engine.png' },
            { id: 'neydra-news', label: 'Global News', icon: Binary, iconPath: '/assets/gl-neydra-news.png' },
            { id: 'neydra-social', label: 'Community Protocol', icon: Users },
            { id: 'neydra-pae', label: 'Predictive Analytics', icon: Binary, iconPath: '/assets/Predictive_Analytics.png' },
            { id: 'neydra-liquidity', label: 'Liquidity Decoder', icon: Binary, iconPath: '/assets/Liquidity_Decoder.png' },
            { id: 'neydra-nlp', label: 'NLP Sentiment', icon: Binary, iconPath: '/assets/NLP_Analysis.png' },
        ]
    }
];

