import { Send, Bot, User, Brain, BookOpen, Briefcase, Coffee, Terminal, Zap, Shield, Copy, Check, Maximize2, RotateCcw, Code2, Sparkles, Image as ImageIcon, Video, FileJson, Search, FileText, BarChart, Settings2, Languages, Microscope, ChevronRight, Download, Loader2, AlertTriangle, Layers, Maximize, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
'use client';
import { cn } from '@/lib/utils';

import {
    Send, Bot, User, Brain, BookOpen,
    Briefcase, Coffee, Terminal, Zap, Shield,
    Copy, Check, Maximize2, RotateCcw, Code2,
    Sparkles, Image as ImageIcon, Video, FileJson, Search,
    FileText, BarChart, Settings2, Languages, Microscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

type OracleMessage = {
    role: 'user' | 'assistant';
    content: string;
    mode?: string;
    timestamp?: Date;
};

const ORACLE_MODES = [
    { id: 'executive', label: 'EXECUTIVE', icon: Briefcase, color: 'text-hyper-cyan', bg: 'bg-hyper-cyan/10', border: 'border-hyper-cyan/30', desc: 'Business, Strategy & Investments' },
    { id: 'academic', label: 'ACADEMIC', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', desc: 'Research, Science & Learning' },
    { id: 'philosophy', label: 'SAPIENS', icon: Brain, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', desc: 'Philosophy, Psychology & Wisdom' },
    { id: 'casual', label: 'PERSONAL', icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'Life, Creativity & Daily Help' },
    { id: 'code', label: 'CODE', icon: Code2, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', desc: 'Programming & Engineering' },
];



const ORACLE_PROMPTS: Record<string, string[]> = {
    executive: [
        'Analyze a growth strategy for a SaaS company',
        'Analyze my investment portfolio risk',
        'How do I build a productivity system for executives?',
        'Best crypto allocation strategy for 2025',
    ],
    academic: [
        'Explain quantum theory in simple terms',
        'What caused the fall of the Roman Empire?',
        'Solve: ∫x²sin(x)dx',
        'How does generative AI work?',
    ],
    philosophy: [
        'What is the difference between Stoicism and Existentialism?',
        'Is free will an illusion?',
        'How do I find my purpose in life?',
        'The ethics of AI consciousness',
    ],
    casual: [
        'Write a poem about power',
        'Recommend a productivity routine',
        'Translate this professional text into English',
        'How do I manage psychological pressure?',
    ],
    code: [
        'Write a React custom hook for auth',
        'Explain async/await vs Promises',
        'Design a scalable database schema',
        'Write a REST API in Python FastAPI',
    ],
};

function NeuralOraclePanel() {
    const [messages, setMessages] = useState<OracleMessage[]>([
        {
            role: 'assistant',
            content: '**NEYDRA ORACLE — ONLINE**\n\nI am Oracle, an imperial AI system powered by **Llama-3.3-70B** (70 billion parameters, state-of-the-art intelligence).\n\nI am capable of addressing **any complex vector** in English:\n• Business, Investment, & Finance\n• Science, Research, & Mathematics\n• Programming & Software Architecture\n• Philosophy & Psychology\n• Strategic Writing & Synthesis\n• General Intelligence without restriction\n\nSelect your protocol and issue your commands.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [currentMode, setCurrentMode] = useState(ORACLE_MODES[0]);
    const [isSeriousMode, setIsSeriousMode] = useState(true);
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
        const newMsg: OracleMessage = { role: 'user', content: userMsg, mode: currentMode.id, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setIsTyping(true);

        try {
            const history = messages.slice(-12).map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    mode: currentMode.id,
                    isSeriousMode,
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
            content: 'ORACLE RESET — Initializing new session. What are the Commander\'s objectives?',
            timestamp: new Date()
        }]);
    };

    // Format message content with basic markdown-like rendering
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
                    return <p key={key} className="font-black text-hyper-cyan text-sm mb-1 uppercase tracking-wider">{line.replace(/^#+\s/, '')}</p>;
                }
                if (line === '') return <div key={key} className="h-2" />;
                return <p key={key} className="text-white/80 text-sm leading-relaxed mb-0.5">{line}</p>;
            });
    };

    const quickPrompts = ORACLE_PROMPTS[currentMode.id] || [];

    return (
        <div className="flex flex-col h-full bg-carbon-black relative overflow-hidden">
            {/* Neural Synapse Visualizer Background */}
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
                                    className="absolute w-px h-64 bg-gradient-to-b from-transparent via-hyper-cyan to-transparent"
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

            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl border", currentMode.bg, currentMode.border)}>
                            <currentMode.icon size={18} className={currentMode.color} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest italic">
                                NEYDRA_ORACLE <span className={cn("text-[10px]", currentMode.color)}>{currentMode.label}</span>
                            </h2>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">{currentMode.desc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Task Mode Toggle */}
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl p-1 mr-2 scale-90">
                            <button
                                onClick={() => setIsSeriousMode(true)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                    isSeriousMode ? "bg-hyper-cyan text-carbon-black" : "text-white/20 hover:text-white/40"
                                )}
                            >
                                <Briefcase size={10} />
                                Serious_Work
                            </button>
                            <button
                                onClick={() => setIsSeriousMode(false)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                    !isSeriousMode ? "bg-emerald-500 text-carbon-black" : "text-white/20 hover:text-white/40"
                                )}
                            >
                                <Coffee size={10} />
                                Casual_Rest
                            </button>
                        </div>

                        {/* Context Memory Nodes */}
                        <div className="flex items-center gap-1.5 mr-4 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mr-1">Context_Nodes:</span>
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-hyper-cyan" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-hyper-cyan/40" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="w-1.5 h-1.5 rounded-full bg-hyper-cyan/20" />
                            </div>
                        </div>

                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-white/20 font-mono uppercase">LLAMA-3.3-70B ONLINE</span>
                        <button
                            onClick={clearChat}
                            className="ml-4 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Reset Chat"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {ORACLE_MODES.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setCurrentMode(mode)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                currentMode.id === mode.id
                                    ? cn(mode.bg, mode.border, mode.color)
                                    : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/[0.05]"
                            )}
                        >
                            <mode.icon size={12} />
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* Quick Prompts */}
                {messages.length <= 1 && (
                    <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((prompt, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => handleSend(prompt)}
                                className="p-3 text-left bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all leading-relaxed"
                            >
                                <Sparkles size={10} className={cn("inline mr-1.5 mb-0.5", currentMode.color)} />
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Messages */}
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.timestamp?.getTime() || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 group max-w-5xl",
                                msg.role === 'user' ? "flex-row-reverse ml-auto" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-1",
                                msg.role === 'assistant'
                                    ? cn("border", currentMode.bg, currentMode.border, currentMode.color)
                                    : "bg-white/5 border-white/10 text-white/40"
                            )}>
                                {msg.role === 'assistant'
                                    ? <currentMode.icon size={16} />
                                    : <User size={16} />
                                }
                            </div>

                            {/* Content */}
                            <div className={cn("flex-1 space-y-1 max-w-[85%]", msg.role === 'user' ? "text-right" : "")}>
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    msg.role === 'assistant'
                                        ? "bg-white/[0.02] border-white/5"
                                        : cn("border", currentMode.bg, currentMode.border)
                                )}>
                                    {msg.role === 'assistant' ? (
                                        <div className="space-y-0.5">
                                            {formatContent(msg.content, i)}
                                        </div>
                                    ) : (
                                        <p className={cn("text-sm leading-relaxed font-medium", currentMode.color)}>
                                            {msg.content}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                                        <button
                                            onClick={() => copyMessage(msg.content, i)}
                                            className="flex items-center gap-1 text-[8px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors"
                                        >
                                            {copiedId === i ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
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

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", currentMode.bg, currentMode.border, currentMode.color)}>
                            <currentMode.icon size={16} className="animate-pulse" />
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-2">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                                    className={cn("w-1.5 h-1.5 rounded-full", currentMode.bg.replace('bg-', 'bg-').replace('/10', '/60'))}
                                />
                            ))}
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Oracle Processing...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01]">

                <div className={cn(
                    "relative flex items-end gap-3 bg-white/[0.03] border rounded-2xl p-3 transition-all",
                    "focus-within:border-white/20",
                    currentMode.border.replace('border-', 'focus-within:border-')
                )}>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message Oracle in ${currentMode.label} mode... (Enter to send, Shift+Enter for newline)`}
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none text-white text-xs font-medium placeholder:text-white/10 resize-none custom-scrollbar max-h-32"
                        style={{ minHeight: '24px' }}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0",
                            input.trim() && !isTyping
                                ? cn(currentMode.bg, currentMode.border, currentMode.color, "hover:opacity-80")
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
                            <Shield size={10} className="text-hyper-cyan" />
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap size={10} className="text-hyper-cyan" />
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">No Content Limits</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] font-mono text-white/10">Llama3.3-70B | 70B params</span>
                        <a
                            href="/oracle/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hyper-cyan/10 border border-hyper-cyan/30 text-hyper-cyan hover:bg-hyper-cyan hover:text-carbon-black transition-all"
                        >
                            <Sparkles size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Install App</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}




declare global {
    interface Window {
        puter: any;
    }
}

const MODELS = [
    { id: 'flux', name: 'Flux Schnell (Standard)', group: 'Black Forest Labs' },
    { id: 'klein', name: 'Flux.2 Klein 4B (Fast)', group: 'Black Forest Labs' },
    { id: 'gptimage', name: 'GPT Image 1 Mini', group: 'OpenAI' },
    { id: 'gptimage-large', name: 'GPT Image 1.5', group: 'OpenAI' },
    { id: 'qwen-image', name: 'Qwen Image Plus', group: 'Alibaba' },
    { id: 'wan-image', name: 'Wan 2.7 Image', group: 'Alibaba' },
];

function VisionForgePanel() {
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id); // Default to Flux Schnell
    const [quality, setQuality] = useState('standard');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<{ url: string; prompt: string; model: string }[]>([]);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);

        try {
            // Generate a random seed for uniqueness
            const seed = Math.floor(Math.random() * 1000000000);
            
            // Construct the direct Pollinations URL
            // Default to 1024x1024. Using direct client-side fetch prevents the Vercel datacenter IP from being rate-limited.
            const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true&model=${selectedModel}`;
            
            let response: Response | null = null;
            let retries = 6;
            let delayMs = 2000;

            while (retries > 0) {
                response = await fetch(targetUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'image/jpeg' }
                });

                if (response.status === 429) {
                    retries--;
                    if (retries === 0) break;
                    console.warn(`[Vision Forge] Pollinations queue locked. Retrying in ${delayMs/1000}s...`);
                    await new Promise(r => setTimeout(r, delayMs));
                    delayMs += 1500; // Exponential backoff to avoid spamming
                    continue;
                }
                break;
            }

            if (!response || !response.ok) {
                const errText = await response?.text() || 'No response';
                let errMsg = `Protocol Error ${response?.status || 'Unknown'}`;
                try {
                    const json = JSON.parse(errText);
                    errMsg = json.message || json.error || errMsg;
                } catch {
                    errMsg = errText.slice(0, 100);
                }
                throw new Error(`SYNTHESIS_FAILED: ${errMsg}`);
            }

            // Convert the raw response into a blob URL so it can be rendered securely
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            setGeneratedImages(prev => [{ url: imageUrl, prompt, model: selectedModel }, ...prev]);

        } catch (err: any) {
            console.error('Generation Error:', err);
            setError(err.message || 'SYNTHESIS_FAILED: Unable to generate image.');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = (url: string, promptText: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `VISION_FORGE_${promptText.slice(0, 15).replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col h-full bg-carbon-black p-4 lg:p-10 font-sans overflow-hidden relative">
            <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                            <ImageIcon className="text-hyper-cyan" />
                            Vision_Forge
                        </h1>
                        <p className="text-[10px] text-hyper-cyan uppercase tracking-[0.4em] font-mono mt-1">Neural_Image_Synthesis // Level_9</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                    
                    {/* Left Panel: Controls */}
                    <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar pr-2">
                        
                        {/* Prompt Input */}
                        <div className="glass-v-series p-6 rounded-[2rem] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={12} className="text-hyper-cyan" />
                                    Visual_Directive
                                </label>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the visual parameters for synthesis..."
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 resize-none outline-none focus:border-hyper-cyan/50 transition-colors custom-scrollbar"
                            />
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className={cn(
                                    "w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                    isGenerating || !prompt.trim() 
                                        ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                        : "bg-hyper-cyan text-carbon-black hover:shadow-neon-cyan"
                                )}
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                {isGenerating ? 'Synthesizing...' : 'Initialize_Render'}
                            </motion.button>
                        </div>

                        {/* Configuration */}
                        <div className="glass-v-series p-6 rounded-[2rem] border border-white/5 space-y-6">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest pb-4 border-b border-white/5">
                                <Settings2 size={12} className="text-hyper-cyan" />
                                Render_Engine_Config
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center justify-between">
                                    Neural_Model
                                    <span className="text-[7px] text-amber-500/50">SOME REQUIRE CREDITS</span>
                                </label>
                                <select 
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white outline-none focus:border-hyper-cyan/50 appearance-none cursor-pointer"
                                >
                                    {MODELS.map(model => (
                                        <option key={model.id} value={model.id} className="bg-carbon-black text-white">
                                            {model.group}: {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Removed Puter Quality Settings */}
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex gap-3 text-rose-500 text-xs font-medium">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Gallery */}
                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">
                            <Layers size={12} className="text-hyper-cyan" />
                            Render_Archive
                        </div>

                        {generatedImages.length === 0 && !isGenerating ? (
                            <div className="h-64 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
                                <ImageIcon size={32} className="mb-4 opacity-50" />
                                <p className="text-xs font-medium uppercase tracking-widest">Archive_Empty</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {isGenerating && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-hyper-cyan relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-hyper-cyan/10 to-transparent animate-pulse" />
                                            <Loader2 className="animate-spin mb-4" size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Rendering...</span>
                                        </motion.div>
                                    )}
                                    {generatedImages.map((img, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative aspect-square rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
                                        >
                                            <img src={img.url} alt="Generated" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <p className="text-xs text-white line-clamp-2 font-medium mb-1">{img.prompt}</p>
                                                <p className="text-[8px] text-hyper-cyan uppercase tracking-widest font-mono mb-4">{img.model}</p>
                                                
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => setFullscreenImage(img.url)}
                                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <Maximize size={12} /> View
                                                    </button>
                                                    <button 
                                                        onClick={() => downloadImage(img.url, img.prompt)}
                                                        className="flex-1 bg-hyper-cyan/20 hover:bg-hyper-cyan text-hyper-cyan hover:text-black border border-hyper-cyan/30 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <Download size={12} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}




type ScoutMessage = {
    role: 'user' | 'assistant';
    content: string;
    mode?: string;
    images?: string[];
    timestamp?: Date;
};

const SCOUT_MODES = [
    { id: 'recon', label: 'RECON_MODE', icon: Search, color: 'text-hyper-cyan', bg: 'bg-hyper-cyan/10', border: 'border-hyper-cyan/30', desc: 'General Image Analysis' },
    { id: 'data', label: 'DATA_EXTRACTION', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'Text & Chart Parsing' },
];

const AI_SERVICES = [
    { id: 'img-gen', label: 'GENERATE_IMAGE', icon: ImageIcon, color: 'text-pink-500' },
    { id: 'vid-gen', label: 'GENERATE_VIDEO', icon: Video, color: 'text-violet-500' },
    { id: 'data-analyze', label: 'ANALYZE_DATA', icon: BarChart, color: 'text-hyper-cyan' },
];

const SCOUT_PROMPTS: Record<string, string[]> = {
    recon: [
        'Analyze this image in deep detail',
        'Identify the key components here',
    ],
    data: [
        'Extract all text from this document',
        'Summarize the data in this chart',
    ],
};

function VisionScoutPanel() {
    const [messages, setMessages] = useState<ScoutMessage[]>([
        {
            role: 'assistant',
            content: '**VISION SCOUT — ONLINE**\n\nI am Scout, a specialized neural node powered by the **Llama 4 Scout Vision Engine**.\n\nI am engineered specifically for **High-Speed Image-to-Text Intelligence**:\n• Document & Text Extraction\n• Chart & Graph Analysis\n• Component & System Identification\n\nUpload up to 3 visual assets and issue your command.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [currentMode, setCurrentMode] = useState(SCOUT_MODES[0]);
    const [isTyping, setIsTyping] = useState(false);
    const [activeService, setActiveService] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (selectedImages.length + files.length > 3) {
            alert("COMMAND_ABORTED: Maximum 3 images per transmission.");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_SIZE = 800;

                    if (width > height && width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    } else if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                        setSelectedImages(prev => [...prev, compressedBase64]);
                    }
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        });
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, activeService]);

    const handleServiceRequest = (serviceId: string) => {
        setActiveService(serviceId);
        setIsTyping(true);
        setTimeout(() => {
            let message = "";
            switch (serviceId) {
                case 'img-gen': message = "🎨 **IMAGE_GENERATION_CORE**: Routing to Synthesis Engine..."; break;
                case 'vid-gen': message = "🎬 **VIDEO_SYNTHESIS_ACTIVE**: Routing to Temporal Engine..."; break;
                case 'data-analyze': message = "📊 **DATA_ANALYSIS**: Please upload charts or datasets for immediate extraction."; break;
            }
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: message,
                timestamp: new Date()
            }]);
            setIsTyping(false);
            setActiveService(null);
        }, 1200);
    };

    const handleSend = async (text?: string) => {
        const userMsg = (text || input).trim();
        if ((!userMsg && selectedImages.length === 0) || isTyping) return;

        setInput('');
        const newMsg: ScoutMessage = { role: 'user', content: userMsg || 'Analyze this image.', mode: currentMode.id, images: selectedImages, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setIsTyping(true);
        const imagesToSend = [...selectedImages];
        setSelectedImages([]);

        try {
            const history = messages.slice(-12).map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('/api/ai/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg || 'Analyze this image.',
                    mode: currentMode.id,
                    history,
                    images: imagesToSend
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "SCOUT_ERROR: Response unavailable.",
                timestamp: new Date()
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "SCOUT_ERROR: Neural link disrupted. Attempting reconnection...",
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
            content: 'SCOUT RESET — Initializing new session. Awaiting visual input.',
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
                    return <p key={key} className="font-black text-hyper-cyan text-sm mb-1 uppercase tracking-wider">{line.replace(/^#+\s/, '')}</p>;
                }
                if (line === '') return <div key={key} className="h-2" />;
                return <p key={key} className="text-white/80 text-sm leading-relaxed mb-0.5">{line}</p>;
            });
    };
    const quickPrompts = SCOUT_PROMPTS[currentMode.id] || [];

    return (
        <div className="flex flex-col h-full bg-carbon-black relative overflow-hidden">
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
                                    className="absolute w-px h-64 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
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
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl border", currentMode.bg, currentMode.border)}>
                            <currentMode.icon size={18} className={currentMode.color} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest italic">
                                VISION_SCOUT <span className={cn("text-[10px]", currentMode.color)}>{currentMode.label}</span>
                            </h2>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">{currentMode.desc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-white/20 font-mono uppercase">LLAMA-4-SCOUT ONLINE</span>
                        <button
                            onClick={clearChat}
                            className="ml-4 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Reset Chat"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {SCOUT_MODES.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setCurrentMode(mode)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                currentMode.id === mode.id
                                    ? cn(mode.bg, mode.border, mode.color)
                                    : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/[0.05]"
                            )}
                        >
                            <mode.icon size={12} />
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length <= 1 && (
                    <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((prompt, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setInput(prompt)}
                                className="p-3 text-left bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all leading-relaxed"
                            >
                                <Sparkles size={10} className={cn("inline mr-1.5 mb-0.5", currentMode.color)} />
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.timestamp?.getTime() || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 group max-w-5xl",
                                msg.role === 'user' ? "flex-row-reverse ml-auto" : ""
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-1",
                                msg.role === 'assistant'
                                    ? cn("border", currentMode.bg, currentMode.border, currentMode.color)
                                    : "bg-white/5 border-white/10 text-white/40"
                            )}>
                                {msg.role === 'assistant'
                                    ? <currentMode.icon size={16} />
                                    : <User size={16} />
                                }
                            </div>

                            <div className={cn("flex-1 space-y-2 max-w-[85%]", msg.role === 'user' ? "text-right" : "")}>
                                {msg.images && msg.images.length > 0 && (
                                    <div className={cn("flex gap-2 flex-wrap", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        {msg.images.map((img, idx) => (
                                            <div key={idx} className="w-32 h-32 rounded-xl border border-white/10 overflow-hidden">
                                                <img src={img} alt="uploaded" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    msg.role === 'assistant'
                                        ? "bg-white/[0.02] border-white/5"
                                        : cn("border", currentMode.bg, currentMode.border)
                                )}>
                                    {msg.role === 'assistant' ? (
                                        <div className="space-y-0.5">
                                            {formatContent(msg.content, i)}
                                        </div>
                                    ) : (
                                        <p className={cn("text-sm leading-relaxed font-medium", currentMode.color)}>
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
                                            {copiedId === i ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
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
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", currentMode.bg, currentMode.border, currentMode.color)}>
                            <currentMode.icon size={16} className="animate-pulse" />
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-2">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                                    className={cn("w-1.5 h-1.5 rounded-full", currentMode.bg.replace('bg-', 'bg-').replace('/10', '/60'))}
                                />
                            ))}
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Scout Processing...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                {selectedImages.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {selectedImages.map((img, i) => (
                            <div key={i} className="relative group/img w-16 h-16 rounded-lg border border-white/10 overflow-hidden">
                                <img src={img} alt="preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(i)}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                >
                                    <X size={14} className="text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={cn(
                    "relative flex items-end gap-3 bg-white/[0.03] border rounded-2xl p-3 transition-all",
                    currentMode.border.replace('/30', '/10'),
                    "focus-within:border-hyper-cyan/40"
                )}>
                    <input 
                        type="file" 
                        ref={imageInputRef} 
                        onChange={handleImageUpload} 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                    />
                    
                    <button 
                        onClick={() => imageInputRef.current?.click()}
                        disabled={selectedImages.length >= 3 || isTyping}
                        className="p-2 text-white/20 hover:text-emerald-400 transition-colors"
                    >
                        <ImageIcon size={20} />
                    </button>

                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="INPUT_VISUAL_COMMAND..."
                        className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-white placeholder:text-white/10 resize-none py-2 min-h-[40px] max-h-[200px] custom-scrollbar"
                        rows={1}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={(!input.trim() && selectedImages.length === 0) || isTyping}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0",
                            (input.trim() || selectedImages.length > 0) && !isTyping
                                ? cn(currentMode.bg, currentMode.border, currentMode.color, "hover:opacity-80")
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
                            <Shield size={10} className="text-emerald-400" />
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">End-to-End Encrypted</span>
                        </div>
                    </div>
                    <span className="text-[8px] font-mono text-white/10">Llama4-Scout | Image-to-Text Mode</span>
                </div>
            </div>
        </div>
    );
}


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
