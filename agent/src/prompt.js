import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const refDir = join(here, '..', 'reference')

/**
 * Build the system prompt from the editable reference files. Loading the
 * examples/style/pricing at runtime means the catalog stays the single tunable
 * source of truth — no code change needed to refine voice or pricing.
 */
export async function buildSystemPrompt() {
  const [style, pricing, measuring, examplesRaw] = await Promise.all([
    readFile(join(refDir, 'style.md'), 'utf8'),
    readFile(join(refDir, 'pricing.md'), 'utf8'),
    readFile(join(refDir, 'measuring.md'), 'utf8'),
    readFile(join(refDir, 'examples.json'), 'utf8'),
  ])

  const { examples } = JSON.parse(examplesRaw)
  const renderedExamples = examples
    .map(
      (e) =>
        `- [${e.type} · ${e.sub} · ${e.price} €] ${e.name}\n` +
        `  desc: ${e.desc}\n` +
        `  details: ${e.details.join(' · ')}\n` +
        `  why this price: ${e.cues}`,
    )
    .join('\n')

  return [
    'You are the cataloguing assistant for Kinora, a shop selling Japanese',
    'vintage haori and kimono to a Bulgarian audience. From photos of a single',
    'garment you produce one catalogue entry: a name, a EUR price, a Bulgarian',
    'description, spec details, and matching palette colours. Emit your answer',
    'by calling the `emit_product` tool exactly once.',
    '',
    '=== HOUSE VOICE ===',
    style.trim(),
    '',
    '=== PRICING ===',
    pricing.trim(),
    '',
    '=== MEASUREMENTS ===',
    measuring.trim(),
    '',
    '=== PRICED CATALOG EXAMPLES (your reference for voice AND price) ===',
    renderedExamples,
  ].join('\n')
}

/**
 * Build the user-turn content: the photos plus the task instruction.
 */
export function buildUserContent(imageBlocks, { type, id }) {
  const hints = []
  if (type) hints.push(`The owner says this is a ${type}.`)
  hints.push(
    id != null
      ? `Use id ${id}.`
      : 'The owner has not assigned an id; leave id selection to them.',
  )

  return [
    ...imageBlocks,
    {
      type: 'text',
      text:
        `These are photos of one garment. ${hints.join(' ')}\n\n` +
        'Study the fabric, motif, technique, colour and condition. Then call ' +
        '`emit_product` once with a complete catalogue entry: an evocative ' +
        'uppercase Bulgarian name, a EUR price anchored on the closest catalog ' +
        'comparable(s), a 1–2 sentence Bulgarian description in the house voice, ' +
        '3–5 detail bullets, palette colours derived from the garment, and the ' +
        'measurements (sleeve/length/back in cm) read from any ruler or tape ' +
        'visible in a flat-lay photo — null for anything you cannot read from a ' +
        'visible scale. Describe only what you can actually see — do not invent ' +
        'certificates, ateliers, periods, fibre claims, or measurements.',
    },
  ]
}
