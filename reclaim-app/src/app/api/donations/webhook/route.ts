import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers.get('stripe-signature')
    const body = await req.text()

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase
        .from('donations')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id)

      // Grant donor badge if user exists
      if (session.metadata?.user_id && session.metadata.user_id !== 'anonymous') {
        await supabase
          .from('profiles')
          .update({ is_donor: true })
          .eq('id', session.metadata.user_id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
