const fs = require('fs');

const oracle = fs.readFileSync('apps/web/src/components/sectors/Neural/NeuralOracle.tsx', 'utf8')
    .replace('export function NeuralOracle', 'function NeuralOraclePanel')
    .replace(/'use client';\r?\n/, '');

const forge = fs.readFileSync('apps/web/src/components/sectors/Neural/VisionForge.tsx', 'utf8')
    .replace('export function VisionForge', 'function VisionForgePanel')
    .replace(/'use client';\r?\n/, '')
    .replace(/import .* from 'lucide-react';\r?\n/, '');

const scout = fs.readFileSync('apps/web/src/components/sectors/Neural/VisionScout.tsx', 'utf8')
    .replace('export function VisionScout', 'function VisionScoutPanel')
    .replace(/'use client';\r?\n/, '')
    .replace(/import .* from 'lucide-react';\r?\n/, '');

const wrapper = `'use client';
import { Brain, Sparkles, Image as ImageIcon, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
// --- INJECTED CODE ---

export function OmniIntelligence() {
    const [activeTab, setActiveTab] = useState('oracle');
    
    return (
        <div className="flex h-full bg-carbon-black overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-lg font-black text-white italic tracking-widest">OMNI<span className="text-hyper-cyan">_AI</span></h2>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Unified Intelligence Nexus</p>
                </div>
                <div className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('oracle')} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all", activeTab === 'oracle' ? "bg-hyper-cyan/10 border border-hyper-cyan/30 text-hyper-cyan" : "text-white/40 hover:bg-white/5 hover:text-white")}>
                        <div className="flex items-center gap-3"><Brain size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Neural Oracle</span></div>
                        {activeTab === 'oracle' && <ChevronRight size={14} />}
                    </button>
                    <button onClick={() => setActiveTab('personas')} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all", activeTab === 'personas' ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "text-white/40 hover:bg-white/5 hover:text-white")}>
                        <div className="flex items-center gap-3"><Sparkles size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">AI Personas</span></div>
                        {activeTab === 'personas' && <ChevronRight size={14} />}
                    </button>
                    <button onClick={() => setActiveTab('forge')} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all", activeTab === 'forge' ? "bg-pink-500/10 border border-pink-500/30 text-pink-500" : "text-white/40 hover:bg-white/5 hover:text-white")}>
                        <div className="flex items-center gap-3"><ImageIcon size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Vision Forge</span></div>
                        {activeTab === 'forge' && <ChevronRight size={14} />}
                    </button>
                    <button onClick={() => setActiveTab('scout')} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all", activeTab === 'scout' ? "bg-amber-500/10 border border-amber-500/30 text-amber-500" : "text-white/40 hover:bg-white/5 hover:text-white")}>
                        <div className="flex items-center gap-3"><Search size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Vision Scout</span></div>
                        {activeTab === 'scout' && <ChevronRight size={14} />}
                    </button>
                </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {activeTab === 'oracle' && <NeuralOraclePanel />}
                {activeTab === 'personas' && <div className="p-8 text-white">Personas Module Syncing...</div>}
                {activeTab === 'forge' && <VisionForgePanel />}
                {activeTab === 'scout' && <VisionScoutPanel />}
            </div>
        </div>
    );
}
`;

let finalFile = wrapper.replace('// --- INJECTED CODE ---', oracle + '\n' + forge + '\n' + scout);

// Clean up duplicate imports
finalFile = finalFile.replace(/import { motion, AnimatePresence } from 'framer-motion';\r?\n/g, '');
finalFile = "import { motion, AnimatePresence } from 'framer-motion';\n" + finalFile;

finalFile = finalFile.replace(/import React, { useState, useEffect } from 'react';\r?\n/g, '');
finalFile = finalFile.replace(/import { useState, useRef, useEffect } from 'react';\r?\n/g, '');
finalFile = finalFile.replace(/import { useState } from 'react';\r?\n/g, '');
finalFile = "import React, { useState, useRef, useEffect } from 'react';\n" + finalFile;

// Clean up lucide-react duplicate imports
const lucideImports = [
    'Send', 'Bot', 'User', 'Brain', 'BookOpen', 'Briefcase', 'Coffee', 'Terminal', 'Zap', 'Shield',
    'Copy', 'Check', 'Maximize2', 'RotateCcw', 'Code2', 'Sparkles', 'Image as ImageIcon', 'Video',
    'FileJson', 'Search', 'FileText', 'BarChart', 'Settings2', 'Languages', 'Microscope',
    'ChevronRight', 'Download', 'Loader2', 'AlertTriangle', 'Layers', 'Maximize', 'X'
];
const uniqueIcons = [...new Set(lucideImports)].join(', ');
finalFile = finalFile.replace(/import \{.*\} from 'lucide-react';\r?\n/g, '');
finalFile = `import { ${uniqueIcons} } from 'lucide-react';\n` + finalFile;

fs.writeFileSync('apps/web/src/components/sectors/Neural/OmniIntelligence.tsx', finalFile);
console.log('OmniIntelligence.tsx created successfully!');
