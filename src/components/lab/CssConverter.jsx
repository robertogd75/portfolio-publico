import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: { value: 'Valor', unit: 'Unidad', click: 'clic copiar', copied: '✓ copiado' },
  en: { value: 'Value', unit: 'Unit',   click: 'click copy',  copied: '✓ copied'  },
  de: { value: 'Wert',  unit: 'Einheit', click: 'klick kopieren', copied: '✓ kopiert' },
}

const UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh', 'pt']

function toPx(value, unit, base, context, vw, vh) {
  switch (unit) {
    case 'px':  return value
    case 'rem': return value * base
    case 'em':  return value * context
    case '%':   return (value / 100) * context
    case 'vw':  return (value / 100) * vw
    case 'vh':  return (value / 100) * vh
    case 'pt':  return value * (96 / 72)
    default:    return value
  }
}

function fromPx(px, unit, base, context, vw, vh) {
  switch (unit) {
    case 'px':  return px
    case 'rem': return px / base
    case 'em':  return px / context
    case '%':   return (px / context) * 100
    case 'vw':  return (px / vw) * 100
    case 'vh':  return (px / vh) * 100
    case 'pt':  return px * (72 / 96)
    default:    return px
  }
}

function fmt(n) {
  if (Math.abs(n) < 0.0001) return '0'
  const s = n.toFixed(4)
  return s.replace(/\.?0+$/, '')
}

export default function CssConverter() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [value, setValue] = useState('16')
  const [fromUnit, setFromUnit] = useState('px')
  const [base, setBase]       = useState(16)
  const [context, setContext] = useState(16)
  const [vw, setVw]           = useState(1440)
  const [vh, setVh]           = useState(900)
  const [copied, setCopied]   = useState(null)

  const numVal = parseFloat(value) || 0
  const px = toPx(numVal, fromUnit, base, context, vw, vh)

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '0.5rem 0.75rem',
    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem', outline: 'none', width: '100%',
  }

  const labelStyle = {
    display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)', marginBottom: '0.35rem',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 }}>

      {/* ── Input row ── */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 110 }}>
          <label style={{ ...labelStyle, color: 'var(--text-secondary)' }}>{ui.value}</label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 700 }}
          />
        </div>
        <div style={{ minWidth: 90 }}>
          <label style={{ ...labelStyle, color: 'var(--text-secondary)' }}>{ui.unit}</label>
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {UNITS.map(u => (
              <option key={u} value={u} style={{ background: '#1a1a2e' }}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Config ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '1rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem',
      }}>
        <div>
          <label style={labelStyle}>Base font (px)</label>
          <input type="number" value={base} onChange={e => setBase(Number(e.target.value) || 16)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Context size (px) — em / %</label>
          <input type="number" value={context} onChange={e => setContext(Number(e.target.value) || 16)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Viewport width (px) — vw</label>
          <input type="number" value={vw} onChange={e => setVw(Number(e.target.value) || 1440)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Viewport height (px) — vh</label>
          <input type="number" value={vh} onChange={e => setVh(Number(e.target.value) || 900)} style={inputStyle} />
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {UNITS.map(u => {
          const result = fmt(fromPx(px, u, base, context, vw, vh))
          const isSrc  = u === fromUnit
          return (
            <div
              key={u}
              onClick={() => copy(`${result}${u}`, u)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: copied === u ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  copied === u ? 'var(--neon-cyan)'
                  : isSrc ? 'rgba(168,85,247,0.4)'
                  : 'var(--border)'
                }`,
                borderRadius: 8, padding: '0.65rem 1rem',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem',
                color: isSrc ? 'var(--neon-purple)' : 'var(--text-secondary)', width: 38,
              }}>
                {u}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.95rem',
                color: 'var(--text-primary)', flex: 1, textAlign: 'right', marginRight: '1.25rem',
              }}>
                {result}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: copied === u ? 'var(--neon-cyan)' : 'var(--text-muted)',
                width: 58, textAlign: 'right', flexShrink: 0,
              }}>
                {copied === u ? ui.copied : ui.click}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
