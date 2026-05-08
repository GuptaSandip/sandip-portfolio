import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

export function useAdminAuth() {
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true })
    }
  }, [token, navigate])

  return { token, logout }
}