import { useState } from 'react'

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
      setError(mode === 'decode' ? 'Entrada Base64 inválida. Verifica que sea un string Base64 correcto.' : 'Error al codificar.')
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
          { val: 'encode', label: 'Texto → Base64' },
          { val: 'decode', label: 'Base64 → Texto' },
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
          {mode === 'encode' ? 'Texto a codificar' : 'Base64 a decodificar'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Escribe o pega texto aquí...' : 'Pega tu cadena Base64 aquí...'}
          style={taStyle}
        />
      </div>

      <button onClick={process} style={{
        padding: '0.75rem 1.75rem', borderRadius: 10,
        background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
        color: '#000', fontWeight: 700, fontSize: '0.95rem',
        border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        {mode === 'encode' ? '→ Codificar' : '→ Decodificar'}
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
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Resultado</label>
            <button onClick={copy} style={{
              background: copied ? 'rgba(57,255,20,0.15)' : 'transparent',
              border: `1px solid ${copied ? 'var(--neon-green)' : 'var(--border)'}`,
              borderRadius: 6, padding: '0.3rem 0.75rem',
              color: copied ? 'var(--neon-green)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', transition: 'all 0.2s',
            }}>{copied ? '✓ Copiado' : 'Copiar'}</button>
          </div>
          <textarea readOnly value={output} style={{ ...taStyle, minHeight: 140 }} />
        </div>
      )}
    </div>
  )
}
