import { useState, useRef } from 'react'

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #1a1a2e;
      color: #e2e8f0;
      padding: 2rem;
      margin: 0;
    }
    h1 { color: #00f0ff; }
    p  { line-height: 1.7; color: #94a3b8; }
    .box {
      background: rgba(168,85,247,0.15);
      border: 1px solid rgba(168,85,247,0.4);
      border-radius: 10px;
      padding: 1rem;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <h1>¡Hola, Mundo!</h1>
  <p>Esto es un previsualizador de HTML.<br/>
     Edita el código en la izquierda y
     el resultado aparece aquí en tiempo real.</p>
  <div class="box">
    <strong>Tip:</strong> puedes usar HTML, CSS e incluso JS inline.
  </div>
</body>
</html>`

export default function HtmlPreviewer() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const editorStyle = {
    flex: '1 1 300px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.65,
    minHeight: 480,
    tabSize: 2,
  }

  const labelStyle = {
    color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: '0.4rem',
  }

  const handleKeyDown = e => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: end, value } = e.target
      const next = value.substring(0, s) + '  ' + value.substring(end)
      setHtml(next)
      // Restore cursor after React re-render
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = s + 2
      })
    }
  }

  const taRef = useRef(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>

        {/* ── Editor ── */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Editor HTML</div>
            <button
              onClick={copy}
              style={{
                background: copied ? 'rgba(57,255,20,0.15)' : 'transparent',
                border: `1px solid ${copied ? 'var(--neon-green)' : 'var(--border)'}`,
                borderRadius: 6, padding: '0.25rem 0.7rem',
                color: copied ? 'var(--neon-green)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem', transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
          <textarea
            ref={taRef}
            value={html}
            onChange={e => setHtml(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            style={editorStyle}
          />
        </div>

        {/* ── Preview ── */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={labelStyle}>Preview</div>
          <iframe
            title="html-preview"
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            style={{
              flex: 1, border: '1px solid var(--border)', borderRadius: 10,
              minHeight: 480, background: '#fff',
            }}
          />
        </div>

      </div>
    </div>
  )
}
