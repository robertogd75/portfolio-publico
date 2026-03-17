import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

const BASE_URL = 'https://rgardel.es'

const ENDPOINTS = [
  { id: 'cars',   method: 'GET', path: '/api/v1/cars.json' },
  { id: 'brands', method: 'GET', path: '/api/v1/brands.json' },
]

const ENDPOINTS_I18N = {
  cars: {
    es: {
      title: 'Listar vehículos',
      description:
        'Devuelve el listado completo de modelos de vehículos con información detallada. ' +
        'Incluye marca, modelo, año de inicio/fin, tipo de carrocería, segmento por clase, ' +
        'país de origen y tipos de combustible disponibles.',
      returns: 'Array de objetos con campos: id, make_id, make, model, year_start, year_end, type, segment, origin, fuel[]',
      note: 'El campo year_end es null si el modelo sigue en producción.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/cars.json')
const data = await res.json()
// Filtrar eléctricos en cliente:
const ev = data.data.filter(c => c.fuel.includes('electric'))
console.log(ev.length, 'vehículos eléctricos')`,
    },
    en: {
      title: 'List vehicles',
      description:
        'Returns the complete list of vehicle models with detailed information. ' +
        'Includes make, model, start/end year, body type, class segment, ' +
        'country of origin, and available fuel types.',
      returns: 'Array of objects with fields: id, make_id, make, model, year_start, year_end, type, segment, origin, fuel[]',
      note: 'The year_end field is null if the model is still in production.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/cars.json')
const data = await res.json()
// Filter electric vehicles client-side:
const ev = data.data.filter(c => c.fuel.includes('electric'))
console.log(ev.length, 'electric vehicles')`,
    },
    de: {
      title: 'Fahrzeuge auflisten',
      description:
        'Gibt die vollständige Liste der Fahrzeugmodelle mit detaillierten Informationen zurück. ' +
        'Enthält Marke, Modell, Start-/Endjahr, Karosserietyp, Klassensegment, ' +
        'Herkunftsland und verfügbare Kraftstoffarten.',
      returns: 'Array von Objekten mit Feldern: id, make_id, make, model, year_start, year_end, type, segment, origin, fuel[]',
      note: 'Das Feld year_end ist null, wenn das Modell noch produziert wird.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/cars.json')
const data = await res.json()
// Elektrofahrzeuge clientseitig filtern:
const ev = data.data.filter(c => c.fuel.includes('electric'))
console.log(ev.length, 'Elektrofahrzeuge')`,
    },
  },
  brands: {
    es: {
      title: 'Listar marcas',
      description:
        'Devuelve el catálogo de marcas de vehículos disponibles en la base de datos, ' +
        'incluyendo país de origen, código ISO y año de fundación.',
      returns: 'Array de objetos con campos: id, name, country, country_code, founded',
      note: 'country_code sigue el estándar ISO 3166-1 alpha-2.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/brands.json')
const data = await res.json()
// Mostrar marcas europeas:
const eu = data.data.filter(b => ['DE','FR','ES'].includes(b.country_code))
console.log(eu.map(b => b.name))`,
    },
    en: {
      title: 'List brands',
      description:
        'Returns the catalog of vehicle brands available in the database, ' +
        'including country of origin, ISO code, and year of foundation.',
      returns: 'Array of objects with fields: id, name, country, country_code, founded',
      note: 'country_code follows the ISO 3166-1 alpha-2 standard.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/brands.json')
const data = await res.json()
// Show European brands:
const eu = data.data.filter(b => ['DE','FR','ES'].includes(b.country_code))
console.log(eu.map(b => b.name))`,
    },
    de: {
      title: 'Marken auflisten',
      description:
        'Gibt den Katalog der in der Datenbank verfügbaren Fahrzeugmarken zurück, ' +
        'einschließlich Herkunftsland, ISO-Code und Gründungsjahr.',
      returns: 'Array von Objekten mit Feldern: id, name, country, country_code, founded',
      note: 'country_code folgt dem Standard ISO 3166-1 alpha-2.',
      example:
`const res  = await fetch('${BASE_URL}/api/v1/brands.json')
const data = await res.json()
// Europäische Marken anzeigen:
const eu = data.data.filter(b => ['DE','FR','ES'].includes(b.country_code))
console.log(eu.map(b => b.name))`,
    },
  },
}

const API_UI = {
  es: {
    returns: 'Devuelve',
    note: 'Nota',
    exampleLabel: 'Ejemplo JavaScript',
    copy: 'Copiar',
    copied: '✓ Copiado',
    execute: '▶  Ejecutar',
    executing: '⟳  Ejecutando...',
    openRaw: '↗ Abrir raw JSON',
    badges: ['v1.0', 'CORS', 'Sin auth', 'JSON', 'Free'],
    overview: 'API pública de vehículos construida y alojada en este mismo servidor self-hosted. Acceso completamente libre — sin API key, sin registro, sin rate limit. Datos filtrados desde el cliente. Perfecta para demos, prototipos y practicar fetch.',
    recordsWord: 'registros',
    moreRecords: (n) => `// ... ${n} registros más`,
  },
  en: {
    returns: 'Returns',
    note: 'Note',
    exampleLabel: 'JavaScript Example',
    copy: 'Copy',
    copied: '✓ Copied',
    execute: '▶  Execute',
    executing: '⟳  Running...',
    openRaw: '↗ Open raw JSON',
    badges: ['v1.0', 'CORS', 'No auth', 'JSON', 'Free'],
    overview: 'Public vehicle API built and hosted on this self-hosted server. Completely free access — no API key, no registration, no rate limit. Client-side filtered data. Perfect for demos, prototypes, and practicing fetch.',
    recordsWord: 'records',
    moreRecords: (n) => `// ... ${n} more records`,
  },
  de: {
    returns: 'Rückgabe',
    note: 'Hinweis',
    exampleLabel: 'JavaScript-Beispiel',
    copy: 'Kopieren',
    copied: '✓ Kopiert',
    execute: '▶  Ausführen',
    executing: '⟳  Wird ausgeführt...',
    openRaw: '↗ JSON öffnen',
    badges: ['v1.0', 'CORS', 'Kein Auth', 'JSON', 'Free'],
    overview: 'Öffentliche Fahrzeug-API, erstellt und auf diesem Self-Hosted-Server gehostet. Vollständig kostenloser Zugriff — kein API-Key, keine Registrierung, kein Rate-Limit. Clientseitig gefilterte Daten. Perfekt für Demos, Prototypen und Fetch-Übungen.',
    recordsWord: 'Einträge',
    moreRecords: (n) => `// ... ${n} weitere Einträge`,
  },
}

const formatBytes = (b) => (b < 1024 ? b + ' B' : (b / 1024).toFixed(1) + ' KB')

// ── Individual endpoint card ──────────────────────────────────────────────
function EndpointCard({ ep, lang, ui }) {
  const i18n = ENDPOINTS_I18N[ep.id]?.[lang] ?? ENDPOINTS_I18N[ep.id]?.en ?? {}
  const [response, setResponse]     = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const run = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    const t0 = performance.now()
    try {
      const res  = await fetch(ep.path)
      const elapsed = Math.round(performance.now() - t0)
      const text = await res.text()
      const json = JSON.parse(text)
      setResponse({ status: res.status, statusText: res.statusText, elapsed, size: new Blob([text]).size, json })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(i18n.example)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const badgeGreen = {
    background: 'rgba(57,255,20,0.14)',
    border: '1px solid rgba(57,255,20,0.3)',
    color: '#39ff14',
    borderRadius: 6,
    padding: '0.18rem 0.6rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  }

  const labelStyle = {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '0.35rem',
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={badgeGreen}>GET</span>
          <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
            {ep.path}
          </code>
        </div>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{i18n.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
          {i18n.description}
        </p>
      </div>

      {/* Returns + Note */}
      <div style={{
        padding: '0.9rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.015)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div>
          <div style={labelStyle}>{ui.returns}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{i18n.returns}</div>
        </div>
        <div>
          <div style={labelStyle}>{ui.note}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{i18n.note}</div>
        </div>
      </div>

      {/* Code example */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={labelStyle}>{ui.exampleLabel}</div>
          <button
            onClick={copyCode}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: copiedCode ? 'var(--neon-cyan)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            }}
          >
            {copiedCode ? ui.copied : ui.copy}
          </button>
        </div>
        <pre style={{
          margin: 0,
          padding: '0.85rem 1rem',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 8,
          color: 'var(--neon-cyan)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          overflowX: 'auto',
        }}>
          {i18n.example}
        </pre>
      </div>

      {/* Actions */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={run}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(168,85,247,0.18))',
            border: '1px solid var(--neon-cyan)',
            borderRadius: 8,
            padding: '0.5rem 1.4rem',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: 700,
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
            letterSpacing: '0.03em',
          }}
        >
          {loading ? ui.executing : ui.execute}
        </button>
        <a
          href={`${BASE_URL}${ep.path}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            textDecoration: 'none',
          }}
        >
          {ui.openRaw}
        </a>
      </div>

      {/* Response panel */}
      {(response || error) && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {response && (
            <>
              <div style={{
                padding: '0.65rem 1.5rem',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={badgeGreen}>{response.status} {response.statusText}</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {response.elapsed} ms · {formatBytes(response.size)} · {response.json?.count} {ui.recordsWord}
                </span>
              </div>
              <pre style={{
                margin: 0,
                padding: '1rem 1.5rem',
                background: 'rgba(0,0,0,0.25)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                lineHeight: 1.7,
                overflowX: 'auto',
                maxHeight: 340,
                overflowY: 'auto',
              }}>
                {JSON.stringify(
                  { ...response.json, data: response.json?.data?.slice(0, 5) },
                  null,
                  2
                )}
                {(response.json?.data?.length ?? 0) > 5
                  ? `\n  ${ui.moreRecords(response.json.data.length - 5)}`
                  : ''}
              </pre>
            </>
          )}
          {error && (
            <div style={{
              padding: '1rem 1.5rem',
              color: '#ef4444',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
            }}>
              ✗ {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function ApiExplorer() {
  const { lang } = useTranslation()
  const ui = API_UI[lang] ?? API_UI.en
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* API Overview header */}
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(0,240,255,0.06), rgba(168,85,247,0.06))',
        border: '1px solid rgba(0,240,255,0.22)',
        borderRadius: 14,
      }}>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Base URL
          </span>
          <code style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '0.2rem 0.8rem',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
          }}>
            {BASE_URL}
          </code>
          {ui.badges.map(b => (
            <span key={b} style={{
              background: 'rgba(168,85,247,0.14)',
              border: '1px solid rgba(168,85,247,0.3)',
              color: 'var(--neon-purple)',
              borderRadius: 20,
              padding: '0.15rem 0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}>
              {b}
            </span>
          ))}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
          {ui.overview}
        </p>
      </div>

      {/* Endpoint list */}
      {ENDPOINTS.map(ep => (
        <EndpointCard key={ep.id} ep={ep} lang={lang} ui={ui} />
      ))}
    </div>
  )
}
