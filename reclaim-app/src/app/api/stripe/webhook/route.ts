import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PRICE_TO_TIER: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_RECOVERY_MONTHLY || '']: 'recovery',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_RECOVERY_YEARLY || '']: 'recovery',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EMPOWERMENT_MONTHLY || '']: 'empowerment',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EMPOWERMENT_YEARLY || '']: 'empowerment',
}

function mapPriceToTier(priceId: string): string | null {
  return PRICE_TO_TIER[priceId] || null
}

async function findUserByEmail(email: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()
  return data
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook received:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const email = session.customer_email || session.customer_details?.email
        const subscriptionId = session.subscription as string
        const priceId = session.metadata?.price_id

        if (!email || !priceId) {
          console.warn('checkout.session.completed: missing email or price_id', { email, priceId })
          break
        }

        const tier = mapPriceToTier(priceId)
        if (!tier) {
          console.warn('checkout.session.completed: unknown price_id', priceId)
          break
        }

        const user = await findUserByEmail(email)
        if (user) {
          await supabase
            .from('profiles')
            .update({ subscription_tier: tier })
            .eq('id', user.id)

          await supabase.from('payments').insert({
            user_id: user.id,
            stripe_payment_id: session.payment_intent as string || session.id,
            stripe_customer_id: session.customer as string || '',
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            status: 'succeeded',
            description: `Stripe ${tier} subscription`,
          })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: customer } = await getStripe().customers.retrieve(customerId)
        if (!customer || customer.deleted) break
        const email = customer.email
        if (!email) break

        const user = await findUserByEmail(email)
        if (!user) break

        if (event.type === 'customer.subscription.deleted') {
          await supabase
            .from('profiles')
            .update({ subscription_tier: 'foundation' })
            .eq('id', user.id)
        } else {
          const priceId = subscription.items.data[0]?.price?.id
          if (priceId) {
            const tier = mapPriceToTier(priceId)
            if (tier) {
              await supabase
                .from('profiles')
                .update({ subscription_tier: tier })
                .eq('id', user.id)
            }
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const email = invoice.customer_email || ''
        const user = email ? await findUserByEmail(email) : null

        if (user) {
          await supabase.from('payments').insert({
            user_id: user.id,
            stripe_payment_id: invoice.payment_intent as string || invoice.id,
            stripe_customer_id: invoice.customer as string || '',
            amount: (invoice.amount_paid || 0) / 100,
            currency: invoice.currency || 'usd',
            status: 'succeeded',
            description: 'Subscription payment',
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const email = invoice.customer_email || ''
        const user = email ? await findUserByEmail(email) : null

        if (user) {
          await supabase.from('payments').insert({
            user_id: user.id,
            stripe_payment_id: invoice.payment_intent as string || invoice.id,
            stripe_customer_id: invoice.customer as string || '',
            amount: (invoice.amount_due || 0) / 100,
            currency: invoice.currency || 'usd',
            status: 'failed',
            description: 'Subscription payment failed',
          })
        }
        break
      }

      default:
        console.log('Stripe webhook: unhandled event', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ received: true })
  }
}
