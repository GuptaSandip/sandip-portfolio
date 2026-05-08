import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Award, FileText, Star, ExternalLink, Zap } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'
import { getAccomplishments } from '@/lib/supabase'
import type { Accomplishment } from '@/types'

const CATEGORY_META: Record<string, { icon: typeof Trophy; color: string; label: string }> = {
  patent:        { icon: Zap,      color: '#6c63ff', label: 'Patent'        },
  award:         { icon: Trophy,   color: '#fbbf24', label: 'Award'         },
  publication:   { icon: FileText, color: '#00d4ff', label: 'Publication'   },
  certification: { icon: Star,     color: '#34d399', label: 'Certification' },
  milestone:     { icon: Award,    color: '#f472b6', label: 'Milestone'     },
  other:         { icon: Award,    color: '#a78bfa', label: 'Achievement'   },
}

// Static fallbacks for demo (shown if Supabase empty)
const DEMO: Accomplishment[] = []

export default function Achievements() {
  const [items, setItems]     = useState<Accomplishment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAccomplishments()
      .then(d => setItems(d ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  // Section hidden completely if nothing to show
  if (!loading && items.length === 0) return null

  if (loading) {
    return (
      <section id="achievements" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </section>
    )
  }

  return (
    <section id="achievements" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.06), transparent)', filter: 'blur(60px)' }} />
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Achievements" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Patents &amp; <span className="gradient-text">Recognition</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              Milestones, awards, publications and recognitions along the journey.
            </p>
          </FadeUp>
        </div>

        <StaggerContainer stagger={0.09}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {items.map((item) => {
              const meta = CATEGORY_META[item.category] ?? CATEGORY_META.other
              const Icon = meta.icon
              return (
                <StaggerItem key={item.id}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: meta.color + '55', boxShadow: `0 12px 32px ${meta.color}15` }}
                    style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.25s, box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${meta.color}15`, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <Icon size={20} style={{ color: meta.color }} />
                      </motion.div>

                      <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '3px 9px', borderRadius: '6px', background: `${meta.color}12`, color: meta.color, border: `1px solid ${meta.color}25` }}>
                        {meta.label}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '6px', lineHeight: 1.3 }}>
                        {item.title}
                      </h3>
                      {item.issuer && (
                        <p style={{ fontSize: '12px', fontFamily: 'monospace', color: meta.color, marginBottom: '8px' }}>
                          {item.issuer}
                        </p>
                      )}
                      {item.description && (
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65 }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
                      {item.issued_date && (
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                          {new Date(item.issued_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {item.credential_url && (
                        <motion.a
                          href={item.credential_url} target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'monospace', color: meta.color, textDecoration: 'none' }}
                        >
                          View credential <ExternalLink size={11} />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}