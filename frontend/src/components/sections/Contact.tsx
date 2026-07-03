import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Github, Linkedin, Twitter, Mail, MapPin, MessageSquare, CheckCircle } from 'lucide-react'
import { FadeUp, SlideLeft, SlideRight, SectionLabel } from './AnimatedSection'

const SOCIALS = [
  { icon: Github,   label: 'GitHub',    href: 'https://github.com/GuptaSandip',                    handle: '@GuptaSandip',              color: 'var(--accent)' },
  { icon: Linkedin, label: 'LinkedIn',  href: 'https://www.linkedin.com/in/sandipgupta-ai/',       handle: 'sandipgupta-ai',            color: '#0077b5' },
  { icon: Twitter,  label: 'X/Twitter', href: 'https://x.com/guptasandip11',                     handle: '@guptasandip11',            color: '#1da1f2' },
  { icon: Mail,     label: 'Email',     href: 'mailto:jobsforsandipgupta@gmail.com',              handle: 'jobsforsandipgupta@gmail.com', color: 'var(--accent)' },
]

const ease = [0.21, 0.47, 0.32, 0.98] as const

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res  = await fetch(`${base}/api/contact/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 6000)
    } catch (err: any) {
      setError('Something went wrong. Please try again or reach out directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" style={{ padding: '7rem 1.75rem', position: 'relative' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Contact" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Let's <span className="gradient-text">Connect</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              Whether it's a project, collaboration, or just a chat about AI — I'm always open to interesting conversations.
            </p>
          </FadeUp>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

          {/* Left */}
          <SlideLeft>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Status */}
              <motion.div whileHover={{ borderColor: 'rgba(184,137,82,0.35)' }} className="surface-card"
                style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'border-color 0.2s' }}>
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '14px', color: 'var(--text-1)', marginBottom: '4px' }}>Open to Opportunities</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>Currently employed full-time but selectively open to interesting freelance and consulting work in AI/ML.</div>
                </div>
              </motion.div>

              {/* Location */}
              <div className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px' }}>
                <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>India · Available Remote</div>
                </div>
              </div>

              {/* Socials */}
              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Find me on</p>
              {SOCIALS.map(({ icon: Icon, label, href, handle, color }, i) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease }}
                  whileHover={{ x: 4, borderColor: 'rgba(184,137,82,0.35)' }}
                  className="surface-card"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '12px', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', fontFamily: 'DM Sans, sans-serif' }}>{label}</div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', marginTop: '1px' }}>{handle}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </SlideLeft>

          {/* Right: Form */}
          <SlideRight>
            <motion.form onSubmit={handleSubmit} className="surface-card"
              style={{ padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <MessageSquare size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)' }}>Send a Message</span>
              </div>

              <div>
                <label className="field-label">Your Name</label>
                <input className="field" type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input className="field" type="email" placeholder="john@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="field-label">Message</label>
                <textarea className="field" placeholder="Tell me about your project or opportunity..." rows={5}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required style={{ resize: 'vertical' }} />
              </div>

              {error && (
                <p style={{ fontSize: '12px', color: '#f87171', fontFamily: 'monospace', margin: 0 }}>{error}</p>
              )}

              <motion.button type="submit" disabled={sending || sent}
                whileHover={!sending && !sent ? { scale: 1.03, boxShadow: '0 0 28px rgba(184,137,82,0.45)' } : {}}
                whileTap={{ scale: 0.97 }} className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
                {sent ? (
                  <><CheckCircle size={15} /> Message Sent! I'll get back to you soon.</>
                ) : sending ? (
                  <><span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Sending…</>
                ) : (
                  <><Send size={15} /> Send Message</>
                )}
              </motion.button>

              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textAlign: 'center' }}>
                I typically respond within 24 hours.
              </p>
            </motion.form>
          </SlideRight>
        </div>
      </div>
    </section>
  )
}