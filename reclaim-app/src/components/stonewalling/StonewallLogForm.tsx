'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StonewallLogForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    shutdown_type: 'silent_treatment',
    duration_minutes: '',
    trigger_context: '',
    emotional_state_before: 5,
    emotional_state_after: 5,
    impact_level: 5,
    your_response: '',
    what_you_needed: '',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    await fetch('/api/stonewalling/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => onSuccess?.(), 1500)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">âœ“</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Incident Logged</h3>
          <p className="text-gray-600">Redirecting...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-purple-50">
        <CardTitle className="text-purple-900">Log Stonewalling Incident</CardTitle>
        <p className="text-sm text-purple-700 mt-1">Document what happened to track patterns over time</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Type of Shutdown</Label>
            <select
              value={formData.shutdown_type}
              onChange={(e) => setFormData({ ...formData, shutdown_type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="silent_treatment">Silent Treatment</option>
              <option value="physical_withdrawal">Physical Withdrawal</option>
              <option value="topic_avoidance">Topic Avoidance</option>
              <option value="emotional_unavailability">Emotional Unavailability</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">Duration (minutes)</Label>
            <Input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              placeholder="e.g., 30, 120, 2880 (48 hours)"
              className="p-3 border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">What triggered it? *</Label>
            <textarea
              value={formData.trigger_context}
              onChange={(e) => setFormData({ ...formData, trigger_context: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., Asked about finances, mentioned therapy, set a boundary about needing personal time"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <Label className="text-sm font-semibold text-gray-700">Emotional State Before (1-10): <span className="text-blue-600 font-bold">{formData.emotional_state_before}</span></Label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.emotional_state_before}
              onChange={(e) => setFormData({ ...formData, emotional_state_before: parseInt(e.target.value) })}
              className="w-full mt-2 accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Calm</span>
              <span>Distressed</span>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <Label className="text-sm font-semibold text-gray-700">Emotional State After (1-10): <span className="text-red-600 font-bold">{formData.emotional_state_after}</span></Label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.emotional_state_after}
              onChange={(e) => setFormData({ ...formData, emotional_state_after: parseInt(e.target.value) })}
              className="w-full mt-2 accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Calm</span>
              <span>Distressed</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <Label className="text-sm font-semibold text-gray-700">Impact Level (1-10): <span className="text-purple-600 font-bold">{formData.impact_level}</span></Label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.impact_level}
              onChange={(e) => setFormData({ ...formData, impact_level: parseInt(e.target.value) })}
              className="w-full mt-2 accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minor</span>
              <span>Severe</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">What did you need?</Label>
            <textarea
              value={formData.what_you_needed}
              onChange={(e) => setFormData({ ...formData, what_you_needed: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., Acknowledgment that my needs matter, a simple conversation, emotional support"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700">Your Response</Label>
            <select
              value={formData.your_response}
              onChange={(e) => setFormData({ ...formData, your_response: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="gave_space">Gave them space</option>
              <option value="asked_questions">Asked questions</option>
              <option value="left_situation">Left the situation</option>
              <option value="waited_it_out">Waited it out</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Saving...' : 'Log Incident'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
