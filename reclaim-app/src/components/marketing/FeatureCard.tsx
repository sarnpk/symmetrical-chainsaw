import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  href?: string
  badge?: string
  accent?: string
}

export default function FeatureCard({ icon: Icon, title, description, href, badge, accent = 'brand' }: FeatureCardProps) {
  const accents: Record<string, { icon: string; badge: string; ring: string }> = {
    brand: { icon: 'bg-brand-50 text-brand-600', badge: 'bg-brand-50 text-brand-700', ring: 'border-brand-200' },
    hope: { icon: 'bg-hope-50 text-hope-600', badge: 'bg-hope-50 text-hope-700', ring: 'border-hope-200' },
    green: { icon: 'bg-green-50 text-green-600', badge: 'bg-green-50 text-green-700', ring: 'border-green-200' },
    red: { icon: 'bg-dawn-50 text-dawn-600', badge: 'bg-dawn-50 text-dawn-600', ring: 'border-dawn-100' },
    blue: { icon: 'bg-blue-50 text-blue-600', badge: 'bg-blue-50 text-blue-700', ring: 'border-blue-200' },
    amber: { icon: 'bg-amber-50 text-amber-600', badge: 'bg-amber-50 text-amber-700', ring: 'border-amber-200' },
  }
  const a = accents[accent] || accents.brand

  const inner = (
    <div className={`flex h-full flex-col rounded-2xl border ${a.ring} bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift`}>
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${a.icon}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {badge && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.badge}`}>{badge}</span>}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
          Learn more
          <span aria-hidden="true">â†’</span>
        </span>
      )}
    </div>
  )

  return href ? (
    <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-2xl">
      {inner}
    </Link>
  ) : (
    inner
  )
}