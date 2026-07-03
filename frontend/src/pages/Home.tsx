import Hero         from '@/components/sections/Hero'
import About        from '@/components/sections/About'
import TechStack    from '@/components/sections/TechStack'
import Projects     from '@/components/sections/Projects'
import GitHub       from '@/components/sections/GitHub'
import Resume       from '@/components/sections/Resume'
import Achievements from '@/components/sections/Achievements'
import Courses      from '@/components/sections/Courses'
import Contact      from '@/components/sections/Contact'
import ChatWidget from '@/components/chatbot/ChatWidget'

const Divider = () => <hr className="section-divider" />

export default function Home() {
  return (
    <div>
      <Hero />
      <Divider />
      <About />
      <Divider />
      <TechStack />
      <Divider />
      <Projects />
      <Divider />
      <GitHub />
      <Divider />
      <Resume />
      <Achievements />
      <Courses />
      <Divider />
      <Contact />
      <ChatWidget />
    </div>
  )
}
