import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyPaddleSignature(body: string, signature: string, secret: string): boolean {
  try {
    const parts = signature.split(';').reduce((acc: Record<string, string>, part) => {
      const [key, value] = part.split('=')
      if (key && value) acc[key.trim()] = value.trim()
      return acc
    }, {})

    const ts = parts['ts']
    const h1 = parts['h1']

    if (!ts || !h1) return false

    const tolerance = 600000
    if (Math.abs(Date.now() - Number(ts) * 1000) > tolerance) return false

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(process.env.PADDLE_API_KEY + ts + body)
    const expected = hmac.digest('hex')

    return crypto.timingSafeEqual(Buffer.from(h1, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

function mapPriceToTier(priceId: string): string | null {
  const tierMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_RECOVERY_MONTHLY || '']: 'recovery',
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_RECOVERY_YEARLY || '']: 'recovery',
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_EMPOWERMENT_MONTHLY || '']: 'empowerment',
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_EMPOWERMENT_YEARLY || '']: 'empowerment',
  }
  return tierMap[priceId] || null
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('paddle-signature')

  if (!signature || !process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_WEBHOOK_SECRET === 'whsec_your_paddle_webhook_secret_here') {
    if (process.env.PADDLE_WEBHOOK_SECRET === 'whsec_your_paddle_webhook_secret_here') {
      console.warn('Paddle webhook secret not configured â€” processing without verification')
    } else {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
  } else if (!verifyPaddleSignature(body, signature, process.env.PADDLE_WEBHOOK_SECRET)) {
    console.error('Paddle webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Paddle webhook received:', event.alert_name)

  try {
    switch (event.alert_name) {
      case 'transaction_completed':
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_succeeded': {
        const email = event.email || event.user?.email
        const priceId = event.items?.[0]?.price_id || event.price_id
        const subscriptionId = event.subscription_id
        const transactionId = event.transaction_id
        const amount = event.amount || event.payment_amount || 0
        const currency = event.currency || 'USD'
        const status = event.alert_name === 'subscription_payment_failed' ? 'failed' : 'succeeded'

        if (!email || !priceId) {
          console.warn('Paddle webhook: missing email or priceId', { email, priceId })
          break
        }

        const tier = mapPriceToTier(priceId)
        if (!tier) {
          console.warn('Paddle webhook: unknown priceId', priceId)
          break
        }

        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (user) {
          if (status === 'succeeded') {
            await supabase
              .from('profiles')
              .update({ subscription_tier: tier })
              .eq('id', user.id)
          }

          await supabase.from('payments').insert({
            user_id: user.id,
            stripe_payment_id: String(transactionId || ''),
            stripe_customer_id: String(subscriptionId || ''),
            amount: Number(amount) / 100,
            currency: currency.toLowerCase(),
            status,
            description: `Paddle ${tier} subscription`,
          })
        } else {
          console.warn('Paddle webhook: user not found for email', email)
        }
        break
      }

      case 'subscription_deleted': {
        const email = event.email || event.user?.email
        if (email) {
          const { data: user } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single()

          if (user) {
            await supabase
              .from('profiles')
              .update({ subscription_tier: 'foundation' })
              .eq('id', user.id)
          }
        }
        break
      }

      default:
        console.log('Paddle webhook: unhandled event', event.alert_name)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Paddle webhook error:', error)
    return NextResponse.json({ received: true })
  }
}
