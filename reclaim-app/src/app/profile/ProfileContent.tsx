'use client'

import { useState } from 'react'
import { 
  User,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Shield,
  BookOpen,
  Target,
  Clock,
  Star,
  CheckCircle,
  BarChart3
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  unlockedAt: string
  category: 'milestone' | 'streak' | 'feature' | 'community'
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Journal Entry',
    description: 'Completed your first journal entry',
    icon: BookOpen,
    unlockedAt: '2025-01-10',
    category: 'milestone'
  },
  {
    id: '2',
    title: '7-Day Streak',
    description: 'Journaled for 7 consecutive days',
    icon: Calendar,
    unlockedAt: '2025-01-16',
    category: 'streak'
  },
  {
    id: '3',
    title: 'Safety First',
    description: 'Created your first safety plan',
    icon: Shield,
    unlockedAt: '2025-01-12',
    category: 'feature'
  },
  {
    id: '4',
    title: 'Boundary Builder',
    description: 'Set your first healthy boundary',
    icon: Target,
    unlockedAt: '2025-01-14',
    category: 'feature'
  }
]

const mockStats = {
  journalEntries: 23,
  daysActive: 45,
  safetyPlanUpdates: 3,
  boundariesSet: 8,
  aiCoachSessions: 12,
  communityPosts: 5,
  currentStreak: 7,
  longestStreak: 14
}

export default function ProfileContent({ user, profile }: { user: any, profile: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'stats', name: 'Statistics', icon: BarChart3 }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-100 text-blue-800'
      case 'streak': return 'bg-green-100 text-green-800'
      case 'feature': return 'bg-purple-100 text-purple-800'
      case 'community': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {profile?.display_name?.[0] || user.email?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.display_name || 'User'}
            </h2>
            <p className="text-gray-600">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {profile?.subscription_tier || 'Foundation'} Plan
              </span>
              <span className="text-sm text-gray-500">
                {mockStats.daysActive} days active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStats.journalEntries}</p>
          <p className="text-sm text-gray-600">Journal Entries</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStats.boundariesSet}</p>
          <p className="text-sm text-gray-600">Boundaries Set</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStats.currentStreak}</p>
          <p className="text-sm text-gray-600">Current Streak</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{mockStats.aiCoachSessions}</p>
          <p className="text-sm text-gray-600">AI Coach Sessions</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {mockAchievements.slice(0, 3).map((achievement) => {
            const IconComponent = achievement.icon
            return (
              <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Achievements</h2>
        <p className="text-gray-600">Celebrate your progress on your healing journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAchievements.map((achievement) => {
          const IconComponent = achievement.icon
          return (
            <div key={achievement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                    {achievement.category}
                  </span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-gray-600 mb-3">{achievement.description}</p>
              <p className="text-sm text-gray-500">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Progress towards next achievements */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Achievements</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">30-Day Streak</span>
              <span className="text-sm text-gray-600">7/30 days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Community Helper</span>
              <span className="text-sm text-gray-600">5/10 posts</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStats = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Statistics</h2>
        <p className="text-gray-600">Track your progress and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Journal Activity</h3>
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Entries</span>
              <span className="font-medium">{mockStats.journalEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-medium">{mockStats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Longest Streak</span>
              <span className="font-medium">{mockStats.longestStreak} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Safety & Boundaries</h3>
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Safety Plan Updates</span>
              <span className="font-medium">{mockStats.safetyPlanUpdates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Boundaries Set</span>
              <span className="font-medium">{mockStats.boundariesSet}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community</h3>
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">AI Coach Sessions</span>
              <span className="font-medium">{mockStats.aiCoachSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Community Posts</span>
              <span className="font-medium">{mockStats.communityPosts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Over Time</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Activity chart would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <User className="h-8 w-8 text-indigo-600" />
          Your Profile
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Track your progress, view achievements, and see how far you've come on your healing journey.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'stats' && renderStats()}
      </div>
    </div>
  )
}
