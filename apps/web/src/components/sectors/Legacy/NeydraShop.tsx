'use client';
import React, { useEffect } from 'react';

export function NeydraShop() {
    return (
        <div className="neydra-legacy-container h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
    :root {
      --red-primary: #ff0000;
      --red-dark: #8f0000;
      --red-glow: rgba(255, 0, 0, 0.6);
      --bg-void: #000000;
      --bg-card: rgba(31, 0, 0, 0.9);
      --text-white: #ffffff;
      --text-gray: #aaaaaa;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    html {
      scrollbar-width: none;
      overflow-x: hidden;
      -ms-overflow-style: none;
    }

    body {
      scrollbar-width: none;
    }

    body {
      font-family: 'Rajdhani', sans-serif;
      background: var(--bg-void);
      color: var(--text-white);
      overflow-x: hidden;
      min-height: 100vh;
      position: relative;
    }

    /* === INTRO SCENE === */
    #intro-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: var(--bg-void);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      transition: opacity 1s ease-out;
    }

    #intro-overlay.blur-active {
      backdrop-filter: blur(20px);
    }

    #intro-overlay.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    #intro-overlay.hidden {
      display: none;
    }

    #intro-guide-container {
      position: absolute;
      bottom: 50px;
      right: 50px;
      display: flex;
      align-items: flex-end;
      gap: 30px;
      opacity: 0;
      transition: opacity 1s ease-in;
    }

    #intro-guide-container.visible {
      opacity: 1;
    }

    #intro-text-container {
      max-width: 400px;
      text-align: right;
    }

    #intro-text {
      font-family: 'Inter', sans-serif;
      font-size: 1.2rem;
      color: var(--text-white);
      line-height: 1.8;
      text-shadow: 0 0 10px var(--red-primary), 0 0 20px var(--red-glow);
    }

    #intro-cursor {
      display: inline-block;
      width: 3px;
      height: 1.2rem;
      background: var(--red-primary);
      margin-left: 2px;
      animation: blinkCursor 0.7s infinite;
      vertical-align: middle;
    }

    #intro-cursor.hidden {
      display: none;
    }

    @keyframes blinkCursor {

      0%,
      50% {
        opacity: 1;
      }

      51%,
      100% {
        opacity: 0;
      }
    }

    #intro-guide-img {
      max-height: 650px;
      max-width: 550px;
      transition: filter 0.3s ease;
    }

    /* === MAIN CONTENT WRAPPER === */
    #main-content {
      opacity: 0;
      transition: opacity 0.5s ease-in;
    }

    #main-content.visible {
      opacity: 1;
    }

    /* === POPUP OVERLAY === */
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .popup-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .popup-content {
      background: linear-gradient(180deg, rgba(30, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
      border: 2px solid var(--red-primary);
      padding: 30px;
      max-width: 90%;
      max-height: 90vh;
      text-align: center;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      box-shadow: 0 0 50px var(--red-glow);
    }

    .popup-overlay.active .popup-content {
      transform: scale(1);
    }

    .popup-content img {
      max-width: 100%;
      max-height: 300px;
      margin-bottom: 20px;
    }

    .popup-close-btn {
      background: linear-gradient(135deg, var(--red-dark), var(--red-primary));
      border: none;
      color: white;
      padding: 10px 30px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 20px;
    }

    .popup-close-btn:hover {
      box-shadow: 0 0 30px var(--red-glow);
      transform: scale(1.05);
    }

    /* === RANDOM NOTIFICATION POPUP === */
    .notification-popup {
      position: fixed;
      z-index: 99998;
      background: linear-gradient(135deg, rgba(30, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
      border: 2px solid var(--red-primary);
      padding: 15px 20px;
      max-width: 320px;
      box-shadow: 0 0 30px var(--red-glow);
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.5s ease;
    }

    .notification-popup.show {
      transform: translateX(0);
      opacity: 1;
    }

    .notification-popup.hide {
      transform: translateX(100%);
      opacity: 0;
    }

    .notification-popup.top-right {
      top: 100px;
      right: 20px;
    }

    .notification-popup.top-left {
      top: 100px;
      left: 20px;
    }

    .notification-popup.bottom-right {
      bottom: 100px;
      right: 20px;
    }

    .notification-popup.bottom-left {
      bottom: 100px;
      left: 20px;
    }

    .notification-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.8rem;
      color: var(--red-primary);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }

    .notification-text {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      color: var(--text-white);
      line-height: 1.5;
    }

    .notification-text span {
      color: var(--red-primary);
      font-weight: 700;
    }

    .notification-close {
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      color: var(--text-gray);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .notification-close:hover {
      color: var(--red-primary);
    }

    /* === DOWNLOAD SUCCESS POPUP === */
    .download-popup {
      position: fixed;
      z-index: 100001;
      background: linear-gradient(180deg, rgba(30, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
      border: 2px solid var(--red-primary);
      padding: 30px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 0 50px var(--red-glow);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .download-popup.active {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .download-icon {
      width: 60px;
      height: 60px;
      background: var(--red-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      animation: pulseIcon 1.5s infinite;
    }

    @keyframes pulseIcon {

      0%,
      100% {
        box-shadow: 0 0 20px var(--red-glow);
      }

      50% {
        box-shadow: 0 0 40px var(--red-primary);
      }
    }

    .download-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: var(--text-white);
      margin-bottom: 10px;
    }

    .download-text {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      color: var(--text-gray);
    }

    /* === ANIMATED BACKGROUND === */
    #galaxy-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    /* === TYPOGRAPHY === */
    .font-display {
      font-family: 'Orbitron', sans-serif;
    }

    .font-title {
      font-family: 'Bebas Neue', sans-serif;
    }

    /* === GLOW EFFECTS === */
    .glow-red {
      text-shadow: 0 0 10px var(--red-primary), 0 0 20px var(--red-primary), 0 0 40px var(--red-glow);
    }

    /* === HEADER === */
    .main-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.85) 100%);
      backdrop-filter: blur(20px);
      border-bottom: 2px solid var(--red-primary);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--red-primary), var(--red-dark));
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulseLogo 2s infinite;
    }

    @keyframes pulseLogo {

      0%,
      100% {
        box-shadow: 0 0 20px var(--red-glow);
      }

      50% {
        box-shadow: 0 0 40px var(--red-glow), 0 0 60px var(--red-primary);
      }
    }

    /* === EXIT BUTTON === */
    .exit-btn {
      background: linear-gradient(135deg, var(--red-dark), var(--red-primary));
      border: none;
      color: white;
      padding: 8px 20px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .exit-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: 0.5s;
    }

    .exit-btn:hover::before {
      left: 100%;
    }

    .exit-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px var(--red-glow);
    }

    /* === CATEGORY PILLS === */
    .category-nav {
      display: flex;
      gap: 8px;
      padding: 8px 16px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .cat-btn {
      padding: 6px 20px;
      background: transparent;
      border: 1px solid rgba(255, 0, 0, 0.3);
      color: var(--text-gray);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .cat-btn::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--red-primary);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .cat-btn:hover {
      color: var(--red-primary);
      border-color: var(--red-primary);
    }

    .cat-btn:hover::after {
      transform: scaleX(1);
    }

    .cat-btn.active {
      background: var(--red-primary);
      color: white;
      border-color: var(--red-primary);
      box-shadow: 0 0 20px var(--red-glow);
    }

    .cat-btn.active::after {
      transform: scaleX(1);
    }

    /* === SECTION TITLES === */
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      position: relative;
    }

    .section-icon {
      width: 32px;
      height: 32px;
      background: var(--red-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.5rem;
      letter-spacing: 3px;
      color: var(--text-white);
    }

    .section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--red-primary), transparent);
    }

    .section-badge {
      background: var(--red-primary);
      color: white;
      padding: 4px 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
    }

    /* === MYSTERY SHOP SECTION === */
    .mystery-shop-container {
      position: relative;
      background: linear-gradient(135deg, rgba(139, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
      border: 1px solid rgba(255, 0, 0, 0.3);
      border-radius: 4px;
      margin: 8px 16px;
      overflow: hidden;
    }

    .mystery-shop-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='rgba(255,0,0,0.05)' stroke-width='1'/%3E%3C/svg%3E");
      opacity: 0.5;
    }

    .mystery-content {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 16px;
      padding: 16px;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 768px) {
      .mystery-content {
        grid-template-columns: 300px 1fr;
      }
    }

    /* Character Mascot - BIGGER */
    .character-mascot {
      position: relative;
      height: 350px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    @media (min-width: 768px) {
      .character-mascot {
        height: 400px;
      }
    }

    .character-img {
      max-height: 100%;
      max-width: 100%;
      filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.5));
      transition: transform 0.5s ease;
    }

    .character-img:hover {
      filter: brightness(1.5) drop-shadow(0 0 50px var(--red-primary));
    }

    /* Discount Badge */
    .discount-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: linear-gradient(135deg, var(--red-primary), var(--red-dark));
      padding: 8px 16px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.2rem;
      color: white;
      transform: rotate(-10deg);
      z-index: 10;
      animation: pulseBadge 2s infinite;
      clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
    }

    @keyframes pulseBadge {

      0%,
      100% {
        box-shadow: 0 0 20px var(--red-glow);
        transform: rotate(-10deg) scale(1);
      }

      50% {
        box-shadow: 0 0 40px var(--red-glow);
        transform: rotate(-10deg) scale(1.05);
      }
    }

    /* Mystery Items Grid */
    .mystery-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    @media (min-width: 768px) {
      .mystery-items {
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }
    }

    .mystery-item {
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 0, 0, 0.2);
      padding: 8px;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mystery-item:hover {
      border-color: var(--red-primary);
      background: rgba(255, 0, 0, 0.1);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgb(255, 0, 0);
    }

    .mystery-item-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;
      filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.3));
    }

    .mystery-item-name {
      font-size: 0.6rem;
      color: var(--text-gray);
      text-transform: uppercase;
      margin-top: 4px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mystery-item-price {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: 4px;
    }

    .price-diamond {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      color: var(--red-primary);
    }

    .price-old {
      font-size: 0.5rem;
      color: var(--text-gray);
      text-decoration: line-through;
    }

    .discount-tag {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--red-primary);
      color: white;
      font-size: 0.5rem;
      font-weight: 700;
      padding: 2px 4px;
    }

    /* === FASHION BUNDLES === */
    .fashion-section {
      margin: 8px 16px;
    }

    .fashion-featured {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .featured-character {
      position: relative;
      background: linear-gradient(180deg, rgba(255, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
      border: 1px solid rgba(255, 0, 0, 0.3);
      min-height: 200px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    @media (min-width: 768px) {
      .featured-character {
        min-height: 300px;
      }
    }

    .featured-character img {
      max-height: 100%;
      transition: transform 0.5s ease;
    }

    .featured-character:hover img {
      filter: brightness(1.5) drop-shadow(0 0 30px var(--red-primary));
    }

    .featured-character:hover {
      border-color: var(--red-primary);
      box-shadow: 0 10px 30px rgb(255, 0, 0);
    }

    .new-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: var(--red-primary);
      color: white;
      padding: 4px 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      animation: pulseBadge 2s infinite;
    }

    /* === MAIN PRODUCT GRID === */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 8px 16px;
    }

    @media (min-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
    }

    .product-card {
      background: var(--bg-card);
      border: 1px solid rgba(255, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s ease;
    }

    .product-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 40%, rgba(255, 0, 0, 0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover::before {
      opacity: 1;
    }

    .product-card:hover {
      border-color: var(--red-primary);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgb(255, 0, 0);
    }

    .product-card:active {
      transform: scale(0.98);
      box-shadow: 0 0 50px var(--red-glow);
    }

    .product-img-box {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, rgba(255, 0, 0, 0.05) 0%, transparent 70%);
      position: relative;
    }

    @media (min-width: 768px) {
      .product-img-box {
        height: 180px;
      }
    }

    .product-img-box img {
      max-width: 70%;
      max-height: 70%;
      transition: all 0.5s ease;
      filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.3));
    }

    .product-card:hover .product-img-box img {
      transform: scale(1.15) rotate(5deg);
      filter: drop-shadow(0 0 30px var(--red-glow)) brightness(1.2);
    }

    .product-info {
      padding: 10px;
      border-top: 1px solid rgba(255, 0, 0, 0.1);
      background: rgba(0, 0, 0, 0.3);
    }

    .product-category {
      font-size: 0.55rem;
      color: var(--text-gray);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .product-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem;
      color: var(--text-white);
      margin: 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (min-width: 768px) {
      .product-name {
        font-size: 0.9rem;
      }
    }

    .product-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 6px;
    }

    .product-price {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.85rem;
      color: var(--red-primary);
    }

    .product-buy-btn {
      padding: 4px 12px;
      background: transparent;
      border: 1px solid var(--red-primary);
      color: var(--red-primary);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .product-buy-btn:hover {
      background: var(--red-primary);
      color: white;
    }

    /* === TIMER DISPLAY === */
    .timer-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid var(--red-primary);
      padding: 4px 8px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.6rem;
      color: var(--red-primary);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .timer-dot {
      width: 6px;
      height: 6px;
      background: var(--red-primary);
      border-radius: 50%;
      animation: blink 1s infinite;
    }

    @keyframes blink {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.3;
      }
    }

    /* === RESPONSIVE MOBILE ADJUSTMENTS === */
    @media (max-width: 640px) {
      .main-header {
        padding: 6px 0;
      }

      .logo-icon {
        width: 28px;
        height: 28px;
      }

      .exit-btn {
        padding: 6px 12px;
        font-size: 0.65rem;
      }

      .section-title {
        font-size: 1rem;
      }

      .mystery-items {
        gap: 4px;
      }

      .mystery-item {
        padding: 4px;
      }

      .character-mascot {
        height: 250px;
      }

      .mystery-content {
        grid-template-columns: 150px 1fr;
      }

      #intro-guide-container {
        flex-direction: column-reverse;
        align-items: center;
        right: 20px;
        left: 20px;
        bottom: 30px;
        gap: 20px;
      }

      #intro-text-container {
        text-align: center;
        max-width: 100%;
      }

      #intro-guide-img {
        max-height: 200px;
        max-width: 150px;
      }

      #intro-text {
        font-size: 0.9rem;
      }

      .notification-popup {
        max-width: 280px;
        padding: 12px 15px;
      }

      .notification-title {
        font-size: 0.7rem;
      }

      .notification-text {
        font-size: 0.8rem;
      }
    }

    /* === ANIMATIONS === */
    @keyframes slideInLeft {
      from {
        transform: translateX(-50px);
        opacity: 0;
      }

      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(50px);
        opacity: 0;
      }

      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeInUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }

      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-left {
      animation: slideInLeft 0.6s ease forwards;
    }

    .animate-slide-right {
      animation: slideInRight 0.6s ease forwards;
    }

    .animate-fade-up {
      animation: fadeInUp 0.6s ease forwards;
    }

    /* === REDUCED MOTION === */
    @media (prefers-reduced-motion: reduce) {

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  
            `}} />
            
            



  {/* <script src="/js/security.js"></script> */}
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="icon" href="/assets/icon.png" type="image/png" />
  <title>NEYDRA SHOP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;700;900&family=Bebas+Neue&display=swap"
    rel="stylesheet" />
  {/* <script src="https://cdn.tailwindcss.com"></script> */}
  




  {/* INTRO SCENE OVERLAY */}
  <div id="intro-overlay" className="blur-active">
    <audio id="intro-sound" preload="auto">
      <source src="/assets/guide.wav" type="audio/wav" />
    </audio>
    <div id="intro-guide-container">
      <div id="intro-text-container">
        <p id="intro-text"></p>
        <span id="intro-cursor"></span>
      </div>
      <img id="intro-guide-img" src="/assets/guide.png" alt="Guide"
        onError={() => { try { eval(`this.src='https://placehold.co/250x350/1a0000/ff0000?text=GUIDE'`); } catch(e){} }} />
    </div>
  </div>

  {/* WARNING POPUP */}
  <div id="warning-popup" className="popup-overlay">
    <div className="popup-content">
      <img src="/assets/warning.png" alt="Warning"
        onError={() => { try { eval(`this.src='https://placehold.co/300x200/1a0000/ff0000?text=WARNING'`); } catch(e){} }} />
      <h3 className="font-display text-xl glow-red mb-4">PAYMENT REQUIRED</h3>
      <p className="text-gray-400 text-sm mb-4">You need to complete the payment to download this item. Please try again!
      </p>
      <button className="popup-close-btn" onClick={() => { (window as any).closeWarningPopup?.(); }}>CLOSE</button>
    </div>
  </div>

  {/* DOWNLOAD SUCCESS POPUP */}
  <div id="download-popup" className="download-popup">
    <div className="download-icon">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </div>
    <h3 className="download-title glow-red">DOWNLOAD STARTED!</h3>
    <p className="download-text" id="download-item-name">Your file is downloading...</p>
  </div>

  {/* RANDOM NOTIFICATION POPUP */}
  <div id="notification-popup" className="notification-popup top-right">
    <button className="notification-close" onClick={() => { (window as any).closeNotification?.(); }}>&times;</button>
    <div className="notification-title" id="notification-title">🟥 NEW PURCHASE!</div>
    <p className="notification-text" id="notification-text">Loading...</p>
  </div>

  {/* Background Canvas */}
  <canvas id="galaxy-bg"></canvas>

  {/* Alert Sound */}
  <audio id="alert-sound" preload="auto">
    <source src="/assets/alert2.wav" type="audio/wav" />
  </audio>

  {/* Background Music */}
  <audio id="bg-music" loop>
    <source src="/assets/theme-music3.mp3" type="audio/mpeg" />
  </audio>

  {/* Main Content */}
  <div id="main-content" className="content-wrapper">

    {/* HEADER */}
    <header className="main-header">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl glow-red" style={{ "lineHeight": "1" }}>NEYDRA SHOP</h1>
            <span className="text-xs text-gray-500 hidden md:block">COMING SOON</span>
          </div>
        </div>

        <button className="exit-btn" onClick={() => { (window as any).location.href='/welcome/home'; }}>EXIT</button>
      </div>

      {/* Category Navigation */}
      <nav className="category-nav">
        <button className="cat-btn active" data-category="all">All</button>
        <button className="cat-btn" data-category="category1">C1</button>
        <button className="cat-btn" data-category="category2">C2</button>
        <button className="cat-btn" data-category="category3">C3</button>
        <button className="cat-btn" data-category="category4">C4</button>
      </nav>
    </header>

    {/* MAIN CONTENT */}
    <main>

      {/* SECTION 1: MYSTERY SHOP */}
      <section className="animate-fade-up" style={{ "animationDelay": "0.1s" }}>
        <div className="section-header">
          <div className="section-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </div>
          <h2 className="section-title glow-red">MYSTERY SHOP</h2>
          <div className="section-line"></div>
          <div className="section-badge">LIMITED TIME</div>
        </div>

        <div className="mystery-shop-container">
          <div className="discount-badge">90% OFF!!!</div>

          <div className="mystery-content">
            {/* Character Mascot */}
            <div className="character-mascot">
              <img src="/assets/character_mascot.png" alt="Mascot" className="character-img"
                onError={() => { try { eval(`this.src='https://placehold.co/300x500/1a0000/ff0000?text=MASCOT'`); } catch(e){} }} />
            </div>

            {/* Mystery Items */}
            <div className="mystery-items" id="mystery-items-grid">
              {/* Generated by JS */}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FASHION BUNDLES */}
      <section className="fashion-section animate-fade-up" style={{ "animationDelay": "0.2s" }}>
        <div className="section-header">
          <div className="section-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path
                d="M21 6h-2V3h-2v3H7V3H5v3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 14H3V8h18v12z" />
            </svg>
          </div>
          <h2 className="section-title">NEW ITEMS</h2>
          <div className="section-line"></div>
        </div>

        <div className="fashion-featured">
          <div className="featured-character" id="fashion-featured">
            <div className="new-badge">NEW</div>
            <img src="/assets/fashion_character.png" alt="Fashion Model"
              onError={() => { try { eval(`this.src='https://placehold.co/200x300/1a0000/ff0000?text=OUTFIT'`); } catch(e){} }} />
          </div>
        </div>
      </section>

      {/* SECTION 3: MAIN PRODUCT GRID */}
      <section className="animate-fade-up" style={{ "animationDelay": "0.3s" }}>
        <div className="section-header">
          <div className="section-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
          <h2 className="section-title">PRODUCTS</h2>
          <div className="section-line"></div>
        </div>

        <div className="product-grid" id="main-product-grid">
          {/* Generated by JS */}
        </div>
      </section>

    </main>
  </div>

  
    <script src="/neydrashop.js" defer></script>



        </div>
    );
}
