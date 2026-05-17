'use client';
import React, { useEffect } from 'react';

export function NeydraExchange() {
    return (
        <div className="neydra-legacy-container flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
        /* * =========================================
         * CORE SYSTEM ARCHITECTURE [CSS - RED PROTOCOL]
         * MOBILE FULLSCREEN OPTIMIZED
         * =========================================
         */
        :root {
            --primary: #ff0000;
            /* BLOOD RED */
            --dim-red: #ff0000;
            /* DRIED BLOOD */
            --dark-red: #000000;
            /* DARKNESS */
            --bg-solid: #000000;
            /* VOID */
            --bg-panel: rgba(0, 0, 0, 0.85);
            --text-main: #ff0000;
            --scan-line: rgba(255, 0, 0, 0.05);
            --grid-line: rgba(255, 0, 0, 0.1);

            --font-ui: 'Rajdhani', sans-serif;
            --font-code: 'Share Tech Mono', monospace;
        }

        * {
            box-sizing: border-box;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            /* Remove blue tap glow */
        }

        html {
            height: -webkit-fill-available;
            scroll-behavior: smooth;
        }

        body {
            background-color: var(--bg-solid);
            color: var(--primary);
            font-family: var(--font-ui);
            margin: 0;
            width: 100%;
            /* Fix for iOS Safari 100vh bug */
            min-height: 100vh;
            min-height: -webkit-fill-available;
            overflow-x: hidden;
            /* Infinite Grid Background */
            background-image:
                linear-gradient(var(--grid-line) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
            background-size: 30px 30px;
            perspective: 1000px;
            /* Space for bottom nav + safe area for notched phones */
            padding-bottom: calc(70px + env(safe-area-inset-bottom));
            user-select: none;
            /* Prevent text selection on UI elements */
        }

        /* Allow text selection in input fields */
        input,
        textarea {
            user-select: text;
        }

        /* --- POST-PROCESSING FILTERS --- */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 50%, #000 100%);
            z-index: 900;
            pointer-events: none;
        }

        body::after {
            content: " ";
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(255, 0, 0, 0.02), rgba(255, 0, 0, 0.06));
            z-index: 999;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            animation: flicker 0.15s infinite;
        }

        /* --- CONTAINER & PANELS --- */
        .container {
            position: relative;
            z-index: 10;
            max-width: 1200px;
            margin: 0 auto;
            padding: 15px;
        }

        .panel {
            background: var(--bg-panel);
            border: 1px solid var(--dark-red);
            position: relative;
            backdrop-filter: blur(4px);
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 1);
            transition: all 0.2s ease;
            padding: 20px;
            margin-bottom: 20px;
        }

        .panel:hover {
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 1);
        }

        .panel-header {
            background: var(--dark-red);
            color: var(--primary);
            font-family: var(--font-code);
            font-size: 11px;
            padding: 4px 8px;
            border-bottom: 1px solid var(--primary);
            letter-spacing: 2px;
            margin: -20px -20px 20px -20px;
            padding-top: 8px;
            padding-bottom: 8px;
        }

        /* --- HEADER STYLING --- */
        .header-section {
            text-align: center;
            padding: 40px 15px 30px;
            /* Reduced padding for mobile */
            border-bottom: 2px solid var(--primary);
            background: linear-gradient(90deg, #000 0%, var(--dark-red) 50%, #000 100%);
            margin-bottom: 20px;
        }

        h1 {
            font-size: 32px;
            /* Reduced for mobile default */
            margin: 0;
            letter-spacing: 4px;
            color: #fff;
            text-shadow: 2px 2px 0px var(--primary);
            font-weight: 800;
            font-style: italic;
            text-transform: uppercase;
        }

        p {
            color: var(--text-main);
            line-height: 1.6;
        }

        /* --- FORM & INPUT STYLING (RED PROTOCOL) --- */
        label {
            display: block;
            font-family: var(--font-code);
            font-size: 11px;
            margin-bottom: 5px;
            color: var(--dim-red);
            letter-spacing: 1px;
            margin-top: 15px;
        }

        input,
        select,
        textarea {
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid var(--dark-red);
            color: #fff;
            font-family: var(--font-code);
            font-size: 16px;
            /* Prevents iOS auto-zoom */
            padding: 12px;
            margin-bottom: 15px;
            box-sizing: border-box;
            transition: 0.3s;
            border-radius: 0;
            /* Remove radius for futuristic look */
        }

        input:focus,
        select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
            outline: none;
        }

        /* Buttons */
        .btn {
            background: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
            font-family: var(--font-ui);
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: 0.2s;
            clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
            padding: 15px;
            width: 100%;
            margin-top: 10px;
        }

        .btn:hover,
        .btn:active {
            background: var(--primary);
            color: #000;
            box-shadow: 0 0 20px var(--primary);
        }

        /* --- CARD INPUTS --- */
        .card-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 15px;
        }

        .card-item {
            position: relative;
        }

        .card-item label {
            margin-top: 0;
            font-size: 10px;
        }

        .card-item input {
            padding-left: 40px;
        }

        .card-item::before {
            content: attr(data-index);
            position: absolute;
            left: 10px;
            top: 30px;
            color: var(--dim-red);
            font-size: 10px;
            pointer-events: none;
        }

        /* --- BOTTOM NAV (FIXED FOR MOBILE) --- */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.95);
            border-top: 1px solid var(--primary);
            z-index: 1000;
            padding: 8px 0;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.8);
            /* Safe area support for notched iPhones */
            padding-bottom: env(safe-area-inset-bottom);
        }

        .bottom-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: space-around;
            /* Spread out evenly */
            align-items: center;
            height: 50px;
        }

        .bottom-nav li {
            display: flex;
            justify-content: center;
            flex: 1;
        }

        .bottom-nav a {
            color: var(--dim-red);
            font-size: 20px;
            transition: 0.3s;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 1;
        }

        .bottom-nav a span {
            font-size: 9px;
            font-family: var(--font-code);
            margin-top: 4px;
            letter-spacing: 1px;
        }

        .bottom-nav a:hover,
        .bottom-nav a.active {
            color: #fff;
            text-shadow: 0 0 10px var(--primary);
        }

        /* --- FOOTER & SOCIALS --- */
        .footer__content {
            text-align: center;
            color: #ff0000;
        }

        .social__icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }

        .social__icons a {
            color: var(--primary);
            font-size: 24px;
            text-decoration: none;
            transition: 0.3s;
        }

        .social__icons a:hover {
            color: #fff;
            text-shadow: 0 0 10px var(--primary);
        }

        /* --- DECORATION --- */
        .deco-line {
            position: absolute;
            background: var(--primary);
            opacity: 0.3;
        }

        .dl-1 {
            top: 0;
            left: 0;
            width: 20px;
            height: 1px;
        }

        .dl-2 {
            top: 0;
            left: 0;
            width: 1px;
            height: 20px;
        }

        .dl-3 {
            bottom: 0;
            right: 0;
            width: 20px;
            height: 1px;
        }

        .dl-4 {
            bottom: 0;
            right: 0;
            width: 1px;
            height: 20px;
        }

        @keyframes flicker {
            0% {
                opacity: 0.97;
            }

            50% {
                opacity: 1;
            }

            100% {
                opacity: 0.98;
            }
        }

        /* Utility classes */
        .strong {
            color: #fff;
            text-shadow: 0 0 5px var(--primary);
            font-weight: bold;
        }

        .log-msg {
            color: var(--primary);
            margin-top: 10px;
            font-family: var(--font-code);
            font-size: 12px;
            min-height: 20px;
            text-align: center;
        }

        /* Responsive Tweaks for Larger Screens (Tablets/Desktop) */
        @media (min-width: 768px) {
            h1 {
                font-size: 64px;
                letter-spacing: 10px;
            }

            .header-section {
                padding: 60px 20px 40px;
            }

            .btn {
                font-size: 18px;
            }

            .bottom-nav a {
                font-size: 24px;
            }

            .bottom-nav a span {
                font-size: 11px;
            }

            body {
                padding-bottom: 80px;
            }
        }

        ::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
    
            `}} />
            
            



    {/* <script src="/js/security.js"></script> */}
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    {/* Updated Viewport for Mobile Fullscreen & No Zoom */}
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Exchange | NEYDRA™ [RED PROTOCOL]</title>

    {/* Red Protocol Fonts */}
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700;800&family=Share+Tech+Mono&display=swap"
        rel="stylesheet" />
    {/* Source 2 Icons */}
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.0.0/fonts/remixicon.css" rel="stylesheet" />

    {/* Assets */}
    <link rel="icon" href="/assets/icon.png" type="image/png" />
    <link rel="manifest" href="/manifest.json" />

    {/* EmailJS SDK */}
    <script src="https://cdn.emailjs.com/dist/email.min.js" defer></script>
    <script dangerouslySetInnerHTML={{ __html: `(function () { emailjs.init("MQKyFZlDIBIMySsjM"); })();` }} />

    




    {/* AUDIO ASSETS */}
    <audio id="snd-engage" src="/assets/engage.wav" preload="auto"></audio>
    <audio id="snd-alert" src="/assets/alert.wav" preload="auto"></audio>
    <audio id="snd-tick" src="/assets/tick.wav" preload="auto"></audio>
    <audio id="snd-ambient" src="/assets/ambient.wav" preload="auto"></audio>
    <audio id="snd-glitch" src="/assets/glitch.wav" preload="auto"></audio>

    <audio id="click-sound1" src="/click-sound1.mp3" preload="auto"></audio>
    <audio id="click-sound2" src="/click-sound2.mp3" preload="auto"></audio>
    <audio id="click-sound3" src="/click-sound3.mp3" preload="auto"></audio>
    <audio id="click-sound4" src="/click-sound4.mp3" preload="auto"></audio>

    <div className="container">

        {/* HEADER SECTION */}
        <header className="header-section">
            <h1>NEYDRA <span>EXCHANGE</span></h1>
            <p className="section__subtitle"
                style={{ "color": "var(--primary)", "fontSize": "14px", "letterSpacing": "2px", "marginTop": "5px" }}>
                DIGITAL CURRENCY CONVERSION SYSTEM
            </p>
            <p style={{ "maxWidth": "600px", "margin": "10px auto", "color": "var(--text-main)", "fontSize": "14px" }}>
                Convert your Tunisian dinar cash to digital currencies with ease and transparency.
            </p>
            <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "15px", "marginTop": "1.5rem" }}>
                <img src="/assets/ooredoo-logo.png" alt="Ooredoo"
                    style={{ "width": "60px", "height": "auto", "filter": "grayscale(100%)", "transition": "0.3s" }} />
                <div style={{ "fontFamily": "var(--font-code)", "color": "var(--dim-red)", "fontSize": "20px" }}>&rarr;</div>
                <img src="/assets/usdt-logo.png" alt="USDT"
                    style={{ "width": "60px", "height": "auto", "filter": "grayscale(100%)", "transition": "0.3s" }} />
            </div>
        </header>

        {/* ABOUT SECTION */}
        <section className="panel about__container">
            <div className="deco-line dl-1"></div>
            <div className="deco-line dl-2"></div>
            <div className="deco-line dl-3"></div>
            <div className="deco-line dl-4"></div>

            <h2 className="section__title"
                style={{ "color": "#fff", "fontSize": "20px", "borderBottom": "1px solid var(--dim-red)", "paddingBottom": "10px" }}>
                NEYDRA CURRENCY EXCHANGE
            </h2>
            <p className="section__subtitle" style={{ "color": "var(--primary)", "marginBottom": "15px", "fontSize": "12px" }}>
                PROTOCOL RULES & FEE STRUCTURE
            </p>
            <div className="about__details" style={{ "fontFamily": "var(--font-ui)", "lineHeight": "1.6", "fontSize": "14px" }}>
                Enter Ooredoo recharge cards (each 5 TND), select your desired digital currency, and click "Convert".
                You can add more cards in multiples of 3 by pressing the "Add More Cards" button below.<br /><br />
                <span className="strong">The NEYDRA Protocol:</span><br />
                NEYDRA takes 1/3 (every third card) as a fee, and you receive the digital equivalent of the remaining
                value minus operational fees.
                <br /><br />
                <div
                    style={{ "background": "rgba(0,0,0,0.3)", "padding": "10px", "borderLeft": "2px solid var(--primary)", "fontSize": "13px" }}>
                    <strong>TRANSACTION EXAMPLE:</strong><br />
                    1. Input: 3 cards (5 TND each = 15 TND)<br />
                    2. Protocol Fee: 1 card (5 TND)<br />
                    3. Operational Fee: 1 TND<br />
                    4. Net Value: 9 TND<br />
                    5. At rate 1 USDT = 3.20 TND<br />
                    6. Output: <span style={{ "color": "#fff" }}>2.81 USDT</span>
                </div>
            </div>
        </section>

        {/* SERVICE / FORM SECTION */}
        <section className="panel service__container">
            <div className="deco-line dl-1"></div>
            <div className="deco-line dl-2"></div>
            <div className="deco-line dl-3"></div>
            <div className="deco-line dl-4"></div>

            <h2 className="section__title"
                style={{ "color": "#fff", "fontSize": "20px", "borderBottom": "1px solid var(--dim-red)", "paddingBottom": "10px" }}>
                MAKE A CONVERSION
            </h2>

            <form id="exchange-form" style={{ "maxWidth": "600px", "margin": "auto" }}>
                <label>INITIALIZE CARDS (5 TND VALUE EACH)</label>
                <div id="card-fields">
                    <div className="card-group">
                        <div className="card-item" data-index="01">
                            <label htmlFor="card1">Ooredoo Card Code 1</label>
                            <input type="text" id="card1" name="card1" maxLength={14} required pattern="\d{14}"
                                inputMode="numeric" placeholder="Enter 14-digit code" />
                        </div>
                        <div className="card-item" data-index="02">
                            <label htmlFor="card2">Ooredoo Card Code 2</label>
                            <input type="text" id="card2" name="card2" maxLength={14} required pattern="\d{14}"
                                inputMode="numeric" placeholder="Enter 14-digit code" />
                        </div>
                        <div className="card-item" data-index="03">
                            <label htmlFor="card3">Ooredoo Card Code 3</label>
                            <input type="text" id="card3" name="card3" maxLength={14} required pattern="\d{14}"
                                inputMode="numeric" placeholder="Enter 14-digit code" />
                        </div>
                    </div>
                </div>
                <button id="add-cards-btn" type="button" className="btn"
                    style={{ "fontSize": "14px", "padding": "10px", "marginTop": "5px" }}>
                    &gt;&gt; ADD MORE CARDS (+3)
                </button>

                <label>CHOOSE CRYPTOCURRENCY</label>
                <select id="crypto" name="crypto" required>
                    <option value="USDT-TRC20">USDT TRC20 (LOW FEES)</option>
                    <option value="USDT-ERC20">USDT ERC20</option>
                    <option value="BTC">BITCOIN (BTC)</option>
                    <option value="ETH">ETHEREUM (ETH)</option>
                </select>

                <label>DESTINATION WALLET ADDRESS</label>
                <input type="text" id="wallet" name="wallet" required placeholder="Paste your wallet address" />

                <textarea name="user_data" id="user_data" style={{ "display": "none" }}></textarea>

                <div className="action__btns">
                    <button type="submit" className="btn">EXECUTE CONVERSION</button>
                </div>
                <div id="exchange-result" className="log-msg"></div>
            </form>
            <p style={{ "textAlign": "center", "fontSize": "11px", "color": "var(--dim-red)", "marginTop": "20px" }}>
                <b>NOTE:</b> Conversion rates and fees are subject to change.
            </p>
        </section>

        {/* FOOTER */}
        <footer className="panel">
            <div className="deco-line dl-1"></div>
            <div className="deco-line dl-2"></div>
            <div className="deco-line dl-3"></div>
            <div className="deco-line dl-4"></div>

            <div className="footer__container">
                <div className="footer__content">
                    <h2 style={{ "color": "#fff", "fontSize": "18px" }}>CONTACT PROTOCOL</h2>
                    <p style={{ "fontSize": "14px" }}>For help, reach out through the contact page or social media.</p>
                    <div className="social__icons">
                        <a href="https://www.facebook.com/share/1BkYPhTFjX/" className="icon"><i
                                className="ri-facebook-fill"></i></a>
                        <a href="https://www.instagram.com/neydra_org?igsh=MW55Zmp3bm9qejRlaA==" className="icon"><i
                                className="ri-instagram-fill"></i></a>
                    </div>
                </div>
            </div>
        </footer>

    <div className="elfsight-app-f0694651-f050-4245-909a-6b38d447d146" data-elfsight-app-lazy></div>
    {/* <script src="/js/auth.js"></script> */}

    
    <script src="/neydraexchange.js" defer></script>



        </div>
    );
}
