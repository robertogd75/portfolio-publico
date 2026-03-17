import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: {
    label: 'Texto de entrada',
    placeholder: 'Escribe o pega el texto a hashear... (Ctrl+Enter para calcular)',
    computing: 'Calculando...',
    generate: '→ Generar Hashes',
    copy: 'Copiar',
  },
  en: {
    label: 'Input text',
    placeholder: 'Type or paste text to hash... (Ctrl+Enter to calculate)',
    computing: 'Computing...',
    generate: '→ Generate Hashes',
    copy: 'Copy',
  },
  de: {
    label: 'Eingabetext',
    placeholder: 'Text zum Hashen eingeben oder einfügen... (Strg+Enter berechnen)',
    computing: 'Berechne...',
    generate: '→ Hashes generieren',
    copy: 'Kopieren',
  },
}

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

async function hashText(text, algo) {
  const data = new TextEncoder().encode(text)
  const buffer = await window.crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function HashGenerator() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)

  const compute = async () => {
    if (!input.trim()) return
    setLoading(true)
    const results = {}
    for (const algo of ALGORITHMS) {
      results[algo] = await hashText(input, algo)
    }
    setHashes(results)
    setLoading(false)
  }

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 760 }}>

      {/* ── Input ── */}
      <div>
        <label style={{
          display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)', marginBottom: '0.5rem',
        }}>
          {ui.label}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') compute() }}
          placeholder={ui.placeholder}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '1rem', color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: '0.85rem', outline: 'none',
            resize: 'vertical', minHeight: 110, lineHeight: 1.6,
          }}
        />
      </div>

      <button
        onClick={compute}
        disabled={!input.trim() || loading}
        style={{
          padding: '0.75rem 1.75rem', borderRadius: 10,
          background: input.trim() && !loading
            ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'
            : 'rgba(255,255,255,0.06)',
          color: input.trim() && !loading ? '#000' : 'var(--text-muted)',
          fontWeight: 700, fontSize: '0.95rem', border: 'none',
          cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          alignSelf: 'flex-start', transition: 'all 0.2s',
        }}
      >
        {loading ? ui.computing : ui.generate}
      </button>

      {/* ── Results ── */}
      {Object.keys(hashes).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {ALGORITHMS.map(algo => (
            <div
              key={algo}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  color: 'var(--neon-cyan)', fontWeight: 700, letterSpacing: '0.05em',
                }}>
                  {algo}
                </span>
                <button
                  onClick={() => copy(hashes[algo], algo)}
                  style={{
                    background: copied === algo ? 'rgba(57,255,20,0.15)' : 'transparent',
                    border: `1px solid ${copied === algo ? 'var(--neon-green)' : 'var(--border)'}`,
                    borderRadius: 6, padding: '0.25rem 0.65rem',
                    color: copied === algo ? 'var(--neon-green)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', transition: 'all 0.2s',
                  }}
                >
                  {copied === algo ? '✓' : ui.copy}
                </button>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.7,
              }}>
                {hashes[algo]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
