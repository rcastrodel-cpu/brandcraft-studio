import { useState, useRef } from 'react'
import { Spinner, SectionLabel, Panel, Btn, FileDropZone, ColorDot, DiffRow } from './ui'

export default function EditorTab({ brandAssets, onHistoryAdd }) {
  const [flyer, setFlyer] = useState(null)
  const [flyerURL, setFlyerURL] = useState(null)
  const [flyerB64, setFlyerB64] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [instruction, setInstruction] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const resultRef = useRef(null)

  const toBase64 = (f) => new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = rej
    r.readAsDataURL(f)
  })

  const handleFlyer = async (f) => {
    setFlyer(f)
    setFlyerURL(URL.createObjectURL(f))
    setAnalysis(null)
    setResult(null)
    const b64 = await toBase64(f)
    setFlyerB64(b64)
  }

  const analyze = async () => {
    setLoading(true)
    setStep('Analizando tipografía, colores y estilo...')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: flyerB64, mediaType: flyer.type }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data)
    } catch (e) {
      alert('Error al analizar: ' + e.message)
    }
    setLoading(false)
    setStep('')
  }

  const modify = async () => {
    setLoading(true)
    setStep('Aplicando cambios con IA...')
    try {
      const res = await fetch('/api/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: flyerB64,
          mediaType: flyer.type,
          analysis,
          instruction,
          brandAssets,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      onHistoryAdd({
        type: 'editor',
        flyerName: flyer.name,
        instruction,
        original: data.original_texts?.[0] || '—',
        modified: data.new_texts?.[0] || '—',
        summary: data.changes_summary,
      })
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      alert('Error al modificar: ' + e.message)
    }
    setLoading(false)
    setStep('')
  }

  const exportTxt = () => {
    if (!result) return
    const lines = [
      'BRANDCRAFT STUDIO — RESULTADO',
      '══════════════════════════════',
      '',
      `Archivo: ${flyer?.name}`,
      `Fecha: ${new Date().toLocaleString('es-AR')}`,
      `Instrucción: ${instruction}`,
      '',
      'CAMBIOS:',
      ...(result.original_texts || []).map((t, i) =>
        `  ANTES:   ${t}\n  DESPUÉS: ${result.new_texts?.[i] || '—'}\n`
      ),
      'RESUMEN:',
      result.changes_summary,
      '',
      'NOTAS DE DISEÑO:',
      result.design_notes,
      ...(result.warnings ? ['', 'ADVERTENCIAS:', result.warnings] : []),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brandcraft_${flyer?.name?.replace(/\.[^.]+$/, '') || 'resultado'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Panel>
          <SectionLabel n="1">Subir flyer plantilla</SectionLabel>
          <FileDropZone
            label="Arrastrá tu flyer · PNG, JPG"
            accept="image/png,image/jpeg,image/webp"
            icon="🖼"
            onFile={handleFlyer}
            file={flyer}
          />
          {flyerURL && (
            <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', maxHeight: 220 }}>
              <img src={flyerURL} alt="flyer" style={{ width: '100%', objectFit: 'contain', display: 'block', background: '#1a1a1a' }} />
            </div>
          )}
          {flyer && !analysis && (
            <Btn
              onClick={analyze}
              disabled={loading}
              variant="default"
              fullWidth
              style={{ marginTop: 10 }}
            >
              {loading ? <Spinner label={step} /> : '→ ANALIZAR ESTILO Y TEXTOS'}
            </Btn>
          )}
        </Panel>

        {analysis && (
          <Panel style={{ animation: 'fadeIn 0.3s ease' }}>
            <SectionLabel n="✓">Análisis detectado</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>TIPOGRAFÍA</div>
                <div style={{ color: 'var(--text)', fontSize: 11 }}>{analysis.fonts}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>COLORES</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {analysis.colors?.map((c, i) => <ColorDot key={i} color={c} />)}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>ESTILO</div>
                <div style={{ color: 'var(--text)', fontSize: 11 }}>{analysis.style}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 4, letterSpacing: 1 }}>TONO</div>
                <div style={{ color: 'var(--text)', fontSize: 11 }}>{analysis.tone}</div>
              </div>
            </div>
            {analysis.texts?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', marginBottom: 6, letterSpacing: 1 }}>TEXTOS DETECTADOS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {analysis.texts.map((t, i) => (
                    <div key={i} style={{ padding: '5px 8px', background: 'var(--bg3)', borderRadius: 5, fontSize: 11, color: 'var(--text2)', fontStyle: 'italic' }}>
                      "{t}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Panel>
          <SectionLabel n="2">Instrucción de modificación</SectionLabel>
          <textarea
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            placeholder={`Ejemplos:\n"Cambiá el título a 'Gran Apertura Diciembre 2025'"\n"Adaptá el flyer para el evento de Navidad"\n"Traducí todos los textos al inglés"\n"Cambiá la promo de verano a invierno"`}
            style={{ minHeight: 120 }}
          />

          {brandAssets?.length > 0 && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(126,184,164,0.05)', border: '1px solid rgba(126,184,164,0.15)', borderRadius: 6, fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
              ✓ {brandAssets.length} activos de marca activos en contexto
            </div>
          )}

          <Btn
            onClick={modify}
            disabled={!analysis || !instruction.trim() || loading}
            variant="primary"
            fullWidth
            style={{ marginTop: 10 }}
          >
            {loading ? <Spinner label={step} /> : 'APLICAR CAMBIOS CON IA →'}
          </Btn>
        </Panel>

        {result && (
          <Panel ref={resultRef} style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <SectionLabel n="✓">Resultado</SectionLabel>
              <Btn onClick={exportTxt} variant="ghost" style={{ fontSize: 10, padding: '5px 10px' }}>
                ↓ EXPORTAR .TXT
              </Btn>
            </div>

            {(result.original_texts || []).map((orig, i) => (
              <DiffRow key={i} original={orig} modified={result.new_texts?.[i] || '—'} />
            ))}

            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>
              <div>📋 {result.changes_summary}</div>
              <div style={{ color: 'var(--text3)', marginTop: 4 }}>🎨 {result.design_notes}</div>
              {result.warnings && (
                <div style={{ color: 'var(--warn)', marginTop: 4 }}>⚠ {result.warnings}</div>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}
