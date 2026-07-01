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

// This endpoint runs a paid Anthropic vision call, so it must be admin-only —
// otherwise anyone could spam it and run up the bill. We verify the caller's
// Supabase JWT against the project's own is_admin() RPC (the same source of
// truth used by RLS), reusing the SUPABASE_URL / anon key already configured.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://owkoprksrvjlebonaehj.supabase.co'
// Anon key is public (same one embedded in the client) — safe as a fallback so
// the admin check still works even if the env var isn't configured.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93a29wcmtzcnZqbGVib25hZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTIxNzgsImV4cCI6MjA5NjIyODE3OH0.UZdyvXOmEJTZ6r54fSlVgNNBja98qx-dpJqu9yGNlFA'

async function isAdminRequest(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !SUPABASE_ANON_KEY) return false
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: '{}',
    })
    if (!r.ok) return false
    return (await r.json()) === true
  } catch {
    return false
  }
}

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

  // Admin-only: this triggers a paid AI call.
  if (!(await isAdminRequest(req))) {
    return res.status(401).json({ error: 'Unauthorized.' })
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
