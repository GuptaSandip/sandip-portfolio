import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, RefreshCw, Image, Upload, FileText } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '', slug: '', short_desc: '', description: '',
  duration_weeks: 8, level: 'beginner', price: 0,
  is_free: true, is_visible: false, enrollment_open: true,
  thumbnail_url: '', brochure_url: '',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CoursesEditor() {
  const [courses, setCourses]         = useState<any[]>([])
  const [editing, setEditing]         = useState<any | null>(null)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState<string | null>(null)
  const [loading, setLoading]         = useState(true)
  const thumbRef                      = useRef<HTMLInputElement>(null)

  useEffect(() => {
    adminApi.getCourses()
      .then(setCourses)
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!editing.title || !editing.slug) {
      toast.error('Title and slug are required')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const u = await adminApi.updateCourse(editing.id, editing)
        setCourses(p => p.map(x => x.id === editing.id ? u : x))
        toast.success('Course updated!')
      } else {
        const c = await adminApi.createCourse(editing)
        setCourses(p => [...p, c])
        toast.success('Course created!')
      }
      setEditing(null)
    } catch {
      toast.error('Save failed — check backend is running')
    } finally {
      setSaving(false)
    }
  }

  async function uploadThumbnail(courseId: string, file: File) {
    setUploading(courseId)
    try {
      const data = await adminApi.uploadCourseThumbnail(courseId, file)
      setCourses(p => p.map(x => x.id === courseId ? { ...x, thumbnail_url: data.thumbnail_url } : x))
      toast.success('Thumbnail uploaded!')
    } catch {
      toast.error('Thumbnail upload failed')
    } finally {
      setUploading(null)
    }
  }

  async function uploadBrochure(courseId: string, file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF brochure')
      return
    }
    setUploading(courseId + '_brochure')
    try {
      const data = await adminApi.uploadCourseBrochure(courseId, file)
      setCourses(p => p.map(x => x.id === courseId ? { ...x, brochure_url: data.brochure_url } : x))
      toast.success('Brochure uploaded!')
    } catch {
      toast.error('Brochure upload failed')
    } finally {
      setUploading(null)
    }
  }

  async function toggle(course: any) {
    const u = await adminApi.toggleCourse(course.id, !course.is_visible)
    setCourses(p => p.map(x => x.id === course.id ? u : x))
    toast.success(u.is_visible ? '🎉 Course is now LIVE!' : 'Course hidden')
  }

  async function del(id: string) {
    if (!confirm('Delete course and all its enrollments?')) return
    await adminApi.deleteCourse(id)
    setCourses(p => p.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: 0 }}>Courses</h1>
        <motion.button onClick={() => setEditing({ ...EMPTY })} whileHover={{ scale: 1.04 }} className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> New Course
        </motion.button>
      </div>
      <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', marginBottom: '1.5rem' }}>
        Courses section is hidden on public site until you toggle at least one LIVE.
      </p>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(108,99,255,0.35)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', margin: 0 }}>{editing.id ? 'Edit Course' : 'New Course'}</p>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Course Title *</label>
                <input className="field" value={editing.title}
                  onChange={e => setEditing((x: any) => ({ ...x, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) }))} />
              </div>
              <div>
                <label className="field-label">URL Slug *</label>
                <input className="field" value={editing.slug} onChange={e => setEditing((x: any) => ({ ...x, slug: e.target.value }))} placeholder="my-course-name" />
              </div>
            </div>

            <div>
              <label className="field-label">Short Description (shown on card)</label>
              <input className="field" value={editing.short_desc} onChange={e => setEditing((x: any) => ({ ...x, short_desc: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Full Description</label>
              <textarea className="field" rows={4} value={editing.description} onChange={e => setEditing((x: any) => ({ ...x, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Level</label>
                <select className="field" value={editing.level} onChange={e => setEditing((x: any) => ({ ...x, level: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {['beginner', 'intermediate', 'advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Duration (weeks)</label>
                <input className="field" type="number" min={1} value={editing.duration_weeks} onChange={e => setEditing((x: any) => ({ ...x, duration_weeks: +e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Price (₹)</label>
                <input className="field" type="number" min={0} value={editing.price} disabled={editing.is_free} onChange={e => setEditing((x: any) => ({ ...x, price: +e.target.value }))} />
              </div>
            </div>

            {/* Thumbnail URL (manual) or upload after saving */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Thumbnail URL (optional)</label>
                <input className="field" placeholder="https://..." value={editing.thumbnail_url || ''}
                  onChange={e => setEditing((x: any) => ({ ...x, thumbnail_url: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Brochure URL (optional)</label>
                <input className="field" placeholder="https://..." value={editing.brochure_url || ''}
                  onChange={e => setEditing((x: any) => ({ ...x, brochure_url: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[{ f: 'is_free', l: 'Free course' }, { f: 'is_visible', l: 'Visible on site' }, { f: 'enrollment_open', l: 'Enrollment open' }].map(({ f, l }) => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editing[f]} onChange={e => setEditing((x: any) => ({ ...x, [f]: e.target.checked }))} style={{ accentColor: '#6c63ff' }} /> {l}
                </label>
              ))}
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.03 }} className="btn-primary"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              {saving ? <><RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={13} /> Save Course</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {courses.map(c => (
          <motion.div key={c.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', overflow: 'hidden', transition: 'border-color 0.2s' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px' }}>

              {/* Thumbnail preview + upload */}
              <div style={{ flexShrink: 0, position: 'relative' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: c.thumbnail_url ? `url(${c.thumbnail_url}) center/cover` : 'rgba(108,99,255,0.1)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {!c.thumbnail_url && <Image size={20} style={{ color: 'var(--text-3)' }} />}
                </div>
                {/* Upload button overlay */}
                <label style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumbnail(c.id, f); e.target.value = '' }} />
                  {uploading === c.id
                    ? <RefreshCw size={14} style={{ color: 'white', animation: 'spin 0.8s linear infinite' }} />
                    : <Upload size={14} style={{ color: 'white' }} />
                  }
                </label>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', marginTop: '2px' }}>
                  /{c.slug} · {c.level} · {c.duration_weeks}w · {c.is_free ? 'Free' : `₹${c.price}`}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'monospace', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Hover thumb to upload image</span>
                  {c.brochure_url ? (
                    <a href={c.brochure_url} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <FileText size={10} /> Brochure OK
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <FileText size={10} /> No Brochure
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Brochure upload button */}
                <motion.label whileHover={{ scale: 1.1 }}
                  style={{ cursor: 'pointer', color: c.brochure_url ? '#34d399' : 'var(--text-3)', padding: '4px', position: 'relative' }}>
                  <input type="file" accept=".pdf" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadBrochure(c.id, f); e.target.value = '' }} />
                  {uploading === c.id + '_brochure' 
                    ? <RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                    : <FileText size={14} />
                  }
                </motion.label>
                <motion.button onClick={() => toggle(c)} whileHover={{ scale: 1.05 }}
                  style={{ padding: '4px 12px', borderRadius: '6px', border: `1px solid ${c.is_visible ? 'rgba(52,211,153,0.4)' : 'var(--bd)'}`, background: c.is_visible ? 'rgba(52,211,153,0.1)' : 'transparent', color: c.is_visible ? '#34d399' : 'var(--text-3)', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {c.is_visible ? '● LIVE' : '○ HIDDEN'}
                </motion.button>
                <motion.button onClick={() => setEditing({ ...c })} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: '4px', fontSize: '16px' }}>✏️</motion.button>
                <motion.button onClick={() => del(c.id)} whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }}><Trash2 size={14} /></motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        {courses.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
            No courses yet. Create one and toggle it LIVE when ready.
          </p>
        )}
      </div>
    </div>
  )
}