import Link from 'next/link'
import Logo from './Logo'

const exploreLinks = [
  { name: 'Free Assessment', href: '/free-assessment' },
  { name: 'Relationship Health', href: '/relationship-health-check' },
  { name: 'Pattern Awareness Quiz', href: '/free-narcissist-test' },
  { name: 'Relationship Stage Check', href: '/discard-stage-test' },
]

const companyLinks = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Refund Policy', href: '/refund-policy' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Data Rights (GDPR)', href: '/gdpr' },
  { name: 'Contact', href: 'mailto:support@reclaimyourlife.app' },
]

export default function ComplianceFooter() {
  return (
    <footer className="border-t border-ink-200/70 bg-ink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" scroll className="flex items-center gap-2.5" aria-label="Reclaim home">
              <Logo className="h-9 w-9" />
              <span className="font-display text-lg font-semibold text-ink-900 tracking-tight">Reclaim</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 max-w-xs">
              A private, AI-assisted journal and personal clarity platform that helps people
              document their experiences, understand relationship patterns, and
              rebuild clarity — in 70+ languages.
            </p>
            <p className="mt-6 rounded-lg border border-dawn-100 bg-dawn-50 px-4 py-3 text-xs leading-relaxed text-ink-700">
              <span className="font-semibold text-dawn-600">If you are in immediate danger,</span> call{' '}
              <span className="font-semibold">911</span> or the National Domestic Violence Hotline at{' '}
              <span className="font-semibold">1-800-799-7233</span>.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} scroll className="text-sm text-ink-700 hover:text-brand-700 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} scroll className="text-sm text-ink-700 hover:text-brand-700 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} scroll className="text-sm text-ink-700 hover:text-brand-700 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-200/70 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-500">
            &copy; {new Date().getFullYear()} Reclaim. Your safety and privacy are our priority.
          </p>
          <p className="text-xs text-ink-400 max-w-md text-center sm:text-right">
            Educational and support purposes only. Always consult qualified professionals for medical or legal advice.
          </p>
        </div>
      </div>
    </footer>
  )
}