import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { adminApi } from '@/lib/api'

const EMPTY = {
  role:         '',
  company:      '',
  start_date:   '',
  end_date:     '',
  is_current:   false,
  description:  '',
  display_order: 0,
}

export default function ExperienceEditor() {
  const [items, setItems]     = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getExperience()
      .then(setItems)
      .catch(e => toast.error(`Load failed: ${e.message}`))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.role || !editing.company || !editing.start_date) {
      toast.error('Role, company and start date are required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateExperience(editing.id, editing)
        setItems(p => p.map(x => x.id === editing.id ? u : x))
        toast.success('Experience updated!')
      } else {
        const c = await adminApi.createExperience(editing)
        setItems(p => [...p, c])
        toast.success('Experience added!')
      }
      setEditing(null)
    } catch (e: any) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this experience entry?')) return
    try {
      await adminApi.deleteExperience(id)
      setItems(p => p.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch (e: any) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Experience</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>Manage your career timeline. Shows on the About section.</p>
        </div>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Experience
        </motion.button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.35)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', margin: 0 }}>{editing.id ? 'Edit Experience' : 'New Experience'}</p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Role / Title *</label>
                <input className="field" placeholder="Master Trainer" value={editing.role}
                  onChange={e => setEditing((x: any) => ({ ...x, role: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Company / Organisation *</label>
                <input className="field" placeholder="Edunet Foundation" value={editing.company}
                  onChange={e => setEditing((x: any) => ({ ...x, company: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Start Date *</label>
                <input className="field" type="date" value={editing.start_date}
                  onChange={e => setEditing((x: any) => ({ ...x, start_date: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">End Date (leave blank if current)</label>
                <input className="field" type="date" value={editing.end_date || ''}
                  disabled={editing.is_current}
                  onChange={e => setEditing((x: any) => ({ ...x, end_date: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea className="field" rows={3} placeholder="What did you do in this role?"
                value={editing.description}
                onChange={e => setEditing((x: any) => ({ ...x, description: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.is_current}
                  onChange={e => setEditing((x: any) => ({ ...x, is_current: e.target.checked, end_date: e.target.checked ? '' : x.end_date }))}
                  style={{ accentColor: '#6c63ff' }} />
                Current position
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Display Order</label>
                <input className="field" type="number" style={{ width: '70px' }} value={editing.display_order}
                  onChange={e => setEditing((x: any) => ({ ...x, display_order: +e.target.value }))} />
              </div>
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <><RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={13} /> Save</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.sort((a, b) => a.display_order - b.display_order).map(item => (
          <motion.div key={item.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', gap: '12px', transition: 'border-color 0.2s' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{item.role}</span>
                {item.is_current && (
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 7px', borderRadius: '5px', background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>CURRENT</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'monospace', marginTop: '2px' }}>
                {item.company} · {item.start_date?.slice(0, 7)} → {item.is_current ? 'Present' : item.end_date?.slice(0, 7) || '?'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <motion.button onClick={() => setEditing({ ...item })} whileHover={{ scale: 1.1 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
              <motion.button onClick={() => del(item.id)} whileHover={{ scale: 1.1 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
            No experience entries yet. Add your career history above.
          </p>
        )}
      </div>
    </div>
  )
}