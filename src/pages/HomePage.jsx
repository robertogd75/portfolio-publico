import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Performance from '../components/Performance.jsx'
import Achievements from '../components/Achievements.jsx'
import AiChatSection from '../components/AiChatSection.jsx'
import Contact from '../components/Contact.jsx'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Performance />
      <Achievements />
      <div className="container" style={{ padding: 'var(--section-pad)' }}>
        <AiChatSection />
      </div>
      <Contact />
    </main>
  )
}
