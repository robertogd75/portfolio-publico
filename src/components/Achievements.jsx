import { useTranslation } from '../i18n/I18nContext'

export default function Achievements() {
  const { t } = useTranslation()

  const milestones = [
    {
      period: '2023 — 2025',
      label: 'DAW · IES Salduba',
      color: 'var(--neon-cyan)',
      items: [
        {
          title: t('achievements', 'card1_title'),
          desc: t('achievements', 'card1_desc'),
        },
        {
          title: t('achievements', 'card2_title'),
          desc: t('achievements', 'card2_desc'),
        },
        {
          title: t('achievements', 'card3_title'),
          desc: t('achievements', 'card3_desc'),
        },
        {
          title: t('achievements', 'card4_title'),
          desc: t('achievements', 'card4_desc'),
        },
        {
          title: t('achievements', 'card5_title'),
          desc: t('achievements', 'card5_desc'),
        },
        {
          title: t('achievements', 'card6_title'),
          desc: t('achievements', 'card6_desc'),
        },
      ],
    },
  ]
  return (
    <section id="achievements" style={{ padding: 'var(--section-pad)' }}>
      <div className="container">
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>{t('achievements', 'label')}</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>
          {t('achievements', 'title')}
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: 520,
          fontSize: '1rem',
          marginBottom: '3rem',
          lineHeight: 1.7,
        }}>
          {t('achievements', 'desc')}
        </p>

        {milestones.map(block => (
          <div key={block.period}>
            {/* Period header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: block.color,
                background: `${block.color}15`,
                border: `1px solid ${block.color}33`,
                padding: '0.3rem 0.8rem',
                borderRadius: 6,
                whiteSpace: 'nowrap',
              }}>{block.period}</div>
              <div style={{
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <img src="/SVG/spain.svg" alt="ES" style={{ width: 14, height: 10, borderRadius: 2 }} />
                {block.label}
              </div>
            </div>

            {/* Grid of milestone cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {block.items.map((item, i) => (
                <div key={item.title} className="card" style={{ padding: '1.4rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: 8,
                      background: `${block.color}15`,
                      border: `1px solid ${block.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: block.color,
                      flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                    }}>{item.title}</div>
                  </div>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    lineHeight: 1.65,
                  }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
