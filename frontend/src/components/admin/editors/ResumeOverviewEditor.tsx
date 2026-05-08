import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Core Skills' },
  { id: 'education',  label: 'Education' },
  { id: 'highlights', label: 'Highlights' },
]

const EMPTY = { category: 'experience', label: '', sub: '', display_order: 0 }

export default function ResumeOverviewEditor() {
  const [items, setItems]     = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getResumeOverview()
      .then(setItems)
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.label) {
      toast.error('Label is required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateResumeOverview(editing.id, editing)
        setItems(p => p.map(x => x.id === editing.id ? u : x))
        toast.success('Updated!')
      } else {
        const c = await adminApi.createResumeOverview(editing)
        setItems(p => [...p, c])
        toast.success('Created!')
      }
      setEditing(null)
    } catch (e: any) {
      toast.error(`Save failed: ${e.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this item?')) return
    try {
      await adminApi.deleteResumeOverview(id)
      setItems(p => p.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Resume Quick Overview</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>Manage the 4 key blocks in your Resume section.</p>
        </div>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Item
        </motion.button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{editing.id ? 'Edit Item' : 'New Item'}</p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Category</label>
                <select className="field" value={editing.category} onChange={e => setEditing((x: any) => ({ ...x, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Display Order</label>
                <input className="field" type="number" value={editing.display_order} onChange={e => setEditing((x: any) => ({ ...x, display_order: +e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="field-label">Label (Title) *</label>
              <input className="field" placeholder="e.g. Master Trainer" value={editing.label} onChange={e => setEditing((x: any) => ({ ...x, label: e.target.value }))} />
            </div>

            <div>
              <label className="field-label">Subtext (Date or description)</label>
              <input className="field" placeholder="e.g. Apr 2025 – Present" value={editing.sub} onChange={e => setEditing((x: any) => ({ ...x, sub: e.target.value }))} />
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '8px' }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />} Save Item
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat.id).sort((a,b) => a.display_order - b.display_order)
          return (
            <div key={cat.id}>
              <h2 style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ height: '1px', width: '20px', background: 'rgba(108,99,255,0.3)' }} />
                {cat.label}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {catItems.map(item => (
                  <motion.div key={item.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace' }}>{item.sub}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button onClick={() => setEditing({ ...item })} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
                      <motion.button onClick={() => del(item.id)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
                    </div>
                  </motion.div>
                ))}
                {catItems.length === 0 && (
                  <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '11px', paddingLeft: '28px' }}>No items in this category.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
