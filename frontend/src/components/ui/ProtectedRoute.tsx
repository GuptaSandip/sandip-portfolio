import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // Check if access token exists
  const hasAccessToken = !!localStorage.getItem('admin_access_token')
  if (!hasAccessToken) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
