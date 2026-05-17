import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neydra-black': '#000000',
        'neydra-red': '#FF0000',
        'neydra-dark-red': '#880000',
        'glass-white': 'rgba(255, 255, 255, 0.03)',
        
        // --- NEYDRA SOVEREIGN STRICT PALETTE ENFORCEMENT ---
        // Map all custom/legacy color names to Red/Black/White
        'neydra-accent': '#FF0000',
        'neydra-accent-gold': '#FF0000',
        'neon-blue': '#FF0000',
        'neydra-blue': '#FF0000',
        'carbon-black': '#000000',
        'navy-stealth': '#000000',
        'neon-violet': '#880000',
        'neydra-violet': '#880000',
        'primary-color': '#000000',
        'secondary-color': '#FF0000',
        'secondary-color-dark': '#880000',

        // Override default Tailwind non-red colors so any lingering classes (cyan, emerald, blue, purple, amber, rose, pink, yellow, green, etc.) are forced to Red/Black/White!
        cyan: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        blue: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        emerald: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        amber: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        purple: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        rose: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        pink: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        violet: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        green: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        yellow: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        orange: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        indigo: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        teal: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        lime: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        fuchsia: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
        sky: { 50: '#FF0000', 100: '#FF0000', 200: '#FF0000', 300: '#FF0000', 400: '#FF0000', 500: '#FF0000', 600: '#FF0000', 700: '#FF0000', 800: '#FF0000', 900: '#FF0000', 950: '#FF0000' },
      },
      fontFamily: {
        sans: ['"Poppins"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
        'scanline': 'scanline 8s linear infinite',
        'neon': 'neon 3s infinite',
        'shake-pulse': 'shakePulse 850ms cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 5px rgba(255, 0, 0, 0.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'neon': {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(255, 0, 0, 1), 0 0 40px rgba(255, 0, 0, 0.7)' },
        },
        shakePulse: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '15%': { transform: 'scale(1.1) rotate(-2deg)' },
          '30%': { transform: 'scale(1.1) rotate(2deg)' },
          '45%': { transform: 'scale(1.1) rotate(-2deg)' },
          '60%': { transform: 'scale(1.1) rotate(2deg)' },
        }
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(255, 0, 0, 0.4)',
        'neon-red': '0 0 20px rgba(255, 0, 0, 0.5), inset 0 0 15px rgba(255, 0, 0, 0.2)',
      }
    }
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.neydra-glass': {
          'background': 'rgba(0, 0, 0, 0.85)',
          'backdrop-filter': 'blur(40px) saturate(200%)',
          'border': '1px solid rgba(255, 0, 0, 0.3)',
          'box-shadow': '0 4px 30px rgba(255, 0, 0, 0.1), inset 0 0 20px rgba(255, 0, 0, 0.05)',
        },
        '.text-gradient-red': {
          'background': 'linear-gradient(180deg, #FFFFFF 0%, #FF0000 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        }
      })
    }
  ],
};
export default config;
