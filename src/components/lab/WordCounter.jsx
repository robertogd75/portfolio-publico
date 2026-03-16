import { useState } from 'react'

function analyze(text) {
  const chars        = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const words        = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const lines        = text === '' ? 0 : text.split('\n').length
  const sentences    = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s|$)/g) || []).length
  const paragraphs   = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length
  const readingMin   = Math.ceil(words / 200)   // ~200 wpm average

  // Top 5 frequent words (≥3 chars)
  const freq = {}
  text.toLowerCase().match(/[\wáéíóúüñ]{3,}/g)?.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return { chars, charsNoSpace, words, lines, sentences, paragraphs, readingMin, topWords }
}

const Stat = ({ label, value, color = 'var(--neon-cyan)', wide = false }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '0.85rem 1rem',
    gridColumn: wide ? 'span 2' : 'span 1',
  }}>
    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
      {label}
    </div>
    <div style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>
      {value.toLocaleString('es-ES')}
    </div>
  </div>
)

export default function WordCounter() {
  const [text, setText] = useState('')
  const s = analyze(text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 760 }}>

      {/* ── Textarea ── */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Pega o escribe el texto aquí..."
        style={{
          width: '100%', background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)', borderRadius: 10,
          padding: '1rem', color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)', fontSize: '0.88rem',
          outline: 'none', resize: 'vertical', minHeight: 180, lineHeight: 1.65,
        }}
      />

      {/* ── Stats grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
        <Stat label="Palabras"          value={s.words}        color="var(--neon-cyan)" />
        <Stat label="Caracteres"        value={s.chars}        color="var(--neon-purple)" />
        <Stat label="Sin espacios"      value={s.charsNoSpace} color="var(--neon-purple)" />
        <Stat label="Líneas"            value={s.lines}        color="#f59e0b" />
        <Stat label="Frases"            value={s.sentences}    color="var(--neon-green)" />
        <Stat label="Párrafos"          value={s.paragraphs}   color="var(--neon-green)" />
        <Stat label="Tiempo de lectura" value={s.readingMin}   color="var(--text-secondary)" />
      </div>

      {/* ── Reading time note ── */}
      {s.words > 0 && (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', margin: 0 }}>
          Tiempo de lectura estimado: <span style={{ color: 'var(--text-secondary)' }}>{s.readingMin} min</span> a 200 palabras/min
        </p>
      )}

      {/* ── Top words ── */}
      {s.topWords.length > 0 && (
        <div>
          <div style={{
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem',
          }}>
            Palabras más frecuentes
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {s.topWords.map(([word, count]) => (
              <span key={word} style={{
                background: 'rgba(0,240,255,0.07)', border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: 20, padding: '0.3rem 0.75rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--neon-cyan)',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                {word}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Clear ── */}
      {text.length > 0 && (
        <button
          onClick={() => setText('')}
          style={{
            alignSelf: 'flex-start', padding: '0.5rem 1.2rem', borderRadius: 8,
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b9d'; e.currentTarget.style.color = '#ff6b9d' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  )
}
