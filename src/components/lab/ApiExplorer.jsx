import { useState } from 'react'

const BASE_URL = 'https://rgardel.es'

const ENDPOINTS = [
  {
    id: 'cars',
    method: 'GET',
    path: '/api/v1/cars.json',
    title: 'Listar vehículos',
    description:
      'Devuelve el listado completo de modelos de vehículos con información detallada. ' +
      'Incluye marca, modelo, año de inicio/fin, tipo de carrocería, segmento por clase, ' +
      'país de origen y tipos de combustible disponibles.',
    returns:
      'Array de objetos con campos: id, make_id, make, model, year_start, year_end, type, segment, origin, fuel[]',
    note: 'El campo year_end es null si el modelo sigue en producción.',
    example:
`const res  = await fetch('${BASE_URL}/api/v1/cars.json')
const data = await res.json()
// Filtrar eléctricos en cliente:
const ev = data.data.filter(c => c.fuel.includes('electric'))
console.log(ev.length, 'vehículos eléctricos')`,
  },
  {
    id: 'brands',
    method: 'GET',
    path: '/api/v1/brands.json',
    title: 'Listar marcas',
    description:
      'Devuelve el catálogo de marcas de vehículos disponibles en la base de datos, ' +
      'incluyendo país de origen, código ISO y año de fundación.',
    returns:
      'Array de objetos con campos: id, name, country, country_code, founded',
    note: 'country_code sigue el estándar ISO 3166-1 alpha-2.',
    example:
`const res  = await fetch('${BASE_URL}/api/v1/brands.json')
const data = await res.json()
// Mostrar marcas europeas:
const eu = data.data.filter(b => ['DE','FR','ES'].includes(b.country_code))
console.log(eu.map(b => b.name))`,
  },
]

const formatBytes = (b) => (b < 1024 ? b + ' B' : (b / 1024).toFixed(1) + ' KB')

// ── Individual endpoint card ──────────────────────────────────────────────
function EndpointCard({ ep }) {
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
    navigator.clipboard.writeText(ep.example)
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
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{ep.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
          {ep.description}
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
          <div style={labelStyle}>Devuelve</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{ep.returns}</div>
        </div>
        <div>
          <div style={labelStyle}>Nota</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{ep.note}</div>
        </div>
      </div>

      {/* Code example */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={labelStyle}>Ejemplo JavaScript</div>
          <button
            onClick={copyCode}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: copiedCode ? 'var(--neon-cyan)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            }}
          >
            {copiedCode ? '✓ Copiado' : 'Copiar'}
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
          {ep.example}
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
          {loading ? '⟳  Ejecutando...' : '▶  Ejecutar'}
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
          ↗ Abrir raw JSON
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
                  {response.elapsed} ms · {formatBytes(response.size)} · {response.json?.count} registros
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
                  ? `\n  // ... ${response.json.data.length - 5} registros más`
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
          {['v1.0', 'CORS', 'Sin auth', 'JSON', 'Free'].map(b => (
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
          API pública de vehículos construida y alojada en este mismo servidor self-hosted.
          Acceso completamente libre — sin API key, sin registro, sin rate limit.
          Datos filtrados desde el cliente. Perfecta para demos, prototipos y practicar fetch.
        </p>
      </div>

      {/* Endpoint list */}
      {ENDPOINTS.map(ep => (
        <EndpointCard key={ep.id} ep={ep} />
      ))}
    </div>
  )
}
