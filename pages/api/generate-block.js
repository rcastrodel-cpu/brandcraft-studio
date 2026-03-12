import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { blockType, fields, analysis, brandAssets } = req.body

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const brandCtx = brandAssets?.length
    ? `\nActivos de marca: ${brandAssets.map(a => a.name).join(', ')}.`
    : ''

  const styleCtx = analysis
    ? `\nEstilo del flyer de referencia:\n- Tipografía: ${analysis.fonts}\n- Tono: ${analysis.tone}\n- Estilo: ${analysis.style}`
    : ''

  const filledFields = Object.entries(fields || {})
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `Eres un copywriter y diseñador experto en comunicación de marca.

Tipo de pieza: ${blockType}
Campos completados por el usuario:
${filledFields}
${brandCtx}
${styleCtx}

Generá textos optimizados, creativos y listos para usar. Responde ÚNICAMENTE con JSON válido, sin markdown:
{
  "headline": "titular principal impactante y claro",
  "subheadline": "subtítulo de apoyo complementario",
  "body": "texto cuerpo si aplica al formato, sino vacío",
  "cta": "llamada a la acción concisa",
  "hashtags": "hashtags relevantes si aplica al formato",
  "alt_headline_1": "titular alternativo opción 1",
  "alt_headline_2": "titular alternativo opción 2",
  "notes": "recomendaciones de uso y diseño"
}`
      }]
    })

    const raw = message.content[0].text.trim()
    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    console.error('Block error:', err)
    res.status(500).json({ error: err.message })
  }
}
