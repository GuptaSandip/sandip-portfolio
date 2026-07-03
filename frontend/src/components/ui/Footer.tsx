import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'

const LINKS = [
  { label: 'About', href: 'about' },
  { label: 'Stack', href: 'stack' },
  { label: 'Projects', href: 'projects' },
  { label: 'Platforms', href: 'platforms' },
  { label: 'Resume', href: 'resume' },
  { label: 'Achievements', href: 'achievements' },
  { label: 'Courses', href: 'courses' },
  { label: 'Contact', href: 'contact' },
]

const SOCIALS = [
  { icon: Github, href: 'https://github.com/GuptaSandip', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/sandipgupta-ai/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/guptasandip11', label: 'Twitter' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{ borderTop: '1px solid var(--divider)', padding: '4rem 1.75rem 2.5rem' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src="/logo-sg.png" alt="SG" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-1)' }}>
                Sandip<span style={{ color: 'var(--accent)' }}>.dev</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '260px' }}>
              AI Engineer & Master Trainer. Building intelligent systems, teaching others to think in AI.
            </p>
          </div>

          <div>
            <p className="mono-label" style={{ marginBottom: '16px' }}>Navigation</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {LINKS.map(link => (
                <button key={link.label} onClick={() => scrollTo(link.href)}
                  style={{ textAlign: 'left', fontSize: '0.8125rem', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mono-label" style={{ marginBottom: '16px' }}>Expertise</p>
            {['Agentic AI Stack', 'AI Architecture', 'Systems & Tools', 'AI Frameworks', 'Production Grade Code'].map(item => (
              <div key={item} style={{ fontSize: '0.8125rem', color: 'var(--text-2)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '2rem', borderTop: '1px solid var(--divider)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>
            © {year} Sandip Gupta
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.1, color: 'var(--accent)' }}
                style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.15s' }}>
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
