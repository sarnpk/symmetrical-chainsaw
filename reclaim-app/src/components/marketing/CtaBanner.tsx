import Link from 'next/link'

interface CtaBannerProps {
  title: string
  lead?: string
  cta: { label: string; href: string }
}

export default function CtaBanner({ title, lead, cta }: CtaBannerProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-hope-600 px-6 py-14 sm:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 0, transparent 32%), radial-gradient(circle at 80% 70%, white 0, transparent 30%)',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-white">{title}</h2>
            {lead && <p className="mt-4 text-lg leading-relaxed text-brand-50">{lead}</p>}
            <Link
              href={cta.href}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-[15px] font-semibold text-brand-700 transition-all duration-200 hover:bg-brand-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 shadow-lift"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}