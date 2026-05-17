'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, ImageIcon, Sparkles, Coffee, BookOpen, Code2 } from 'lucide-react';

const AI_MODELS = [
    { id: 1, name: 'Neydra Oracle', slug: 'oracle', tier: 'high', rank: '01',
      tierLabel: 'Sovereign', desc: 'The ultimate imperial AI system for complex logic and strategy.', image: 'bot1card.png', route: '/en/ai/oracle', icon: Brain },
    { id: 2, name: 'Friend', slug: 'friend', tier: 'low', rank: '02',
      tierLabel: 'Bronze', desc: 'Casual companion — cheerful, honest, keeps it simple.', image: 'friendcard.png', route: '/en/ai/friend', icon: Coffee },
    { id: 3, name: 'Professor', slug: 'professor', tier: 'medium', rank: '03',
      tierLabel: 'Silver', desc: 'Country-aware scholar — adapts to your curriculum.', image: 'professorcard.png', route: '/en/ai/professor', icon: BookOpen },
    { id: 4, name: 'Builder', slug: 'builder', tier: 'high', rank: '04',
      tierLabel: 'Elite', desc: 'Agent swarm — builds complete projects from scratch.', image: 'buildercard.png', route: '/en/ai/builder', icon: Code2 },
    { id: 5, name: 'Vision Scout', slug: 'scout', tier: 'medium', rank: '05',
      tierLabel: 'Recon', desc: 'High-speed image analysis and text extraction.', image: 'bot2card.png', route: '/en/ai/scout', icon: Search },
    { id: 6, name: 'Vision Forge', slug: 'forge', tier: 'medium', rank: '06',
      tierLabel: 'Synth', desc: 'Advanced neural text-to-image generation.', image: 'bot3card.png', route: '/en/ai/forge', icon: ImageIcon },
    { id: 7, name: 'Lite App', slug: 'lite', tier: 'low', rank: '07',
      tierLabel: 'Fast', desc: 'Installable ultra-fast unified chatbot interface.', image: 'bot4card.png', route: '/oracle/', icon: Sparkles }
];

export function OmniIntelligence() {
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);

    const selectModel = (route: string) => {
        setIsLeaving(true);
        setTimeout(() => { 
            if (route.startsWith('/oracle/')) {
                window.location.href = route;
                setIsLeaving(false);
            } else {
                router.push(route); 
            }
        }, 800);
    };

    return (
        <div className="flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden bg-carbon-black text-white custom-scrollbar">
            <style dangerouslySetInnerHTML={{ __html: `
    .hub-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 36px;
      padding: 0 50px 80px;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      z-index: 5;
      position: relative;
    }

    @media(max-width:900px) {
      .hub-grid {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 0 20px 40px;
      }
    }

    /* Base Card Setup */
    .model-card {
      position: relative;
      border-radius: 20px;
      overflow: visible;
      cursor: pointer;
      opacity: 0;
      transform: translateY(40px) scale(.9);
      animation: revealCard .6s cubic-bezier(.22, 1, .36, 1) forwards;
      aspect-ratio: 3/4.2;
      background: #000000;
      z-index: 1;
      transition: transform .3s ease, filter .3s ease;
    }
    
    @keyframes revealCard {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .model-card:hover { z-index: 10; }

    /* Inner Wrapper */
    .card-inner {
      position: absolute;
      inset: 0;
      border-radius: 20px;
      overflow: hidden;
      z-index: 2;
    }
    .card-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform .5s cubic-bezier(.22, 1, .36, 1), filter .5s ease;
    }
    .model-card:hover .card-inner img {
      transform: scale(1.08);
      filter: brightness(1.1) saturate(1.1);
    }

    /* Info Bar */
    .card-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 30px 20px 20px;
      background: linear-gradient(0deg, rgba(0,0,0,.97) 0%, rgba(0,0,0,.8) 40%, rgba(0,0,0,.3) 80%, transparent 100%);
      z-index: 4;
      border-radius: 0 0 20px 20px;
    }
    .card-info .card-name {
      font-family: var(--font-display);
      font-size: 1.2rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-info .card-desc {
      font-family: var(--font-tech);
      font-size: .75rem;
      color: rgba(255,255,255,.6);
      letter-spacing: .5px;
      line-height: 1.5;
    }

    /* Rank & Badge */
    .tier-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      font-family: var(--font-display);
      font-size: .55rem;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 20px;
      z-index: 5;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .rank-number {
      position: absolute;
      top: -18px;
      left: 16px;
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.5rem;
      z-index: 6;
      line-height: 1;
      -webkit-text-stroke: 1px rgba(255,255,255,.1);
    }

    /* Tier: Low (Bronze) */
    .card-low .rank-number { color: rgba(255,0,0,.4); text-shadow: 0 0 15px rgba(255,0,0,.2); }
    .card-low .tier-badge { background: rgba(255,0,0,.06); color: #ff0000; border: 1px solid rgba(255,0,0,.2); }
    .card-low::after { content: ''; position: absolute; inset: -1px; border-radius: 21px; border: 1px solid rgba(255,0,0,.1); z-index: 3; pointer-events: none; transition: border-color .3s; }
    .card-low:hover::after { border-color: rgba(255,0,0,.3); }
    .card-low:hover { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 15px 30px rgba(255,0,0,.12)); }

    /* Tier: Medium (Silver) */
    .card-medium .rank-number { color: rgba(255,0,0,.6); text-shadow: 0 0 20px rgba(255,0,0,.3); }
    .card-medium .tier-badge { background: rgba(255,0,0,.08); color: #ff0000; border: 1px solid rgba(255,0,0,.3); box-shadow: 0 0 12px rgba(255,0,0,.1); }
    .card-medium::before {
      content: ''; position: absolute; inset: -2px; border-radius: 22px; z-index: 0;
      background: conic-gradient(from var(--angle, 0deg), transparent, rgba(255,0,0,.35), transparent, rgba(255,0,0,.18), transparent);
      animation: spinBorder 5s linear infinite;
    }
    .card-medium .card-inner { border: 2px solid #000; }
    @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
    @keyframes spinBorder { to { --angle: 360deg; } }
    .card-medium:hover { transform: translateY(-10px) scale(1.03); filter: drop-shadow(0 20px 40px rgba(255,0,0,.15)); }

    /* Tier: High (Elite/Sovereign) */
    .card-high { animation: eliteFloat 4s ease-in-out infinite; }
    @keyframes eliteFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .card-high .rank-number { color: rgba(255, 0, 0,.9); text-shadow: 0 0 25px rgba(255,0,0,.6); animation: rankPulse 2s ease-in-out infinite; }
    @keyframes rankPulse { 0%, 100% { text-shadow: 0 0 20px rgba(255,0,0,.5); } 50% { text-shadow: 0 0 40px rgba(255,0,0,.8); } }
    .card-high .tier-badge { background: rgba(255,0,0,.15); color: #ff0000; border: 1px solid rgba(255,0,0,.5); box-shadow: 0 0 15px rgba(255,0,0,.3); }
    .card-high::before {
      content: ''; position: absolute; inset: -3px; border-radius: 23px; z-index: 0;
      background: conic-gradient(from var(--angle, 0deg), #ff0000, transparent 20%, #ff0000 40%, transparent 60%, #ff0000 80%, transparent);
      animation: spinBorder 3s linear infinite; opacity: .6;
    }
    .card-high .card-inner { border: 3px solid #000; }
    .card-high:hover { animation: none; transform: translateY(-12px) scale(1.05) !important; filter: drop-shadow(0 25px 50px rgba(255,0,0,.3)); }
  ` }} />

            <div className="p-10 text-center relative z-10 pt-16 pb-12">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-[0.2em] mb-4">
                        AI <span className="text-neydra-accent">ASSISTANTS</span>
                    </h1>
                    <p className="text-xs md:text-sm text-white/50 uppercase tracking-[0.4em] font-mono">
                        Select a Neural Protocol to Initialize
                    </p>
                </motion.div>
            </div>

            <motion.div 
                animate={{ opacity: isLeaving ? 0 : 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="hub-grid">
                    {AI_MODELS.map((model, index) => {
                        const IconComponent = model.icon;
                        return (
                            <div 
                                key={model.id}
                                className={`model-card card-${model.tier}`}
                                onClick={() => selectModel(model.route)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="card-inner">
                                    <img src={`/assets/aiassistants/botcards/${model.image}`} alt={model.name} />
                                </div>
                                <div className="rank-number">{model.rank}</div>
                                <span className="tier-badge">{model.tierLabel}</span>
                                <div className="card-info">
                                    <div className="card-name">
                                        <IconComponent size={20} className={model.tier === 'high' ? 'text-neydra-accent' : 'text-red-500'} />
                                        {model.name}
                                    </div>
                                    <div className="card-desc">{model.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}