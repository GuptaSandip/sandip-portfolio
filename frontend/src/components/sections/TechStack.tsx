import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'
import { getTechStack } from '@/lib/supabase'
import type { TechItem } from '@/types'

const CATS = [
  { key: 'all',      label: 'All',       color: '#6c63ff' },
  { key: 'ai_ml',    label: 'AI / ML',   color: '#6c63ff' },
  { key: 'language', label: 'Languages', color: '#00d4ff' },
  { key: 'framework',label: 'Frameworks',color: '#34d399' },
  { key: 'tool',     label: 'Tools',     color: '#fbbf24' },
  { key: 'database', label: 'Databases', color: '#f472b6' },
]

function LevelDots({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '8px' }}>
      {[1,2,3,4,5].map(i => (
        <motion.div key={i}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.04 }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: i <= level ? color : 'var(--bd)', opacity: i <= level ? 1 : 0.4 }}
        />
      ))}
    </div>
  )
}

export default function TechStack() {
  const [techs, setTechs]     = useState<TechItem[]>([])
  const [active, setActive]   = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTechStack()
      .then(setTechs)
      .finally(() => setLoading(false))
  }, [])

  const filtered = active === 'all'
    ? techs
    : techs.filter(t => t.category === active)

  if (loading) return (
    <section id="stack" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </section>
  )

  return (
    <section id="stack" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <SectionLabel text="Tech Stack" />

          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Tools &amp; <span className="gradient-text">Technologies</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              My everyday stack for building production AI systems, from data pipelines to agentic workflows.
            </p>
          </FadeUp>

          {/* Filter tabs */}
          <FadeUp delay={0.15}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '3rem' }}>
              {CATS.map(cat => (
                <motion.button key={cat.key}
                  onClick={() => setActive(cat.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '7px 18px', borderRadius: '9999px', fontSize: '12px', fontFamily: 'monospace',
                    border: `1px solid ${active === cat.key ? cat.color : 'var(--bd)'}`,
                    background: active === cat.key ? `${cat.color}18` : 'transparent',
                    color: active === cat.key ? cat.color : 'var(--text-2)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
            {filtered.map((tech, i) => {
              const catMeta = CATS.find(c => c.key === tech.category) || CATS[0]
              return (
                <motion.div key={tech.id || tech.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  whileHover={{ y: -6, borderColor: catMeta.color + '60', boxShadow: `0 8px 24px ${catMeta.color}20` }}
                  style={{ padding: '1.1rem', borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', cursor: 'default', transition: 'border-color 0.2s' }}>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{tech.name}</div>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'capitalize' }}>{tech.category.replace('_', '/')}</div>
                  <LevelDots level={tech.level} color={catMeta.color} />
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <FadeUp delay={0.3}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>Proficiency:</span>
            {['Beginner', 'Familiar', 'Good', 'Proficient', 'Expert'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(d => (
                    <div key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: d <= i + 1 ? '#6c63ff' : 'var(--bd)' }} />
                  ))}
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}