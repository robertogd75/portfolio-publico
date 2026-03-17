import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const UI = {
  es: {
    encodeBtn: 'Texto → Base64',
    decodeBtn: 'Base64 → Texto',
    encodeLabel: 'Texto a codificar',
    decodeLabel: 'Base64 a decodificar',
    encodePlaceholder: 'Escribe o pega texto aquí...',
    decodePlaceholder: 'Pega tu cadena Base64 aquí...',
    encodeAction: '→ Codificar',
    decodeAction: '→ Decodificar',
    result: 'Resultado',
    copy: 'Copiar',
    copied: '✓ Copiado',
    errorDecode: 'Entrada Base64 inválida. Verifica que sea un string Base64 correcto.',
    errorEncode: 'Error al codificar.',
  },
  en: {
    encodeBtn: 'Text → Base64',
    decodeBtn: 'Base64 → Text',
    encodeLabel: 'Text to encode',
    decodeLabel: 'Base64 to decode',
    encodePlaceholder: 'Type or paste text here...',
    decodePlaceholder: 'Paste your Base64 string here...',
    encodeAction: '→ Encode',
    decodeAction: '→ Decode',
    result: 'Result',
    copy: 'Copy',
    copied: '✓ Copied',
    errorDecode: 'Invalid Base64 input. Make sure it is a valid Base64 string.',
    errorEncode: 'Encoding error.',
  },
  de: {
    encodeBtn: 'Text → Base64',
    decodeBtn: 'Base64 → Text',
    encodeLabel: 'Zu kodierender Text',
    decodeLabel: 'Zu dekodierender Base64',
    encodePlaceholder: 'Text hier eingeben oder einfügen...',
    decodePlaceholder: 'Base64-Zeichenkette hier einfügen...',
    encodeAction: '→ Kodieren',
    decodeAction: '→ Dekodieren',
    result: 'Ergebnis',
    copy: 'Kopieren',
    copied: '✓ Kopiert',
    errorDecode: 'Ungültige Base64-Eingabe. Bitte gültige Base64-Zeichenkette angeben.',
    errorEncode: 'Kodierungsfehler.',
  },
}

const taStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '1rem',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  outline: 'none',
  resize: 'vertical',
  minHeight: 140,
  lineHeight: 1.6,
}

// UTF-8 safe encode/decode
const b64encode = (str) => {
  const bytes = new TextEncoder().encode(str)
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('')
  return btoa(binary)
}
const b64decode = (str) => {
  const binary = atob(str.trim())
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export default function Base64Tool() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const switchMode = (m) => {
    setMode(m)
    setInput('')
    setOutput('')
    setError(null)
    setCopied(false)
  }

  const process = () => {
    setError(null)
    setCopied(false)
    try {
      setOutput(mode === 'encode' ? b64encode(input) : b64decode(input))
    } catch {
      setError(mode === 'decode' ? ui.errorDecode : ui.errorEncode)
      setOutput('')
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 700 }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { val: 'encode', label: ui.encodeBtn },
          { val: 'decode', label: ui.decodeBtn },
        ].map(m => (
          <button key={m.val} onClick={() => switchMode(m.val)} style={{
            padding: '0.55rem 1.2rem', borderRadius: 8,
            border: `1px solid ${mode === m.val ? 'var(--neon-cyan)' : 'var(--border)'}`,
            background: mode === m.val ? 'rgba(0,240,255,0.12)' : 'transparent',
            color: mode === m.val ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 600,
            fontSize: '0.85rem', transition: 'all 0.2s',
          }}>{m.label}</button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
          {mode === 'encode' ? ui.encodeLabel : ui.decodeLabel}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? ui.encodePlaceholder : ui.decodePlaceholder}
          style={taStyle}
        />
      </div>

      <button onClick={process} style={{
        padding: '0.75rem 1.75rem', borderRadius: 10,
        background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
        color: '#000', fontWeight: 700, fontSize: '0.95rem',
        border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        {mode === 'encode' ? ui.encodeAction : ui.decodeAction}
      </button>

      {error && (
        <div style={{
          background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)',
          borderRadius: 8, padding: '0.75rem 1rem',
          color: 'var(--neon-pink)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        }}>✗ {error}</div>
      )}

      {output && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{ui.result}</label>
            <button onClick={copy} style={{
              background: copied ? 'rgba(57,255,20,0.15)' : 'transparent',
              border: `1px solid ${copied ? 'var(--neon-green)' : 'var(--border)'}`,
              borderRadius: 6, padding: '0.3rem 0.75rem',
              color: copied ? 'var(--neon-green)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', transition: 'all 0.2s',
            }}>{copied ? ui.copied : ui.copy}</button>
          </div>
          <textarea readOnly value={output} style={{ ...taStyle, minHeight: 140 }} />
        </div>
      )}
    </div>
  )
}
