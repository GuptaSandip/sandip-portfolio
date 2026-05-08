import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Terminal, Heart } from 'lucide-react'

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
  { icon: Linkedin, href: 'https://linkedin.com/in/sandip-gupta11/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/guptasandip11', label: 'Twitter' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{ borderTop: '1px solid var(--bd)', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Terminal size={14} style={{ color: '#6c63ff' }} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text-1)' }}>
                sandip<span style={{ color: '#6c63ff' }}>.</span>dev
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65, maxWidth: '240px' }}>
              AI Engineer & Master Trainer. Building intelligent systems, teaching others to think in AI.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Navigation</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {LINKS.map(link => (
                <button key={link.label} onClick={() => scrollTo(link.href)}
                  style={{ textAlign: 'left', fontSize: '13px', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#6c63ff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Built With</p>
            {['Agentic AI Stack', 'AI Architecture', 'Systems & Tools', 'AI Frameworks', 'AI Products', 'Production Grade Code'].map(item => (
              <div key={item} style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6c63ff', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '1.5rem', borderTop: '1px solid var(--bd)' }}>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            © {year} Sandip Gupta. Made with <Heart size={11} style={{ color: '#f472b6', fill: '#f472b6' }} /> in India.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.2, color: '#6c63ff' }}
                style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.15s' }}>
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}