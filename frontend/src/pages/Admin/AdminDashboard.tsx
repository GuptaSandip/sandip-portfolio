// import { useNavigate } from 'react-router-dom'
// import { useAuthStore } from '@/store'
// import {
//   LayoutDashboard,
//   User,
//   Code2,
//   FolderKanban,
//   Trophy,
//   BookOpen,
//   FileText,
//   MessageSquare,
//   LogOut,
// } from 'lucide-react'

// const MENU = [
//   { icon: LayoutDashboard, label: 'Overview', path: '' },
//   { icon: User, label: 'Bio & Links', path: 'bio' },
//   { icon: Code2, label: 'Tech Stack', path: 'tech' },
//   { icon: FolderKanban, label: 'Projects', path: 'projects' },
//   { icon: Trophy, label: 'Accomplishments', path: 'accomplishments' },
//   { icon: BookOpen, label: 'Courses', path: 'courses' },
//   { icon: FileText, label: 'Resume', path: 'resume' },
//   { icon: MessageSquare, label: 'Leads & Chat', path: 'leads' },
// ]

// export default function AdminDashboard() {
//   const logout = useAuthStore((s) => s.logout)
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen bg-base flex">
//       <aside className="w-60 bg-surface border-r border-border flex flex-col fixed h-full">
//         <div className="p-6 border-b border-border">
//           <p className="font-display font-bold text-ink-primary">sandip.dev</p>
//           <p className="text-xs font-mono text-ink-muted mt-0.5">Admin Panel</p>
//         </div>

//         <nav className="flex-1 p-3 space-y-1">
//           {MENU.map(({ icon: Icon, label, path }) => (
//             <button
//               key={path}
//               onClick={() => navigate('/admin/' + path)}
//               className="sidebar-item w-full"
//             >
//               <Icon size={16} />
//               {label}
//             </button>
//           ))}
//         </nav>

//         <div className="p-3 border-t border-border">
//           <button
//             onClick={() => { logout(); navigate('/admin/login') }}
//             className="sidebar-item w-full text-red-400 hover:text-red-300"
//           >
//             <LogOut size={16} />
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       <main className="ml-60 flex-1 p-8 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-4xl mb-3">🛡️</p>
//           <h2 className="font-display text-xl font-bold text-ink-primary">Admin Panel</h2>
//           <p className="text-ink-muted text-sm mt-2 font-mono">
//             Full editors coming Day 5. Sidebar nav is wired.
//           </p>
//         </div>
//       </main>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store'
import {
  LayoutDashboard, User, Code2, FolderKanban, Trophy,
  BookOpen, FileText, MessageSquare, LogOut, Terminal,
  Users, HelpCircle, ChevronRight, Briefcase, Github,
  Menu, X,
} from 'lucide-react'
import BioEditor          from '@/components/admin/editors/BioEditor'
import ProjectsEditor     from '@/components/admin/editors/ProjectsEditor'
import TechEditor         from '@/components/admin/editors/TechEditor'
import AchievementsEditor from '@/components/admin/editors/AchievementsEditor'
import CoursesEditor      from '@/components/admin/editors/CoursesEditor'
import ResumeUploader     from '@/components/admin/editors/ResumeUploader'
import LeadsViewer        from '@/components/admin/editors/LeadsViewer'
import EnrollmentsViewer  from '@/components/admin/editors/EnrollmentsViewer'
import Overview           from '@/components/admin/editors/Overview'
import ExperienceEditor from '@/components/admin/editors/ExperienceEditor'
import ResumeOverviewEditor from '@/components/admin/editors/ResumeOverviewEditor'
import ChatbotKnowledgeEditor from '@/components/admin/editors/ChatbotKnowledgeEditor'
import ContactMessagesViewer from '@/components/admin/editors/ContactMessagesViewer'
import PinnedReposEditor from '@/components/admin/editors/PinnedReposEditor'

const MENU = [
  { icon: LayoutDashboard, label: 'Overview',     path: '',             color: '#6c63ff' },
  { icon: User,            label: 'Bio & Links',  path: 'bio',          color: '#00d4ff' },
  { icon: Briefcase,       label: 'Experience' ,  path: 'experience' ,  color: '#f472b6'},
  { icon: Code2,           label: 'Tech Stack',   path: 'tech',         color: '#34d399' },
  { icon: FolderKanban,    label: 'Projects',     path: 'projects',     color: '#fbbf24' },
  { icon: Github,          label: 'Pinned Repos', path: 'pinned-repos', color: '#6c63ff' },
  { icon: Trophy,          label: 'Achievements', path: 'achievements', color: '#f472b6' },
  { icon: BookOpen,        label: 'Courses',      path: 'courses',      color: '#a78bfa' },
  { icon: FileText,        label: 'Resume',       path: 'resume',       color: '#6c63ff' },
  { icon: Terminal,        label: 'Resume Quick', path: 'resume-quick', color: '#f472b6' },
  { icon: BookOpen,        label: 'Knowledge',    path: 'knowledge',    color: '#34d399' },
  { icon: MessageSquare,   label: 'Contact Msgs', path: 'contacts',     color: '#6c63ff' },
  { icon: MessageSquare,   label: 'Chat Leads',   path: 'leads',        color: '#00d4ff' },
  { icon: Users,           label: 'Enrollments',  path: 'enrollments',  color: '#34d399' },
]

export default function AdminDashboard() {
  const logout       = useAuthStore(s => s.logout)
  const navigate     = useNavigate()
  const location     = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath  = location.pathname.replace('/admin/', '').replace('/admin', '')

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  function go(path: string) {
    setSidebarOpen(false)
    navigate(path ? `/admin/${path}` : '/admin')
  }

  return (
    <div className="admin-shell">
      <div className="admin-mobile-bar">
        <button className="admin-mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={18} style={{ color: '#6c63ff' }} />
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-1)' }}>sandip.dev</div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={sidebarOpen ? 'admin-sidebar open' : 'admin-sidebar'} style={{ width: '232px', background: 'var(--bg-surface)', borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 60, top: 0 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={15} style={{ color: '#6c63ff' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-1)' }}>sandip.dev</div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-3)' }}>Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {MENU.map(({ icon: Icon, label, path, color }) => {
            const active = currentPath === path
            return (
              <motion.button key={path} onClick={() => go(path)} whileHover={{ x: 3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', border: active ? `1px solid ${color}30` : '1px solid transparent', background: active ? `${color}10` : 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
                <Icon size={15} style={{ color: active ? color : 'var(--text-3)', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: active ? 'var(--text-1)' : 'var(--text-2)', fontWeight: active ? 600 : 400 }}>{label}</span>
                {active && <ChevronRight size={12} style={{ color, marginLeft: 'auto' }} />}
              </motion.button>
            )
          })}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <motion.a href="/" target="_blank" rel="noopener noreferrer" whileHover={{ x: 3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', color: 'var(--text-2)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <HelpCircle size={15} style={{ color: 'var(--text-3)' }} /> View Site
          </motion.a>
          <motion.button onClick={() => { logout(); navigate('/admin/login') }} whileHover={{ x: 3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#f87171', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <LogOut size={15} /> Sign Out
          </motion.button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="admin-main" style={{ flex: 1, marginLeft: '232px', minHeight: '100vh', overflowY: 'auto', padding: '2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}>
            <Routes>
              <Route path="/"             element={<Overview />} />
              <Route path="/bio"          element={<BioEditor />} />
              <Route path="/experience"   element={<ExperienceEditor />} />
              <Route path="/tech"         element={<TechEditor />} />
              <Route path="/projects"     element={<ProjectsEditor />} />
              <Route path="/pinned-repos" element={<PinnedReposEditor />} />
              <Route path="/achievements" element={<AchievementsEditor />} />
              <Route path="/courses"      element={<CoursesEditor />} />
              <Route path="/resume"       element={<ResumeUploader />} />
              <Route path="/resume-quick" element={<ResumeOverviewEditor />} />
              <Route path="/knowledge"    element={<ChatbotKnowledgeEditor />} />
              <Route path="/contacts"     element={<ContactMessagesViewer />} />
              <Route path="/leads"        element={<LeadsViewer />} />
              <Route path="/enrollments"  element={<EnrollmentsViewer />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}