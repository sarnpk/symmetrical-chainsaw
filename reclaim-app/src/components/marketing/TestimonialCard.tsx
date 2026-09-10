import { BadgeCheck } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  name: string
  context: string
  verified?: boolean
}

export default function TestimonialCard({ quote, name, context, verified = false }: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-ink-700">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {name.charAt(0)}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
            {name}
            {verified && <BadgeCheck className="h-4 w-4 text-brand-600" aria-label="Verified" />}
          </p>
          <p className="text-xs text-ink-500">{context}</p>
        </div>
      </figcaption>
    </figure>
  )
}