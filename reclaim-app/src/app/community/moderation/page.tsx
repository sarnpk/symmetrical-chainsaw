'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, Check, X, Ban, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase'

interface Report {
  id: string
  reporter_id: string
  target_user_id: string | null
  target_post_id: string | null
  target_comment_id: string | null
  reason: string
  description: string | null
  status: string
  created_at: string
}

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  hate_speech: 'Hate speech',
  self_harm: 'Self-harm content',
  inappropriate: 'Inappropriate',
  other: 'Other',
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user?.id || null))
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token || null))
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/community/moderation?status=${filter}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data.items || [])
      } else {
        const err = await res.json()
        toast.error(err.error || 'Access denied')
      }
    } catch { toast.error('Failed to load reports') }
    setLoading(false)
  }

  useEffect(() => { if (token) loadReports() }, [filter, token])

  const handleAction = async (reportId: string, action: string, targetUserId?: string) => {
    try {
      const body: any = { report_id: reportId }
      if (action === 'dismiss') body.status = 'dismissed'
      if (action === 'resolve') body.status = 'resolved'
      if (action === 'ban') { body.ban_user = true; body.target_user_id = targetUserId; body.status = 'resolved' }
      if (action === 'delete') { body.delete_content = true; body.status = 'resolved' }

      const res = await fetch('/api/community/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        toast.success(action === 'ban' ? 'User banned' : action === 'delete' ? 'Content deleted' : 'Updated')
        loadReports()
      } else {
        toast.error('Action failed')
      }
    } catch { toast.error('Action failed') }
  }

  return (
    <DashboardLayout currentUser={null} currentRole={undefined} impersonateTarget={undefined} isImpersonating={false}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Moderation Panel</h1>
            <p className="text-sm text-gray-500">Review reported content and take action</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['pending', 'reviewed', 'resolved', 'dismissed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No {filter} reports</div>
        ) : (
          <div className="space-y-4">
            {reports.map(r => (
              <div key={r.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-gray-900">{REASON_LABELS[r.reason] || r.reason}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                    {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
                    <div className="text-xs text-gray-400 mt-2">
                      {r.target_post_id && <span>Post: {r.target_post_id.slice(0, 8)}...</span>}
                      {r.target_user_id && <span> | User: {r.target_user_id.slice(0, 8)}...</span>}
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleAction(r.id, 'resolve')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Resolve">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleAction(r.id, 'dismiss')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Dismiss">
                        <X className="h-4 w-4" />
                      </button>
                      {r.target_user_id && (
                        <button onClick={() => handleAction(r.id, 'ban', r.target_user_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Ban user">
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      {r.target_post_id && (
                        <button onClick={() => handleAction(r.id, 'delete')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete content">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
