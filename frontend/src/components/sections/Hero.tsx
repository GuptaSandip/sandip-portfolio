import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react'
import { ScrollHint } from '@/components/ui/Navbar'
import { getBio } from '@/lib/supabase'
import type { Bio } from '@/types'

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
    <div ref={ref} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '2.5rem', lineHeight: 1, color: 'var(--text-card-1)' }}>
      {val}{suffix}
    </div>
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
    { value: '3+', label: 'Years Experience' },
  ]

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  if (loading) return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </section>
  )

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto', width: '100%', padding: '5rem 1.75rem 4rem' }}>

        {/* Editorial headline — on dark frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          style={{ marginBottom: '3.5rem' }}
        >
          <p className="mono-label" style={{ marginBottom: '1.25rem' }}>
            {bio?.title?.toUpperCase() || 'AI ENGINEER & MASTER TRAINER'}
          </p>

          <h1 className="display-xl" style={{ margin: '0 0 1.25rem' }}>
            Building{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>AI Solutions</em>
            <br />
            That Drive Real Impact
          </h1>

          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: 'var(--accent)', minHeight: '1.5rem', margin: 0 }}>
            {typed}<span style={{ opacity: 0.5 }}>|</span>
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="bento-grid">

          {/* Main intro card */}
          <motion.div
            className="bento-card bento-span-8"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between', minHeight: '280px' }}
          >
            <div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-card-2)', lineHeight: 1.8, margin: 0, maxWidth: '32rem' }}>
                {bio?.about ? (bio.about.length > 200 ? bio.about.slice(0, 200) + '...' : bio.about) : 'I build intelligent systems, AI applications and agentic workflows that solve real-world problems. I teach others how to build and think in AI.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('projects')}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                View Projects <ArrowRight size={15} />
              </motion.button>
              {bio?.resume_url && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(bio.resume_url, '_blank')}
                  className="btn-ghost"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-card-2)', borderColor: 'var(--bd)' }}
                >
                  <Download size={15} /> Resume
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Avatar / profile card */}
          <motion.div
            className="bento-card bento-span-4"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', minHeight: '280px' }}
          >
            {bio?.avatar_url ? (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--bd)' }}>
                <img src={bio.avatar_url} alt="Sandip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-muted)', border: '1px solid rgba(184,137,82,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--accent)' }}>S</span>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-card-1)' }}>Sandip Gupta</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-card-2)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>Available for work</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { Icon: Github, href: bio?.github_url || 'https://github.com/GuptaSandip', label: 'GitHub' },
                { Icon: Linkedin, href: bio?.linkedin_url || 'https://www.linkedin.com/in/sandipgupta-ai/', label: 'LinkedIn' },
                { Icon: Twitter, href: bio?.twitter_url || 'https://x.com/guptasandip11', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bd)', color: 'var(--text-card-2)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.color = 'var(--text-card-2)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Stats bento row */}
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bento-card bento-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease }}
              whileHover={{ y: -2 }}
              style={{ textAlign: 'center', padding: '1.5rem 1rem' }}
            >
              <Counter target={stat.value} />
              <div style={{ fontSize: '0.6875rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-card-2)', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <ScrollHint />
      </div>
    </section>
  )
}
