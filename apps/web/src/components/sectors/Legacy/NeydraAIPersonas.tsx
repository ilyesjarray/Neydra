'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const MODELS = [
    { id: 1, name: 'Friend', slug: 'friend', tier: 'low', rank: '03',
    tierLabel: 'Bronze', desc: 'Casual companion — cheerful, honest, keeps it simple.' },
    { id: 2, name: 'Professor', slug: 'professor', tier: 'medium', rank: '02',
    tierLabel: 'Silver', desc: 'Country-aware scholar — adapts to your curriculum.' },
    { id: 3, name: 'Builder', slug: 'builder', tier: 'high', rank: '01',
    tierLabel: 'Elite', desc: 'Agent swarm — builds complete projects from scratch.' }
];

export function NeydraAIPersonas() {
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);

    const goBack = () => {
        const m = document.getElementById('ai-theme2') as HTMLAudioElement;
        if (m) { m.pause(); m.currentTime = 0; }
        // We are already inside the OS dashboard, so going back could just mean selecting the previous sector or doing nothing
        // Or if they want to go to the main page, we can route there, but typically it would change sector.
        // Assuming there is a way to trigger Neydra command, but for now we just use window history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push('/en');
        }
    };

    const selectModel = (model: typeof MODELS[0]) => {
        setIsLeaving(true);
        const music = document.getElementById('ai-theme2') as HTMLAudioElement;
        if (music) {
            let vol = music.volume;
            const fade = setInterval(() => { 
                vol -= 0.05; 
                if (vol <= 0) { 
                    clearInterval(fade); 
                    music.pause(); 
                } else {
                    music.volume = vol; 
                }
            }, 60);
        }
        setTimeout(() => { 
            router.push(`/en/ai/${model.slug}`); 
        }, 900);
    };

    return (
        <div className="neydra-legacy-container flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
    /* ═══════════════════════════════════════════════════
       GAME RANKING CARD SYSTEM — Premium Tier Design
       Inspired by top-3 leaderboard / gacha card aesthetics
       ═══════════════════════════════════════════════════ */

    .models-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 36px;
      padding: 0 50px 50px;
      width: 100%;
      max-width: 1200px;
      z-index: 5;
      position: relative;
      align-items: end;
    }

    @media(max-width:900px) {
      .models-grid {
        grid-template-columns: 1fr;
        gap: 18px;
        padding: 0 20px 30px;
        max-width: 320px;
        align-items: stretch;
      }
      .model-card { aspect-ratio: 1/1.1; border-radius: 14px; }
      .card-inner { border-radius: 14px; }
      .rank-number { font-size: 1.6rem !important; top: -12px !important; left: 10px !important; }
      .tier-badge { font-size: .42rem !important; padding: 3px 8px !important; top: 8px !important; right: 8px !important; }
      .card-info { padding: 12px 12px 10px !important; }
      .card-info .card-name { font-size: .65rem !important; letter-spacing: 2px !important; }
      .card-info .card-desc { font-size: .5rem !important; }
      .selection-title { margin-bottom: 20px !important; }
    }

    /* ── Base Card ── */
    .model-card {
      position: relative;
      border-radius: 20px;
      overflow: visible;
      cursor: pointer;
      opacity: 0;
      transform: translateY(60px) scale(.85);
      animation: revealCard .6s cubic-bezier(.22, 1, .36, 1) forwards;
      aspect-ratio: 3/4.2;
      background: #000000;
      z-index: 1;
      transition: transform .3s ease, filter .3s ease;
    }
    
    @keyframes revealCard {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .model-card:hover { z-index: 10; }

    /* Inner wrapper clips image */
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

    /* ── Card Info Bar ── */
    .card-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px 18px 16px;
      background: linear-gradient(0deg, rgba(0,0,0,.97) 0%, rgba(0,0,0,.8) 40%, rgba(0,0,0,.4) 70%, transparent 100%);
      z-index: 4;
      border-radius: 0 0 20px 20px;
    }
    .card-info .card-name {
      font-family: var(--font-display);
      font-size: clamp(.85rem, 1.8vw, 1.1rem);
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 5px;
    }
    .card-info .card-desc {
      font-family: var(--font-tech);
      font-size: clamp(.6rem, 1vw, .72rem);
      color: rgba(255,255,255,.5);
      letter-spacing: .8px;
      line-height: 1.5;
    }

    /* ── Tier Badge ── */
    .tier-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      font-family: var(--font-display);
      font-size: .5rem;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 20px;
      z-index: 5;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    /* ── Rank Number ── */
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

    /* ═══════════════════════════════════
       TIER 1: FRIEND — Basic (Red)
       ═══════════════════════════════════ */
    .card-low .rank-number { color: rgba(255,0,0,.5); text-shadow: 0 0 15px rgba(255,0,0,.2); }
    .card-low .tier-badge { background: rgba(255,0,0,.06); color: #ff0000; border: 1px solid rgba(255,0,0,.2); }
    .card-low .card-border {
      position: absolute;
      inset: -1px;
      border-radius: 21px;
      border: 1px solid rgba(255,0,0,.1);
      z-index: 3;
      pointer-events: none;
    }
    .card-low:hover .card-border { border-color: rgba(255,0,0,.3); }
    .card-low:hover {
      transform: translateY(-8px) scale(1.02);
      filter: drop-shadow(0 15px 30px rgba(255,0,0,.12));
    }

    /* ═══════════════════════════════════
       TIER 2: PROFESSOR — Advanced (Red)
       ═══════════════════════════════════ */
    .card-medium .rank-number { color: rgba(255,0,0,.65); text-shadow: 0 0 20px rgba(255,0,0,.35); }
    .card-medium .tier-badge {
      background: rgba(255,0,0,.08);
      color: #ff0000;
      border: 1px solid rgba(255,0,0,.3);
      box-shadow: 0 0 12px rgba(255,0,0,.1);
    }

    .card-medium::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 22px;
      z-index: 0;
      background: conic-gradient(from var(--angle, 0deg), transparent, rgba(255,0,0,.35), transparent, rgba(255,0,0,.18), transparent);
      animation: spinBorder 5s linear infinite;
    }
    .card-medium::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: #000000;
      z-index: 1;
    }
    @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
    @keyframes spinBorder { to { --angle: 360deg; } }

    .card-medium .card-glow {
      position: absolute;
      inset: -20px;
      border-radius: 30px;
      background: radial-gradient(ellipse at 50% 80%, rgba(255,0,0,.07), transparent 70%);
      z-index: -1;
      opacity: 0;
      transition: opacity .5s ease;
    }
    .card-medium:hover .card-glow { opacity: 1; }
    .card-medium:hover {
      transform: translateY(-12px) scale(1.03);
      filter: drop-shadow(0 20px 40px rgba(255,0,0,.1));
    }

    /* ═══════════════════════════════════
       TIER 3: BUILDER — Gold-Red / Elite
       ═══════════════════════════════════ */
    .card-high {
      animation: eliteFloat 4s ease-in-out infinite;
    }
    .card-high.revealed {
      transform: translateY(0) scale(1.03);
    }
    @keyframes eliteFloat {
      0%, 100% { transform: translateY(0) scale(1.03); }
      50% { transform: translateY(-6px) scale(1.03); }
    }

    .card-high .rank-number {
      color: rgba(255, 0, 0,.9);
      text-shadow: 0 0 25px rgba(255,0,0,.6), 0 0 50px rgba(255,0,0,.3);
      animation: rankPulse 2s ease-in-out infinite;
    }
    @keyframes rankPulse {
      0%, 100% { text-shadow: 0 0 20px rgba(255,0,0,.5), 0 0 40px rgba(255,0,0,.2); }
      50% { text-shadow: 0 0 30px rgba(255,0,0,.8), 0 0 60px rgba(255,0,0,.4), 0 0 80px rgba(255,0,0,.15); }
    }

    .card-high .tier-badge {
      background: rgba(255,0,0,.12);
      color: #ff0000;
      border: 1px solid rgba(255,0,0,.4);
      box-shadow: 0 0 15px rgba(255,0,0,.2), inset 0 0 8px rgba(255,0,0,.1);
      animation: badgePulse 2.5s ease-in-out infinite;
    }
    @keyframes badgePulse {
      0%, 100% { box-shadow: 0 0 10px rgba(255,0,0,.15); }
      50% { box-shadow: 0 0 20px rgba(255,0,0,.3), 0 0 35px rgba(255,0,0,.1); }
    }

    .card-high::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 23px;
      z-index: 0;
      background: conic-gradient(from var(--angle, 0deg), #ff0000, transparent 20%, #ff0000 40%, transparent 60%, #ff0000 80%, transparent);
      animation: spinBorder 3s linear infinite;
      opacity: .5;
    }
    .card-high::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: #000000;
      z-index: 1;
    }

    .card-high .holo-shine {
      position: absolute;
      inset: 0;
      border-radius: 20px;
      z-index: 5;
      pointer-events: none;
      overflow: hidden;
    }
    .card-high .holo-shine::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,.05) 45%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.05) 55%, transparent 60%);
      animation: holoSweep 4s ease-in-out infinite;
    }
    @keyframes holoSweep {
      0% { transform: translateX(-100%) translateY(-30%) rotate(25deg); }
      100% { transform: translateX(100%) translateY(30%) rotate(25deg); }
    }

    .card-high .card-glow {
      position: absolute;
      inset: -30px;
      border-radius: 35px;
      z-index: -1;
      background: radial-gradient(ellipse at 50% 70%, rgba(255,0,0,.12), transparent 65%);
      animation: auraBreath 3s ease-in-out infinite;
    }
    @keyframes auraBreath {
      0%, 100% { opacity: .6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    .card-high:hover {
      animation: none;
      transform: translateY(-14px) scale(1.06) !important;
      filter: drop-shadow(0 25px 50px rgba(255,0,0,.25)) drop-shadow(0 0 80px rgba(255,0,0,.08));
    }

    .card-particles {
      position: absolute;
      inset: -40px;
      z-index: 0;
      pointer-events: none;
    }

    .selection-title {
      font-size: clamp(1rem, 2.8vw, 1.8rem) !important;
      letter-spacing: 8px !important;
      margin-bottom: 35px !important;
    }
  ` }} />
            
            <audio id="ai-theme2" src="/assets/aiassistants/aitheme-music2.mp3" loop preload="auto" autoPlay></audio>
            <canvas id="galaxyCanvas" className="galaxy-canvas"></canvas>
            <button className="back-btn" onClick={goBack} title="Back">◂</button>

            <motion.div 
                className="selection-screen" 
                id="selectionScreen"
                animate={{ opacity: isLeaving ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1 
                    className="selection-title" 
                    id="selTitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Choose Your Model
                </motion.h1>
                <div className="models-grid" id="modelsGrid">
                    {MODELS.map((model, index) => (
                        <div 
                            key={model.id}
                            className={`model-card card-${model.tier}`}
                            onClick={() => selectModel(model)}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {(model.tier === 'medium' || model.tier === 'high') && (
                                <div className="card-glow"></div>
                            )}
                            {model.tier === 'high' && (
                                <>
                                    <div className="holo-shine"></div>
                                    <canvas className="card-particles" id={`particles-${model.id}`}></canvas>
                                </>
                            )}
                            
                            <div className="card-inner">
                                <img src={`/assets/aiassistants/botcards/${model.slug}card.png`} alt={model.name} />
                            </div>
                            <div className="rank-number">{model.rank}</div>
                            <span className="tier-badge">{model.tierLabel}</span>
                            <div className="card-border"></div>
                            <div className="card-info">
                                <div className="card-name">{model.name}</div>
                                <div className="card-desc">{model.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}