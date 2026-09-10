'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: readonly FaqItem[]
  defaultOpenIndex?: number
}

export default function FaqAccordion({ items, defaultOpenIndex = 0 }: FaqAccordionProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, index) => (
        <Disclosure key={item.question} defaultOpen={index === defaultOpenIndex}>
          {({ open }) => (
            <div className="rounded-xl border border-ink-200 bg-white transition-colors">
              <DisclosureButton className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl">
                <span className="text-[15px] font-semibold text-ink-900">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </DisclosureButton>
              <DisclosurePanel className="px-5 pb-5">
                <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  )
}