// Simple in-memory rate limiter
// For production, use Redis or a proper rate limiting service

type RateLimitStore = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

export function rateLimit(identifier: string, options: RateLimitOptions): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - options.windowMs
  
  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
  
  // Get or create entry
  const entry = store[identifier] || { count: 0, resetTime: now + options.windowMs }
  
  // Reset if window expired
  if (entry.resetTime < now) {
    entry.count = 0
    entry.resetTime = now + options.windowMs
  }
  
  // Check if allowed
  const allowed = entry.count < options.maxRequests
  
  if (allowed) {
    entry.count++
  }
  
  store[identifier] = entry
  
  return {
    allowed,
    remaining: Math.max(0, options.maxRequests - entry.count),
    resetTime: entry.resetTime,
  }
}

// Get client IP from request
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}
