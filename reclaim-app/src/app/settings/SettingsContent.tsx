'use client'

import { useState } from 'react'
import { 
  Settings,
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload
} from 'lucide-react'

export default function SettingsContent({ user, profile }: { user: any, profile: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'security' | 'data'>('profile')
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [showEmail, setShowEmail] = useState(false)
  const [notifications, setNotifications] = useState({
    journalReminders: true,
    safetyAlerts: true,
    weeklyReports: false,
    communityUpdates: true
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    shareProgress: false,
    allowMessages: false
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'data', name: 'Data', icon: Download }
  ]

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings...')
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your display name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type={showEmail ? 'email' : 'password'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
          <button
            type="button"
            onClick={() => setShowEmail(!showEmail)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showEmail ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tell us a bit about yourself (optional)"
        />
      </div>

      <div className="flex justify-end">
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

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={privacy.profileVisibility === 'private'}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="mr-3"
            />
            <div>
              <span className="font-medium">Private</span>
              <p className="text-sm text-gray-600">Only you can see your profile and progress</p>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="profileVisibility"
              value="community"
              checked={privacy.profileVisibility === 'community'}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="mr-3"
            />
            <div>
              <span className="font-medium">Community</span>
              <p className="text-sm text-gray-600">Visible to other community members</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sharing</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Share Progress</span>
              <p className="text-sm text-gray-600">Allow others to see your achievements and milestones</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.shareProgress}
              onChange={(e) => setPrivacy({ ...privacy, shareProgress: e.target.checked })}
              className="ml-3"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Allow Messages</span>
              <p className="text-sm text-gray-600">Let community members send you supportive messages</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.allowMessages}
              onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
              className="ml-3"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
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

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Journal Reminders</span>
              <p className="text-sm text-gray-600">Daily reminders to write in your journal</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.journalReminders}
              onChange={(e) => setNotifications({ ...notifications, journalReminders: e.target.checked })}
              className="ml-3"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Safety Alerts</span>
              <p className="text-sm text-gray-600">Important safety and security notifications</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.safetyAlerts}
              onChange={(e) => setNotifications({ ...notifications, safetyAlerts: e.target.checked })}
              className="ml-3"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Weekly Reports</span>
              <p className="text-sm text-gray-600">Summary of your progress and insights</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReports}
              onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
              className="ml-3"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Community Updates</span>
              <p className="text-sm text-gray-600">News and updates from the community</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.communityUpdates}
              onChange={(e) => setNotifications({ ...notifications, communityUpdates: e.target.checked })}
              className="ml-3"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
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

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 mb-4">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Update Password
        </button>
      </div>
    </div>
  )

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
        <p className="text-gray-600 mb-4">
          Download a copy of all your data including journal entries, safety plans, and progress reports.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All Data
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data</h3>
        <p className="text-gray-600 mb-4">
          Import data from a previous export or another platform.
        </p>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Data
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
          <p className="text-red-700 text-sm mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-indigo-600" />
          Settings
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Manage your account settings, privacy preferences, and data.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'data' && renderDataTab()}
      </div>
    </div>
  )
}
