import { useTranslation } from '../i18n/I18nContext'

export default function About() {
  const { t } = useTranslation()

  const highlights = [
    {
      icon: '🧠',
      title: t('about', 'card1_title'),
      color: '#00f0ff',
      glow: 'rgba(0,240,255,0.1)',
      body: t('about', 'card1_body'),
    },
    {
      icon: '🌍',
      title: t('about', 'card2_title'),
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.1)',
      body: t('about', 'card2_body'),
    },
    {
      icon: '⚡',
      title: t('about', 'card3_title'),
      color: '#39ff14',
      glow: 'rgba(57,255,20,0.1)',
      body: t('about', 'card3_body'),
    },
  ]
  return (
    <section id="about" style={{ padding: 'var(--section-pad)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Bio column */}
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>{t('about', 'label')}</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              marginBottom: '1.5rem',
            }}>
              {t('about', 'title_start')}<br />
              <span className="neon-text">{t('about', 'title_neon')}</span>
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              fontSize: '1rem',
              marginBottom: '1.25rem',
            }}>
              {t('about', 'p1')}
            </p>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              fontSize: '1rem',
              marginBottom: '2rem',
            }}>
              {t('about', 'p2')}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                'Full Stack',
                <span key="daw" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <img src="/SVG/spain.svg" alt="ES" style={{ width: 14, height: 10, borderRadius: 2 }} />
                  DAW · IES Salduba
                </span>,
                <span key="b2" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <img src="/SVG/uk.svg" alt="UK" style={{ width: 14, height: 10, borderRadius: 2 }} />
                  B2 Cambridge
                </span>,
                'Docker',
                'REST APIs',
                'Open to Remote'
              ].map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Highlight cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {highlights.map(h => (
              <div
                key={h.title}
                className="card"
                style={{
                  padding: '1.4rem 1.5rem',
                  background: `linear-gradient(135deg, ${h.glow}, var(--bg-card))`,
                  borderColor: h.color + '33',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <span style={{
                    fontSize: '1.6rem',
                    flexShrink: 0,
                    filter: 'drop-shadow(0 0 8px currentColor)',
                  }}>{h.icon}</span>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: h.color,
                      marginBottom: '0.45rem',
                    }}>{h.title}</div>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.65,
                    }}>{h.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
