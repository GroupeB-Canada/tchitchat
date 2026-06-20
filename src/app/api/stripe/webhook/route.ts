import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { upsertSubscriber, updateSubscriberStatus } from '@/lib/subscription'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.userId
    const email = sub.metadata?.email
    if (userId) {
      await upsertSubscriber({
        userId, email: email ?? '',
        stripeCustomerId: sub.customer as string,
        subscriptionId: sub.id,
        status: sub.status,
        currentPeriodEnd: (sub as any).current_period_end,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.userId
    if (userId) await updateSubscriberStatus(userId, 'canceled')
  }

  return NextResponse.json({ received: true })
}
