import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nContext'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const links = [
  { key: 'home',     to: '/' },
  { key: 'stack',    to: '/stack' },
  { key: 'exp',      to: '/experience' },
  { key: 'projects', to: '/projects' },
  { key: 'lab',      to: '/lab' },
  { key: 'contact',  to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  )
  const { lang, changeLanguage, t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const flagIcons = {
    es: '/SVG/spain.svg',
    en: '/SVG/uk.svg',
    de: '/SVG/germany.svg'
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 1.5rem',
      transition: 'all 0.3s ease',
      background: scrolled ? 'var(--navbar-scrolled-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          fontWeight: 700,
          textDecoration: 'none',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: '#000',
          }}>RG</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>rgardel.es</span>
        </Link>

        <ul style={{
          display: 'flex',
          gap: '1.25rem',
          listStyle: 'none',
          alignItems: 'center',
        }} className="nav-links-desktop">
          {links.map(l => (
            <li key={l.key}>
              <Link to={l.to} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: isActive(l.to) ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'color 0.2s',
                borderBottom: isActive(l.to) ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                paddingBottom: '2px',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-cyan)'}
              onMouseLeave={e => e.currentTarget.style.color = isActive(l.to) ? 'var(--neon-cyan)' : 'var(--text-secondary)'}
              >{t('nav', l.key)}</Link>
            </li>
          ))}

          <li style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
              title={lang.toUpperCase()}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '0.35rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src={flagIcons[lang]} alt={lang} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            </button>
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                minWidth: '80px',
                zIndex: 10,
              }}>
                {['es', 'en', 'de'].map(l => (
                  <button
                    key={l}
                    onClick={() => changeLanguage(l)}
                    style={{
                      background: lang === l ? 'rgba(0,240,255,0.1)' : 'transparent',
                      color: lang === l ? 'var(--neon-cyan)' : 'var(--text-primary)',
                      border: 'none',
                      padding: '0.4rem',
                      borderRadius: 4,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <img src={flagIcons[l]} alt={l} style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} />
                    {l === 'es' ? 'Español' : l === 'en' ? 'English' : 'Deutsch'}
                  </button>
                ))}
              </div>
            )}
          </li>

          <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a
              href="https://github.com/robertogd75"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'transparent',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/roberto-garcia-delgado-626b9430a"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 16px rgba(0,240,255,0.2)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(0,240,255,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(0,240,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </li>
          <li>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: 'rgba(128,128,200,0.08)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.45rem 0.5rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </li>
        </ul>

        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '0.4rem 0.6rem',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M18 6 6 18M6 6l12 12"/>
              : <path d="M3 12h18M3 6h18M3 18h18"/>
            }
          </svg>
        </button>
      </nav>

      {open && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {['es', 'en', 'de'].map(l => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                style={{
                  background: lang === l ? 'rgba(0,240,255,0.1)' : 'transparent',
                  color: lang === l ? 'var(--neon-cyan)' : 'var(--text-primary)',
                  border: `1px solid ${lang === l ? 'var(--neon-cyan)' : 'var(--border)'}`,
                  padding: '0.4rem 0.8rem',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <img src={flagIcons[l]} alt={l} style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} />
                {l}
              </button>
            ))}
          </div>

          {links.map(l => (
            <Link key={l.key} to={l.to} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: isActive(l.to) ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              textDecoration: 'none',
            }}>{t('nav', l.key)}</Link>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/robertogd75" target="_blank" rel="noopener noreferrer"
              className="btn btn-outline"
            >GitHub ↗</a>
            <a href="https://www.linkedin.com/in/roberto-garcia-delgado-626b9430a" target="_blank" rel="noopener noreferrer"
              className="btn btn-primary"
            >LinkedIn ↗</a>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: 'rgba(128,128,200,0.08)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.5rem 0.75rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger    { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
