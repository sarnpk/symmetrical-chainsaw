import { ShieldCheck, Lock, Languages, FileCheck2 } from 'lucide-react'

const items = [
  { icon: ShieldCheck, label: 'AES-256 encrypted' },
  { icon: Lock, label: 'Never sold or trained on' },
  { icon: Languages, label: '70+ languages' },
  { icon: FileCheck2, label: 'Court-ready PDF exports' },
]

export default function TrustBar() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Trust and privacy">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center">
            {i > 0 && <span className="hidden sm:block mr-8 h-1 w-1 rounded-full bg-ink-300" aria-hidden="true" />}
            <span className="flex items-center gap-2 text-sm font-medium text-ink-600">
              <item.icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}