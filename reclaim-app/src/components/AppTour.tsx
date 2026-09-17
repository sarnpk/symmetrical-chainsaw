'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

interface TourStep {
  target: string
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_KEY = 'reclaim_tour_completed'

const defaultSteps: TourStep[] = [
  {
    target: '[data-tour="quick-actions"]',
    title: 'Quick Actions',
    content: 'Tap these to jump straight to Document, AI Coach, Grey Rock, or Crisis Help.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: 'Your Tools',
    content: 'Everything is organized: Understand, Heal, Document, Protect, and Connect.',
    placement: 'right',
  },
  {
    target: '[data-tour="document"]',
    title: 'Document Incidents',
    content: 'Record what happened. AI helps you organize and title each entry.',
    placement: 'right',
  },
  {
    target: '[data-tour="ai-coach"]',
    title: 'AI Coach',
    content: 'Talk to a supportive AI that understands narcissistic abuse. Available 24/7.',
    placement: 'right',
  },
  {
    target: '[data-tour="crisis"]',
    title: 'Crisis Support',
    content: 'When you are spiraling, use Crisis Reframing or reach the 911 / hotline numbers here.',
    placement: 'right',
  },
  {
    target: '[data-tour="settings"]',
    title: 'Settings',
    content: 'Manage your profile, subscription, and privacy from here.',
    placement: 'right',
  },
]

function getTargetRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector)
  if (!el) return null
  return el.getBoundingClientRect()
}

function getTooltipPosition(targetRect: DOMRect, placement: string) {
  const gap = 12
  switch (placement) {
    case 'bottom':
      return { top: targetRect.bottom + gap, left: targetRect.left + targetRect.width / 2 }
    case 'top':
      return { top: targetRect.top - gap, left: targetRect.left + targetRect.width / 2 }
    case 'left':
      return { top: targetRect.top + targetRect.height / 2, left: targetRect.left - gap }
    case 'right':
    default:
      return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + gap }
  }
}

export function isTourCompleted(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(TOUR_KEY) === 'true'
}

export function resetTour() {
  localStorage.removeItem(TOUR_KEY)
}

export default function AppTour({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [visible, setVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStep = defaultSteps[step]
  const totalSteps = defaultSteps.length

  const updatePosition = useCallback(() => {
    if (!currentStep) return
    const rect = getTargetRect(currentStep.target)
    setTargetRect(rect)
    if (rect) {
      rect.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }, [currentStep])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(updatePosition, 300)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [step, visible, updatePosition])

  useEffect(() => {
    if (step >= totalSteps) {
      finish()
    }
  }, [step, totalSteps])

  function start() {
    setStep(0)
    setVisible(true)
    setTimeout(updatePosition, 100)
  }

  function finish() {
    setVisible(false)
    localStorage.setItem(TOUR_KEY, 'true')
    onComplete?.()
  }

  function next() {
    setStep((s) => s + 1)
  }

  function prev() {
    setStep((s) => Math.max(0, s - 1))
  }

  if (!visible || !currentStep || !targetRect) return null

  const pos = getTooltipPosition(targetRect, currentStep.placement || 'right')

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={finish} />

      {/* Highlight ring */}
      <div
        className="fixed z-[101] rounded-lg ring-4 ring-indigo-500 ring-offset-2 transition-all duration-300"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[102] w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          top: pos.top,
          left: Math.min(pos.left, window.innerWidth - 300),
          transform: currentStep.placement === 'bottom' || currentStep.placement === 'top'
            ? 'translateX(-50%)'
            : currentStep.placement === 'left'
            ? 'translateX(-100%)'
            : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">{currentStep.title}</span>
          </div>
          <button onClick={finish} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{currentStep.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-indigo-500' : i < step ? 'w-1.5 bg-indigo-300' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={prev} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {step === totalSteps - 1 ? 'Done' : 'Next'}
              {step < totalSteps - 1 && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export { AppTour, defaultSteps }
