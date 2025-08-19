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
                  <li>✓ Journal: up to 3 new titles per day</li>
                  <li>✓ AI Coach: up to 5 chats per day</li>
                  <li>✓ Patterns: 1 pattern check per day</li>
                  <li>✓ Mind Reset: 1 exercise per day</li>
                  <li>✓ Safety Plan & Boundary Builder: full access</li>
                  <li>✗ Audio transcription not included</li>
                  <li>✓ 100 MB secure file storage</li>
                  <li>✓ Community access & usage visible in the app</li>
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
                  <li>✓ Journal: plenty of new entries each day</li>
                  <li>✓ AI Coach: frequent daily chats</li>
                  <li>✓ Patterns: multiple checks per day</li>
                  <li>✓ Mind Reset: several exercises per day</li>
                  <li>✓ Safety Plan & Boundary Builder: full access</li>
                  <li>✓ 60 minutes of audio transcription each month</li>
                  <li>✓ 10 GB secure file storage</li>
                  <li>✓ Priority email support & faster answers</li>
                  <li>✓ Access to new features as they launch</li>
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
                  <li>✓ Journal: create freely every day</li>
                  <li>✓ AI Coach: long, ongoing conversations</li>
                  <li>✓ Patterns: "unlimited" checks (fair use)</li>
                  <li>✓ Mind Reset: many exercises daily</li>
                  <li>✓ Safety Plan & Boundary Builder: full access</li>
                  <li>✓ 300 minutes of audio transcription each month</li>
                  <li>✓ 100 GB secure file storage</li>
                  <li>✓ 24/7 chat support & priority queue</li>
                  <li>✓ Custom pattern templates & early beta access</li>
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
                  <th className="p-3 border-b">What you get</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-medium">Foundation (Free)</td>
                  <td className="p-3 border-b">
                    • Journal (3/day), AI Coach (5/day), Patterns (1/day), Mind Reset (1/day)
                    <br />• Full access to Safety Plan & Boundary Builder
                    <br />• 100 MB file storage, no audio transcription
                    <br />• Community access and in‑app usage tracking
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Recovery</td>
                  <td className="p-3 border-b">
                    • Plenty of daily use across Journal, AI Coach, Patterns, and Mind Reset
                    <br />• 60 minutes of audio transcription each month
                    <br />• 10 GB file storage
                    <br />• Priority email support, faster responses, early features
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Empowered</td>
                  <td className="p-3 border-b">
                    • Create freely every day across all features
                    <br />• 300 minutes of audio transcription each month
                    <br />• 100 GB file storage
                    <br />• "Unlimited" pattern checks (fair use), 24/7 chat support, priority queue
                    <br />• Custom templates and early beta access
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 max-w-6xl mx-auto mt-3">
              Notes: “Actions” are things like creating a journal title, chatting with the AI coach, running a pattern check, or doing a mind‑reset. Transcription minutes are counted separately. Fair‑use applies to unlimited analysis.
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
