// import Hero from '@/components/sections/Hero'
// import About from '@/components/sections/About'
// import TechStack from '@/components/sections/TechStack'
// import Achievements from '@/components/sections/Achievements'

// export default function Home() {
//   return (
//     <div>
//       <Hero />
//       <div style={{ borderTop: '1px solid var(--bd)' }} />
//       <About />
//       <div style={{ borderTop: '1px solid var(--bd)' }} />
//       <TechStack />
//       <div style={{ borderTop: '1px solid var(--bd)' }} />
//       <Achievements />

//       {/* Day 3: <Projects /> */}
//       {/* Day 3: <GitHub /> */}
//       {/* Day 4: <Resume /> */}
//       {/* Day 5: <Accomplishments /> */}
//       {/* Day 6: <Courses /> */}
//     </div>
//   )
// }
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

const Divider = () => (
  <div style={{ maxWidth: '72rem', margin: '0 auto', borderTop: '1px solid var(--bd)' }} />
)

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
      {/* Achievements — hidden automatically if none added via admin */}
      <Achievements />
      {/* Courses — hidden automatically if none made visible via admin */}
      <Courses />
      <Divider />
      <Contact />
      <ChatWidget />
    </div>
  )
}