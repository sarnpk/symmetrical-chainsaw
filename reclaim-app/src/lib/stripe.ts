import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

export { getStripe as stripe }

export const getStripeCustomerByEmail = async (email: string) => {
  const stripe = getStripe()
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })
  return customers.data[0] || null
}

export const createStripeCustomer = async (email: string, name?: string) => {
  const stripe = getStripe()
  return await stripe.customers.create({
    email,
    name,
  })
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  customerId?: string
) => {
  const stripe = getStripe()
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const createSubscription = async (
  customerId: string,
  priceId: string
) => {
  const stripe = getStripe()
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })
}
