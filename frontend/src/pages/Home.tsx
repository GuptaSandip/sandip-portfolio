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
import { useSEO, useStructuredData } from '@/hooks/useSEO'

const Divider = () => <hr className="section-divider" />

export default function Home() {
  useSEO({
    title: "Sandip Gupta - Full Stack Developer & Educator",
    description: "Full stack developer specializing in React, Python, and cloud technologies. Building scalable web applications and teaching developers.",
    url: "https://sandip.dev"
  })

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sandip Gupta",
    "url": "https://sandip.dev",
    "sameAs": [
      "https://github.com/sandipgupta",
      "https://linkedin.com/in/sandipgupta"
    ],
    "jobTitle": "Full Stack Developer",
    "knowsAbout": ["React", "Python", "FastAPI", "PostgreSQL", "TypeScript"]
  })

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
