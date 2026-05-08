import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, RefreshCw, ExternalLink, AlertCircle, Trash2 } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ResumeUploader() {
  const [uploading, setUploading]   = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [error, setError]           = useState('')

  // Load current resume URL on mount
  useEffect(() => {
    supabase
      .from('bio')
      .select('resume_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data?.resume_url) setCurrentUrl(data.resume_url)
      })
  }, [])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large — max 10MB')
      return
    }

    setUploading(true)
    setError('')
    try {
      const res = await adminApi.uploadResume(file)
      setCurrentUrl(res.resume_url)
      toast.success('Resume uploaded and live on site!')
    } catch (err: any) {
      const msg = err.message ?? 'Upload failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // Delete resume from storage + clear bio table
  async function handleDelete() {
    if (!confirm('Delete the current resume? This will remove it from the public site.')) return
    setDeleting(true)
    try {
      const base  = import.meta.env.VITE_API_URL || ''
      const token = localStorage.getItem('admin_token')
      const res   = await fetch(`${base}/api/admin/resume`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCurrentUrl(null)
      toast.success('Resume deleted')
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', marginBottom: '6px' }}>Resume</h1>
      <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', marginBottom: '2rem' }}>
        Upload a PDF — goes live instantly on the public site.
      </p>

      {/* Current resume */}
      {currentUrl && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '1.5rem', padding: '14px 18px', borderRadius: '14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <CheckCircle size={16} style={{ color: '#34d399', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', color: '#34d399', fontFamily: 'monospace', fontWeight: 600 }}>Resume is live</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                {currentUrl}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <motion.a href={currentUrl} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#34d399', textDecoration: 'none', fontFamily: 'monospace', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(52,211,153,0.3)' }}>
              <ExternalLink size={11} /> View
            </motion.a>
            <motion.button onClick={handleDelete} disabled={deleting} whileHover={{ scale: 1.08 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f87171', fontFamily: 'monospace', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.3)', background: 'transparent', cursor: 'pointer' }}>
              {deleting
                ? <RefreshCw size={11} style={{ animation: 'spin 0.8s linear infinite' }} />
                : <Trash2 size={11} />
              }
              Delete
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Upload zone */}
      <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'block' }}>
        <input type="file" accept=".pdf" onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
        <motion.div
          whileHover={!uploading ? { borderColor: 'rgba(108,99,255,0.5)', background: 'rgba(108,99,255,0.03)' } : {}}
          style={{ padding: '2.5rem 2rem', borderRadius: '20px', background: 'var(--bg-surface)', border: '2px dashed var(--bd)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', transition: 'all 0.2s' }}
        >
          <motion.div
            animate={uploading ? { rotate: 360 } : {}}
            transition={uploading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {uploading
              ? <RefreshCw size={24} style={{ color: '#6c63ff' }} />
              : <Upload size={24} style={{ color: '#6c63ff' }} />
            }
          </motion.div>
          <div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', margin: '0 0 4px' }}>
              {uploading ? 'Uploading to Supabase Storage…' : currentUrl ? 'Replace Resume PDF' : 'Upload Resume PDF'}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0 }}>
              {uploading ? 'Please wait…' : 'Click to choose PDF · Max 10MB'}
            </p>
          </div>
          <div style={{ padding: '7px 18px', borderRadius: '10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', fontSize: '12px', color: '#a8a8ff', fontFamily: 'monospace' }}>
            {uploading ? 'Uploading…' : 'Choose PDF'}
          </div>
        </motion.div>
      </label>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '1rem', padding: '12px 16px', borderRadius: '12px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertCircle size={15} style={{ color: '#f87171', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '12px', color: '#f87171', fontFamily: 'monospace', margin: '0 0 5px' }}>{error}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', margin: 0, lineHeight: 1.6 }}>
              Check: 1) Run supabase_storage_setup.sql · 2) SUPABASE_SERVICE_KEY is service_role key · 3) Backend running
            </p>
          </div>
        </motion.div>
      )}

      {/* Notes */}
      <div style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)' }}>
        <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</p>
        {[
          'Stored at: portfolio/resumes/sandip_gupta_resume.pdf',
          'bio.resume_url updates automatically on upload/delete',
          'Public site shows download button only when URL exists',
        ].map((note, i) => (
          <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px' }}>
            <span style={{ color: '#6c63ff', fontFamily: 'monospace', fontSize: '11px', flexShrink: 0 }}>→</span>
            <span style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'monospace' }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}