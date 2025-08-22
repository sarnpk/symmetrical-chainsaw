'use client'

import { useEffect, useState } from 'react'
import { 
  User,
  Settings,
  Shield,
  Bell,
  Download,
  Award,
  Calendar,
  BookOpen,
  TrendingUp,
  Heart,
  Target,
  Star,
  CheckCircle,
  Save,
  Trash2,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  unlockedAt: string
  category: 'milestone' | 'streak' | 'feature'
}

export default function AccountContent({ user, profile }: { user: any, profile: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'data'>('profile')
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [entriesCount, setEntriesCount] = useState<number>(0)
  const [streakDays, setStreakDays] = useState<number>(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  // Change password state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  // Load real stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Count journal entries
        const { count: countEntries, error: countErr } = await supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
        if (!countErr && typeof countEntries === 'number') {
          setEntriesCount(countEntries)
        }

        // Fetch entry dates to compute streak
        const { data: datesRows } = await supabase
          .from('journal_entries')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(365)

        const dates = (datesRows || []).map(r => new Date(r.created_at))
        setStreakDays(computeDailyStreak(dates))

        // Build simple dynamic achievements
        const a: Achievement[] = []
        if ((countEntries || 0) >= 1) {
          a.push({
            id: 'first-entry',
            title: 'First Journal Entry',
            description: 'Completed your first journal entry',
            icon: BookOpen,
            unlockedAt: dates[dates.length - 1]?.toISOString() || new Date().toISOString(),
            category: 'milestone',
          })
        }
        if ((countEntries || 0) >= 7) {
          a.push({
            id: 'seven-entries',
            title: '7 Entries Logged',
            description: 'Documented 7 experiences',
            icon: Award,
            unlockedAt: new Date().toISOString(),
            category: 'milestone',
          })
        }
        if (streakDays >= 3) {
          a.push({
            id: 'streak-3',
            title: '3-Day Streak',
            description: 'Journaled 3 days in a row',
            icon: Calendar,
            unlockedAt: new Date().toISOString(),
            category: 'streak',
          })
        }
        setAchievements(a)
      } catch (err) {
        console.error('Failed to load account stats', err)
      }
    }

    loadStats()
  }, [supabase, user?.id])

  function computeDailyStreak(dates: Date[]): number {
    if (!dates.length) return 0
    // Normalize to date strings (YYYY-MM-DD)
    const set = new Set(dates.map(d => d.toISOString().slice(0, 10)))
    let streak = 0
    let cursor = new Date()
    // Iterate backwards from today
    while (true) {
      const key = cursor.toISOString().slice(0, 10)
      if (set.has(key)) {
        streak += 1
        // move to previous day
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const tabs = [
    { id: 'profile', name: 'Profile & Progress', icon: User },
    { id: 'settings', name: 'Account Settings', icon: Settings },
    { id: 'data', name: 'Data & Security', icon: Download }
  ]

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/')
    }
  }

  const handleExport = async () => {
    try {
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const blob = new Blob([JSON.stringify({
        exported_at: new Date().toISOString(),
        user_id: user.id,
        journal_entries: entries || [],
      }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'reclaim-export.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export started')
    } catch (e) {
      console.error(e)
      toast.error('Failed to export')
    }
  }

  const handleChangePassword = async () => {
    try {
      if (!passwords.next || passwords.next.length < 8) {
        toast.error('Password must be at least 8 characters')
        return
      }
      if (passwords.next !== passwords.confirm) {
        toast.error('Passwords do not match')
        return
      }
      setIsChangingPassword(true)
      const { error } = await supabase.auth.updateUser({ password: passwords.next })
      if (error) throw error
      toast.success('Password updated')
      setPasswords({ current: '', next: '', confirm: '' })
    } catch (e) {
      console.error(e)
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'streak': return 'bg-green-100 text-green-800 border-green-200'
      case 'feature': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-xl">
              {profile?.display_name?.[0] || user.email?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.display_name || 'User'}</h2>
            <p className="text-gray-600 text-sm sm:text-base truncate max-w-[220px] sm:max-w-none">{user.email}</p>
            <p className="text-sm text-indigo-600 font-medium capitalize">
              {profile?.subscription_tier || 'foundation'} Plan
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{entriesCount}</div>
            <div className="text-sm text-gray-600">Journal Entries</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-6 w-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-gray-900">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon
            return (
              <div key={achievement.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            )
          })}
        </div>
      </div>
      {/* Global Save for profile/account changes */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subscription</label>
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
              <span className="capitalize font-medium">{profile?.subscription_tier || 'foundation'} Plan</span>
              <button onClick={() => router.push('/subscription')} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="bg-gray-900 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isChangingPassword ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        <ul role="list" className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm">
          <li className="flex items-center justify-between gap-x-6 py-4">
            <div>
              <h4 className="font-medium text-gray-900">Export data</h4>
              <p className="text-gray-600">Download all your journal entries and data</p>
            </div>
            <button onClick={handleExport} className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-500">
              <Download className="h-4 w-4" />
              Export
            </button>
          </li>
          <li className="flex items-center justify-between gap-x-6 py-4">
            <div>
              <h4 className="font-medium text-gray-900">Delete account</h4>
              <p className="text-gray-600">Contact support to request permanent deletion</p>
            </div>
            <a href="mailto:support@reclaim.app?subject=Account%20Deletion%20Request" className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
              Request Deletion
            </a>
          </li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5 sm:space-y-6 max-w-screen-md mx-auto px-3 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <User className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          Account
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
          Manage your profile, settings, and account preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Mobile select */}
        <div className="sm:hidden p-3">
          <label htmlFor="account-tab" className="sr-only">Select section</label>
          <select
            id="account-tab"
            className="w-full rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
          >
            {tabs.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        {/* Desktop/Tablet segmented buttons */}
        <div className="hidden sm:flex">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'data' && renderDataTab()}
      </div>
    </div>
  )
}
