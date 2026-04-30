import express   from 'express'
import nodemailer from 'nodemailer'
import rateLimit  from 'express-rate-limit'

const { GMAIL_USER, GMAIL_APP_PASS, GROQ_API_KEY, PORT = '3001' } = process.env

if (!GMAIL_USER || !GMAIL_APP_PASS) {
  console.error('[mailer] ERROR: GMAIL_USER and GMAIL_APP_PASS environment variables are required.')
  process.exit(1)
}

const app = express()

// Trust the Nginx reverse proxy so rate-limiting uses the real client IP
app.set('trust proxy', 1)

// Only accept JSON bodies up to 20 KB
app.use(express.json({ limit: '20kb' }))

// Rate limit: 5 messages per IP per hour to prevent abuse
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in an hour.' },
})

// Rate limit for AI chat: 20 messages per IP per hour
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

const SYSTEM_PROMPT = `You are an AI assistant embedded in Roberto García Delgado's personal portfolio website (rgardel.es).
Your ONLY job is to answer questions about Roberto, his skills, projects, experience, and this website.
You MUST NOT answer questions unrelated to Roberto or this website. If asked something unrelated, politely redirect the conversation back.
Always respond in the same language the user writes in (Spanish, English, or German).
Be concise, friendly and professional. Keep responses under 150 words unless more detail is clearly needed.

--- ROBERTO'S PROFILE ---
Full name: Roberto García Delgado
Education: DAW (Desarrollo de Aplicaciones Web) — IES Salduba, Málaga. Recently graduated.
Languages: Spanish (native), English Cambridge B2 (2022)
Location: Málaga, Spain. Open to remote work.
Domain / Portfolio: rgardel.es
LinkedIn: linkedin.com/in/roberto-garcia-delgado-626b9430a
GitHub: github.com/robertogd75

--- TECH STACK ---
Frontend: React 19, Next.js 15, Inertia.js, JavaScript ES6+, HTML5, CSS3, Bootstrap
Backend: Java, Spring Boot, PHP, Laravel 10, Symfony
Databases: SQL, MariaDB, PostgreSQL, MySQL, WordPress
DevOps & Infrastructure: Ubuntu Server, Docker, Portainer, Nginx Proxy Manager, Apache, AWS, Cloudflare, Git, GitHub
This portfolio is built with React 19 + Vite 7, self-hosted on his own server with Docker and Nginx, with SSL.

--- PROJECTS ---
1. Marbella Fácil
   Category: SaaS Platform
   Description: Comprehensive SaaS platform for intelligent tourism in Marbella. Laravel 10 backend with React + Inertia.js SPA architecture. Dynamic subscription management, real-time booking system and weather monitoring.
   Tech: Laravel 10, React, Inertia.js, MySQL, SaaS
   Status: Live (in production). Developed together with a colleague.

2. Sistema de Vados (Vados System)
   Category: Enterprise App
   Description: Enterprise solution for parking permit management at Marbella City Hall. Complex business logic, audit systems, intranet deployment and Active Directory (LDAP) integration.
   Tech: PHP, PostgreSQL, LDAP, Intranet
   Status: Live (private — deployed on the city hall intranet). Developed together with a colleague.

3. Portfolio & Lab (this website)
   Category: Portfolio & Lab
   Description: Roberto's personal portfolio and tools laboratory. React 19 + Vite SPA, self-hosted with Docker and Nginx, i18n in ES/EN/DE, 16 lab tools, Node.js contact backend.
   Tech: React 19, Vite, Docker, Nginx, Node.js
   Status: Live. GitHub: github.com/robertogd75 | Demo: rgardel.es

--- EXPERIENCE ---
- Ayuntamiento de Marbella (IT Department): Developed and deployed real enterprise systems, including the Sistema de Vados.
- Hospital Ochoa (Marbella): Related IT work.
- Also has hospitality, Mercadona and Alcampo experience (non-tech, during studies).

--- ABOUT THIS WEBSITE ---
Pages / Sections: Hero, TechStack (25+ technologies in 4 categories), About, Experience, Performance (server stats), Achievements, Projects, Lab, Contact.
Lab tools (16): API Explorer, Base64 Tool, Color Blind Simulator, Color Palette, CSS Converter, Hash Generator, HTML Previewer, Image Studio, JSON Formatter, Markdown Previewer, Password Generator, QR Generator, Speed Test, SVG Editor, Typing Test, Word Counter.
The site is multilingual: Spanish, English, German.
Infrastructure: self-hosted on Ubuntu Server, Docker, Portainer, Nginx Proxy Manager, SSL via Cloudflare.

--- CONTACT ---
Contact form: rgardel.es/contact
LinkedIn: linkedin.com/in/roberto-garcia-delgado-626b9430a
GitHub: github.com/robertogd75`

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
})

function sanitize(val, maxLen) {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, maxLen)
}

app.post('/api/contact', limiter, async (req, res) => {
  const name    = sanitize(req.body?.name,    80)
  const email   = sanitize(req.body?.email,   120)
  const subject = sanitize(req.body?.subject, 150)
  const message = sanitize(req.body?.message, 2000)

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  // Honeypot check: if 'fax' is filled, it's likely a bot.
  // We return 200 OK to trick the bot into thinking it succeeded.
  if (req.body?.fax) {
    console.warn('[mailer] Honeypot triggered by IP:', req.ip)
    return res.json({ ok: true })
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  try {
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${GMAIL_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to:      GMAIL_USER,
      subject: `[Portfolio] ${subject}`,
      // Plain text only — no HTML to avoid injection concerns
      text:    `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[mailer] sendMail error:', err.message)
    res.status(500).json({ error: 'Failed to send email. Please try again later.' })
  }
})

app.post('/api/chat', chatLimiter, async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(503).json({ error: 'Chat service not configured.' })
  }

  const rawMessage = req.body?.message
  const message = typeof rawMessage === 'string' ? rawMessage.trim().slice(0, 500) : ''
  if (!message) return res.status(400).json({ error: 'Message is required.' })

  // Accept up to last 6 turns of history for context
  const rawHistory = Array.isArray(req.body?.history) ? req.body.history : []
  const history = rawHistory
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6)
    .map(m => ({ role: m.role, content: m.content.slice(0, 500) }))

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message },
  ]

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 350,
        temperature: 0.4,
      }),
    })
    if (!groqRes.ok) throw new Error(`Groq API error: ${groqRes.status}`)
    const data = await groqRes.json()
    const reply = data.choices?.[0]?.message?.content?.trim() ?? ''
    res.json({ reply })
  } catch (err) {
    console.error('[chat] error:', err.message)
    res.status(500).json({ error: 'Failed to get a response. Please try again.' })
  }
})

app.listen(Number(PORT), () => console.log(`[mailer] Listening on port ${PORT}`))
