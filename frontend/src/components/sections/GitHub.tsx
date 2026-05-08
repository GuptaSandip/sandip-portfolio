import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork, Code2 } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'

const PLATFORMS = [

  {
    name: 'LinkedIn',
    handle: 'sandip-gupta11',
    href: 'https://www.linkedin.com/in/sandip-gupta11/',
    color: '#0077b5',
    desc: 'Professional network, articles & updates',
    icon: '💼',
    stat: '500+ connections',
  },
  {
    name: 'GitHub',
    handle: '@GuptaSandip',
    href: 'https://github.com/GuptaSandip',
    color: '#6c63ff',
    desc: 'Open source projects, AI tools, ML experiments',
    icon: '🐙',
    stat: '20+ repos',
  },
  {
    name: 'HuggingFace',
    handle: '@guptasandip',
    href: 'https://huggingface.co/guptasandip',
    color: '#ff9d00',
    desc: 'ML models, datasets, and Spaces demos',
    icon: '🤗',
    stat: 'Models & Spaces',
  },
  {
    name: 'HackerRank',
    handle: '@sandip_gupta_111',
    href: 'https://www.hackerrank.com/profile/sandip_gupta_111',
    color: '#00d4ff',
    desc: 'Problem solving, Python & AI challenges',
    icon: '⚡',
    stat: 'Gold badges',
  },
  // {
  //   name: 'LinkedIn',
  //   handle: 'sandip-gupta11',
  //   href: 'https://www.linkedin.com/in/sandip-gupta11/',
  //   color: '#0077b5',
  //   desc: 'Professional network, articles & updates',
  //   icon: '💼',
  //   stat: '500+ connections',
  // },
]

// Fake contribution grid (60 weeks × 7 days)
function ContribGrid() {
  const weeks = 26
  const days = 7
  const levels = [0, 0, 0, 1, 1, 2, 2, 3, 4]

  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const isWeekend = d === 0 || d === 6
      const base = isWeekend ? [0, 0, 1] : levels
      return base[Math.floor(Math.random() * base.length)]
    })
  )

  const colors = ['var(--bd)', 'rgba(108,99,255,0.25)', 'rgba(108,99,255,0.5)', 'rgba(108,99,255,0.75)', '#6c63ff']

  return (
    <div>
      <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '4px' }}>
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {week.map((level, di) => (
              <motion.div
                key={di}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (wi * 7 + di) * 0.002, duration: 0.2 }}
                whileHover={{ scale: 1.6 }}
                title={`Level ${level}`}
                style={{ width: '11px', height: '11px', borderRadius: '2px', background: colors[level], cursor: 'default', flexShrink: 0 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>Less</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />
        ))}
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>More</span>
      </div>
    </div>
  )
}

// Fake pinned repos
const PINNED = [
  { name: 'agentic-portfolio-bot', desc: 'AI chatbot for portfolio using Groq + RAG + FastAPI', stars: 12, forks: 3, lang: 'Python', langColor: '#3572A5' },
  { name: 'llm-document-qa', desc: 'LlamaIndex-powered document Q&A with streaming', stars: 8, forks: 2, lang: 'Python', langColor: '#3572A5' },
  { name: 'multi-agent-orchestrator', desc: 'LangChain multi-agent system with tool use', stars: 15, forks: 5, lang: 'Python', langColor: '#3572A5' },
  { name: 'sandip-portfolio', desc: 'My personal portfolio — React + FastAPI + Supabase', stars: 6, forks: 1, lang: 'TypeScript', langColor: '#3178c6' },
]

const ease = [0.21, 0.47, 0.32, 0.98] as const

export default function GitHub() {
  return (
    <section id="platforms" style={{ padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Platforms" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Find Me <span className="gradient-text">Everywhere</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              I build in public, share my work, and engage with the AI community across multiple platforms.
            </p>
          </FadeUp>
        </div>

        {/* Platform cards */}
        <StaggerContainer stagger={0.1} className="">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px', marginBottom: '4rem' }}>
            {PLATFORMS.map(p => (
              <StaggerItem key={p.name}>
                {/* <motion.a
                  href={p.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -5, borderColor: p.color + '60', boxShadow: `0 12px 32px ${p.color}18` }}
                  style={{ display: 'block', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', textDecoration: 'none', transition: 'border-color 0.25s, box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 0 0 80px', background: `${p.color}08`, pointerEvents: 'none' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>{p.icon}</span>
                    <ExternalLink size={14} style={{ color: 'var(--text-3)' }} />
                  </div>

                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '3px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: p.color, marginBottom: '8px' }}>{p.handle}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>{p.desc}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', padding: '3px 10px', borderRadius: '6px', background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}25`, display: 'inline-block' }}>
                    {p.stat}
                  </div>
                </motion.a> */}
                <motion.a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, borderColor: p.color + '60', boxShadow: `0 12px 32px ${p.color}18` }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',

                    padding: '1.5rem',
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--bd)',
                    textDecoration: 'none',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      borderRadius: '0 0 0 80px',
                      background: `${p.color}08`,
                      pointerEvents: 'none'
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px', lineHeight: 1 }}>{p.icon}</span>
                      <ExternalLink size={14} style={{ color: 'var(--text-3)' }} />
                    </div>

                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '3px' }}>
                      {p.name}
                    </div>

                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: p.color, marginBottom: '8px' }}>
                      {p.handle}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-2)',
                        lineHeight: 1.6,
                        marginBottom: '12px'
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: `${p.color}12`,
                      color: p.color,
                      border: `1px solid ${p.color}25`,
                      display: 'inline-block'
                    }}
                  >
                    {p.stat}
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* GitHub contribution graph */}
        <FadeUp>
          <div style={{ padding: '2rem', borderRadius: '20px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Github size={20} style={{ color: '#6c63ff' }} />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)' }}>GitHub Activity</span>
              </div>
              <motion.a
                href="https://github.com/GuptaSandip" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontFamily: 'monospace', color: '#6c63ff', textDecoration: 'none' }}
              >
                @GuptaSandip <ExternalLink size={11} />
              </motion.a>
            </div>
            <ContribGrid />
          </div>
        </FadeUp>

        {/* Pinned repos */}
        <FadeUp delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Code2 size={16} style={{ color: '#6c63ff' }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)' }}>Pinned Repositories</span>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {PINNED.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={`https://github.com/GuptaSandip/${repo.name}`}
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              whileHover={{ y: -3, borderColor: 'rgba(108,99,255,0.4)' }}
              style={{ display: 'block', padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', textDecoration: 'none', transition: 'border-color 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6c63ff', boxShadow: '0 0 8px rgba(108,99,255,0.5)' }} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '13px', color: '#6c63ff' }}>{repo.name}</span>
                </div>
                <ExternalLink size={12} style={{ color: 'var(--text-3)' }} />
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '12px' }}>{repo.desc}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: repo.langColor, display: 'inline-block' }} />
                  {repo.lang}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                  <Star size={11} /> {repo.stars}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                  <GitFork size={11} /> {repo.forks}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}