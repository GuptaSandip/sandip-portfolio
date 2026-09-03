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

const panelStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--bd)',
  boxShadow: 'var(--card-shadow)',
}

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
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'var(--accent)',
          border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(184, 137, 82, 0.28)',
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
              ...panelStyle,
              position: 'fixed', bottom: '92px', right: '28px', zIndex: 999,
              width: '368px', maxWidth: 'calc(100vw - 26px)',
              height: '540px', maxHeight: 'calc(100vh - 110px)',
              borderRadius: '18px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.006)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(184,137,82,0.15)' }}>
                  <Bot size={14} style={{ color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '14px', color: 'var(--text-card-1)', lineHeight: 1.2 }}>Sandip's Assistant</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <motion.div animate={{ opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />
                    <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', opacity: 0.8 }}>Online</span>
                  </div>
                </div>
              </div>
              <motion.button onClick={reset} title="Clear chat" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--bd)', borderRadius: '7px', cursor: 'pointer', color: 'var(--text-card-3)', padding: '5px 7px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                <RefreshCw size={13} />
              </motion.button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.015)' }}>
              {messages.map((msg, i) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0, background: msg.role === 'user' ? 'rgba(184,137,82,0.12)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,0.06)' }}>
                    {msg.role === 'user'
                      ? <User size={11} style={{ color: 'var(--accent)' }} />
                      : <Bot size={11} style={{ color: 'white' }} />
                    }
                  </div>
                  <div style={{
                    maxWidth: '78%', padding: '9px 12px', borderRadius: msg.role === 'user' ? '11px 3px 11px 11px' : '3px 11px 11px 11px',
                    background: msg.role === 'user' ? 'rgba(184,137,82,0.1)' : 'var(--bg-panel)',
                    border: '1px solid var(--bd)',
                    fontSize: '13px', color: 'var(--text-card-1)', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}>
                    {msg.content}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                      <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', marginLeft: '8px', verticalAlign: 'middle' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {SUGGESTIONS.map(s => (
                    <motion.button key={s} onClick={() => send(s)} whileHover={{ borderColor: 'var(--accent)', y: -2, boxShadow: '0 6px 16px rgba(184,137,82,0.1)' }} whileTap={{ y: 0 }}
                      style={{ textAlign: 'left', padding: '9px 11px', borderRadius: '9px', background: 'var(--bg-panel)', border: '1px solid var(--bd)', fontSize: '12px', color: 'var(--text-card-2)', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {limitHit && (
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(184,137,82,0.12)', border: '1px solid rgba(184,137,82,0.22)', fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
                  Chat limit reached. Refresh to continue or reach out via LinkedIn.
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div style={{ padding: '11px 13px', borderTop: '1px solid var(--bd)', display: 'flex', gap: '7px', alignItems: 'center', background: 'rgba(0,0,0,0.008)' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={streaming || limitHit}
                placeholder="Ask about Sandip..."
                className="field"
                style={{ flex: 1, padding: '9px 11px', fontSize: '13px', borderRadius: '9px', border: '1px solid var(--bd)', background: 'var(--bg-panel)', color: 'var(--text-card-1)', transition: 'all 0.2s ease', boxShadow: input ? '0 1px 6px rgba(184,137,82,0.08)' : 'none' }}
              />
              <motion.button
                onClick={() => send()} disabled={!input.trim() || streaming || limitHit}
                whileHover={input.trim() ? { scale: 1.06, y: -1 } : {}}
                whileTap={{ scale: 0.94 }}
                style={{ width: '36px', height: '36px', borderRadius: '9px', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', background: input.trim() ? 'var(--accent)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() ? '0 6px 16px rgba(184,137,82,0.2)' : 'none', transition: 'all 0.2s ease' }}
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
