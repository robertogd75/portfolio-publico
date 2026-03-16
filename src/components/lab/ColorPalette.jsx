import { useState } from 'react'

// ── Color math helpers ────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function isValidHex(hex) {
  return /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(hex.trim())
}

function normalizeHex(hex) {
  const h = hex.trim().startsWith('#') ? hex.trim() : '#' + hex.trim()
  if (h.length === 4) return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  return h
}

// ── Component ─────────────────────────────────────────────────────
export default function ColorPalette() {
  const [inputColor, setInputColor] = useState('#a855f7')
  const [copied, setCopied] = useState(null)

  const validHex = isValidHex(inputColor) ? normalizeHex(inputColor) : null
  const hsl = validHex ? rgbToHsl(...hexToRgb(validHex)) : null

  const shades = hsl
    ? Array.from({ length: 10 }, (_, i) => ({
        label: String((i + 1) * 100),
        hex: hslToHex(hsl[0], hsl[1], 95 - i * 9),
      }))
    : []

  const harmony = hsl
    ? [
        { label: 'Complementario', hex: hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]) },
        { label: 'Análogo −30°',   hex: hslToHex((hsl[0] + 330) % 360, hsl[1], hsl[2]) },
        { label: 'Análogo +30°',   hex: hslToHex((hsl[0] + 30)  % 360, hsl[1], hsl[2]) },
        { label: 'Triádico −120°', hex: hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]) },
        { label: 'Triádico +120°', hex: hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]) },
      ]
    : []

  const cssBlock = validHex
    ? `:root {\n${shades.map(s => `  --color-${s.label}: ${s.hex};`).join('\n')}\n}`
    : ''

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const labelStyle = {
    display: 'block', color: 'var(--text-secondary)', fontSize: '0.78rem',
    fontFamily: 'var(--font-mono)', marginBottom: '0.6rem',
    letterSpacing: '0.08em', textTransform: 'uppercase',
  }

  const taStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '1rem', color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)', fontSize: '0.82rem', outline: 'none',
    resize: 'vertical', minHeight: 130, lineHeight: 1.6,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 760 }}>

      {/* ── Input row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="color"
          value={validHex || '#a855f7'}
          onChange={e => setInputColor(e.target.value)}
          style={{
            width: 56, height: 56, borderRadius: 12, border: '1px solid var(--border)',
            cursor: 'pointer', padding: 4, background: 'rgba(255,255,255,0.04)',
          }}
        />
        <input
          type="text"
          value={inputColor}
          onChange={e => setInputColor(e.target.value)}
          placeholder="#a855f7"
          maxLength={7}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${validHex ? 'var(--border)' : 'rgba(255,45,120,0.5)'}`,
            borderRadius: 10, padding: '0.6rem 1rem',
            color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
            fontSize: '1rem', outline: 'none', width: 140, fontWeight: 700,
          }}
        />
        {validHex && hsl && (
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            HSL({hsl[0]}°,&nbsp;{hsl[1]}%,&nbsp;{hsl[2]}%)
          </span>
        )}
      </div>

      {validHex && (
        <>
          {/* ── Shades ── */}
          <div>
            <div style={labelStyle}>Shades</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '0.4rem' }}>
              {shades.map(s => (
                <div
                  key={s.label}
                  title={`${s.label}: ${s.hex}`}
                  onClick={() => copy(s.hex, s.label)}
                  style={{
                    height: 52, borderRadius: 8, background: s.hex, cursor: 'pointer',
                    border: copied === s.label ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                    transition: 'border 0.15s',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '0.4rem', marginTop: '0.3rem' }}>
              {shades.map(s => (
                <div key={s.label} style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Harmony ── */}
          <div>
            <div style={labelStyle}>Armonía de Color</div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              {harmony.map(hc => (
                <div
                  key={hc.label}
                  onClick={() => copy(hc.hex, hc.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${copied === hc.label ? 'var(--neon-cyan)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '0.5rem 0.85rem', cursor: 'pointer', transition: 'border 0.15s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, background: hc.hex, flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>{hc.hex}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{hc.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CSS Variables ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={labelStyle}>Variables CSS</div>
              <button
                onClick={() => copy(cssBlock, 'css')}
                style={{
                  background: copied === 'css' ? 'rgba(57,255,20,0.15)' : 'transparent',
                  border: `1px solid ${copied === 'css' ? 'var(--neon-green)' : 'var(--border)'}`,
                  borderRadius: 6, padding: '0.3rem 0.75rem',
                  color: copied === 'css' ? 'var(--neon-green)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', transition: 'all 0.2s',
                }}
              >
                {copied === 'css' ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea readOnly value={cssBlock} style={taStyle} />
          </div>
        </>
      )}
    </div>
  )
}
