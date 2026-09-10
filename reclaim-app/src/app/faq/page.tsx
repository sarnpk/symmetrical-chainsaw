import { Metadata } from 'next'
import FaqClient from './FaqClient'

export const metadata: Metadata = {
  title: 'FAQ â€” Your Questions About Reclaim, Answered',
  description: 'Privacy, court evidence, free tools, pricing, and safety â€” everything you need to know before starting your recovery journey with Reclaim.',
  alternates: {
    canonical: 'https://reclaimyourlife.app/faq',
  },
  openGraph: {
    title: 'FAQ â€” Your Questions About Reclaim, Answered',
    description: 'Answers about privacy, court evidence, free tools, pricing, and how Reclaim supports your recovery from narcissistic abuse.',
    type: 'website',
    url: 'https://reclaimyourlife.app/faq',
  },
}

export default function FaqPage() {
  return <FaqClient />
}
