import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Reclaim - Recovery Platform",
  description: "A secure digital recovery tool for survivors of narcissistic abuse",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  themeColor: "#6366f1",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen preload`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                document.body.classList.remove('preload');
              });
            `,
          }}
        />
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
