import { useState } from 'react'
import { SectionLabel, Panel, Btn, FileDropZone } from './ui'

const TYPE_OPTIONS = [
  { value: 'guia', label: '📘 Guía de marca', desc: 'Manual de identidad, lineamientos anuales' },
  { value: 'logo', label: '⬡ Logo', desc: 'Versiones del logo en distintos formatos' },
  { value: 'icono', label: '◈ Ícono / Elemento visual', desc: 'Íconos, formas, gráficos de marca' },
  { value: 'paleta', label: '🎨 Paleta de colores', desc: 'Colores oficiales y combinaciones' },
  { value: 'tipografia', label: 'Aa Tipografía', desc: 'Fuentes y reglas tipográficas' },
  { value: 'otro', label: '📄 Otro', desc: 'Cualquier otro activo de marca' },
]

const TYPE_ICONS = { guia: '📘', logo: '⬡', icono: '◈', paleta: '🎨', tipografia: 'Aa', otro: '📄' }

export default function LibraryTab({ assets, setAssets }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('guia')
  const [notes, setNotes] = useState('')

  const add = () => {
    if (!file || !name.trim()) return
    setAssets(prev => [...prev, {
      id: Date.now(),
      name: name.trim(),
      type,
      notes,
      fileName: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
    }])
    setFile(null)
    setName('')
    setNotes('')
    setType('guia')
  }

  const remove = (id) => setAssets(prev => prev.filter(a => a.id !== id))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Upload */}
      <div>
        <Panel>
          <SectionLabel n="+">Agregar activo de marca</SectionLabel>

          <FileDropZone
            label="PDF, PNG, SVG, JPG"
            accept="image/*,.pdf,.svg"
            icon="📂"
            onFile={setFile}
            file={file}
            mini
          />

          <div style={{ marginTop: 10 }}>
            <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>NOMBRE</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Guía de Marca 2025..." />
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>TIPO</div>
            <select value={type} onChange={e => setType(e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>NOTAS (opcional)</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Indicaciones especiales para la IA..."
              style={{ minHeight: 60 }}
            />
          </div>

          <Btn
            onClick={add}
            disabled={!file || !name.trim()}
            variant="primary"
            fullWidth
            style={{ marginTop: 12 }}
          >
            + AGREGAR A LA BIBLIOTECA
          </Btn>
        </Panel>

        <Panel style={{ marginTop: 14 }}>
          <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 10, letterSpacing: 1 }}>CÓMO SE USA</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.8 }}>
            Los activos cargados aquí son usados automáticamente por la IA como contexto al modificar flyers y generar bloques.<br /><br />
            <strong style={{ color: 'var(--text2)' }}>Recomendado cargar:</strong>
            <ul style={{ marginTop: 6, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <li>Guía de marca anual (PDF)</li>
              <li>Logo en todas sus versiones</li>
              <li>Paleta de colores oficial</li>
              <li>Íconos y elementos gráficos</li>
              <li>Reglas tipográficas</li>
            </ul>
          </div>
        </Panel>
      </div>

      {/* Library grid */}
      <div>
        <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 10, letterSpacing: 1 }}>
          BIBLIOTECA — {assets.length} activo{assets.length !== 1 ? 's' : ''}
        </div>

        {assets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 12, border: '1px dashed var(--border)', borderRadius: 'var(--radius)', fontFamily: 'DM Mono' }}>
            La biblioteca está vacía.<br />Agregá activos para que la IA<br />los use como contexto.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {assets.map(a => (
              <div key={a.id} style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '12px',
                position: 'relative',
              }}>
                <button
                  onClick={() => remove(a.id)}
                  style={{
                    position: 'absolute', top: 7, right: 8,
                    background: 'none', border: 'none',
                    color: 'var(--text3)', cursor: 'pointer',
                    fontSize: 14, lineHeight: 1, padding: 2,
                    transition: 'color 0.15s',
                  }}
                  title="Eliminar"
                >×</button>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{TYPE_ICONS[a.type] || '📄'}</div>
                <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, marginBottom: 2 }}>{a.name}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{a.type.toUpperCase()} · {a.date} · {a.size}</div>
                {a.notes && <div style={{ marginTop: 5, fontSize: 10, color: 'var(--text3)', lineHeight: 1.4, fontStyle: 'italic' }}>{a.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
