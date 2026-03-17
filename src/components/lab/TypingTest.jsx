import { useState, useEffect, useRef } from 'react'

const DURATION = 60
const LS_KEY   = 'lab_typing_scores'
const MAX_KEEP = 10

const TEXTS = [
  'El desarrollo web moderno requiere conocer tanto el frontend como el backend para construir aplicaciones robustas y escalables.',
  'Docker permite empaquetar aplicaciones en contenedores que se ejecutan de forma consistente en cualquier entorno de produccion.',
  'React utiliza un DOM virtual para actualizar la interfaz de usuario de forma eficiente ante los cambios de estado del componente.',
  'Las APIs REST permiten la comunicacion entre sistemas mediante HTTP usando metodos como GET, POST, PUT y DELETE de forma clara.',
  'Git es un sistema de control de versiones distribuido que permite a los equipos colaborar en proyectos de software de forma ordenada.',
  'Nginx puede actuar como servidor web, proxy inverso y balanceador de carga para gestionar el trafico de las aplicaciones modernas.',
  'JavaScript es un lenguaje de programacion interpretado que se ejecuta en el navegador y permite crear interfaces dinamicas e interactivas.',
  'Las bases de datos relacionales organizan la informacion en tablas con filas y columnas relacionadas mediante claves primarias y foraneas.',
  'Spring Boot simplifica el desarrollo de aplicaciones Java al proporcionar configuracion automatica y un servidor embebido listo para usar.',
  'Laravel ofrece herramientas como Eloquent ORM y Artisan para desarrollar aplicaciones web con PHP de forma rapida y muy elegante.',
  'La arquitectura de microservicios divide una aplicacion en servicios independientes que se comunican entre si a traves de la red.',
  'CSS Grid y Flexbox son sistemas de diseno modernos que permiten crear layouts complejos y responsivos con muy pocas lineas de codigo.',
  'TypeScript agrega tipado estatico a JavaScript para detectar errores en tiempo de compilacion y mejorar la experiencia de desarrollo.',
  'El despliegue continuo automatiza la entrega de software mediante pruebas y publicacion automaticas en cada nuevo cambio realizado.',
  'Los hooks de React permiten usar estado y efectos secundarios en componentes funcionales de forma sencilla y completamente reutilizable.',
  'PostgreSQL es un sistema de gestion de bases de datos relacional que soporta consultas complejas y tipos de datos muy avanzados.',
  'El diseno responsivo adapta la interfaz a distintos tamanos de pantalla mediante media queries y unidades de medida relativas modernas.',
  'La programacion orientada a objetos organiza el codigo en clases y objetos que encapsulan datos y comportamiento bien relacionado.',
  'El patron MVC separa la logica de negocio, la presentacion y el flujo de control en tres capas bien definidas e independientes entre si.',
  'Portainer ofrece una interfaz grafica para gestionar contenedores Docker y facilita el monitoreo de servicios activos en produccion.',
  'La seguridad web comprende la proteccion contra inyeccion de SQL, scripting cruzado y falsificacion de solicitudes entre distintos sitios.',
  'Los sistemas de control de versiones permiten rastrear cambios en el codigo, colaborar en equipo y revertir errores con gran facilidad.',
  'El protocolo HTTPS cifra la comunicacion entre el navegador y el servidor para proteger los datos del usuario durante la transmision.',
  'Webpack y Vite son herramientas modernas de empaquetado que optimizan y agrupan los recursos de una aplicacion web para produccion.',
]

// ── localStorage helpers ─────────────────────────────────────────────────────
const loadScores = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? [] }
  catch { return [] }
}

const persistScore = (entry) => {
  const list = loadScores()
  list.push(entry)
  list.sort((a, b) => b.score - a.score)
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, MAX_KEEP)))
}

// ── stats calculator ─────────────────────────────────────────────────────────
const calcStats = (typedStr, targetStr, elapsedSec) => {
  let correct = 0
  for (let i = 0; i < typedStr.length; i++) {
    if (i < targetStr.length && typedStr[i] === targetStr[i]) correct++
  }
  const len      = typedStr.length
  const accuracy = len > 0 ? Math.round((correct / len) * 100) : 100
  const mins     = elapsedSec / 60
  const wpm      = mins > 0.05 ? Math.round(correct / 5 / mins) : 0
  const score    = Math.round(wpm * (accuracy / 100) * 10)
  return { wpm, accuracy, score }
}

// ── score tier label ─────────────────────────────────────────────────────────
const tier = (score) => {
  if (score >= 900) return { label: 'Leyenda',      color: '#f59e0b' }
  if (score >= 700) return { label: 'Experto',      color: 'var(--neon-cyan)' }
  if (score >= 500) return { label: 'Avanzado',     color: '#a78bfa' }
  if (score >= 300) return { label: 'Intermedio',   color: '#4ade80' }
  return                    { label: 'Principiante', color: 'var(--text-muted)' }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TypingTest() {
  const [phase,     setPhase]    = useState('idle')   // idle|countdown|playing|results
  const [countdown, setCountdown]= useState(3)
  const [text,      setText]     = useState('')
  const [typed,     setTyped]    = useState('')
  const [timeLeft,  setTimeLeft] = useState(DURATION)
  const [liveWpm,   setLiveWpm]  = useState(0)
  const [liveAcc,   setLiveAcc]  = useState(100)
  const [result,    setResult]   = useState(null)
  const [isRecord,  setIsRecord] = useState(false)
  const [scores,    setScores]   = useState(loadScores)

  // refs to avoid stale closures in timers
  const typedRef   = useRef('')
  const textRef    = useRef('')
  const timeRef    = useRef(DURATION)
  const startTsRef = useRef(null)
  const timerRef   = useRef(null)
  const usedRef    = useRef(new Set())
  const doneRef    = useRef(false)
  const inputRef   = useRef(null)

  // ── helpers ─────────────────────────────────────────────────────────────────
  const pickText = () => {
    if (usedRef.current.size >= TEXTS.length) usedRef.current.clear()
    let i
    do { i = Math.floor(Math.random() * TEXTS.length) }
    while (usedRef.current.has(i))
    usedRef.current.add(i)
    return TEXTS[i]
  }

  const finalize = (typedStr, targetStr, elapsedSec) => {
    if (doneRef.current) return
    doneRef.current = true
    clearInterval(timerRef.current)
    const { wpm, accuracy, score } = calcStats(typedStr, targetStr, elapsedSec)
    const prevBest = loadScores()[0]?.score ?? 0
    const entry = { score, wpm, accuracy, date: new Date().toLocaleDateString('es-ES') }
    setIsRecord(score > prevBest && score > 0)
    setResult(entry)
    persistScore(entry)
    setScores(loadScores())
    setPhase('results')
  }

  const startGame = () => {
    clearInterval(timerRef.current)
    const t = pickText()
    textRef.current  = t
    typedRef.current = ''
    timeRef.current  = DURATION
    doneRef.current  = false
    startTsRef.current = null
    setText(t); setTyped(''); setTimeLeft(DURATION)
    setLiveWpm(0); setLiveAcc(100)
    setResult(null); setIsRecord(false)
    setCountdown(3); setPhase('countdown')
  }

  // ── countdown ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      setTimeout(() => inputRef.current?.focus(), 30)
      return
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, countdown])

  // ── game timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      timeRef.current -= 1
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        const elapsed = startTsRef.current
          ? (Date.now() - startTsRef.current) / 1000
          : DURATION
        finalize(typedRef.current, textRef.current, elapsed)
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  // ── input handler ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    if (phase !== 'playing') return
    const val = e.target.value
    if (val.length > textRef.current.length) return
    if (!startTsRef.current && val.length > 0) startTsRef.current = Date.now()
    typedRef.current = val
    setTyped(val)
    const elapsed = startTsRef.current ? (Date.now() - startTsRef.current) / 1000 : 0
    const { wpm, accuracy } = calcStats(val, textRef.current, elapsed)
    setLiveWpm(wpm); setLiveAcc(accuracy)
    if (val === textRef.current) {
      finalize(val, textRef.current, elapsed)
    }
  }

  // ── render chars ──────────────────────────────────────────────────────────
  const renderText = () =>
    text.split('').map((ch, i) => {
      let color = 'rgba(255,255,255,0.28)'
      let bg    = 'transparent'
      if (i < typed.length) {
        color = typed[i] === ch ? '#4ade80' : '#f87171'
        bg    = typed[i] === ch ? 'transparent' : 'rgba(248,113,113,0.14)'
      }
      const cursor = i === typed.length
      return (
        <span key={i} style={{
          color,
          background: cursor ? 'rgba(0,240,255,0.18)' : bg,
          borderLeft: cursor ? '2px solid var(--neon-cyan)' : undefined,
          transition: 'color 0.07s',
        }}>
          {ch}
        </span>
      )
    })

  const timerPct   = (timeLeft / DURATION) * 100
  const timerColor = timeLeft > 30 ? '#4ade80' : timeLeft > 10 ? '#f59e0b' : '#f87171'
  const completed  = typed.length > 0 ? Math.round((typed.length / text.length) * 100) : 0

  // ══ IDLE ═══════════════════════════════════════════════════════════════════
  if (phase === 'idle') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⌨️</div>
        <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem' }}>
          Reto de <span style={{ color: 'var(--neon-cyan)' }}>Mecanografía</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 460, margin: '0 auto 0.75rem' }}>
          Tienes <strong style={{ color: 'var(--text-primary)' }}>60 segundos</strong> para
          escribir el texto lo más rápido y preciso posible. Los textos no se repiten.
          Puntuación = <code style={{ color: 'var(--neon-cyan)', fontSize: '0.9em' }}>WPM × precisión × 10</code>
        </p>
        {/* Tiers */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[['< 300', 'Principiante', '#94a3b8'], ['300+', 'Intermedio', '#4ade80'], ['500+', 'Avanzado', '#a78bfa'], ['700+', 'Experto', 'var(--neon-cyan)'], ['900+', 'Leyenda', '#f59e0b']].map(([pts, label, col]) => (
            <span key={label} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              padding: '0.2rem 0.65rem', borderRadius: 20,
              border: `1px solid ${col}44`, color: col,
              background: `${col}0f`,
            }}>
              {pts} — {label}
            </span>
          ))}
        </div>
        <button onClick={startGame} style={{
          background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
          border: 'none', borderRadius: 12,
          padding: '0.9rem 3rem',
          color: '#0a0a0f', fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem', fontWeight: 800,
          cursor: 'pointer', letterSpacing: '0.06em',
        }}>
          ▶ JUGAR
        </button>
      </div>

      {scores.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
            Tus mejores puntuaciones (guardadas en este navegador)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {scores.map((s, i) => {
              const t = tier(s.score)
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.55rem 1rem',
                  background: i === 0 ? 'rgba(0,240,255,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i === 0 ? 'rgba(0,240,255,0.25)' : 'var(--border)'}`,
                  borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                }}>
                  <span style={{ width: 26, textAlign: 'center', color: i === 0 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 700 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <span style={{ color: 'var(--neon-cyan)', fontWeight: 700, minWidth: 68 }}>{s.score} pts</span>
                  <span style={{ color: 'var(--text-secondary)', minWidth: 68 }}>{s.wpm} WPM</span>
                  <span style={{ color: 'var(--text-secondary)', minWidth: 44 }}>{s.accuracy}%</span>
                  <span style={{ color: t.color, fontSize: '0.72rem', fontWeight: 700 }}>{t.label}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontSize: '0.75rem' }}>{s.date}</span>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => { localStorage.removeItem(LS_KEY); setScores([]) }}
            style={{ marginTop: '0.6rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Borrar historial
          </button>
        </div>
      )}
    </div>
  )

  // ══ COUNTDOWN ═══════════════════════════════════════════════════════════════
  if (phase === 'countdown') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, gap: '1rem' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontWeight: 900,
        fontSize: 'clamp(7rem, 22vw, 10rem)', lineHeight: 1,
        color: 'var(--neon-cyan)',
        textShadow: '0 0 80px rgba(0,240,255,0.6)',
        transition: 'all 0.3s',
      }}>
        {countdown === 0 ? '¡YA!' : countdown}
      </div>
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
        Prepárate para escribir…
      </div>
    </div>
  )

  // ══ PLAYING ═════════════════════════════════════════════════════════════════
  if (phase === 'playing') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* HUD */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Countdown */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 900,
          fontSize: '2.8rem', lineHeight: 1, minWidth: 58,
          color: timerColor,
          textShadow: `0 0 24px ${timerColor}66`,
          transition: 'color 0.4s',
        }}>
          {timeLeft}
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            ['WPM',       liveWpm,       'var(--text-primary)'],
            ['Precisión', `${liveAcc}%`, liveAcc >= 90 ? '#4ade80' : liveAcc >= 70 ? '#f59e0b' : '#f87171'],
            ['Progreso',  `${completed}%`, 'var(--text-secondary)'],
          ].map(([label, val, col]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: col, lineHeight: 1.2 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${timerPct}%`,
          background: `linear-gradient(90deg, ${timerColor}, ${timerColor}bb)`,
          transition: 'width 1s linear, background 0.5s',
          boxShadow: `0 0 8px ${timerColor}88`,
        }} />
      </div>

      {/* Text display + hidden input */}
      <div style={{ position: 'relative' }} onClick={() => inputRef.current?.focus()}>
        <div style={{
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border)', borderRadius: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.88rem, 2.4vw, 1.05rem)',
          lineHeight: 2.2, letterSpacing: '0.02em',
          cursor: 'text', userSelect: 'none',
          minHeight: 120,
        }}>
          {renderText()}
        </div>
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onPaste={e => e.preventDefault()}
          onKeyDown={e => { if (e.ctrlKey && ['z', 'a', 'x'].includes(e.key)) e.preventDefault() }}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          style={{
            position: 'absolute', opacity: 0,
            top: 0, left: 0, width: '100%', height: '100%',
            resize: 'none', cursor: 'text',
            border: 'none', outline: 'none', background: 'transparent',
          }}
        />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', fontFamily: 'var(--font-mono)', margin: 0 }}>
        Haz clic en el texto si pierdes el foco · Pegar está bloqueado
      </p>
    </div>
  )

  // ══ RESULTS ══════════════════════════════════════════════════════════════════
  if (phase === 'results') {
    const t = tier(result?.score ?? 0)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem', padding: '1rem 0' }}>
        {isRecord && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#f59e0b',
            textShadow: '0 0 18px rgba(245,158,11,0.65)',
          }}>
            ★ ¡Nuevo récord personal! ★
          </div>
        )}

        {/* Score big */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(4rem, 14vw, 6rem)',
            fontFamily: 'var(--font-mono)', fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {result?.score ?? 0}
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
            puntos
          </div>
          <div style={{
            marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
            fontWeight: 700, color: t.color, textShadow: `0 0 10px ${t.color}55`,
          }}>
            {t.label}
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Velocidad',  value: `${result?.wpm ?? 0}`,       unit: 'WPM', color: 'var(--neon-cyan)' },
            { label: 'Precisión',  value: `${result?.accuracy ?? 0}`,   unit: '%',   color: (result?.accuracy ?? 0) >= 90 ? '#4ade80' : (result?.accuracy ?? 0) >= 70 ? '#f59e0b' : '#f87171' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{
              padding: '1.25rem 2.25rem', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: 14,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color, lineHeight: 1 }}>
                <span style={{ fontSize: '2.5rem' }}>{value}</span>
                <span style={{ fontSize: '1rem', marginLeft: '0.25rem', opacity: 0.7 }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={startGame} style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            border: 'none', borderRadius: 10, padding: '0.85rem 2.5rem',
            color: '#0a0a0f', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.05em',
          }}>
            ↺ Otra vez
          </button>
          <button onClick={() => setPhase('idle')} style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: 10,
            padding: '0.85rem 2rem', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)', fontSize: '0.9rem', cursor: 'pointer',
          }}>
            Ver puntuaciones
          </button>
        </div>
      </div>
    )
  }

  return null
}
