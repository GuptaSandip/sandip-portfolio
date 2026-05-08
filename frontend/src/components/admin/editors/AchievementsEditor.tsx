import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const CATS = ['patent', 'award', 'publication', 'certification', 'milestone', 'other']
const EMPTY = { title: '', description: '', category: 'award', issuer: '', issued_date: '', credential_url: '', display_order: 0, is_visible: false }

export default function AchievementsEditor() {
  const [items, setItems]     = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    adminApi.getAccomplishments().then(setItems).catch(() => toast.error('Load failed'))
  }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateAccomplishment(editing.id, editing)
        setItems(p => p.map(x => x.id === editing.id ? u : x))
      } else {
        const c = await adminApi.createAccomplishment(editing)
        setItems(p => [...p, c])
      }
      setEditing(null)
      toast.success('Saved!')
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  async function toggle(item: any) {
    const u = await adminApi.updateAccomplishment(item.id, { ...item, is_visible: !item.is_visible })
    setItems(p => p.map(x => x.id === item.id ? u : x))
    toast.success(u.is_visible ? 'Now visible on site!' : 'Hidden from site')
  }

  async function del(id: string) {
    if (!confirm('Delete this achievement?')) return
    await adminApi.deleteAccomplishment(id)
    setItems(p => p.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: 0 }}>Achievements</h1>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Achievement
        </motion.button>
      </div>
      <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', marginBottom: '1.5rem' }}>
        Section is completely hidden on public site until you add at least one visible achievement.
      </p>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{editing.id ? 'Edit' : 'New Achievement'}</p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Title *</label>
                <input className="field" value={editing.title} onChange={e => setEditing((x: any) => ({ ...x, title: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select className="field" value={editing.category} onChange={e => setEditing((x: any) => ({ ...x, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea className="field" rows={3} value={editing.description} onChange={e => setEditing((x: any) => ({ ...x, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Issuer / Organisation</label>
                <input className="field" placeholder="e.g. Google, Patent Office" value={editing.issuer} onChange={e => setEditing((x: any) => ({ ...x, issuer: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Date</label>
                <input className="field" type="date" value={editing.issued_date} onChange={e => setEditing((x: any) => ({ ...x, issued_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="field-label">Credential / Proof URL</label>
              <input className="field" placeholder="https://..." value={editing.credential_url} onChange={e => setEditing((x: any) => ({ ...x, credential_url: e.target.value }))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_visible} onChange={e => setEditing((x: any) => ({ ...x, is_visible: e.target.checked }))} style={{ accentColor: '#6c63ff' }} />
              Make visible on public site immediately
            </label>
            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />} Save
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(item => (
          <motion.div key={item.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', gap: '12px', transition: 'border-color 0.2s' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', marginTop: '2px' }}>{item.category} · {item.issuer || 'No issuer'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.button onClick={() => toggle(item)} whileHover={{ scale: 1.1 }}
                title={item.is_visible ? 'Hide from site' : 'Show on site'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: item.is_visible ? '#34d399' : 'var(--text-3)' }}>
                {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </motion.button>
              <motion.button onClick={() => setEditing({ ...item })} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
              <motion.button onClick={() => del(item.id)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
            No achievements yet. Once you add one and mark it visible, the Achievements section appears on the public site.
          </p>
        )}
      </div>
    </div>
  )
}