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
    } catch {
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
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={{ scale: open ? 0.9 : 1 }}
        whileHover={{ scale: open ? 0.92 : 1.06 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(184, 137, 82, 0.35)',
        }}
        aria-label="Open AI chatbot"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} style={{ color: 'white' }} />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageSquare size={20} style={{ color: 'white' }} />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {!open && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ position: 'fixed', bottom: '76px', right: '24px', zIndex: 1001, width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--outer-bg)' }}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="surface-card"
            style={{
              position: 'fixed', bottom: '92px', right: '28px', zIndex: 999,
              width: '360px', maxWidth: 'calc(100vw - 32px)',
              height: '520px', maxHeight: 'calc(100vh - 120px)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} style={{ color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '14px', color: 'var(--text-card-1)' }}>Ask About Sandip</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>Online</span>
                  </div>
                </div>
              </div>
              <button onClick={reset} title="Clear chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-card-3)', padding: '4px', display: 'flex', alignItems: 'center' }}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, background: msg.role === 'user' ? 'var(--accent-muted)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {msg.role === 'user'
                      ? <User size={12} style={{ color: 'var(--accent)' }} />
                      : <Bot size={12} style={{ color: 'white' }} />
                    }
                  </div>
                  <div style={{
                    maxWidth: '78%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                    background: msg.role === 'user' ? 'var(--accent-muted)' : 'var(--bg-panel)',
                    border: '1px solid var(--bd)',
                    fontSize: '13px', color: 'var(--text-card-1)', lineHeight: 1.65,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                      <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                        {[0, 1, 2].map(d => (
                          <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: d * 0.2, repeat: Infinity }}
                            style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                        ))}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {SUGGESTIONS.map(s => (
                    <motion.button key={s} onClick={() => send(s)} whileHover={{ borderColor: 'var(--accent)' }}
                      style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', fontSize: '12px', color: 'var(--text-card-2)', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {limitHit && (
                <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--accent-muted)', border: '1px solid rgba(184,137,82,0.25)', fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
                  Chat limit reached. Refresh to continue or reach out via LinkedIn.
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--bd)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={streaming || limitHit}
                placeholder="Ask anything about Sandip..."
                className="field"
                style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
              />
              <motion.button
                onClick={() => send()} disabled={!input.trim() || streaming || limitHit}
                whileHover={input.trim() ? { scale: 1.06 } : {}}
                whileTap={{ scale: 0.94 }}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', background: input.trim() ? 'var(--accent)' : 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {streaming
                  ? <RefreshCw size={14} style={{ color: 'white', animation: 'spin 0.8s linear infinite' }} />
                  : <Send size={14} style={{ color: 'white' }} />
                }
              </motion.button>
            </div>

            <div style={{ padding: '4px 14px 10px', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-card-3)' }}>
                AI can make mistakes
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
