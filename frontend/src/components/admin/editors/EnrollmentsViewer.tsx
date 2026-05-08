import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, BookOpen, Download } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const STATUS_COLOR: Record<string, string> = {
  pending:    '#fbbf24',
  approved:   '#34d399',
  rejected:   '#f87171',
  waitlisted: '#a78bfa',
}

export default function EnrollmentsViewer() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')
  const [updating, setUpdating]       = useState<string | null>(null)

  useEffect(() => {
    adminApi.getEnrollments()
      .then(setEnrollments)
      .catch(() => toast.error('Load failed — check backend'))
      .finally(() => setLoading(false))
  }, [])

  // Fix 7 — working status update
  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    try {
      const base  = import.meta.env.VITE_API_URL || ''
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${base}/api/admin/enrollments/${id}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      setEnrollments(p => p.map(x => x.id === id ? { ...x, status: updated.status } : x))
      toast.success(`Status → ${status}`)
    } catch (e: any) {
      toast.error(`Update failed: ${e.message}`)
    } finally {
      setUpdating(null)
    }
  }

  // Fix 4 — CSV export
  function exportCSV() {
    const rows = filtered
    const headers = ['Name', 'Email', 'Phone', 'Course', 'Goal', 'Status', 'Enrolled At']
    const csv = [
      headers.join(','),
      ...rows.map(e => [
        `"${e.name || ''}"`,
        `"${e.email || ''}"`,
        `"${e.phone || ''}"`,
        `"${e.courses?.title || ''}"`,
        `"${(e.goal || '').replace(/"/g, '""')}"`,
        `"${e.status || ''}"`,
        `"${e.enrolled_at ? new Date(e.enrolled_at).toLocaleString() : ''}"`,
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'enrollments.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV downloaded!')
  }

  const filtered = filter === 'all' ? enrollments : enrollments.filter(e => e.status === filter)

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>
            Enrollments <span style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 400 }}>({enrollments.length})</span>
          </h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
            Students who applied for your courses.
          </p>
        </div>
        <motion.button onClick={exportCSV} whileHover={{ scale: 1.04 }} className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px' }}>
          <Download size={14} /> Export CSV
        </motion.button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected', 'waitlisted'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '5px 14px', borderRadius: '7px', border: `1px solid ${filter === s ? (STATUS_COLOR[s] || '#6c63ff') + '60' : 'var(--bd)'}`, background: filter === s ? `${STATUS_COLOR[s] || '#6c63ff'}12` : 'transparent', color: filter === s ? (STATUS_COLOR[s] || '#6c63ff') : 'var(--text-2)', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.15s' }}>
            {s} {s !== 'all' && `(${enrollments.filter(e => e.status === s).length})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(e => (
          <motion.div key={e.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', marginBottom: '5px' }}>{e.name}</div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {e.email && (
                    <a href={`mailto:${e.email}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#6c63ff', textDecoration: 'none' }}>
                      <Mail size={11} /> {e.email}
                    </a>
                  )}
                  {e.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
                      <Phone size={11} /> {e.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Status dropdown — Fix 7 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {updating === e.id && (
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                )}
                <select
                  value={e.status}
                  disabled={updating === e.id}
                  onChange={ev => updateStatus(e.id, ev.target.value)}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${STATUS_COLOR[e.status] ?? '#6c63ff'}40`, background: `${STATUS_COLOR[e.status] ?? '#6c63ff'}12`, color: STATUS_COLOR[e.status] ?? '#6c63ff', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved ✓</option>
                  <option value="rejected">Rejected ✗</option>
                  <option value="waitlisted">Waitlisted</option>
                </select>
              </div>
            </div>

            {e.courses?.title && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontFamily: 'monospace', color: '#a8a8ff', marginBottom: '8px' }}>
                <BookOpen size={11} /> {e.courses.title}
              </div>
            )}

            {e.goal && (
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65, margin: '0 0 10px', padding: '10px 14px', background: 'var(--bg-panel)', borderRadius: '8px', border: '1px solid var(--bd)' }}>
                "{e.goal}"
              </p>
            )}

            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
              {new Date(e.enrolled_at).toLocaleString()}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '3rem' }}>
            {filter === 'all' ? 'No enrollments yet.' : `No ${filter} enrollments.`}
          </p>
        )}
      </div>
    </div>
  )
}