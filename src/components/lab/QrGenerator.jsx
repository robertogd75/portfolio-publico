import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

const SIZES = [128, 256, 512]
const COLORS = [
  { fg: '#00f0ff', bg: '#0a0a0f', label: 'Cyan' },
  { fg: '#a855f7', bg: '#0a0a0f', label: 'Purple' },
  { fg: '#39ff14', bg: '#0a0a0f', label: 'Green' },
  { fg: '#ffffff', bg: '#000000', label: 'B&W' },
  { fg: '#000000', bg: '#ffffff', label: 'Clásico' },
]

export default function QrGenerator() {
  const [text, setText]         = useState('https://rgardel.es')
  const [size, setSize]         = useState(256)
  const [colorIdx, setColorIdx] = useState(0)
  const [dataUrl, setDataUrl]   = useState(null)
  const [error, setError]       = useState(null)
  const color = COLORS[colorIdx]

  useEffect(() => {
    if (!text.trim()) { setDataUrl(null); setError(null); return }
    QRCode.toDataURL(text.trim(), {
      width: size,
      margin: 2,
      color: { dark: color.fg, light: color.bg },
      errorCorrectionLevel: 'M',
    })
      .then(url => { setDataUrl(url); setError(null) })
      .catch(() => setError('No se pudo generar el QR.'))
  }, [text, size, colorIdx])

  const download = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'qr-code.png'
    a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 }}>

      {/* Input */}
      <div>
        <label style={{
          display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)', marginBottom: '0.5rem',
        }}>
          Texto o URL
        </label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://tudominio.com o cualquier texto..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '0.75rem 1rem', color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Size */}
        <div>
          <div style={{
            color: 'var(--text-muted)', fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)', marginBottom: '0.5rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Tamaño
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                padding: '0.4rem 0.9rem', borderRadius: 8,
                border: `1px solid ${size === s ? 'var(--neon-cyan)' : 'var(--border)'}`,
                background: size === s ? 'rgba(0,240,255,0.1)' : 'transparent',
                color: size === s ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
              }}>
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <div style={{
            color: 'var(--text-muted)', fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)', marginBottom: '0.5rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Color
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setColorIdx(i)}
                title={c.label}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: c.bg,
                  border: `2px solid ${colorIdx === i ? c.fg : 'var(--border)'}`,
                  cursor: 'pointer', position: 'relative', transition: 'border 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 2, background: c.fg }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QR Preview */}
      {error && (
        <div style={{
          background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)',
          borderRadius: 8, padding: '0.75rem 1rem',
          color: 'var(--neon-pink)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        }}>✗ {error}</div>
      )}

      {dataUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            background: color.bg, border: '1px solid var(--border)',
            borderRadius: 12, padding: '1rem', display: 'inline-block',
          }}>
            <img src={dataUrl} alt="QR Code" style={{ display: 'block', borderRadius: 6 }} width={size} height={size} />
          </div>
          <button
            onClick={download}
            style={{
              padding: '0.7rem 1.75rem', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000', fontWeight: 700, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer',
            }}
          >
            ↓ Descargar PNG
          </button>
        </div>
      )}
    </div>
  )
}
