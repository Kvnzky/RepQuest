import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

function crc32(buf) {
  let table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    table[i] = c
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF]
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function createChunk(type, data) {
  const len = data.length
  const buf = Buffer.alloc(4 + 4 + len + 4)
  buf.writeUInt32BE(len, 0)
  buf.write(type, 4, 4, 'ascii')
  data.copy(buf, 8)
  const crcTarget = Buffer.alloc(4 + len)
  buf.copy(crcTarget, 0, 4, 8 + len)
  const crcVal = crc32(crcTarget)
  buf.writeUInt32BE(crcVal, 8 + len)
  return buf
}

function generatePng(size) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
  
  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace
  const ihdrChunk = createChunk('IHDR', ihdr)

  // Raw image data with scanline filter 0
  const rowSize = 1 + size * 4
  const raw = Buffer.alloc(rowSize * size)

  const center = size / 2
  const rCorner = size * 0.22

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize
    raw[rowOffset] = 0 // filter type none

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4

      // Rounded rectangle background check
      let inCard = false
      const dx = Math.abs(x - center)
      const dy = Math.abs(y - center)
      const maxInner = center - rCorner

      if (dx <= maxInner && dy <= center) inCard = true
      else if (dy <= maxInner && dx <= center) inCard = true
      else {
        const cornerDx = dx - maxInner
        const cornerDy = dy - maxInner
        if (cornerDx * cornerDx + cornerDy * cornerDy <= rCorner * rCorner) {
          inCard = true
        }
      }

      if (!inCard) {
        // Transparent
        raw[pxOffset] = 0
        raw[pxOffset + 1] = 0
        raw[pxOffset + 2] = 0
        raw[pxOffset + 3] = 0
        continue
      }

      // Card background: deep charcoal/slate gradient (#0f172a to #020617)
      const t = y / size
      let r = Math.round(15 * (1 - t) + 2 * t)
      let g = Math.round(23 * (1 - t) + 6 * t)
      let b = Math.round(42 * (1 - t) + 23 * t)

      // Stylized dumbbell & kinetic pulse in center
      const nx = (x - center) / (size * 0.4)
      const ny = (y - center) / (size * 0.4)

      // Central Barbell shaft: nx between -0.6 and 0.6, ny between -0.1 and 0.1
      if (Math.abs(ny) <= 0.08 && Math.abs(nx) <= 0.65) {
        // Cyan / Sky gradient
        r = 56; g = 189; b = 248
      }
      // Left weight plate
      if (Math.abs(nx + 0.55) <= 0.08 && Math.abs(ny) <= 0.5) {
        r = 6; g = 182; b = 212
      }
      if (Math.abs(nx + 0.72) <= 0.06 && Math.abs(ny) <= 0.35) {
        r = 14; g = 165; b = 233
      }
      // Right weight plate
      if (Math.abs(nx - 0.55) <= 0.08 && Math.abs(ny) <= 0.5) {
        r = 6; g = 182; b = 212
      }
      if (Math.abs(nx - 0.72) <= 0.06 && Math.abs(ny) <= 0.35) {
        r = 14; g = 165; b = 233
      }

      // Kinetic pulse zig-zag highlight across center
      // line: x=-0.4 y=0 -> x=-0.15 y=0 -> x=-0.05 y=-0.3 -> x=0.08 y=0.3 -> x=0.18 y=0 -> x=0.4 y=0
      let onPulse = false
      if (Math.abs(ny) <= 0.03 && (Math.abs(nx) <= 0.4)) onPulse = true
      if (Math.abs(ny - (nx * 3 + 0.15)) <= 0.04 && nx >= -0.15 && nx <= 0.05) onPulse = true
      if (Math.abs(ny - (-nx * 4 + 0.1)) <= 0.04 && nx >= -0.05 && nx <= 0.15) onPulse = true

      if (onPulse) {
        r = 255; g = 255; b = 255
      }

      raw[pxOffset] = r
      raw[pxOffset + 1] = g
      raw[pxOffset + 2] = b
      raw[pxOffset + 3] = 255
    }
  }

  const compressed = zlib.deflateSync(raw)
  const idatChunk = createChunk('IDAT', compressed)
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

const outDir = path.resolve('public')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const pwa192 = generatePng(192)
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), pwa192)

const pwa512 = generatePng(512)
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), pwa512)

const appleTouch = generatePng(180)
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleTouch)

console.log('Generated PWA icons successfully!')
