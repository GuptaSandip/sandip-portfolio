/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          base:    '#06060f',
          surface: '#0d0d1c',
          panel:   '#131326',
          border:  '#1e1e3f',
          muted:   '#2d2d55',
          primary: {
            50:  '#eeeeff',
            100: '#d0d0ff',
            200: '#a8a8ff',
            300: '#8880ff',
            400: '#6c63ff',
            500: '#5a52e8',
            600: '#4641c7',
            700: '#3330a0',
            800: '#232080',
            900: '#151360',
          },
          cyan: {
            300: '#67e8f9',
            400: '#00d4ff',
            500: '#00b8e0',
            600: '#0090b8',
          },
          ink: {
            primary:   '#eaeaf8',
            secondary: '#8888b8',
            muted:     '#44446a',
          },
        },
        fontFamily: {
          sans:    ['"DM Sans"', 'sans-serif'],
          display: ['Syne', 'sans-serif'],
          mono:    ['"JetBrains Mono"', 'monospace'],
        },
        animation: {
          'fade-up':    'fadeUp 0.6s ease forwards',
          'fade-in':    'fadeIn 0.5s ease forwards',
          'glow-pulse': 'glowPulse 3s ease-in-out infinite',
          'float':      'float 6s ease-in-out infinite',
          'typewriter': 'typewriter 0.05s steps(1) forwards',
        },
        keyframes: {
          fadeUp: {
            '0%':   { opacity: '0', transform: 'translateY(28px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeIn: {
            '0%':   { opacity: '0' },
            '100%': { opacity: '1' },
          },
          glowPulse: {
            '0%,100%': { boxShadow: '0 0 20px rgba(108,99,255,0.25)' },
            '50%':     { boxShadow: '0 0 48px rgba(108,99,255,0.55)' },
          },
          float: {
            '0%,100%': { transform: 'translateY(0px)' },
            '50%':     { transform: 'translateY(-12px)' },
          },
        },
        boxShadow: {
          'glow-sm':  '0 0 16px rgba(108,99,255,0.3)',
          'glow-md':  '0 0 32px rgba(108,99,255,0.4)',
          'glow-lg':  '0 0 64px rgba(108,99,255,0.5)',
          'cyan-sm':  '0 0 16px rgba(0,212,255,0.3)',
          'inner-glow':'inset 0 0 32px rgba(108,99,255,0.08)',
        },
        backgroundImage: {
          'dot-grid': 'radial-gradient(circle, rgba(108,99,255,0.15) 1px, transparent 1px)',
        },
        backgroundSize: {
          'dot': '32px 32px',
        },
      },
    },
    plugins: [],
  }