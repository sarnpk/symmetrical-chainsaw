import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing â€” Start Free, Upgrade When Ready',
  description: 'Transparent pricing for Reclaim recovery tools. Free foundation plan with AI coaching, journal, and safety tools. Paid plans unlock court-ready exports and unlimited access. Cancel anytime.',
  alternates: {
    canonical: 'https://reclaimyourlife.app/pricing',
  },
  openGraph: {
    title: 'Pricing â€” Start Free, Upgrade When Ready | Reclaim',
    description: 'Free recovery tools for narcissistic abuse survivors. Paid plans from $14.99/mo with court-ready exports and unlimited AI coaching.',
    type: 'website',
    url: 'https://reclaimyourlife.app/pricing',
  },
}

export default function PricingPage() {
  return <PricingClient />
}
