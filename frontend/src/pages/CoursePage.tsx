import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Clock, ChevronRight, CheckCircle,
  ArrowLeft, Zap, Download, IndianRupee,
} from 'lucide-react'
import { getCourseBySlug } from '@/lib/supabase'
import type { Course } from '@/types'
import toast from 'react-hot-toast'

const LEVEL_COLOR: Record<string, string> = {
  beginner: '#34d399',
  intermediate: '#fbbf24',
  advanced: '#f472b6',
}

// Load Razorpay script dynamically
function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [paying, setPaying] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', goal: '' })

  useEffect(() => {
    if (!slug) return
    getCourseBySlug(slug)
      .then(d => setCourse(d))
      .finally(() => setLoading(false))
  }, [slug])

  // ── Razorpay payment flow ──────────────────────────────────
  async function handlePayment() {
    if (!course) return
    const ok = await loadRazorpay()
    if (!ok) {
      toast.error('Payment gateway failed to load. Please try again.')
      return
    }

    if (!form.name || !form.email) {
      toast.error('Please fill in your name and email first.')
      return
    }

    setPaying(true)
    try {
      // Create order on backend
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          amount: course.price,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      })
      if (!res.ok) throw new Error('Order creation failed')
      const order = await res.json()

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Sandip Gupta Courses',
        description: course.title,
        order_id: order.razorpay_order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#6c63ff' },
        handler: async (response: any) => {
          // Verify payment on backend
          const verifyRes = await fetch(`${base}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              course_id: course.id,
              name: form.name,
              email: form.email,
              phone: form.phone,
              goal: form.goal,
            }),
          })
          if (verifyRes.ok) {
            setEnrolled(true)
            toast.success('Payment successful! You are enrolled.')
          } else {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: {
          ondismiss: () => { setPaying(false) },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err.message || 'Payment failed. Please try again.')
      setPaying(false)
    }
  }

  // ── Free enrollment ────────────────────────────────────────
  async function handleFreeEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!course) return
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/enrollments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          goal: form.goal,
        }),
      })
      if (!res.ok) throw new Error('Enrollment failed')
      setEnrolled(true)
      toast.success('Enrolled! Sandip will reach out with next steps.')
    } catch (err: any) {
      toast.error(err.message || 'Enrollment failed. Please try again.')
    }
  }

  // ── Brochure download ──────────────────────────────────────
  function handleBrochure() {
    if (!course) return
    // If admin uploaded a brochure PDF, use that; else generate basic one
    const brochureUrl = (course as any).brochure_url
    if (brochureUrl) {
      window.open(brochureUrl, '_blank')
    } else {
      // Generate a simple text brochure
      const content = [
        `COURSE BROCHURE`,
        `================`,
        ``,
        `Course: ${course.title}`,
        `Level: ${course.level}`,
        `Duration: ${course.duration_weeks ? course.duration_weeks + ' weeks' : 'TBD'}`,
        `Price: ${course.is_free ? 'FREE' : '₹' + course.price}`,
        ``,
        `ABOUT THIS COURSE`,
        `-----------------`,
        course.description || course.short_desc || 'Contact for details.',
        ``,
        `CURRICULUM`,
        `----------`,
        ...(Array.isArray(course.curriculum) && course.curriculum.length > 0
          ? course.curriculum.map((w: any, i: number) => `Week ${i + 1}: ${w.topic || w.title || 'TBD'}`)
          : ['Contact for full curriculum']),
        ``,
        `INSTRUCTOR`,
        `----------`,
        `Sandip Gupta — Master Trainer, AI Engineer`,
        `LinkedIn: https://linkedin.com/in/sandip-gupta11/`,
        `GitHub: https://github.com/GuptaSandip`,
        ``,
        `To enroll: ${window.location.href}`,
      ].join('\n')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${course.slug}-brochure.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Brochure downloaded!')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--text-1)' }}>Course not found</p>
        <button onClick={() => navigate('/')} className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to home
        </button>
      </div>
    )
  }

  const levelColor = LEVEL_COLOR[course.level] ?? '#6c63ff'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.09), rgba(0,212,255,0.04))', borderBottom: '1px solid var(--bd)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <button onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}>
            <ArrowLeft size={13} /> Back
          </button>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '4px 12px', borderRadius: '8px', background: `${levelColor}18`, color: levelColor, border: `1px solid ${levelColor}35` }}>{course.level}</span>
            {course.is_free && <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '4px 12px', borderRadius: '8px', background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>FREE</span>}
            {course.enrollment_open && <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '4px 12px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', color: '#a8a8ff', border: '1px solid rgba(108,99,255,0.25)' }}>Enrollment Open</span>}
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text-1)', marginBottom: '12px', lineHeight: 1.2 }}>{course.title}</h1>
          {course.short_desc && <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: '48rem', marginBottom: '1.5rem' }}>{course.short_desc}</p>}

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {course.duration_weeks && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
                <Clock size={14} style={{ color: '#6c63ff' }} /> {course.duration_weeks} weeks
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
              <Zap size={14} style={{ color: '#6c63ff' }} /> {course.level}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
              <BookOpen size={14} style={{ color: '#6c63ff' }} /> {Array.isArray(course.curriculum) ? course.curriculum.length : 0} modules
            </span>
            {/* Brochure download button */}
            <motion.button onClick={handleBrochure} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 14px' }}>
              <Download size={13} /> Download Brochure
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

        {/* Left: Course details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {course.description && (
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--text-1)', marginBottom: '12px' }}>About this course</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8 }}>{course.description}</p>
            </div>
          )}

          {Array.isArray(course.curriculum) && course.curriculum.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--text-1)', marginBottom: '16px' }}>Curriculum</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(course.curriculum as any[]).map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontFamily: 'monospace', color: '#6c63ff', fontWeight: 700 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '3px' }}>{item.topic ?? item.title ?? `Module ${i + 1}`}</div>
                      {item.details && <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>{item.details}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Enrollment card */}
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ padding: '2rem', borderRadius: '20px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.25)', position: 'sticky', top: '90px', boxShadow: '0 12px 40px rgba(108,99,255,0.12)' }}>

            {/* Price */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '28px', color: 'var(--text-1)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {course.is_free
                  ? <span style={{ color: '#34d399' }}>Free</span>
                  : <><IndianRupee size={22} style={{ color: 'var(--text-1)' }} />{course.price}</>
                }
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                {course.is_free
                  ? 'Fill the form and Sandip will reach out with details.'
                  : 'Secure payment via Razorpay. Instant access after payment.'
                }
              </p>
            </div>

            {enrolled ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '2rem', borderRadius: '14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <CheckCircle size={40} style={{ color: '#34d399', margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '6px' }}>
                  {course.is_free ? "You're enrolled!" : "Payment Successful!"}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Sandip will reach out to you shortly with next steps.</p>
              </motion.div>
            ) : (
              <form onSubmit={course.is_free ? handleFreeEnroll : e => { e.preventDefault(); handlePayment() }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="field-label">Full Name *</label>
                  <input className="field" type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input className="field" type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="field-label">Phone (optional)</label>
                  <input className="field" type="tel" placeholder="+91 98765 43210" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Why do you want to join?</label>
                  <textarea className="field" rows={3} placeholder="Your learning goals..." value={form.goal}
                    onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>

                <motion.button type="submit" disabled={paying}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(108,99,255,0.4)' }} whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
                  {paying
                    ? <><span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Processing…</>
                    : course.is_free
                      ? <><ChevronRight size={15} /> Enroll Now — Free</>
                      : <><IndianRupee size={14} /> Pay ₹{course.price} & Enroll</>
                  }
                </motion.button>

                {!course.is_free && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Secured by Razorpay · SSL encrypted
                  </div>
                )}

                <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textAlign: 'center' }}>
                  {course.is_free ? 'No payment required until confirmed.' : 'Refund policy: Contact within 7 days.'}
                </p>
              </form>
            )}

            {/* Brochure button in card too */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--bd)' }}>
              <motion.button onClick={handleBrochure} whileHover={{ scale: 1.02 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '10px', border: '1px solid var(--bd)', background: 'transparent', color: 'var(--text-2)', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bd)')}>
                <Download size={13} /> Download Course Brochure
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}