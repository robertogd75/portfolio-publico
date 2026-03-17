import { useState, useRef } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: {
    pingLabel: 'Ping',
    dlLabel: 'Descarga',
    phasePing: 'Midiendo latencia...',
    phaseDownload: (pct) => `Descargando 10 MB... ${pct}%`,
    pingExcellent: 'Excelente',
    pingGood: 'Bueno',
    pingHigh: 'Alto',
    dlFast: 'Muy rápida',
    dlGood: 'Buena',
    dlSlow: 'Lenta',
    error: 'No se pudo conectar con el servidor de pruebas. Comprueba tu conexión a internet.',
    start: '▶ Iniciar test',
    repeat: '↺ Repetir test',
    cancel: '✕ Cancelar',
    note: 'Prueba de descarga vía Cloudflare Speed Test (speed.cloudflare.com). Los datos no salen de tu navegador.',
  },
  en: {
    pingLabel: 'Ping',
    dlLabel: 'Download',
    phasePing: 'Measuring latency...',
    phaseDownload: (pct) => `Downloading 10 MB... ${pct}%`,
    pingExcellent: 'Excellent',
    pingGood: 'Good',
    pingHigh: 'High',
    dlFast: 'Very fast',
    dlGood: 'Good',
    dlSlow: 'Slow',
    error: 'Could not connect to the test server. Check your internet connection.',
    start: '▶ Start test',
    repeat: '↺ Repeat test',
    cancel: '✕ Cancel',
    note: 'Download test via Cloudflare Speed Test (speed.cloudflare.com). Data never leaves your browser.',
  },
  de: {
    pingLabel: 'Ping',
    dlLabel: 'Download',
    phasePing: 'Latenz messen...',
    phaseDownload: (pct) => `Herunterladen 10 MB... ${pct}%`,
    pingExcellent: 'Ausgezeichnet',
    pingGood: 'Gut',
    pingHigh: 'Hoch',
    dlFast: 'Sehr schnell',
    dlGood: 'Gut',
    dlSlow: 'Langsam',
    error: 'Verbindung zum Testserver nicht möglich. Bitte Internetverbindung prüfen.',
    start: '▶ Test starten',
    repeat: '↺ Test wiederholen',
    cancel: '✕ Abbrechen',
    note: 'Download-Test über Cloudflare Speed Test (speed.cloudflare.com). Daten verlassen nie Ihren Browser.',
  },
}

// Downloads chunks from Cloudflare's public speed endpoint to measure throughput
const DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes='
const DOWNLOAD_BYTES = 10_000_000   // 10 MB
const PING_URL       = 'https://speed.cloudflare.com/__down?bytes=1'
const PING_ROUNDS    = 5

async function measurePing() {
  const times = []
  for (let i = 0; i < PING_ROUNDS; i++) {
    const t0 = performance.now()
    await fetch(`${PING_URL}&_=${Date.now() + i}`, { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  // median
  return Math.round(times[Math.floor(PING_ROUNDS / 2)])
}

async function measureDownload(onProgress) {
  const start = performance.now()
  const res = await fetch(`${DOWNLOAD_URL}${DOWNLOAD_BYTES}&_=${Date.now()}`, { cache: 'no-store' })
  const reader = res.body.getReader()
  let received = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.length
    onProgress(received / DOWNLOAD_BYTES)
  }
  const elapsed = (performance.now() - start) / 1000
  return (DOWNLOAD_BYTES * 8) / elapsed / 1_000_000   // Mbps
}

const fmt = n => (n == null ? '—' : n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : Math.round(n).toString())

const Gauge = ({ label, value, unit, color, sublabel }) => (
  <div style={{
    flex: '1 1 160px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '1.5rem 1.25rem', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
  }}>
    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontFamily: 'var(--font-mono)', fontWeight: 800, color, lineHeight: 1 }}>
      {fmt(value)}
    </div>
    <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{unit}</div>
    {sublabel && (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{sublabel}</div>
    )}
  </div>
)

const STATES = { idle: 'idle', running: 'running', done: 'done', error: 'error' }

export default function SpeedTest() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [state, setState]    = useState(STATES.idle)
  const [phase, setPhase]    = useState('')         // 'ping' | 'download'
  const [ping, setPing]      = useState(null)
  const [download, setDl]    = useState(null)
  const [dlPct, setDlPct]    = useState(0)
  const [errorMsg, setError] = useState('')
  const abortRef = useRef(false)

  const run = async () => {
    abortRef.current = false
    setState(STATES.running)
    setPhase('ping')
    setPing(null); setDl(null); setDlPct(0); setError('')

    try {
      const p = await measurePing()
      if (abortRef.current) return
      setPing(p)

      setPhase('download')
      const dl = await measureDownload(pct => {
        if (!abortRef.current) setDlPct(pct)
      })
      if (abortRef.current) return
      setDl(dl)

      setState(STATES.done)
    } catch (e) {
      if (!abortRef.current) {
        setError(ui.error)
        setState(STATES.error)
      }
    }
  }

  const reset = () => {
    abortRef.current = true
    setState(STATES.idle)
    setPing(null); setDl(null); setDlPct(0); setError('')
  }

  const isRunning = state === STATES.running

  const phaseLabel =
    phase === 'ping'     ? ui.phasePing :
    phase === 'download' ? ui.phaseDownload(Math.round(dlPct * 100)) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 680 }}>

      {/* ── Gauges ── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Gauge
          label={ui.pingLabel}
          value={ping}
          unit="ms"
          color={ping == null ? 'var(--text-muted)' : ping < 30 ? 'var(--neon-green)' : ping < 80 ? '#f59e0b' : 'var(--neon-pink)'}
          sublabel={ping != null ? (ping < 30 ? ui.pingExcellent : ping < 80 ? ui.pingGood : ui.pingHigh) : null}
        />
        <Gauge
          label={ui.dlLabel}
          value={download}
          unit="Mbps"
          color={download == null ? 'var(--text-muted)' : download >= 100 ? 'var(--neon-cyan)' : download >= 25 ? 'var(--neon-green)' : '#f59e0b'}
          sublabel={download != null ? (download >= 100 ? ui.dlFast : download >= 25 ? ui.dlGood : ui.dlSlow) : null}
        />
      </div>

      {/* ── Progress bar ── */}
      {isRunning && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.83rem' }}>
            {phaseLabel}
          </div>
          {phase === 'download' && (
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${Math.round(dlPct * 100)}%`,
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
                transition: 'width 0.3s',
              }} />
            </div>
          )}
        </div>
      )}

      {/* ── Error ── */}
      {state === STATES.error && (
        <div style={{
          background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)',
          borderRadius: 8, padding: '0.75rem 1rem',
          color: '#ff6b9d', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        }}>
          ✗ {errorMsg}
        </div>
      )}

      {/* ── CTA ── */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {!isRunning ? (
          <button
            onClick={run}
            style={{
              padding: '0.8rem 2rem', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000', fontWeight: 700, fontSize: '0.95rem',
              border: 'none', cursor: 'pointer',
            }}
          >
            {state === STATES.done ? ui.repeat : ui.start}
          </button>
        ) : (
          <button
            onClick={reset}
            style={{
              padding: '0.8rem 2rem', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {ui.cancel}
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
        {ui.note}
      </p>
    </div>
  )
}
