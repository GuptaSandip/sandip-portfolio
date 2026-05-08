import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import { getBio } from '@/lib/supabase'
import type { Bio } from '@/types'

// ── Typewriter ────────────────────────────────────────────
function useTypewriter(words: string[], speed = 75, pause = 2200) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    if (!words || words.length === 0) return
    const current = words[wordIdx % words.length]
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) setTimeout(() => setDeleting(true), pause)
      } else {
        const next = current.slice(0, text.length - 1)
        setText(next)
        if (next === '') { setDeleting(false); setWordIdx(i => i + 1) }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [text, deleting, wordIdx, words, speed, pause])
  return text
}

// ── Animated counter ──────────────────────────────────────
function Counter({ target }: { target: string }) {
  const num = parseInt(target.replace(/\D/g, ''))
  const suffix = target.replace(/[0-9]/g, '')
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  useEffect(() => {
    if (isNaN(num)) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return
      done.current = true
      obs.disconnect()
      let cur = 0
      const step = Math.max(1, Math.ceil(num / 50))
      const t = setInterval(() => {
        cur = Math.min(cur + step, num)
        setVal(cur)
        if (cur >= num) clearInterval(t)
      }, 35)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [num])
  return (
    <div ref={ref} className="gradient-text" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '2.25rem', lineHeight: 1 }}>
      {val}{suffix}
    </div>
  )
}

// ── Neural SVG ────────────────────────────────────────────
function NeuralVisual() {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}
    >
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ng1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ng2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="200" rx="165" ry="165" fill="url(#ng1)" />
        <ellipse cx="270" cy="150" rx="90" ry="90" fill="url(#ng2)" />
        <circle cx="200" cy="200" r="152" fill="none" stroke="#6c63ff" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="#00d4ff" strokeWidth="0.4" opacity="0.1" strokeDasharray="2 6" />
        <line x1="100" y1="200" x2="180" y2="140" stroke="#6c63ff" strokeWidth="0.9" opacity="0.45" />
        <line x1="180" y1="140" x2="260" y2="178" stroke="#6c63ff" strokeWidth="0.9" opacity="0.4" />
        <line x1="260" y1="178" x2="302" y2="118" stroke="#00d4ff" strokeWidth="0.8" opacity="0.38" />
        <line x1="180" y1="140" x2="218" y2="242" stroke="#6c63ff" strokeWidth="0.7" opacity="0.32" />
        <line x1="218" y1="242" x2="300" y2="262" stroke="#00d4ff" strokeWidth="0.7" opacity="0.3" />
        <line x1="100" y1="200" x2="100" y2="280" stroke="#6c63ff" strokeWidth="0.6" opacity="0.25" />
        <line x1="100" y1="280" x2="218" y2="242" stroke="#6c63ff" strokeWidth="0.6" opacity="0.25" />
        <motion.circle cx="180" cy="140" r="11" fill="#6c63ff" opacity="0.9"
          animate={{ r: [11, 13, 11] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <circle cx="180" cy="140" r="18" fill="none" stroke="#6c63ff" strokeWidth="1" opacity="0.3" />
        <motion.circle cx="260" cy="178" r="8" fill="#00d4ff" opacity="0.85"
          animate={{ r: [8, 10, 8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        <circle cx="260" cy="178" r="14" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.25" />
        <circle cx="100" cy="200" r="7" fill="#6c63ff" opacity="0.7" />
        <circle cx="302" cy="118" r="6" fill="#00d4ff" opacity="0.7" />
        <motion.circle cx="218" cy="242" r="9" fill="#6c63ff" opacity="0.8"
          animate={{ r: [9, 11, 9] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
        <circle cx="300" cy="262" r="6" fill="#00d4ff" opacity="0.6" />
        <circle cx="100" cy="280" r="5" fill="#6c63ff" opacity="0.5" />
        <circle cx="200" cy="200" r="30" fill="rgba(108,99,255,0.15)" stroke="#6c63ff" strokeWidth="1.5" opacity="0.75" />
        <circle cx="200" cy="200" r="20" fill="rgba(108,99,255,0.28)" />
        <text x="200" y="205" textAnchor="middle" fontSize="12" fill="white" fontFamily="monospace" fontWeight="700">AI</text>
        <rect x="148" y="106" width="50" height="15" rx="7" fill="rgba(108,99,255,0.2)" />
        <text x="173" y="117" textAnchor="middle" fontSize="7" fill="#a8a8ff" fontFamily="monospace">Agentic AI</text>
        <rect x="264" y="160" width="46" height="15" rx="7" fill="rgba(0,212,255,0.15)" />
        <text x="287" y="171" textAnchor="middle" fontSize="7" fill="#67e8f9" fontFamily="monospace">FastAPI</text>
        <rect x="192" y="252" width="38" height="15" rx="7" fill="rgba(108,99,255,0.2)" />
        <text x="211" y="263" textAnchor="middle" fontSize="7" fill="#a8a8ff" fontFamily="monospace">LLM</text>
        <rect x="60" y="188" width="34" height="15" rx="7" fill="rgba(108,99,255,0.15)" />
        <text x="77" y="199" textAnchor="middle" fontSize="7" fill="#a8a8ff" fontFamily="monospace">RAG</text>
      </svg>
    </motion.div>
  )
}

const ease = [0.21, 0.47, 0.32, 0.98] as const

export default function Hero() {
  const [bio, setBio] = useState<Bio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBio()
      .then(d => { if (d) setBio(d.bio) })
      .finally(() => setLoading(false))
  }, [])

  const defaultTaglines = [
    'AI Engineer & Master Trainer',
    'Building with LLMs & Agentic AI',
    'Gen AI · RAG · Agentic Systems',
    'Turning Complex AI into Solutions',
  ]

  const taglines = bio?.taglines || defaultTaglines
  const typed = useTypewriter(taglines)

  const stats = [
    { value: '15+', label: 'AI Projects' },
    { value: '10+', label: 'Workshops' },
    { value: '2000+', label: 'Students Trained' },
    { value: '2+', label: 'Years Experience' },
  ]

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  if (loading) return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </section>
  )

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* bg blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '15%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,1), transparent)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.13, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '15%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,1), transparent)', filter: 'blur(80px)' }}
        />
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {bio?.avatar_url && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(108,99,255,0.4)', marginBottom: '-4px' }}>
                <img src={bio.avatar_url} alt="Sandip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', color: '#a8a8ff', fontSize: '11px', fontFamily: 'monospace', width: 'fit-content' }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
              {bio?.title?.toUpperCase() || 'AI ENGINEER & MASTER TRAINER'}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }}
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-1)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', margin: 0 }}>
              Building{' '}
              <span className="gradient-text">AI Solutions</span>
              <br />
              That Drive Real Impact
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontFamily: 'monospace', fontSize: '15px', color: '#6c63ff', minHeight: '1.6rem', margin: 0 }}>
              {typed}<span style={{ opacity: 0.7 }}>|</span>
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.3, ease }}
              style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.75, maxWidth: '36rem', margin: 0 }}>
              {bio?.about ? (bio.about.length > 160 ? bio.about.slice(0, 160) + '...' : bio.about) : 'I build intelligent systems, AI applications and agentic workflows that solve real-world problems. I teach others how to build and think in AI.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.4, ease }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(108,99,255,0.5)' }} whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('projects')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                View Projects <ArrowRight size={16} />
              </motion.button>
              {bio?.resume_url && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => window.open(bio.resume_url, '_blank')} className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} /> Download Resume
                </motion.button>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              {[
                { Icon: Github, href: bio?.github_url || 'https://github.com/GuptaSandip', label: 'GitHub' },
                { Icon: Linkedin, href: bio?.linkedin_url || 'https://linkedin.com/in/sandip-gupta11/', label: 'LinkedIn' },
                { Icon: Twitter, href: bio?.twitter_url || 'https://x.com/guptasandip11', label: 'Twitter' },
              ].map(({ Icon, href, label }, i) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  whileHover={{ scale: 1.15, borderColor: 'rgba(108,99,255,0.6)', color: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.08)' }}
                  style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bd)', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  <Icon size={17} />
                </motion.a>
              ))}
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', marginLeft: '4px' }}>@guptasandip11</span>
            </motion.div>
          </div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease }}
            style={{ display: 'flex', justifyContent: 'center' }}>
            <NeuralVisual />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--bd)' }}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.08 }}
              whileHover={{ borderColor: 'rgba(108,99,255,0.4)', y: -3, boxShadow: '0 8px 24px rgba(108,99,255,0.12)' }}
              style={{ textAlign: 'center', padding: '1.25rem 1rem', borderRadius: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s', cursor: 'default' }}>
              <Counter target={stat.value} />
              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)', marginTop: '4px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <motion.button animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => scrollTo('about')}
            style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
            scroll to explore ↓
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}