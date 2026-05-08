import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, Terminal } from 'lucide-react'
import { clsx } from 'clsx'
import { useTheme } from '@/context/ThemeContext'

const NAV_LINKS = [
  { label: 'About',    href: 'about'},
  { label: 'Stack',    href: 'stack'},
  { label: 'Projects', href: 'projects'},
  { label: 'Achievements', href: 'achievements'},
  { label: 'Contact',  href: 'contact'},
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle }       = useTheme()
  const isDark                  = theme === 'dark'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
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
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'nav-bg' : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)' }}
            >
              <Terminal size={15} className="text-primary-400" />
            </div>
            <span className="font-display font-bold text-sm tracking-wide" style={{ color: 'var(--text-1)' }}>
              sandip<span className="text-primary-400">.</span>dev
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-3.5 py-1.5 text-sm font-sans rounded-lg transition-all duration-150"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">

            {/* Day / Night toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={clsx(
                'relative w-14 h-7 rounded-full transition-all duration-300 flex items-center',
                isDark ? 'bg-primary-400/20 border border-primary-400/40' : 'bg-amber-100 border border-amber-300'
              )}
            >
              <span
                className={clsx(
                  'absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300',
                  isDark
                    ? 'left-1 bg-primary-400 shadow-glow-sm'
                    : 'left-[calc(100%-1.5rem)] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                )}
              >
                {isDark
                  ? <Moon size={11} className="text-white" />
                  : <Sun  size={11} className="text-white" />
                }
              </span>
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary text-sm py-2 px-5 rounded-xl"
            >
              Let's Talk →
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-2)' }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="p-2 transition-colors"
              style={{ color: 'var(--text-2)' }}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20 px-6"
          style={{ background: 'var(--bg)' }}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-left px-4 py-4 text-lg font-display font-semibold transition-colors"
                style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--bd)' }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => scrollTo('contact')} className="btn-primary w-full">
              Let's Talk →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
