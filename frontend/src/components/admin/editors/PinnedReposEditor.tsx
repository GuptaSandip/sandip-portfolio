import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Eye, EyeOff, Github } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const EMPTY = {
  name: '',
  description: '',
  repo_url: '',
  stars: 0,
  forks: 0,
  language: 'Python',
  lang_color: '#3572A5',
  display_order: 0,
  is_visible: true,
}

export default function PinnedReposEditor() {
  const [repos, setRepos]     = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getPinnedRepos()
      .then(setRepos)
      .catch(() => toast.error('Load failed — run supabase/migrations/add_pinned_repos.sql first'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.name || !editing.repo_url) {
      toast.error('Name and repo URL are required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updatePinnedRepo(editing.id, editing)
        setRepos(r => r.map(x => x.id === editing.id ? u : x))
        toast.success('Pinned repo updated!')
      } else {
        const c = await adminApi.createPinnedRepo(editing)
        setRepos(r => [...r, c])
        toast.success('Pinned repo added!')
      }
      setEditing(null)
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisibility(repo: any) {
    const u = await adminApi.updatePinnedRepo(repo.id, { ...repo, is_visible: !repo.is_visible })
    setRepos(r => r.map(x => x.id === repo.id ? u : x))
    toast.success(u.is_visible ? 'Visible on site' : 'Hidden from site')
  }

  async function del(id: string) {
    if (!confirm('Delete this pinned repo?')) return
    await adminApi.deletePinnedRepo(id)
    setRepos(r => r.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '24px', color: 'var(--text-1)', margin: '0 0 4px' }}>
            Pinned GitHub Repos
          </h1>
          <p style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-3)', margin: 0 }}>
            {repos.length} repos · {repos.filter(r => r.is_visible).length} visible on Platforms section
          </p>
        </div>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Repo
        </motion.button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="surface-card"
            style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '16px', color: 'var(--text-card-1)', margin: 0 }}>
                {editing.id ? 'Edit Pinned Repo' : 'New Pinned Repo'}
              </p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-card-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Repo Name *</label>
                <input className="field" value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  placeholder="sandip-portfolio" />
              </div>
              <div>
                <label className="field-label">GitHub URL *</label>
                <input className="field" value={editing.repo_url}
                  onChange={e => setEditing({ ...editing, repo_url: e.target.value })}
                  placeholder="https://github.com/GuptaSandip/..." />
              </div>
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea className="field" rows={3} value={editing.description || ''}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Short description shown on the card" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label className="field-label">Stars</label>
                <input className="field" type="number" min={0} value={editing.stars}
                  onChange={e => setEditing({ ...editing, stars: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="field-label">Forks</label>
                <input className="field" type="number" min={0} value={editing.forks}
                  onChange={e => setEditing({ ...editing, forks: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="field-label">Language</label>
                <input className="field" value={editing.language || ''}
                  onChange={e => setEditing({ ...editing, language: e.target.value })}
                  placeholder="Python" />
              </div>
              <div>
                <label className="field-label">Lang Color</label>
                <input className="field" value={editing.lang_color || '#3572A5'}
                  onChange={e => setEditing({ ...editing, lang_color: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Display Order</label>
                <input className="field" type="number" value={editing.display_order}
                  onChange={e => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-card-2)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editing.is_visible}
                    onChange={e => setEditing({ ...editing, is_visible: e.target.checked })} />
                  Visible on site
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} className="btn-ghost" style={{ color: 'var(--text-card-2)' }}>Cancel</button>
              <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {saving ? 'Saving…' : 'Save Repo'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {repos.length === 0 && (
          <div className="surface-card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px' }}>
            <Github size={28} style={{ color: 'var(--accent)', marginBottom: '10px' }} />
            <p style={{ color: 'var(--text-card-2)', fontSize: '14px', margin: 0 }}>
              No pinned repos yet. Add your GitHub highlights above.
            </p>
          </div>
        )}
        {repos.map(repo => (
          <motion.div key={repo.id} className="surface-card"
            style={{ padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '13px', color: 'var(--accent)' }}>
                {repo.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-card-2)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {repo.description || repo.repo_url}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-card-3)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                ★ {repo.stars} · ⑂ {repo.forks} · {repo.language || '—'} · order {repo.display_order}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button onClick={() => toggleVisibility(repo)} title={repo.is_visible ? 'Hide' : 'Show'}
                style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-card-2)' }}>
                {repo.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => setEditing({ ...repo })}
                style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-card-2)' }}>
                Edit
              </button>
              <button onClick={() => del(repo.id)}
                style={{ background: 'none', border: '1px solid rgba(220,80,80,0.3)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#dc5050' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
