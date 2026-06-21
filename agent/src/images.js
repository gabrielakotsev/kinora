import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'

// Anthropic vision accepts these image media types.
const MEDIA_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

// Anthropic rejects images larger than ~5MB once base64-encoded.
const MAX_BYTES = 5 * 1024 * 1024

const ALLOWED_MEDIA_TYPES = new Set(Object.values(MEDIA_TYPES))

/**
 * Build an Anthropic image content block from an in-memory buffer.
 * Used by the web server, which already holds the bytes from an upload.
 * Validates media type and size; throws a clear error on either.
 */
export function imageBlockFromBuffer(buffer, mediaType, label = 'image') {
  if (!ALLOWED_MEDIA_TYPES.has(mediaType)) {
    throw new Error(
      `Unsupported image type "${mediaType}" for ${label}. ` +
        `Use one of: ${[...ALLOWED_MEDIA_TYPES].join(', ')}`,
    )
  }
  if (buffer.length > MAX_BYTES) {
    const mb = (buffer.length / 1024 / 1024).toFixed(1)
    throw new Error(`${label} is ${mb}MB — over the 5MB limit. Resize it and retry.`)
  }
  return {
    type: 'image',
    source: { type: 'base64', media_type: mediaType, data: buffer.toString('base64') },
  }
}

/**
 * Read image files and return them as Anthropic base64 image content blocks.
 * Throws a clear error on unsupported extensions or oversized files.
 */
export async function loadImages(paths) {
  if (!paths.length) {
    throw new Error('No photos provided.')
  }

  return Promise.all(
    paths.map(async (path) => {
      const ext = extname(path).toLowerCase()
      const mediaType = MEDIA_TYPES[ext]
      if (!mediaType) {
        throw new Error(
          `Unsupported image type "${ext || '(none)'}" for ${path}. ` +
            `Use one of: ${Object.keys(MEDIA_TYPES).join(', ')}`,
        )
      }

      let buffer
      try {
        buffer = await readFile(path)
      } catch (error) {
        throw new Error(`Could not read photo ${path}: ${error.message}`)
      }

      if (buffer.length > MAX_BYTES) {
        const mb = (buffer.length / 1024 / 1024).toFixed(1)
        throw new Error(
          `Photo ${path} is ${mb}MB — over the 5MB limit. Resize it and retry.`,
        )
      }

      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: buffer.toString('base64'),
        },
      }
    }),
  )
}
