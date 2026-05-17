
'use client';
import React, { useEffect } from 'react';

export function NeydraAIPersonas() {
    return (
        <div className="neydra-legacy-container flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                ${css}
            `}} />
            ${body}
            <script dangerouslySetInnerHTML={{ __html: `
                const MODELS = [
                  { id: 1, name: 'Friend', slug: 'friend', tier: 'low', rank: '03',
                    tierLabel: 'Bronze', desc: 'Casual companion — cheerful, honest, keeps it simple.' },
                  { id: 2, name: 'Professor', slug: 'professor', tier: 'medium', rank: '02',
                    tierLabel: 'Silver', desc: 'Country-aware scholar — adapts to your curriculum.' },
                  { id: 3, name: 'Builder', slug: 'builder', tier: 'high', rank: '01',
                    tierLabel: 'Elite', desc: 'Agent swarm — builds complete projects from scratch.' }
                ];
                
                // Expose function for inline onClick
                window.goBack = function() {
                  const m = document.getElementById('ai-theme2');
                  if (m) { m.pause(); m.currentTime = 0; }
                  // Using React navigation ideally, but fallback to Next.js routing if possible
                  window.location.href = '/en';
                };
                
                window.selectModel = function(model) {
                  try { sessionStorage.setItem('neydra_bot', JSON.stringify(model)); } catch (e) {}
                  const music = document.getElementById('ai-theme2');
                  if(music) {
                      let vol = music.volume;
                      const fade = setInterval(() => { vol -= 0.05; if (vol <= 0) { clearInterval(fade); music.pause(); } else music.volume = vol; }, 60);
                  }
                  document.getElementById('selectionScreen').style.transition = 'opacity .8s ease';
                  document.getElementById('selectionScreen').style.opacity = '0';
                  setTimeout(() => { window.location.href = '/en'; }, 900);
                };

                setTimeout(() => {
                  const grid = document.getElementById('modelsGrid');
                  if(!grid) return;
                  if(grid.children.length === 0) {
                      MODELS.forEach((model) => {
                        const card = document.createElement('div');
                        card.className = `model-card card-${model.tier}`;
                        card.id = `card-${model.id}`;

                        let extras = '';
                        if (model.tier === 'medium' || model.tier === 'high') {
                          extras += '<div class="card-glow"></div>';
                        }
                        if (model.tier === 'high') {
                          extras += '<div class="holo-shine"></div>';
                          extras += `<canvas class="card-particles" id="particles-${model.id}"></canvas>`;
                        }

                        card.innerHTML = `
                          ${extras}
                          <div class="card-inner">
                            <img src="/assets/aiassistants/botcards/${model.slug}card.png" alt="${model.name}" />
                          </div>
                          <div class="rank-number">${model.rank}</div>
                          <span class="tier-badge">${model.tierLabel}</span>
                          <div class="card-border"></div>
                          <div class="card-info">
                            <div class="card-name">${model.name}</div>
                            <div class="card-desc">${model.desc}</div>
                          </div>
                        `;
                        card.addEventListener('click', () => selectModel(model));
                        grid.appendChild(card);
                      });
                  }
                }, 100);
            ` }} />
        </div>
    );
}
