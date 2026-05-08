import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, RefreshCw, Bot, User } from 'lucide-react'
import { streamChat } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = `Hi! I'm Sandip's AI assistant 👋

I can answer questions about Sandip's work, skills, projects, and experience. I can also connect you with him if you'd like to collaborate.

What would you like to know?`

const SUGGESTIONS = [
  'What does Sandip specialise in?',
  'What projects has he built?',
  'Is he open to work?',
  'How can I contact him?',
]

let msgCounter = 0
function uid() { return `msg_${++msgCounter}_${Date.now()}` }

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Message[]>([
    { id: uid(), role: 'assistant', content: WELCOME },
  ])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming] = useState(false)
  const [limitHit, setLimitHit]   = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)
  const sessionId                 = useRef(`session_${Date.now()}`)
  const msgCount                  = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return

    // Rate limit check (5 per session soft limit)
    msgCount.current += 1
    if (msgCount.current > 10) {
      setLimitHit(true)
      return
    }

    setInput('')

    const userMsg: Message = { id: uid(), role: 'user', content }
    const assistantMsg: Message = { id: uid(), role: 'assistant', content: '' }

    setMessages(m => [...m, userMsg, assistantMsg])
    setStreaming(true)

    try {
      const history = [...messages, userMsg].slice(-6).map(m => ({
        role: m.role, content: m.content,
      }))

      const gen = streamChat(history, sessionId.current)

      for await (const chunk of gen) {
        setMessages(m => {
          const copy = [...m]
          const last = { ...copy[copy.length - 1] }
          last.content += chunk
          copy[copy.length - 1] = last
          return copy
        })
      }
    } catch (err) {
      setMessages(m => {
        const copy = [...m]
        const last = { ...copy[copy.length - 1] }
        last.content = "Sorry, something went wrong. Please try again or reach out directly via LinkedIn."
        copy[copy.length - 1] = last
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function reset() {
    setMessages([{ id: uid(), role: 'assistant', content: WELCOME }])
    msgCount.current = 0
    setLimitHit(false)
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={{ scale: open ? 0.9 : 1 }}
        whileHover={{ scale: open ? 0.92 : 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(108,99,255,0.5)',
        }}
        aria-label="Open AI chatbot"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} style={{ color: 'white' }} />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageSquare size={22} style={{ color: 'white' }} />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Unread dot */}
      {!open && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ position: 'fixed', bottom: '72px', right: '20px', zIndex: 1001, width: '12px', height: '12px', borderRadius: '50%', background: '#34d399', border: '2px solid var(--bg)', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}
        />
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              position: 'fixed', bottom: '92px', right: '24px', zIndex: 999,
              width: '360px', maxWidth: 'calc(100vw - 32px)',
              height: '520px', maxHeight: 'calc(100vh - 120px)',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(108,99,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,255,0.05))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6c63ff, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} style={{ color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-1)' }}>Ask About Sandip</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#34d399' }}>AI Assistant · Online</span>
                  </div>
                </div>
              </div>
              <button onClick={reset} title="Clear chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  {/* Avatar */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, background: msg.role === 'user' ? 'rgba(108,99,255,0.2)' : 'linear-gradient(135deg, #6c63ff, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {msg.role === 'user'
                      ? <User size={13} style={{ color: '#6c63ff' }} />
                      : <Bot size={13} style={{ color: 'white' }} />
                    }
                  </div>
                  {/* Bubble */}
                  <div style={{
                    maxWidth: '78%', padding: '9px 13px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    background: msg.role === 'user' ? 'rgba(108,99,255,0.18)' : 'var(--bg-panel)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(108,99,255,0.3)' : 'var(--bd)'}`,
                    fontSize: '13px', color: 'var(--text-1)', lineHeight: 1.65,
                    fontFamily: 'DM Sans, sans-serif',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                      <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                        {[0, 1, 2].map(d => (
                          <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: d * 0.2, repeat: Infinity }}
                            style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }} />
                        ))}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Suggestions (show after welcome) */}
              {messages.length === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {SUGGESTIONS.map(s => (
                    <motion.button key={s} onClick={() => send(s)} whileHover={{ scale: 1.02, borderColor: 'rgba(108,99,255,0.5)' }}
                      style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', fontSize: '12px', color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' }}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {limitHit && (
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', fontSize: '12px', color: '#fbbf24', fontFamily: 'monospace', textAlign: 'center' }}>
                  Chat limit reached for this session. Refresh to continue or reach out directly via LinkedIn.
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--bd)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={streaming || limitHit}
                placeholder="Ask anything about Sandip..."
                style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--bd)', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', color: 'var(--text-1)', outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(108,99,255,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--bd)')}
              />
              <motion.button
                onClick={() => send()} disabled={!input.trim() || streaming || limitHit}
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={{ scale: 0.94 }}
                style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', background: input.trim() ? 'linear-gradient(135deg, #6c63ff, #00d4ff)' : 'var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
              >
                {streaming
                  ? <RefreshCw size={14} style={{ color: 'white', animation: 'spin 0.8s linear infinite' }} />
                  : <Send size={14} style={{ color: 'white' }} />
                }
              </motion.button>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: '6px 14px 10px', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--text-3)' }}>
                AI can make mistakes · Contact directly for important matters
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}