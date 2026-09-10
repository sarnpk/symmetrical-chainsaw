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
  const [abuserGender, setAbuserGender] = useState(profile?.abuser_gender || '')
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || 'auto')
  const [hasChildren, setHasChildren] = useState(profile?.has_children || false)
  const [childrenCount, setChildrenCount] = useState(0)
  const [custodyArrangement, setCustodyArrangement] = useState(profile?.custody_arrangement || '')
  const [preferredFocus, setPreferredFocus] = useState<string[]>([])
  const [preferences, setPreferences] = useState<any>(null)
  const [entriesCount, setEntriesCount] = useState<number>(0)
  const [streakDays, setStreakDays] = useState<number>(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load affirmation preferences
        const { data: prefs } = await supabase
          .from('affirmation_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (prefs) {
          setPreferences(prefs)
          setHasChildren(prefs.has_children || false)
          setChildrenCount(prefs.children_count || 0)
          setCustodyArrangement(prefs.custody_situation || '')
          setPreferredFocus(prefs.preferred_focus || [])
        }

        const { count: countEntries, error: countErr } = await supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
        if (!countErr && typeof countEntries === 'number') {
          setEntriesCount(countEntries)
        }

        const { data: datesRows } = await supabase
          .from('journal_entries')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(365)

        const dates = (datesRows || []).map(r => new Date(r.created_at))
        setStreakDays(computeDailyStreak(dates))

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
    const set = new Set(dates.map(d => d.toISOString().slice(0, 10)))
    let streak = 0
    let cursor = new Date()
    while (true) {
      const key = cursor.toISOString().slice(0, 10)
      if (set.has(key)) {
        streak += 1
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
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          display_name: displayName,
          abuser_gender: abuserGender || null,
          preferred_language: preferredLanguage,
          has_children: hasChildren,
          custody_arrangement: custodyArrangement || null
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update or create affirmation preferences
      const { error: prefsError } = await supabase
        .from('affirmation_preferences')
        .upsert({
          user_id: user.id,
          has_children: hasChildren,
          children_count: childrenCount,
          custody_situation: custodyArrangement || null,
          preferred_focus: preferredFocus,
          updated_at: new Date().toISOString()
        })

      if (prefsError) throw prefsError
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Response Language
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Choose your preferred language for AI responses
            </p>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="auto">Auto-detect from my messages</option>
              <option value="en">English</option>
              <option value="ur">Urdu (Ø§Ø±Ø¯Ùˆ)</option>
              <option value="ar">Arabic (Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©)</option>
              <option value="es">Spanish (EspaÃ±ol)</option>
              <option value="fr">French (FranÃ§ais)</option>
              <option value="de">German (Deutsch)</option>
              <option value="it">Italian (Italiano)</option>
              <option value="pt">Portuguese (PortuguÃªs)</option>
              <option value="ru">Russian (Ð ÑƒÑÑÐºÐ¸Ð¹)</option>
              <option value="hi">Hindi (à¤¹à¤¿à¤¨à¥à¤¦à¥€)</option>
              <option value="bn">Bengali (à¦¬à¦¾à¦‚à¦²à¦¾)</option>
              <option value="zh">Chinese (ä¸­æ–‡)</option>
              <option value="ja">Japanese (æ—¥æœ¬èªž)</option>
              <option value="ko">Korean (í•œêµ­ì–´)</option>
              <option value="th">Thai (à¹„à¸—à¸¢)</option>
              <option value="vi">Vietnamese (Tiáº¿ng Viá»‡t)</option>
              <option value="id">Indonesian (Bahasa Indonesia)</option>
              <option value="ms">Malay (Bahasa Melayu)</option>
              <option value="tl">Filipino (Tagalog)</option>
              <option value="tr">Turkish (TÃ¼rkÃ§e)</option>
              <option value="fa">Persian (ÙØ§Ø±Ø³ÛŒ)</option>
              <option value="he">Hebrew (×¢×‘×¨×™×ª)</option>
              <option value="sw">Swahili (Kiswahili)</option>
              <option value="am">Amharic (áŠ áˆ›áˆ­áŠ›)</option>
              <option value="yo">Yoruba (YorÃ¹bÃ¡)</option>
              <option value="ig">Igbo (Asá»¥sá»¥ Igbo)</option>
              <option value="ha">Hausa (HarsÉ™n Hausa)</option>
              <option value="zu">Zulu (isiZulu)</option>
              <option value="xh">Xhosa (isiXhosa)</option>
              <option value="af">Afrikaans</option>
              <option value="nl">Dutch (Nederlands)</option>
              <option value="sv">Swedish (Svenska)</option>
              <option value="no">Norwegian (Norsk)</option>
              <option value="da">Danish (Dansk)</option>
              <option value="fi">Finnish (Suomi)</option>
              <option value="is">Icelandic (Ãslenska)</option>
              <option value="pl">Polish (Polski)</option>
              <option value="cs">Czech (ÄŒeÅ¡tina)</option>
              <option value="sk">Slovak (SlovenÄina)</option>
              <option value="hu">Hungarian (Magyar)</option>
              <option value="ro">Romanian (RomÃ¢nÄƒ)</option>
              <option value="bg">Bulgarian (Ð‘ÑŠÐ»Ð³Ð°Ñ€ÑÐºÐ¸)</option>
              <option value="hr">Croatian (Hrvatski)</option>
              <option value="sr">Serbian (Ð¡Ñ€Ð¿ÑÐºÐ¸)</option>
              <option value="bs">Bosnian (Bosanski)</option>
              <option value="mk">Macedonian (ÐœÐ°ÐºÐµÐ´Ð¾Ð½ÑÐºÐ¸)</option>
              <option value="sl">Slovenian (SlovenÅ¡Äina)</option>
              <option value="lv">Latvian (LatvieÅ¡u)</option>
              <option value="lt">Lithuanian (LietuviÅ³)</option>
              <option value="et">Estonian (Eesti)</option>
              <option value="mt">Maltese (Malti)</option>
              <option value="ga">Irish (Gaeilge)</option>
              <option value="cy">Welsh (Cymraeg)</option>
              <option value="eu">Basque (Euskera)</option>
              <option value="ca">Catalan (CatalÃ )</option>
              <option value="gl">Galician (Galego)</option>
              <option value="el">Greek (Î•Î»Î»Î·Î½Î¹ÎºÎ¬)</option>
              <option value="uk">Ukrainian (Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ°)</option>
              <option value="be">Belarusian (Ð‘ÐµÐ»Ð°Ñ€ÑƒÑÐºÐ°Ñ)</option>
              <option value="kk">Kazakh (ÒšÐ°Ð·Ð°Ò› Ñ‚Ñ–Ð»Ñ–)</option>
              <option value="ky">Kyrgyz (ÐšÑ‹Ñ€Ð³Ñ‹Ð· Ñ‚Ð¸Ð»Ð¸)</option>
              <option value="uz">Uzbek (OÊ»zbek tili)</option>
              <option value="tg">Tajik (Ð¢Ð¾Ò·Ð¸ÐºÓ£)</option>
              <option value="mn">Mongolian (ÐœÐ¾Ð½Ð³Ð¾Ð»)</option>
              <option value="my">Burmese (á€™á€¼á€”á€ºá€™á€¬á€…á€¬)</option>
              <option value="km">Khmer (áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš)</option>
              <option value="lo">Lao (àºžàº²àºªàº²àº¥àº²àº§)</option>
              <option value="si">Sinhala (à·ƒà·’à¶‚à·„à¶½)</option>
              <option value="ta">Tamil (à®¤à®®à®¿à®´à¯)</option>
              <option value="te">Telugu (à°¤à±†à°²à±à°—à±)</option>
              <option value="kn">Kannada (à²•à²¨à³à²¨à²¡)</option>
              <option value="ml">Malayalam (à´®à´²à´¯à´¾à´³à´‚)</option>
              <option value="gu">Gujarati (àª—à«àªœàª°àª¾àª¤à«€)</option>
              <option value="pa">Punjabi (à¨ªà©°à¨œà¨¾à¨¬à©€)</option>
              <option value="or">Odia (à¬“à¬¡à¬¼à¬¿à¬†)</option>
              <option value="as">Assamese (à¦…à¦¸à¦®à§€à¦¯à¦¼à¦¾)</option>
              <option value="ne">Nepali (à¤¨à¥‡à¤ªà¤¾à¤²à¥€)</option>
              <option value="mr">Marathi (à¤®à¤°à¤¾à¤ à¥€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Person You're Managing Interactions With
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This personalizes language and pronouns throughout the app
            </p>
            <select
              value={abuserGender}
              onChange={(e) => setAbuserGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Prefer not to say (uses they/them)</option>
              <option value="male">Male (uses he/him)</option>
              <option value="female">Female (uses she/her)</option>
              <option value="non-binary">Non-binary (uses they/them)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have children together?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasChildren"
                  checked={hasChildren === true}
                  onChange={() => setHasChildren(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasChildren"
                  checked={hasChildren === false}
                  onChange={() => setHasChildren(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {hasChildren && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many children?
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={childrenCount || ''}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custody arrangement
                </label>
                <select
                  value={custodyArrangement}
                  onChange={(e) => setCustodyArrangement(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select arrangement</option>
                  <option value="full">Full custody</option>
                  <option value="shared">Shared custody</option>
                  <option value="limited">Limited visitation</option>
                  <option value="supervised">Supervised visitation</option>
                  <option value="none">No contact/custody</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus areas for affirmations
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'children', label: "Children's wellbeing" },
                    { id: 'healing', label: 'Personal healing' },
                    { id: 'boundaries', label: 'Setting boundaries' },
                    { id: 'strength', label: 'Building strength' },
                    { id: 'clarity', label: 'Mental clarity' },
                    { id: 'peace', label: 'Inner peace' }
                  ].map((focus) => (
                    <label key={focus.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferredFocus.includes(focus.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredFocus([...preferredFocus, focus.id])
                          } else {
                            setPreferredFocus(preferredFocus.filter(f => f !== focus.id))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{focus.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          
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
            {isChangingPassword ? 'Updatingâ€¦' : 'Update Password'}
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
            <a href="mailto:support@reclaimyourlife.app?subject=Account%20Deletion%20Request" className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-500">
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
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <User className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          Account
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
          Manage your profile, settings, and account preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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

      <div>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'data' && renderDataTab()}
      </div>
    </div>
  )
}
