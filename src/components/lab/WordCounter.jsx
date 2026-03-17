import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const LOCALE_MAP = { es: 'es-ES', en: 'en-US', de: 'de-DE' }

const UI = {
  es: {
    placeholder: 'Pega o escribe el texto aquí...',
    words: 'Palabras',
    chars: 'Caracteres',
    noSpace: 'Sin espacios',
    lines: 'Líneas',
    sentences: 'Frases',
    paragraphs: 'Párrafos',
    readTime: 'Tiempo de lectura',
    readTimeNote: (min) => `Tiempo de lectura estimado: ${min} min a 200 palabras/min`,
    topWords: 'Palabras más frecuentes',
    clear: '✕ Limpiar',
  },
  en: {
    placeholder: 'Paste or type text here...',
    words: 'Words',
    chars: 'Characters',
    noSpace: 'No spaces',
    lines: 'Lines',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    readTime: 'Reading time',
    readTimeNote: (min) => `Estimated reading time: ${min} min at 200 words/min`,
    topWords: 'Most frequent words',
    clear: '✕ Clear',
  },
  de: {
    placeholder: 'Text hier einfügen oder eingeben...',
    words: 'Wörter',
    chars: 'Zeichen',
    noSpace: 'Ohne Leerzeichen',
    lines: 'Zeilen',
    sentences: 'Sätze',
    paragraphs: 'Absätze',
    readTime: 'Lesezeit',
    readTimeNote: (min) => `Geschätzte Lesezeit: ${min} min bei 200 Wörtern/min`,
    topWords: 'Häufigste Wörter',
    clear: '✕ Löschen',
  },
}

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

const Stat = ({ label, value, color = 'var(--neon-cyan)', wide = false, locale = 'en-US' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '0.85rem 1rem',
    gridColumn: wide ? 'span 2' : 'span 1',
  }}>
    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
      {label}
    </div>
    <div style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>
      {value.toLocaleString(locale)}
    </div>
  </div>
)

export default function WordCounter() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const locale = LOCALE_MAP[lang] || 'en-US'
  const [text, setText] = useState('')
  const s = analyze(text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 760 }}>

      {/* ── Textarea ── */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={ui.placeholder}
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
        <Stat label={ui.words}     value={s.words}        color="var(--neon-cyan)"       locale={locale} />
        <Stat label={ui.chars}     value={s.chars}        color="var(--neon-purple)"    locale={locale} />
        <Stat label={ui.noSpace}   value={s.charsNoSpace} color="var(--neon-purple)"    locale={locale} />
        <Stat label={ui.lines}     value={s.lines}        color="#f59e0b"               locale={locale} />
        <Stat label={ui.sentences} value={s.sentences}    color="var(--neon-green)"     locale={locale} />
        <Stat label={ui.paragraphs} value={s.paragraphs}  color="var(--neon-green)"    locale={locale} />
        <Stat label={ui.readTime}  value={s.readingMin}   color="var(--text-secondary)" locale={locale} />
      </div>

      {/* ── Reading time note ── */}
      {s.words > 0 && (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', margin: 0 }}>
          {ui.readTimeNote(s.readingMin)}
        </p>
      )}

      {/* ── Top words ── */}
      {s.topWords.length > 0 && (
        <div>
          <div style={{
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem',
          }}>
            {ui.topWords}
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
          {ui.clear}
        </button>
      )}
    </div>
  )
}
