import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from '../i18n/I18nContext'

export default function Performance() {
  const [copied, setCopied] = useState(false)
  const { t, lang } = useTranslation()

  // Dynamic uptime state
  const [uptimeData, setUptimeData] = useState({ days: 0, hours: 0, mins: 0 })

  useEffect(() => {
    const calculateUptime = () => {
      const startDate = new Date('2026-03-09T10:00:00')
      const now = new Date()
      const diffMs = now - startDate
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      setUptimeData({ days, hours, mins })
    }

    calculateUptime() // Initial call
    const timer = setInterval(calculateUptime, 60000) // Update every minute
    
    return () => clearInterval(timer)
  }, [])

  const terminalLines = useMemo(() => [
    { prefix: '$', text: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Networks}}"', color: 'var(--neon-cyan)' },
    { prefix: '', text: 'NAMES              STATUS          NETWORKS', color: 'var(--text-muted)' },
    { prefix: '', text: `portfolio-publico  Up ${uptimeData.days} days      portfolio_network`, color: 'var(--neon-green)' },
    { prefix: '', text: `portainer          Up ${uptimeData.days} days      management`, color: 'var(--neon-green)' },
    { prefix: '', text: `nginx-proxy        Up ${uptimeData.days} days      web_proxy`, color: 'var(--neon-green)' },
    { prefix: '$', text: 'uptime -p', color: 'var(--neon-cyan)' },
    { prefix: '', text: `up ${uptimeData.days} days, ${uptimeData.hours} hours, ${uptimeData.mins} minutes`, color: 'var(--text-secondary)' },
  ], [uptimeData])

  const metrics = useMemo(() => [
    {
      icon: '🟢',
      label: t('performance', 'metric1_label'),
      value: '99.9%',
      sub: t('performance', 'metric1_sub'),
      color: 'var(--neon-green)',
    },
    {
      icon: '🐳',
      label: t('performance', 'metric2_label'),
      value: '8+',
      sub: t('performance', 'metric2_sub'),
      color: '#2496ED',
    },
    {
      icon: '🚀',
      label: t('performance', 'metric3_label'),
      value: 'Docker',
      sub: t('performance', 'metric3_sub'),
      color: 'var(--neon-cyan)',
    },
    {
      icon: '🔒',
      label: t('performance', 'metric4_label'),
      value: 'Proxy',
      sub: t('performance', 'metric4_sub'),
      color: 'var(--neon-purple)',
    },
  ], [t])

  return (
    <section id="performance" style={{
      padding: 'var(--section-pad)',
      background: 'var(--bg-secondary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div className="orb" style={{
        width: 600, height: 400,
        background: 'rgba(36,150,237,0.05)',
        right: '-15%', top: '20%',
        animationDuration: '12s',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>{t('performance', 'label')}</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>
          {t('performance', 'title_start')}<br />
          <span className="neon-text">{t('performance', 'title_neon')}</span>
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: 540,
          fontSize: '1rem',
          marginBottom: '3rem',
          lineHeight: 1.7,
        }}>
          {t('performance', 'desc')}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Terminal block */}
          <div style={{
            background: 'var(--bg-terminal)',
            border: '1px solid rgba(0,240,255,0.15)',
            borderRadius: 14,
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 40px rgba(0,240,255,0.06)',
          }}>
            {/* Title bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-input)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }} />
                ))}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                roberto@rgardel.es ~ docker-compose
              </span>
            </div>
            {/* Lines */}
            <div style={{ padding: '1.25rem' }}>
              {terminalLines.map((l, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '0.6rem',
                  fontSize: '0.78rem',
                  lineHeight: 1.8,
                }}>
                  {l.prefix && (
                    <span style={{ color: 'var(--neon-purple)', userSelect: 'none' }}>{l.prefix}</span>
                  )}
                  <span style={{ color: l.color }}>{l.text}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--neon-purple)' }}>$</span>
                <span style={{
                  display: 'inline-block',
                  width: 8, height: '1em',
                  background: 'var(--neon-cyan)',
                  animation: 'blink 0.9s step-end infinite',
                  verticalAlign: 'middle',
                }} />
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {metrics.map(m => (
              <div key={m.label} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: m.color,
                  marginBottom: '0.2rem',
                }}>{m.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.15rem' }}>{m.label}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
