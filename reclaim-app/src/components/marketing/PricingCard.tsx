import Link from 'next/link'
import { Check } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: readonly { label: string; included: boolean }[]
  cta: { label: string; href: string }
  popular?: boolean
  accent?: 'brand' | 'hope' | 'green'
}

export default function PricingCard({
  name,
  price,
  period = '/mo',
  description,
  features,
  cta,
  popular = false,
  accent = 'brand',
}: PricingCardProps) {
  const accents: Record<string, { title: string; btn: string; border: string }> = {
    brand: { title: 'text-brand-700', btn: 'bg-brand-600 hover:bg-brand-700', border: 'border-brand-300' },
    hope: { title: 'text-hope-700', btn: 'bg-hope-600 hover:bg-hope-700', border: 'border-hope-300' },
    green: { title: 'text-green-600', btn: 'bg-green-600 hover:bg-green-700', border: 'border-green-300' },
  }
  const a = accents[accent] || accents.brand

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 transition-all duration-200 ${
        popular ? `${a.border} shadow-lift lg:scale-[1.03]` : 'border-ink-200 shadow-soft'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <h3 className={`font-display text-xl font-semibold ${a.title}`}>{name}</h3>
      <p className="mt-1 text-sm text-ink-500">{description}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold text-ink-900">{price}</span>
        {period && <span className="text-sm text-ink-500">{period}</span>}
      </div>

      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2.5 text-ink-700">
            {feature.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            ) : (
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden="true" />
            )}
            <span className={feature.included ? '' : 'text-ink-500'}>{feature.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex-1 flex items-end">
        <Link
          href={cta.href}
          className={`inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${a.btn}`}
        >
          {cta.label}
        </Link>
      </div>
    </div>
  )
}