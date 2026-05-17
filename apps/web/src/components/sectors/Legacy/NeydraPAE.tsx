'use client';
import React, { useEffect } from 'react';

export function NeydraPAE() {
    return (
        <div className="neydra-legacy-container flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
    :root {
      --primary: #ff0000;
      --dim-red: #550000;
      --dark-red: #220000;
      --bg-solid: #000000;
      --bg-panel: rgba(10, 0, 0, 0.85);
      --text-main: #ffcccc;
      --font-ui: 'Rajdhani', sans-serif;
      --font-code: 'Share Tech Mono', monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-solid);
      color: var(--text-main);
      font-family: var(--font-ui);
      background-image:
        linear-gradient(rgba(255, 0, 0, 0.10) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 0, 0, 0.10) 1px, transparent 1px),
        url("/assets/header-bg.png");
      background-size: 30px 30px, 30px 30px, cover;
      background-position: 0 0, 0 0, center top;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }
    .wrap {
      width: min(980px, 100%);
      display: grid;
      gap: 14px;
    }
    .top {
      border: 1px solid var(--dark-red);
      background: linear-gradient(90deg, #000, var(--dark-red), #000);
      padding: 18px 18px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      margin: 0;
      font-size: 40px;
      letter-spacing: 8px;
      font-weight: 800;
      color: #fff;
      text-shadow: 4px 4px 0 var(--primary);
      font-style: italic;
      line-height: 1;
    }
    .meta {
      font-family: var(--font-code);
      font-size: 12px;
      color: var(--primary);
      text-align: right;
      line-height: 1.4;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .card {
      background: var(--bg-panel);
      border: 1px solid var(--dark-red);
      box-shadow: inset 0 0 20px rgba(0,0,0,1);
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
    .card:hover { border-color: var(--primary); }
    .hdr {
      font-family: var(--font-code);
      letter-spacing: 2px;
      font-size: 11px;
      color: var(--primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .badge {
      border: 1px solid var(--dim-red);
      padding: 3px 7px;
      border-radius: 999px;
      color: #fff;
      background: rgba(0,0,0,.35);
      font-size: 11px;
    }
    .desc {
      font-family: var(--font-code);
      font-size: 12px;
      color: #aaa;
      line-height: 1.6;
      margin: 0 0 14px 0;
    }
    .btnrow {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }
    .btn {
      appearance: none;
      background: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-family: var(--font-ui);
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      padding: 12px 14px;
      transition: .2s;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .btn:hover { background: var(--primary); color: #000; box-shadow: 0 0 20px var(--primary); }
    .btn.secondary {
      border-color: #660000;
      color: #ffcccc;
    }
    .btn.secondary:hover { background: #660000; color: #fff; box-shadow: 0 0 20px rgba(102,0,0,.5); }
    .foot {
      font-family: var(--font-code);
      font-size: 11px;
      color: #666;
      text-align: center;
      padding: 8px 0 0 0;
    }
    @media (max-width: 860px) {
      .grid { grid-template-columns: 1fr; }
      .title { font-size: 34px; letter-spacing: 6px; }
    }
  
            `}} />
            
            


  {/* <script src="/js/security.js"></script> */}
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/assets/icon.png" type="image/png" />
  <title>NEYDRA | PAE Portal</title>
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  


  <div className="wrap">
    <div className="top">
      <h1 className="title">PAE PORTAL</h1>
      <div className="meta">
        ROUTER: VANILLA<br/>
        MODE: SELECTOR<br/>
        TARGET: XAUUSD
      </div>
    </div>

    <div className="grid">
      <div className="card">
        <div className="hdr">
          <span>AUTO</span>
          <span className="badge">LEGACY</span>
        </div>
        <p className="desc">
          The original auto-dashboard workflow (LocalTunnel → external engine). Kept intact and moved to
          <code style={{ "color": "#ff6666" }}>/welcome/pae/Auto</code>.
        </p>
        <div className="btnrow">
          <a className="btn secondary" href="/welcome/pae/Auto">OPEN AUTO</a>
        </div>
      </div>

      <div className="card">
        <div className="hdr">
          <span>PRO</span>
          <span className="badge">NEXT.JS</span>
        </div>
        <p className="desc">
          Neydra-gold: production-grade XAUUSD probabilistic engine + learning loop + TradingView-grade chart overlays.
          Hosted as a dedicated project.
        </p>
        <div className="btnrow">
          <a className="btn" href="https://neydra-gold.vercel.app" target="_blank" rel="noreferrer">OPEN PRO</a>
        </div>
      </div>
    </div>

    <div className="foot">If PRO is unavailable, Please wait for our team production..</div>
  </div>




        </div>
    );
}
