import { useState, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'

const UI = {
  es: {
    label:          '// mis.proyectos',
    titleStart:     'Proyectos',
    titleNeon:      'Reales.',
    desc:           'Aplicaciones construidas de principio a fin. Arquitectura, código y despliegue — todo hecho por mí.',
    live:           'En producción',
    wip:            'En desarrollo',
    soon:           'Próximamente',
    viewGitHub:     'GitHub',
    viewDemo:       'Visitar web',
    private:        'Privado',
    privateRepo:    'Repositorio privado',
    commitsLabel:   '// actividad.github',
    commitsTitle:   'Últimos',
    commitsNeon:    'Commits.',
    commitsDesc:    'Mi actividad más reciente en GitHub, en tiempo real.',
    commitsLoading: 'Cargando actividad...',
    commitsError:   'No se pudo cargar la actividad de GitHub.',
    commitsEmpty:   'No hay commits recientes.',
    commitsViewAll: 'Ver todo en GitHub',
  },
  en: {
    label:          '// my.projects',
    titleStart:     'Real-World',
    titleNeon:      'Projects.',
    desc:           'Applications built from scratch. Architecture, code and deployment — all done by me.',
    live:           'Live',
    wip:            'In progress',
    soon:           'Coming soon',
    viewGitHub:     'GitHub',
    viewDemo:       'Visit website',
    private:        'Private',
    privateRepo:    'Private repository',
    commitsLabel:   '// github.activity',
    commitsTitle:   'Latest',
    commitsNeon:    'Commits.',
    commitsDesc:    'My most recent activity on GitHub, in real time.',
    commitsLoading: 'Loading activity...',
    commitsError:   'Could not load GitHub activity.',
    commitsEmpty:   'No recent commits.',
    commitsViewAll: 'View all on GitHub',
  },
  de: {
    label:          '// meine.projekte',
    titleStart:     'Echte',
    titleNeon:      'Projekte.',
    desc:           'Anwendungen von Grund auf gebaut. Architektur, Code und Deployment — alles von mir.',
    live:           'Live',
    wip:            'In Entwicklung',
    soon:           'Demnächst',
    viewGitHub:     'GitHub',
    viewDemo:       'Website besuchen',
    private:        'Privat',
    privateRepo:    'Privates Repository',
    commitsLabel:   '// github.aktivität',
    commitsTitle:   'Letzte',
    commitsNeon:    'Commits.',
    commitsDesc:    'Meine neueste Aktivität auf GitHub, in Echtzeit.',
    commitsLoading: 'Aktivität wird geladen...',
    commitsError:   'GitHub-Aktivität konnte nicht geladen werden.',
    commitsEmpty:   'Keine aktuellen Commits.',
    commitsViewAll: 'Alle auf GitHub ansehen',
  },
}

const GITHUB_USER = 'robertogd75'

const PROJECTS = [
  {
    id: 'marbella-facil',
    icon: (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <circle cx="60" cy="18" r="9" fill="#f59e0b"/>
        <line x1="60" y1="5" x2="60" y2="2" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="60" y1="31" x2="60" y2="34" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="47" y1="18" x2="44" y2="18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="73" y1="18" x2="76" y2="18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="51" y1="9" x2="48.9" y2="6.9" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="69" y1="27" x2="71.1" y2="29.1" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="51" y1="27" x2="48.9" y2="29.1" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="69" y1="9" x2="71.1" y2="6.9" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M25 68 C24 54 25 42 27 35 C29 28 29 24 25 21" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M25 21 C16 13 6 16 3 23 C12 20 20 22 25 21Z" fill="#f59e0b" opacity="0.8"/>
        <path d="M25 21 C32 12 42 12 45 20 C37 16 29 19 25 21Z" fill="#f59e0b" opacity="0.8"/>
        <path d="M25 21 C22 12 24 3 29 1 C27 12 26 18 25 21Z" fill="#f59e0b" opacity="0.65"/>
        <path d="M3 56 Q11 51 19 56 Q27 61 35 56 Q43 51 51 56 Q59 61 67 56 Q73 53 77 56" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M3 64 Q11 59 19 64 Q27 69 35 64 Q43 59 51 64 Q59 69 67 64" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      </svg>
    ),
    category: { es: 'PLATAFORMA SAAS', en: 'SAAS PLATFORM', de: 'SAAS-PLATTFORM' },
    bannerGradient: 'linear-gradient(145deg, #5c2d0a 0%, #a0521a 55%, #c47c2b 100%)',
    bannerGlow: 'rgba(196,124,43,0.35)',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
    tags: ['Laravel 10', 'React', 'Inertia.js', 'MySQL', 'SaaS'],
    status: 'live',
    isPrivate: false,
    github: 'https://github.com/fmargarrobertogd75/proyecto-marbella-facil',
    demo: 'https://marbellafacil.rgardel.es/',
    title: { es: 'Marbella Fácil', en: 'Marbella Fácil', de: 'Marbella Fácil' },
    desc: {
      es: 'Plataforma SaaS integral orientada al turismo inteligente. Backend robusto en Laravel 10 con arquitectura SPA mediante React e Inertia.js. Incluye gestión dinámica de suscripciones, sistema transaccional de reservas en tiempo real y monitorización meteorológica.',
      en: 'Comprehensive SaaS platform focused on intelligent tourism. Robust Laravel 10 backend with SPA architecture using React and Inertia.js. Features dynamic subscription management, real-time booking system and weather monitoring.',
      de: 'Umfassende SaaS-Plattform für intelligenten Tourismus. Robustes Laravel 10 Backend mit SPA-Architektur via React und Inertia.js. Enthält dynamisches Abonnementmanagement, Echtzeit-Buchungssystem und Wetterüberwachung.',
    },
  },
  {
    id: 'sistema-vados',
    icon: (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <line x1="5" y1="57" x2="60" y2="57" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
        <rect x="6" y="36" width="46" height="17" rx="4" fill="none" stroke="#00f0ff" strokeWidth="2"/>
        <path d="M14 36 C16 26 22 22 28 22 C36 22 42 26 44 36" fill="none" stroke="#00f0ff" strokeWidth="2"/>
        <circle cx="17" cy="53" r="5.5" fill="none" stroke="#00f0ff" strokeWidth="2"/>
        <circle cx="17" cy="53" r="2" fill="#00f0ff" opacity="0.5"/>
        <circle cx="41" cy="53" r="5.5" fill="none" stroke="#00f0ff" strokeWidth="2"/>
        <circle cx="41" cy="53" r="2" fill="#00f0ff" opacity="0.5"/>
        <rect x="20" y="27" width="9" height="8" rx="1.5" fill="#00f0ff" opacity="0.18" stroke="#00f0ff" strokeWidth="1.5"/>
        <rect x="31" y="27" width="9" height="8" rx="1.5" fill="#00f0ff" opacity="0.18" stroke="#00f0ff" strokeWidth="1.5"/>
        <rect x="50" y="39" width="4" height="3" rx="1" fill="#00f0ff" opacity="0.55"/>
        <circle cx="66" cy="28" r="13" fill="#00f0ff" opacity="0.05" stroke="#00f0ff" strokeWidth="2"/>
        <text x="66" y="34" textAnchor="middle" fill="#00f0ff" fontSize="16" fontWeight="bold" fontFamily="monospace">P</text>
      </svg>
    ),
    category: { es: 'APP EMPRESARIAL', en: 'ENTERPRISE APP', de: 'UNTERNEHMENS-APP' },
    bannerGradient: 'linear-gradient(145deg, #052e2e 0%, #0d5e5e 55%, #1a7a7a 100%)',
    bannerGlow: 'rgba(13,94,94,0.4)',
    color: 'var(--neon-cyan)',
    glow: 'rgba(0,240,255,0.12)',
    tags: ['PHP', 'PostgreSQL', 'LDAP', 'Intranet'],
    status: 'live',
    isPrivate: true,
    github: null,
    demo: null,
    title: { es: 'Sistema de Vados', en: 'Vados System', de: 'Vados-System' },
    desc: {
      es: 'Solución empresarial para la gestión de vados del Ayuntamiento de Marbella. Lógica de negocio compleja, sistemas de auditoría, despliegue en Intranet e integración con Directorio Activo (LDAP).',
      en: 'Enterprise solution for parking permit management at Marbella City Hall. Complex business logic, audit systems, intranet deployment and Active Directory (LDAP) integration.',
      de: 'Unternehmenslösung für die Verwaltung von Parkausweisen im Rathaus von Marbella. Komplexe Geschäftslogik, Audit-Systeme, Intranet-Deployment und Active Directory (LDAP) Integration.',
    },
  },
  {
    id: 'portfolio',
    icon: (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <rect x="5" y="7" width="70" height="50" rx="6" fill="none" stroke="#a855f7" strokeWidth="2"/>
        <rect x="9" y="13" width="62" height="40" rx="3" fill="#a855f7" opacity="0.07"/>
        <line x1="5" y1="20" x2="75" y2="20" stroke="#a855f7" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="15" cy="14" r="2.5" fill="#a855f7" opacity="0.6"/>
        <circle cx="23" cy="14" r="2.5" fill="#a855f7" opacity="0.4"/>
        <circle cx="31" cy="14" r="2.5" fill="#a855f7" opacity="0.25"/>
        <path d="M23 29 L15 39 L23 49" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="45" y1="49" x2="35" y2="29" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.65"/>
        <path d="M57 29 L65 39 L57 49" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="28" y="57" width="14" height="5" rx="1.5" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.45"/>
        <rect x="21" y="62" width="28" height="3" rx="1.5" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.45"/>
      </svg>
    ),
    category: { es: 'PORTFOLIO & LAB', en: 'PORTFOLIO & LAB', de: 'PORTFOLIO & LAB' },
    bannerGradient: 'linear-gradient(145deg, #2d0a5c 0%, #6d28d9 55%, #9333ea 100%)',
    bannerGlow: 'rgba(109,40,217,0.4)',
    color: 'var(--neon-purple)',
    glow: 'rgba(168,85,247,0.15)',
    tags: ['React 19', 'Vite', 'Docker', 'Nginx', 'Node.js'],
    status: 'live',
    isPrivate: false,
    github: 'https://github.com/robertogd75/portfolio-publico',
    demo: 'https://rgardel.es',
    title: { es: 'Portfolio & Lab', en: 'Portfolio & Lab', de: 'Portfolio & Lab' },
    desc: {
      es: 'Mi portafolio personal y laboratorio de herramientas. SPA en React 19 + Vite, desplegado en servidor propio con Docker y Nginx. Incluye i18n (ES/EN/DE), 16 herramientas de laboratorio y formulario de contacto con backend Node.js.',
      en: 'My personal portfolio and tools laboratory. React 19 + Vite SPA, self-hosted with Docker and Nginx. Includes i18n (ES/EN/DE), 16 lab tools and a contact form with Node.js backend.',
      de: 'Mein persönliches Portfolio und Werkzeuglabor. React 19 + Vite SPA, Self-Hosted mit Docker und Nginx. Enthält i18n (ES/EN/DE), 16 Lab-Tools und Kontaktformular mit Node.js.',
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const GITHUB_SVG = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const LOCK_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

function timeAgo(dateStr, lang) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diffMs / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (lang === 'es') {
    if (m < 60) return `hace ${m} min`
    if (h < 24) return `hace ${h}h`
    if (d === 1) return 'ayer'
    if (d < 7) return `hace ${d} días`
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
  if (lang === 'de') {
    if (m < 60) return `vor ${m} Min`
    if (h < 24) return `vor ${h}h`
    if (d === 1) return 'gestern'
    if (d < 7) return `vor ${d} Tagen`
    return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
  }
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d} days ago`
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({ project, lang, ui }) {
  const [hovered, setHovered] = useState(false)
  const title    = project.title[lang]    ?? project.title.en
  const desc     = project.desc[lang]     ?? project.desc.en
  const category = project.category[lang] ?? project.category.en

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? project.color + '66' : 'var(--border)'}`,
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 48px ${project.glow}` : 'none',
      }}
    >
      {/* ── Banner ── */}
      <div style={{
        position: 'relative',
        height: 190,
        background: project.bannerGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
        overflow: 'hidden',
      }}>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 80%, ${project.bannerGlow}, transparent)`,
          pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        {/* Icon */}
        <span style={{ fontSize: '3.8rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
          {project.icon}
        </span>

        {/* Category label */}
        <span style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        }}>
          {category}
        </span>

        {/* Private badge */}
        {project.isPrivate && (
          <span style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2,
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: '0.2rem 0.6rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)',
          }}>
            {LOCK_SVG}
            {ui.private}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
            {desc}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              padding: '0.2rem 0.6rem', borderRadius: 6,
              background: `${project.color}10`,
              border: `1px solid ${project.color}28`,
              color: project.color,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {project.isPrivate ? (
            /* Disabled private repo button */
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '0.4rem 1rem',
              opacity: 0.55, cursor: 'default', flex: 1, justifyContent: 'center',
            }}>
              {LOCK_SVG}
              {ui.privateRepo}
            </span>
          ) : (
            <>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: 8, padding: '0.4rem 1rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    flex: project.demo ? '0 0 auto' : 1, justifyContent: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.borderColor = 'var(--neon-cyan)44' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {GITHUB_SVG}
                  {ui.viewGitHub}
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    color: project.color,
                    background: `${project.color}12`,
                    border: `1px solid ${project.color}40`,
                    borderRadius: 8, padding: '0.4rem 1rem',
                    textDecoration: 'none', transition: 'all 0.2s', flex: 1, justifyContent: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${project.color}22`; e.currentTarget.style.borderColor = `${project.color}70` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${project.color}12`; e.currentTarget.style.borderColor = `${project.color}40` }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  {ui.viewDemo}
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CommitsSection ────────────────────────────────────────────────────────────
function CommitsSection({ ui, lang }) {
  const [commits, setCommits]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    fetch(
      `https://api.github.com/search/commits?q=author:${GITHUB_USER}&sort=committer-date&order=desc&per_page=6`,
      { headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } }
    )
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => {
        const result = (data.items ?? []).map(item => ({
          sha:      item.sha,
          message:  item.commit.message.split('\n')[0].slice(0, 80),
          repo:     item.repository.name,
          repoFull: item.repository.full_name,
          date:     item.commit.committer.date,
          url:      item.html_url,
        }))
        setCommits(result)
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <section style={{ marginTop: '5rem' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
          {ui.commitsLabel}
        </div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
          {ui.commitsTitle}{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {ui.commitsNeon}
          </span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
          {ui.commitsDesc}
        </p>
      </div>

      {/* Content */}
      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {ui.commitsLoading}
        </p>
      )}
      {error && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {ui.commitsError}
        </p>
      )}
      {!loading && !error && commits.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {ui.commitsEmpty}
        </p>
      )}
      {!loading && !error && commits.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {commits.map((c, i) => (
              <CommitCard key={`${c.sha}-${i}`} commit={c} lang={lang} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '0.55rem 1.4rem',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.borderColor = 'var(--neon-cyan)44' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {GITHUB_SVG}
              {ui.commitsViewAll}
            </a>
          </div>
        </>
      )}
    </section>
  )
}

function CommitCard({ commit, lang }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: hovered ? 'rgba(0,240,255,0.04)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(0,240,255,0.25)' : 'var(--border)'}`,
        borderRadius: 12, padding: '1rem 1.1rem',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Repo name */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--neon-cyan)', marginBottom: '0.5rem',
        background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.18)',
        borderRadius: 5, padding: '0.15rem 0.5rem',
      }}>
        {GITHUB_SVG}
        {commit.repo}
      </div>

      {/* Message */}
      <p style={{
        margin: 0, color: 'var(--text-primary)', fontSize: '0.875rem',
        lineHeight: 1.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {commit.message}
      </p>

      {/* Meta: sha + time */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '0.55rem', gap: '0.5rem',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-muted)' }}>
          {commit.sha.slice(0, 7)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-muted)' }}>
          {timeAgo(commit.date, lang)}
        </span>
      </div>
    </a>
  )
}

export default function ProjectsPage() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es

  return (
    <main style={{ paddingTop: '68px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="orb" style={{ width: 450, height: 450, background: 'rgba(0,240,255,0.06)', top: '5%', right: '-8%', animationDuration: '11s' }} />
      <div className="orb" style={{ width: 320, height: 320, background: 'rgba(168,85,247,0.06)', bottom: '10%', left: '-6%', animationDelay: '4s' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--section-pad)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            {ui.label}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
            {ui.titleStart}{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {ui.titleNeon}
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
            {ui.desc}
          </p>
        </div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {PROJECTS.map(p => (
            <ProjectCard key={p.id} project={p} lang={lang} ui={ui} />
          ))}
        </div>

        {/* Latest commits */}
        <CommitsSection ui={ui} lang={lang} />
      </div>
    </main>
  )
}
