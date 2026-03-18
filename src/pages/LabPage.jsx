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

const TOOLS = [
  { id: 'image',    icon: 'IMG', color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: ImageStudio },
  { id: 'password', icon: 'PWD', color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: PasswordGen },
  { id: 'json',     icon: '{ }', color: 'var(--neon-green)',  glow: 'rgba(57,255,20,0.12)',   component: JsonFormatter },
  { id: 'color',    icon: 'CLR', color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: ColorPalette },
  { id: 'hash',     icon: 'SHA', color: 'var(--neon-green)',  glow: 'rgba(57,255,20,0.12)',   component: HashGenerator },
  { id: 'css',      icon: 'CSS', color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: CssConverter },
  { id: 'qr',       icon: 'QR',  color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: QrGenerator },
  { id: 'speed',    icon: '↑↓',  color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: SpeedTest },
  { id: 'words',    icon: 'TXT', color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: WordCounter },
  { id: 'html',     icon: 'HTML', color: '#f97316',            glow: 'rgba(249,115,22,0.12)',  component: HtmlPreviewer },
  { id: 'svg',      icon: 'SVG',  color: '#f59e0b',            glow: 'rgba(245,158,11,0.12)',  component: SvgEditor },
  { id: 'blind',    icon: 'A11Y', color: 'var(--neon-purple)', glow: 'rgba(168,85,247,0.15)',  component: ColorBlindSimulator },
  { id: 'api',      icon: 'API',  color: 'var(--neon-cyan)',   glow: 'rgba(0,240,255,0.15)',   component: ApiExplorer },
  { id: 'typing',   icon: 'WPM',  color: '#4ade80',            glow: 'rgba(74,222,128,0.13)',  component: TypingTest },
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
        fontSize: '0.95rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
        color: tool.color, flexShrink: 0,
        letterSpacing: '0.02em',
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
                  fontSize: '0.95rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: active.color,
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
            <div className="card" style={{ padding: '2rem' }}>
              <ToolComponent />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
