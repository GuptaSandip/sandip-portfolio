import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Upload, User } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function BioEditor() {
  const [data, setData]             = useState<any>(null)
  const [saving, setSaving]         = useState(false)
  const [loading, setLoading]       = useState(true)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarRef                   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    adminApi.getBio()
      .then(d => setData(d))
      .catch(e => toast.error(`Failed to load bio: ${e.message}`))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const updated = await adminApi.updateBio(data)
      setData(updated)
      toast.success('Bio updated and live!')
    } catch (e: any) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Fix 8 — avatar upload
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const res = await adminApi.uploadAvatar(file)
      setData((d: any) => ({ ...d, avatar_url: res.avatar_url }))
      toast.success('Avatar uploaded!')
    } catch (err: any) {
      toast.error(`Avatar upload failed: ${err.message}`)
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  function Field({
    label, field, type = 'text', rows, placeholder,
  }: {
    label: string; field: string; type?: string; rows?: number; placeholder?: string
  }) {
    return (
      <div>
        <label className="field-label">{label}</label>
        {rows ? (
          <textarea
            className="field" rows={rows} placeholder={placeholder}
            value={data?.[field] ?? ''}
            onChange={e => setData((d: any) => ({ ...d, [field]: e.target.value }))}
            style={{ resize: 'vertical' }}
          />
        ) : (
          <input
            className="field" type={type} placeholder={placeholder}
            value={data?.[field] ?? ''}
            onChange={e => setData((d: any) => ({ ...d, [field]: e.target.value }))}
          />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Bio & Links</h1>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>Changes go live instantly on the public site.</p>
        </div>
        <motion.button
          onClick={save} disabled={saving}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}
        >
          {saving
            ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
            : <><Save size={14} /> Save Changes</>
          }
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '1.75rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)' }}>

        {/* Fix 8 — Avatar section */}
        <div>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Profile Photo</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar preview */}
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(108,99,255,0.1)', border: '2px solid var(--bd)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data?.avatar_url
                ? <img src={data.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={28} style={{ color: 'var(--text-3)' }} />
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                <motion.div whileHover={{ scale: 1.04 }} className="btn-ghost"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', padding: '7px 14px', cursor: 'pointer' }}>
                  {avatarUploading
                    ? <><RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Uploading…</>
                    : <><Upload size={13} /> Upload Photo</>
                  }
                </motion.div>
              </label>
              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
                JPG, PNG or WebP · Max 5MB
              </p>
            </div>
          </div>
          {/* Manual URL fallback */}
          <div style={{ marginTop: '10px' }}>
            <label className="field-label">Or paste image URL directly</label>
            <input className="field" placeholder="https://your-image-url.com/photo.jpg"
              value={data?.avatar_url ?? ''}
              onChange={e => setData((d: any) => ({ ...d, avatar_url: e.target.value }))} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '16px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Basic Info</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Display Name"  field="name"     placeholder="Sandip Gupta" />
              <Field label="Title / Role"  field="title"    placeholder="AI Engineer & Master Trainer" />
            </div>
            <Field label="About / Bio" field="about" rows={5} placeholder="Write your bio here..." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Email"    field="email"    type="email" placeholder="you@example.com" />
              <Field label="Location" field="location" placeholder="India" />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '16px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Social Links</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Field label="GitHub URL"        field="github_url"      placeholder="https://github.com/GuptaSandip" />
            <Field label="LinkedIn URL"      field="linkedin_url"    placeholder="https://www.linkedin.com/in/sandipgupta-ai/" />
            <Field label="Twitter / X URL"   field="twitter_url"     placeholder="https://x.com/guptasandip11" />
            <Field label="HuggingFace URL"   field="huggingface_url" placeholder="https://huggingface.co/guptasandip" />
            <Field label="HackerRank URL"    field="hackerrank_url"  placeholder="https://hackerrank.com/profile/sandip_gupta_111" />
            <Field label="Kaggle URL"        field="kaggle_url"      placeholder="https://kaggle.com/..." />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '16px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Hero Typewriter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="field-label">Typewriter Taglines (comma separated)</label>
              <textarea className="field" rows={3}
                placeholder="AI Engineer, Master Trainer, Building with LLMs..."
                value={Array.isArray(data?.taglines) ? data.taglines.join(', ') : (data?.taglines ?? '')}
                onChange={e => setData((d: any) => ({ ...d, taglines: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }))}
              />
              <p style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px' }}>These appear in the animated typewriter effect on the home page.</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '10px', background: 'var(--bg-panel)', border: '1px solid var(--bd)' }}>
            <input
              type="checkbox" id="open_to_work"
              checked={data?.is_open_to_work ?? false}
              onChange={e => setData((d: any) => ({ ...d, is_open_to_work: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: '#6c63ff', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
            />
            <div>
              <label htmlFor="open_to_work" style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Open to Opportunities
              </label>
              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', margin: '3px 0 0' }}>
                Chatbot will tell visitors you are selectively open to freelance / consulting work
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}