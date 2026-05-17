'use client';
import { Send, User, Copy, Check, Zap, RotateCcw, Sparkles, Shield, ChevronLeft } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type OracleMessage = {
    role: 'user' | 'assistant';
    content: string;
    mode?: string;
    timestamp?: Date;
};

interface NeuralModelChatProps {
    modeId: string;
    modeLabel: string;
    modeDesc: string;
    modeIcon: any;
    modeColor: string;
    modeBg: string;
    modeBorder: string;
    initialMessage: string;
    botName: string;
}

export default function NeuralModelChat({
    modeId,
    modeLabel,
    modeDesc,
    modeIcon: Icon,
    modeColor,
    modeBg,
    modeBorder,
    initialMessage,
    botName
}: NeuralModelChatProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<OracleMessage[]>([
        {
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (text?: string) => {
        const userMsg = (text || input).trim();
        if (!userMsg || isTyping) return;

        setInput('');
        const newMsg: OracleMessage = { role: 'user', content: userMsg, mode: modeId, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setIsTyping(true);

        try {
            const history = messages.slice(-12).map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    mode: modeId,
                    history
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "ORACLE_ERROR: Response unavailable.",
                timestamp: new Date()
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "ORACLE_ERROR: Neural link disrupted. Attempting reconnection...",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyMessage = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedId(index);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date()
        }]);
    };

    const formatContent = (content: string, messageIndex: number) => {
        return content
            .split('\n')
            .map((line, i) => {
                const key = `msg-${messageIndex}-line-${i}`;
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={key} className="font-black text-white text-sm mb-1">{line.replace(/\*\*/g, '')}</p>;
                }
                if (line.startsWith('• ') || line.startsWith('- ')) {
                    return <p key={key} className="text-white/70 text-sm pl-3 mb-0.5">→ {line.slice(2)}</p>;
                }
                if (line.match(/^\d+\./)) {
                    return <p key={key} className="text-white/70 text-sm mb-0.5">{line}</p>;
                }
                if (line.startsWith('#')) {
                    return <p key={key} className="font-black text-neydra-accent text-sm mb-1 uppercase tracking-wider">{line.replace(/^#+\s/, '')}</p>;
                }
                if (line === '') return <div key={key} className="h-2" />;
                return <p key={key} className="text-white/80 text-sm leading-relaxed mb-0.5">{line}</p>;
            });
    };

    return (
        <div className="flex flex-col h-screen w-full bg-carbon-black relative overflow-hidden font-sans">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-px h-64 bg-gradient-to-b from-transparent via-neydra-accent to-transparent"
                                    style={{
                                        left: `${15 + i * 15}%`,
                                        top: '-10%',
                                    }}
                                    animate={{
                                        y: ['0%', '200%'],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => {
                                // If they want to go back to dashboard/personas
                                if(window.history.length > 1) {
                                    window.history.back();
                                } else {
                                    router.push('/en');
                                }
                            }}
                            className="p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className={cn("p-2 rounded-xl border", modeBg, modeBorder)}>
                            <Icon size={18} className={modeColor} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest italic">
                                NEYDRA_ORACLE <span className={cn("text-[10px]", modeColor)}>{botName} // {modeLabel}</span>
                            </h2>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">{modeDesc}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mr-1">Context_Nodes:</span>
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-neydra-accent" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-neydra-accent/40" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="w-1.5 h-1.5 rounded-full bg-neydra-accent/20" />
                            </div>
                        </div>

                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-[9px] text-white/20 font-mono uppercase">LLAMA-3.3-70B ONLINE</span>
                        <button
                            onClick={clearChat}
                            className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Reset Chat"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-w-5xl mx-auto w-full">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.timestamp?.getTime() || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 group w-full",
                                msg.role === 'user' ? "flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-1",
                                msg.role === 'assistant'
                                    ? cn("border", modeBg, modeBorder, modeColor)
                                    : "bg-white/5 border-white/10 text-white/40"
                            )}>
                                {msg.role === 'assistant'
                                    ? <Icon size={16} />
                                    : <User size={16} />
                                }
                            </div>

                            <div className={cn("flex-1 space-y-1 max-w-[85%]", msg.role === 'user' ? "text-right" : "")}>
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    msg.role === 'assistant'
                                        ? "bg-white/[0.02] border-white/5"
                                        : cn("border", modeBg, modeBorder)
                                )}>
                                    {msg.role === 'assistant' ? (
                                        <div className="space-y-0.5 text-left">
                                            {formatContent(msg.content, i)}
                                        </div>
                                    ) : (
                                        <p className={cn("text-sm leading-relaxed font-medium", modeColor)}>
                                            {msg.content}
                                        </p>
                                    )}
                                </div>

                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                                        <button
                                            onClick={() => copyMessage(msg.content, i)}
                                            className="flex items-center gap-1 text-[8px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors"
                                        >
                                            {copiedId === i ? <Check size={10} className="text-red-600" /> : <Copy size={10} />}
                                            {copiedId === i ? 'COPIED' : 'COPY'}
                                        </button>
                                        {msg.timestamp && (
                                            <span className="text-[8px] font-mono text-white/10">
                                                {msg.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", modeBg, modeBorder, modeColor)}>
                            <Icon size={16} className="animate-pulse" />
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-2">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                                    className={cn("w-1.5 h-1.5 rounded-full", modeBg.replace('bg-', 'bg-').replace('/10', '/60'))}
                                />
                            ))}
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Neural Link Active...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto">
                    <div className={cn(
                        "relative flex items-end gap-3 bg-white/[0.03] border rounded-2xl p-3 transition-all",
                        "focus-within:border-white/20",
                        modeBorder.replace('border-', 'focus-within:border-')
                    )}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${botName}...`}
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm font-medium placeholder:text-white/10 resize-none custom-scrollbar max-h-32 pt-2"
                            style={{ minHeight: '36px' }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0",
                                input.trim() && !isTyping
                                    ? cn(modeBg, modeBorder, modeColor, "hover:opacity-80")
                                    : "bg-white/5 border-white/5 text-white/10 cursor-not-allowed"
                            )}
                        >
                            {isTyping
                                ? <Zap size={16} className="animate-pulse" />
                                : <Send size={16} />
                            }
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Shield size={10} className="text-neydra-accent" />
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
