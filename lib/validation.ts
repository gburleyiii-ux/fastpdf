import { z } from 'zod'

// UUID regex pattern
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Checkout request schema
export const checkoutSchema = z.object({
  userId: z.string().regex(uuidRegex, 'Invalid user ID format'),
  priceId: z.string().regex(/^price_[a-zA-Z0-9]+$/, 'Invalid price ID format'),
})

// Portal request schema
export const portalSchema = z.object({
  userId: z.string().regex(uuidRegex, 'Invalid user ID format'),
})

// User ID param schema
export const userIdSchema = z.object({
  userId: z.string().regex(uuidRegex, 'Invalid user ID format'),
})

// Price ID schema
export const priceIdSchema = z.object({
  priceId: z.string().regex(/^price_[a-zA-Z0-9]+$/, 'Invalid price ID format'),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type PortalInput = z.infer<typeof portalSchema>
