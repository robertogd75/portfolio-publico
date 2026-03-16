import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TechStack from './components/TechStack.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Performance from './components/Performance.jsx'
import Achievements from './components/Achievements.jsx'
import Contact from './components/Contact.jsx'
import { I18nProvider } from './i18n/I18nContext.jsx'

export default function App() {
  return (
    <I18nProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <About />
        <Experience />
        <Performance />
        <Achievements />
        <Contact />
      </main>
    </div>
    </I18nProvider>
  )
}
