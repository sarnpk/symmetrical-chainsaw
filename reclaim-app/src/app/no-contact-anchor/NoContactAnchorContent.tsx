'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2, AlertTriangle, TrendingDown, Calendar, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ToxicMemory {
  id: string
  title: string
  description: string
  incident_date: string
  abuse_types: string[]
  emotional_impact: string
}

interface WithdrawalEntry {
  id: string
  urge_intensity: number
  withdrawal_symptoms: string[]
  trigger_description: string
  how_resisted: string
  logged_at: string
}



interface Stats {
  daysNoContact: number
  totalUrgesLogged: number
  avgUrgeIntensity: number
}

interface Milestones {
  milestones: number[]
  nextMilestone: number | null
  daysUntilNext: number | null
}

export default function NoContactAnchorContent({ userId }: { userId: string }) {
  const [memories, setMemories] = useState<ToxicMemory[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalEntry[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [milestones, setMilestones] = useState<Milestones | null>(null)
  const [startDate, setStartDate] = useState('')
  const [showCrisis, setShowCrisis] = useState(false)
  const [showUrgeForm, setShowUrgeForm] = useState(false)
  const [showSetupForm, setShowSetupForm] = useState(false)

  const [urgeForm, setUrgeForm] = useState({
    urge_intensity: 5,
    withdrawal_symptoms: [] as string[],
    trigger_description: '',
    how_resisted: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const memoriesRes = await fetch('/api/toxic-memories')
      if (memoriesRes.ok) {
        const memoriesData = await memoriesRes.json()
        setMemories(Array.isArray(memoriesData) ? memoriesData : [])
      }

      const withdrawalsRes = await fetch('/api/no-contact-anchor/withdrawal')
      if (withdrawalsRes.ok) {
        const withdrawalsData = await withdrawalsRes.json()
        setWithdrawals(Array.isArray(withdrawalsData) ? withdrawalsData : [])
      }

      const statsRes = await fetch('/api/no-contact-anchor/stats')
      if (statsRes.ok) {
        setStats(await statsRes.json())
      }

      const milestonesRes = await fetch('/api/no-contact-anchor/milestones')
      if (milestonesRes.ok) {
        setMilestones(await milestonesRes.json())
      }

      const settingsRes = await fetch('/api/no-contact-anchor/settings')
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData?.no_contact_start_date) {
          setStartDate(settingsData.no_contact_start_date)
        } else {
          setShowSetupForm(true)
        }
      } else {
        setShowSetupForm(true)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const saveStartDate = async () => {
    const res = await fetch('/api/no-contact-anchor/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ no_contact_start_date: startDate })
    })
    if (res.ok) {
      toast.success('No contact start date set')
      setShowSetupForm(false)
      loadData()
    }
  }

  const logUrge = async () => {
    const res = await fetch('/api/no-contact-anchor/withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(urgeForm)
    })
    if (res.ok) {
      toast.success('Urge logged - You resisted! ðŸ’ª')
      setShowUrgeForm(false)
      setUrgeForm({ urge_intensity: 5, withdrawal_symptoms: [], trigger_description: '', how_resisted: '' })
      loadData()
    }
  }

  const deleteUrge = async (id: string) => {
    const res = await fetch(`/api/no-contact-anchor/withdrawal?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Urge log deleted')
      loadData()
    }
  }

  const symptoms = ['anxiety', 'panic', 'longing', 'anger', 'relief', 'confusion', 'sadness']

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              No Contact Anchor
            </h1>
            <button
              onClick={() => window.open('/docs/REALITY_ANCHOR_USER_GUIDE.html', '_blank')}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Reality Anchor User Guide"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Stay strong during withdrawal</p>
        </div>

        {stats && stats.daysNoContact > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 text-center">
            <div className="text-5xl font-bold mb-2">{stats.daysNoContact}</div>
            <div className="text-xl">Days No Contact ðŸ›¡ï¸</div>
            <div className="mt-4 text-sm opacity-90">
              {stats.totalUrgesLogged} urges logged â€¢ Avg intensity: {stats.avgUrgeIntensity}/10
            </div>
            {milestones?.nextMilestone && (
              <div className="mt-3 text-sm opacity-90">
                Next milestone: {milestones.nextMilestone} days ({milestones.daysUntilNext} days to go)
              </div>
            )}
          </div>
        )}

        {milestones && milestones.milestones.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">ðŸ† Milestones Achieved</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {milestones.milestones.map(days => (
                <div key={days} className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{days}</div>
                  <div className="text-sm">Days</div>
                  <div className="text-2xl mt-2">ðŸ†</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCrisis(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-lg text-xl flex items-center justify-center gap-3"
        >
          <AlertTriangle className="h-6 w-6" />
          Before You Contact Them - READ THIS
        </button>

        <div className="grid md:grid-cols-2 gap-4">
          <button onClick={() => setShowUrgeForm(true)} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500">
            <TrendingDown className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="font-semibold">Log Urge</div>
          </button>
          <button onClick={() => setShowSetupForm(true)} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold">Update Start Date</div>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Why I Left (From Toxic Memories)</h2>
          <div className="space-y-3">
            {memories.slice(0, 10).map(memory => (
              <div key={memory.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-gray-900">{memory.title}</p>
                <p className="text-sm text-gray-700 mt-1">{memory.description}</p>
                {memory.incident_date && <p className="text-xs text-gray-600 mt-1">{new Date(memory.incident_date).toLocaleDateString()}</p>}
              </div>
            ))}
            {memories.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No toxic memories yet. <a href="/toxic-memories" className="text-blue-600 underline">Add some</a> to strengthen your anchor.
              </p>
            )}
          </div>
        </div>

        {withdrawals.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">ðŸ“‰ Urge Intensity Trend</h2>
            <div className="relative h-64 mb-6">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="urgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="200" x2="800" y2="200" stroke="#e5e7eb" strokeWidth="2" />
                {[2, 4, 6, 8, 10].map(level => (
                  <g key={level}>
                    <line x1="0" y1={200 - (level * 20)} x2="800" y2={200 - (level * 20)} stroke="#f3f4f6" strokeWidth="1" />
                    <text x="5" y={205 - (level * 20)} fontSize="12" fill="#9ca3af">{level}</text>
                  </g>
                ))}
                <polyline
                  points={withdrawals.slice(0, 30).reverse().map((w, i) => 
                    `${(i / Math.max(withdrawals.length - 1, 1)) * 800},${200 - (w.urge_intensity * 20)}`
                  ).join(' ')}
                  fill="url(#urgeGradient)"
                  stroke="#f97316"
                  strokeWidth="3"
                />
                {withdrawals.slice(0, 30).reverse().map((w, i) => (
                  <circle
                    key={w.id}
                    cx={(i / Math.max(withdrawals.length - 1, 1)) * 800}
                    cy={200 - (w.urge_intensity * 20)}
                    r="4"
                    fill="#f97316"
                  />
                ))}
              </svg>
            </div>
            <p className="text-sm text-gray-600 text-center">Showing last {Math.min(withdrawals.length, 30)} urge logs</p>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Urge Log History</h2>
          <div className="space-y-3">
            {withdrawals.slice(0, 10).map(urge => (
              <div key={urge.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <span className="font-semibold text-orange-900">Intensity: {urge.urge_intensity}/10</span>
                    <span className="text-xs text-gray-600 ml-3">{new Date(urge.logged_at).toLocaleString()}</span>
                  </div>
                  <button onClick={() => deleteUrge(urge.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {urge.withdrawal_symptoms?.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {urge.withdrawal_symptoms.map(symptom => (
                      <span key={symptom} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">{symptom}</span>
                    ))}
                  </div>
                )}
                {urge.trigger_description && <p className="text-sm text-gray-700 mb-1"><strong>Trigger:</strong> {urge.trigger_description}</p>}
                {urge.how_resisted && <p className="text-sm text-green-700"><strong>How resisted:</strong> {urge.how_resisted}</p>}
              </div>
            ))}
            {withdrawals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No urges logged yet. Stay strong! ðŸ’ª</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Safe Contacts</h2>
          <p className="text-gray-500 text-center py-4">
            Manage your safe contacts in your <a href="/safety-plan" className="text-blue-600 underline font-semibold">Safety Plan</a>.
          </p>
        </div>

        {showCrisis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-red-600 mb-4">âš ï¸ BEFORE YOU CONTACT THEM</h2>
              
              <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                <p className="font-bold text-red-900 mb-2">ðŸš¨ STOP: This is Trauma Bond Withdrawal</p>
                <p className="text-sm text-red-800">The anxiety, panic, and longing you feel right now is a <strong>withdrawal symptom</strong>, not a sign you made a mistake. You cannot heal if you keep taking small doses of the drug. Every contact re-triggers the dependency.</p>
              </div>

              {stats && stats.daysNoContact > 0 && (
                <div className="bg-green-100 p-4 rounded-lg mb-6 text-center border-2 border-green-500">
                  <p className="text-2xl font-bold text-green-900">You're {stats.daysNoContact} days strong!</p>
                  <p className="text-green-800 font-semibold">Don't break your streak - the withdrawal will pass</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">ðŸ“ Why You Left (Your "Why I Left" List):</h3>
                <p className="text-sm text-gray-600 mb-3">In moments of weakness, you only remember the "good times." Here's the reality:</p>
                <div className="space-y-3">
                  {memories.slice(0, 5).map((memory, idx) => (
                    <div key={memory.id} className="p-3 bg-red-50 border-l-4 border-red-600">
                      <p className="font-semibold text-red-900">{idx + 1}. {memory.title}</p>
                      <p className="text-sm text-gray-700">{memory.description}</p>
                    </div>
                  ))}
                  {memories.length === 0 && (
                    <p className="text-gray-500 italic">No toxic memories documented yet. <a href="/toxic-memories" className="text-blue-600 underline">Add some</a> to strengthen your anchor.</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="font-bold text-yellow-900 mb-2">ðŸ’¡ Understanding Withdrawal</p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>This feeling is <strong>temporary</strong> - it will pass like a wave</li>
                  <li>Every contact resets your healing progress</li>
                  <li>The "good times" were part of the manipulation cycle</li>
                  <li>You deserve peace, not chaos</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-bold text-blue-900 mb-2">ðŸ“ž Call Someone Safe Instead:</p>
                <p className="text-sm text-blue-800 mb-3">Break the pattern. Reach out to your support network.</p>
                <a href="/safety-plan" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold">View Safety Plan Contacts â†’</a>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCrisis(false)} className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900">
                  I'm Staying Strong
                </button>
                <button onClick={() => setShowUrgeForm(true)} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700">
                  Log This Urge
                </button>
              </div>
            </div>
          </div>
        )}

        {showSetupForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold mb-4">Set No Contact Start Date</h3>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowSetupForm(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={saveStartDate} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </div>
          </div>
        )}

        {showUrgeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold mb-4">Log Urge to Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Urge Intensity: {urgeForm.urge_intensity}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={urgeForm.urge_intensity}
                    onChange={e => setUrgeForm({ ...urgeForm, urge_intensity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => {
                          const symp = urgeForm.withdrawal_symptoms.includes(symptom)
                            ? urgeForm.withdrawal_symptoms.filter(s => s !== symptom)
                            : [...urgeForm.withdrawal_symptoms, symptom]
                          setUrgeForm({ ...urgeForm, withdrawal_symptoms: symp })
                        }}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          urgeForm.withdrawal_symptoms.includes(symptom)
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  placeholder="What triggered this urge?"
                  value={urgeForm.trigger_description}
                  onChange={e => setUrgeForm({ ...urgeForm, trigger_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  placeholder="How did you resist?"
                  value={urgeForm.how_resisted}
                  onChange={e => setUrgeForm({ ...urgeForm, how_resisted: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowUrgeForm(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                  <button onClick={logUrge} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg">Log Urge</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
