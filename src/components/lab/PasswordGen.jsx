import { useState, useCallback } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: {
    strength: 'Seguridad:',
    length: 'Longitud',
    copy: 'Copiar',
    copied: '✓ Copiado',
    generate: '↻ Generar nueva',
    upper: 'Mayúsculas (A-Z)',
    lower: 'Minúsculas (a-z)',
    numbers: 'Números (0-9)',
    symbols: 'Símbolos (!@#...)',
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte',
    veryStrong: 'Muy fuerte',
  },
  en: {
    strength: 'Strength:',
    length: 'Length',
    copy: 'Copy',
    copied: '✓ Copied',
    generate: '↻ Generate new',
    upper: 'Uppercase (A-Z)',
    lower: 'Lowercase (a-z)',
    numbers: 'Numbers (0-9)',
    symbols: 'Symbols (!@#...)',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    veryStrong: 'Very strong',
  },
  de: {
    strength: 'Stärke:',
    length: 'Länge',
    copy: 'Kopieren',
    copied: '✓ Kopiert',
    generate: '↻ Neu generieren',
    upper: 'Großbuchstaben (A-Z)',
    lower: 'Kleinbuchstaben (a-z)',
    numbers: 'Zahlen (0-9)',
    symbols: 'Symbole (!@#...)',
    weak: 'Schwach',
    medium: 'Mittel',
    strong: 'Stark',
    veryStrong: 'Sehr stark',
  },
}

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generate(length, opts) {
  let pool = ''
  if (opts.upper) pool += CHARS.upper
  if (opts.lower) pool += CHARS.lower
  if (opts.numbers) pool += CHARS.numbers
  if (opts.symbols) pool += CHARS.symbols
  if (!pool) pool = CHARS.lower
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, n => pool[n % pool.length]).join('')
}

const defaultOpts = { upper: true, lower: true, numbers: true, symbols: true }

export default function PasswordGen() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [length, setLength] = useState(20)
  const [opts, setOpts] = useState(defaultOpts)
  const [password, setPassword] = useState(() => generate(20, defaultOpts))
  const [copied, setCopied] = useState(false)

  const regen = useCallback(() => {
    setPassword(generate(length, opts))
    setCopied(false)
  }, [length, opts])

  const copy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charCount = (opts.upper ? 26 : 0) + (opts.lower ? 26 : 0) + (opts.numbers ? 10 : 0) + (opts.symbols ? 28 : 0) || 1
  const bits = length * Math.log2(charCount)
  const strength =
    bits < 40 ? { label: ui.weak,      color: 'var(--neon-pink)', pct: '20%' } :
    bits < 70 ? { label: ui.medium,    color: '#f59e0b', pct: '45%' } :
    bits < 100 ? { label: ui.strong,   color: 'var(--neon-green)', pct: '72%' } :
    { label: ui.veryStrong, color: 'var(--neon-cyan)', pct: '100%' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 620 }}>
      {/* Password display */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12,
        padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          color: 'var(--neon-cyan)', flex: 1, wordBreak: 'break-all', letterSpacing: '0.03em',
        }}>
          {password}
        </span>
        <button onClick={copy} style={{
          background: copied ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${copied ? 'var(--neon-green)' : 'var(--border)'}`,
          borderRadius: 8, padding: '0.5rem 1rem',
          color: copied ? 'var(--neon-green)' : 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
          flexShrink: 0, transition: 'all 0.2s',
        }}>
          {copied ? ui.copied : ui.copy}
        </button>
      </div>

      {/* Strength bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{ui.strength}</span>
        <span style={{ color: strength.color, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, flexShrink: 0 }}>{strength.label}</span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: strength.pct, background: strength.color, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
        </div>
      </div>

      {/* Length slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{ui.length}</label>
          <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{length}</span>
        </div>
        <input type="range" min={6} max={64} value={length}
          onChange={e => setLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--neon-cyan)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>6</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>64</span>
        </div>
      </div>

      {/* Options checkboxes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { key: 'upper',   label: ui.upper   },
          { key: 'lower',   label: ui.lower   },
          { key: 'numbers', label: ui.numbers },
          { key: 'symbols', label: ui.symbols },
        ].map(({ key, label }) => (
          <label key={key} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
            padding: '0.6rem 0.75rem', borderRadius: 8,
            border: `1px solid ${opts[key] ? 'rgba(0,240,255,0.35)' : 'var(--border)'}`,
            background: opts[key] ? 'rgba(0,240,255,0.05)' : 'transparent',
            transition: 'all 0.2s',
          }}>
            <input type="checkbox" checked={opts[key]}
              onChange={e => setOpts(o => ({ ...o, [key]: e.target.checked }))}
              style={{ accentColor: 'var(--neon-cyan)' }} />
            <span style={{ color: opts[key] ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Generate button */}
      <button onClick={regen} style={{
        padding: '0.85rem 2rem', borderRadius: 10,
        background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
        color: '#000', fontWeight: 700, fontSize: '1rem',
        border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        {ui.generate}
      </button>
    </div>
  )
}
