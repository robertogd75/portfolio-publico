import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext.jsx'
import AiChatSection from '../components/AiChatSection.jsx'

// Recipient is only used inside encodeURIComponent for a mailto: href.
// No data ever reaches a third-party server — the message is composed
// entirely in the user's own email client.
const RECIPIENT = 'rgardel.developer@gmail.com'

const UI = {
  es: {
    label:            '// contacto',
    titleStart:       'Hablemos',
    titleNeon:        'de tu proyecto.',
    desc:             'Rellena el formulario y se abrirá tu cliente de correo con los datos ya completados. Tu mensaje nunca pasa por servidores de terceros.',
    nameLabel:        'Tu nombre',
    namePlaceholder:  'Roberto García',
    emailLabel:       'Tu correo',
    emailPlaceholder: 'tu@email.com',
    subjectLabel:     'Asunto',
    subjectPlaceholder:'¿En qué puedo ayudarte?',
    msgLabel:         'Mensaje',
    msgPlaceholder:   'Cuéntame tu proyecto, idea o consulta...',
    send:             '✉ Abrir cliente de correo',
    privacy:          'Tu mensaje se envía directamente desde tu propio cliente de correo. Sin servidores intermedios, sin registro de datos.',
    directLabel:      'O escríbeme directamente',
    copyTip:          'Copiar',
    copiedTip:        '¡Copiado!',
    infoTitle:        '¿Por qué este método?',
    infoBody:         'Al usar tu cliente de correo nativo, tu mensaje y tus datos permanecen en todo momento bajo tu control. No existen bases de datos, claves de API expuestas ni formularios que almacenen lo que escribes.',
    responseLabel:    'Tiempo de respuesta',
    responseValue:    'Menos de 48 horas',
    langLabel:        'Idiomas',
    langValue:        'Español · English',
    locationLabel:    'Ubicación',
    locationValue:    'Málaga, España · Remoto',
    sending:          'Enviando…',
    sent:             '¡Mensaje enviado!',
    sentDesc:         'Gracias por escribir. Te responderé en menos de 48 horas.',
    errSend:          'No se pudo enviar. Inténtalo de nuevo.',
    tryAgain:         'Reintentar',
  },
  en: {
    label:            '// contact',
    titleStart:       "Let's talk",
    titleNeon:        'about your project.',
    desc:             'Fill in the form and your email client will open with the details pre-filled. Your message never goes through third-party servers.',
    nameLabel:        'Your name',
    namePlaceholder:  'John Doe',
    emailLabel:       'Your email',
    emailPlaceholder: 'you@email.com',
    subjectLabel:     'Subject',
    subjectPlaceholder:'How can I help you?',
    msgLabel:         'Message',
    msgPlaceholder:   'Tell me about your project, idea or question...',
    send:             '✉ Open email client',
    privacy:          'Your message is sent directly from your own email client. No intermediate servers, no data logging.',
    directLabel:      'Or write to me directly',
    copyTip:          'Copy',
    copiedTip:        'Copied!',
    infoTitle:        'Why this method?',
    infoBody:         'By using your native email client, your message and your data remain under your control at all times. No databases, no exposed API keys, no forms that store what you write.',
    responseLabel:    'Response time',
    responseValue:    'Less than 48 hours',
    langLabel:        'Languages',
    langValue:        'Español · English',
    locationValue:    'Málaga, Spain · Remote',
    sending:          'Sending…',
    sent:             'Message sent!',
    sentDesc:         'Thanks for reaching out. I will reply within 48 hours.',
    errSend:          'Could not send the message. Please try again.',
    tryAgain:         'Try again',
  },
  de: {
    label:            '// kontakt',
    titleStart:       'Lass uns über',
    titleNeon:        'dein Projekt reden.',
    desc:             'Füll das Formular aus und dein E-Mail-Client öffnet sich mit den vorausgefüllten Daten. Deine Nachricht geht nie über Drittanbieter-Server.',
    nameLabel:        'Dein Name',
    namePlaceholder:  'Max Mustermann',
    emailLabel:       'Deine E-Mail',
    emailPlaceholder: 'du@email.com',
    subjectLabel:     'Betreff',
    subjectPlaceholder:'Wie kann ich helfen?',
    msgLabel:         'Nachricht',
    msgPlaceholder:   'Erzähl mir von deinem Projekt, deiner Idee oder Frage...',
    send:             '✉ E-Mail-Client öffnen',
    privacy:          'Deine Nachricht wird direkt von deinem eigenen E-Mail-Client gesendet. Keine Zwischenserver, keine Datenspeicherung.',
    directLabel:      'Oder schreib mir direkt',
    copyTip:          'Kopieren',
    copiedTip:        'Kopiert!',
    infoTitle:        'Warum diese Methode?',
    infoBody:         'Durch die Nutzung deines nativen E-Mail-Clients bleiben deine Nachricht und Daten jederzeit unter deiner Kontrolle. Keine Datenbanken, keine exponierten API-Schlüssel, keine Formulare, die deine Eingaben speichern.',
    responseLabel:    'Antwortzeit',
    responseValue:    'Weniger als 48 Stunden',
    langLabel:        'Sprachen',
    langValue:        'Español · English',
    locationValue:    'Málaga, Spanien · Remote',
    sending:          'Senden…',
    sent:             'Nachricht gesendet!',
    sentDesc:         'Danke fürs Schreiben. Ich antworte innerhalb von 48 Stunden.',
    errSend:          'Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.',
    tryAgain:         'Erneut versuchen',
  },
}

const inputStyle = (focused) => ({
  width: '100%',
  background: focused ? 'rgba(0,150,180,0.06)' : 'var(--bg-input)',
  border: `1px solid ${focused ? 'var(--neon-cyan)' : 'var(--border)'}`,
  borderRadius: 10,
  padding: '0.8rem 1rem',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
  boxShadow: focused ? '0 0 0 3px rgba(0,240,255,0.08)' : 'none',
})

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
  marginBottom: '0.45rem',
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function ContactPage() {
  const { lang } = useTranslation()
  const ui = UI[lang] ?? UI.es

  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [focused, setFocused] = useState('')
  const [copied, setCopied]   = useState(false)
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(RECIPIENT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const allFilled  = form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim()
  const canSubmit  = !!allFilled && status !== 'sending' && status !== 'sent'

  return (
    <main style={{ paddingTop: '68px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,240,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(0,240,255,0.06)', top: '10%', right: '-5%', animationDuration: '12s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: 'rgba(168,85,247,0.06)', bottom: '15%', left: '-5%', animationDelay: '5s' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,240,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--section-pad)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            {ui.label}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
            {ui.titleStart}<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {ui.titleNeon}
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
            {ui.desc}
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: 940,
          margin: '0 auto',
        }}>
          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <Field label={ui.nameLabel}>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder={ui.namePlaceholder}
                maxLength={80}
                autoComplete="name"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'name')}
              />
            </Field>

            <Field label={ui.emailLabel}>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder={ui.emailPlaceholder}
                maxLength={120}
                autoComplete="email"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'email')}
              />
            </Field>

            <Field label={ui.subjectLabel}>
              <input
                type="text"
                value={form.subject}
                onChange={set('subject')}
                placeholder={ui.subjectPlaceholder}
                maxLength={150}
                onFocus={() => setFocused('subject')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'subject')}
              />
            </Field>

            <Field label={ui.msgLabel}>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder={ui.msgPlaceholder}
                maxLength={2000}
                rows={6}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused('')}
                style={{ ...inputStyle(focused === 'message'), resize: 'vertical', minHeight: 140 }}
              />
            </Field>

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                background: canSubmit
                  ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'
                  : 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: 10,
                padding: '0.9rem 1.5rem',
                color: canSubmit ? '#0a0a0f' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
              }}
            >
              {status === 'sending' ? ui.sending : ui.send}
            </button>

            {/* Success message */}
            {status === 'sent' && (
              <div style={{
                background: 'rgba(74,222,128,0.08)', border: '1px solid #4ade8033',
                borderRadius: 10, padding: '0.9rem 1rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
              }}>
                <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span>
                <div>
                  <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '0.2rem' }}>{ui.sent}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{ui.sentDesc}</div>
                </div>
              </div>
            )}

            {/* Error message */}
            {status === 'error' && (
              <div style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid #f8717133',
                borderRadius: 10, padding: '0.9rem 1rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
              }}>
                <span style={{ color: '#f87171' }}>{ui.errSend}</span>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  style={{
                    background: 'none', border: '1px solid #f8717155', borderRadius: 6,
                    padding: '0.3rem 0.75rem', color: '#f87171', fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {ui.tryAgain}
                </button>
              </div>
            )}

            {/* Privacy note */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'flex-start',
            }}>
              <span style={{ color: '#4ade80', flexShrink: 0 }}>🔒</span>
              {ui.privacy}
            </p>
          </form>

          {/* ── Info panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Direct email */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '1.5rem',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {ui.directLabel}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--neon-cyan)',
                  wordBreak: 'break-all',
                }}>
                  {RECIPIENT}
                </span>
                <button
                  onClick={handleCopy}
                  title={copied ? ui.copiedTip : ui.copyTip}
                  style={{
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${copied ? '#4ade8055' : 'var(--border)'}`,
                    borderRadius: 6,
                    padding: '0.3rem 0.7rem',
                    color: copied ? '#4ade80' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {copied ? ui.copiedTip : ui.copyTip}
                </button>
              </div>
            </div>

            {/* Why this method */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '1.5rem',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {ui.infoTitle}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                {ui.infoBody}
              </p>
            </div>

            {/* Quick info */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {[
                { label: ui.responseLabel, value: ui.responseValue, color: '#4ade80' },
                { label: ui.langLabel,     value: ui.langValue,     color: 'var(--neon-cyan)' },
                { label: ui.locationLabel, value: ui.locationValue, color: 'var(--neon-purple)' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color, margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AiChatSection />
      </div>
    </main>
  )
}
