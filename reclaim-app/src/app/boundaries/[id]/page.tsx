'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Info } from 'lucide-react'

interface BoundaryRow {
  id: string
  user_id: string
  title: string
  description: string
  category: 'communication' | 'emotional' | 'physical' | 'time' | 'social' | 'workplace'
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'working-on' | 'needs-attention'
  is_active: boolean
  last_reviewed: string | null
  created_at: string
  updated_at: string
}

const CATEGORY_OPTIONS: BoundaryRow['category'][] = ['communication','emotional','physical','time','social','workplace']
const PRIORITY_OPTIONS: BoundaryRow['priority'][] = ['high','medium','low']
const STATUS_OPTIONS: BoundaryRow['status'][] = ['active','working-on','needs-attention']

export default function BoundaryDetailPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [record, setRecord] = useState<BoundaryRow | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<BoundaryRow['category']>('communication')
  const [priority, setPriority] = useState<BoundaryRow['priority']>('medium')
  const [status, setStatus] = useState<BoundaryRow['status']>('active')

  // Interactions state
  type InteractionType = 'violation' | 'success' | 'review' | 'modification'
  type SeverityType = 'low' | 'medium' | 'high'
  const [interactions, setInteractions] = useState<any[]>([])
  const [ixType, setIxType] = useState<InteractionType>('success')
  const [ixSeverity, setIxSeverity] = useState<SeverityType>('low')
  const [ixDescription, setIxDescription] = useState('')
  const [addingIx, setAddingIx] = useState(false)
  // Analytics
  const [sr30, setSr30] = useState<number | null>(null)
  const [sr90, setSr90] = useState<number | null>(null)
  const [ixCounts, setIxCounts] = useState<{total:number; violations:number; successes:number}>({ total: 0, violations: 0, successes: 0 })

  // Reviews state
  type ReviewType = 'scheduled' | 'triggered' | 'manual'
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewType, setReviewType] = useState<ReviewType>('manual')
  const [effectiveness, setEffectiveness] = useState<number>(4)
  const [needsModification, setNeedsModification] = useState(false)
  const [modificationNotes, setModificationNotes] = useState('')
  const [completingReview, setCompletingReview] = useState(false)
  // Scheduling
  const [scheduledDate, setScheduledDate] = useState<string>('')
  const [upcomingReviews, setUpcomingReviews] = useState<any[]>([])
  const [scheduling, setScheduling] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile as Profile)

      const id = params?.id
      if (!id) { toast.error('Missing id'); router.push('/boundaries'); return }

      const { data, error } = await supabase
        .from('boundaries')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) { toast.error('Failed to load boundary'); console.error(error) }
      if (!data) { toast.error('Not found'); router.push('/boundaries'); return }

      const row = data as BoundaryRow
      setRecord(row)
      setTitle(row.title)
      setDescription(row.description)
      setCategory(row.category)
      setPriority(row.priority)
      setStatus(row.status)

      // Load interactions
      const { data: ixData } = await supabase
        .from('boundary_interactions')
        .select('*')
        .eq('boundary_id', id)
        .order('created_at', { ascending: false })
        .limit(20)
      setInteractions(ixData || [])

      // Load reviews
      const { data: rvData } = await supabase
        .from('boundary_reviews')
        .select('*')
        .eq('boundary_id', id)
        .order('created_at', { ascending: false })
        .limit(20)
      setReviews(rvData || [])

      // Load upcoming (pending) scheduled reviews
      const { data: pending } = await supabase
        .from('boundary_reviews')
        .select('*')
        .eq('boundary_id', id)
        .eq('review_status', 'pending')
        .order('scheduled_date', { ascending: true })
        .limit(20)
      setUpcomingReviews(pending || [])

      // Compute basic counts from recent interactions (client-side)
      if (ixData && ixData.length) {
        const violations = ixData.filter(i => i.interaction_type === 'violation').length
        const successes = ixData.filter(i => i.interaction_type === 'success').length
        setIxCounts({ total: violations + successes, violations, successes })
      } else {
        setIxCounts({ total: 0, violations: 0, successes: 0 })
      }

      // Fetch success rate via RPC for 30 and 90 days
      const end = new Date()
      const start30 = new Date()
      start30.setDate(end.getDate() - 30)
      const start90 = new Date()
      start90.setDate(end.getDate() - 90)

      const [{ data: sr30Data }, { data: sr90Data }] = await Promise.all([
        supabase.rpc('calculate_boundary_success_rate', { p_boundary_id: id, p_start_date: start30.toISOString(), p_end_date: end.toISOString() }),
        supabase.rpc('calculate_boundary_success_rate', { p_boundary_id: id, p_start_date: start90.toISOString(), p_end_date: end.toISOString() })
      ])
      setSr30((sr30Data as any) ?? null)
      setSr90((sr90Data as any) ?? null)

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scheduleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!record || !user) return
    if (!scheduledDate) { toast.error('Pick a date/time'); return }
    setScheduling(true)
    try {
      const { data, error } = await supabase
        .from('boundary_reviews')
        .insert({
          boundary_id: record.id,
          user_id: user.id,
          review_type: 'scheduled',
          review_status: 'pending',
          scheduled_date: new Date(scheduledDate).toISOString(),
        })
        .select('*')
        .single()
      if (error) throw error
      setUpcomingReviews(prev => [data as any, ...prev].sort((a,b)=> (new Date(a.scheduled_date).getTime()) - (new Date(b.scheduled_date).getTime())))
      setScheduledDate('')
      toast.success('Review scheduled')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to schedule review')
    } finally {
      setScheduling(false)
    }
  }

  const markScheduledCompleted = async (reviewId: string) => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('boundary_reviews')
        .update({ review_status: 'completed', completed_date: new Date().toISOString() })
        .eq('id', reviewId)
        .select('*')
        .single()
      if (error) throw error
      // move from upcoming to reviews
      setUpcomingReviews(prev => prev.filter(r => r.id !== reviewId))
      setReviews(prev => [data as any, ...prev])
      toast.success('Scheduled review completed')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to complete review')
    }
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!record) return
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('boundaries')
        .update({
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          status,
          is_active: status !== 'needs-attention',
          updated_at: new Date().toISOString(),
        })
        .eq('id', record.id)
        .select('*')
        .single()
      if (error) throw error
      setRecord(data as BoundaryRow)
      toast.success('Saved')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!record) return
    if (!confirm('Delete this boundary? This cannot be undone.')) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('boundaries').delete().eq('id', record.id)
      if (error) throw error
      toast.success('Deleted')
      router.push('/boundaries')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const addInteraction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!record || !user) return
    setAddingIx(true)
    try {
      const { data, error } = await supabase
        .from('boundary_interactions')
        .insert({
          boundary_id: record.id,
          user_id: user.id,
          interaction_type: ixType,
          severity: ixSeverity,
          description: ixDescription.trim() || null,
        })
        .select('*')
        .single()
      if (error) throw error
      setInteractions(prev => [data as any, ...prev])
      setIxDescription('')
      toast.success('Interaction logged')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to log interaction')
    } finally {
      setAddingIx(false)
    }
  }

  const completeReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!record || !user) return
    setCompletingReview(true)
    try {
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from('boundary_reviews')
        .insert({
          boundary_id: record.id,
          user_id: user.id,
          review_type: reviewType,
          review_status: 'completed',
          effectiveness_rating: effectiveness,
          needs_modification: needsModification,
          modification_notes: modificationNotes || null,
          completed_date: nowIso,
        })
        .select('*')
        .single()
      if (error) throw error
      setReviews(prev => [data as any, ...prev])
      setNeedsModification(false)
      setModificationNotes('')
      toast.success('Review completed')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to complete review')
    } finally {
      setCompletingReview(false)
    }
  }

  if (loading || !user || !profile || !record) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }
  return (
    <DashboardLayout user={user!} profile={profile!}>
      <div className="space-y-6">
        {/* Analytics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">Boundary Health
            <span className="ml-2 inline-flex items-center text-gray-400" title="Success rates over the last 30/90 days and recent counts of violations and successes.">
              <Info className="h-4 w-4" aria-hidden />
            </span>
          </h2>
          <p className="sm:hidden text-xs text-gray-500 mb-3">Success rates over the last 30/90 days and recent counts of violations and successes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs text-gray-500">30d Success Rate</div>
              <div className="text-xl font-bold text-gray-900">{sr30 != null ? `${sr30.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs text-gray-500">90d Success Rate</div>
              <div className="text-xl font-bold text-gray-900">{sr90 != null ? `${sr90.toFixed(0)}%` : '—'}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs text-gray-500">Violations (recent)</div>
              <div className="text-xl font-bold text-red-600">{ixCounts.violations}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs text-gray-500">Successes (recent)</div>
              <div className="text-xl font-bold text-green-600">{ixCounts.successes}</div>
            </div>
          </div>
        </div>

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex-1">
            <Link href="/boundaries" className="text-indigo-600 hover:underline block mb-1 sm:mb-0 sm:inline-block sm:mr-3">Back</Link>
            <div className="sm:inline-flex sm:items-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">Edit Boundary
                <span className="ml-2 inline-flex items-center text-gray-400" title="Update the title, description, category, priority, and status. Status affects whether the boundary is considered active.">
                  <Info className="h-4 w-4" aria-hidden />
                </span>
              </h1>
            </div>
            <p className="sm:hidden text-xs text-gray-500 mt-1">Update the title, description, category, priority, and status. Status affects whether the boundary is considered active.</p>
          </div>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="hidden sm:inline-flex border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <form ref={formRef} onSubmit={onSave} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={category} onChange={(e)=>setCategory(e.target.value as any)}>
                {CATEGORY_OPTIONS.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={priority} onChange={(e)=>setPriority(e.target.value as any)}>
                {PRIORITY_OPTIONS.map(p => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
                {STATUS_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <button type="submit" disabled={saving} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/boundaries" className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </Link>
            <button type="button" onClick={onDelete} disabled={deleting} className="w-full sm:w-auto border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>

        {/* Sticky mobile action bar */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 pb-[env(safe-area-inset-bottom)] z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => formRef.current?.requestSubmit()}
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link
              href="/boundaries"
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="px-4 py-3 rounded-lg border border-red-300 text-red-700 font-medium hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Schedule Next Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">Schedule Next Review
            <span className="ml-2 inline-flex items-center text-gray-400" title="Pick a future date/time to review this boundary. Creates a pending review reminder.">
              <Info className="h-4 w-4" aria-hidden />
            </span>
          </h2>
          <p className="sm:hidden text-xs text-gray-500">Pick a future date/time to review this boundary. Creates a pending review reminder.</p>
          <form onSubmit={scheduleReview} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
              <input type="datetime-local" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={scheduledDate} onChange={e=>setScheduledDate(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={scheduling} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{scheduling ? 'Scheduling...' : 'Schedule Review'}</button>
            </div>
          </form>

          {/* Upcoming Reviews */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center">Upcoming Reviews
              <span className="ml-2 inline-flex items-center text-gray-400" title="Pending scheduled reviews. Mark as completed when you finish a review.">
                <Info className="h-4 w-4" aria-hidden />
              </span>
            </h3>
            <p className="sm:hidden text-xs text-gray-500 mb-2">Pending scheduled reviews. Mark as completed when you finish a review.</p>
            <div className="space-y-2">
              {upcomingReviews.length === 0 && <div className="text-gray-500">No upcoming reviews.</div>}
              {upcomingReviews.map(rv => (
                <div key={rv.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">scheduled</span>
                    {rv.scheduled_date ? <span className="ml-2">• {new Date(rv.scheduled_date).toLocaleString()}</span> : null}
                  </div>
                  <button onClick={()=>markScheduledCompleted(rv.id)} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Mark Completed</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Log Interaction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">Log Interaction
            <span className="ml-2 inline-flex items-center text-gray-400" title="Record a success or violation with optional notes. These entries power your analytics.">
              <Info className="h-4 w-4" aria-hidden />
            </span>
          </h2>
          <p className="sm:hidden text-xs text-gray-500">Record a success or violation with optional notes. These entries power your analytics.</p>
          <form onSubmit={addInteraction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={ixType} onChange={e=>setIxType(e.target.value as any)}>
                <option value="success">success</option>
                <option value="violation">violation</option>
                <option value="review">review</option>
                <option value="modification">modification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={ixSeverity} onChange={e=>setIxSeverity(e.target.value as any)}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={ixDescription} onChange={e=>setIxDescription(e.target.value)} placeholder="Optional notes" />
            </div>
            <div className="md:col-span-4">
              <button type="submit" disabled={addingIx} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{addingIx ? 'Logging...' : 'Log Interaction'}</button>
            </div>
          </form>

          {/* Recent Interactions */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center">Recent Interactions
              <span className="ml-2 inline-flex items-center text-gray-400" title="Latest interactions you logged for this boundary.">
                <Info className="h-4 w-4" aria-hidden />
              </span>
            </h3>
            <p className="sm:hidden text-xs text-gray-500 mb-2">Latest interactions you logged for this boundary.</p>
            <div className="space-y-2">
              {interactions.length === 0 && <div className="text-gray-500">No interactions yet.</div>}
              {interactions.map(ix => (
                <div key={ix.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{ix.interaction_type}</span>
                    {ix.severity ? <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{ix.severity}</span> : null}
                    {ix.description ? <span className="ml-2">• {ix.description}</span> : null}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(ix.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">Complete Review
            <span className="ml-2 inline-flex items-center text-gray-400" title="Reflect on effectiveness and note any changes needed. Saves a completed review entry.">
              <Info className="h-4 w-4" aria-hidden />
            </span>
          </h2>
          <p className="sm:hidden text-xs text-gray-500">Reflect on effectiveness and note any changes needed. Saves a completed review entry.</p>
          <form onSubmit={completeReview} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Review Type</label>
              <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={reviewType} onChange={e=>setReviewType(e.target.value as any)}>
                <option value="manual">manual</option>
                <option value="scheduled">scheduled</option>
                <option value="triggered">triggered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Effectiveness: {effectiveness}</label>
              <input type="range" min={1} max={5} value={effectiveness} onChange={e=>setEffectiveness(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="needsMod" type="checkbox" checked={needsModification} onChange={e=>setNeedsModification(e.target.checked)} />
              <label htmlFor="needsMod" className="text-sm text-gray-700">Needs modification</label>
            </div>
            <div className="md:col-span-1"></div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={modificationNotes} onChange={e=>setModificationNotes(e.target.value)} placeholder="What changed, what needs to improve, support needed, etc." />
            </div>
            <div className="md:col-span-4">
              <button type="submit" disabled={completingReview} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{completingReview ? 'Saving...' : 'Complete Review'}</button>
            </div>
          </form>

          {/* Recent Reviews */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center">Recent Reviews
              <span className="ml-2 inline-flex items-center text-gray-400" title="History of completed reviews for this boundary.">
                <Info className="h-4 w-4" aria-hidden />
              </span>
            </h3>
            <p className="sm:hidden text-xs text-gray-500 mb-2">History of completed reviews for this boundary.</p>
            <div className="space-y-2">
              {reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
              {reviews.map(rv => (
                <div key={rv.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{rv.review_type}</span>
                    {rv.effectiveness_rating ? <span className="ml-2">• effectiveness {rv.effectiveness_rating}/5</span> : null}
                    {rv.needs_modification ? <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">needs modification</span> : null}
                  </div>
                  <div className="text-xs text-gray-500">{rv.completed_date ? new Date(rv.completed_date).toLocaleString() : new Date(rv.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
