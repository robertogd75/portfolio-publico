import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'
import ImageStudio from '../components/lab/ImageStudio.jsx'
import PasswordGen from '../components/lab/PasswordGen.jsx'
import JsonFormatter from '../components/lab/JsonFormatter.jsx'
import ColorPalette from '../components/lab/ColorPalette.jsx'
import HashGenerator from '../components/lab/HashGenerator.jsx'
import CssConverter from '../components/lab/CssConverter.jsx'
import QrGenerator from '../components/lab/QrGenerator.jsx'
import SpeedTest from '../components/lab/SpeedTest.jsx'
import WordCounter from '../components/lab/WordCounter.jsx'
import HtmlPreviewer from '../components/lab/HtmlPreviewer.jsx'
import SvgEditor from '../components/lab/SvgEditor.jsx'
import ColorBlindSimulator from '../components/lab/ColorBlindSimulator.jsx'
import ApiExplorer from '../components/lab/ApiExplorer.jsx'
import TypingTest from '../components/lab/TypingTest.jsx'

/* ── Lab tool icons (inline SVG, inherit currentColor) ── */
const LabIcons = {
  // Image Studio — landscape photo
  image: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  // Password Generator — padlock
  password: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>,
  // JSON Formatter — curly braces
  json: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>,
  // Color Palette — artist palette
  color: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="8" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="13" r="1" fill="currentColor" stroke="none"/></svg>,
  // Hash Generator — # symbol
  hash: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
  // CSS Unit Converter — ruler with tick marks
  css: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v3M9 7v5M12 7v3M15 7v5M18 7v3"/></svg>,
  // QR Generator — QR code grid
  qr: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg>,
  // Speed Test — gauge/speedometer
  speed: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17A9 9 0 0 1 12 3a9 9 0 0 1 9 14"/><path d="m12 12 3.5-3.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>,
  // Word Counter — document with text lines
  words: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  // HTML Previewer — code brackets </>
  html: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  // SVG Editor — pen/vector tool
  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  // Color Blind Simulator — eye
  blind: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  // API Explorer — plug/connector
  api: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/></svg>,
  // Typing Test — keyboard
  typing: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>,
}

const TOOLS = [
  { id: 'image',    icon: LabIcons.image,    color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: ImageStudio },
  { id: 'password', icon: LabIcons.password, color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: PasswordGen },
  { id: 'json',     icon: LabIcons.json,     color: 'var(--neon-green)',  glow: 'rgba(57,255,20,0.12)',   component: JsonFormatter },
  { id: 'color',    icon: LabIcons.color,    color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: ColorPalette },
  { id: 'hash',     icon: LabIcons.hash,     color: 'var(--neon-green)',  glow: 'rgba(57,255,20,0.12)',   component: HashGenerator },
  { id: 'css',      icon: LabIcons.css,      color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: CssConverter },
  { id: 'qr',       icon: LabIcons.qr,       color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: QrGenerator },
  { id: 'speed',    icon: LabIcons.speed,    color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: SpeedTest },
  { id: 'words',    icon: LabIcons.words,    color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: WordCounter },
  { id: 'html',     icon: LabIcons.html,     color: '#f97316',            glow: 'rgba(249,115,22,0.12)',  component: HtmlPreviewer },
  { id: 'svg',      icon: LabIcons.svg,      color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: SvgEditor },
  { id: 'blind',    icon: LabIcons.blind,    color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: ColorBlindSimulator },
  { id: 'api',      icon: LabIcons.api,      color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: ApiExplorer },
  { id: 'typing',   icon: LabIcons.typing,   color: '#4ade80',            glow: 'rgba(74,222,128,0.13)',  component: TypingTest },
]

function ToolCard({ tool, t, onOpen }) {
  const [hovered, setHovered] = useState(false)

  const cardStyle = {
    background: hovered ? `linear-gradient(145deg, ${tool.glow}, var(--bg-card-opaque))` : 'var(--bg-card)',
    border: `1px solid ${hovered ? tool.color + '55' : 'var(--border)'}`,
    borderRadius: 16,
    padding: '1.75rem',
    cursor: tool.external ? 'alias' : 'pointer',
    transition: 'all 0.25s ease',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered ? `0 12px 40px ${tool.glow}` : 'none',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
    textDecoration: 'none', color: 'inherit',
  }

  const inner = (
    <>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: `linear-gradient(135deg, ${tool.glow}, var(--bg-card-icon))`,
        border: `1px solid ${tool.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tool.color, flexShrink: 0,
      }}>
        {tool.icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          {t('lab', `tool_${tool.id}_title`)}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {t('lab', `tool_${tool.id}_desc`)}
        </p>
      </div>
      <div style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem',
        color: tool.color, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600,
        paddingTop: '0.5rem',
      }}>
        {tool.external ? t('lab', 'tool_external') : t('lab', 'tool_open')} <span>{'→'}</span>
      </div>
    </>
  )

  if (tool.external) {
    return (
      <a href={tool.href} target="_blank" rel="noopener noreferrer" style={cardStyle}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {inner}
      </a>
    )
  }
  return (
    <div style={cardStyle} onClick={onOpen}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {inner}
    </div>
  )
}

export default function LabPage() {
  const { t } = useTranslation()
  const [activeTool, setActiveTool] = useState(null)
  const ignorePopRef = useRef(false)

  // When browser back button (or mouse back) is pressed, close the tool
  useEffect(() => {
    const onPopState = () => {
      if (ignorePopRef.current) { ignorePopRef.current = false; return }
      setActiveTool(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const openTool = (id) => {
    history.pushState({ labTool: id }, '')
    setActiveTool(id)
  }

  const closeTool = () => {
    ignorePopRef.current = true
    setActiveTool(null)
    history.back()
  }

  const active = TOOLS.find(tool => tool.id === activeTool)
  const ToolComponent = active?.component

  return (
    <main style={{ paddingTop: '68px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="orb" style={{ width: 450, height: 450, background: 'rgba(168,85,247,0.07)', top: '5%', right: '-8%', animationDuration: '10s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: 'rgba(0,240,255,0.05)', bottom: '10%', left: '-5%', animationDelay: '4s' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--section-pad)' }}>
        {!activeTool ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-label" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                {t('lab', 'label')}
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
                {t('lab', 'title_start')}<br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {t('lab', 'title_neon')}
                </span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 540, margin: '0 auto' }}>
                {t('lab', 'desc')}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {TOOLS.map(tool => (
                <ToolCard key={tool.id} tool={tool} t={t} onOpen={() => openTool(tool.id)} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={closeTool}
                style={{
                  background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '0.5rem 1rem', color: 'var(--text-secondary)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                &larr; {t('lab', 'back')}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, ${active.glow}, var(--bg-card-opaque))`,
                  border: `1px solid ${active.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active.color,
                }}>
                  {active.icon}
                </span>
                <div>
                  <h2 style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>{t('lab', `tool_${active.id}_title`)}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {t('lab', `tool_${active.id}_desc`)}
                  </p>
                </div>
              </div>
            </div>
            <div className="card lab-active-card" style={{ padding: '2rem' }}>
              <ToolComponent />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
