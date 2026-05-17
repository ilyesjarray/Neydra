'use client';

import { useState } from 'react';
import { Wallet, ShieldCheck, Loader2 } from 'lucide-react';

export function WalletConnect() {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
    const [address, setAddress] = useState('');

    const connectWallet = () => {
        if (status === 'connected') return;

        setStatus('connecting');
        // Simulate connection delay
        setTimeout(() => {
            setStatus('connected');
            setAddress('0x71C...9A23');
        }, 1200);
    };

    return (
        <button
            onClick={connectWallet}
            className={`
         flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 font-mono text-xs font-bold
         ${status === 'connected'
                    ? 'bg-neydra-accent-emerald/10 border-neydra-accent-emerald/30 text-neydra-accent-emerald'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-neydra-accent/50 hover:text-neydra-accent'
                }
      `}
        >
            {status === 'idle' && (
                <>
                    <Wallet className="w-4 h-4" />
                    <span>CONNECT WALLET</span>
                </>
            )}
            {status === 'connecting' && (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONNECTING...</span>
                </>
            )}
            {status === 'connected' && (
                <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{address}</span>
                </>
            )}
        </button>
    );
}
