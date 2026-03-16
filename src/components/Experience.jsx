import { useTranslation } from '../i18n/I18nContext'

export default function Experience() {
  const { t, lang } = useTranslation()

  // Chronological order from newest to oldest
  const jobs = [
    {
      id: 'ayto',
      icon: '💻',
      color: 'var(--neon-cyan)',
      period: t('experience', 'jobs.ayto.period'),
      role: t('experience', 'jobs.ayto.role'),
      company: t('experience', 'jobs.ayto.company'),
      desc: t('experience', 'jobs.ayto.desc'),
      tags: (() => {
        // Fallback or specific tags based on language (the translation file returns an array)
        try {
          const trans = t('experience', 'jobs.ayto.tags')
          return Array.isArray(trans) ? trans : ['SysAdmin', 'L2 Support']
        } catch(e) { return ['SysAdmin', 'L2 Support'] }
      })()
    },
    {
      id: 'ochoa',
      icon: '🏥',
      color: 'var(--neon-cyan)',
      period: t('experience', 'jobs.ochoa.period'),
      role: t('experience', 'jobs.ochoa.role'),
      company: t('experience', 'jobs.ochoa.company'),
      desc: t('experience', 'jobs.ochoa.desc'),
      tags: (() => {
        try {
          const trans = t('experience', 'jobs.ochoa.tags')
          return Array.isArray(trans) ? trans : ['High Availability', 'Hardware']
        } catch(e) { return ['High Availability', 'Hardware'] }
      })()
    },
    {
      id: 'hosteleria',
      icon: '☕',
      color: 'var(--neon-purple)',
      period: t('experience', 'jobs.hosteleria.period'),
      role: t('experience', 'jobs.hosteleria.role'),
      company: t('experience', 'jobs.hosteleria.company'),
      desc: t('experience', 'jobs.hosteleria.desc'),
      tags: (() => {
        try {
          const trans = t('experience', 'jobs.hosteleria.tags')
          return Array.isArray(trans) ? trans : ['Stress Management', 'Decision Making']
        } catch(e) { return ['Stress Management', 'Decision Making'] }
      })()
    },
    {
      id: 'mercadona',
      icon: '🛒',
      color: 'var(--neon-green)',
      period: t('experience', 'jobs.mercadona.period'),
      role: t('experience', 'jobs.mercadona.role'),
      company: t('experience', 'jobs.mercadona.company'),
      desc: t('experience', 'jobs.mercadona.desc'),
      tags: (() => {
        try {
          const trans = t('experience', 'jobs.mercadona.tags')
          return Array.isArray(trans) ? trans : ['Logistics', 'Teamwork']
        } catch(e) { return ['Logistics', 'Teamwork'] }
      })()
    },
    {
      id: 'alcampo',
      icon: '🏷️',
      color: 'var(--neon-green)',
      period: t('experience', 'jobs.alcampo.period'),
      role: t('experience', 'jobs.alcampo.role'),
      company: t('experience', 'jobs.alcampo.company'),
      desc: t('experience', 'jobs.alcampo.desc'),
      tags: (() => {
        try {
          const trans = t('experience', 'jobs.alcampo.tags')
          return Array.isArray(trans) ? trans : ['Adaptability', 'Customer Support']
        } catch(e) { return ['Adaptability', 'Customer Support'] }
      })()
    }
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
              <div className="timeline-content card" style={{ padding: '1.8rem', position: 'relative' }}>
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
                  fontSize: '1.25rem',
                  marginBottom: '0.25rem',
                  marginTop: '0.5rem',
                }}>
                  {job.company}
                </h3>
                
                <h4 style={{
                  color: job.color,
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  letterSpacing: '0.02em',
                }}>
                  {job.role}
                </h4>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.65',
                  marginBottom: '1.5rem',
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
          padding: 10px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
          margin-bottom: 2rem;
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
