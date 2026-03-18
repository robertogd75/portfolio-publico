import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nContext'
import ConstellationBackground from './ConstellationBackground'

const originalTitles = ['Full Stack Developer', 'Problem Solver', 'Systems Thinker']

export default function Hero() {
  const { t, lang } = useTranslation()
  const titles = lang === 'es' ? ['Desarrollador Full Stack', 'Arquitecto de Software', 'Problem Solver']
    : lang === 'de' ? ['Full Stack Entwickler', 'Software Architekt', 'Problemlöser']
    : originalTitles

  const [titleIdx, setTitleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const target = titles[titleIdx]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
        return () => clearTimeout(t)
      } else {
        setTitleIdx(i => (i + 1) % titles.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, titleIdx])

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--grad-hero)',
        pointerEvents: 'none',
      }} />

      {/* Neon orbs */}
      <div className="orb" style={{
        width: 500, height: 500,
        background: 'rgba(0,240,255,0.07)',
        top: '-10%', left: '-10%',
        animationDuration: '8s',
      }} />
      <div className="orb" style={{
        width: 400, height: 400,
        background: 'rgba(168,85,247,0.08)',
        bottom: '5%', right: '-5%',
        animationDelay: '3s',
        animationDuration: '10s',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '5rem' }}>
        {/* Status badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 20,
          background: 'rgba(57,255,20,0.08)',
          border: '1px solid rgba(57,255,20,0.2)',
          marginBottom: '2.5rem',
          animation: 'fadeInUp 0.6s ease both',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--neon-green)',
            boxShadow: '0 0 8px var(--neon-green)',
            display: 'inline-block',
            animation: 'blink 1.5s ease infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--neon-green)',
            letterSpacing: '0.08em',
          }}>{t('hero', 'available')}</span>
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: '1rem',
          animation: 'fadeInUp 0.7s ease 0.1s both',
        }}>
          Roberto<br />
          <span className="neon-text">García Delgado</span>
        </h1>

        {/* Typing title */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '1.75rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          animation: 'fadeInUp 0.7s ease 0.2s both',
        }}>
          <span style={{ color: 'var(--neon-cyan)' }}>&gt;&nbsp;</span>
          <span>{displayed}</span>
          <span style={{
            display: 'inline-block',
            width: 2, height: '1.1em',
            background: 'var(--neon-cyan)',
            animation: 'blink 0.9s step-end infinite',
          }} />
        </div>

        {/* Tagline */}
        <p style={{
          maxWidth: 560,
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          animation: 'fadeInUp 0.7s ease 0.3s both',
        }}>
          {t('hero', 'tagline_start')}
          <strong style={{ color: 'var(--text-primary)' }}>{t('hero', 'tagline_strong')}</strong>
          {t('hero', 'tagline_end')}
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s ease 0.4s both',
        }}>
          <a
            href="https://www.linkedin.com/in/roberto-garcia-delgado-626b9430a"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            {t('hero', 'btn_linkedin')}
          </a>
          <a
            href="https://github.com/robertogd75"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
            {t('hero', 'btn_github')}
          </a>
          <Link to="/stack" className="btn btn-outline">
            {t('hero', 'btn_stack')}
          </Link>
        </div>

        {/* Bottom stats row */}
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          marginTop: '4rem',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s ease 0.5s both',
        }}>
          {[
            { value: '25+', label: t('hero', 'stat_tech') },
            { 
              value: 'B2', 
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <img src="/SVG/uk.svg" alt="UK Flag" style={{ width: 14, height: 10, borderRadius: 2 }} />
                  {t('hero', 'stat_english')}
                </span>
              )
            },
            { value: '24/7', label: t('hero', 'stat_port') },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.6rem',
                fontWeight: 700,
                background: 'var(--grad-neon)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
