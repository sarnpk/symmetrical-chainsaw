import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import AppVersion from "../components/AppVersion"
import CookieBanner from "../components/CookieBanner"
import CrisisToolkitWidget from "../components/CrisisToolkitWidget"
import GoogleAnalytics from "../components/GoogleAnalytics"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display",
  weight: "variable",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reclaimyourlife.app"),
  title: {
    default: "Reclaim - Recovery Platform",
    template: "%s | Reclaim",
  },
  description: "Private AI-powered recovery tools for survivors of narcissistic abuse. Free assessment, gaslighting tracker, and court-ready documentation in 70+ languages.",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  themeColor: "#6366f1",
  openGraph: {
    type: "website",
    siteName: "Reclaim",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Reclaim â€” turn your history into evidence. Your truth into recovery.",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reclaim" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Reclaim',
                  url: 'https://reclaimyourlife.app',
                  logo: 'https://reclaimyourlife.app/favicon.svg',
                  description: 'AI-powered recovery tools for survivors of narcissistic abuse.',
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  name: 'Reclaim',
                  url: 'https://reclaimyourlife.app',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://reclaimyourlife.app/blog?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Reclaim',
                  applicationCategory: 'HealthApplication',
                  operatingSystem: 'Web',
                  offers: {
                    '@type': 'AggregateOffer',
                    lowPrice: '0',
                    highPrice: '24.99',
                    priceCurrency: 'USD',
                    offerCount: '3',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} ${fraunces.variable} antialiased bg-gray-50 min-h-screen`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <main className="min-h-screen">
          {children}
        </main>
        <CrisisToolkitWidget />
        <AppVersion />
        <CookieBanner />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
