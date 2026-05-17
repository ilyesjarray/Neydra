'use client';
import React, { useEffect } from 'react';

export function NeydraP2P() {
    return (
        <div className="neydra-legacy-container h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
        /* =========================================
           NEYDRA ULTRA AERO PROTOCOL [RED EDITION]
           ========================================= */
        :root {
            --primary: #ff0000;
            --primary-light: #ff3333;
            --primary-dark: #cc0000;
            --bg-solid: #000000;
            --bg-panel: rgba(20, 0, 0, 0.6);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-main: #ffffff;
            --text-dim: #ff9999;
            --success: #00ff66;
            --warning: #ffaa00;
            --danger: #ff0044;
            --font-ui: 'Rajdhani', sans-serif;
            --font-code: 'Share Tech Mono', monospace;
        }

        * {
            box-sizing: border-box;
            outline: none;
            -webkit-tap-highlight-color: transparent;
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
            min-height: 100vh;
            overflow-x: hidden;
            padding-bottom: calc(90px + env(safe-area-inset-bottom));
            user-select: none;
            position: relative;
        }

        /* Aero Background */
        .aero-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
            pointer-events: none;
        }

        .orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.15), transparent 70%);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.05);
            animation: floatOrb linear infinite;
        }

        @keyframes floatOrb {
            0% {
                transform: translateY(110vh) scale(0.5);
                opacity: 0;
            }

            20% {
                opacity: 0.8;
            }

            100% {
                transform: translateY(-10vh) scale(1.2);
                opacity: 0;
            }
        }

        /* Scanlines */
        body::after {
            content: " ";
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 50%);
            z-index: 999;
            background-size: 100% 6px;
            pointer-events: none;
            opacity: 0.4;
        }

        .container {
            position: relative;
            z-index: 10;
            max-width: 1400px;
            margin: 0 auto;
            padding: 15px;
        }

        /* Animations */
        @keyframes fadeSlideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes elasticPop {
            0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }

            60% {
                transform: translate(-50%, -50%) scale(1.05);
            }

            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        @keyframes pulseGlow {

            0%,
            100% {
                box-shadow: 0 0 5px var(--primary), 0 0 10px rgba(255, 0, 0, 0.2);
            }

            50% {
                box-shadow: 0 0 15px var(--primary), 0 0 30px rgba(255, 0, 0, 0.4);
            }
        }

        /* Panels */
        .panel {
            background: linear-gradient(145deg, rgba(30, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
            border: 1px solid rgba(255, 0, 0, 0.2);
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.04), transparent);
            border-radius: 16px 16px 0 0;
            pointer-events: none;
        }

        .panel-header {
            background: linear-gradient(90deg, rgba(255, 0, 0, 0.2), transparent);
            color: #fff;
            font-family: var(--font-code);
            font-size: 11px;
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            letter-spacing: 3px;
            margin: -30px -30px 30px -30px;
            display: flex;
            justify-content: space-between;
            text-transform: uppercase;
            text-shadow: 0 0 10px var(--primary);
        }

        /* Header */
        .main-header {
            text-align: center;
            padding: 60px 15px 50px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            background: radial-gradient(circle at center top, rgba(40, 0, 0, 0.6), transparent 70%);
            margin-bottom: 30px;
            position: relative;
        }

        .main-header h1 {
            font-size: 64px;
            margin: 0;
            letter-spacing: 12px;
            color: #fff;
            text-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
            font-weight: 800;
            text-transform: uppercase;
            line-height: 1;
            background: linear-gradient(180deg, #ffffff 0%, #ffcccc 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: rgba(255, 0, 0, 0.8);
            font-family: var(--font-code);
            font-size: 13px;
            letter-spacing: 6px;
            margin-top: 15px;
            display: block;
            text-transform: uppercase;
        }

        /* View Management */
        .view {
            display: none;
        }

        .view.active {
            display: block;
            animation: fadeSlideUp 0.5s ease-out;
        }

        /* Auth */
        .auth-container {
            max-width: 480px;
            margin: 50px auto;
        }

        .auth-tabs {
            display: flex;
            margin-bottom: 25px;
            background: rgba(0, 0, 0, 0.3);
            padding: 5px;
            border-radius: 12px;
        }

        .auth-tab {
            flex: 1;
            padding: 14px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-family: var(--font-ui);
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            transition: 0.3s;
            border-radius: 8px;
        }

        .auth-tab.active {
            color: #fff;
            background: linear-gradient(145deg, var(--primary-dark), var(--primary));
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
        }

        /* Inputs */
        label {
            display: block;
            font-family: var(--font-code);
            font-size: 10px;
            margin-bottom: 10px;
            color: var(--text-dim);
            letter-spacing: 2px;
            margin-top: 20px;
            text-transform: uppercase;
        }

        input,
        select,
        textarea {
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 0, 0, 0.2);
            color: #fff;
            font-family: var(--font-code);
            font-size: 15px;
            padding: 16px;
            margin-bottom: 5px;
            transition: 0.3s;
            border-radius: 8px;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        input:focus,
        select:focus {
            border-color: var(--primary);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.6);
        }

        /* Buttons */
        .btn {
            background: linear-gradient(145deg, rgba(255, 0, 0, 0.2), rgba(200, 0, 0, 0.05));
            border: 1px solid rgba(255, 0, 0, 0.5);
            color: #fff;
            font-family: var(--font-ui);
            font-size: 15px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            padding: 16px 24px;
            width: 100%;
            margin-top: 20px;
            transition: 0.3s;
            position: relative;
            overflow: hidden;
            letter-spacing: 2px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
        }

        .btn:hover {
            background: linear-gradient(145deg, var(--primary), var(--primary-dark));
            border-color: #fff;
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5);
            transform: translateY(-2px);
        }

        .btn:hover::before {
            left: 100%;
        }

        .btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(255, 0, 0, 0.5);
        }

        .btn-sm {
            padding: 10px 18px;
            font-size: 12px;
            width: auto;
            margin-top: 10px;
        }

        .btn-outline {
            border-color: rgba(255, 255, 255, 0.3);
            color: var(--text-main);
            background: rgba(0, 0, 0, 0.2);
        }

        .btn-outline:hover {
            border-color: var(--primary);
            background: rgba(255, 0, 0, 0.1);
            color: #fff;
        }

        .btn-success {
            border-color: var(--success);
            color: var(--success);
        }

        .btn-success:hover {
            background: var(--success);
            color: #000;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.4);
        }

        .btn-danger {
            border-color: var(--danger);
            color: var(--danger);
        }

        .btn-danger:hover {
            background: var(--danger);
            color: #fff;
        }

        /* Cards */
        .offers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 25px;
        }

        .offer-card {
            background: linear-gradient(145deg, rgba(25, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
            border: 1px solid rgba(255, 0, 0, 0.15);
            position: relative;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            cursor: pointer;
        }

        .offer-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent);
            pointer-events: none;
        }

        .offer-card:hover {
            border-color: var(--primary);
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 0, 0, 0.3);
        }

        .offer-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(0, 0, 0, 0.2);
        }

        /* Avatar */
        .seller-avatar {
            width: 52px;
            height: 52px;
            background: radial-gradient(circle at 30% 30%, #ff6666, #ff0000 40%, #990000 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #fff;
            font-size: 20px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 -2px 5px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.3);
            position: relative;
        }

        .seller-avatar::after {
            content: '';
            position: absolute;
            top: 10%;
            left: 15%;
            width: 30%;
            height: 20%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
            border-radius: 50%;
            filter: blur(1px);
        }

        .seller-name {
            color: #fff;
            font-weight: 600;
            font-size: 17px;
            letter-spacing: 0.5px;
        }

        .offer-body {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
        }

        .offer-price {
            font-size: 34px;
            color: #fff;
            font-weight: 700;
            margin: 15px 0;
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .offer-price span {
            font-size: 14px;
            color: var(--primary);
            font-family: var(--font-code);
            opacity: 0.9;
        }

        .offer-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 0, 0, 0.1);
            margin-top: auto;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--danger);
            box-shadow: 0 0 5px var(--danger);
        }

        .status-dot.online {
            background: var(--success);
            box-shadow: 0 0 10px var(--success);
            animation: pulseGlow 2s infinite;
        }

        /* Level Badges */
        .level-badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 9px;
            font-family: var(--font-code);
            letter-spacing: 1px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .level-new {
            background: rgba(255, 0, 0, 0.2);
            color: var(--text-main);
        }

        .level-trusted {
            background: rgba(0, 255, 102, 0.15);
            color: var(--success);
            border-color: rgba(0, 255, 102, 0.3);
        }

        .level-professional {
            background: rgba(255, 170, 0, 0.15);
            color: var(--warning);
            border-color: rgba(255, 170, 0, 0.3);
        }

        /* Stats Bar */
        .stats-bar {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-item {
            background: linear-gradient(145deg, rgba(20, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
            border: 1px solid rgba(255, 0, 0, 0.15);
            padding: 20px;
            text-align: center;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .stat-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent);
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .stat-label {
            font-size: 10px;
            color: var(--primary);
            font-family: var(--font-code);
            margin-top: 5px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Modals & Panels */
        .notification-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            max-width: 90vw;
            height: 100vh;
            background: rgba(5, 0, 0, 0.98);
            border-left: 1px solid rgba(255, 0, 0, 0.3);
            z-index: 2000;
            transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        }

        .notification-panel.open {
            right: 0;
        }

        .notification-header {
            padding: 25px 20px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
        }

        .notification-item {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.1);
            cursor: pointer;
            transition: 0.3s;
        }

        .notification-item:hover {
            background: rgba(255, 0, 0, 0.05);
        }

        .notification-item.unread {
            border-left: 2px solid var(--primary);
            background: rgba(255, 0, 0, 0.02);
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1500;
            display: none;
            backdrop-filter: blur(5px);
        }

        .overlay.active {
            display: block;
        }

        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(145deg, rgba(20, 0, 0, 0.95), rgba(5, 0, 0, 0.98));
            border: 1px solid rgba(255, 0, 0, 0.3);
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 2000;
            display: none;
            opacity: 0;
            transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            border-radius: 16px;
            backdrop-filter: blur(10px);
        }

        .modal.open {
            display: block;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            animation: elasticPop 0.4s forwards;
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.2);
        }

        .modal-body {
            padding: 25px;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--primary);
            font-size: 24px;
            cursor: pointer;
            transition: 0.3s;
        }

        .close-btn:hover {
            color: #fff;
            transform: rotate(90deg);
            text-shadow: 0 0 10px var(--primary);
        }

        /* Dashboard */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .dashboard-card {
            background: linear-gradient(145deg, rgba(20, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
            border: 1px solid rgba(255, 0, 0, 0.1);
            padding: 25px;
            border-radius: 12px;
        }

        .dashboard-card h3 {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-family: var(--font-code);
            margin: 0 0 20px 0;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 0, 0, 0.1);
            letter-spacing: 2px;
        }

        /* Bottom Nav */
        .bottom-nav {
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: rgba(10, 0, 0, 0.7);
            border: 1px solid rgba(255, 0, 0, 0.2);
            z-index: 1000;
            padding: 8px 0;
            backdrop-filter: blur(20px);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .bottom-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: space-around;
        }

        .bottom-nav a {
            color: rgba(255, 255, 255, 0.5);
            font-size: 24px;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: 0.3s;
        }

        .bottom-nav a span {
            font-size: 10px;
            font-family: var(--font-code);
            margin-top: 5px;
            letter-spacing: 1px;
        }

        .bottom-nav a.active {
            color: #fff;
            text-shadow: 0 0 10px var(--primary);
            background: radial-gradient(circle at center, rgba(255, 0, 0, 0.2), transparent);
        }

        .bottom-nav a:hover {
            color: #fff;
            transform: translateY(-2px);
        }

        .nav-badge {
            position: absolute;
            top: -5px;
            right: -8px;
            background: var(--primary);
            color: #fff;
            font-size: 9px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px var(--primary);
        }

        /* Toast */
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .toast {
            background: rgba(10, 0, 0, 0.95);
            border: 1px solid var(--primary);
            padding: 15px 20px;
            min-width: 280px;
            animation: fadeSlideUp 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            border-radius: 8px;
            backdrop-filter: blur(5px);
        }

        .toast.success {
            border-color: var(--success);
        }

        .toast.error {
            border-color: var(--danger);
        }

        /* Card Input Styling */
        .card-input-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .card-input-group input {
            margin-bottom: 0;
            flex: 1;
        }

        .card-status {
            font-size: 12px;
            font-family: var(--font-code);
        }

        .card-status.valid {
            color: var(--success);
        }

        .card-status.invalid {
            color: var(--danger);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .main-header h1 {
                font-size: 36px;
                letter-spacing: 5px;
            }

            .stats-bar {
                grid-template-columns: repeat(2, 1fr);
            }

            .offers-grid {
                grid-template-columns: 1fr;
            }

            .main-header {
                padding: 40px 15px 30px;
            }

            .bottom-nav {
                bottom: 5px;
                left: 5px;
                right: 5px;
                border-radius: 12px;
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
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>NEYDRA P2P MARKETPLACE</title>

    {/* Fonts & Icons */}
    <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;800&family=Share+Tech+Mono&display=swap"
        rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.0.0/fonts/remixicon.css" rel="stylesheet" />
    <link rel="icon" href="/assets/icon.png" type="image/png" />

    {/* Supabase SDK */}
    {/* <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> */}

    



    <div className="aero-bg" id="aero-bg"></div>

    {/* Audio */}
    <audio id="snd-engage" src="/assets/engage.wav" preload="auto"></audio>
    <audio id="snd-alert" src="/assets/alert.wav" preload="auto"></audio>
    <audio id="snd-tick" src="/assets/tick.wav" preload="auto"></audio>

    <div className="container">
        {/* AUTH VIEW */}
        <div id="auth-view" className="view active">
            <div className="auth-container">
                <div style={{ "textAlign": "center", "marginBottom": "40px" }}>
                    <h1 style={{ "fontSize": "36px", "border": "none", "padding": "0" }}>NEYDRA</h1>
                    <span className="subtitle">TRC20 MARKET ACCESS</span>
                </div>
                <div className="panel">
                    <div className="auth-tabs">
                        <button className="auth-tab active" data-tab="login">LOGIN</button>
                        <button className="auth-tab" data-tab="register">REGISTER</button>
                    </div>
                    <div id="login-form">
                        <label>EMAIL ADDRESS</label>
                        <input type="email" id="login-email" placeholder="Enter your email" autoComplete="email" />
                        <label>PASSWORD</label>
                        <input type="password" id="login-password" placeholder="Enter password"
                            autoComplete="current-password" />
                        <button className="btn" onClick={() => { try { eval(`handleLogin()`); } catch(e){} }}>ACCESS SYSTEM</button>
                        <p className="log-msg" id="login-msg" style={{ "textAlign": "center", "marginTop": "15px" }}></p>
                    </div>
                    <div id="register-form" style={{ "display": "none" }}>
                        <label>USERNAME</label>
                        <input type="text" id="reg-username" placeholder="Choose username" autoComplete="username" />
                        <label>EMAIL ADDRESS</label>
                        <input type="email" id="reg-email" placeholder="Enter email" autoComplete="email" />
                        <label>PASSWORD</label>
                        <input type="password" id="reg-password" placeholder="Create password"
                            autoComplete="new-password" />
                        <label>CONFIRM PASSWORD</label>
                        <input type="password" id="reg-confirm" placeholder="Confirm password"
                            autoComplete="new-password" />
                        <button className="btn" onClick={() => { try { eval(`handleRegister()`); } catch(e){} }}>CREATE ACCOUNT</button>
                        <p className="log-msg" id="register-msg" style={{ "textAlign": "center", "marginTop": "15px" }}></p>
                    </div>
                </div>
            </div>
        </div>

        {/* MARKETPLACE VIEW */}
        <div id="market-view" className="view">
            <header className="main-header">
                <h1>MARKETPLACE</h1>
                <p className="subtitle">USDT TRC20 ONLY</p>
            </header>

            <div className="stats-bar">
                <div className="stat-item">
                    <div className="stat-value" id="stat-trades">0</div>
                    <div className="stat-label">YOUR TRADES</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value" id="stat-rating">-</div>
                    <div className="stat-label">RATING</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value" id="stat-online">0</div>
                    <div className="stat-label">ONLINE</div>
                </div>
            </div>

            {/* No filters for crypto as it's USDT only */}
            <div className="filter-bar" style={{ "justifyContent": "space-between" }}>
                <h3 style={{ "color": "#fff", "margin": "0", "fontSize": "16px" }}><i className="ri-filter-line"></i> FILTER BY SELLER LEVEL
                </h3>
                <select id="filter-level" style={{ "width": "auto", "minWidth": "150px" }}>
                    <option value="">ALL LEVELS</option>
                    <option value="professional">PROFESSIONAL</option>
                    <option value="trusted">TRUSTED</option>
                    <option value="new">NEW</option>
                </select>
            </div>

            <div className="offers-grid" id="offers-container"></div>
        </div>

        {/* CREATE OFFER VIEW */}
        <div id="create-view" className="view">
            <header className="main-header">
                <h1>CREATE OFFER</h1>
                <p className="subtitle">SELL USDT TRC20</p>
            </header>
            <div className="panel" style={{ "maxWidth": "600px", "margin": "0 auto" }}>
                <div className="panel-header"><span>NEW OFFER DETAILS</span></div>

                <label>CRYPTOCURRENCY</label>
                <input type="text" value="USDT (TRC20)" disabled
                    style={{ "opacity": "0.7", "borderColor": "var(--success)", "color": "var(--success)" }} />

                <label>QUANTITY (USDT)</label>
                <input type="number" id="offer-quantity" placeholder="Amount of USDT to sell" min="1" step="0.01" />

                <label>PRICE (TND per 1 USDT)</label>
                <input type="number" id="offer-price" placeholder="Price in Tunisian Dinar" min="0.01" step="0.01" />

                <label>YOUR TRC20 WALLET ADDRESS</label>
                <input type="text" id="offer-wallet" placeholder="TJx..." />

                <label>NOTES (OPTIONAL)</label>
                <textarea id="offer-notes" rows={2} placeholder="Terms or notes"></textarea>

                <div style={{ "display": "flex", "gap": "10px", "marginTop": "20px" }}>
                    <button className="btn btn-outline" onClick={() => { try { eval(`showView('market-view')`); } catch(e){} }}>CANCEL</button>
                    <button className="btn" onClick={() => { try { eval(`createOffer()`); } catch(e){} }}>PUBLISH</button>
                </div>
                <p className="log-msg" id="offer-msg"></p>
            </div>
        </div>

        {/* DASHBOARD VIEW */}
        <div id="dash-view" className="view">
            <header className="main-header">
                <h1>DASHBOARD</h1>
                <p className="subtitle">ACCOUNT</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>PROFILE</h3>
                    <div id="profile-info" style={{ "textAlign": "center" }}></div>
                </div>
                <div className="dashboard-card">
                    <h3>MY OFFERS</h3>
                    <div id="my-offers-list"></div>
                    <button className="btn btn-sm btn-outline" onClick={() => { try { eval(`showView('create-view')`); } catch(e){} }} style={{ "marginTop": "15px" }}>+
                        NEW OFFER</button>
                </div>

                {/* Pending Trades Section for Security */}
                <div className="dashboard-card" style={{ "gridColumn": "1 / -1" }}>
                    <h3>TRADES MANAGEMENT</h3>
                    <p style={{ "fontSize": "12px", "color": "var(--text-dim)", "marginBottom": "15px" }}>Manage your active trades.</p>
                    <div id="trade-management-list"></div>
                </div>

                <div className="dashboard-card">
                    <h3>HISTORY</h3>
                    <div id="trade-history-list"></div>
                </div>

                <div className="dashboard-card">
                    <h3>MY STORE</h3>
                    <div id="store-info"></div>
                    <button className="btn btn-sm btn-success" onClick={() => { try { eval(`openStoreModal()`); } catch(e){} }} style={{ "marginTop": "15px" }}
                        id="store-btn">CREATE STORE (30 TND)</button>
                </div>
            </div>
        </div>
    </div>

    {/* Modals */}
    <div className="notification-panel" id="notif-panel">
        <div className="notification-header">
            <h3 style={{ "color": "#fff" }}>NOTIFICATIONS</h3>
            <button className="close-btn" onClick={() => { try { eval(`closeNotifPanel()`); } catch(e){} }}><i className="ri-close-line"></i></button>
        </div>
        <div id="notif-list"></div>
    </div>

    <div className="modal" id="store-modal">
        <div className="modal-header">
            <h3 style={{ "color": "#fff" }}>CREATE STORE</h3>
            <button className="close-btn" onClick={() => { try { eval(`closeModal('store-modal')`); } catch(e){} }}><i className="ri-close-line"></i></button>
        </div>
        <div className="modal-body">
            <label>STORE NAME</label>
            <input type="text" id="store-name" placeholder="Name" />
            <label>DESCRIPTION</label>
            <textarea id="store-desc" rows={2} placeholder="What do you offer?"></textarea>
            <p style={{ "color": "var(--warning)", "fontSize": "12px", "margin": "10px 0" }}>You will be redirected to payment gateway.
            </p>
            <button className="btn btn-success" onClick={() => { try { eval(`initiateStorePayment()`); } catch(e){} }}>PAY 30 TND & CREATE</button>
        </div>
    </div>

    <div className="modal" id="trade-modal">
        <div className="modal-header">
            <h3 style={{ "color": "#fff" }} id="trade-title">TRADE</h3>
            <button className="close-btn" onClick={() => { try { eval(`closeModal('trade-modal')`); } catch(e){} }}><i className="ri-close-line"></i></button>
        </div>
        <div className="modal-body" id="trade-body"></div>
    </div>

    <div className="modal" id="release-modal">
        <div className="modal-header">
            <h3 style={{ "color": "#fff" }}>RELEASE USDT</h3>
            <button className="close-btn" onClick={() => { try { eval(`closeModal('release-modal')`); } catch(e){} }}><i className="ri-close-line"></i></button>
        </div>
        <div className="modal-body" id="release-body"></div>
    </div>

    <div className="overlay" id="overlay" onClick={() => { try { eval(`closeAllModals()`); } catch(e){} }}></div>
    <div className="toast-container" id="toast-cont"></div>

    <nav className="bottom-nav" style={{ "display": "none" }}>
        <ul>
            <li><a href="#" onClick={() => { try { eval(`showView('market-view'); return false;`); } catch(e){} }} id="nav-market" className="active"><i
                        className="ri-store-line"></i><span>MARKET</span></a></li>
            <li><a href="#" onClick={() => { try { eval(`showView('create-view'); return false;`); } catch(e){} }} id="nav-create"><i
                        className="ri-add-circle-line"></i><span>SELL</span></a></li>
            <li><a href="#" onClick={() => { try { eval(`showView('dash-view'); return false;`); } catch(e){} }} id="nav-dash"><i
                        className="ri-user-line"></i><span>PROFILE</span></a></li>
            <li><a href="#" onClick={() => { try { eval(`openNotifPanel(); return false;`); } catch(e){} }} style={{ "position": "relative" }}><i
                        className="ri-notification-line"></i><span>ALERTS</span><span className="nav-badge" id="notif-badge"
                        style={{ "display": "none" }}>0</span></a></li>
        </ul>
    </nav>

    
    <script src="/neydrap2p.js" defer></script>



        </div>
    );
}
