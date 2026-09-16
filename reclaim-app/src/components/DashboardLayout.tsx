'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  Home,
  BookOpen,
  Anchor,
  AlertTriangle,
  Heart,
  RefreshCw,
  MessageSquare,
  FileText,
  Brain,
  Shield,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wind,
  Target,
  HeartPulse,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  PieChart,
  Crown,
  Gift,
  Search,
  Compass,
  Gauge,
  Stethoscope,
  Smile,
  Waves,
  Timer,
  Sunrise,
  Eye,
  HandHeart
} from 'lucide-react'
import { Profile } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import Logo from '@/components/marketing/Logo'
import MobileNavbar from '@/ui/tailwindplus/MobileNavbar'
import RedeemCodeModal from '@/components/RedeemCodeModal'
import AppVersion from '@/components/AppVersion'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  profile: Profile | null
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { type: 'divider' as const },
  { type: 'heading' as const, label: 'Document' },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Reality Anchor', href: '/reality-log', icon: Anchor },
  { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle },
  { name: 'Positive Moments', href: '/positive-moments', icon: Heart },
  { type: 'heading' as const, label: 'Analyze' },
  { name: 'Patterns', href: '/patterns', icon: TrendingUp },
  { name: 'Cognitive Dissonance', href: '/cognitive-dissonance', icon: Gauge },
  { name: 'Narcissist Detector', href: '/narcissist-detector', icon: Search },
  { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare },
  { name: 'Empathy Audit', href: '/empathy-audit', icon: Stethoscope },
  { name: 'Relationship Health', href: '/relationship-health', icon: HeartPulse },
  { name: 'Gaslighting Tracker', href: '/gaslighting-tracker', icon: Eye },
  { name: 'AI Coach', href: '/ai-coach', icon: Brain },
  { type: 'heading' as const, label: 'Understand' },
  { name: 'NPD Traits', href: '/npd-traits', icon: Target },
  { name: 'Letting Go', href: '/letting-go', icon: Wind },
  { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Compass },
  { name: 'Role Reframing', href: '/role-reframing', icon: RefreshCw },
  { type: 'heading' as const, label: 'Heal' },
  { name: 'Wellness', href: '/wellness', icon: HeartPulse },
  { name: 'Mind Reset', href: '/mind-reset', icon: Brain },
  { name: 'Belief Reframe', href: '/belief-reframe', icon: RefreshCw },
  { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles },
  { name: 'No Contact', href: '/no-contact-anchor', icon: ShieldAlert },
  { name: 'Acceptance', href: '/acceptance', icon: Smile },
  { name: 'Decompression', href: '/decompression', icon: Waves },
  { name: 'Mental Pause', href: '/mental-pause', icon: Timer },
  { name: 'Morning Intention', href: '/morning-intention', icon: Sunrise },
  { name: 'Urge Surfing', href: '/urge-surfing', icon: Wind },
  { type: 'heading' as const, label: 'Protect' },
  { name: 'Grey Rock', href: '/grey-rock', icon: FileText },
  { name: 'Crisis Reframe', href: '/crisis-reframe', icon: AlertTriangle },
  { name: 'Safety Plan', href: '/safety-plan', icon: Shield },
  { name: 'Boundary Builder', href: '/boundary-builder', icon: HandHeart },
  { name: 'Stonewalling', href: '/stonewalling', icon: Shield },
  { name: 'Reactive Abuse', href: '/reactive-abuse', icon: AlertTriangle },
  { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare },
  { type: 'heading' as const, label: 'Connect' },
  { name: 'Community', href: '/community', icon: Users },
  { type: 'divider' as const },
  { name: 'Settings', href: '/subscription', icon: Crown },
]

export default function DashboardLayout({ children, user, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [redeemOpen, setRedeemOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b sticky top-0 bg-white z-10">
            <Link href="/dashboard" className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">Reclaim</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-4 px-4 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item, i) => {
                if (item.type === 'heading') {
                  return (
                    <li key={`h-${item.label}`} className="pt-4 pb-1 px-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        {item.label}
                      </span>
                    </li>
                  )
                }
                if (item.type === 'divider') {
                  return <li key={`d-${i}`} className="border-t border-gray-200 my-2" />
                }
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-sm">
                  {profile?.display_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {profile?.subscription_tier || 'foundation'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setRedeemOpen(true)}
              className="flex items-center px-3 py-2 text-sm text-indigo-600 rounded-md hover:bg-indigo-50 w-full"
            >
              <Gift className="mr-3 h-4 w-4" />
              Redeem Code
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 w-full"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 overflow-x-hidden">
        <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 max-w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 pt-24 lg:pt-12">
            {children}
          </div>
        </main>
      </div>

      <RedeemCodeModal isOpen={redeemOpen} onClose={() => setRedeemOpen(false)} onSuccess={() => window.location.reload()} />
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30">
        <AppVersion />
      </div>
    </div>
  )
}
