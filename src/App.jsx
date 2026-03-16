import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import StackPage from './pages/StackPage.jsx'
import ExperiencePage from './pages/ExperiencePage.jsx'
import LabPage from './pages/LabPage.jsx'
import { I18nProvider } from './i18n/I18nContext.jsx'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stack" element={<StackPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/lab" element={<LabPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </I18nProvider>
  )
}

