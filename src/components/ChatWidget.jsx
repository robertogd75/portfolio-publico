import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'
import { useChat } from './ChatContext.jsx'

const UI = {
  es: {
    title:       'Roberto AI',
    subtitle:    'Pregúntame sobre el portfolio',
    placeholder: 'Escribe una pregunta...',
    welcome:     '¡Hola! Soy el asistente virtual de Roberto. Puedo responderte preguntas sobre su perfil, proyectos, stack tecnológico y experiencia. ¿En qué puedo ayudarte?',
    error:       'Algo salió mal. Inténtalo de nuevo.',
    rateLimit:   'Demasiadas preguntas. Inténtalo más tarde.',
    suggestions: [
      '¿Cuáles son tus proyectos?',
      '¿Qué tecnologías dominas?',
      '¿Tienes experiencia laboral?',
      '¿Cómo puedo contactarte?',
    ],
  },
  en: {
    title:       'Roberto AI',
    subtitle:    'Ask me about the portfolio',
    placeholder: 'Type a question...',
    welcome:     "Hi! I'm Roberto's virtual assistant. I can answer questions about his profile, projects, tech stack and experience. How can I help you?",
    error:       'Something went wrong. Please try again.',
    rateLimit:   'Too many questions. Please try again later.',
    suggestions: [
      'What are your projects?',
      'What technologies do you know?',
      'Do you have work experience?',
      'How can I contact you?',
    ],
  },
  de: {
    title:       'Roberto AI',
    subtitle:    'Fragen zum Portfolio',
    placeholder: 'Frage eingeben...',
    welcome:     'Hallo! Ich bin Robertos virtueller Assistent. Ich kann Fragen zu seinem Profil, Projekten, Tech-Stack und Erfahrungen beantworten. Wie kann ich helfen?',
    error:       'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
    rateLimit:   'Zu viele Anfragen. Bitte später erneut versuchen.',
    suggestions: [
      'Was sind deine Projekte?',
      'Welche Technologien beherrschst du?',
      'Hast du Berufserfahrung?',
      'Wie kann ich dich kontaktieren?',
    ],
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

function ChatMessage({ role, content, isLoading }) {
  const isUser = role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '0.6rem' }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', marginRight: '0.45rem', marginTop: 2,
        }}>âœ¦</div>
      )}
      <div
        className={isUser ? undefined : 'chat-msg-assistant'}
        style={{
          maxWidth: '78%',
          background: isUser
            ? 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(0,240,255,0.1))'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isUser ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          padding: '0.55rem 0.8rem',
          fontSize: '0.835rem', lineHeight: 1.55,
          color: 'var(--text-primary)', wordBreak: 'break-word', whiteSpace: 'pre-wrap',
        }}
      >
        {isLoading ? <TypingDots /> : content}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { lang }                  = useTranslation()
  const ui                        = UI[lang] ?? UI.es
  const { messages, loading, sendMessage } = useChat()

  const [open, setOpen]           = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [input, setInput]         = useState('')
  const scrollRef                 = useRef(null)
  const inputRef                  = useRef(null)

  // Scroll messages container (not the whole page)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120)
      if (!hasOpened) setHasOpened(true)
      // Scroll to bottom when opening
      setTimeout(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
      }, 50)
    }
  }, [open])

  function handleSend(text) {
    sendMessage(text, { errorText: ui.error, rateLimitText: ui.rateLimit })
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); setInput('') }
  }

  const showSuggestions = messages.length === 0

  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title={ui.subtitle}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          width: 54, height: 54, borderRadius: '50%', border: 'none',
          background: open
            ? 'rgba(30,20,50,0.95)'
            : 'linear-gradient(135deg, var(--neon-cyan), #7c3aed)',
          boxShadow: open ? '0 4px 20px rgba(0,240,255,0.25)' : '0 6px 24px rgba(0,240,255,0.35)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease', outline: 'none',
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!hasOpened && (
          <span style={{
            position: 'absolute', top: 3, right: 3,
            width: 11, height: 11, borderRadius: '50%',
            background: '#4ade80', border: '2px solid var(--bg-base)',
          }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="chat-panel chat-panel--widget"
          style={{
            position: 'fixed', bottom: 88, right: 24, zIndex: 9997,
            width: 'min(360px, calc(100vw - 32px))',
            height: 'min(500px, calc(100vh - 120px))',
            background: 'rgba(12,10,22,0.97)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,240,255,0.2)',
            borderRadius: 18,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,240,255,0.06)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatPanelIn 0.22s ease',
          }}
        >
          {/* Header */}
          <div className="chat-header" style={{
            padding: '0.9rem 1rem',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(124,58,237,0.08))',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--neon-cyan), #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
            }}>âœ¦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ui.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ui.subtitle}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'block' }} />
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,240,255,0.2) transparent',
          }}>
            <ChatMessage role="assistant" content={ui.welcome} />
            {showSuggestions && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem', marginTop: '0.1rem' }}>
                {ui.suggestions.map(s => (
                  <button key={s} onClick={() => handleSend(s)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    padding: '0.3rem 0.65rem', borderRadius: 20,
                    background: 'rgba(0,240,255,0.07)',
                    border: '1px solid rgba(0,240,255,0.25)',
                    color: 'var(--neon-cyan)', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,240,255,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,240,255,0.07)' }}
                  >{s}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
            {loading && <ChatMessage role="assistant" isLoading />}
          </div>

          {/* Input */}
          <div className="chat-input-wrap" style={{
            padding: '0.7rem 0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0,
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
                border: '1px solid rgba(0,240,255,0.2)',
                borderRadius: 10, padding: '0.5rem 0.7rem',
                color: 'var(--text-primary)', fontSize: '0.85rem',
                fontFamily: 'inherit', lineHeight: 1.5,
                outline: 'none', transition: 'border-color 0.2s',
                minHeight: 38, maxHeight: 100, scrollbarWidth: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,240,255,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(0,240,255,0.2)' }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
              }}
            />
            <button
              onClick={() => { handleSend(input); setInput('') }}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none', flexShrink: 0,
                background: (!input.trim() || loading)
                  ? 'rgba(0,240,255,0.1)'
                  : 'linear-gradient(135deg, var(--neon-cyan), #7c3aed)',
                cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={(!input.trim() || loading) ? 'rgba(0,240,255,0.4)' : 'white'}
                strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
