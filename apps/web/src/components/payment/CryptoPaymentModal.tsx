'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, ShieldCheck, Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CryptoPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: string;
    price: string;
}

const WALLETS = {
    SOL: '3du1kBAfp6pYpujpr7VCbADeLV4ZciAojhrj6TEhHRhG',
    USDT: '0xaD1bAEabB510C6C41c1D6b727AeE832074CD885a'
};

export function CryptoPaymentModal({ isOpen, onClose, tier, price }: CryptoPaymentModalProps) {
    const [txId, setTxId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [copied, setCopied] = useState<'SOL' | 'USDT' | null>(null);

    const handleCopy = (text: string, type: 'SOL' | 'USDT') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success(`${type} Address Copied`);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txId.trim()) return;

        setIsVerifying(true);
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsVerifying(false);
        toast.success('Transaction Verified', {
            description: 'Access grant sequence initiated.'
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg z-[101]"
                        >
                            <div className="relative overflow-hidden rounded-none border border-red-500/20 bg-black shadow-[0_0_80px_rgba(0,0,0,1)]">
                                {/* Cinematic Gradient */}
                                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />

                                <div className="p-10 relative">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 p-2 rounded-none hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex flex-col items-center text-center mb-10">
                                        <div className="w-20 h-20 rounded-none bg-red-600/5 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_20px_#ff000010]">
                                            <ShieldCheck className="w-10 h-10 text-red-500 animate-pulse" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">SECURE_GATEWAY_V4</h2>
                                        <p className="text-[10px] text-red-500/40 font-mono tracking-[0.4em] uppercase">
                                            Unlock <span className="text-red-500 font-black">{tier}</span> Neydra Status | {price}
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* SOL Address */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-red-500/40 font-mono">
                                                <span>Solana (SOL)</span>
                                                <span className="text-red-500">Priority_Entry</span>
                                            </div>
                                            <div className="relative group">
                                                <div className="w-full bg-white/[0.02] border border-white/5 p-5 font-mono text-[11px] text-white/80 break-all pr-14 group-hover:border-red-500/20 transition-all rounded-none">
                                                    {WALLETS.SOL}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(WALLETS.SOL, 'SOL')}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-none hover:bg-red-600/10 text-red-500/40 hover:text-red-500 transition-all"
                                                >
                                                    {copied === 'SOL' ? <Check className="w-5 h-5 text-red-500" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* USDT Address */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-red-500/40 font-mono">
                                                <span>USDT (Polygon)</span>
                                                <span className="text-red-500/60 text-[7px] italic">Automated_Clearing</span>
                                            </div>
                                            <div className="relative group">
                                                <div className="w-full bg-white/[0.02] border border-white/5 p-5 font-mono text-[11px] text-white/80 break-all pr-14 group-hover:border-neydra-blue/20 transition-all rounded-none">
                                                    {WALLETS.USDT}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(WALLETS.USDT, 'USDT')}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-none hover:bg-red-600/10 text-red-500/40 hover:text-red-500 transition-all"
                                                >
                                                    {copied === 'USDT' ? <Check className="w-5 h-5 text-red-500" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* TXID Input */}
                                        <form onSubmit={handleSubmit} className="pt-8 border-t border-white/5 space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-mono block">
                                                    Transaction_Sequence_Auth
                                                </label>
                                                <div className="relative">
                                                    <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/40" />
                                                    <input
                                                        type="text"
                                                        value={txId}
                                                        onChange={(e) => setTxId(e.target.value)}
                                                        placeholder="PASTE_TRANSACTION_HASH_X..."
                                                        className="w-full bg-black border border-white/10 p-5 pl-14 text-sm text-white italic font-mono focus:outline-none focus:border-red-500/40 transition-all placeholder:text-white/5 rounded-none"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={!txId || isVerifying}
                                                className="w-full py-6 bg-red-600 text-black font-black uppercase tracking-[0.6em] text-xs hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group rounded-none"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                                                {isVerifying ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" /> VERIFYING_SEQUENCE...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="relative z-10">INITIALIZE_ACCESS_PROTOCOL</span> <ArrowRight className="w-5 h-5 relative z-10" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

