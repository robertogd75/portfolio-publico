import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: {
    format: 'Formatear',
    minify: 'Minificar',
    copy: 'Copiar',
    copied: '✓ Copiado',
    download: 'Descargar .svg',
    bgLabel: 'Fondo:',
    bgWhite: 'Blanco',
    bgBlack: 'Negro',
    bgTrans: 'Trans',
    editorLabel: 'Editor SVG',
    previewLabel: 'Vista previa en vivo',
    chars: (n) => `${n.toLocaleString('es-ES')} caracteres`,
    placeholder: 'Pega o escribe tu código SVG aquí...',
  },
  en: {
    format: 'Format',
    minify: 'Minify',
    copy: 'Copy',
    copied: '✓ Copied',
    download: 'Download .svg',
    bgLabel: 'Background:',
    bgWhite: 'White',
    bgBlack: 'Black',
    bgTrans: 'Trans',
    editorLabel: 'SVG Editor',
    previewLabel: 'Live preview',
    chars: (n) => `${n.toLocaleString('en-US')} characters`,
    placeholder: 'Paste or write your SVG code here...',
  },
  de: {
    format: 'Formatieren',
    minify: 'Minifizieren',
    copy: 'Kopieren',
    copied: '✓ Kopiert',
    download: '.svg herunterladen',
    bgLabel: 'Hintergrund:',
    bgWhite: 'Weiß',
    bgBlack: 'Schwarz',
    bgTrans: 'Trans',
    editorLabel: 'SVG-Editor',
    previewLabel: 'Live-Vorschau',
    chars: (n) => `${n.toLocaleString('de-DE')} Zeichen`,
    placeholder: 'SVG-Code hier einfügen oder schreiben...',
  },
}

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="80" fill="url(#grad)" opacity="0.9" />
  <text x="100" y="115" text-anchor="middle"
    font-family="system-ui,sans-serif" font-size="28"
    font-weight="bold" fill="white">SVG</text>
</svg>`

// Strip script tags and event handler attributes to prevent XSS
const sanitizeSvg = (svg) =>
  svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '')

const formatXml = (xml) => {
  let result = ''
  let indent = 0
  const nodes = xml.replace(/>\s*</g, '>\n<').split('\n')
  for (const node of nodes) {
    const t = node.trim()
    if (!t) continue
    if (t.startsWith('</')) {
      indent = Math.max(0, indent - 1)
      result += '  '.repeat(indent) + t + '\n'
    } else if (t.endsWith('/>') || (t.includes('</') && !t.match(/^<[^>]+>$/))) {
      result += '  '.repeat(indent) + t + '\n'
    } else if (t.match(/^<[^?!][^>]*[^/]>$/)) {
      result += '  '.repeat(indent) + t + '\n'
      indent++
    } else {
      result += '  '.repeat(indent) + t + '\n'
    }
  }
  return result.trim()
}

const minifyXml = (xml) => xml.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()

const BG_OPTIONS = [
  { v: 'white',        bg: '#ffffff',                                                            label: 'Blanco' },
  { v: '#0a0a0f',      bg: '#0a0a0f',                                                            label: 'Negro' },
  { v: 'transparent',  bg: 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0/14px 14px',    label: 'Trans' },
]

export default function SvgEditor() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [code, setCode]       = useState(DEFAULT_SVG)
  const [copied, setCopied]   = useState(false)
  const [bg, setBg]           = useState('white')

  const sanitized = sanitizeSvg(code)
  const srcDoc = `<!DOCTYPE html><html><body style="margin:0;padding:1.5rem;background:${bg === 'transparent' ? 'transparent' : bg};display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 3rem)">${sanitized}</body></html>`

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([code], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'image.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: end, value } = e.target
      const next = value.substring(0, s) + '  ' + value.substring(end)
      setCode(next)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = s + 2
      })
    }
  }

  const taStyle = {
    width: '100%',
    height: 480,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.65,
    tabSize: 2,
    boxSizing: 'border-box',
  }

  const btn = (color = 'var(--neon-cyan)') => ({
    background: 'transparent',
    border: `1px solid ${color}55`,
    borderRadius: 8,
    padding: '0.45rem 1rem',
    color,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  })

  const labelStyle = {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <button style={btn()} onClick={() => setCode(formatXml(code))}>{ui.format}</button>
        <button style={btn()} onClick={() => setCode(minifyXml(code))}>{ui.minify}</button>
        <button style={btn('var(--neon-purple)')} onClick={copy}>
          {copied ? ui.copied : ui.copy}
        </button>
        <button style={btn('var(--neon-purple)')} onClick={download}>
          {ui.download}
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            {ui.bgLabel}
          </span>
          {BG_OPTIONS.map(({ v, bg: bgs }, bgi) => (
            <button
              key={v}
              title={[ui.bgWhite, ui.bgBlack, ui.bgTrans][bgi]}
              onClick={() => setBg(v)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                cursor: 'pointer',
                background: bgs,
                border: bg === v ? '2px solid var(--neon-cyan)' : '1px solid var(--border)',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Editor + Preview */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={labelStyle}>{ui.editorLabel}</div>
          <textarea
            style={taStyle}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder={ui.placeholder}
          />
          <div style={{ ...labelStyle, marginTop: '0.4rem', marginBottom: 0 }}>
            {ui.chars(code.length)}
          </div>
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={labelStyle}>{ui.previewLabel}</div>
          <iframe
            sandbox=""
            srcDoc={srcDoc}
            style={{
              width: '100%',
              height: 480,
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'block',
              background:
                bg === 'transparent'
                  ? 'repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 0/20px 20px'
                  : bg,
            }}
            title="SVG Preview"
          />
        </div>
      </div>
    </div>
  )
}
