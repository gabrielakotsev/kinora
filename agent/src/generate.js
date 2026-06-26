import { buildSystemPrompt, buildUserContent } from './prompt.js'
import { generateProduct } from './anthropic.js'
import { validateProduct } from './schema.js'
import { formatProduct } from './format.js'

/**
 * The shared pipeline used by both the CLI and the local web server.
 * Takes ready-built Anthropic image blocks (the CLI reads them from disk,
 * the web server decodes them from uploads) plus optional type/id, and returns
 * the validated product, its rationale, and the paste-ready PRODUCTS line.
 */
export async function generateFromImages(imageBlocks, { type, id } = {}) {
  const system = await buildSystemPrompt()
  const userContent = buildUserContent(imageBlocks, { type, id })

  const raw = await generateProduct({ system, userContent })
  const { product, rationale } = validateProduct(raw)
  const line = formatProduct(product, { id })

  return { product, rationale, line }
}
