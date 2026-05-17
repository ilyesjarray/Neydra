'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, ChevronRight, Scale } from 'lucide-react';

export function TOSModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('neydra_tos_accepted');
        if (!hasAccepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('neydra_tos_accepted', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-xl w-full prestige-panel p-10 rounded-3xl border-neydra-accent-gold/40 shadow-[0_0_50px_rgba(255, 0, 0,0.2)] relative overflow-hidden"
                >
                    <div className="diamond-dust" />

                    <div className="relative z-10 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-neydra-accent-gold/30 flex items-center justify-center text-red-500">
                                <Scale className="w-8 h-8" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Commander&apos;s Oath</h2>
                            <p className="text-gray-400 text-sm mt-2 font-mono italic">Operating in NEYDRA Intelligence Layer</p>
                        </div>

                        <div className="space-y-4 text-left bg-black/30 p-6 rounded-2xl border border-white/5">
                            <div className="flex gap-3">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                                <p className="text-[12px] text-gray-300 leading-relaxed font-mono">
                                    NEYDRA provides high-level market intelligence and predictive analytics. All final execution decisions remain the responsibility of the human user.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-neydra-accent-emerald shrink-0 mt-1" />
                                <p className="text-[12px] text-gray-300 leading-relaxed font-mono">
                                    I acknowledge that crypto assets are volatile and AI predictions are probabilistic. I agree to use this tool as a supplement to my own strategic assessment.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            className="w-full py-4 bg-red-600 text-black font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255, 0, 0,0.2)]"
                        >
                            I ACCEPT THE RESPONSIBILITY OF COMMAND
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[9px] text-gray-500 uppercase tracking-tighter">
                            Accessing Premium Tiers / V8.5 Sentient Intelligence Core
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
