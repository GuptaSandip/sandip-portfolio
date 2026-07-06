import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminApi } from '@/lib/api'
import { FolderKanban, MessageSquare, Users, BookOpen, Trophy, ExternalLink } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ y: -3, borderColor: color + '50' }}
      style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s', color: 'var(--text-card-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '2rem', color: 'var(--text-card-1)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', marginTop: '6px' }}>{sub}</div>}
    </motion.div>
  )
}

export default function Overview() {
  const [stats, setStats] = useState({ projects: 0, leads: 0, enrollments: 0, courses: 0, achievements: 0, unread: 0 })

  useEffect(() => {
    function count(result: PromiseSettledResult<any>) {
      return result.status === 'fulfilled' && Array.isArray(result.value) ? result.value.length : 0
    }

    Promise.allSettled([
      adminApi.getProjects(),
      adminApi.getLeads(),
      adminApi.getEnrollments(),
      adminApi.getCourses(),
      adminApi.getAccomplishments(),
    ]).then(([p, l, e, c, a]) => {
      setStats({
        projects:     count(p),
        leads:        count(l),
        enrollments:  count(e),
        courses:      count(c),
        achievements: count(a),
        unread:       l.status === 'fulfilled' && Array.isArray(l.value) ? l.value.filter((x: any) => !x.is_read).length : 0,
      })
    })
  }, [])

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '24px', color: 'var(--text-1)', margin: '0 0 6px' }}>Welcome back, Sandip 👋</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-2)', fontFamily: 'monospace' }}>Here's your portfolio at a glance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '2.5rem' }}>
        <StatCard icon={FolderKanban} label="Projects"    value={stats.projects}     color="#fbbf24" sub="publicly visible" />
        <StatCard icon={Trophy}       label="Achievements" value={stats.achievements} color="#f472b6" />
        <StatCard icon={BookOpen}     label="Courses"     value={stats.courses}       color="#a78bfa" />
        <StatCard icon={Users}        label="Enrollments" value={stats.enrollments}   color="#34d399" sub="total signups" />
        <StatCard icon={MessageSquare} label="Leads"      value={stats.leads}         color="#00d4ff" sub={stats.unread > 0 ? `${stats.unread} unread` : 'all read'} />
      </div>

      {/* Quick links */}
      <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)' }}>
        <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Quick Actions</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { label: '+ Add Project',      href: '/admin/projects' },
            { label: '+ Add Achievement',  href: '/admin/achievements' },
            { label: '+ Create Course',    href: '/admin/courses' },
            { label: 'Upload Resume',      href: '/admin/resume' },
            { label: 'View Chat Leads',    href: '/admin/leads' },
          ].map(({ label, href }) => (
            <motion.a key={label} href={href} whileHover={{ scale: 1.04 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--bd)', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)'; e.currentTarget.style.color = '#6c63ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.color = 'var(--text-2)' }}>
              {label}
            </motion.a>
          ))}
          <motion.a href="/" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--bd)', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)', textDecoration: 'none' }}>
            View Live Site <ExternalLink size={11} />
          </motion.a>
        </div>
      </div>
    </div>
  )
}