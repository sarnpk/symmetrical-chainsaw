'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

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

export default function BoundariesPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [items, setItems] = useState<BoundaryRow[]>([])
  const [filterStatus, setFilterStatus] = useState<BoundaryRow['status'] | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<BoundaryRow['category'] | 'all'>('all')

  // Create form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<BoundaryRow['category']>('communication')
  const [priority, setPriority] = useState<BoundaryRow['priority']>('medium')
  const [status, setStatus] = useState<BoundaryRow['status']>('active')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile as Profile)

      await loadItems()
      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('boundaries')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) {
      console.error(error)
      toast.error('Failed to load boundaries')
      return
    }
    setItems((data as BoundaryRow[]) || [])
  }

  const filtered = useMemo(() => {
    return items.filter(it => {
      if (filterStatus !== 'all' && it.status !== filterStatus) return false
      if (filterCategory !== 'all' && it.category !== filterCategory) return false
      return true
    })
  }, [items, filterStatus, filterCategory])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('communication')
    setPriority('medium')
    setStatus('active')
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required')
      return
    }
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('boundaries')
        .insert({
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          status,
          is_active: status !== 'needs-attention',
        })
        .select('*')
        .single()
      if (error) throw error
      setItems(prev => [data as BoundaryRow, ...prev])
      resetForm()
      toast.success('Boundary created')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to create boundary')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Boundaries</h1>
            <p className="text-gray-600 mt-1">Create and track your personal boundaries</p>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Create form */}
        <form onSubmit={onCreate} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., No phone calls after 9pm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {CATEGORY_OPTIONS.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                {PRIORITY_OPTIONS.map(p => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                {STATUS_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the boundary and why it matters to you"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Boundary'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">{item.title}</h3>
                  <p className="text-gray-600 mt-1 break-words">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{new Date(item.updated_at).toLocaleDateString()}</div>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">{item.category}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">{item.priority}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{item.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/boundaries/${item.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  View / Edit
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600">
              No boundaries yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
