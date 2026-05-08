import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, HelpCircle, Mail, Phone } from 'lucide-react'
import { adminApi } from '@/lib/api'

export default function LeadsViewer() {
  const [leads, setLeads]       = useState<any[]>([])
  const [unknowns, setUnknowns] = useState<any[]>([])
  const [tab, setTab]           = useState<'leads' | 'unknowns'>('leads')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.allSettled([
      adminApi.getLeads(),
      adminApi.getUnknowns(),
    ]).then(([l, u]) => {
      if (l.status === 'fulfilled') setLeads(l.value)
      if (u.status === 'fulfilled') setUnknowns(u.value)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6c63ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const unreadLeads = leads.filter(l => !l.is_read).length

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--text-1)', margin: '0 0 4px' }}>Chat Leads</h1>
        <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-3)', margin: 0 }}>
          Contacts collected from the AI chatbot. Marked as read automatically when you view them.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <button onClick={() => setTab('leads')}
          style={{ padding: '7px 16px', borderRadius: '8px', border: `1px solid ${tab === 'leads' ? 'rgba(108,99,255,0.5)' : 'var(--bd)'}`, background: tab === 'leads' ? 'rgba(108,99,255,0.1)' : 'transparent', color: tab === 'leads' ? '#a8a8ff' : 'var(--text-2)', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={13} /> Leads ({leads.length})
          {unreadLeads > 0 && <span style={{ background: '#6c63ff', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '10px' }}>{unreadLeads} new</span>}
        </button>
        <button onClick={() => setTab('unknowns')}
          style={{ padding: '7px 16px', borderRadius: '8px', border: `1px solid ${tab === 'unknowns' ? 'rgba(251,191,36,0.5)' : 'var(--bd)'}`, background: tab === 'unknowns' ? 'rgba(251,191,36,0.08)' : 'transparent', color: tab === 'unknowns' ? '#fbbf24' : 'var(--text-2)', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={13} /> Unknown Questions ({unknowns.length})
        </button>
      </div>

      {/* Leads */}
      {tab === 'leads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leads.map(l => (
            <motion.div key={l.id} whileHover={{ borderColor: 'rgba(108,99,255,0.35)' }}
              style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-surface)', border: `1px solid ${!l.is_read ? 'rgba(108,99,255,0.3)' : 'var(--bd)'}`, transition: 'border-color 0.2s', position: 'relative' }}>
              {!l.is_read && (
                <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '5px', background: 'rgba(108,99,255,0.15)', color: '#a8a8ff', border: '1px solid rgba(108,99,255,0.3)' }}>NEW</span>
              )}
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', marginBottom: '8px' }}>
                {l.name || 'Anonymous'}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {l.email && (
                  <a href={`mailto:${l.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontFamily: 'monospace', color: '#6c63ff', textDecoration: 'none' }}>
                    <Mail size={12} /> {l.email}
                  </a>
                )}
                {l.phone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-2)' }}>
                    <Phone size={12} /> {l.phone}
                  </span>
                )}
              </div>
              {l.context && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '10px' }}>
                  {l.context}
                </div>
              )}
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                {new Date(l.created_at).toLocaleString()}
              </div>
            </motion.div>
          ))}
          {leads.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '3rem' }}>
              No leads yet. They appear here when visitors share contact details with the chatbot.
            </p>
          )}
        </div>
      )}

      {/* Unknown questions */}
      {tab === 'unknowns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', fontSize: '12px', fontFamily: 'monospace', color: '#fbbf24', marginBottom: '4px' }}>
            These are questions the chatbot couldn't answer. Use them to improve your chatbot's knowledge base.
          </div>
          {unknowns.map(q => (
            <motion.div key={q.id} whileHover={{ borderColor: 'rgba(251,191,36,0.35)' }}
              style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--bd)', transition: 'border-color 0.2s' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-1)', margin: '0 0 8px', lineHeight: 1.65, fontStyle: 'italic' }}>
                "{q.question}"
              </p>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                {new Date(q.created_at).toLocaleString()}
                {q.session_id && ` · session: ${q.session_id}`}
              </div>
            </motion.div>
          ))}
          {unknowns.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '3rem' }}>
              No unknown questions yet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}