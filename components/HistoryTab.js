import { SectionLabel, Btn } from './ui'

const TYPE_COLORS = {
  editor: 'var(--accent2)',
  bloque: 'var(--warn)',
}

const TYPE_LABELS = {
  editor: 'EDITOR',
  bloque: 'BLOQUE',
}

export default function HistoryTab({ history, setHistory }) {
  const clear = () => {
    if (confirm('¿Borrar todo el historial?')) setHistory([])
  }

  const exportAll = () => {
    const lines = history.map((h, i) => [
      `[${i + 1}] ${h.date}`,
      `Tipo: ${h.type}`,
      `Archivo: ${h.flyerName}`,
      `Instrucción: ${h.instruction}`,
      `Antes: ${h.original}`,
      `Después: ${h.modified}`,
      `Resumen: ${h.summary}`,
      '─────────────────',
    ].join('\n'))

    const blob = new Blob(['BRANDCRAFT STUDIO — HISTORIAL\n══════════════════════════════\n\n' + lines.join('\n\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brandcraft_historial_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono', letterSpacing: 2 }}>
          HISTORIAL — {history.length} registro{history.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {history.length > 0 && (
            <>
              <Btn onClick={exportAll} variant="ghost" style={{ fontSize: 10, padding: '5px 10px' }}>↓ EXPORTAR</Btn>
              <Btn onClick={clear} variant="ghost" style={{ fontSize: 10, padding: '5px 10px', color: 'var(--danger)' }}>LIMPIAR</Btn>
            </>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'var(--text3)', fontSize: 12,
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          fontFamily: 'DM Mono',
          lineHeight: 1.8,
        }}>
          El historial está vacío.<br />
          Las modificaciones y bloques generados<br />
          aparecerán aquí automáticamente.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map(h => (
            <div key={h.id} style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 14px',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: `${TYPE_COLORS[h.type]}15`,
                    border: `1px solid ${TYPE_COLORS[h.type]}33`,
                    color: TYPE_COLORS[h.type],
                    fontSize: 8,
                    fontFamily: 'DM Mono',
                    letterSpacing: 1,
                  }}>{TYPE_LABELS[h.type]}</span>
                  <span style={{ color: 'var(--text3)', fontSize: 10, fontFamily: 'DM Mono' }}>{h.flyerName}</span>
                </div>
                <span style={{ color: 'var(--text3)', fontSize: 9, fontFamily: 'DM Mono' }}>{h.date}</span>
              </div>

              {h.instruction && (
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 7, fontStyle: 'italic' }}>
                  "{h.instruction}"
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, padding: '5px 8px', background: 'rgba(212,116,116,0.05)', border: '1px solid rgba(212,116,116,0.12)', borderRadius: 5, fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through' }}>
                  {h.original}
                </div>
                <span style={{ color: 'var(--text3)', fontSize: 10 }}>→</span>
                <div style={{ flex: 1, padding: '5px 8px', background: 'rgba(126,184,164,0.05)', border: '1px solid rgba(126,184,164,0.15)', borderRadius: 5, fontSize: 11, color: 'var(--text)' }}>
                  {h.modified}
                </div>
              </div>

              {h.summary && (
                <div style={{ marginTop: 7, fontSize: 10, color: 'var(--text3)', lineHeight: 1.5 }}>
                  {h.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
