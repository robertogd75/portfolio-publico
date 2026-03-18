import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext'

const icons = {
  React: '/SVG/react.svg',
  NextJS: '/SVG/nextblanco.svg',
  InertiaJS: '/SVG/laravel.svg',
  JavaScript: '/SVG/javascript.svg',
  HTML5: '/SVG/html5.svg',
  CSS3: '/SVG/css3.svg',
  Java: '/SVG/java.svg',
  PHP: '/SVG/php.svg',
  SpringBoot: '/SVG/bootstrap.svg',
  Laravel: '/SVG/laravel.svg',
  Symfony: '/SVG/symfonyblanco.svg',
  SQL: '/SVG/mysql.svg',
  MariaDB: '/SVG/mariadb.svg',
  WordPress: '/SVG/wordpressblanco.svg',
  Git: '/SVG/git.svg',
  Docker: '/SVG/docker.svg',
  Portainer: '/SVG/portainer.svg',
  AWS: '/SVG/awsblanco.svg',
  Apache: '/SVG/apache.svg',
  Bootstrap: '/SVG/bootstrap.svg',
  Cloudflare: '/SVG/cloudflare.svg',
  GitHub: '/SVG/githubblanco.svg',
  Nginx: '/SVG/nginx.svg',
  PostgreSQL: '/SVG/postgresql.svg',
  Ubuntu: '/SVG/ubuntu.svg',
}

const categories = [
  {
    name: 'Frontend',
    color: '#61DAFB',
    glow: 'rgba(97,218,251,0.15)',
    techs: [
      { key: 'React', name: 'React', desc: 'UIs reactivas y SPAs de alta interactividad' },
      { key: 'NextJS', name: 'Next.js', desc: 'SSR, SSG y rutas de API en producción' },
      { key: 'InertiaJS', name: 'Inertia.js', desc: 'Monolitos modernos con Laravel + React' },
      { key: 'JavaScript', name: 'JavaScript ES6+', desc: 'Lógica de negocio, async/await, módulos' },
      { key: 'HTML5', name: 'HTML5', desc: 'Markup semántico, Web APIs nativas' },
      { key: 'CSS3', name: 'CSS3', desc: 'Layouts avanzados, animaciones, variables' },
      { key: 'Bootstrap', name: 'Bootstrap', desc: 'Sistemas de grid y UIs preparadas' },
    ],
  },
  {
    name: 'Backend & Logic',
    color: '#F9322C',
    glow: 'rgba(249,50,44,0.12)',
    techs: [
      { key: 'Java', name: 'Java', desc: 'Aplicaciones robustas y orientadas a objetos' },
      { key: 'PHP', name: 'PHP', desc: 'APIs REST y lógica de servidor eficiente' },
      { key: 'SpringBoot', name: 'Spring Boot', desc: 'Microservicios empresariales y APIs REST' },
      { key: 'Laravel', name: 'Laravel', desc: 'Backends MVC, autenticación, colas, ORM' },
      { key: 'Symfony', name: 'Symfony', desc: 'Arquitectura modular y componentes reutilizables' },
    ],
  },
  {
    name: 'Data & CMS',
    color: '#00758F',
    glow: 'rgba(0,117,143,0.15)',
    techs: [
      { key: 'SQL', name: 'SQL', desc: 'Consultas optimizadas, joins, índices, vistas' },
      { key: 'MariaDB', name: 'MariaDB', desc: 'Gestión y administración concurrente' },
      { key: 'PostgreSQL', name: 'PostgreSQL', desc: 'Modelado relacional y objetos orientados' },
      { key: 'WordPress', name: 'WordPress', desc: 'CMS con themes custom y desarrollo de plugins' },
    ],
  },
  {
    name: 'DevOps & Infra',
    color: '#2496ED',
    glow: 'rgba(36,150,237,0.15)',
    techs: [
      { key: 'Ubuntu', name: 'Ubuntu Server', desc: 'Administración de servidores Linux' },
      { key: 'Docker', name: 'Docker', desc: 'Contenedores, compose y entornos reproducibles' },
      { key: 'Portainer', name: 'Portainer', desc: 'Gestor visual de stacks y contenedores' },
      { key: 'Nginx', name: 'Nginx Proxy Manager', desc: 'Reverse proxy, gestión de certificados SSL/TLS' },
      { key: 'Apache', name: 'Apache HTTP', desc: 'Configuración y hosting de servidores web' },
      { key: 'AWS', name: 'AWS', desc: 'Infraestructura cloud, EC2, S3' },
      { key: 'Cloudflare', name: 'Cloudflare', desc: 'Gestión DNS, WAF y caché (CDN)' },
      { key: 'Git', name: 'Git', desc: 'Versionado de código y control de ramas' },
      { key: 'GitHub', name: 'GitHub', desc: 'Colaboración, code reviews y almacenamiento' },
    ],
  },
]

function TechCard({ tItem, color, glow }) {
  const [hovered, setHovered] = useState(false)
  const iconPath = icons[tItem.key]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${glow}, var(--bg-card-opaque))`
          : 'var(--bg-card)',
        border: `1px solid ${hovered ? color + '55' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        cursor: 'default',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 20px ${glow}` : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {iconPath ? (
          <img src={iconPath} alt={tItem.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ width: 24, height: 24, background: 'var(--text-muted)', borderRadius: 2 }} />
        )}
      </div>
      <div>
        <div style={{
          fontWeight: 600,
          fontSize: '0.85rem',
          color: hovered ? color : 'var(--text-primary)',
          transition: 'color 0.2s',
          marginBottom: '0.2rem',
        }}>{tItem.name}</div>
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>{tItem.desc}</div>
      </div>
    </div>
  )
}

export default function TechStack() {
  const { t } = useTranslation()

  return (
    <section id="techstack" style={{ padding: 'var(--section-pad)', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">{t('techstack', 'label')}</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{t('techstack', 'title')}</h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0.5rem auto 0',
            lineHeight: 1.6,
          }}>
            {t('techstack', 'desc')}
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {categories.map(cat => {
            const keyMap = {
              'Frontend': 'frontend',
              'Backend & Logic': 'backend',
              'Data & CMS': 'data',
              'DevOps & Infra': 'devops',
            }
            const translatedName = t('techstack', keyMap[cat.name] || cat.name.toLowerCase())

            return (
              <div key={cat.name}>
                {/* Category label */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: cat.color,
                    boxShadow: `0 0 10px ${cat.color}`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: cat.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>{translatedName}</span>
                  <div style={{
                    flex: 1, height: 1,
                    background: `linear-gradient(to right, ${cat.color}33, transparent)`,
                  }} />
                </div>

                {/* Cards grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '0.85rem',
                }}>
                  {cat.techs.map(tItem => (
                    <TechCard
                      key={tItem.key}
                      tItem={tItem}
                      color={cat.color}
                      glow={cat.glow}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
