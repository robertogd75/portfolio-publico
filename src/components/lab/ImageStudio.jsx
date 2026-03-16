import { useState, useRef } from 'react'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '0.6rem 0.9rem',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
}

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

export default function ImageStudio() {
  const [preview, setPreview] = useState(null)
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 })
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockAspect, setLockAspect] = useState(true)
  const [format, setFormat] = useState('jpeg')
  const [quality, setQuality] = useState(85)
  const [isDragging, setIsDragging] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const inputRef = useRef(null)

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target.result
      const img = new Image()
      img.onload = () => {
        setOriginalDims({ w: img.width, h: img.height })
        setWidth(img.width)
        setHeight(img.height)
        setPreview(src)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    loadFile(e.dataTransfer.files[0])
  }

  const handleWidthChange = (v) => {
    const w = Math.max(1, parseInt(v) || 1)
    setWidth(w)
    if (lockAspect && originalDims.w) setHeight(Math.round(w * originalDims.h / originalDims.w))
  }

  const handleHeightChange = (v) => {
    const h = Math.max(1, parseInt(v) || 1)
    setHeight(h)
    if (lockAspect && originalDims.h) setWidth(Math.round(h * originalDims.w / originalDims.h))
  }

  const handleConvert = () => {
    if (!preview) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const ext = format === 'jpeg' ? 'jpg' : format
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `imagen_convertida.${ext}`
          a.click()
          URL.revokeObjectURL(url)
        },
        `image/${format}`,
        quality / 100
      )
    }
    img.src = preview
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--neon-cyan)' : preview ? 'rgba(0,240,255,0.4)' : 'var(--border)'}`,
          borderRadius: 16,
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(0,240,255,0.04)' : 'rgba(255,255,255,0.01)',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => loadFile(e.target.files[0])} />
        {preview ? (
          <div>
            <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, marginBottom: '0.75rem', objectFit: 'contain' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              {originalDims.w} × {originalDims.h} px · {formatBytes(originalSize)}
            </p>
            <p style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>Haz clic para cambiar imagen</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼️</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Arrastra una imagen aquí o haz clic para seleccionar</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>PNG, JPG, WebP, GIF...</p>
          </div>
        )}
      </div>

      {preview && (
        <>
          {/* Format selector */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>Formato:</span>
            {[{ val: 'jpeg', label: 'JPG' }, { val: 'png', label: 'PNG' }, { val: 'webp', label: 'WebP' }].map(f => (
              <button
                key={f.val}
                onClick={() => setFormat(f.val)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 6,
                  border: `1px solid ${format === f.val ? 'var(--neon-cyan)' : 'var(--border)'}`,
                  background: format === f.val ? 'rgba(0,240,255,0.12)' : 'transparent',
                  color: format === f.val ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >{f.label}</button>
            ))}
          </div>

          {/* Dimensions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>Ancho (px)</label>
              <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>Alto (px)</label>
              <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Lock aspect + reset */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={lockAspect} onChange={e => setLockAspect(e.target.checked)} style={{ accentColor: 'var(--neon-cyan)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>Mantener proporción</span>
            </label>
            <button
              onClick={() => { setWidth(originalDims.w); setHeight(originalDims.h) }}
              style={{
                background: 'transparent', border: '1px solid var(--border)', borderRadius: 6,
                padding: '0.35rem 0.75rem', color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              }}
            >Restaurar original</button>
          </div>

          {/* Quality slider */}
          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Calidad</label>
                <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>{quality}%</span>
              </div>
              <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--neon-cyan)' }} />
            </div>
          )}

          {/* Convert button */}
          <button
            onClick={handleConvert}
            style={{
              padding: '0.85rem 2rem', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000', fontWeight: 700, fontSize: '1rem',
              border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
            }}
          >
            ↓ Convertir y Descargar
          </button>
        </>
      )}
    </div>
  )
}
