import { useTranslation } from '../i18n/I18nContext'
import { Laptop, Hospital, Coffee, ShoppingCart, Tag } from 'lucide-react'

export default function Experience() {
  const { t, lang } = useTranslation()

  const tagsByLang = {
    ayto:      lang === 'en' ? ['Web Development', 'Linux', 'Automation', 'Networking']
                : lang === 'de' ? ['Webentwicklung', 'Linux', 'Automatisierung', 'Netzwerke']
                : ['Desarrollo Web', 'Linux', 'Automatización', 'Redes'],
    ochoa:     lang === 'en' ? ['IT Infrastructure', 'High Availability', 'Networking', 'Incident Resolution']
                : lang === 'de' ? ['IT-Infrastruktur', 'Hochverfügbarkeit', 'Netzwerke', 'Störungsbehebung']
                : ['Infraestructura IT', 'Alta Disponibilidad', 'Redes', 'Resolución de Incidencias'],
    hosteleria: lang === 'en' ? ['Working Under Pressure', 'Multitasking', 'Direct Communication', 'Fast Resolution']
                : lang === 'de' ? ['Arbeiten unter Druck', 'Multitasking', 'Direkte Kommunikation', 'Schnelle Lösung']
                : ['Trabajo bajo Presión', 'Multitarea', 'Comunicación con el Usuario', 'Resolución Rápida'],
    mercadona: lang === 'en' ? ['Teamwork', 'Strict Processes', 'Attention to Detail', 'QA']
                : lang === 'de' ? ['Teamarbeit', 'Strenge Prozesse', 'Detailgenauigkeit', 'QA']
                : ['Trabajo en Equipo', 'Procesos Rigurosos', 'Atención al Detalle', 'QA'],
    alcampo:   lang === 'en' ? ['Adaptability', 'User Orientation', 'Prioritization', 'Teamwork']
                : lang === 'de' ? ['Anpassungsfähigkeit', 'Benutzerorientierung', 'Priorisierung', 'Teamarbeit']
                : ['Adaptabilidad', 'Orientación al Usuario', 'Priorización', 'Trabajo en Equipo'],
  }

  // Chronological order from newest to oldest
  const jobs = [
    {
      id: 'ayto',
      icon: <Laptop size={18} />,
      color: 'var(--neon-cyan)',
      period: t('experience', 'ayto_period'),
      role: t('experience', 'ayto_role'),
      company: t('experience', 'ayto_company'),
      desc: t('experience', 'ayto_desc'),
      tags: tagsByLang.ayto,
    },
    {
      id: 'ochoa',
      icon: <Hospital size={18} />,
      color: 'var(--neon-cyan)',
      period: t('experience', 'ochoa_period'),
      role: t('experience', 'ochoa_role'),
      company: t('experience', 'ochoa_company'),
      desc: t('experience', 'ochoa_desc'),
      tags: tagsByLang.ochoa,
    },
    {
      id: 'hosteleria',
      icon: <Coffee size={18} />,
      color: 'var(--neon-purple)',
      period: t('experience', 'hosteleria_period'),
      role: t('experience', 'hosteleria_role'),
      company: t('experience', 'hosteleria_company'),
      desc: t('experience', 'hosteleria_desc'),
      tags: tagsByLang.hosteleria,
    },
    {
      id: 'mercadona',
      icon: <ShoppingCart size={18} />,
      color: 'var(--neon-green)',
      period: t('experience', 'mercadona_period'),
      role: t('experience', 'mercadona_role'),
      company: t('experience', 'mercadona_company'),
      desc: t('experience', 'mercadona_desc'),
      tags: tagsByLang.mercadona,
    },
    {
      id: 'alcampo',
      icon: <Tag size={18} />,
      color: 'var(--neon-green)',
      period: t('experience', 'alcampo_period'),
      role: t('experience', 'alcampo_role'),
      company: t('experience', 'alcampo_company'),
      desc: t('experience', 'alcampo_desc'),
      tags: tagsByLang.alcampo,
    },
  ]

  return (
    <section id="experience" style={{ padding: 'var(--section-pad)', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>{t('experience', 'label')}</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>
            {t('experience', 'title')}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
            fontSize: '1rem',
            lineHeight: 1.7,
          }}>
            {t('experience', 'desc')}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="timeline-container">
          {jobs.map((job, index) => (
            <div key={job.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              {/* Center Node on Desktop, Left on Mobile */}
              <div className="timeline-node" style={{ borderColor: job.color, boxShadow: `0 0 15px ${job.color}66` }}>
                <div className="node-icon">{job.icon}</div>
              </div>

              {/* Content Card */}
              <div className="timeline-content card" style={{ padding: '1.2rem 1.5rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  [index % 2 === 0 ? 'right' : 'left']: '30px',
                  background: 'var(--bg-primary)',
                  padding: '0.2rem 1rem',
                  border: `1px solid ${job.color}`,
                  borderRadius: '20px',
                  color: job.color,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: `0 0 10px ${job.color}33`,
                  zIndex: 2,
                }} className="mobile-period-override">
                  {job.period}
                </div>

                <h3 style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  marginBottom: '0.15rem',
                  marginTop: '0.35rem',
                }}>
                  {job.company}
                </h3>
                
                <h4 style={{
                  color: job.color,
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.02em',
                }}>
                  {job.role}
                </h4>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: '1.55',
                  marginBottom: '0.75rem',
                }}>
                  {job.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.tags && job.tags.map(tag => (
                    <span key={tag} className="tag" style={{
                      color: job.color,
                      borderColor: `${job.color}40`,
                      background: `${job.color}11`
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* The vertical line */
        .timeline-container::after {
          content: '';
          position: absolute;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--border-hover), var(--neon-purple), transparent);
          top: 0;
          bottom: 0;
          left: 50%;
          margin-left: -1px;
        }

        .timeline-item {
          padding: 6px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
          margin-bottom: 0;
        }

        .timeline-item.left {
          left: 0;
        }

        .timeline-item.right {
          left: 50%;
        }

        .timeline-node {
          position: absolute;
          width: 44px;
          height: 44px;
          right: -22px;
          top: 15px;
          background-color: var(--bg-card);
          border: 2px solid;
          border-radius: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .timeline-item.right .timeline-node {
          left: -22px;
        }

        .node-icon {
          font-size: 1.2rem;
        }

        .timeline-content {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Mobile Adjustments */
        @media screen and (max-width: 768px) {
          .timeline-container::after {
            left: 31px;
          }
          
          .timeline-item {
            width: 100%;
            padding-left: 80px;
            padding-right: 15px;
          }
          
          .timeline-item.right {
            left: 0;
          }
          
          .timeline-item.left .timeline-node,
          .timeline-item.right .timeline-node {
            left: 9px;
            right: auto;
          }

          .mobile-period-override {
            left: 30px !important;
            right: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
