import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'
import { getBio } from '@/lib/supabase'
import type { Bio, Experience } from '@/types'

const ease = [0.21, 0.47, 0.32, 0.98] as const

export default function About() {
  const [bio, setBio] = useState<Bio | null>(null)
  const [experience, setExp] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBio()
      .then(d => {
        if (d) {
          setBio(d.bio)
          setExp(d.experience)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section id="about" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </section>
  )

  return (
    <section id="about" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'start' }}>

          {/* ── Left: Bio ─────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
              {bio?.avatar_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', damping: 15 }}
                  style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #6c63ff', boxShadow: '0 8px 32px rgba(108,99,255,0.25)', flexShrink: 0 }}
                >
                  <img src={bio.avatar_url} alt="Sandip Gupta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              )}
              <SectionLabel text="About Me" />
            </div>

            <FadeUp delay={0.05}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1.5rem', letterSpacing: '-0.02em' }}>
                Building AI.<br />
                <span className="gradient-text">Teaching AI.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                {bio?.about || "I'm Sandip Gupta — an AI engineer and Master Trainer who builds production-grade applications with LLMs, agentic AI, and modern AI frameworks."}
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.8, marginBottom: '2rem' }}>
                {bio?.taglines?.[0] || "I spend my days creating real-world AI systems, experimenting with autonomous workflows, and teaching others to build and think in AI."}
              </p>
            </FadeUp>

            {/* Info cards */}
            <StaggerContainer stagger={0.08}>
              {[
                { icon: MapPin, label: 'Location', value: bio?.location || 'India' },
                { icon: Briefcase, label: 'Role', value: bio?.title || 'Master Trainer · AI Engineer' },
                { icon: Calendar, label: 'Experience', value: '3+ Years Training' },
              ].map(({ icon: Icon, label, value }) => (
                <StaggerItem key={label}>
                  <motion.div whileHover={{ x: 4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', marginBottom: '10px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bd)')}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: '#6c63ff' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500, marginTop: '1px' }}>{value}</div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Platform links */}
            <FadeUp delay={0.35}>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: 'HuggingFace', href: bio?.huggingface_url || 'https://huggingface.co/guptasandip', color: '#ff9d00' },
                  { label: 'GitHub', href: bio?.github_url || 'https://github.com/GuptaSandip', color: '#6c63ff' },
                  { label: 'LinkedIn', href: bio?.linkedin_url || 'https://linkedin.com/in/sandip-gupta11/', color: '#0077b5' },
                  { label: 'Twitter', href: bio?.twitter_url || 'https://x.com/guptasandip11', color: '#1da1f2' },
                ].map(({ label, href, color }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, borderColor: color }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)', border: '1px solid var(--bd)', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {label} <ExternalLink size={11} />
                  </motion.a>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* ── Right: Timeline ───────────────────────────── */}
          <div>
            <FadeUp>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', marginBottom: '12px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', color: '#a8a8ff', fontSize: '11px', fontFamily: 'monospace' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }} />
                CAREER JOURNEY
              </div>
            </FadeUp>

            <FadeUp delay={0.05}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-1)', lineHeight: 1.2, margin: '0 0 2rem', letterSpacing: '-0.01em' }}>
                Experience &amp;<br />
                <span className="gradient-text">Timeline</span>
              </h2>
            </FadeUp>

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
              {/* vertical line */}
              <motion.div
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{ position: 'absolute', left: '17px', top: '8px', bottom: '8px', width: '1.5px', background: 'linear-gradient(to bottom, #6c63ff, rgba(108,99,255,0.1))', transformOrigin: 'top', zIndex: 0 }}
              />

              {experience.map((exp, i) => (
                <motion.div key={exp.id || i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease }}
                  style={{ display: 'flex', gap: '20px', marginBottom: '28px', position: 'relative', zIndex: 1 }}>

                  {/* dot */}
                  <div style={{ flexShrink: 0, marginTop: '4px' }}>
                    <motion.div
                      animate={exp.is_current ? { boxShadow: ['0 0 0px rgba(108,99,255,0.4)', '0 0 16px rgba(108,99,255,0.7)', '0 0 0px rgba(108,99,255,0.4)'] } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', background: exp.is_current ? '#6c63ff' : 'var(--bg-surface)', border: `2px solid ${exp.is_current ? '#6c63ff' : 'var(--bd)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={14} style={{ color: exp.is_current ? 'white' : 'var(--text-2)' }} />
                    </motion.div>
                  </div>

                  {/* card */}
                  <motion.div whileHover={{ borderColor: 'rgba(108,99,255,0.4)', y: -2 }}
                    style={{ flex: 1, padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--text-1)' }}>{exp.role}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '2px' }}>{exp.company}</div>
                      </div>
                      {exp.is_current && (
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '6px', background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          Current
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6c63ff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} /> {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}