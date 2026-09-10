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
  metadataBase: new URL("https://reclaim.app"),
  title: {
    default: "Reclaim - Recovery Platform",
    template: "%s | Reclaim",
  },
  description: "A secure digital recovery tool for survivors of narcissistic abuse",
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
        alt: "Reclaim — turn your history into evidence. Your truth into recovery.",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reclaim" />
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
