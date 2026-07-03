import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/context/ThemeContext'
import PublicLayout   from '@/components/ui/PublicLayout'
import Home           from '@/pages/Home'
import CoursePage     from '@/pages/CoursePage'
import AdminLogin     from '@/pages/Admin/AdminLogin'
import AdminDashboard from '@/pages/Admin/AdminDashboard'
import ProtectedRoute from '@/components/ui/ProtectedRoute'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-surface, #E8E0D0)',
              color: 'var(--text-card-1, #161616)',
              border: '1px solid var(--bd, rgba(0,0,0,0.1))',
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/"                element={<Home />} />
            <Route path="/courses/:slug"   element={<CoursePage />} />
          </Route>

          {/* Admin — hidden, not linked anywhere publicly */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}