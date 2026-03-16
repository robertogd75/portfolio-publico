import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Performance from '../components/Performance.jsx'
import Achievements from '../components/Achievements.jsx'
import Contact from '../components/Contact.jsx'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Performance />
      <Achievements />
      <Contact />
    </main>
  )
}
