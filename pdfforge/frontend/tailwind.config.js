/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        bg: '#080810',
        surface: '#10101c',
        surface2: '#181828',
        surface3: '#20203a',
        border: 'rgba(255,255,255,0.07)',
        accent: {
          DEFAULT: '#e8ff47',
          blue: '#47b8ff',
          red: '#ff6b6b',
          purple: '#b847ff',
          green: '#47ffb8',
          orange: '#ffa547',
        },
        muted: '#6b6b8a',
        muted2: '#9090b0',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-dot': 'pulseDot 2s infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.5', transform: 'scale(0.8)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
