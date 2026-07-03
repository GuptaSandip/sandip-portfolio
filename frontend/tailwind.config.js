/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          outer:   '#0B0B0B',
          base:    '#111111',
          surface: '#E8E0D0',
          panel:   '#DDD5C5',
          border:  'rgba(0, 0, 0, 0.1)',
          accent: {
            DEFAULT: '#B88952',
            light:   '#C99A63',
            muted:   'rgba(184, 137, 82, 0.15)',
          },
          ink: {
            primary:   '#161616',
            secondary: '#555555',
            muted:     '#888888',
            onDark:    '#E8E0D0',
            onDarkMuted: '#8A8580',
          },
        },
        fontFamily: {
          sans:    ['Inter', 'sans-serif'],
          display: ['"Cormorant Garamond"', 'serif'],
          mono:    ['"JetBrains Mono"', 'monospace'],
        },
        animation: {
          'fade-up':    'fadeUp 0.6s ease forwards',
          'fade-in':    'fadeIn 0.5s ease forwards',
          'glow-pulse': 'glowPulse 3s ease-in-out infinite',
          'float':      'float 6s ease-in-out infinite',
        },
        keyframes: {
          fadeUp: {
            '0%':   { opacity: '0', transform: 'translateY(24px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeIn: {
            '0%':   { opacity: '0' },
            '100%': { opacity: '1' },
          },
          glowPulse: {
            '0%,100%': { boxShadow: '0 0 20px rgba(184, 137, 82, 0.2)' },
            '50%':     { boxShadow: '0 0 40px rgba(184, 137, 82, 0.35)' },
          },
          float: {
            '0%,100%': { transform: 'translateY(0px)' },
            '50%':     { transform: 'translateY(-8px)' },
          },
        },
        boxShadow: {
          'glow-sm':   '0 4px 20px rgba(184, 137, 82, 0.2)',
          'glow-md':   '0 8px 32px rgba(184, 137, 82, 0.25)',
          'card':      '0 1px 0 rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.12)',
        },
        borderRadius: {
          'card': '16px',
        },
      },
    },
    plugins: [],
  }
