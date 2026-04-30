import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'
import { Github, Lock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    color: '#00f0ff',
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
    color: '#a855f7',
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
  {
    id: 'cuadro-digital',
    icon: (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <circle cx="40" cy="40" r="28" stroke="#39ff14" strokeWidth="2" strokeDasharray="120 60" />
        <path d="M40 40 L60 25" stroke="#39ff14" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="4" fill="#39ff14" />
        <text x="40" y="62" textAnchor="middle" fill="#39ff14" fontSize="10" fontWeight="bold" fontFamily="monospace">RPM x1000</text>
        <path d="M15 45 Q20 35 40 35 Q60 35 65 45" stroke="#39ff14" strokeWidth="1.5" opacity="0.3" fill="none" />
      </svg>
    ),
    category: { es: 'TELEMETRÍA OBD-II', en: 'OBD-II TELEMETRY', de: 'OBD-II TELEMETRIE' },
    bannerGradient: 'linear-gradient(145deg, #0a2e0a 0%, #1a5e1a 55%, #2db42d 100%)',
    bannerGlow: 'rgba(57,255,20,0.35)',
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.15)',
    tags: ['Python', 'Kivy', 'OBD-II', 'Raspberry Pi'],
    status: 'live',
    isPrivate: false,
    github: 'https://github.com/robertogd75/Cuadro-Digital-OBD',
    demo: null,
    title: { es: 'Cuadro Digital OBD', en: 'OBD Digital Dash', de: 'Digitales OBD-Display' },
    desc: {
      es: 'Central de instrumentación profesional para vehículos. Visualiza telemetría en tiempo real (CV, Nm, Turbo) optimizada para motores 1.6 HDI. Incluye cronómetro 0-100 km/h y diagnóstico DTC.',
      en: 'Professional vehicle instrumentation hub. Visualizes real-time telemetry (HP, Nm, Turbo) optimized for 1.6 HDI engines. Includes 0-100 km/h timer and DTC diagnostics.',
      de: 'Professionelles Fahrzeuginstrumenten-Hub. Visualisiert Echtzeit-Telemetrie (PS, Nm, Turbo), optimiert für 1.6 HDI Motoren. Inklusive 0-100 km/h Timer und DTC-Diagnose.',
    },
  },
  {
    id: 'pixelshare',
    icon: (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <rect x="10" y="10" width="60" height="45" rx="4" stroke="#00f0ff" strokeWidth="2" />
        <path d="M20 25 L35 40 L50 20 L60 35" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="45" r="8" fill="#00f0ff" opacity="0.2" stroke="#00f0ff" strokeWidth="1.5" />
        <path d="M56 45 L64 45 M60 41 L60 49" stroke="#00f0ff" strokeWidth="2" />
        <line x1="10" y1="50" x2="70" y2="50" stroke="#00f0ff" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
    category: { es: 'COLLABORATIVE APP', en: 'COLLABORATIVE APP', de: 'KOLLABORATIVE APP' },
    bannerGradient: 'linear-gradient(145deg, #052e2e 0%, #0d5e5e 55%, #1a7a7a 100%)',
    bannerGlow: 'rgba(0,240,255,0.35)',
    color: '#00f0ff',
    glow: 'rgba(0,240,255,0.15)',
    tags: ['Spring Boot 3', 'Angular 18', 'WebSockets', 'Docker'],
    status: 'live',
    isPrivate: false,
    github: 'https://github.com/robertogd75/Proyecto-PixelShare',
    demo: 'https://pixelshare.rgardel.es',
    title: { es: 'PixelShare', en: 'PixelShare', de: 'PixelShare' },
    desc: {
      es: 'Pizarra colaborativa en tiempo real de alto rendimiento. Permite crear salas privadas para dibujar y compartir ideas simultáneamente con baja latencia y gestión de persistencia.',
      en: 'High-performance real-time collaborative whiteboard. Create private rooms to draw and share ideas simultaneously with low latency and persistence management.',
      de: 'Hochleistungs-Echtzeit-Whiteboard für die Zusammenarbeit. Erstellen Sie private Räume, um Ideen gleichzeitig mit geringer Latenz und Persistenzmanagement zu teilen.',
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const GITHUB_SVG = <Github size={13} />

const LOCK_SVG = <Lock size={12} strokeWidth={2.5} />

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
        height: '100%',
        width: '100%',
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
                    color: project.color,
                    background: `${project.color}10`,
                    border: `1px solid ${project.color}35`,
                    borderRadius: 8, padding: '0.4rem 1rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    flex: project.demo ? '0 0 auto' : 1, justifyContent: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${project.color}22`; e.currentTarget.style.borderColor = `${project.color}65` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${project.color}10`; e.currentTarget.style.borderColor = `${project.color}35` }}
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
                    background: `${project.color}10`,
                    border: `1px solid ${project.color}35`,
                    borderRadius: 8, padding: '0.4rem 1rem',
                    textDecoration: 'none', transition: 'all 0.2s', flex: 1, justifyContent: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${project.color}22`; e.currentTarget.style.borderColor = `${project.color}65` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${project.color}10`; e.currentTarget.style.borderColor = `${project.color}35` }}
                >
                  <ExternalLink size={12} strokeWidth={2.5} />
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
  const [index, setIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const paginate = useCallback((newDirection) => {
    setIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = PROJECTS.length - 1
      if (nextIndex >= PROJECTS.length) nextIndex = 0
      return nextIndex
    })
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, paginate])

  // Responsive items to show
  const [itemsToShow, setItemsToShow] = useState(3)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) setItemsToShow(1)
      else if (window.innerWidth <= 1024) setItemsToShow(2)
      else setItemsToShow(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

        {/* Carousel Container */}
        <div 
          style={{ position: 'relative', padding: '0 1rem' }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Controls - Outer */}
          <button
            onClick={() => paginate(-1)}
            style={{
              position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)',
              background: 'var(--bg-glass)', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => paginate(1)}
            style={{
              position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)',
              background: 'var(--bg-glass)', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Viewport */}
          <div style={{ overflow: 'hidden', padding: '1rem 0' }}>
            <motion.div 
              animate={{ x: `-${index * (100 / itemsToShow)}%` }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{
                display: 'flex',
                gap: '1.5rem',
              }}
            >
              {PROJECTS.map((p) => (
                <div 
                  key={p.id}
                  style={{
                    flex: `0 0 calc(${100 / itemsToShow}% - ${(1.5 * (itemsToShow - 1)) / itemsToShow}rem)`,
                    display: 'flex',
                  }}
                >
                  <div style={{ flex: 1, display: 'flex' }}>
                    <ProjectCard project={p} lang={lang} ui={ui} />
                  </div>
                </div>
              ))}
              
              {/* Duplicate projects for infinite effect if needed, 
                  but for 5 projects showing 3, simple sliding is okay.
                  To avoid empty space at end, we can append first items */}
              {PROJECTS.slice(0, itemsToShow).map((p) => (
                <div 
                  key={`${p.id}-dup`}
                  style={{
                    flex: `0 0 calc(${100 / itemsToShow}% - ${(1.5 * (itemsToShow - 1)) / itemsToShow}rem)`,
                    display: 'flex',
                  }}
                >
                  <div style={{ flex: 1, display: 'flex' }}>
                    <ProjectCard project={p} lang={lang} ui={ui} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? 30 : 10,
                  height: 6,
                  borderRadius: 3,
                  background: i === index ? 'var(--neon-cyan)' : 'var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: i === index ? '0 0 10px var(--neon-cyan)66' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Latest commits */}
        <CommitsSection ui={ui} lang={lang} />
      </div>
    </main>
  )
}
