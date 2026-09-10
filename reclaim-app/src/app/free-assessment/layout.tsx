import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Relationship Health Assessment | Reclaim Recovery Platform',
  description: 'Take our free relationship health check to evaluate your relationship dynamics. Identify potential abuse patterns, get AI-powered insights, and access professional resources.',
  keywords: 'free relationship assessment, relationship health check, abuse detection, toxic relationship test, narcissistic abuse quiz, relationship evaluation tool',
  openGraph: {
    title: 'Free Relationship Health Check - Evaluate Your Relationship',
    description: 'Quick 8-question assessment to evaluate relationship dynamics and identify areas of concern. Get personalized insights and professional resources.',
    type: 'website',
    url: 'https://reclaimyourlife.app/free-assessment',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Free Relationship Health Assessment'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Relationship Health Assessment',
    description: 'Evaluate your relationship dynamics with our free assessment tool. Get insights and resources for healthier relationships.',
  },
  robots: 'index, follow',
  canonical: 'https://reclaimyourlife.app/free-assessment'
}

export default function FreeAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Relationship Health Assessment",
            "description": "Evaluate relationship dynamics and identify areas of concern with our free assessment tool",
            "url": "https://reclaimyourlife.app/free-assessment",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "Reclaim",
              "url": "https://reclaimyourlife.app"
            }
          })
        }}
      />
      {children}
    </>
  )
}