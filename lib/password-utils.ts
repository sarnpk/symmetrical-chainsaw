import crypto from 'crypto'

const SALT_ROUNDS = 12
const HASH_ALGORITHM = 'sha256'
const PBKDF2_ITERATIONS = 100000

/**
 * Hash a password using PBKDF2 with a random salt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password with salt (format: salt:hash)
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(32).toString('hex')
    
    // Hash the password with the salt
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, 64, HASH_ALGORITHM, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The stored hash (format: salt:hash)
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, storedHash] = hash.split(':')
    
    if (!salt || !storedHash) {
      resolve(false)
      return
    }
    
    // Hash the provided password with the stored salt
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, 64, HASH_ALGORITHM, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(storedHash === derivedKey.toString('hex'))
    })
  })
}

/**
 * Generate a secure random password
 * @param length - Length of the password (default: 16)
 * @returns string - A secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length)
    password += charset[randomIndex]
  }
  
  return password
}
