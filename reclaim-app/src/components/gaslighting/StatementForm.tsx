'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StatementForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    statement_date: new Date().toISOString().split('T')[0],
    their_claim: '',
    topic: 'relationship',
    context: '',
    actual_truth: '',
    your_memory: '',
    has_evidence: false,
    evidence_type: '',
    gaslighting_severity: 5,
    impact_on_you: 5
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    await fetch('/api/gaslighting/statements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    setLoading(false)
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Gaslighting</CardTitle>
        <p className="text-sm text-gray-600">Document what they said vs what actually happened</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.statement_date}
              onChange={(e) => setFormData({ ...formData, statement_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Topic</Label>
            <select
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="finances">Finances</option>
              <option value="parenting">Parenting</option>
              <option value="relationship">Relationship</option>
              <option value="past_events">Past Events</option>
              <option value="your_behavior">Your Behavior</option>
              <option value="their_behavior">Their Behavior</option>
            </select>
          </div>

          <div>
            <Label>What They Claimed *</Label>
            <textarea
              value={formData.their_claim}
              onChange={(e) => setFormData({ ...formData, their_claim: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="e.g., 'I never said that', 'You're remembering it wrong', 'That never happened'"
              required
            />
          </div>

          <div>
            <Label>What Actually Happened *</Label>
            <textarea
              value={formData.actual_truth}
              onChange={(e) => setFormData({ ...formData, actual_truth: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="The objective truth of what happened"
              required
            />
          </div>

          <div>
            <Label>Your Memory</Label>
            <textarea
              value={formData.your_memory}
              onChange={(e) => setFormData({ ...formData, your_memory: e.target.value })}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="Your detailed recollection"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.has_evidence}
                onChange={(e) => setFormData({ ...formData, has_evidence: e.target.checked })}
              />
              I have evidence
            </Label>
          </div>

          {formData.has_evidence && (
            <div>
              <Label>Evidence Type</Label>
              <select
                value={formData.evidence_type}
                onChange={(e) => setFormData({ ...formData, evidence_type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select...</option>
                <option value="text_message">Text Message</option>
                <option value="email">Email</option>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="witness">Witness</option>
                <option value="document">Document</option>
              </select>
            </div>
          )}

          <div>
            <Label>Gaslighting Severity (1-10): {formData.gaslighting_severity}</Label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.gaslighting_severity}
              onChange={(e) => setFormData({ ...formData, gaslighting_severity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
