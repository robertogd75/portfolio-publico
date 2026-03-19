import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import HomePage from './pages/HomePage.jsx'
import StackPage from './pages/StackPage.jsx'
import ExperiencePage from './pages/ExperiencePage.jsx'
import LabPage from './pages/LabPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import { I18nProvider } from './i18n/I18nContext.jsx'
import { ChatProvider } from './components/ChatContext.jsx'

const pageVariants = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <ChatProvider>
      <BrowserRouter>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <Navbar />
          <AnimatedRoutes />
          <ChatWidget />
        </div>
      </BrowserRouter>
      </ChatProvider>
    </I18nProvider>
  )
}

