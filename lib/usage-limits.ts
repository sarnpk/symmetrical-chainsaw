// Centralized usage limits for AI and storage
export const AI_LIMITS = {
  foundation: 5, // free tier: 5 AI calls per month
  recovery: 200, // recovery tier: 200 AI calls per month
  empowerment: -1, // unlimited
} as const

export const STORAGE_LIMITS_BYTES = {
  foundation: 100 * 1024 * 1024, // 100 MB cap for free tier
  recovery: -1, // no cap for now
  empowerment: -1,
} as const

export type SubscriptionTier = keyof typeof AI_LIMITS
