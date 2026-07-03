import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork, Zap } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'
import { getProjects } from '@/lib/supabase'
import type { Project } from '@/types'

const ease = [0.21, 0.47, 0.32, 0.98] as const

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const color = project.color || 'var(--accent)'

  return (
    <motion.div
      className="surface-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '1.75rem',
        borderRadius: '16px',
        border: `1px solid ${hovered ? 'rgba(184,137,82,0.35)' : 'var(--bd)'}`,
        transition: 'border-color 0.25s, transform 0.25s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* top color bar */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${color}, transparent)`, transformOrigin: 'left' }}
      />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <motion.div
          animate={{ backgroundColor: hovered ? color + '20' : 'rgba(184,137,82,0.08)' }}
          style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30`, flexShrink: 0 }}
        >
          <Zap size={18} style={{ color: color }} />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Stats removed as they're not in the new schema, but can be added back if needed */}
        </div>
      </div>

      {/* title */}
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '8px', lineHeight: 1.3 }}>
        {project.title}
      </h3>

      {/* desc */}
      <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7, flex: 1, marginBottom: '16px' }}>
        {project.description}
      </p>

      {/* tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {project.tech_tags.map(tag => (
          <span key={tag} style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '5px', background: `${color}12`, color: color, border: `1px solid ${color}25` }}>
            {tag}
          </span>
        ))}
      </div>

      {/* links */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {project.github_url && (
          <motion.a
            href={project.github_url} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--bd)', color: 'var(--text-2)', fontSize: '12px', fontFamily: 'monospace', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.color = color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.color = 'var(--text-2)' }}
          >
            <Github size={13} /> Code
          </motion.a>
        )}

        {project.live_url && (
          <motion.a
            href={project.live_url} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: color, color: 'white', fontSize: '12px', fontFamily: 'monospace', textDecoration: 'none' }}
          >
            <ExternalLink size={13} /> Live
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section id="projects" style={{ padding: '7rem 1.75rem', display: 'flex', justifyContent: 'center' }}>
      <div className="spinner" />
    </section>
  )

  const featured = projects.find(p => p.is_featured) || projects[0]
  const others   = projects.filter(p => p.id !== featured?.id)

  return (
    <section id="projects" style={{ padding: '7rem 1.75rem' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Projects" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Things I've <span className="gradient-text">Built</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              Real-world AI systems, agentic workflows, and ML applications — built to solve actual problems.
            </p>
          </FadeUp>
        </div>

        {/* Featured project */}
        {featured && (
          <FadeUp delay={0.1}>
            <motion.div
              className="surface-card"
              whileHover={{ y: -3 }}
              style={{ padding: '2.5rem', borderRadius: '16px', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}
            >

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '3px 10px', borderRadius: '6px', background: 'rgba(184,137,82,0.15)', color: 'var(--accent)', border: '1px solid rgba(184,137,82,0.3)' }}>
                  ⭐ Featured Project
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-1)', marginBottom: '12px', lineHeight: 1.3 }}>
                    {featured.title}
                  </h3>
                  <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.75, marginBottom: '16px' }}>{featured.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {featured.tech_tags.map(tag => (
                      <span key={tag} style={{ fontSize: '11px', fontFamily: 'monospace', padding: '3px 10px', borderRadius: '6px', background: 'rgba(184,137,82,0.12)', color: 'var(--accent)', border: '1px solid rgba(184,137,82,0.22)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {featured.github_url && (
                      <motion.a href={featured.github_url} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }} className="btn-ghost"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontSize: '13px', textDecoration: 'none' }}>
                        <Github size={14} /> View Code
                      </motion.a>
                    )}
                    {featured.live_url && (
                      <motion.a href={featured.live_url} whileHover={{ scale: 1.04 }} className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontSize: '13px', textDecoration: 'none' }}>
                        <ExternalLink size={14} /> Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* mini visual */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '220px', height: '180px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(184,137,82,0.12), transparent)', pointerEvents: 'none' }} />
                    {['User: Tell me about Sandip', 'Bot: Sandip is an AI Engineer...', 'User: Is he open to work?', 'Bot: Yes! Share your details...'].map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3 + 0.5 }}
                        style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '8px', maxWidth: '85%', fontFamily: 'monospace', alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end', background: i % 2 === 0 ? 'var(--bd)' : 'rgba(184,137,82,0.3)', color: 'var(--text-1)' }}>
                        {msg}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeUp>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {others.map((project, i) => (
            <ProjectCard key={project.id || project.title} project={project} index={i} />
          ))}
        </div>

        {/* GitHub CTA */}
        <FadeUp delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <motion.a
              href="https://github.com/GuptaSandip"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(184,137,82,0.3)' }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '12px', border: '1px solid var(--bd)', color: 'var(--text-2)', fontSize: '14px', fontFamily: 'monospace', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,137,82,0.5)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              <Github size={16} />
              View all projects on GitHub →
            </motion.a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}