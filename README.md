<div align="center">

# ⚡ Portfolio & Lab

### Roberto García Delgado

**Portfolio personal · Laboratorio de herramientas · Self-hosted**

[![Web](https://img.shields.io/badge/🌐_Web-rgardel.es-00f0ff?style=for-the-badge&logoColor=white)](https://rgardel.es)
[![GitHub](https://img.shields.io/badge/GitHub-robertogd75-181717?style=for-the-badge&logo=github)](https://github.com/robertogd75)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Roberto_García-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/roberto-garcia-delgado-626b9430a)

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

</div>

---

## ¿Qué es esto?

Una SPA construida de cero en React 19 + Vite, desplegada en un servidor Ubuntu propio con Docker y Nginx. Incluye un sistema i18n multiidioma (ES / EN / DE), un laboratorio con 16 herramientas de desarrollo en el navegador, y un backend Node.js para el formulario de contacto y el chat IA.

---

## 🏗️ Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERNET (HTTPS)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ :443
                           ▼
              ┌────────────────────────┐
              │   Nginx Proxy Manager  │  SSL Termination
              │      (Cloudflare)      │  + Reverse Proxy
              └──────────┬─────────────┘
                         │
           ┌─────────────┴──────────────┐
           │                            │
           ▼ :8085                      ▼ (red interna)
  ┌─────────────────┐         ┌──────────────────────┐
  │   portfolio-    │  fetch  │   portfolio-mailer   │
  │    publico      │ ──────► │  (Express :3001)     │
  │  (Nginx + SPA)  │         │  Nodemailer + Groq   │
  └─────────────────┘         └──────────────────────┘
     React 19 / Vite                Node.js backend
```

> El contenedor `mailer` **no expone puertos al host**, solo es accesible desde la red Docker interna. Nginx actúa como proxy a `/api/`.

---

## 🗺️ Flujo de la aplicación

```
Usuario abre rgardel.es
        │
        ▼
    Nginx sirve index.html (SPA)
        │
        ▼
    React carga App.jsx
        │
        ├── I18nContext  ──► Detecta idioma del navegador (ES/EN/DE)
        ├── ChatContext  ──► Estado global del chat IA
        │
        └── React Router ──► Renderiza la página correspondiente
                │
                ├── / ──────── HomePage  (Hero + secciones)
                ├── /projects ─ ProjectsPage
                ├── /stack ─── StackPage
                ├── /experience ExperiencePage
                ├── /lab ───── LabPage (16 herramientas)
                └── /contact ─ ContactPage
                                    │
                                    ▼
                             POST /api/contact
                                    │
                              portfolio-mailer
                              (Nodemailer → Gmail)
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| **Frontend** | React 19 + Vite 7 | SPA, sin SSR |
| **Animaciones** | framer-motion | Componentes animados |
| **Iconos** | lucide-react | SVG tree-shakeable |
| **Estilos** | CSS puro + variables CSS | Design system propio, sin Tailwind |
| **i18n** | Sistema propio | `I18nContext` + `translations.js` |
| **Mailer** | Express + Nodemailer | Gmail App Password |
| **IA** | Groq API | Chat contextual del portfolio |
| **Servidor web** | Nginx | SPA fallback + proxy a mailer |
| **Contenedores** | Docker + Compose | Multi-stage build |
| **Infraestructura** | Ubuntu Server self-hosted | Portainer, SSL, Cloudflare |

---

## 📁 Estructura del proyecto

```
portfolio-publico/
│
├── 📦 src/
│   ├── App.jsx                      ← Enrutamiento + layout raíz
│   ├── index.css                    ← Design system (variables CSS, reset)
│   │
│   ├── 🧩 components/
│   │   ├── Navbar.jsx               ← Sticky, blur, lang switcher, menú móvil
│   │   ├── Hero.jsx                 ← Typewriter + ConstellationBackground
│   │   ├── TechStack.jsx            ← 25+ techs en 4 categorías
│   │   ├── About.jsx                ← 3 tarjetas de presentación
│   │   ├── Experience.jsx           ← Timeline laboral
│   │   ├── Performance.jsx          ← Métricas del servidor en vivo
│   │   ├── Achievements.jsx         ← 6 hitos técnicos
│   │   ├── Contact.jsx              ← Footer + links sociales
│   │   ├── AiChatSection.jsx        ← Chat IA (Groq)
│   │   ├── ChatWidget.jsx           ← Widget flotante
│   │   ├── ChatContext.jsx          ← Estado global del chat
│   │   └── 🔬 lab/                  ← 16 herramientas de desarrollo
│   │       ├── ApiExplorer.jsx      ← Cliente REST en el navegador
│   │       ├── Base64Tool.jsx       ← Codificador / decodificador
│   │       ├── ColorBlindSimulator.jsx
│   │       ├── ColorPalette.jsx
│   │       ├── CssConverter.jsx
│   │       ├── HashGenerator.jsx    ← MD5, SHA-1, SHA-256...
│   │       ├── HtmlPreviewer.jsx
│   │       ├── ImageStudio.jsx
│   │       ├── JsonFormatter.jsx
│   │       ├── MarkdownPreviewer.jsx
│   │       ├── PasswordGen.jsx
│   │       ├── QrGenerator.jsx
│   │       ├── SpeedTest.jsx
│   │       ├── SvgEditor.jsx
│   │       ├── TypingTest.jsx
│   │       └── WordCounter.jsx
│   │
│   ├── 📄 pages/
│   │   ├── HomePage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── StackPage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── LabPage.jsx
│   │   └── ContactPage.jsx
│   │
│   └── 🌍 i18n/
│       ├── I18nContext.jsx          ← Context API + hook useTranslation()
│       └── translations.js         ← Textos en ES / EN / DE
│
├── 📬 mailer/
│   ├── index.js                    ← Express + Nodemailer + Groq AI
│   ├── package.json
│   └── Dockerfile
│
├── 🌐 public/api/v1/
│   ├── cars.json                   ← API mock para el ApiExplorer
│   └── brands.json
│
├── Dockerfile                      ← Multi-stage: Node build → Nginx serve
├── docker-compose.yml              ← Orquesta portfolio + mailer
├── nginx.conf                      ← SPA fallback + proxy a /api/
└── package.json
```

---

## 🚀 Puesta en marcha

### 1. Variables de entorno

Crea un `.env` en la raíz a partir del ejemplo:

```bash
cp .env.example .env
```

```env
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASS=tu_app_password   # Google → Seguridad → Contraseñas de app
GROQ_API_KEY=tu_api_key_groq     # console.groq.com
```

### 2. Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 3. Producción con Docker

```bash
docker compose up -d --build
```

| Contenedor | Puerto externo | Descripción |
|-----------|---------------|-------------|
| `portfolio-publico` | `8085` | SPA servida por Nginx |
| `portfolio-mailer` | — (red interna) | API de contacto + chat IA |

### 4. Build estático

```bash
npm run build   # genera dist/
npm run preview # previsualiza en localhost:4173
```

---

## 🎨 Design system

La paleta y tipografía se definen en `:root` dentro de `index.css`:

```
  ┌──────────────────────────────────────────────┐
  │  Fondo base       #0a0a0f  ██████████████░░  │
  │  Acento primario  #00f0ff  ░░░░░░░░░░████░░  │ ← Neon Cyan
  │  Acento secundario #a855f7 ░░░░░░░░░░████░░  │ ← Neon Purple
  │  Texto primario   #f1f5f9                    │
  │  Texto secundario #94a3b8                    │
  └──────────────────────────────────────────────┘
```

---

## 📋 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR  → :5173
npm run build    # Build optimizado para producción → dist/
npm run preview  # Previsualiza el build local      → :4173
npm run lint     # Análisis estático con ESLint
```

---

## 📦 Dependencias principales

```
dependencies
├── react@19              → UI
├── react-dom@19          → DOM renderer
├── react-router-dom@7    → Enrutamiento SPA
├── framer-motion@12      → Animaciones
├── lucide-react          → Iconos SVG
└── qrcode                → Generación de QR (Lab)

devDependencies
├── vite@7                → Bundler + dev server
├── @vitejs/plugin-react  → Fast Refresh
└── eslint@9              → Linting
```

---

<div align="center">

**Hecho con ☕ y muchas horas de terminal por Roberto García Delgado**

[![rgardel.es](https://img.shields.io/badge/🌐-rgardel.es-00f0ff?style=flat-square)](https://rgardel.es)

</div>
