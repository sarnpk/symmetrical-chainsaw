import { initializePaddle, type Paddle } from '@paddle/paddle-js'

let paddleInstance: Paddle | null = null

export function getPaddle(): Paddle | null {
  return paddleInstance
}

export async function initPaddle(): Promise<Paddle> {
  if (paddleInstance) return paddleInstance

  const paddle = await initializePaddle({
    seller: Number(process.env.NEXT_PUBLIC_PADDLE_SELLER_ID),
  })

  paddleInstance = paddle
  return paddle
}

export const PADDLE_PRICES: Record<string, string> = {
  'recovery-monthly': process.env.NEXT_PUBLIC_PADDLE_PRICE_RECOVERY_MONTHLY || '',
  'recovery-yearly': process.env.NEXT_PUBLIC_PADDLE_PRICE_RECOVERY_YEARLY || '',
  'empowerment-monthly': process.env.NEXT_PUBLIC_PADDLE_PRICE_EMPOWERMENT_MONTHLY || '',
  'empowerment-yearly': process.env.NEXT_PUBLIC_PADDLE_PRICE_EMPOWERMENT_YEARLY || '',
}

export function getPaddlePriceId(tier: string, billing: 'monthly' | 'yearly'): string {
  return PADDLE_PRICES[`${tier}-${billing}`] || ''
}
