// Dependency-free OG image generator (Node built-ins only).
// Renders a 1920x1008 canvas (gradient + badge + bitmap-font wordmark),
// downscales to 1200x630, and encodes a real PNG via zlib.
// Usage: node scripts/generate-og.mjs  ->  public/og.png
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const SRC_W = 1920
const SRC_H = 1008
const OUT_W = 1200
const OUT_H = 630

// ---- 5x7 bitmap font (uppercase + punctuation needed) ----
const GLYPHS = {
  A: ['01010', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

// ---- helpers ----
const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

function gradientColor(t) {
  const c1 = hex('#6366f1')
  const c2 = hex('#7c6cf0')
  const c3 = hex('#c079d8')
  if (t <= 0.5) {
    const u = t * 2
    return [lerp(c1[0], c2[0], u), lerp(c1[1], c2[1], u), lerp(c1[2], c2[2], u)]
  }
  const u = (t - 0.5) * 2
  return [lerp(c2[0], c3[0], u), lerp(c2[1], c3[1], u), lerp(c2[2], c3[2], u)]
}

class Canvas {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.data = Buffer.alloc(w * h * 4)
  }
  set(x, y, [r, g, b, a = 255]) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
    const i = (y * this.w + x) * 4
    const bg = [this.data[i], this.data[i + 1], this.data[i + 2]]
    const t = a / 255
    this.data[i] = Math.round(lerp(bg[0], r, t))
    this.data[i + 1] = Math.round(lerp(bg[1], g, t))
    this.data[i + 2] = Math.round(lerp(bg[2], b, t))
    this.data[i + 3] = 255
  }
  fillRect(x, y, w, h, color) {
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) this.set(x + xx, y + yy, color)
  }
  inRoundRect(x, y, rx, ry, rw, rh, radius) {
    if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false
    const cxl = Math.max(rx + radius, Math.min(x, rx + rw - radius))
    const cyl = Math.max(ry + radius, Math.min(y, ry + rh - radius))
    return (x - cxl) ** 2 + (y - cyl) ** 2 <= radius ** 2
  }
  fillRoundRect(x, y, w, h, radius, color) {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      if (this.inRoundRect(xx, yy, x, y, w, h, radius)) this.set(xx, yy, color)
    }
  }
  inHeart(x, y, cx, cy, s) {
    const nx = (x - cx) / s
    const ny = (y - cy) / s
    const tri = ny >= -0.15 + 1.05 * (1 - Math.abs(nx))
    const dl = (nx + 0.5) ** 2 + (ny + 0.35) ** 2
    const dr = (nx - 0.5) ** 2 + (ny + 0.35) ** 2
    return tri || dl <= 0.25 || dr <= 0.25
  }
  drawHeart(cx, cy, s, color) {
    for (let yy = cy - s; yy <= cy + s; yy++) for (let xx = cx - s; xx <= cx + s; xx++) {
      if (this.inHeart(xx, yy, cx, cy, s)) this.set(xx, yy, color)
    }
  }
  drawText(x, y, text, scale, color) {
    let cx = x
    for (const ch of text.toUpperCase()) {
      const glyph = GLYPHS[ch] || GLYPHS[' ']
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          if (glyph[r][c] === '1') this.fillRect(cx + c * scale, y + r * scale, scale, scale, color)
        }
      }
      cx += 6 * scale
    }
  }
  textWidth(text, scale) {
    return text.length * 6 * scale
  }
}

// ---- render at 1.6x then bilinear-downscale ----
const src = new Canvas(SRC_W, SRC_H)

for (let y = 0; y < SRC_H; y++) {
  const [r, g, b] = gradientColor(y / SRC_H)
  for (let x = 0; x < SRC_W; x++) {
    const i = (y * SRC_W + x) * 4
    src.data[i] = r
    src.data[i + 1] = g
    src.data[i + 2] = b
    src.data[i + 3] = 255
  }
}

const bgWhite = [255, 255, 255, 255]
// badge
src.fillRoundRect(SRC_W / 2 - 100, 140, 200, 200, 44, [255, 255, 255, 36])
// heart
src.drawHeart(SRC_W / 2, 240, 58, bgWhite)

// wordmark
const wordText = 'Reclaim'
const wordScale = 24
const wordY = 410
src.drawText((SRC_W - src.textWidth(wordText, wordScale)) / 2, wordY, wordText, wordScale, bgWhite)

// divider
src.fillRoundRect(SRC_W / 2 - 200, wordY + 7 * wordScale + 40, 400, 6, 3, bgWhite)

// tagline
const tag1 = 'Turn your history into evidence.'
const tag2 = 'Your truth into recovery.'
const tagScale = 9
const tagY = wordY + 7 * wordScale + 84
src.drawText((SRC_W - src.textWidth(tag1, tagScale)) / 2, tagY, tag1, tagScale, [255, 255, 255, 235])
src.drawText((SRC_W - src.textWidth(tag2, tagScale)) / 2, tagY + 14 + 7 * tagScale, tag2, tagScale, [255, 255, 255, 235])

// ---- bilinear downscale to 1200x630 ----
const out = Buffer.alloc(OUT_W * OUT_H * 4)
for (let y = 0; y < OUT_H; y++) {
  for (let x = 0; x < OUT_W; x++) {
    const sx = ((x + 0.5) * SRC_W) / OUT_W - 0.5
    const sy = ((y + 0.5) * SRC_H) / OUT_H - 0.5
    const x0 = Math.floor(sx)
    const y0 = Math.floor(sy)
    const fx = clamp01(sx - x0)
    const fy = clamp01(sy - y0)
    const x1 = Math.min(SRC_W - 1, x0 + 1)
    const y1 = Math.min(SRC_H - 1, y0 + 1)
    const o = (y * OUT_W + x) * 4
    for (let c = 0; c < 4; c++) {
      const i00 = (y0 * SRC_W + x0) * 4 + c
      const i10 = (y0 * SRC_W + x1) * 4 + c
      const i01 = (y1 * SRC_W + x0) * 4 + c
      const i11 = (y1 * SRC_W + x1) * 4 + c
      const top = lerp(src.data[i00], src.data[i10], fx)
      const bottom = lerp(src.data[i01], src.data[i11], fx)
      out[o + c] = Math.round(lerp(top, bottom, fy))
    }
  }
}

// ---- PNG encode ----
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c >>> 0
}
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(OUT_W, 0)
ihdr.writeUInt32BE(OUT_H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // color type RGBA
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const raw = Buffer.alloc((OUT_W * 4 + 1) * OUT_H)
for (let y = 0; y < OUT_H; y++) {
  raw[y * (OUT_W * 4 + 1)] = 0
  out.copy(raw, y * (OUT_W * 4 + 1) + 1, y * OUT_W * 4, (y + 1) * OUT_W * 4)
}
const idat = deflateSync(raw, { level: 9 })

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
])

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og.png')
writeFileSync(dest, png)
console.log(`Wrote ${dest} (${OUT_W}x${OUT_H}, ${png.length} bytes)`)