import { useRef, useState } from 'react'

export function Spinner({ label = 'Procesando...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent2)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
      <div style={{
        width: 14, height: 14,
        border: '2px solid rgba(126,184,164,0.2)',
        borderTopColor: 'var(--accent2)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }} />
      {label}
    </div>
  )
}

export function SectionLabel({ n, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '1px solid var(--border2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, color: 'var(--accent2)',
        fontFamily: 'DM Mono, monospace', flexShrink: 0,
      }}>{n}</div>
      <span style={{ color: 'var(--text3)', fontSize: 9, letterSpacing: 2, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{children}</span>
    </div>
  )
}

export function Panel({ children, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 18,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, disabled, variant = 'default', fullWidth, style }) {
  const base = {
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontFamily: 'DM Mono, monospace',
    letterSpacing: 1,
    fontWeight: 500,
    width: fullWidth ? '100%' : undefined,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...style,
  }
  const variants = {
    default: { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)' },
    primary: { background: 'var(--accent2)', border: 'none', color: '#0b0b0b', fontWeight: 700 },
    ghost: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text3)' },
    warn: { background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.3)', color: 'var(--warn)' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

export function FileDropZone({ label, accept, icon, onFile, file, mini }) {
  const ref = useRef()
  const [drag, setDrag] = useState(false)

  const handle = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer?.files[0] || e.target.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onClick={() => ref.current.click()}
      onDrop={handle}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      style={{
        border: `1.5px dashed ${drag ? 'var(--accent2)' : 'var(--border2)'}`,
        borderRadius: 'var(--radius)',
        padding: mini ? '12px' : '28px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        background: drag ? 'rgba(126,184,164,0.04)' : 'transparent',
        transition: 'all 0.15s',
        minHeight: mini ? 64 : 130,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
    >
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={handle} />
      {file ? (
        <>
          <div style={{ fontSize: mini ? 18 : 26, color: 'var(--accent2)' }}>✓</div>
          <div style={{ color: 'var(--accent2)', fontSize: 10, fontFamily: 'DM Mono, monospace', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: mini ? 20 : 28, opacity: 0.25 }}>{icon}</div>
          <div style={{ color: 'var(--text3)', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{label}</div>
        </>
      )}
    </div>
  )
}

export function Tag({ children, color = 'var(--accent2)' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 7px',
      borderRadius: 4,
      border: `1px solid ${color}44`,
      color,
      fontSize: 9,
      fontFamily: 'DM Mono, monospace',
      letterSpacing: 1.5,
      background: `${color}11`,
    }}>{children}</span>
  )
}

export function ColorDot({ color }) {
  return (
    <div title={color} style={{
      width: 18, height: 18, borderRadius: '50%',
      background: color,
      border: '1.5px solid rgba(255,255,255,0.1)',
      display: 'inline-block',
      cursor: 'default',
    }} />
  )
}

export function DiffRow({ original, modified }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
      <div style={{
        flex: 1, padding: '8px 10px',
        background: 'rgba(212,116,116,0.05)',
        border: '1px solid rgba(212,116,116,0.15)',
        borderRadius: 6, fontSize: 12, color: 'var(--text3)',
        textDecoration: 'line-through', fontFamily: 'DM Sans, sans-serif',
      }}>{original}</div>
      <div style={{ color: 'var(--text3)', paddingTop: 8, fontSize: 12 }}>→</div>
      <div style={{
        flex: 1, padding: '8px 10px',
        background: 'rgba(126,184,164,0.06)',
        border: '1px solid rgba(126,184,164,0.2)',
        borderRadius: 6, fontSize: 12, color: 'var(--text)',
        fontFamily: 'DM Sans, sans-serif',
      }}>{modified}</div>
    </div>
  )
}
