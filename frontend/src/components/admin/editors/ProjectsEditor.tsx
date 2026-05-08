import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '', description: '', tech_tags: [],
  github_url: '', live_url: '', image_url: '',
  is_featured: false, display_order: 0, is_visible: true,
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    adminApi.getProjects()
      .then(setProjects)
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.title || !editing.description) {
      toast.error('Title and description are required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateProject(editing.id, editing)
        setProjects(p => p.map(x => x.id === editing.id ? u : x))
        toast.success('Project updated!')
      } else {
        const c = await adminApi.createProject(editing)
        setProjects(p => [...p, c])
        toast.success('Project created!')
      }
      setEditing(null)
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisibility(project: any) {
    const u = await adminApi.updateProject(project.id, { ...project, is_visible: !project.is_visible })
    setProjects(p => p.map(x => x.id === project.id ? u : x))
    toast.success(u.is_visible ? 'Visible on site' : 'Hidden from site')
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return
    await adminApi.deleteProject(id)
    setProjects(p => p.filter(x => x.id !== id))
    toast.success('Deleted')
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
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Projects</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>{projects.length} projects · {projects.filter(p => p.is_visible).length} visible</p>
        </div>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Project
        </motion.button>
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
                {editing.id ? 'Edit Project' : 'New Project'}
              </p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Title *</label>
                <input className="field" placeholder="My Awesome Project" value={editing.title}
                  onChange={e => setEditing((x: any) => ({ ...x, title: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">GitHub URL</label>
                <input className="field" placeholder="https://github.com/..." value={editing.github_url}
                  onChange={e => setEditing((x: any) => ({ ...x, github_url: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="field-label">Description *</label>
              <textarea className="field" rows={3} placeholder="What does this project do? What problem does it solve?"
                value={editing.description}
                onChange={e => setEditing((x: any) => ({ ...x, description: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Live URL</label>
                <input className="field" placeholder="https://..." value={editing.live_url}
                  onChange={e => setEditing((x: any) => ({ ...x, live_url: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Tech Tags (comma separated)</label>
                <input className="field" placeholder="Python, LangChain, FastAPI"
                  value={Array.isArray(editing.tech_tags) ? editing.tech_tags.join(', ') : ''}
                  onChange={e => setEditing((x: any) => ({
                    ...x,
                    tech_tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean),
                  }))} />
              </div>
            </div>

            <div>
              <label className="field-label">Image URL (optional)</label>
              <input className="field" placeholder="https://... (thumbnail image)" value={editing.image_url}
                onChange={e => setEditing((x: any) => ({ ...x, image_url: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.is_visible}
                  onChange={e => setEditing((x: any) => ({ ...x, is_visible: e.target.checked }))}
                  style={{ accentColor: '#6c63ff' }} />
                Visible on site
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.is_featured}
                  onChange={e => setEditing((x: any) => ({ ...x, is_featured: e.target.checked }))}
                  style={{ accentColor: '#6c63ff' }} />
                Featured (shown at top)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Order</label>
                <input className="field" type="number" style={{ width: '70px' }} value={editing.display_order}
                  onChange={e => setEditing((x: any) => ({ ...x, display_order: +e.target.value }))} />
              </div>
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={13} />}
              {saving ? 'Saving…' : 'Save Project'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map(p => (
          <motion.div key={p.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', gap: '12px', transition: 'border-color 0.2s' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                {p.is_featured && <span style={{ fontSize: '9px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>FEATURED</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', marginTop: '3px' }}>
                {p.tech_tags?.slice(0, 4).join(' · ')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <motion.button onClick={() => toggleVisibility(p)} whileHover={{ scale: 1.1 }}
                title={p.is_visible ? 'Hide from site' : 'Show on site'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: p.is_visible ? '#34d399' : 'var(--text-3)' }}>
                {p.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </motion.button>
              <motion.button onClick={() => setEditing({ ...p })} whileHover={{ scale: 1.1 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
              <motion.button onClick={() => del(p.id)} whileHover={{ scale: 1.1 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
            No projects yet. Add your first one above.
          </p>
        )}
      </div>
    </div>
  )
}