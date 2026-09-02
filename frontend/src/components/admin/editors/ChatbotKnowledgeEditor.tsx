import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw, Eye, EyeOff, BookOpen, Search, Zap } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '',
  content: '',
  question: '',
  answer: '',
  category: 'general',
  is_active: true,
  source_type: 'manual',
}

export default function ChatbotKnowledgeEditor() {
  const [knowledge, setKnowledge] = useState<any[]>([])
  const [editing, setEditing]     = useState<any | null>(null)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [syncing, setSyncing]     = useState(false)
  const [search, setSearch]       = useState('')
  const [showManualOnly, setShowManualOnly] = useState(false)

  useEffect(() => {
    loadKnowledge()
  }, [])

  async function loadKnowledge() {
    setLoading(true)
    try {
      const data = await adminApi.getKnowledge()
      setKnowledge(data)
    } catch {
      toast.error('Load failed')
    } finally {
      setLoading(false)
    }
  }

  async function syncProjects() {
    setSyncing(true)
    try {
      const response = await adminApi.post('/admin/knowledge/sync-projects', {})
      if (response.status === 'success') {
        toast.success(response.message || `Synced ${response.synced} sections`)
      } else {
        toast.error(response.message || 'Sync completed with errors')
      }
      await loadKnowledge()
    } catch (err: any) {
      const errorMsg = err.message || 'Sync failed - check server logs'
      toast.error(errorMsg)
      console.error('[sync error]', err)
    } finally {
      setSyncing(false)
    }
  }

  async function save() {
    if (!editing.title || (!editing.content && !editing.answer)) {
      toast.error('Title and (Content or Answer) are required')
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

  const manualKnowledge = knowledge.filter(k => k.source_type !== 'auto')
  const autoKnowledge = knowledge.filter(k => k.source_type === 'auto')
  
  const display = showManualOnly ? manualKnowledge : knowledge
  const filtered = display.filter(k => 
    k.title.toLowerCase().includes(search.toLowerCase()) || 
    (k.content || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.answer || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.question || '').toLowerCase().includes(search.toLowerCase()) ||
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
    <div style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Smart Chatbot Knowledge</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
            {knowledge.length} total entries · {autoKnowledge.length} auto-synced from portfolio pages · Chatbot uses this to answer questions perfectly
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button 
            onClick={syncProjects} 
            disabled={syncing}
            whileHover={{ scale: 1.04 }} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', fontSize: '14px', cursor: syncing ? 'not-allowed' : 'pointer', opacity: syncing ? 0.6 : 1 }}
            title="Syncs bio, experience, tech stack, courses, achievements, and projects">
            <Zap size={14} /> {syncing ? 'Syncing...' : 'Sync All Pages'}
          </motion.button>
          <motion.button 
            onClick={() => setEditing({ ...EMPTY })} 
            whileHover={{ scale: 1.04 }} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Add Manual Entry
          </motion.button>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="field" placeholder="Search knowledge..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '34px', width: '100%' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={showManualOnly} onChange={e => setShowManualOnly(e.target.checked)} style={{ accentColor: '#6c63ff' }} />
          Manual only
        </label>
      </div>

      {/* Editor Form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.35)', marginBottom: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', margin: 0 }}>
                {editing.id ? 'Edit Entry' : 'New Manual Entry'}
              </p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '14px' }}>
              <label className="field-label">Title *</label>
              <input className="field" placeholder="Entry Title" value={editing.title}
                onChange={e => setEditing((x: any) => ({ ...x, title: e.target.value }))} />
            </div>

            {/* Q&A vs Content mode */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '8px', display: 'block' }}>Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  onClick={() => setEditing((x: any) => ({ ...x, question: x.question || '', answer: x.answer || '' }))}
                  style={{ padding: '10px', borderRadius: '8px', background: editing.question ? 'rgba(108,99,255,0.2)' : 'var(--bg-muted)', border: '1px solid' + (editing.question ? 'rgba(108,99,255,0.5)' : 'var(--bd)'), cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                  Q&A Pair
                </button>
                <button 
                  onClick={() => setEditing((x: any) => ({ ...x, content: x.content || '' }))}
                  style={{ padding: '10px', borderRadius: '8px', background: editing.content && !editing.question ? 'rgba(108,99,255,0.2)' : 'var(--bg-muted)', border: '1px solid' + (editing.content && !editing.question ? 'rgba(108,99,255,0.5)' : 'var(--bd)'), cursor: 'pointer', fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                  Content Block
                </button>
              </div>
            </div>

            {/* Q&A Fields */}
            {editing.question !== undefined && (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label className="field-label">Question</label>
                  <input className="field" placeholder="What is...?" value={editing.question}
                    onChange={e => setEditing((x: any) => ({ ...x, question: e.target.value }))} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label className="field-label">Answer *</label>
                  <textarea className="field" rows={5} placeholder="Provide the answer..."
                    value={editing.answer}
                    onChange={e => setEditing((x: any) => ({ ...x, answer: e.target.value }))}
                    style={{ resize: 'vertical' }} />
                </div>
              </>
            )}

            {/* Content Field */}
            {editing.content !== undefined && !editing.question && (
              <div style={{ marginBottom: '14px' }}>
                <label className="field-label">Content *</label>
                <textarea className="field" rows={6} placeholder="Detailed content for the chatbot to learn from..."
                  value={editing.content}
                  onChange={e => setEditing((x: any) => ({ ...x, content: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
            )}

            {/* Category & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="field-label">Category</label>
                <select className="field" value={editing.category}
                  onChange={e => setEditing((x: any) => ({ ...x, category: e.target.value }))}>
                  <option value="general">General</option>
                  <option value="services">Services</option>
                  <option value="projects">Projects</option>
                  <option value="tech">Technical</option>
                  <option value="education">Education</option>
                  <option value="faq">FAQ</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', marginTop: '26px' }}>
                  <input type="checkbox" checked={editing.is_active}
                    onChange={e => setEditing((x: any) => ({ ...x, is_active: e.target.checked }))}
                    style={{ accentColor: '#6c63ff' }} />
                  Active
                </label>
              </div>
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />}
              {saving ? 'Saving…' : 'Save Entry'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Synced Knowledge */}
      {!showManualOnly && autoKnowledge.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Zap size={16} style={{ color: '#10b981' }} />
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--text-1)', margin: 0 }}>Auto-Synced from Portfolio Pages ({autoKnowledge.length})</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontStyle: 'italic' }}>bio, experience, tech stack, courses, achievements, projects</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {autoKnowledge.map(k => (
              <motion.div key={k.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
                style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{k.title}</span>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>AUTO</span>
                    {!k.is_active && <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>INACTIVE</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditing({ ...k })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', fontSize: '14px' }}>✏️</button>
                    <button onClick={() => del(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {k.question && <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: '0 0 4px', fontStyle: 'italic' }}>Q: {k.question}</p>}
                <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                  {k.answer || k.content || k.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Knowledge */}
      {manualKnowledge.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <BookOpen size={16} style={{ color: '#6c63ff' }} />
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--text-1)', margin: 0 }}>Manual Entries ({manualKnowledge.length})</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.filter(k => k.source_type !== 'auto').map(k => (
              <motion.div key={k.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
                style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>{k.title}</span>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(108,99,255,0.1)', color: '#a8a8ff' }}>{k.category.toUpperCase()}</span>
                    {!k.is_active && <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>INACTIVE</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditing({ ...k })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', fontSize: '14px' }}>✏️</button>
                    <button onClick={() => del(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {k.question && <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: '0 0 4px', fontStyle: 'italic' }}>Q: {k.question}</p>}
                <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                  {k.answer || k.content || k.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
          {search ? 'No matches found.' : 'Knowledge base is empty. Click "Sync All Pages" to auto-generate from portfolio, or "Add Manual Entry" for custom Q&A.'}
        </p>
      )}
    </div>
  )
}
