'use client';



// @ts-ignore
import dynamic from 'next/dynamic';

const OmniIntelligence = dynamic(() => import('@/components/sectors/Neural/OmniIntelligence').then(mod => mod.OmniIntelligence));
const WarCouncil = dynamic(() => import('@/components/sectors/Neural/WarCouncil').then(mod => mod.WarCouncil));
const ImperialCommunity = dynamic(() => import('@/components/sectors/Community/ImperialCommunity').then(mod => mod.ImperialCommunity));
const NeydraSettings = dynamic(() => import('@/components/sectors/Settings/NeydraSettings').then(mod => mod.NeydraSettings));
const NeydraSocial = dynamic(() => import('@/components/sectors/Social/NeydraSocial'));
const IntelligenceNexus = dynamic(() => import('@/components/sectors/Social/IntelligenceNexus'));

const NeydraExchange = dynamic(() => import('@/components/sectors/Legacy/NeydraExchange').then(mod => mod.NeydraExchange));
const NeydraNews = dynamic(() => import('@/components/sectors/Legacy/NeydraNews').then(mod => mod.NeydraNews));
const NeydraPAE = dynamic(() => import('@/components/sectors/Legacy/NeydraPAE').then(mod => mod.NeydraPAE));
const NeydraAIL = dynamic(() => import('@/components/sectors/Legacy/NeydraAIL').then(mod => mod.NeydraAIL));
const NeydraNLP = dynamic(() => import('@/components/sectors/Legacy/NeydraNLP').then(mod => mod.NeydraNLP));
const NeydraAbout = dynamic(() => import('@/components/sectors/Legacy/NeydraAbout').then(mod => mod.NeydraAbout));

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TierGuardWrapper } from '@/components/modules/TierGuardWrapper';

function ProductionAlertWrapper({ children, sectorName, moduleId }: { children: React.ReactNode, sectorName: string, moduleId: string }) {
    const [acknowledged, setAcknowledged] = useState(false);

    // Reset acknowledgment when module changes
    useEffect(() => {
        setAcknowledged(false);
    }, [moduleId]);

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {!acknowledged && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-carbon-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-24"
                    >
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="bg-[#111] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="text-amber-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black uppercase tracking-wider text-sm">{sectorName}</h3>
                                    <p className="text-amber-500/80 text-[10px] uppercase tracking-widest font-mono">Restricted Production Zone</p>
                                </div>
                            </div>
                            
                            <p className="text-white/60 text-xs leading-relaxed mb-6 font-medium">
                                Commander, this sector is currently under active development and neural syncing. Some systems may be unstable, incomplete, or disconnected from the core network. Proceed with caution.
                            </p>

                            <button 
                                onClick={() => setAcknowledged(true)}
                                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs transition-colors"
                            >
                                Acknowledge & Proceed
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Component renders underneath, but pointer events are blocked by the overlay until acknowledged */}
            {children}
        </div>
    );
}

interface ModuleRendererProps {
    moduleId: string;
}

export function ModuleRenderer({ moduleId }: ModuleRendererProps) {
    switch (moduleId) {
        case 'market-oracle':
        case 'vision-forge':
        case 'vision-scout':
            return <OmniIntelligence />;
        case 'neydra-social':
            return <NeydraSocial />;

        // Sectors Under Construction
        case 'war-council':
            return <ProductionAlertWrapper sectorName="Stratagem_Council" moduleId={moduleId}><TierGuardWrapper sectorName="Stratagem_Council" requiredTier="ULTRA"><WarCouncil /></TierGuardWrapper></ProductionAlertWrapper>;

        case 'community-nexus':
            return <ProductionAlertWrapper sectorName="Imperial_Community" moduleId={moduleId}><ImperialCommunity /></ProductionAlertWrapper>;
        case 'system-settings':
            return <ProductionAlertWrapper sectorName="Neydra_Settings" moduleId={moduleId}><NeydraSettings /></ProductionAlertWrapper>;
        case 'intelligence-nexus':
            return <ProductionAlertWrapper sectorName="Intelligence_Nexus" moduleId={moduleId}><IntelligenceNexus /></ProductionAlertWrapper>;
            
        // Legacy Port Placeholders
        case 'neydra-exchange':
            return <NeydraExchange />;
        case 'neydra-news':
            return <NeydraNews />;
        case 'neydra-pae':
            return <NeydraPAE />;
        case 'neydra-liquidity':
            return <NeydraAIL />;
        case 'neydra-nlp':
            return <NeydraNLP />;

        default:
            return (
                <div className="flex items-center justify-center h-full text-white/20 uppercase font-black tracking-[1em] italic">
                    SELECT_SECTOR_TO_INITIALIZE
                </div>
            );
    }
}
