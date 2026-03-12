import { useState } from 'react'
import Head from 'next/head'
import { useLocalStorage } from '../lib/useStorage'
import EditorTab from '../components/EditorTab'
import BlocksTab from '../components/BlocksTab'
import LibraryTab from '../components/LibraryTab'
import HistoryTab from '../components/HistoryTab'

const TABS = [
  { id: 'editor', label: 'Editor de Flyer', icon: '◈' },
  { id: 'bloques', label: 'Bloques', icon: '◉' },
  { id: 'biblioteca', label: 'Biblioteca de Marca', icon: '▣' },
  { id: 'historial', label: 'Historial', icon: '◎' },
]

export default function Home() {
  const [tab, setTab] = useState('editor')
  const [assets, setAssets] = useLocalStorage('bc:assets', [])
  const [history, setHistory, histLoaded] = useLocalStorage('bc:history', [])
  const [editorAnalysis, setEditorAnalysis] = useState(null)

  const addHistory = (entry) => {
    setHistory(prev => [{
      ...entry,
      id: Date.now(),
      date: new Date().toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    }, ...prev.slice(0, 49)])
  }

  return (
    <>
      <Head>
        <title>Brandcraft Studio</title>
        <meta name="description" content="Editor de flyers con IA para equipos de marca" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>" />
      </Head>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
          background: 'var(--bg2)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 18, fontFamily: 'DM Serif Display, serif', color: '#fff', letterSpacing: -0.5 }}>brandcraft</span>
              <span style={{ fontSize: 8, color: 'var(--accent2)', fontFamily: 'DM Mono, monospace', letterSpacing: 3 }}>STUDIO</span>
            </div>

            {/* Tabs */}
            <nav style={{ display: 'flex', gap: 0, height: '100%' }}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${tab === t.id ? 'var(--accent2)' : 'transparent'}`,
                    color: tab === t.id ? 'var(--accent)' : 'var(--text3)',
                    padding: '0 16px',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                    height: '100%',
                  }}
                >
                  <span style={{ opacity: 0.5 }}>{t.icon}</span>
                  {t.label.toUpperCase()}
                  {t.id === 'historial' && history.length > 0 && (
                    <span style={{
                      background: 'var(--accent2)',
                      color: '#0b0b0b',
                      borderRadius: 10,
                      padding: '1px 5px',
                      fontSize: 8,
                      fontWeight: 700,
                    }}>{history.length}</span>
                  )}
                  {t.id === 'biblioteca' && assets.length > 0 && (
                    <span style={{
                      background: 'rgba(126,184,164,0.2)',
                      color: 'var(--accent2)',
                      borderRadius: 10,
                      padding: '1px 5px',
                      fontSize: 8,
                    }}>{assets.length}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Status */}
            <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'DM Mono', textAlign: 'right', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent2)', animation: 'pulse 2s infinite' }} />
                IA activa
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {tab === 'editor' && (
              <EditorTab
                brandAssets={assets}
                onHistoryAdd={addHistory}
                onAnalysisChange={setEditorAnalysis}
              />
            )}

            {tab === 'bloques' && (
              <BlocksTab
                analysis={editorAnalysis}
                brandAssets={assets}
                onHistoryAdd={addHistory}
              />
            )}

            {tab === 'biblioteca' && (
              <LibraryTab assets={assets} setAssets={setAssets} />
            )}

            {tab === 'historial' && (
              <HistoryTab history={history} setHistory={setHistory} />
            )}

          </div>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 32px',
          background: 'var(--bg2)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
              BRANDCRAFT STUDIO · Powered by Claude AI
            </span>
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
              El historial y la biblioteca se guardan automáticamente en este navegador
            </span>
          </div>
        </footer>
      </div>
    </>
  )
}
