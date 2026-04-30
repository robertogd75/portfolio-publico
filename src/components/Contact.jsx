import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { MapPin, Globe } from 'lucide-react'

export default function Contact() {
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()

  return (
    <section id="contact" style={{
      padding: 'var(--section-pad)',
      background: 'var(--bg-secondary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div className="orb" style={{
        width: 700, height: 500,
        background: 'rgba(0,240,255,0.06)',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        animationDuration: '9s',
      }} />
      <div className="orb" style={{
        width: 400, height: 400,
        background: 'rgba(168,85,247,0.06)',
        right: '-10%', bottom: '0%',
        animationDelay: '4s',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="section-label" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
          {t('contact', 'label')}
        </div>

        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: '1.5rem',
          lineHeight: 1.1,
        }}>
          {t('contact', 'title_start')}<br />
          <span className="neon-text">{t('contact', 'title_neon')}</span>
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.8,
          maxWidth: 600,
          margin: '0 auto 3rem',
        }}>
          {t('contact', 'desc')}
        </p>

        {/* Main CTA */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a
            href="https://www.linkedin.com/in/roberto-garcia-delgado-626b9430a"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              borderRadius: 14,
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              boxShadow: hovered
                ? '0 0 60px rgba(0,240,255,0.5), 0 0 120px rgba(168,85,247,0.3)'
                : '0 0 30px rgba(0,240,255,0.25)',
              transform: hovered ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'all 0.25s ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>

          <a
            href="https://github.com/robertogd75"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              borderRadius: 14,
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--neon-cyan)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,240,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
            GitHub
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>

        </div>

        {/* Secondary info */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
        }}>
          {[
            { id: 'loc', icon: <MapPin size={16} />, text: t('contact', 'location') },
            { id: 'web', icon: <Globe size={16} />, text: 'rgardel.es' },
            { 
              id: 'cert', 
              icon: <img src="/SVG/uk.svg" alt="UK" style={{ width: 16, height: 11, borderRadius: 2 }} />, 
              text: t('contact', 'english_cert') 
            },
          ].map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '6rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('contact', 'built')}
          </div>
        </div>
      </div>
    </section>
  )
}
