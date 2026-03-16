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
  minHeight: 180,
  lineHeight: 1.6,
}

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const run = (fn) => {
    setError(null)
    setCopied(false)
    try {
      const parsed = JSON.parse(input)
      setOutput(fn(parsed))
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  const validate = () => {
    setError(null)
    setCopied(false)
    try {
      JSON.parse(input)
      setOutput('✓ JSON válido')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
          JSON de entrada
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'{\n  "ejemplo": "pega tu JSON aquí"\n}'}
          style={taStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Formatear', fn: () => run(p => JSON.stringify(p, null, 2)), color: 'var(--neon-cyan)' },
          { label: 'Minificar', fn: () => run(p => JSON.stringify(p)), color: 'var(--neon-purple)' },
          { label: 'Validar', fn: validate, color: 'var(--neon-green)' },
        ].map(({ label, fn, color }) => (
          <button key={label} onClick={fn} style={{
            padding: '0.6rem 1.4rem', borderRadius: 8,
            border: `1px solid ${color}`, background: 'transparent',
            color, fontFamily: 'var(--font-mono)', fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${color}15`}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >{label}</button>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)',
          borderRadius: 8, padding: '0.75rem 1rem',
          color: 'var(--neon-pink)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        }}>
          ✗ {error}
        </div>
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
          <textarea readOnly value={output} style={{ ...taStyle, minHeight: 200 }} />
        </div>
      )}
    </div>
  )
}
