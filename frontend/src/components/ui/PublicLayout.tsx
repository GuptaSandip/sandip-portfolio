import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from '@/components/chatbot/ChatWidget'

export default function PublicLayout() {
  return (
    <div className="site-outer">
      <div className="site-frame">
        <Navbar />
        <main style={{ flex: 1, paddingTop: '88px' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatWidget />
    </div>
  )
}
