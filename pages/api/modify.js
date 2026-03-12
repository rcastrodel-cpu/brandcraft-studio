import Anthropic from '@anthropic-ai/sdk'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { imageBase64, mediaType, analysis, instruction, brandAssets } = req.body
  if (!imageBase64 || !analysis || !instruction) return res.status(400).json({ error: 'Missing fields' })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const brandCtx = brandAssets?.length
    ? `\nActivos de marca disponibles en la biblioteca: ${brandAssets.map(a => `${a.name} (${a.type})`).join(', ')}.`
    : ''

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType || 'image/png', data: imageBase64 },
          },
          {
            type: 'text',
            text: `Eres un diseñador gráfico y copywriter experto. Analizaste este flyer y detectaste:

CARACTERÍSTICAS DEL FLYER:
- Tipografía: ${analysis.fonts}
- Colores: ${analysis.colors?.join(', ')}
- Estilo visual: ${analysis.style}
- Composición: ${analysis.layout}
- Tono comunicacional: ${analysis.tone}
- Jerarquía: ${analysis.hierarchy}
- Espaciado: ${analysis.spacing}
- Textos actuales: ${analysis.texts?.join(' | ')}
${brandCtx}

INSTRUCCIÓN DEL USUARIO: "${instruction}"

Tu tarea: modificar los textos del flyer según la instrucción, MANTENIENDO EXACTAMENTE el mismo estilo visual, tono, jerarquía y formato del original.

Responde ÚNICAMENTE con JSON válido, sin markdown:
{
  "original_texts": ["texto original 1", "texto original 2", "texto original 3"],
  "new_texts": ["texto nuevo 1", "texto nuevo 2", "texto nuevo 3"],
  "changes_summary": "Descripción clara de qué cambió y por qué",
  "design_notes": "Cómo se preservó el estilo: tipografía, tono, jerarquía",
  "warnings": "Advertencias sobre coherencia de marca (dejar vacío si no hay)",
  "export_format": "PNG o PDF según el uso recomendado"
}`
          }
        ]
      }]
    })

    const raw = message.content[0].text.trim()
    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    console.error('Modify error:', err)
    res.status(500).json({ error: err.message })
  }
}
