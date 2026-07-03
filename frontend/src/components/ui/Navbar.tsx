import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const LINKEDIN = 'https://www.linkedin.com/in/sandipgupta-ai/'

const NAV_LINKS = [
  { label: 'Home',       href: 'hero' },
  { label: 'About',      href: 'about' },
  { label: 'Projects',   href: 'projects' },
  { label: 'Experience', href: 'about' },
  { label: 'Contact',    href: 'contact' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [active, setActive]     = useState('hero')
  const { theme, toggle }       = useTheme()

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href)
    const fn = () => {
      const y = window.scrollY + 140
      let current = 'hero'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function scrollTo(id: string) {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <>
      <header className="nav-pill-wrapper">
        <nav className="nav-pill">
          {/* Brand */}
          <Link to="/" className="nav-brand" onClick={e => { e.preventDefault(); scrollTo('hero') }}>
            <img src="/logo-sg.png" alt="SG" className="nav-logo" />
            <div className="nav-brand-text">
              <span className="nav-name">SANDIP GUPTA</span>
              <span className="nav-title">AI Engineer<span className="nav-dot">·</span></span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links hidden lg:flex">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`nav-link${active === link.href ? ' nav-link--active' : ''}`}
              >
                {link.label}
                {active === link.href && <span className="nav-link-underline" />}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="nav-actions">
            <button onClick={toggle} className="nav-theme-btn hidden md:flex" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="nav-menu-btn lg:hidden"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={16} color="#E8E0D0" /> : <Menu size={16} color="#E8E0D0" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="nav-mobile-overlay" onClick={() => setOpen(false)}>
          <div className="nav-mobile-panel surface-card" onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`nav-mobile-link${active === link.href ? ' nav-mobile-link--active' : ''}`}
              >
                {link.label}
              </button>
            ))}
            <button onClick={toggle} className="nav-mobile-theme">
              {theme === 'dark' ? <><Sun size={15} /> Light mode</> : <><Moon size={15} /> Dark mode</>}
            </button>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="nav-mobile-link" style={{ textDecoration: 'none' }}>
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export function ScrollHint() {
  function scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button className="scroll-hint" onClick={scrollToAbout} aria-label="Scroll to explore">
      <span className="scroll-hint-label">Scroll</span>
      <span className="scroll-hint-arrow">
        <ChevronDown size={18} strokeWidth={1.5} />
      </span>
    </button>
  )
}
