import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Lock } from 'lucide-react'
import { adminLogin } from '@/lib/api'
import { useAuthStore } from '@/store'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { access_token } = await adminLogin(username, password)
      setToken(access_token)
      toast.success('Welcome back, Sandip.')
      navigate('/admin', { replace: true })
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary-400/10 border border-primary-400/30 flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
            <Terminal className="text-primary-400" size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">Admin Access</h1>
          <p className="text-ink-muted text-xs font-mono mt-1">sandip.dev / control panel</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="field-label">Username</label>
            <input
              className="field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sandip"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" loading={loading} className="w-full justify-center mt-2">
            <Lock size={14} />
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-ink-muted font-mono mt-6">
          Not linked publicly. Only you know this exists.
        </p>
      </div>
    </div>
  )
}
