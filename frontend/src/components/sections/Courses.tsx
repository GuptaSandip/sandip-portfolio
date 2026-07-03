import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, ChevronRight, Zap, Star } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem, SectionLabel } from './AnimatedSection'
import { getCourses } from '@/lib/supabase'
import type { Course } from '@/types'

const LEVEL_COLOR: Record<string, string> = {
  beginner: '#34d399',
  intermediate: '#fbbf24',
  advanced: '#f472b6',
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCourses()
      .then(d => setCourses(d ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  // Hidden completely if no visible courses
  if (!loading && courses.length === 0) return null

  if (loading) {
    return (
      <section id="courses" style={{ padding: '7rem 1.75rem' }}>
        <div style={{ maxWidth: '68rem', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </section>
    )
  }

  return (
    <section id="courses" style={{ padding: '7rem 1.75rem', position: 'relative' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel text="Courses" />
          <FadeUp delay={0.05}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-1)', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Learn <span className="gradient-text">AI With Me</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              Structured, practical courses on Data Science, ML, Gen AI and Agentic systems — taught by a practitioner.
            </p>
          </FadeUp>
        </div>

        <StaggerContainer stagger={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {courses.map(course => {
              const levelColor = LEVEL_COLOR[course.level] ?? 'var(--accent)'
              return (
                <StaggerItem key={course.id}>
                  <motion.div
                    className="surface-card"
                    whileHover={{ y: -4, borderColor: 'rgba(184,137,82,0.35)' }}
                    style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.25s, transform 0.25s', cursor: 'pointer' }}
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    {/* Thumbnail */}
                    <div style={{ height: '180px', background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-panel)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))', pointerEvents: 'none' }} />

                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '3px 10px', borderRadius: '6px', background: `${levelColor}25`, color: levelColor, border: `1px solid ${levelColor}40`, backdropFilter: 'blur(8px)' }}>
                          {course.level}
                        </span>
                        {course.is_free && (
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '3px 10px', borderRadius: '6px', background: 'rgba(52,211,153,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)', backdropFilter: 'blur(8px)' }}>
                            FREE
                          </span>
                        )}
                      </div>

                      {/* icon if no thumbnail */}
                      {!course.thumbnail_url && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={48} style={{ color: 'rgba(184,137,82,0.4)' }} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '17px', color: 'var(--text-1)', lineHeight: 1.3, margin: 0 }}>
                        {course.title}
                      </h3>

                      {course.short_desc && (
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
                          {course.short_desc}
                        </p>
                      )}

                      {/* Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto', paddingTop: '8px' }}>
                        {course.duration_weeks && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                            <Clock size={12} /> {course.duration_weeks} weeks
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                          <Zap size={12} /> {course.level}
                        </span>
                      </div>

                      {/* Price + CTA */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--bd)' }}>
                        <div>
                          {course.is_free ? (
                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '18px', color: '#34d399' }}>Free</span>
                          ) : (
                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-1)' }}>₹{course.price}</span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          onClick={e => { e.stopPropagation(); navigate(`/courses/${course.slug}`) }}
                        >
                          {course.enrollment_open ? 'Enroll Now' : 'View Course'} <ChevronRight size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}



