import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Pricing | Reclaim',
  description: 'Choose the plan that fits your recovery journey',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline">Home</Link>
        </div>
      </header>

      <main className="py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Choose Your Recovery Plan</h1>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Transparent, simple pricing. Upgrade anytime. Downgrade or cancel easily.
          </p>

          {/* Tier cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Foundation */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-green-700">Foundation (Free)</CardTitle>
                <div className="text-3xl font-bold">$0<span className="text-base font-normal">/mo</span></div>
                <CardDescription>Basic access for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 10 standard calls / month</li>
                  <li>✗ Audio transcription (0 minutes)</li>
                  <li>✓ ~5,000 input + ~1,750 output tokens</li>
                  <li>✓ Community support</li>
                  <li>✓ In-app usage tracking</li>
                </ul>
              </CardContent>
            </Card>

            {/* Recovery (Popular) */}
            <Card className="relative border-indigo-200 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-indigo-700">Recovery</CardTitle>
                <div className="text-3xl font-bold">$15.00<span className="text-base font-normal">/mo</span></div>
                <CardDescription>AI-powered recovery tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 1,200 standard calls / month (≈ 40/day)</li>
                  <li>✓ 60 transcription minutes / month</li>
                  <li>✓ ~715,200 input + ~222,000 output tokens</li>
                  <li>✓ Priority email support</li>
                  <li>✓ Faster response times</li>
                  <li>✓ Access to new AI features</li>
                </ul>
              </CardContent>
            </Card>

            {/* Empowered */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-purple-700">Empowered</CardTitle>
                <div className="text-3xl font-bold">$24.99<span className="text-base font-normal">/mo</span></div>
                <CardDescription>Complete recovery suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 1,830 standard calls / month (≈ 61/day)</li>
                  <li>✓ 300 transcription minutes / month</li>
                  <li>✓ ~1,476,000 input + ~348,000 output tokens</li>
                  <li>✓ Unlimited analysis runs (fair use)</li>
                  <li>✓ Premium support (24/7 chat)</li>
                  <li>✓ Priority queuing</li>
                  <li>✓ Custom pattern templates</li>
                  <li>✓ Early access to beta features</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Comparison table */}
          <div className="mt-16 overflow-x-auto">
            <table className="w-full max-w-6xl mx-auto text-sm border border-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3 border-b">Tier</th>
                  <th className="p-3 border-b">Price/Month</th>
                  <th className="p-3 border-b">Monthly Calls (Standard)</th>
                  <th className="p-3 border-b">Transcription Quota</th>
                  <th className="p-3 border-b">Approx. Tokens/Month</th>
                  <th className="p-3 border-b">Additional Benefits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-medium">Foundation (Free)</td>
                  <td className="p-3 border-b">$0</td>
                  <td className="p-3 border-b">10 calls</td>
                  <td className="p-3 border-b">0 minutes</td>
                  <td className="p-3 border-b">~5,000 input + ~1,750 output</td>
                  <td className="p-3 border-b">Basic access, community support, in-app usage tracking. No audio transcription.</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Recovery</td>
                  <td className="p-3 border-b">$15.00</td>
                  <td className="p-3 border-b">1,200 calls</td>
                  <td className="p-3 border-b">60 minutes/month</td>
                  <td className="p-3 border-b">~715,200 input + ~222,000 output</td>
                  <td className="p-3 border-b">Priority email support, faster response times, audio transcription (60 min/month), access to new AI features</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Empowered</td>
                  <td className="p-3 border-b">$24.99</td>
                  <td className="p-3 border-b">1,830 calls</td>
                  <td className="p-3 border-b">300 minutes/month</td>
                  <td className="p-3 border-b">~1,476,000 input + ~348,000 output</td>
                  <td className="p-3 border-b">Unlimited analysis runs (fair use), premium support (24/7 chat), priority queuing, custom pattern templates, audio transcription (300 min/month), early access to beta features</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 max-w-6xl mx-auto mt-3">
              Standard Calls: Title, chat, analysis, mind reset. Transcription minutes tracked separately (overages $0.10/min). Token counts include estimated transcription usage.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">Get Started</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
