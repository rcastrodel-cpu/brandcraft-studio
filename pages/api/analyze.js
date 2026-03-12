import Anthropic from '@anthropic-ai/sdk'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { imageBase64, mediaType } = req.body
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType || 'image/png', data: imageBase64 },
          },
          {
            type: 'text',
            text: `Analiza este flyer de diseño gráfico en detalle. Responde ÚNICAMENTE con JSON válido, sin markdown, sin backticks, sin texto adicional:
{"fonts":"descripción de tipografías detectadas (nombre, peso, estilo)","colors":["#hex1","#hex2","#hex3","#hex4"],"style":"estilo visual general (ej: minimalista corporativo, festivo vibrante, elegante editorial)","layout":"descripción de la composición y estructura","texts":["texto visible 1","texto visible 2","texto visible 3","texto visible 4"],"tone":"tono comunicacional (formal/casual/urgente/inspiracional/etc)","spacing":"descripción del espaciado y márgenes","hierarchy":"jerarquía visual detectada","bg_description":"descripción del fondo y elementos visuales de fondo"}`
          }
        ]
      }]
    })

    const raw = message.content[0].text.trim()
    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    console.error('Analyze error:', err)
    res.status(500).json({ error: err.message })
  }
}
