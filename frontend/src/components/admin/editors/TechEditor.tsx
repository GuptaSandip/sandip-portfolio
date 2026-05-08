import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const TECH_CATS = ['language', 'framework', 'tool', 'cloud', 'database', 'ai_ml', 'other']
const EMPTY = { name: '', category: 'ai_ml', icon_slug: '', level: 4, display_order: 0, is_visible: true }

export default function TechEditor() {
  const [items, setItems]     = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    adminApi.getTech().then(setItems).catch(() => toast.error('Load failed'))
  }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateTech(editing.id, editing)
        setItems(p => p.map(x => x.id === editing.id ? u : x))
      } else {
        const c = await adminApi.createTech(editing)
        setItems(p => [...p, c])
      }
      setEditing(null)
      toast.success('Saved!')
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this skill?')) return
    await adminApi.deleteTech(id)
    setItems(p => p.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: 0 }}>Tech Stack</h1>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Skill
        </motion.button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{editing.id ? 'Edit Skill' : 'New Skill'}</p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Name *</label>
                <input className="field" value={editing.name} onChange={e => setEditing((x: any) => ({ ...x, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select className="field" value={editing.category} onChange={e => setEditing((x: any) => ({ ...x, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {TECH_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Level (1-5)</label>
                <input className="field" type="number" min={1} max={5} value={editing.level} onChange={e => setEditing((x: any) => ({ ...x, level: +e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Icon Slug (e.g. python, react)</label>
                <input className="field" placeholder="python" value={editing.icon_slug} onChange={e => setEditing((x: any) => ({ ...x, icon_slug: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Display Order</label>
                <input className="field" type="number" value={editing.display_order} onChange={e => setEditing((x: any) => ({ ...x, display_order: +e.target.value }))} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_visible} onChange={e => setEditing((x: any) => ({ ...x, is_visible: e.target.checked }))} style={{ accentColor: '#6c63ff' }} />
              Visible on public site
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
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{item.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}>{item.category} · level {item.level}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.button onClick={() => setEditing({ ...item })} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
              <motion.button onClick={() => del(item.id)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>No skills yet.</p>
        )}
      </div>
    </div>
  )
}