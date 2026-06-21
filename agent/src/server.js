#!/usr/bin/env node
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { z } from 'zod'
import { imageBlockFromBuffer } from './images.js'
import { generateFromImages } from './generate.js'

const here = dirname(fileURLToPath(import.meta.url))
const webDir = join(here, '..', 'web')

const HOST = '127.0.0.1'
const PORT = Number.parseInt(process.env.PORT || '4317', 10)

// Cap the JSON body so a runaway upload can't exhaust memory. A few 5MB images
// base64-encode to well under this.
const MAX_BODY = 40 * 1024 * 1024

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('Upload too large.'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

const requestSchema = z.object({
  type: z.enum(['haori', 'kimono']).optional(),
  images: z
    .array(z.object({ data: z.string().min(1), mediaType: z.string().min(1) }))
    .min(1, 'Add at least one photo.')
    .max(6, 'Up to 6 photos.'),
})

async function handleGenerate(req, res) {
  let payload
  try {
    payload = requestSchema.parse(JSON.parse((await readBody(req)).toString('utf8')))
  } catch (error) {
    const msg =
      error instanceof z.ZodError
        ? error.issues.map((i) => i.message).join('; ')
        : 'Invalid request body.'
    return send(res, 400, JSON.stringify({ error: msg }))
  }

  let imageBlocks
  try {
    imageBlocks = payload.images.map((img, i) =>
      imageBlockFromBuffer(Buffer.from(img.data, 'base64'), img.mediaType, `photo ${i + 1}`),
    )
  } catch (error) {
    return send(res, 400, JSON.stringify({ error: error.message }))
  }

  try {
    const { product, rationale, line } = await generateFromImages(imageBlocks, {
      type: payload.type,
    })
    return send(res, 200, JSON.stringify({ product, rationale, line }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return send(
        res,
        502,
        JSON.stringify({ error: 'Model returned an invalid product. Try again or use clearer photos.' }),
      )
    }
    // Friendly message for missing key / API errors thrown by anthropic.js.
    return send(res, 500, JSON.stringify({ error: error.message || 'Generation failed.' }))
  }
}

async function serveStatic(res) {
  try {
    const html = await readFile(join(webDir, 'index.html'), 'utf8')
    return send(res, 200, html, 'text/html; charset=utf-8')
  } catch {
    return send(res, 404, 'Not found', 'text/plain')
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/generate') {
    return handleGenerate(req, res)
  }
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    return serveStatic(res)
  }
  return send(res, 404, 'Not found', 'text/plain')
})

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Export it first:')
  console.error('  export ANTHROPIC_API_KEY=sk-ant-...')
  process.exit(1)
}

server.listen(PORT, HOST, () => {
  console.log(`Kinora agent web UI running at http://${HOST}:${PORT}`)
  console.log('The API key stays on this machine. Press Ctrl+C to stop.')
})
