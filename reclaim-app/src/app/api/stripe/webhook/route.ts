import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    if (event.type.includes('invoice.payment')) {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.customer_email) {
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', invoice.customer_email)
          .single()

        if (user) {
          await supabase.from('payments').insert({
            user_id: user.id,
            stripe_payment_id: invoice.payment_intent as string,
            stripe_customer_id: invoice.customer as string,
            amount: (invoice.amount_paid || 0) / 100,
            currency: invoice.currency || 'usd',
            status: event.type === 'invoice.payment_succeeded' ? 'succeeded' : 'failed',
            description: 'Subscription payment',
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true })
  }
}