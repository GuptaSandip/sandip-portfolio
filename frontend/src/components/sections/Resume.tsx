import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, FileText, ExternalLink, Briefcase, GraduationCap, Award, Code2 } from 'lucide-react'
import { FadeUp, SlideLeft, SlideRight, SectionLabel } from './AnimatedSection'
import { supabase, getResumeOverview } from '@/lib/supabase'
import type { ResumeOverview } from '@/types'

const DEFAULT_HIGHLIGHTS = [
  { category: 'experience', icon: Briefcase,     title: 'Experience',  color: 'var(--accent)' },
  { category: 'skills',     icon: Code2,         title: 'Core Skills', color: '#00d4ff' },
  { category: 'education',  icon: GraduationCap, title: 'Education',   color: '#34d399' },
  { category: 'highlights', icon: Award,         title: 'Highlights',  color: '#fbbf24' },
]

const ease = [0.21, 0.47, 0.32, 0.98] as const

// Animated floating PDF mockup
function ResumeMockup() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '100%', maxWidth: '320px', margin: '0 auto', position: 'relative' }}
    >
      {/* Shadow pages */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', right: '-12px', bottom: '-12px', borderRadius: '16px', background: 'rgba(184,137,82,0.08)', border: '1px solid rgba(184,137,82,0.12)' }} />
      <div style={{ position: 'absolute', top: '6px', left: '6px', right: '-6px', bottom: '-6px', borderRadius: '16px', background: 'rgba(184,137,82,0.12)', border: '1px solid rgba(184,137,82,0.18)' }} />

      {/* Main page */}
      <div className="surface-card" style={{ position: 'relative', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ height: '2px', background: 'var(--accent)', borderRadius: '1px', marginBottom: '1.25rem' }} />

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)' }}>Sandip Gupta</div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent)', marginTop: '2px' }}>AI Engineer & Master Trainer</div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['github.com/GuptaSandip', 'India'].map(item => (
            <span key={item} style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--text-3)' }}>{item}</span>
          ))}
        </div>

        {['Experience', 'Skills', 'Projects', 'Education'].map((s, i) => (
          <div key={s} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '8px', fontFamily: 'monospace', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(184,137,82,0.25)' }} />
              {s}
              <div style={{ height: '1px', flex: 1, background: 'rgba(184,137,82,0.25)' }} />
            </div>
            {[...Array(i === 0 ? 3 : i === 1 ? 4 : 2)].map((_, j) => (
              <motion.div key={j}
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ delay: j * 0.08 + i * 0.1, duration: 0.5 }}
                style={{ height: '6px', borderRadius: '3px', background: 'var(--bd)', marginBottom: '4px', transformOrigin: 'left', width: `${55 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        ))}

        <div style={{ position: 'absolute', bottom: '10px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FileText size={9} style={{ color: 'var(--text-3)' }} />
          <span style={{ fontSize: '7px', fontFamily: 'monospace', color: 'var(--text-3)' }}>resume.pdf</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Resume() {
  const [resumeUrl, setResumeUrl]   = useState<string | null>(null)
  const [overview, setOverview]     = useState<ResumeOverview[]>([])
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('bio').select('resume_url').eq('id', 1).single(),
      getResumeOverview()
    ]).then(([bioRes, ovRes]) => {
      if (bioRes.data?.resume_url) setResumeUrl(bioRes.data.resume_url)
      setOverview(ovRes)
    }).finally(() => setLoading(false))
  }, [])

  const highlights = DEFAULT_HIGHLIGHTS.map(cat => ({
    ...cat,
    items: overview.filter(i => i.category === cat.category)
  }))

  function handleDownload() {
    if (!resumeUrl) {
      alert('Resume PDF not uploaded yet. Please check back soon or contact Sandip directly.')
      return
    }
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000)
    window.open(resumeUrl, '_blank')
  }

  return (
    <section id="resume" style={{ padding: '7rem 1.75rem', position: 'relative' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Resume" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              My <span className="gradient-text">Resume</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              3+ years building and teaching AI. Here's the condensed version.
            </p>
          </FadeUp>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Left: PDF visual + CTA */}
          <SlideLeft>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <ResumeMockup />

              {/* Status indicator */}
              {!loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', color: resumeUrl ? '#34d399' : 'var(--text-3)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: resumeUrl ? '#34d399' : 'var(--bd)', display: 'inline-block', boxShadow: resumeUrl ? '0 0 6px rgba(52,211,153,0.8)' : 'none' }} />
                  {resumeUrl ? 'Resume PDF available' : 'Resume coming soon'}
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading || loading}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(184,137,82,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}
                >
                  {downloading
                    ? <><span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Downloading…</>
                    : <><Download size={16} /> Download Resume</>
                  }
                </motion.button>

                {resumeUrl && (
                  <motion.a
                    href={resumeUrl} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <Eye size={16} /> View Online
                  </motion.a>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                <Eye size={12} />
                <span>Last updated: May 2025</span>
              </div>
            </div>
          </SlideLeft>

          {/* Right: Highlights */}
          <SlideRight>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FadeUp>
                <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Quick Overview
                </p>
              </FadeUp>

              {highlights.map((section, si) => (
                <motion.div key={section.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: si * 0.1, duration: 0.55, ease }}
                  whileHover={{ borderColor: 'rgba(184,137,82,0.35)', x: 4 }} className="surface-card"
                  style={{ padding: '1.25rem', borderRadius: '12px', transition: 'border-color 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${section.color}15`, border: `1px solid ${section.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <section.icon size={15} style={{ color: section.color }} />
                    </div>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '14px', color: 'var(--text-1)' }}>{section.title}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {section.items.map((item, ii) => (
                      <motion.div key={ii}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.1 + ii * 0.05 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                      >
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: section.color, marginTop: '6px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 500 }}>{item.label}</div>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', marginTop: '1px' }}>{item.sub}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </SlideRight>
        </div>

        {/* Contact nudge */}
        <FadeUp delay={0.2}>
          <div className="surface-card" style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.7, marginBottom: '1rem' }}>
              Want to know more about my background? Let's talk directly.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-primary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}
            >
              Get In Touch <ExternalLink size={14} />
            </motion.button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}