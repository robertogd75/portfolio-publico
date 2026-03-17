import { useState, useRef } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const TYPES_DESCS = {
  es: {
    normal:        'Visión estándar trichromática',
    protanopia:    'Sin conos L (rojo) · ~1% hombres',
    deuteranopia:  'Sin conos M (verde) · ~1% hombres',
    tritanopia:    'Sin conos S (azul) · ~0.003%',
    protanomaly:   'Conos L debilitados · ~1% hombres',
    deuteranomaly: 'Conos M debilitados · ~5% hombres (más común)',
    tritanomaly:   'Conos S debilitados · ~0.01%',
    achromato:     'Sin percepción del color (escala de grises)',
  },
  en: {
    normal:        'Standard trichromatic vision',
    protanopia:    'Missing L cones (red) · ~1% of men',
    deuteranopia:  'Missing M cones (green) · ~1% of men',
    tritanopia:    'Missing S cones (blue) · ~0.003%',
    protanomaly:   'Weakened L cones · ~1% of men',
    deuteranomaly: 'Weakened M cones · ~5% of men (most common)',
    tritanomaly:   'Weakened S cones · ~0.01%',
    achromato:     'No color perception (grayscale)',
  },
  de: {
    normal:        'Normales trichromatisches Sehen',
    protanopia:    'Fehlende L-Zapfen (rot) · ~1% der Männer',
    deuteranopia:  'Fehlende M-Zapfen (grün) · ~1% der Männer',
    tritanopia:    'Fehlende S-Zapfen (blau) · ~0.003%',
    protanomaly:   'Geschwächte L-Zapfen · ~1% der Männer',
    deuteranomaly: 'Geschwächte M-Zapfen · ~5% der Männer (häufigste Form)',
    tritanomaly:   'Geschwächte S-Zapfen · ~0.01%',
    achromato:     'Keine Farbwahrnehmung (Graustufen)',
  },
}

const UI = {
  es: {
    dropMain: 'Arrastra una imagen o haz clic para subir',
    dropSub:  'PNG · JPG · WebP — se procesa 100% en tu navegador, nunca sale de tu dispositivo',
    changeImage:   '← Cambiar imagen',
    processing:    'Procesando 8 simulaciones...',
    clickToExpand: 'Haz clic en una tarjeta para ampliar',
    processingCard: 'Procesando...',
    expandedView:  'Vista ampliada',
  },
  en: {
    dropMain: 'Drag an image or click to upload',
    dropSub:  'PNG · JPG · WebP — processed 100% in your browser, never leaves your device',
    changeImage:   '← Change image',
    processing:    'Processing 8 simulations...',
    clickToExpand: 'Click a card to expand',
    processingCard: 'Processing...',
    expandedView:  'Expanded view',
  },
  de: {
    dropMain: 'Bild hierher ziehen oder klicken zum Hochladen',
    dropSub:  'PNG · JPG · WebP — wird 100% in Ihrem Browser verarbeitet, verlässt nie Ihr Gerät',
    changeImage:   '← Bild ändern',
    processing:    '8 Simulationen werden verarbeitet...',
    clickToExpand: 'Karte anklicken zum Vergrößern',
    processingCard: 'Wird verarbeitet...',
    expandedView:  'Vergrößerte Ansicht',
  },
}

// ── Dalton/Viénot matrices (operate on gamma-decoded linear sRGB) ──────────
const blend = (mat, t) =>
  mat.map((row, i) => row.map((v, j) => v * t + (i === j ? 1 : 0) * (1 - t)))

const PROTO_MAT  = [[0.56667, 0.43333, 0], [0.55833, 0.44167, 0], [0, 0.24167, 0.75833]]
const DEUTER_MAT = [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]]
const TRIT_MAT   = [[0.95, 0.05, 0], [0, 0.43333, 0.56667], [0, 0.475, 0.525]]
const GREY_MAT   = [[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]]

const TYPES = [
  { id: 'normal',        mat: null,               label: 'Normal',         desc: 'Visión estándar trichromática',               color: 'var(--text-primary)' },
  { id: 'protanopia',    mat: PROTO_MAT,          label: 'Protanopia',     desc: 'Sin conos L (rojo) · ~1% hombres',            color: '#ef4444' },
  { id: 'deuteranopia',  mat: DEUTER_MAT,         label: 'Deuteranopia',   desc: 'Sin conos M (verde) · ~1% hombres',           color: '#22c55e' },
  { id: 'tritanopia',    mat: TRIT_MAT,           label: 'Tritanopia',     desc: 'Sin conos S (azul) · ~0.003%',                color: '#3b82f6' },
  { id: 'protanomaly',   mat: blend(PROTO_MAT,  0.5), label: 'Protanomalía',   desc: 'Conos L debilitados · ~1% hombres',       color: '#f97316' },
  { id: 'deuteranomaly', mat: blend(DEUTER_MAT, 0.5), label: 'Deuteranomalía', desc: 'Conos M debilitados · ~5% hombres (más común)', color: '#84cc16' },
  { id: 'tritanomaly',   mat: blend(TRIT_MAT,   0.5), label: 'Tritanomalía',   desc: 'Conos S debilitados · ~0.01%',            color: '#818cf8' },
  { id: 'achromato',     mat: GREY_MAT,          label: 'Acromatopsia',   desc: 'Sin percepción del color (escala de grises)', color: '#94a3b8' },
]

// ── sRGB gamma encode/decode ──────────────────────────────────────────────
const linRGB = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
const sRGB   = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)

function applyMat(r8, g8, b8, mat) {
  const r = linRGB(r8 / 255)
  const g = linRGB(g8 / 255)
  const b = linRGB(b8 / 255)
  return [
    Math.round(Math.min(1, Math.max(0, sRGB(mat[0][0] * r + mat[0][1] * g + mat[0][2] * b))) * 255),
    Math.round(Math.min(1, Math.max(0, sRGB(mat[1][0] * r + mat[1][1] * g + mat[1][2] * b))) * 255),
    Math.round(Math.min(1, Math.max(0, sRGB(mat[2][0] * r + mat[2][1] * g + mat[2][2] * b))) * 255),
  ]
}

function buildSimulation(origData, mat) {
  const { data, width, height } = origData
  const out = new Uint8ClampedArray(data)
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = applyMat(data[i], data[i + 1], data[i + 2], mat)
    out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = data[i + 3]
  }
  return new ImageData(out, width, height)
}

export default function ColorBlindSimulator() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const descs = TYPES_DESCS[lang] ?? TYPES_DESCS.en
  const [imageSrc, setImageSrc]   = useState(null)
  const [results, setResults]     = useState({})
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selected, setSelected]   = useState(null)
  const inputRef = useRef(null)

  const runAll = (src) => {
    setProcessing(true)
    const img = new Image()
    img.onload = () => {
      const MAX = 500
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const W = Math.round(img.width * scale)
      const H = Math.round(img.height * scale)

      const tmp = document.createElement('canvas')
      tmp.width = W; tmp.height = H
      const ctx = tmp.getContext('2d')
      ctx.drawImage(img, 0, 0, W, H)
      const orig = ctx.getImageData(0, 0, W, H)

      const res = {}
      for (const t of TYPES) {
        const c = document.createElement('canvas')
        c.width = W; c.height = H
        const cx = c.getContext('2d')
        if (!t.mat) {
          cx.putImageData(orig, 0, 0)
        } else {
          cx.putImageData(buildSimulation(orig, t.mat), 0, 0)
        }
        res[t.id] = c.toDataURL('image/jpeg', 0.92)
      }

      setResults(res)
      setProcessing(false)
    }
    img.src = src
  }

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageSrc(e.target.result)
      setSelected(null)
      runAll(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // ── Drop zone ─────────────────────────────────────────────────────────
  if (!imageSrc) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          style={{
            border: `2px dashed ${isDragging ? 'var(--neon-cyan)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '3rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: isDragging ? 'rgba(0,240,255,0.05)' : 'rgba(255,255,255,0.02)',
          }}
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); setIsDragging(false); loadFile(e.dataTransfer.files[0]) }}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼️</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
            {ui.dropMain}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {ui.dropSub}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => loadFile(e.target.files[0])}
          />
        </div>

        {/* Types info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
          {TYPES.slice(1).map(t => (
            <div key={t.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '0.75rem 1rem',
            }}>
              <div style={{ fontWeight: 700, color: t.color, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                {t.label}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {descs[t.id]}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Results grid ──────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setImageSrc(null); setResults({}); setSelected(null) }}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '0.45rem 1rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
          }}
        >
          {ui.changeImage}
        </button>
        {processing && (
          <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            {ui.processing}
          </span>
        )}
        {!processing && Object.keys(results).length > 0 && (
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            {ui.clickToExpand}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {TYPES.map(type => (
          <div
            key={type.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected === type.id ? type.color : 'var(--border)'}`,
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
              transform: selected === type.id ? 'scale(1.01)' : 'scale(1)',
            }}
            onClick={() => setSelected(selected === type.id ? null : type.id)}
          >
            {results[type.id] ? (
              <img
                src={results[type.id]}
                alt={type.label}
                style={{ width: '100%', display: 'block', aspectRatio: 'auto' }}
              />
            ) : (
              <div style={{
                height: 160,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              }}>
                {processing ? ui.processingCard : '—'}
              </div>
            )}
            <div style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontWeight: 700, color: type.color, fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                {type.label}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                {descs[type.id]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded view */}
      {selected && results[selected] && (() => {
        const t = TYPES.find(x => x.id === selected)
        return (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${t.color}55`,
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, color: t.color, fontFamily: 'var(--font-mono)' }}>
                {t.label} — {ui.expandedView}
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >×</button>
            </div>
            <img
              src={results[selected]}
              alt={selected}
              style={{ width: '100%', display: 'block', maxHeight: 520, objectFit: 'contain', background: '#000' }}
            />
          </div>
        )
      })()}
    </div>
  )
}
