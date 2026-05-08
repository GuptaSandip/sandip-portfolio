import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ContactMessagesViewer() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    adminApi.getContacts()
      .then(setMessages)
      .catch(() => toast.error('Load failed'))
      .finally(() => setLoading(false))
  }, [])

  async function del(id: string) {
    if (!confirm('Delete this message?')) return
    try {
      await adminApi.deleteContact(id)
      setMessages(m => m.filter(x => x.id !== id))
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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Contact Messages</h1>
        <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
          Direct messages from your portfolio contact form.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map(m => (
          <motion.div key={m.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
            style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', marginBottom: '4px' }}>
                  <User size={14} style={{ color: '#6c63ff' }} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{m.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={13} style={{ color: 'var(--text-3)' }} />
                  <a href={`mailto:${m.email}`} style={{ color: 'var(--text-2)', fontSize: '13px', textDecoration: 'none' }}>{m.email}</a>
                </div>
              </div>
              <button onClick={() => del(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '5px' }}>
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', fontSize: '14px', color: 'var(--text-1)', lineHeight: 1.6, marginBottom: '12px' }}>
              {m.message}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
              <Calendar size={11} />
              {new Date(m.created_at).toLocaleString()}
            </div>
          </motion.div>
        ))}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--bd)' }}>
            <MessageSquare size={32} style={{ color: 'var(--text-3)', marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-3)', fontSize: '14px', margin: 0 }}>No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
