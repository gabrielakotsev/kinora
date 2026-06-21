import Anthropic from '@anthropic-ai/sdk'
import { productInputSchema } from './schema.js'

const MODEL = 'claude-opus-4-8'

/**
 * Send the photos + prompt to Claude and force a single structured tool call.
 * Returns the raw tool input object (still to be validated by schema.js).
 */
export async function generateProduct({ system, userContent }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Export it first:\n' +
        '  export ANTHROPIC_API_KEY=sk-ant-...',
    )
  }

  const client = new Anthropic()

  const tool = {
    name: 'emit_product',
    description: 'Emit one Kinora catalogue entry for the photographed garment.',
    input_schema: productInputSchema,
  }

  let response
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      tools: [tool],
      tool_choice: { type: 'tool', name: 'emit_product' },
      system,
      messages: [{ role: 'user', content: userContent }],
    })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error('Authentication failed — check ANTHROPIC_API_KEY.')
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error (${error.status}): ${error.message}`)
    }
    throw error
  }

  const toolUse = response.content.find(
    (block) => block.type === 'tool_use' && block.name === 'emit_product',
  )
  if (!toolUse) {
    throw new Error('Model did not return a product. Try again or add clearer photos.')
  }

  return toolUse.input
}
