'use client';
import Script from 'next/script';
import React, { useEffect } from 'react';

export function NeydraNews() {
    return (
        <div className="neydra-legacy-container h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
        :root {
            --primary: #ff0000;
            --primary-light: #ff3333;
            --primary-dark: #990000;
            --dim-red: #550000;
            --dark-red: #220000;
            --bg-solid: #000000;
            --bg-panel: rgba(10, 0, 0, 0.92);
            --text-main: #ffcccc;
            --text-dim: #888888;
            --grid-line: rgba(255, 0, 0, 0.06);
        }

        * {
            box-sizing: border-box;
            outline: none;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-solid);
            color: var(--primary);
            font-family: 'Rajdhani', sans-serif;
            margin: 0;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(var(--grid-line) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-red);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--dim-red);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
        }

        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 30%, #000 100%);
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
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(255, 0, 0, 0.015), rgba(255, 0, 0, 0.03));
            z-index: 999;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            animation: flicker 0.15s infinite;
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

        .app-container {
            display: grid;
            grid-template-columns: 280px 1fr 360px;
            grid-template-rows: 70px 1fr auto 40px;
            width: 100%;
            height: 100%;
            padding: 8px;
            gap: 8px;
            position: relative;
            z-index: 10;
        }

        .header {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            border-bottom: 2px solid var(--primary);
            background: linear-gradient(90deg, #000 0%, var(--dark-red) 50%, #000 100%);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            animation: header-scan 3s linear infinite;
        }

        @keyframes header-scan {
            0% {
                transform: translateX(-100%);
            }

            100% {
                transform: translateX(100%);
            }
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo-globe {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary), var(--dark-red));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: globe-pulse 3s infinite;
            box-shadow: 0 0 20px var(--primary), inset 0 0 20px rgba(0, 0, 0, 0.5);
            border: 2px solid var(--primary);
            position: relative;
            overflow: hidden;
        }

        .logo-globe::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 0, 0, 0.3) 3px, rgba(255, 0, 0, 0.3) 4px);
            animation: scanlines 2s linear infinite;
        }

        @keyframes scanlines {
            0% {
                transform: translateY(0);
            }

            100% {
                transform: translateY(10px);
            }
        }

        @keyframes globe-pulse {

            0%,
            100% {
                box-shadow: 0 0 20px var(--primary), inset 0 0 20px rgba(0, 0, 0, 0.5);
            }

            50% {
                box-shadow: 0 0 40px var(--primary), 0 0 60px var(--primary), inset 0 0 20px rgba(0, 0, 0, 0.5);
            }
        }

        .header-title {
            display: flex;
            flex-direction: column;
        }

        h1 {
            font-size: 26px;
            margin: 0;
            letter-spacing: 6px;
            color: #fff;
            text-shadow: 2px 2px 0px var(--primary);
            font-weight: 800;
            font-style: italic;
            font-family: 'Orbitron', sans-serif;
        }

        h1 span {
            color: var(--primary);
            text-shadow: none;
        }

        .header-subtitle {
            font-size: 10px;
            color: var(--primary-light);
            letter-spacing: 3px;
            font-family: 'Amiri', serif;
        }

        .header-stats {
            display: flex;
            gap: 25px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 10px;
        }

        .stat-item {
            text-align: center;
            padding: 4px 12px;
            border: 1px solid var(--dim-red);
            background: rgba(20, 0, 0, 0.8);
        }

        .stat-value {
            font-size: 22px;
            color: var(--primary);
            text-shadow: 0 0 10px var(--primary);
            font-weight: bold;
        }

        .stat-label {
            color: var(--text-dim);
            letter-spacing: 2px;
            font-size: 8px;
        }

        .live-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            background: var(--primary);
            color: #000;
            padding: 6px 15px;
            font-weight: bold;
            font-size: 12px;
            letter-spacing: 2px;
            animation: live-pulse 1s infinite;
        }

        .live-dot {
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            animation: live-dot-pulse 1s infinite;
        }

        @keyframes live-pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.8;
            }
        }

        @keyframes live-dot-pulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.2);
            }
        }

        .sidebar-left {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: calc(100% - 126px);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .panel {
            background: var(--bg-panel);
            border: 1px solid var(--dark-red);
            position: relative;
            backdrop-filter: blur(4px);
            box-shadow: inset 0 0 30px rgba(0, 0, 0, 1);
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
        }

        .panel:hover {
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.2), inset 0 0 30px rgba(0, 0, 0, 1);
        }

        .panel-header {
            background: linear-gradient(90deg, var(--dark-red), var(--dim-red));
            color: var(--primary);
            font-family: 'Share Tech Mono', monospace;
            font-size: 10px;
            padding: 8px 12px;
            border-bottom: 1px solid var(--primary);
            letter-spacing: 2px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }

        .panel-content {
            padding: 8px;
            overflow-y: auto;
            flex: 1;
        }

        .country-list {
            flex: 1;
            min-height: 0;
        }

        .country-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            margin-bottom: 4px;
            background: rgba(30, 0, 0, 0.5);
            border-right: 3px solid var(--dim-red);
            cursor: pointer;
            transition: all 0.2s;
        }

        .country-item:hover {
            background: rgba(60, 0, 0, 0.5);
            border-right-color: var(--primary);
            transform: translateX(3px);
        }

        .country-item.selected {
            background: rgba(100, 0, 0, 0.5);
            border-right-color: var(--primary);
        }

        .country-name {
            flex: 1;
            font-size: 12px;
            color: var(--text-main);
        }

        .country-count {
            background: var(--primary);
            color: #000;
            padding: 2px 8px;
            font-size: 10px;
            font-family: 'Share Tech Mono', monospace;
            font-weight: bold;
        }

        .main-view {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: calc(100% - 126px);
        }

        .earth-container {
            flex: 1;
            position: relative;
            border: 2px solid var(--primary);
            background: #000;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
            touch-action: none;
        }

        #earth-canvas {
            width: 100%;
            height: 100%;
            display: block;
        }

        .earth-mode-toggle {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 30;
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid var(--primary) !important;
            color: var(--primary) !important;
            font-size: 9px !important;
            padding: 4px 12px !important;
            letter-spacing: 2px;
            font-family: 'Share Tech Mono', monospace;
            cursor: pointer;
            clip-path: none !important;
            flex: none !important;
        }

        .earth-mode-toggle:hover {
            background: var(--primary) !important;
            color: #000 !important;
        }

        .hud-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        }

        .hud-corner {
            position: absolute;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(255, 0, 0, 0.4);
        }

        .hud-corner.top-left {
            top: 10px;
            left: 10px;
            border-right: none;
            border-bottom: none;
        }

        .hud-corner.top-right {
            top: 10px;
            right: 10px;
            border-left: none;
            border-bottom: none;
        }

        .hud-corner.bottom-left {
            bottom: 40px;
            left: 10px;
            border-right: none;
            border-top: none;
        }

        .hud-corner.bottom-right {
            bottom: 40px;
            right: 10px;
            border-left: none;
            border-top: none;
        }

        .hud-crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            opacity: 0.3;
        }

        .hud-crosshair::before,
        .hud-crosshair::after {
            content: "";
            position: absolute;
            background: var(--primary);
        }

        .hud-crosshair::before {
            width: 2px;
            height: 100%;
            left: 50%;
            transform: translateX(-50%);
        }

        .hud-crosshair::after {
            width: 100%;
            height: 2px;
            top: 50%;
            transform: translateY(-50%);
        }

        .hud-data {
            position: absolute;
            top: 50px;
            right: 15px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 9px;
            color: rgba(255, 0, 0, 0.6);
            text-align: right;
            line-height: 1.6;
        }

        .earth-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }

        .earth-info {
            position: absolute;
            top: 15px;
            left: 15px;
            font-family: 'Share Tech Mono', monospace;
        }

        .earth-info .label {
            font-size: 9px;
            color: var(--text-dim);
            letter-spacing: 2px;
        }

        .earth-info .value {
            font-size: 26px;
            color: var(--primary);
            text-shadow: 0 0 15px var(--primary);
            font-weight: bold;
        }

        .rotation-indicator {
            position: absolute;
            bottom: 40px;
            left: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .rotation-speed {
            font-family: 'Share Tech Mono', monospace;
            font-size: 10px;
            color: var(--primary);
        }

        .speed-bar {
            width: 100px;
            height: 4px;
            background: var(--dark-red);
            border-radius: 2px;
            overflow: hidden;
        }

        .speed-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--primary-light));
            width: 20%;
            transition: width 0.3s;
        }

        .coords-display {
            position: absolute;
            bottom: 40px;
            right: 15px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 10px;
            color: var(--text-dim);
            text-align: right;
        }

        .coords-display .lat,
        .coords-display .lon {
            color: var(--primary);
        }

        /* Target Indicator */
        .target-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 20;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .target-indicator.active {
            opacity: 1;
        }

        .target-outer {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid var(--primary);
            border-radius: 50%;
            animation: target-pulse 1s ease-out infinite;
        }

        .target-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border: 2px solid var(--primary);
            border-radius: 50%;
        }

        .target-cross {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .target-cross::before,
        .target-cross::after {
            content: "";
            position: absolute;
            background: var(--primary);
        }

        .target-cross::before {
            width: 2px;
            height: 200px;
            left: -1px;
            top: -100px;
        }

        .target-cross::after {
            width: 200px;
            height: 2px;
            left: -100px;
            top: -1px;
        }

        .target-corners {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .target-corner {
            position: absolute;
            width: 30px;
            height: 30px;
            border: 3px solid var(--primary);
        }

        .target-corner.tl {
            top: 0;
            left: 0;
            border-right: none;
            border-bottom: none;
        }

        .target-corner.tr {
            top: 0;
            right: 0;
            border-left: none;
            border-bottom: none;
        }

        .target-corner.bl {
            bottom: 0;
            left: 0;
            border-right: none;
            border-top: none;
        }

        .target-corner.br {
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: none;
        }

        .target-coords {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Share Tech Mono', monospace;
            font-size: 10px;
            color: var(--primary);
            background: rgba(0, 0, 0, 0.8);
            padding: 4px 10px;
            border: 1px solid var(--dim-red);
        }

        @keyframes target-pulse {
            0% {
                transform: scale(0.8);
                opacity: 1;
            }

            100% {
                transform: scale(1.2);
                opacity: 0;
            }
        }

        .target-label {
            position: absolute;
            top: 50%;
            left: calc(50% + 120px);
            transform: translateY(-50%);
            background: var(--primary);
            color: #000;
            padding: 5px 15px;
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 2px;
            white-space: nowrap;
        }

        .target-label::before {
            content: "";
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            border: 8px solid transparent;
            border-right-color: var(--primary);
        }

        /* Country Image Popup */
        .country-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 2000;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .country-popup.active {
            display: flex;
        }

        .country-popup-content {
            background: var(--bg-panel);
            border: 3px solid var(--primary);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            box-shadow: 0 0 60px rgba(255, 0, 0, 0.5);
            animation: popup-appear 0.4s ease;
        }

        @keyframes popup-appear {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .country-popup-header {
            background: linear-gradient(90deg, var(--primary), var(--dark-red));
            color: #000;
            padding: 15px 20px;
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .country-popup-close {
            background: transparent;
            border: 2px solid #000;
            color: #000;
            width: 30px;
            height: 30px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            clip-path: none;
        }

        .country-popup-close:hover {
            background: #000;
            color: var(--primary);
        }

        .country-popup-image {
            width: 100%;
            height: 200px;
            object-fit: contain;
            object-position: center;
            background: var(--dark-red);
            border-bottom: 2px solid var(--primary);
            padding: 20px;
        }

        .country-popup-info {
            padding: 20px;
            font-family: 'Share Tech Mono', monospace;
        }

        .country-popup-info h3 {
            color: var(--primary);
            font-size: 14px;
            margin: 0 0 10px 0;
            letter-spacing: 2px;
        }

        .country-popup-info p {
            color: var(--text-main);
            font-size: 13px;
            line-height: 1.6;
            margin: 5px 0;
        }

        .country-popup-info .coord {
            color: var(--primary);
        }

        .breaking-alert {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.98);
            border: 3px solid var(--primary);
            padding: 0;
            width: 90%;
            max-width: 700px;
            z-index: 100;
            display: none;
            animation: alert-appear 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 0 80px var(--primary), 0 0 150px rgba(255, 0, 0, 0.5);
        }

        .breaking-alert.visible {
            display: block;
        }

        @keyframes alert-appear {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3) rotate(-5deg);
            }

            50% {
                transform: translate(-50%, -50%) scale(1.05) rotate(1deg);
            }

            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
        }

        .breaking-banner {
            background: linear-gradient(90deg, var(--primary), var(--primary-dark), var(--primary));
            color: #000;
            padding: 12px 20px;
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            animation: banner-flash 0.3s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            letter-spacing: 4px;
        }

        @keyframes banner-flash {

            0%,
            100% {
                background: linear-gradient(90deg, var(--primary), var(--primary-dark), var(--primary));
            }

            50% {
                background: linear-gradient(90deg, var(--primary-light), var(--primary), var(--primary-light));
            }
        }

        .breaking-content {
            display: flex;
            gap: 20px;
            padding: 20px;
        }

        .breaking-image {
            width: 200px;
            height: 120px;
            background: var(--dark-red);
            flex-shrink: 0;
            overflow: hidden;
            border: 2px solid var(--primary);
        }

        .breaking-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .breaking-text {
            flex: 1;
        }

        .breaking-title {
            font-size: 20px;
            color: #fff;
            line-height: 1.3;
            margin-bottom: 12px;
            text-shadow: 0 0 15px var(--primary);
            font-weight: bold;
        }

        .breaking-summary {
            font-size: 13px;
            color: var(--text-main);
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .breaking-meta {
            display: flex;
            gap: 20px;
            font-size: 11px;
            color: var(--text-dim);
            font-family: 'Share Tech Mono', monospace;
        }

        .breaking-country {
            color: var(--primary);
            font-weight: bold;
        }

        .breaking-close {
            position: absolute;
            top: 50px;
            right: 12px;
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
            width: 30px;
            height: 30px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .breaking-close:hover {
            background: var(--primary);
            color: #000;
        }

        .breaking-timer {
            height: 3px;
            background: var(--dark-red);
        }

        .breaking-timer-fill {
            height: 100%;
            background: var(--primary);
            width: 100%;
            animation: timer-countdown 20s linear;
        }

        @keyframes timer-countdown {
            from {
                width: 100%;
            }

            to {
                width: 0%;
            }
        }

        .sidebar-right {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: calc(100% - 126px);
            overflow: hidden;
        }

        .news-feed {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        /* ===== BIG IMAGE NEWS CARDS ===== */
        .news-card {
            background: rgba(20, 0, 0, 0.6);
            border: 1px solid var(--dark-red);
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.3s;
            overflow: hidden;
            position: relative;
        }

        .news-card:hover {
            border-color: var(--primary);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            transform: translateY(-2px);
        }

        .news-card.breaking-card {
            border-color: var(--primary);
            animation: news-flash 1s infinite;
        }

        @keyframes news-flash {

            0%,
            100% {
                background: rgba(50, 0, 0, 0.6);
            }

            50% {
                background: rgba(80, 0, 0, 0.6);
            }
        }

        .news-card-image {
            width: 100%;
            height: 160px;
            object-fit: cover;
            display: block;
            border-bottom: 2px solid var(--dim-red);
            background: #0a0000;
        }

        .news-card-image.no-image {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', sans-serif;
            font-size: 40px;
            color: var(--dim-red);
            background: linear-gradient(135deg, #0a0000 0%, #1a0000 100%);
        }

        .news-card-body {
            padding: 10px;
        }

        .news-card-priority {
            font-size: 9px;
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 2px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .news-card-priority.breaking {
            color: var(--primary);
            animation: priority-flash 0.5s infinite;
        }

        .news-card-priority.breaking::before {
            content: "[!]";
            animation: blink 0.5s infinite;
        }

        @keyframes blink {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0;
            }
        }

        @keyframes priority-flash {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.6;
            }
        }

        .news-card-priority.high {
            color: var(--primary-light);
        }

        .news-card-priority.normal {
            color: var(--text-dim);
        }

        .news-card-title {
            font-size: 14px;
            color: #fff;
            line-height: 1.4;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .news-card-meta {
            display: flex;
            gap: 12px;
            font-size: 9px;
            color: var(--text-dim);
            font-family: 'Share Tech Mono', monospace;
            flex-wrap: wrap;
        }

        .news-card-source {
            color: var(--primary);
            font-weight: bold;
        }

        .news-card-country {
            color: var(--primary-light);
        }

        /* Legacy news items (kept for old mode) */
        .news-item {
            background: rgba(20, 0, 0, 0.6);
            border-right: 3px solid var(--dim-red);
            padding: 10px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.3s;
            border-left: 1px solid var(--dark-red);
            display: none;
        }

        .news-item:hover {
            background: rgba(40, 0, 0, 0.6);
            border-right-color: var(--primary);
            transform: translateX(3px);
        }

        .news-item.breaking {
            border-right-color: var(--primary);
            border-left: 2px solid var(--primary);
            animation: news-flash 1s infinite;
        }

        .news-priority {
            font-size: 9px;
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 2px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .news-priority.breaking {
            color: var(--primary);
            animation: priority-flash 0.5s infinite;
        }

        .news-priority.breaking::before {
            content: "[!]";
            animation: blink 0.5s infinite;
        }

        .news-priority.high {
            color: var(--primary-light);
        }

        .news-priority.normal {
            color: var(--text-dim);
        }

        .news-title {
            font-size: 13px;
            color: #fff;
            line-height: 1.4;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .news-meta {
            display: flex;
            gap: 12px;
            font-size: 9px;
            color: var(--text-dim);
            font-family: 'Share Tech Mono', monospace;
        }

        .news-country {
            color: var(--primary);
        }

        .news-source {
            color: var(--primary-light);
        }

        /* ===== URGENT BAR ===== */
        .urgent-bar {
            grid-column: 1 / -1;
            background: #000;
            border: 2px solid var(--primary);
            display: none;
            align-items: center;
            overflow: hidden;
            position: relative;
            min-height: 44px;
            box-shadow: 0 0 30px #ff0000, 0 0 60px rgba(255, 0, 0, 0.5), 0 0 100px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 0, 0, 0.1);
            animation: urgent-neon 1.5s ease-in-out infinite;
        }

        .urgent-bar.active {
            display: flex;
        }

        @keyframes urgent-neon {

            0%,
            100% {
                box-shadow: 0 0 30px #ff0000, 0 0 60px rgba(255, 0, 0, 0.5), 0 0 100px rgba(255, 0, 0, 0.3);
                border-color: #ff0000;
            }

            50% {
                box-shadow: 0 0 50px #ff0000, 0 0 90px rgba(255, 0, 0, 0.7), 0 0 140px rgba(255, 0, 0, 0.5);
                border-color: #ff3333;
            }
        }

        .urgent-label {
            background: var(--primary);
            color: #000;
            padding: 0 15px;
            height: 100%;
            display: flex;
            align-items: center;
            font-weight: 900;
            font-size: 13px;
            letter-spacing: 3px;
            font-family: 'Orbitron', sans-serif;
            animation: urgent-label-flash 0.5s infinite;
            white-space: nowrap;
            min-height: 44px;
        }

        @keyframes urgent-label-flash {

            0%,
            100% {
                background: #ff0000;
            }

            50% {
                background: #cc0000;
            }
        }

        .urgent-content {
            flex: 1;
            overflow: hidden;
            position: relative;
            height: 100%;
        }

        .urgent-scroll {
            display: flex;
            align-items: center;
            height: 100%;
            animation: urgent-ticker-scroll 30s linear infinite;
            white-space: nowrap;
        }

        @keyframes urgent-ticker-scroll {
            0% {
                transform: translateX(0);
            }

            100% {
                transform: translateX(-50%);
            }
        }

        .urgent-text {
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            padding: 0 40px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }

        .urgent-text::before {
            content: "⚠";
            color: var(--primary);
            font-size: 16px;
        }

        .urgent-text .urgent-separator {
            color: var(--primary);
            margin: 0 10px;
        }

        /* ===== LIVE TV PANEL ===== */
        .live-tv-panel {
            flex-shrink: 0;
        }

        .tv-tabs {
            display: flex;
            gap: 2px;
            padding: 4px;
            flex-wrap: wrap;
        }

        .tv-tab {
            flex: 1;
            background: transparent;
            border: 1px solid var(--dim-red);
            color: var(--text-dim);
            font-size: 8px;
            padding: 4px 2px;
            cursor: pointer;
            text-align: center;
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 1px;
            transition: all 0.2s;
            clip-path: none;
            min-width: 60px;
        }

        .tv-tab:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .tv-tab.active {
            background: var(--primary);
            color: #000;
            border-color: var(--primary);
        }

        .tv-frame-container {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: #000;
        }

        .tv-frame-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }

        .tv-offline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--dim-red);
            font-family: 'Share Tech Mono', monospace;
            font-size: 11px;
            background: #050000;
        }

        .tv-offline .tv-static {
            width: 40px;
            height: 40px;
            margin-bottom: 8px;
            background: repeating-linear-gradient(0deg, #111 0px, #111 2px, #000 2px, #000 4px);
            animation: tv-static 0.1s steps(3) infinite;
        }

        @keyframes tv-static {
            0% {
                opacity: 0.8;
            }

            50% {
                opacity: 1;
            }

            100% {
                opacity: 0.6;
            }
        }

        /* ===== NEWS TICKER ===== */
        .news-ticker {
            grid-column: 1 / -1;
            background: var(--dark-red);
            border: 1px solid var(--primary);
            overflow: hidden;
            display: flex;
            align-items: center;
        }

        .ticker-label {
            background: var(--primary);
            color: #000;
            padding: 0 15px;
            height: 100%;
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 11px;
            letter-spacing: 2px;
            animation: ticker-label-pulse 2s infinite;
        }

        @keyframes ticker-label-pulse {

            0%,
            100% {
                background: var(--primary);
            }

            50% {
                background: var(--primary-light);
            }
        }

        .ticker-content {
            flex: 1;
            overflow: hidden;
            position: relative;
            height: 100%;
        }

        .ticker-scroll {
            display: flex;
            align-items: center;
            height: 100%;
            animation: ticker-scroll 60s linear infinite;
            white-space: nowrap;
        }

        .ticker-scroll:hover {
            animation-play-state: paused;
        }

        @keyframes ticker-scroll {
            0% {
                transform: translateX(0);
            }

            100% {
                transform: translateX(-50%);
            }
        }

        .ticker-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0 30px;
            color: #fff;
            font-size: 12px;
        }

        .ticker-item .separator {
            color: var(--primary);
            font-weight: bold;
        }

        .ticker-item.breaking {
            color: var(--primary);
        }

        .ticker-item.breaking::before {
            content: "[!]";
        }

        .controls {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 8px;
        }

        .control-row {
            display: flex;
            gap: 4px;
        }

        button {
            flex: 1;
            background: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
            font-family: 'Rajdhani', sans-serif;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: 0.2s;
            clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
            padding: 8px 4px;
        }

        button:hover {
            background: var(--primary);
            color: #000;
            box-shadow: 0 0 20px var(--primary);
        }

        button.active {
            background: var(--primary);
            color: #000;
        }

        button.secondary {
            border-color: #444;
            color: #444;
        }

        button.secondary:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: transparent;
        }

        /* Language switcher */
        .lang-switcher {
            display: flex;
            gap: 2px;
            padding: 4px 8px;
        }

        .lang-btn {
            flex: none;
            background: transparent;
            border: 1px solid var(--dim-red);
            color: var(--text-dim);
            font-size: 9px;
            padding: 3px 6px;
            cursor: pointer;
            font-family: 'Share Tech Mono', monospace;
            clip-path: none;
        }

        .lang-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: transparent;
        }

        .lang-btn.active {
            background: var(--primary);
            color: #000;
            border-color: var(--primary);
        }

        /* Mobile & Overlay Styles */
        .how-to-use-overlay,
        .settings-overlay,
        .connection-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 2000;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .how-to-use-overlay.visible,
        .settings-overlay.visible,
        .connection-overlay.visible {
            display: flex;
        }

        .how-to-use-panel,
        .settings-panel,
        .connection-panel {
            background: var(--bg-panel);
            border: 2px solid var(--primary);
            padding: 0;
            width: 95%;
            max-width: 650px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 0 60px rgba(255, 0, 0, 0.4);
        }

        .how-to-use-header,
        .settings-panel h2 {
            background: linear-gradient(90deg, var(--primary), var(--dark-red));
            color: #000;
            padding: 15px 20px;
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 3px;
        }

        .how-to-use-content {
            padding: 20px;
        }

        .how-to-use-content h3 {
            color: var(--primary);
            font-size: 14px;
            margin: 15px 0 8px 0;
            letter-spacing: 2px;
            border-bottom: 1px solid var(--dim-red);
            padding-bottom: 6px;
        }

        .how-to-use-content h3:first-child {
            margin-top: 0;
        }

        .how-to-use-content p,
        .how-to-use-content li {
            color: var(--text-main);
            font-size: 13px;
            line-height: 1.7;
            margin-bottom: 8px;
        }

        .how-to-use-content ul {
            padding-left: 0;
            list-style: none;
        }

        .how-to-use-content li {
            margin-bottom: 6px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }

        .how-to-use-content li .step-number {
            background: var(--primary);
            color: #000;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            flex-shrink: 0;
        }

        .how-to-use-content pre {
            background: #0a0000;
            border: 1px solid var(--dim-red);
            padding: 12px;
            overflow-x: auto;
            font-family: 'Share Tech Mono', monospace;
            font-size: 11px;
            color: var(--text-main);
            line-height: 1.5;
        }

        .instruction-content strong {
            color: #fff;
            display: block;
            margin-bottom: 4px;
        }

        .instruction-content p {
            margin: 0;
            color: var(--text-dim);
        }

        .cmd-box {
            display: flex;
            gap: 10px;
            margin-top: 8px;
            align-items: center;
        }

        .cmd-box code {
            flex: 1;
            background: #110000;
            border: 1px solid #330000;
            padding: 8px 12px;
            color: #ff6666;
            font-family: 'Share Tech Mono', monospace;
            font-size: 11px;
            display: block;
        }

        .download-section {
            background: var(--dark-red);
            border: 2px solid var(--primary);
            padding: 15px;
            margin-top: 15px;
            text-align: center;
        }

        .download-section h4 {
            color: #fff;
            margin: 0 0 12px 0;
            font-size: 12px;
            letter-spacing: 2px;
        }

        .download-btn {
            display: inline-block;
            background: var(--primary);
            color: #000;
            padding: 12px 30px;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            margin: 4px;
            text-decoration: none;
            text-transform: uppercase;
        }

        .download-btn:hover {
            background: var(--primary-light);
            box-shadow: 0 0 25px var(--primary);
            transform: scale(1.05);
        }

        .download-btn.secondary {
            background: #333;
            color: #fff;
            border: 1px solid #555;
        }

        .download-btn.secondary:hover {
            background: #555;
            box-shadow: none;
            transform: none;
        }

        .close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: transparent;
            border: 2px solid #000;
            color: #000;
            width: 30px;
            height: 30px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            clip-path: none;
            flex: none;
        }

        .close-btn:hover {
            background: #000;
            color: var(--primary);
        }

        .settings-panel {
            padding: 25px;
        }

        .settings-panel h2 span {
            color: var(--primary);
        }

        .setting-group {
            margin-bottom: 15px;
        }

        .setting-label {
            font-size: 11px;
            color: var(--text-dim);
            margin-bottom: 6px;
            display: block;
            letter-spacing: 1px;
        }

        select,
        input {
            background: var(--bg-solid);
            border: 1px solid var(--dim-red);
            color: var(--text-main);
            padding: 8px;
            font-family: 'Rajdhani', sans-serif;
            font-size: 13px;
            width: 100%;
        }

        select:focus,
        input:focus {
            border-color: var(--primary);
        }

        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 500;
        }

        .loading-overlay.hidden {
            display: none;
        }

        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid var(--dark-red);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .loading-text {
            margin-top: 20px;
            font-family: 'Share Tech Mono', monospace;
            color: var(--primary);
            letter-spacing: 2px;
            font-size: 12px;
        }

        .country-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .country-tag {
            background: var(--dark-red);
            border: 1px solid var(--primary);
            color: var(--text-main);
            padding: 4px 8px;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .country-tag .remove {
            cursor: pointer;
            color: var(--primary);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
            width: 40px;
            height: 40px;
            font-size: 20px;
            padding: 0;
            clip-path: none;
            flex: none;
        }

        /* Connection Panel Specific */
        .connection-panel h2 {
            margin: 0;
            padding: 15px 20px;
            background: linear-gradient(90deg, var(--primary), var(--dark-red));
            color: #000;
        }

        .connection-panel {
            padding: 0;
            text-align: center;
        }

        .connection-panel .inner {
            padding: 30px;
        }

        .connection-panel p {
            color: #aaa;
            font-size: 13px;
            margin-bottom: 20px;
            font-family: 'Share Tech Mono', monospace;
        }

        .connection-panel input {
            width: 100%;
            background: #000;
            border: 1px solid var(--primary);
            color: #fff;
            padding: 15px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 16px;
            margin-bottom: 20px;
            text-align: center;
        }

        .connection-panel input::placeholder {
            color: #550000;
        }

        /* News source status */
        .source-status {
            font-family: 'Share Tech Mono', monospace;
            font-size: 9px;
            color: var(--text-dim);
            padding: 4px 8px;
        }

        .source-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 4px;
        }

        .source-dot.online {
            background: var(--primary);
            box-shadow: 0 0 6px var(--primary);
        }

        .source-dot.offline {
            background: #333;
        }

        /* Mobile Specific Styles */
        @media (max-width: 900px) {
            .app-container {
                grid-template-columns: 1fr;
                grid-template-rows: 55px 1fr auto 35px;
                padding: 0;
                gap: 0;
            }

            .header {
                height: 55px;
                padding: 0 10px;
            }

            .logo-globe {
                width: 36px;
                height: 36px;
            }

            h1 {
                font-size: 16px;
                letter-spacing: 2px;
            }

            .header-subtitle {
                display: none;
            }

            .header-stats {
                display: none;
            }

            .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .sidebar-left {
                display: none;
            }

            .main-view {
                height: calc(100% - 90px);
            }

            .earth-container {
                border: none;
                border-top: 1px solid var(--primary);
                border-bottom: 1px solid var(--primary);
            }

            /* Sidebar becomes a slide-out panel on mobile */
            .sidebar-right {
                position: fixed;
                top: 0;
                right: 0;
                width: 85%;
                max-width: 320px;
                height: 100%;
                z-index: 1500;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                background: rgba(5, 0, 0, 0.98);
                box-shadow: -5px 0 20px rgba(0, 0, 0, 0.8);
                padding-top: 10px;
            }

            .sidebar-right.mobile-open {
                transform: translateX(0);
            }

            .news-ticker {
                height: 35px;
            }

            .ticker-label {
                padding: 0 10px;
                font-size: 10px;
            }

            .ticker-item {
                font-size: 10px;
                padding: 0 15px;
            }

            /* Adjust overlays for mobile */
            .breaking-content {
                flex-direction: column;
                padding: 10px;
            }

            .breaking-image {
                width: 100%;
                height: 150px;
            }

            .breaking-title {
                font-size: 16px;
            }

            .breaking-summary {
                font-size: 12px;
            }

            .country-popup-content {
                width: 95%;
                max-height: 80vh;
            }

            .country-popup-header {
                font-size: 14px;
                padding: 10px;
            }

            .country-popup-image {
                height: 150px;
            }

            /* HUD adjustments */
            .earth-info .value {
                font-size: 18px;
            }

            .rotation-indicator {
                display: none;
            }

            .hud-data {
                top: 15px;
                font-size: 8px;
            }

            .news-card-image {
                height: 120px;
            }

            .urgent-label {
                font-size: 10px;
                padding: 0 8px;
                letter-spacing: 1px;
            }
        }

        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }
        }

        /* Mobile Navigation Styles */
        @media (max-width: 900px) {
            .mobile-nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 2000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .mobile-nav-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .mobile-nav-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: #fff;
                font-size: 32px;
                cursor: pointer;
                z-index: 2001;
            }

            .mobile-nav-links {
                display: flex;
                flex-direction: column;
                gap: 25px;
                text-align: center;
            }

            .mobile-nav-links a {
                color: #fff;
                font-size: 24px;
                font-weight: 700;
                text-decoration: none;
                transition: color 0.2s ease;
                font-family: 'Orbitron', sans-serif;
            }

            .mobile-nav-links a:hover {
                color: var(--primary);
            }

            .mobile-nav-links a.active {
                color: var(--primary);
            }

            .mobile-nav-footer {
                margin-top: 40px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
            }

            .mobile-nav-footer .social__icons {
                display: flex;
                gap: 20px;
            }

            .mobile-nav-footer .social__icons a {
                font-size: 24px;
                color: #fff;
                transition: color 0.2s ease;
            }

            .mobile-nav-footer .social__icons a:hover {
                color: var(--primary);
            }

            .mobile-nav-footer .contact-info {
                color: #ccc;
                font-size: 14px;
                font-family: 'Share Tech Mono', monospace;
            }

            .mobile-nav-footer .contact-info a {
                color: #fff;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .mobile-nav-footer .contact-info a:hover {
                color: var(--primary);
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
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <link rel="icon" href="/assets/icon.png" type="image/png" />
    <title>GLOBAL NEYDRA NEWS | Earth News System</title>
    <meta name="description"
        content="Global Neydra News — Real-time 3D Earth news monitoring system with live TV streams, multi-source intelligence feed, and urgent alert system." />
    <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700;800&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Amiri:wght@400;700&display=swap"
        rel="stylesheet" />
    {/* Three.js */}
    {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script> */}

    




    <audio id="snd-engage" src="/assets/ambient.wav" preload="auto"></audio>
    <audio id="snd-alert" src="/assets/alert.wav" preload="auto"></audio>
    <audio id="snd-tick" src="/assets/tick.wav" preload="auto"></audio>
    <audio id="snd-target" src="/assets/tick.wav" preload="auto"></audio>
    <audio id="snd-urgent" src="../assets/urgent.wav" preload="auto"></audio>
    <audio id="snd-theme" src="../../assets/urgenttheme.mp3" preload="auto" loop></audio>

    <div className="app-container">
        <div className="header">
            <div className="logo-section">
                <div className="logo-globe"></div>
                <div className="header-title">
                    <h1>GLOBAL <span>NEYDRA</span> NEWS</h1>
                    <div className="header-subtitle">[ LIVE INTELLIGENCE FEED ]</div>
                </div>
            </div>
            <div className="header-stats">
                <div className="stat-item">
                    <div className="stat-value" id="stat-breaking">0</div>
                    <div className="stat-label">BREAKING</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value" id="stat-total">0</div>
                    <div className="stat-label">ARTICLES</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value" id="stat-countries">0</div>
                    <div className="stat-label">COUNTRIES</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value" id="stat-sources">0</div>
                    <div className="stat-label">SOURCES</div>
                </div>
            </div>
            <div className="live-badge">
                <div className="live-dot"></div>LIVE
            </div>
            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => { try { eval(`toggleMobileSidebar()`); } catch(e){} }}>☰</button>
        </div>

        <div className="sidebar-left">
            <div className="panel country-list" style={{ "flex": "0 0 auto", "maxHeight": "140px" }}>
                <div className="panel-header"><span>WATCHED REGIONS</span><span id="watched-count">0</span></div>
                <div className="panel-content" id="watched-countries">
                    <div style={{ "color": "var(--text-dim)", "textAlign": "center", "padding": "15px", "fontSize": "11px" }}>[ NO
                        REGIONS SELECTED ]</div>
                </div>
            </div>
            <div className="panel" style={{ "flex": "0 0 auto" }}>
                <div className="panel-header"><span>NEWS CATEGORIES</span></div>
                <div className="panel-content">
                    <div className="control-row" style={{ "flexWrap": "wrap", "gap": "4px" }}>
                        <button id="cat-world" className="active" onClick={() => { try { eval(`toggleCategory('world')`); } catch(e){} }}>WORLD</button>
                        <button id="cat-tech" onClick={() => { try { eval(`toggleCategory('technology')`); } catch(e){} }}>TECH</button>
                        <button id="cat-business" onClick={() => { try { eval(`toggleCategory('business')`); } catch(e){} }}>BIZ</button>
                        <button id="cat-science" onClick={() => { try { eval(`toggleCategory('science')`); } catch(e){} }}>SCI</button>
                        <button id="cat-health" onClick={() => { try { eval(`toggleCategory('health')`); } catch(e){} }}>HEALTH</button>
                        <button id="cat-politics" onClick={() => { try { eval(`toggleCategory('politics')`); } catch(e){} }}>POL</button>
                        <button id="cat-sports" onClick={() => { try { eval(`toggleCategory('sports')`); } catch(e){} }}>SPORT</button>
                    </div>
                </div>
            </div>
            {/* LIVE TV PANEL */}
            <div className="panel live-tv-panel" style={{ "flex": "1", "minHeight": "0" }}>
                <div className="panel-header"><span>📡 LIVE TV</span><span id="tv-status">STREAMING</span></div>
                <div className="tv-tabs" id="tv-tabs">
                    <div className="tv-tab active" onClick={() => { try { eval(`switchTV(0)`); } catch(e){} }}>AJ EN</div>
                    <div className="tv-tab" onClick={() => { try { eval(`switchTV(1)`); } catch(e){} }}>FR24 EN</div>
                    <div className="tv-tab" onClick={() => { try { eval(`switchTV(2)`); } catch(e){} }}>DW</div>
                    <div className="tv-tab" onClick={() => { try { eval(`switchTV(3)`); } catch(e){} }}>AJ AR</div>
                </div>
                <div className="tv-frame-container" id="tv-container">
                    <iframe id="tv-frame"
                        src="https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1&playsinline=1"
                        allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>
                </div>
            </div>
            {/* SYSTEM CONTROLS */}
            <div className="panel" style={{ "flex": "0 0 auto" }}>
                <div className="panel-header">SYSTEM CONTROLS</div>
                <div className="controls">
                    <div className="control-row"><button onClick={() => { try { eval(`refreshNews()`); } catch(e){} }}>⟳ REFRESH</button><button className="secondary"
                            onClick={() => { try { eval(`showSettings()`); } catch(e){} }}>⚙ SETTINGS</button></div>
                    <div className="control-row"><button id="btn-breaking" onClick={() => { try { eval(`toggleBreakingOnly()`); } catch(e){} }}>BREAKING
                            ONLY</button></div>
                    <div className="control-row"><button onClick={() => { try { eval(`showHowToUse()`); } catch(e){} }}>? HOW TO USE</button><button
                            className="secondary" onClick={() => { try { eval(`showLegacyConnect()`); } catch(e){} }}>LEGACY MODE</button></div>
                </div>
                <div className="source-status" id="source-status">
                    <span className="source-dot online"></span> GDELT
                    <span className="source-dot online"></span> RSS
                    <span className="source-dot online"></span> AUTO-REFRESH: 60s
                </div>
            </div>
        </div>

        <div className="main-view">
            <div className="earth-container panel">
                {/* Three.js Globe Canvas */}
                <canvas id="earth-canvas"></canvas>

                <div className="hud-overlay">
                    <div className="hud-corner top-left"></div>
                    <div className="hud-corner top-right"></div>
                    <div className="hud-corner bottom-left"></div>
                    <div className="hud-corner bottom-right"></div>
                    <div className="hud-crosshair"></div>
                    <div className="hud-data" id="hud-data">SAT: NEYDRA-1<br />RES: 15m<br />MODE: THERMAL-IR<br />SEC: CLASSIFIED
                    </div>
                </div>

                <div className="earth-overlay">
                    <div className="earth-info">
                        <div className="label">CURRENT FOCUS</div>
                        <div className="value" id="current-country">GLOBAL</div>
                    </div>
                    <div className="rotation-indicator">
                        <div className="rotation-speed">ZOOM: <span id="rotation-speed">1x</span></div>
                        <div className="speed-bar">
                            <div className="speed-fill" id="speed-fill"></div>
                        </div>
                    </div>
                    <div className="coords-display">
                        <div>LAT: <span className="lat" id="coord-lat">0.00</span></div>
                        <div>LON: <span className="lon" id="coord-lon">0.00</span></div>
                    </div>
                </div>

                {/* Earth Mode Toggle */}
                <button className="earth-mode-toggle" id="earth-mode-btn" onClick={() => { try { eval(`toggleEarthMode()`); } catch(e){} }}>⬡ WIREFRAME
                    MODE</button>

                {/* Target Indicator */}
                <div className="target-indicator" id="target-indicator">
                    <div className="target-outer"></div>
                    <div className="target-inner"></div>
                    <div className="target-cross"></div>
                    <div className="target-corners">
                        <div className="target-corner tl"></div>
                        <div className="target-corner tr"></div>
                        <div className="target-corner bl"></div>
                        <div className="target-corner br"></div>
                    </div>
                    <div className="target-coords" id="target-coords">LAT: 0.00 | LON: 0.00</div>
                    <div className="target-label" id="target-label">TARGET LOCKED</div>
                </div>

                <div className="breaking-alert" id="breaking-alert">
                    <div className="breaking-banner">[ BREAKING NEWS ]</div>
                    <button className="breaking-close" onClick={() => { try { eval(`closeAlert()`); } catch(e){} }}>X</button>
                    <div className="breaking-content">
                        <div className="breaking-image"><img id="alert-image" src="" alt="News Image"
                                onError="this.style.display='none'" /></div>
                        <div className="breaking-text">
                            <div className="breaking-title" id="alert-title">Loading...</div>
                            <div className="breaking-summary" id="alert-summary">Please wait...</div>
                            <div className="breaking-meta">
                                <span className="breaking-country" id="alert-country">[ Country ]</span>
                                <span id="alert-source">[ Source ]</span>
                                <span id="alert-time">[ Time ]</span>
                            </div>
                        </div>
                    </div>
                    <div className="breaking-timer">
                        <div className="breaking-timer-fill" id="alert-timer"></div>
                    </div>
                </div>

                <div className="loading-overlay" id="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">INITIALIZING NEYDRA EARTH PROJECTION...</div>
                </div>
            </div>
        </div>

        <div className="sidebar-right" id="sidebar-right">
            <div className="panel news-feed">
                <div className="panel-header">
                    <span>LIVE NEWS FEED</span>
                    <span id="news-count">0</span>
                    {/* Close button for mobile sidebar */}
                    <button className="close-btn"
                        style={{ "display": "none", "position": "absolute", "right": "5px", "top": "5px", "width": "25px", "height": "25px", "borderColor": "var(--primary)", "color": "var(--primary)" }}
                        onClick={() => { try { eval(`toggleMobileSidebar()`); } catch(e){} }}>X</button>
                </div>
                {/* Language switcher */}
                <div className="lang-switcher">
                    <button className="lang-btn active" onClick={() => { try { eval(`switchLang('en')`); } catch(e){} }}>EN</button>
                    <button className="lang-btn" onClick={() => { try { eval(`switchLang('fr')`); } catch(e){} }}>FR</button>
                    <button className="lang-btn" onClick={() => { try { eval(`switchLang('ar')`); } catch(e){} }}>AR</button>
                    <button className="lang-btn" onClick={() => { try { eval(`switchLang('es')`); } catch(e){} }}>ES</button>
                    <button className="lang-btn" onClick={() => { try { eval(`switchLang('de')`); } catch(e){} }}>DE</button>
                </div>
                <div className="panel-content" id="news-feed">
                    <div style={{ "color": "var(--text-dim)", "textAlign": "center", "padding": "15px", "fontSize": "11px" }}>[
                        CONNECTING TO NEWS NETWORK... ]</div>
                </div>
            </div>
        </div>

        {/* URGENT BAR */}
        <div className="urgent-bar" id="urgent-bar">
            <div className="urgent-label">⚠ URGENT</div>
            <div className="urgent-content">
                <div className="urgent-scroll" id="urgent-scroll"></div>
            </div>
        </div>

        <div className="news-ticker">
            <div className="ticker-label">[ LIVE ]</div>
            <div className="ticker-content">
                <div className="ticker-scroll" id="ticker-scroll"><span className="ticker-item">[ CONNECTING TO GLOBAL NEWS
                        NETWORK... ]</span></div>
            </div>
        </div>
    </div>

    {/* Country Image Popup */}
    <div className="country-popup" id="country-popup">
        <div className="country-popup-content">
            <div className="country-popup-header">
                <span id="popup-country-name">COUNTRY</span>
                <button className="country-popup-close" onClick={() => { try { eval(`closeCountryPopup()`); } catch(e){} }}>X</button>
            </div>
            <img className="country-popup-image" id="popup-country-image" src="" alt="Country Image" />
            <div className="country-popup-info">
                <h3>[ COORDINATES ]</h3>
                <p>LATITUDE: <span className="coord" id="popup-lat">0.00</span></p>
                <p>LONGITUDE: <span className="coord" id="popup-lon">0.00</span></p>
                <h3>[ REGION STATUS ]</h3>
                <p id="popup-status">SCANNING...</p>
            </div>
        </div>
    </div>

    {/* CONNECTION OVERLAY (Legacy - kept as optional) */}
    <div className="connection-overlay" id="connection-overlay">
        <div className="connection-panel">
            <h2>LEGACY MODE — CONNECT TO SERVER</h2>
            <button className="close-btn" onClick={() => { try { eval(`hideLegacyConnect()`); } catch(e){} }} style={{ "color": "#000", "borderColor": "#000" }}>X</button>
            <div className="inner">
                <p>This is the legacy backend connection mode. Enter your LocalTunnel URL to connect to the old backend
                    engine.</p>
                <input type="text" id="url-input" placeholder="https://your-url.loca.lt" />
                <button onClick={() => { try { eval(`initializeConnection()`); } catch(e){} }} style={{ "width": "100%", "padding": "15px" }}>CONNECT</button>
                <p style={{ "marginTop": "15px", "fontSize": "11px", "color": "#666" }}>
                    Run <span style={{ "color": "var(--primary)" }}>npx localtunnel --port 8000</span> in your terminal to
                    generate a URL.
                </p>
                <button onClick={() => { try { eval(`hideLegacyConnect()`); } catch(e){} }} style={{ "width": "100%", "marginTop": "10px", "padding": "10px" }}
                    className="secondary">CLOSE — USE FREE SOURCES INSTEAD</button>
            </div>
        </div>
    </div>

    <div className="how-to-use-overlay" id="how-to-use-overlay">
        <div className="how-to-use-panel">
            <div className="how-to-use-header">[ HOW TO USE - GLOBAL NEYDRA NEWS ]</div>
            <button className="close-btn" onClick={() => { try { eval(`hideHowToUse()`); } catch(e){} }}>X</button>
            <div className="how-to-use-content">
                <h3>AUTOMATIC MODE (Default)</h3>
                <p>The news feed automatically fetches news from multiple free sources worldwide. No setup required!</p>
                <ul>
                    <li><span className="step-number">1</span>
                        <div className="instruction-content"><strong>Browse News</strong>
                            <p>Articles load automatically from GDELT, BBC, Reuters, Al Jazeera, and more.</p>
                        </div>
                    </li>
                    <li><span className="step-number">2</span>
                        <div className="instruction-content"><strong>Interact with the Globe</strong>
                            <p>Click and drag the 3D earth. Click news articles to fly to their location.</p>
                        </div>
                    </li>
                    <li><span className="step-number">3</span>
                        <div className="instruction-content"><strong>Watch Live TV</strong>
                            <p>Switch between Al Jazeera, France 24, and DW News live streams in the left panel.</p>
                        </div>
                    </li>
                    <li><span className="step-number">4</span>
                        <div className="instruction-content"><strong>Filter News</strong>
                            <p>Use category buttons (WORLD, TECH, BIZ, etc.) and language switcher (EN, FR, AR, ES, DE).
                            </p>
                        </div>
                    </li>
                    <li><span className="step-number">5</span>
                        <div className="instruction-content"><strong>Urgent Alerts</strong>
                            <p>Breaking news triggers the red URGENT bar at the bottom with an alert sound.</p>
                        </div>
                    </li>
                </ul>

                <h3>KEYBOARD SHORTCUTS</h3>
                <ul>
                    <li><span className="step-number">R</span>
                        <div className="instruction-content"><strong>Refresh</strong>
                            <p>Force refresh all news sources.</p>
                        </div>
                    </li>
                    <li><span className="step-number">F</span>
                        <div className="instruction-content"><strong>Fullscreen</strong>
                            <p>Toggle fullscreen mode for the earth view.</p>
                        </div>
                    </li>
                    <li><span className="step-number">M</span>
                        <div className="instruction-content"><strong>Mute</strong>
                            <p>Toggle alert sounds on/off.</p>
                        </div>
                    </li>
                    <li><span className="step-number">W</span>
                        <div className="instruction-content"><strong>Wireframe</strong>
                            <p>Toggle between textured and wireframe earth modes.</p>
                        </div>
                    </li>
                </ul>

                <h3>LEGACY BACKEND MODE (Optional)</h3>
                <ul>
                    <li>
                        <span className="step-number">!</span>
                        <div className="instruction-content">
                            <strong>Use Legacy Backend</strong>
                            <p>Click "LEGACY MODE" in controls to connect to the old backend server via LocalTunnel.</p>
                            <div style={{ "marginTop": "8px" }}>
                                <a href="/downloads/neydra-news-package.rar" className="download-btn secondary" download>
                                    ⬇ DOWNLOAD NEWS PACKAGE
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
                <div style={{ "textAlign": "center", "marginTop": "30px" }}>
                    <button onClick={() => { try { eval(`hideHowToUse()`); } catch(e){} }} style={{ "width": "auto", "padding": "15px 50px", "fontSize": "18px" }}>CONTINUE
                        TO DASHBOARD</button>
                </div>
            </div>
        </div>
    </div>

    <div className="settings-overlay" id="settings-overlay">
        <div className="settings-panel">
            <button className="close-btn" onClick={() => { try { eval(`hideSettings()`); } catch(e){} }}
                style={{ "color": "var(--primary)", "borderColor": "var(--primary)" }}>X</button>
            <h2>NEWS <span>SETTINGS</span></h2>
            <div className="setting-group"><label className="setting-label">Add Watched Country</label><select
                    id="add-country-select">
                    <option value="">-- Select Country --</option>
                </select></div>
            <div className="setting-group"><label className="setting-label">Currently Watching</label>
                <div className="country-tags" id="country-tags"></div>
            </div>
            <button onClick={() => { try { eval(`saveSettings()`); } catch(e){} }} style={{ "width": "100%", "marginTop": "8px" }}>SAVE SETTINGS</button>
        </div>
    </div>

    <Script src="/neydranews.js" strategy="lazyOnload" />



        </div>
    );
}
