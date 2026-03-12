import { useState } from 'react'
import { Spinner, SectionLabel, Panel, Btn } from './ui'

const BLOCKS = [
  { id: 'evento', label: 'Evento', icon: '◈', fields: ['Nombre del evento', 'Fecha', 'Lugar', 'Hora', 'Descripción breve'], hint: 'Inauguraciones, shows, lanzamientos' },
  { id: 'promo', label: 'Promoción', icon: '◉', fields: ['Título de la promo', 'Descuento o beneficio', 'Producto o servicio', 'Vigencia', 'CTA'], hint: 'Ofertas, descuentos y campañas' },
  { id: 'redes', label: 'Redes Sociales', icon: '◎', fields: ['Mensaje principal', 'Contexto o campaña', 'Hashtags deseados', 'Handle o usuario'], hint: 'Instagram, LinkedIn, Twitter/X' },
  { id: 'institucional', label: 'Institucional', icon: '▣', fields: ['Mensaje principal', 'Claim o eslogan', 'Datos de contacto', 'Sitio web'], hint: 'Comunicación corporativa' },
  { id: 'producto', label: 'Producto', icon: '◧', fields: ['Nombre del producto', 'Características clave', 'Precio', 'Disponibilidad', 'CTA'], hint: 'Fichas y catálogos' },
  { id: 'libre', label: 'Libre', icon: '◌', fields: ['Texto 1', 'Texto 2', 'Texto 3', 'Texto 4'], hint: 'Estructura libre' },
]

export default function BlocksTab({ analysis, brandAssets, onHistoryAdd }) {
  const [selected, setSelected] = useState(null)
  const [fields, setFields] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)

  const block = BLOCKS.find(b => b.id === selected)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockType: block.label, fields, analysis, brandAssets }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      onHistoryAdd({
        type: 'bloque',
        flyerName: `Bloque: ${block.label}`,
        instruction: fields[block.fields[0]] || '',
        original: '—',
        modified: data.headline || '—',
        summary: data.notes || '',
      })
    } catch (e) {
      alert('Error: ' + e.message)
    }
    setLoading(false)
  }

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const CopyBtn = ({ text, k }) => (
    <button
      onClick={() => copy(text, k)}
      style={{
        background: 'none', border: 'none',
        color: copied === k ? 'var(--accent2)' : 'var(--text3)',
        cursor: 'pointer', fontSize: 10,
        fontFamily: 'DM Mono, monospace',
        padding: '2px 6px',
        transition: 'color 0.15s',
      }}
    >
      {copied === k ? '✓' : 'copiar'}
    </button>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
      {/* Block selector */}
      <div>
        <div style={{ color: 'var(--text3)', fontSize: 9, letterSpacing: 2, fontFamily: 'DM Mono', marginBottom: 10 }}>TIPO DE PIEZA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {BLOCKS.map(b => (
            <button
              key={b.id}
              onClick={() => { setSelected(b.id); setResult(null); setFields({}) }}
              style={{
                background: selected === b.id ? 'rgba(126,184,164,0.08)' : 'transparent',
                border: `1px solid ${selected === b.id ? 'rgba(126,184,164,0.3)' : 'var(--border)'}`,
                borderRadius: 8,
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 16, opacity: 0.6 }}>{b.icon}</span>
                <div>
                  <div style={{ color: selected === b.id ? 'var(--accent)' : 'var(--text2)', fontSize: 12, fontWeight: 500 }}>{b.label}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginTop: 1 }}>{b.hint}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {analysis && (
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(126,184,164,0.04)', border: '1px solid rgba(126,184,164,0.12)', borderRadius: 6, fontSize: 9, color: 'var(--text3)', fontFamily: 'DM Mono', lineHeight: 1.6 }}>
            ✓ Usando estilo del<br />flyer analizado
          </div>
        )}
      </div>

      {/* Fields + result */}
      <div>
        {!selected ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)', fontSize: 12, fontFamily: 'DM Mono' }}>
            ← Seleccioná un tipo de pieza
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Panel>
              <SectionLabel n={block.icon}>{block.label}</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {block.fields.map(f => (
                  <div key={f}>
                    <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>{f.toUpperCase()}</div>
                    <input
                      value={fields[f] || ''}
                      onChange={e => setFields(prev => ({ ...prev, [f]: e.target.value }))}
                      placeholder={`${f}...`}
                    />
                  </div>
                ))}
              </div>
              <Btn
                onClick={generate}
                disabled={loading || Object.values(fields).filter(v => v?.trim()).length === 0}
                variant="primary"
                fullWidth
                style={{ marginTop: 14 }}
              >
                {loading ? <Spinner label="Generando textos..." /> : `GENERAR TEXTOS PARA ${block.label.toUpperCase()} →`}
              </Btn>
            </Panel>

            {result && (
              <Panel style={{ animation: 'fadeIn 0.3s ease' }}>
                <SectionLabel n="✓">Textos generados</SectionLabel>
                {[
                  { key: 'headline', label: 'TITULAR PRINCIPAL' },
                  { key: 'subheadline', label: 'SUBTÍTULO' },
                  { key: 'body', label: 'TEXTO CUERPO' },
                  { key: 'cta', label: 'CTA' },
                  { key: 'hashtags', label: 'HASHTAGS' },
                ].filter(({ key }) => result[key]).map(({ key, label }) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', letterSpacing: 1 }}>{label}</div>
                      <CopyBtn text={result[key]} k={key} />
                    </div>
                    <div style={{ padding: '8px 10px', background: 'rgba(126,184,164,0.05)', border: '1px solid rgba(126,184,164,0.15)', borderRadius: 6, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                      {result[key]}
                    </div>
                  </div>
                ))}

                {(result.alt_headline_1 || result.alt_headline_2) && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', letterSpacing: 1, marginBottom: 6 }}>TITULARES ALTERNATIVOS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {[result.alt_headline_1, result.alt_headline_2].filter(Boolean).map((alt, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg3)', borderRadius: 6, fontSize: 12, color: 'var(--text2)' }}>
                          <span>{alt}</span>
                          <CopyBtn text={alt} k={`alt${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.notes && (
                  <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 6, fontSize: 10, color: 'var(--text3)', lineHeight: 1.6 }}>
                    💡 {result.notes}
                  </div>
                )}
              </Panel>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
