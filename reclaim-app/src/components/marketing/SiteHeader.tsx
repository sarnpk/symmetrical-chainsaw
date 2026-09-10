'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import Logo from './Logo'

const freeTools = [
  { name: 'Free Assessment', href: '/free-assessment' },
  { name: 'Relationship Health Check', href: '/relationship-health-check' },
  { name: 'Free Narcissist Test', href: '/free-narcissist-test' },
  { name: 'Discard Stage Test', href: '/discard-stage-test' },
  { name: 'Gaslighting Reality Check', href: '/gaslighting-reality-check' },
]

const navLinks = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
]

export default function SiteHeader({ showAuth = true }: { showAuth?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-ink-200/60 bg-white/85 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-soft' : ''
      }`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Reclaim home">
          <Logo className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-ink-900 tracking-tight">Reclaim</span>
            <span className="text-[11px] font-medium text-ink-500 tracking-wide">Your Life</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          <div className="relative group">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-700 hover:bg-brand-50 transition-colors">
              Free Tools
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
            <div className="absolute left-0 mt-1 w-64 rounded-xl border border-ink-200 bg-white p-2 shadow-lift opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
              {freeTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-700 hover:bg-brand-50 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/donate"
            className="ml-1 rounded-lg px-3 py-2 text-[15px] font-semibold text-hope-600 hover:text-hope-700 hover:bg-hope-50 transition-colors"
          >
            Donate
          </Link>
        </nav>

        {/* Desktop auth CTAs */}
        {showAuth && (
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/auth"
              className="rounded-lg px-4 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-ink-700 hover:bg-brand-50 transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-controls="mobile-menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-menu"
          className={`absolute right-0 top-0 h-full w-[min(20rem,85vw)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-ink-200/70 px-5 h-16">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-display text-lg font-semibold text-ink-900">Reclaim</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-ink-700 hover:bg-brand-50 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1" aria-label="Mobile">
            <Link
              href="/free-assessment"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-brand-700 hover:bg-brand-50"
            >
              Free Assessment
            </Link>
            <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Free Tools</p>
            {freeTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-brand-50"
              >
                {tool.name}
              </Link>
            ))}
            <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Reclaim</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-brand-50"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-hope-600 hover:bg-hope-50"
            >
              Donate
            </Link>
          </nav>

          {showAuth && (
            <div className="border-t border-ink-200/70 p-4 grid grid-cols-2 gap-3">
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-ink-300 px-4 py-3 text-[15px] font-semibold text-ink-800 hover:bg-ink-50"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-3 text-[15px] font-semibold text-white hover:bg-brand-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}