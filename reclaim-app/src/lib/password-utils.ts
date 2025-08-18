// Browser-compatible password utilities using Web Crypto API
// Provides: hashPassword, verifyPassword, generateSecurePassword

const HASH_ALGORITHM = 'SHA-256'
const PBKDF2_ITERATIONS = 100_000
const KEY_LENGTH_BYTES = 64 // 512-bit

function bufToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBuf(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex')
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

async function deriveKey(password: string, salt: ArrayBuffer): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: HASH_ALGORITHM,
      iterations: PBKDF2_ITERATIONS,
      salt,
    },
    keyMaterial,
    KEY_LENGTH_BYTES * 8
  )
  return bits
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(32)).buffer
  const derived = await deriveKey(password, salt)
  return `${bufToHex(salt)}:${bufToHex(derived)}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [saltHex, storedHex] = hash.split(':')
    if (!saltHex || !storedHex) return false
    const saltBuf = hexToBuf(saltHex)
    const derived = await deriveKey(password, saltBuf)
    const derivedHex = bufToHex(derived)
    // Constant-time-ish comparison
    if (derivedHex.length !== storedHex.length) return false
    let diff = 0
    for (let i = 0; i < derivedHex.length; i++) diff |= derivedHex.charCodeAt(i) ^ storedHex.charCodeAt(i)
    return diff === 0
  } catch {
    return false
  }
}

export function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const out: string[] = []
  const random = new Uint32Array(length)
  crypto.getRandomValues(random)
  for (let i = 0; i < length; i++) {
    out.push(charset[random[i] % charset.length])
  }
  return out.join('')
}
