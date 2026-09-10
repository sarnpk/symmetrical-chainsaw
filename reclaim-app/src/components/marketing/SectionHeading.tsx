interface SectionHeadingProps {
  eyebrow?: string
  title: string
  lead?: string
  center?: boolean
  invert?: boolean
}

export default function SectionHeading({ eyebrow, title, lead, center = true, invert = false }: SectionHeadingProps) {
  return (
    <div className={center ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}>
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.08em] mb-3 ${invert ? 'text-hope-200' : 'text-brand-600'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-balance ${invert ? 'text-white' : ''}`}>{title}</h2>
      {lead && (
        <p className={`mt-4 text-lg leading-relaxed ${invert ? 'text-white/85' : 'text-ink-600'}`}>{lead}</p>
      )}
    </div>
  )
}