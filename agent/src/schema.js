import { z } from 'zod'

const HEX = /^#[0-9a-fA-F]{6}$/
const hex = z.string().regex(HEX, 'must be a 6-digit hex colour like #2e3018')

/**
 * Zod schema mirroring the fields of a Kinora PRODUCTS entry the agent controls.
 * `priceRationale` is captured for the owner but stripped before formatting.
 */
export const productSchema = z.object({
  type: z.enum(['haori', 'kimono']),
  lbl: z.enum(['', 'Ново', 'Винтидж']),
  cat: z.string().min(1),
  name: z.string().min(1),
  sub: z.string().min(1),
  price: z.number().int().positive(),
  colors: z.array(hex).length(3),
  desc: z.string().min(1),
  sizes: z.array(z.string().min(1)).min(1),
  details: z.array(z.string().min(1)).min(3).max(5),
  bg: hex,
  acc: hex,
  priceRationale: z.string().min(1),
})

// JSON Schema for the Anthropic `emit_product` tool. Kept in sync with the zod
// schema above by hand — both describe the same shape.
export const productInputSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { type: 'string', enum: ['haori', 'kimono'] },
    lbl: {
      type: 'string',
      enum: ['', 'Ново', 'Винтидж'],
      description: "Badge: '' for none, 'Ново' (new), 'Винтидж' (vintage).",
    },
    cat: { type: 'string', description: 'Bulgarian category, e.g. "Хаори яке", "Официално кимоно".' },
    name: { type: 'string', description: 'UPPERCASE Bulgarian name, 1–3 words.' },
    sub: { type: 'string', description: 'Subtype: Хаори / Комон / Фурисоде / Томесоде / Учикаке.' },
    price: { type: 'integer', description: 'Price in EUR, single positive integer.' },
    colors: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 dark hex swatch colours from the site palette.',
    },
    desc: { type: 'string', description: 'Bulgarian description, 1–2 sentences in the house voice.' },
    sizes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Sizes, e.g. ["Универсален (XS–XL)"] for haori or ["XS","S","M","L","XL"] for kimono.',
    },
    details: {
      type: 'array',
      items: { type: 'string' },
      description: '3–5 short Bulgarian spec bullets.',
    },
    bg: { type: 'string', description: 'Dominant dark hex background.' },
    acc: { type: 'string', description: 'Light/metallic accent hex.' },
    priceRationale: {
      type: 'string',
      description: 'Short rationale: which catalog comparable(s) and signals set the price.',
    },
  },
  required: [
    'type', 'lbl', 'cat', 'name', 'sub', 'price', 'colors',
    'desc', 'sizes', 'details', 'bg', 'acc', 'priceRationale',
  ],
}

/**
 * Validate raw tool output. Returns { product, rationale } on success.
 * Throws a zod error (with the raw input attached) on failure.
 */
export function validateProduct(raw) {
  const parsed = productSchema.parse(raw)
  const { priceRationale, ...product } = parsed
  return { product, rationale: priceRationale }
}
