'use client'

import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

interface QuizShellProps {
  children: ReactNode
}

export default function QuizShell({ children }: QuizShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}