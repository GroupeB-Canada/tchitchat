import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' })

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.email,
    line_items: [{ price: process.env.STRIPE_ADFREE_PRICE_ID!, quantity: 1 }],
    metadata: { userId: session.sub, email: session.email, plan: 'adfree' },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/abonnement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/abonnement`,
  })

  return NextResponse.redirect(checkout.url!, 303)
}
