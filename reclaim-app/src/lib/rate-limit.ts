import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest, identifier?: string) => {
    const key = identifier || getClientIdentifier(req)
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Clean old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
    
    const current = rateLimitStore.get(key)
    
    if (!current || current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
      return { success: true, remaining: config.maxRequests - 1 }
    }
    
    if (current.count >= config.maxRequests) {
      return { 
        success: false, 
        remaining: 0,
        resetTime: current.resetTime 
      }
    }
    
    current.count++
    return { success: true, remaining: config.maxRequests - current.count }
  }
}

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
  return `${ip}:${req.nextUrl.pathname}`
}

// Pre-configured rate limiters
export const adminRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }) // 100 requests per 15 minutes
export const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }) // 5 login attempts per 15 minutes