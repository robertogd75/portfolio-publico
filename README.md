# Portfolio & Lab — Roberto García Delgado

Portfolio personal y laboratorio de herramientas, desplegado en [rgardel.es](https://rgardel.es).

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React 19, Vite 7, framer-motion, lucide-react |
| Estilos | CSS puro con design system en variables CSS (sin Tailwind) |
| i18n | Sistema propio — español, inglés y alemán |
| Mailer | Node.js (Express) + Nodemailer + Groq AI |
| Despliegue | Docker, Nginx, Ubuntu Server self-hosted |

---

## Estructura del proyecto

```
portfolio-publico/
├── src/
│   ├── App.jsx                  # Enrutamiento y layout principal
│   ├── main.jsx
│   ├── index.css                # Design system (variables CSS, reset)
│   ├── components/
│   │   ├── Navbar.jsx           # Navbar sticky con blur, idiomas y menú móvil
│   │   ├── Hero.jsx             # Typewriter effect, stats, ConstellationBackground
│   │   ├── TechStack.jsx        # 25+ tecnologías en 4 categorías
│   │   ├── About.jsx            # 3 tarjetas de presentación
│   │   ├── Experience.jsx       # Timeline de experiencia laboral
│   │   ├── Performance.jsx      # Métricas del servidor self-hosted
│   │   ├── Achievements.jsx     # 6 hitos técnicos
│   │   ├── Contact.jsx          # CTA + footer con links sociales
│   │   ├── AiChatSection.jsx    # Chat IA con Groq
│   │   ├── ChatWidget.jsx       # Widget flotante de chat
│   │   ├── ChatContext.jsx      # Contexto global del chat
│   │   ├── ConstellationBackground.jsx
│   │   └── lab/                 # 16 herramientas interactivas
│   │       ├── ApiExplorer.jsx
│   │       ├── Base64Tool.jsx
│   │       ├── ColorBlindSimulator.jsx
│   │       ├── ColorPalette.jsx
│   │       ├── CssConverter.jsx
│   │       ├── HashGenerator.jsx
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
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── StackPage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── LabPage.jsx
│   │   └── ContactPage.jsx
│   └── i18n/
│       ├── I18nContext.jsx      # Context + hook useTranslation()
│       └── translations.js     # Traducciones ES / EN / DE
├── mailer/
│   ├── index.js                # Servidor Express + Nodemailer + Groq AI
│   ├── package.json
│   └── Dockerfile
├── public/
│   └── api/v1/
│       ├── cars.json           # API mock — coches
│       └── brands.json         # API mock — marcas
├── Dockerfile                  # Multi-stage build (Node build + Nginx serve)
├── docker-compose.yml          # Orquestación portfolio + mailer
├── nginx.conf                  # SPA fallback + proxy inverso al mailer
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Secciones de la web

- **Hero** — presentación con efecto typewriter y fondo de constelaciones animado
- **Tech Stack** — 25+ tecnologías organizadas en 4 categorías
- **About** — Problem Solving · Cambridge B2 · Battle-Tested
- **Experience** — timeline de trabajos (Ayto. Marbella, Hospital Ochoa, Mercadona, Alcampo...)
- **Performance** — métricas del servidor en producción (uptime, Docker, Portainer, SSL)
- **Achievements** — 6 hitos técnicos destacados
- **Projects** — tarjetas de proyectos reales con enlaces a GitHub y web
- **Lab** — 16 herramientas de desarrollo en el navegador
- **Contact** — formulario de contacto con backend de correo y chat IA

---

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables (necesarias para el servicio mailer):

```env
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASS=tu_app_password
GROQ_API_KEY=tu_api_key_groq
```

---

## Puesta en marcha

### Desarrollo local

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`.

### Producción con Docker

```bash
docker compose up -d --build
```

Esto levanta dos contenedores:
- **portfolio-publico** — SPA servida por Nginx en el puerto `8085`
- **portfolio-mailer** — API de correo/chat IA en el puerto `3001` (solo accesible dentro de la red Docker)

### Build estático

```bash
npm run build
```

El resultado se genera en `dist/`.

---

## Paleta de colores (design system)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg-base` | `#0a0a0f` | Fondo principal |
| `--neon-cyan` | `#00f0ff` | Acento primario |
| `--neon-purple` | `#a855f7` | Acento secundario |

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build optimizado para producción |
| `npm run preview` | Previsualiza el build local |
| `npm run lint` | Análisis de código con ESLint |

---

## Autor

**Roberto García Delgado** — DAW · Málaga  
[rgardel.es](https://rgardel.es) · [GitHub](https://github.com/robertogd75) · [LinkedIn](https://linkedin.com/in/roberto-garcia-delgado-626b9430a)
