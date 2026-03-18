import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'
import { useChat } from './ChatContext.jsx'

const UI = {
  es: {
    label:       '// asistente.ia',
    title:       'Â¿Tienes alguna pregunta',
    titleNeon:   'sobre mÃ­?',
    desc:        'El asistente solo conoce informaciÃ³n de este portfolio.',
    placeholder: 'Escribe tu pregunta...',
    welcome:     'Â¡Hola! PregÃºntame lo que quieras sobre el perfil, proyectos o experiencia de Roberto.',
    error:       'Algo saliÃ³ mal. IntÃ©ntalo de nuevo.',
    rateLimit:   'Demasiadas preguntas. IntÃ©ntalo mÃ¡s tarde.',
    suggestions: ['Â¿QuÃ© proyectos tienes?', 'Â¿QuÃ© tecnologÃ­as dominas?', 'Â¿EstÃ¡s disponible para trabajar?'],
  },
  en: {
    label:       '// ai.assistant',
    title:       'Any questions',
    titleNeon:   'about me?',
    desc:        'The assistant only knows information from this portfolio.',
    placeholder: 'Type your question...',
    welcome:     "Hi! Ask me anything about Roberto's profile, projects or experience.",
    error:       'Something went wrong. Please try again.',
    rateLimit:   'Too many questions. Please try again later.',
    suggestions: ['What are your projects?', 'What technologies do you know?', 'Are you available to work?'],
  },
  de: {
    label:       '// ki.assistent',
    title:       'Hast du Fragen',
    titleNeon:   'Ã¼ber mich?',
    desc:        'Der Assistent kennt nur Informationen aus diesem Portfolio.',
    placeholder: 'Frage eingeben...',
    welcome:     'Hallo! Frag mich alles Ã¼ber Robertos Profil, Projekte oder Erfahrungen.',
    error:       'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
    rateLimit:   'Zu viele Anfragen. Bitte spÃ¤ter erneut versuchen.',
    suggestions: ['Was sind deine Projekte?', 'Welche Technologien beherrschst du?', 'Bist du verfÃ¼gbar?'],
  },
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--neon-cyan)', opacity: 0.7,
          animation: 'chatDot 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </span>
  )
}

function Bubble({ role, content, isLoading }) {
  const isUser = role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '0.55rem' }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', marginRight: '0.4rem', marginTop: 2,
        }}>âœ¦</div>
      )}
      <div
        className={isUser ? undefined : 'chat-msg-assistant'}
        style={{
          maxWidth: '80%',
          background: isUser
            ? 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(0,240,255,0.1))'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isUser ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: isUser ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
          padding: '0.5rem 0.75rem',
          fontSize: '0.835rem', lineHeight: 1.55,
          color: 'var(--text-primary)', wordBreak: 'break-word', whiteSpace: 'pre-wrap',
        }}
      >
        {isLoading ? <TypingDots /> : content}
      </div>
    </div>
  )
}

export default function AiChatSection() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es
  const { messages, loading, sendMessage } = useChat()

  const [input, setInput]   = useState('')
  const scrollRef           = useRef(null)
  const inputRef            = useRef(null)

  // Scroll only the messages container, never the page
  useEffect(() => {
    if (messages.length === 0 && !loading) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  function handleSend(text) {
    sendMessage(text, { errorText: ui.error, rateLimitText: ui.rateLimit })
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); setInput('') }
  }

  return (
    <>
      <style>{`@keyframes chatDot { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }`}</style>

      <section style={{ marginTop: '5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-label" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            {ui.label}
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '0.6rem' }}>
            {ui.title}{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{ui.titleNeon}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{ui.desc}</p>
        </div>

        {/* Chat card */}
        <div style={{
          maxWidth: 640, margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          {/* Card header */}
          <div className="chat-header" style={{
            padding: '0.85rem 1.1rem',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.06), rgba(168,85,247,0.06))',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--neon-cyan), #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
            }}>âœ¦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Roberto AI</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ui.desc}</div>
            </div>
            <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'block' }} />
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            padding: '1rem',
            minHeight: 160, maxHeight: 280,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,240,255,0.2) transparent',
          }}>
            <Bubble role="assistant" content={ui.welcome} />

            {messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.4rem 0 0.6rem 34px' }}>
                {ui.suggestions.map(s => (
                  <button key={s} onClick={() => handleSend(s)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.67rem',
                    padding: '0.28rem 0.6rem', borderRadius: 20,
                    background: 'rgba(0,240,255,0.07)',
                    border: '1px solid rgba(0,240,255,0.22)',
                    color: 'var(--neon-cyan)', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,240,255,0.14)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,240,255,0.07)' }}
                  >{s}</button>
                ))}
              </div>
            )}

            {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
            {loading && <Bubble role="assistant" isLoading />}
          </div>

          {/* Input */}
          <div className="chat-input-wrap" style={{
            padding: '0.65rem 0.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              className="chat-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.placeholder}
              maxLength={500}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(0,240,255,0.18)',
                borderRadius: 9, padding: '0.48rem 0.65rem',
                color: 'var(--text-primary)', fontSize: '0.85rem',
                fontFamily: 'inherit', lineHeight: 1.5, outline: 'none',
                minHeight: 36, maxHeight: 90, scrollbarWidth: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,240,255,0.45)' }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(0,240,255,0.18)' }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 90)}px`
              }}
            />
            <button
              onClick={() => { handleSend(input); setInput('') }}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: 9, border: 'none', flexShrink: 0,
                background: (!input.trim() || loading)
                  ? 'rgba(0,240,255,0.08)'
                  : 'linear-gradient(135deg, var(--neon-cyan), #7c3aed)',
                cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={(!input.trim() || loading) ? 'rgba(0,240,255,0.35)' : 'white'}
                strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

