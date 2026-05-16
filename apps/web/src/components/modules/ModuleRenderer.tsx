'use client';



import dynamic from 'next/dynamic';

const NeuralOracle = dynamic(() => import('@/components/sectors/Neural/NeuralOracle').then(mod => mod.NeuralOracle));
const VisionScout = dynamic(() => import('@/components/sectors/Neural/VisionScout').then(mod => mod.VisionScout));
const VisionForge = dynamic(() => import('@/components/sectors/Neural/VisionForge').then(mod => mod.VisionForge));
const WarCouncil = dynamic(() => import('@/components/sectors/Neural/WarCouncil').then(mod => mod.WarCouncil));
const ChronoGovernor = dynamic(() => import('@/components/sectors/Temporal/ChronoGovernor').then(mod => mod.ChronoGovernor));
const WealthForge = dynamic(() => import('@/components/sectors/Wealth/WealthForge').then(mod => mod.WealthForge));
const LiaisonCore = dynamic(() => import('@/components/sectors/Ops/LiaisonCore').then(mod => mod.LiaisonCore));
const ImperialCommunity = dynamic(() => import('@/components/sectors/Community/ImperialCommunity').then(mod => mod.ImperialCommunity));
const NeydraSettings = dynamic(() => import('@/components/sectors/Settings/NeydraSettings').then(mod => mod.NeydraSettings));
const AdminPanel = dynamic(() => import('@/components/sectors/Admin/AdminPanel').then(mod => mod.AdminPanel));
const NeydraBilling = dynamic(() => import('@/components/sectors/Wealth/NeydraBilling').then(mod => mod.NeydraBilling));
const NeydraVault = dynamic(() => import('@/components/sectors/Security/NeydraVault').then(mod => mod.NeydraVault));
const MissionControl = dynamic(() => import('@/components/sectors/Ops/MissionControl').then(mod => mod.MissionControl));
const DigitalScouts = dynamic(() => import('@/components/sectors/Intelligence/DigitalScouts').then(mod => mod.DigitalScouts));
const WhaleRadar = dynamic(() => import('@/components/sectors/Intelligence/WhaleRadar').then(mod => mod.WhaleRadar));
const Chronos = dynamic(() => import('@/components/sectors/Intelligence/Chronos').then(mod => mod.Chronos));
const TheForge = dynamic(() => import('@/components/sectors/Forge/TheForge').then(mod => mod.TheForge));
const WealthSimulator = dynamic(() => import('@/components/sectors/Wealth/WealthSimulator').then(mod => mod.WealthSimulator));
const TheArmory = dynamic(() => import('@/components/sectors/Wealth/TheArmory').then(mod => mod.TheArmory));
const NeydraVoice = dynamic(() => import('@/components/sectors/Security/NeydraVoice').then(mod => mod.NeydraVoice));
const TheCitadel = dynamic(() => import('@/components/sectors/Security/TheCitadel').then(mod => mod.TheCitadel));
const NexusProtocol = dynamic(() => import('@/components/sectors/Security/NexusProtocol').then(mod => mod.NexusProtocol));
const AutomataStation = dynamic(() => import('@/components/sectors/Automata/AutomataStation').then(mod => mod.AutomataStation));
const NeydraSocial = dynamic(() => import('@/components/sectors/Social/NeydraSocial'));
const IntelligenceNexus = dynamic(() => import('@/components/sectors/Social/IntelligenceNexus'));
const PortfolioAnalyst = dynamic(() => import('@/components/sectors/Wealth/PortfolioAnalyst'));
const EnterpriseWorkspace = dynamic(() => import('@/components/sectors/Ops/EnterpriseWorkspace'));
const TemporalEngine = dynamic(() => import('@/components/sectors/Intelligence/TemporalEngine'));

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
            return <NeuralOracle />;
        case 'neydra-social':
            return <NeydraSocial />;
        case 'neydra-vault':
            return <NeydraVault />;
        
        // Sectors Under Construction
        case 'war-council':
            return <ProductionAlertWrapper sectorName="Stratagem_Council" moduleId={moduleId}><TierGuardWrapper sectorName="Stratagem_Council" requiredTier="ULTRA"><WarCouncil /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'high-scheduler':
            return <ProductionAlertWrapper sectorName="Chrono_Governor" moduleId={moduleId}><ChronoGovernor /></ProductionAlertWrapper>;
        case 'wealth-engine':
            return <ProductionAlertWrapper sectorName="Asset_Forge" moduleId={moduleId}><WealthForge /></ProductionAlertWrapper>;
        case 'global-ops':
            return <ProductionAlertWrapper sectorName="Liaison_Core" moduleId={moduleId}><LiaisonCore /></ProductionAlertWrapper>;
        case 'vision-scout':
            return <VisionScout />;
        case 'vision-forge':
            return <VisionForge />;
        case 'community-nexus':
            return <ProductionAlertWrapper sectorName="Imperial_Community" moduleId={moduleId}><ImperialCommunity /></ProductionAlertWrapper>;
        case 'system-settings':
            return <ProductionAlertWrapper sectorName="Neydra_Settings" moduleId={moduleId}><NeydraSettings /></ProductionAlertWrapper>;
        case 'admin-center':
            return <ProductionAlertWrapper sectorName="Throne_Room" moduleId={moduleId}><AdminPanel /></ProductionAlertWrapper>;
        case 'imperial-billing':
            return <ProductionAlertWrapper sectorName="Imperial_Billing" moduleId={moduleId}><NeydraBilling /></ProductionAlertWrapper>;
        case 'mission-control':
            return <ProductionAlertWrapper sectorName="Field_Command" moduleId={moduleId}><MissionControl /></ProductionAlertWrapper>;
        case 'digital-scouts':
            return <ProductionAlertWrapper sectorName="Shadow_Watch" moduleId={moduleId}><TierGuardWrapper sectorName="Shadow_Watch" requiredTier="ULTRA"><DigitalScouts /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'whale-radar':
            return <ProductionAlertWrapper sectorName="Deep_Sea_Radar" moduleId={moduleId}><TierGuardWrapper sectorName="Deep_Sea_Radar" requiredTier="PREMIUM"><WhaleRadar /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'chronos':
            return <ProductionAlertWrapper sectorName="Legacy_Temporal" moduleId={moduleId}><TierGuardWrapper sectorName="Legacy_Temporal" requiredTier="STANDARD"><Chronos /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'the-forge':
            return <ProductionAlertWrapper sectorName="Genesis_Engine" moduleId={moduleId}><TheForge /></ProductionAlertWrapper>;
        case 'wealth-simulator':
            return <ProductionAlertWrapper sectorName="Fleet_Stress_Test" moduleId={moduleId}><WealthSimulator /></ProductionAlertWrapper>;
        case 'neydra-voice':
            return <ProductionAlertWrapper sectorName="Voice_Core" moduleId={moduleId}><NeydraVoice /></ProductionAlertWrapper>;
        case 'the-citadel':
            return <ProductionAlertWrapper sectorName="The_Imperial_Bastion" moduleId={moduleId}><TierGuardWrapper sectorName="The_Imperial_Bastion" requiredTier="PREMIUM"><TheCitadel /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'the-armory':
            return <ProductionAlertWrapper sectorName="Neydra_Treasury" moduleId={moduleId}><TheArmory /></ProductionAlertWrapper>;
        case 'nexus-protocol':
            return <ProductionAlertWrapper sectorName="Nexus_Uplink" moduleId={moduleId}><NexusProtocol /></ProductionAlertWrapper>;
        case 'automata-station':
            return <ProductionAlertWrapper sectorName="Automata_Grid" moduleId={moduleId}><AutomataStation /></ProductionAlertWrapper>;
        case 'intelligence-nexus':
            return <ProductionAlertWrapper sectorName="Intelligence_Nexus" moduleId={moduleId}><IntelligenceNexus /></ProductionAlertWrapper>;
        case 'portfolio-analyst':
            return <ProductionAlertWrapper sectorName="Portfolio_Intelligence" moduleId={moduleId}><TierGuardWrapper sectorName="Portfolio_Intelligence" requiredTier="STANDARD"><PortfolioAnalyst /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'enterprise-workspace':
            return <ProductionAlertWrapper sectorName="B2B_Workspace" moduleId={moduleId}><TierGuardWrapper sectorName="B2B_Workspace" requiredTier="ULTRA"><EnterpriseWorkspace /></TierGuardWrapper></ProductionAlertWrapper>;
        case 'temporal-engine':
            return <ProductionAlertWrapper sectorName="Chronos_Singularity" moduleId={moduleId}><TemporalEngine /></ProductionAlertWrapper>;
            
        // Legacy Port Placeholders
        case 'neydra-exchange':
            return <ProductionAlertWrapper sectorName="Safe_Exchange" moduleId={moduleId}><div className="flex items-center justify-center h-full text-white/50 p-8 text-center uppercase tracking-widest font-mono text-xs">P2P Exchange System Syncing...</div></ProductionAlertWrapper>;
        case 'neydra-news':
            return <ProductionAlertWrapper sectorName="Global_News" moduleId={moduleId}><div className="flex items-center justify-center h-full text-white/50 p-8 text-center uppercase tracking-widest font-mono text-xs">News Terminal Syncing...</div></ProductionAlertWrapper>;
        case 'neydra-pae':
            return <ProductionAlertWrapper sectorName="Predictive_Analytics" moduleId={moduleId}><div className="flex items-center justify-center h-full text-white/50 p-8 text-center uppercase tracking-widest font-mono text-xs">Analytics Engine Syncing...</div></ProductionAlertWrapper>;
        case 'neydra-liquidity':
            return <ProductionAlertWrapper sectorName="Liquidity_Decoder" moduleId={moduleId}><div className="flex items-center justify-center h-full text-white/50 p-8 text-center uppercase tracking-widest font-mono text-xs">Liquidity Decoder Syncing...</div></ProductionAlertWrapper>;
        case 'neydra-nlp':
            return <ProductionAlertWrapper sectorName="NLP_Sentiment" moduleId={moduleId}><div className="flex items-center justify-center h-full text-white/50 p-8 text-center uppercase tracking-widest font-mono text-xs">Sentiment Analysis Syncing...</div></ProductionAlertWrapper>;

        default:
            return (
                <div className="flex items-center justify-center h-full text-white/20 uppercase font-black tracking-[1em] italic">
                    SELECT_SECTOR_TO_INITIALIZE
                </div>
            );
    }
}
