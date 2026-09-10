'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import FreeToolsMenu from './FreeToolsMenu'

interface UnifiedHeaderProps {
  currentTool?: string
  showAuth?: boolean
}

export default function UnifiedHeader({ currentTool, showAuth = true }: UnifiedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Reclaim" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">Reclaim</span>
              <span className="text-xs text-gray-500 leading-tight">Your Life</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <FreeToolsMenu currentTool={currentTool} />
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              FAQ
            </Link>
            <Link href="/donate" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
              ðŸ’œ Donate
            </Link>
            {showAuth && (
              <>
                <Link href="/auth" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-indigo-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <Link href="/free-narcissist-test" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              ðŸ” Free Narcissist Test
            </Link>
            <Link href="/gaslighting-reality-check" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              ðŸ‘ï¸ Gaslighting Reality Check
            </Link>
            <Link href="/discard-stage-test" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              ðŸ’” Discard Stage Test
            </Link>
            <div className="border-t my-2"></div>
            <Link href="/pricing" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              Pricing
            </Link>
            <Link href="/blog" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              Blog
            </Link>
            <Link href="/faq" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
              FAQ
            </Link>
            <Link href="/donate" className="block py-2 text-purple-600 hover:text-purple-700 font-semibold">
              ðŸ’œ Donate
            </Link>
            {showAuth && (
              <>
                <Link href="/auth" className="block py-2 text-gray-700 hover:text-indigo-600 font-medium">
                  Sign In
                </Link>
                <Link href="/auth" className="block py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-center">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
