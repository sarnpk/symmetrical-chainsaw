import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const trustPoints = [
  'No signup required',
  'Instant results',
  '100% private & anonymous',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient wash */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-hope-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 uppercase tracking-wide">
              Free AI assessment â€” 30 seconds
            </p>

            <h1 className="mt-6 text-balance">
              Turn your history into evidence.{' '}
              <span className="bg-gradient-to-r from-brand-600 to-hope-600 bg-clip-text text-transparent">
                Your truth into recovery.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Reclaim is a private, AI-assisted journal and evidence platform for survivors of emotional and
              narcissistic abuse. Document what happened, learn the manipulation patterns, and build records that
              are secure â€” and admissibly formatted if you ever need them.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/free-assessment"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Start free assessment
              </Link>
              <Link
                href="/free-narcissist-test"
                className="inline-flex items-center justify-center rounded-lg border border-ink-300 bg-white px-7 py-3.5 text-[15px] font-semibold text-ink-800 transition-all duration-200 hover:bg-ink-50 hover:border-ink-400 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Explore free tools
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Benefits">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.5 text-sm text-ink-600">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual mock */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift">
              <div className="flex items-center gap-1.5 mb-5">
                <span className="h-2.5 w-2.5 rounded-full bg-dawn-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <span className="ml-3 text-xs font-medium text-ink-400">Reality Log · Evidence</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm text-white">⬢</span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">March 12 · 9:41 PM</p>
                      <p className="text-xs text-ink-500">Gaslighting · silent treatment</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-700">Recorded</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-hope-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hope-600 text-sm text-white">⬢</span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Manipulation decoded</p>
                      <p className="text-xs text-ink-500">Hoovering pattern detected</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-hope-700">AI</span>
                </div>
                <div className="rounded-lg border border-ink-200 px-4 py-3">
                  <p className="text-xs font-medium text-ink-500 mb-2">Healing progress</p>
                  <div className="h-2 rounded-full bg-ink-100">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-brand-500 to-hope-500" />
                  </div>
                </div>
              </div>
            </div>

            <span className="absolute -left-6 -bottom-5 float-c rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-medium text-ink-700 shadow-soft">
              ðŸ”’ AES-256 encrypted
            </span>
            <span className="absolute -right-4 -top-5 float-a rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-medium text-ink-700 shadow-soft">
              ðŸ“„ Court-ready export
            </span>
            <span className="absolute left-10 -bottom-7 float-b rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-medium text-ink-700 shadow-soft">
              ðŸŒ 70+ languages
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}