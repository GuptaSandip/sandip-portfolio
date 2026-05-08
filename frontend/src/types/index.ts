@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Base ────────────────────────────────────────────────── */
@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  body {
    @apply bg-base text-ink-primary font-sans antialiased;
    background-image: radial-gradient(circle, rgba(108,99,255,0.12) 1px, transparent 1px);
    background-size: 32px 32px;
    min-height: 100vh;
  }

  /* Scrollbar */
  ::-webkit-scrollbar        { width: 5px; }
  ::-webkit-scrollbar-track  { @apply bg-base; }
  ::-webkit-scrollbar-thumb  { @apply bg-muted rounded-full; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-primary-400; }

  /* Selection */
  ::selection { @apply bg-primary-400/25 text-primary-100; }

  h1,h2,h3,h4,h5,h6 { @apply font-display; }
}

/* ── Components ──────────────────────────────────────────── */
@layer components {

  /* Buttons */
  .btn-primary {
    @apply inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
           bg-primary-400 text-white font-sans font-medium text-sm
           hover:bg-primary-300 active:bg-primary-500
           transition-all duration-200 shadow-glow-sm hover:shadow-glow-md
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-ghost {
    @apply inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
           border border-border text-ink-secondary font-sans text-sm font-medium
           hover:border-primary-400/60 hover:text-ink-primary
           transition-all duration-200
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-outline {
    @apply inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
           border border-primary-400/40 text-primary-200 font-sans text-sm font-medium
           hover:bg-primary-400/10 hover:border-primary-400
           transition-all duration-200;
  }

  /* Cards */
  .card {
    @apply bg-surface border border-border rounded-xl p-6
           hover:border-primary-400/30 transition-all duration-300;
  }

  .card-glow {
    @apply card hover:shadow-glow-sm hover:-translate-y-0.5;
  }

  /* Section layout */
  .section      { @apply py-24 px-4; }
  .section-inner { @apply max-w-6xl mx-auto; }

  .section-label {
    @apply inline-flex items-center gap-2 text-xs font-mono text-primary-400
           uppercase tracking-widest mb-3;
  }

  .section-title {
    @apply font-display text-3xl md:text-4xl lg:text-5xl font-bold
           text-ink-primary leading-tight;
  }

  .section-sub {
    @apply text-ink-secondary text-base mt-3 mb-12 max-w-2xl;
  }

  /* Tags / pills */
  .tag {
    @apply inline-block px-2.5 py-0.5 rounded-md text-xs font-mono
           bg-primary-400/10 text-primary-200 border border-primary-400/20;
  }

  .tag-cyan {
    @apply inline-block px-2.5 py-0.5 rounded-md text-xs font-mono
           bg-cyan-400/10 text-cyan-400 border border-cyan-400/20;
  }

  .tag-green {
    @apply inline-block px-2.5 py-0.5 rounded-md text-xs font-mono
           bg-emerald-400/10 text-emerald-300 border border-emerald-400/20;
  }

  /* Input fields */
  .field {
    @apply w-full bg-panel border border-border rounded-lg px-4 py-2.5
           text-ink-primary text-sm font-sans placeholder:text-ink-muted
           focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20
           transition-all duration-200;
  }

  .field-label {
    @apply block text-xs font-mono text-ink-muted mb-1.5 uppercase tracking-wider;
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-primary-400 via-primary-300 to-cyan-400
           bg-clip-text text-transparent;
  }

  /* Divider */
  .section-divider {
    @apply border-t border-border/50 max-w-6xl mx-auto;
  }

  /* Glowing dot (status indicator) */
  .dot-live {
    @apply inline-block w-2 h-2 rounded-full bg-emerald-400
           shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse;
  }

  /* Admin sidebar item */
  .sidebar-item {
    @apply flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
           text-ink-secondary hover:bg-panel hover:text-ink-primary
           transition-all duration-150 cursor-pointer;
  }

  .sidebar-item.active {
    @apply bg-primary-400/10 text-primary-200 border border-primary-400/20;
  }
}

/* ── Scroll animation ────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* ── Noise texture overlay ───────────────────────────────── */
.noise::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
}