// POST /api/generate-product
//
// Analyses photos of a single haori/kimono with Claude (vision) and returns a
// product object the admin product form can auto-fill from. Reuses the shared
// agent pipeline in agent/src so voice/pricing stay tunable only via
// agent/reference/*.
//
// The Anthropic key lives only here (process.env.ANTHROPIC_API_KEY) — it is
// never sent to the browser. Admin auth is enforced by Supabase RLS on save;
// this endpoint only generates draft copy, writes nothing, and returns no key.
//
// Price is intentionally omitted from the response: the agent prices from
// placeholder reference examples until the real catalogue is encoded, so a
// number now would mislead. The owner sets price by hand in the form.

import { z } from 'zod'
import { imageBlockFromBuffer } from '../agent/src/images.js'
import { generateFromImages } from '../agent/src/generate.js'

const requestSchema = z.object({
  type: z.enum(['haori', 'kimono']).optional(),
  images: z
    .array(z.object({ data: z.string().min(1), mediaType: z.string().min(1) }))
    .min(1, 'Add at least one photo.')
    .max(6, 'Up to 6 photos.'),
})

// Vercel may deliver req.body already parsed, as a string, or as undefined
// (depending on content-type / config). Resolve all three to an object.
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length) return JSON.parse(req.body)
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  let payload
  try {
    payload = requestSchema.parse(await readJsonBody(req))
  } catch (error) {
    const msg =
      error instanceof z.ZodError
        ? error.issues.map((i) => i.message).join('; ')
        : 'Invalid request body.'
    return res.status(400).json({ error: msg })
  }

  let imageBlocks
  try {
    imageBlocks = payload.images.map((img, i) =>
      imageBlockFromBuffer(Buffer.from(img.data, 'base64'), img.mediaType, `photo ${i + 1}`),
    )
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  try {
    const { product } = await generateFromImages(imageBlocks, { type: payload.type })
    // Drop price — the owner sets it by hand until the catalogue is encoded.
    const { price, ...rest } = product
    return res.status(200).json({ product: rest })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(502)
        .json({ error: 'Моделът върна невалиден продукт. Опитайте пак или ползвайте по-ясни снимки.' })
    }
    console.error('generate-product failed:', error.message)
    return res.status(500).json({ error: error.message || 'Generation failed.' })
  }
}
