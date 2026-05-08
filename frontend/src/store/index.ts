import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Admin auth store ───────────────────────────────────────
interface AuthState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        set({ token })
        localStorage.setItem('admin_token', token)
      },
      logout: () => {
        set({ token: null })
        localStorage.removeItem('admin_token')
      },
    }),
    { name: 'admin-auth' }
  )
)

// ── Chat message type ──────────────────────────────────────
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isStreaming: boolean
  sessionId: string
  addMessage: (msg: Pick<ChatMessage, 'role' | 'content'>) => ChatMessage
  appendToLast: (text: string) => void
  setStreaming: (v: boolean) => void
  toggleOpen: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isStreaming: false,
  sessionId: uid(),

  addMessage: (msg) => {
    const full: ChatMessage = { ...msg, id: uid(), timestamp: new Date() }
    set((s) => ({ messages: [...s.messages, full] }))
    return full
  },

  appendToLast: (text) =>
    set((s) => {
      const msgs = [...s.messages]
      if (msgs.length === 0) return s
      const last = { ...msgs[msgs.length - 1] }
      last.content += text
      msgs[msgs.length - 1] = last
      return { messages: msgs }
    }),

  setStreaming: (v) => set({ isStreaming: v }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  clearMessages: () => set({ messages: [], sessionId: uid() }),
}))
