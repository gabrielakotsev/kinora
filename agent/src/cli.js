#!/usr/bin/env node
import { z } from 'zod'
import { loadImages } from './images.js'
import { generateFromImages } from './generate.js'

const USAGE = `kinora-agent — photo → ready-to-paste PRODUCTS object

Usage:
  kinora-agent <photo...> [--type haori|kimono] [--id N] [--explain]

Arguments:
  <photo...>        one or more image files of a single garment (jpg/png/webp/gif)

Options:
  --type <t>        hint the garment type (haori or kimono); inferred if omitted
  --id <N>          numeric PRODUCTS id to embed; a marker is used if omitted
  --explain         print the price rationale on stdout (default: stderr)
  -h, --help        show this help

Environment:
  ANTHROPIC_API_KEY   required

Example:
  export ANTHROPIC_API_KEY=sk-ant-...
  node src/cli.js ./haori-front.jpg ./haori-back.jpg --type haori`

function parseArgs(argv) {
  const photos = []
  let type
  let id
  let explain = false

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-h' || a === '--help') return { help: true }
    else if (a === '--explain') explain = true
    else if (a === '--type') {
      type = argv[++i]
      if (type !== 'haori' && type !== 'kimono') {
        throw new Error('--type must be "haori" or "kimono"')
      }
    } else if (a === '--id') {
      const raw = argv[++i]
      id = Number.parseInt(raw, 10)
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('--id must be a positive integer')
      }
    } else if (a.startsWith('--')) {
      throw new Error(`Unknown option: ${a}`)
    } else {
      photos.push(a)
    }
  }

  return { photos, type, id, explain }
}

async function main() {
  let args
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`)
    process.exit(2)
  }

  if (args.help) {
    console.log(USAGE)
    return
  }

  if (!args.photos.length) {
    console.error(`No photos provided.\n\n${USAGE}`)
    process.exit(2)
  }

  const images = await loadImages(args.photos)

  let product, rationale, line
  try {
    ;({ product, rationale, line } = await generateFromImages(images, {
      type: args.type,
      id: args.id,
    }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Model output failed validation:')
      console.error(error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'))
      process.exit(1)
    }
    throw error
  }

  const rationaleText = `price: ${product.price} € — ${rationale}`

  if (args.explain) {
    // Everything on stdout when explicitly asked.
    console.log(line)
    console.log(`\n// ${rationaleText}`)
  } else {
    // Clean object on stdout (pipe-friendly); rationale on stderr.
    console.log(line)
    console.error(rationaleText)
  }
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
