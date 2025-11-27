import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { data: customer } = await stripe.customers.retrieve(paymentIntent.customer as string)
  
  if (!customer || customer.deleted) return

  // Find user by email
  const { data: user } = await supabase
    .from('profiles')
    .select('id, subscription_tier')
    .eq('email', customer.email)
    .single()

  if (!user) return

  // Record payment
  await supabase.from('payments').insert({
    user_id: user.id,
    stripe_payment_id: paymentIntent.id,
    stripe_customer_id: customer.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'succeeded',
    subscription_tier: user.subscription_tier,
    payment_method: paymentIntent.payment_method_types[0],
    description: paymentIntent.description || 'Subscription payment',
  })
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { data: customer } = await stripe.customers.retrieve(paymentIntent.customer as string)
  
  if (!customer || customer.deleted) return

  const { data: user } = await supabase
    .from('profiles')
    .select('id, subscription_tier')
    .eq('email', customer.email)
    .single()

  if (!user) return

  await supabase.from('payments').insert({
    user_id: user.id,
    stripe_payment_id: paymentIntent.id,
    stripe_customer_id: customer.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'failed',
    subscription_tier: user.subscription_tier,
    payment_method: paymentIntent.payment_method_types[0],
    description: paymentIntent.description || 'Failed subscription payment',
  })
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  if (!invoice.customer_email) return

  const { data: user } = await supabase
    .from('profiles')
    .select('id, subscription_tier')
    .eq('email', invoice.customer_email)
    .single()

  if (!user) return

  await supabase.from('payments').insert({
    user_id: user.id,
    stripe_payment_id: invoice.payment_intent as string,
    stripe_customer_id: invoice.customer as string,
    amount: (invoice.amount_paid || 0) / 100,
    currency: invoice.currency || 'usd',
    status: invoice.status === 'paid' ? 'succeeded' : 'failed',
    subscription_tier: user.subscription_tier,
    description: `Subscription payment - ${invoice.lines.data[0]?.description || 'Monthly subscription'}`,
  })
}