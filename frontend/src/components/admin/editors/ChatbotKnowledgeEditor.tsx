import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw, Eye, EyeOff, BookOpen, Search } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '',
  content: '',
  category: 'general',
  is_active: true,
}

export default function ChatbotKnowledgeEditor() {
  const [knowledge, setKnowledge] = useState<any[]>([])
  const [editing, setEditing]     = useState<any | null>(null)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    adminApi.getKnowledge()
      .then(setKnowledge)
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.title || !editing.content) {
      toast.error('Title and content are required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateKnowledge(editing.id, editing)
        setKnowledge(k => k.map(x => x.id === editing.id ? u : x))
        toast.success('Entry updated!')
      } else {
        const c = await adminApi.createKnowledge(editing)
        setKnowledge(k => [c, ...k])
        toast.success('Entry created!')
      }
      setEditing(null)
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this entry?')) return
    try {
      await adminApi.deleteKnowledge(id)
      setKnowledge(k => k.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const filtered = knowledge.filter(k => 
    k.title.toLowerCase().includes(search.toLowerCase()) || 
    k.content.toLowerCase().includes(search.toLowerCase()) ||
    k.category.toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Chatbot Knowledge</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
            {knowledge.length} entries · Used to feed the RAG system
          </p>
        </div>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Entry
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input className="field" placeholder="Search knowledge base..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '34px' }} />
      </div>

      {/* Editor form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.35)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', margin: 0 }}>
                {editing.id ? 'Edit Entry' : 'New Entry'}
              </p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Title *</label>
                <input className="field" placeholder="Entry Title" value={editing.title}
                  onChange={e => setEditing((x: any) => ({ ...x, title: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select className="field" value={editing.category}
                  onChange={e => setEditing((x: any) => ({ ...x, category: e.target.value }))}>
                  <option value="general">General</option>
                  <option value="services">Services</option>
                  <option value="pricing">Pricing</option>
                  <option value="tech">Technical</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Content *</label>
              <textarea className="field" rows={6} placeholder="Detailed content for the chatbot to learn from..."
                value={editing.content}
                onChange={e => setEditing((x: any) => ({ ...x, content: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.is_active}
                  onChange={e => setEditing((x: any) => ({ ...x, is_active: e.target.checked }))}
                  style={{ accentColor: '#6c63ff' }} />
                Is Active
              </label>
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />}
              {saving ? 'Saving…' : 'Save Entry'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(k => (
          <motion.div key={k.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', gap: '12px', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{k.title}</span>
                <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(108,99,255,0.1)', color: '#a8a8ff', border: '1px solid rgba(108,99,255,0.2)' }}>{k.category.toUpperCase()}</span>
                {!k.is_active && <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>INACTIVE</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditing({ ...k })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', fontSize: '14px' }}>✏️</button>
                <button onClick={() => del(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
              {k.content}
            </p>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
            {search ? 'No matches found.' : 'Knowledge base is empty.'}
          </p>
        )}
      </div>
    </div>
  )
}
