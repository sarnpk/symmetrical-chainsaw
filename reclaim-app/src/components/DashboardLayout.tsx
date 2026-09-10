'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  Shield,
  BookOpen,
  Brain,
  BarChart3,
  PieChart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Heart,
  HeartPulse,
  Users,
  Target,
  RefreshCw,
  RotateCcw,
  Crown,
  CheckCircle,
  Briefcase,
  HeartHandshake,
  MessageSquare,
  FileText,
  AlertTriangle,
  Anchor,
  ShieldAlert,
  Bot,
  ChevronDown,
  ChevronRight,
  Plus,
  Wind,
  Sparkles
} from 'lucide-react'
import { Profile } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import Logo from '@/components/marketing/Logo'
import MobileNavbar from '@/ui/tailwindplus/MobileNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  profile: Profile | null
}

const navigationGroups = [
  {
    name: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ]
  },
  {
    name: 'Essentials',
    items: [
      { name: 'Journal', href: '/journal', icon: BookOpen },
      { name: 'Reality Anchor', href: '/reality-log', icon: Anchor },
      { name: 'Toxic Memories', href: '/toxic-memories', icon: AlertTriangle },
      { name: 'Letting Go', href: '/letting-go', icon: Wind },
      { name: 'Patterns', href: '/patterns', icon: BarChart3 },
    ]
  },
  {
    name: 'Protection',
    items: [
      { name: 'Grey Rock Templates', href: '/grey-rock-templates', icon: FileText },
      { name: 'Grey Rock Practice', href: '/grey-rock', icon: MessageSquare },
      { name: 'BIFF Assistant', href: '/biff-assistant', icon: MessageSquare },
      { name: 'Stonewalling', href: '/stonewalling', icon: Shield },
      { name: 'Reactive Abuse', href: '/reactive-abuse', icon: RotateCcw },
    ]
  },
  {
    name: 'Wellness',
    items: [
      { name: 'Wellness', href: '/wellness', icon: HeartPulse },
      { name: 'Crisis Reframe', href: '/crisis-reframe', icon: AlertTriangle },
      { name: 'Hope Reframe', href: '/hope-reframe', icon: Sparkles },
      { name: 'Healing', href: '/healing', icon: Sparkles },
      { name: 'Mind Reset', href: '/mind-reset', icon: Brain },
      { name: 'Belief Reframe', href: '/belief-reframe', icon: RefreshCw },
      { name: 'Affirmations', href: '/affirmations', icon: Sparkles },
      { name: 'Positive Moments', href: '/positive-moments', icon: Heart },
      { name: 'No Contact Anchor', href: '/no-contact-anchor', icon: ShieldAlert },
      { name: 'Acceptance', href: '/acceptance', icon: CheckCircle },
      { name: 'Role Reframing', href: '/role-reframing', icon: Briefcase },
    ]
  },
  {
    name: 'Analysis',
    items: [
      { name: 'Narcissist Detector', href: '/narcissist-detector', icon: AlertTriangle },
      { name: 'Narcissist Simulator', href: '/narcissist-simulator', icon: Bot },
      { name: 'Manipulation Decoder', href: '/manipulation-decoder', icon: MessageSquare },
      { name: 'Relationship Health', href: '/relationship-health', icon: Heart },
      { name: 'NPD Traits', href: '/npd-traits', icon: Target },
      { name: 'Gaslighting', href: '/gaslighting-tracker', icon: AlertTriangle },
      { name: 'Empathy Audit', href: '/empathy-audit', icon: HeartHandshake },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'AI Coach', href: '/ai-coach', icon: Brain },
      { name: 'Safety Plan', href: '/safety-plan', icon: Shield },
      { name: 'Community', href: '/community', icon: Users },
      { name: 'Feedback', href: '/feedback', icon: MessageSquare },
    ]
  },
  {
    name: 'Settings',
    items: [
      { name: 'Usage', href: '/usage', icon: PieChart },
      { name: 'Subscription', href: '/subscription', icon: Crown },
    ]
  },
]

export default function DashboardLayout({ children, user, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main', 'Essentials'])
  const pathname = usePathname()
  const supabase = createClient()

  // Auto-expand groups containing active page
  useEffect(() => {
    if (!pathname) return
    
    const activeGroup = navigationGroups.find(group => 
      group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    )
    if (activeGroup && !expandedGroups.includes(activeGroup.name)) {
      setExpandedGroups(prev => [...prev, activeGroup.name])
    }
  }, [pathname])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

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
      {/* Mobile sidebar overlay */}
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
            <div className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">Reclaim</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-4 px-4 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {navigationGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.name)
                const hasActiveItem = group.items.some(item => 
                  pathname === item.href || pathname.startsWith(item.href + '/')
                )
                
                return (
                  <div key={group.name}>
                    {group.name !== 'Main' && (
                      <button
                        onClick={() => toggleGroup(group.name)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        <span>{group.name}</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    )}
                    
                    {(group.name === 'Main' || isExpanded) && (
                      <ul className="space-y-1 mb-2">
                        {group.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  flex items-center px-3 py-2 text-nav rounded-lg transition-colors
                                  ${isActive 
                                    ? 'bg-indigo-100 text-indigo-700' 
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
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* User info and settings */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {profile?.display_name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-base font-medium text-gray-900 truncate">
                  {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {profile?.subscription_tier || 'foundation'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                href="/account"
                className="flex items-center px-3 py-2 text-nav text-gray-700 rounded-md hover:bg-gray-100 w-full"
              >
                <Users className="mr-3 h-4 w-4" />
                Account
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-nav text-gray-700 rounded-md hover:bg-gray-100 w-full"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 overflow-x-hidden">
        {/* Mobile header */}
        <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 max-w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 pt-24 lg:pt-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 