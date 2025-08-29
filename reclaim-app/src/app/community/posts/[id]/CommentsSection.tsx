'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Comment = {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const load = async (opts?: { append?: boolean }) => {
    try {
      const append = !!opts?.append
      const limit = 20
      if (append) setLoadingMore(true); else setLoading(true)
      const params = new URLSearchParams()
      params.set('post_id', postId)
      params.set('limit', String(limit))
      if (append && cursor) params.set('cursor', cursor)
      const res = await fetch(`/api/community/comments?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load comments')
      const j = await res.json()
      const items: Comment[] = Array.isArray(j.items) ? j.items : []
      setComments(prev => append ? [...prev, ...items] : items)
      if (items.length > 0) {
        const last = items[items.length - 1]
        if (last?.created_at) setCursor(last.created_at)
      }
      setHasMore(items.length === limit)
    } catch (e) {
      console.error('load comments error', e)
      toast.error('Could not load comments')
    } finally {
      if (opts?.append) setLoadingMore(false); else setLoading(false)
    }

  }

  const startEdit = (c: Comment) => {
    setEditingId(c.id)
    setEditText(c.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = async () => {
    const text = editText.trim()
    if (!editingId || !text) return
    try {
      setSavingEdit(true)
      const res = await fetch('/api/community/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, content: text })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to update comment')
      }
      const j = await res.json()
      const item: Comment | undefined = j?.item
      if (item) {
        setComments(prev => prev.map(c => c.id === item.id ? item : c))
      } else {
        await load()
      }
      toast.success('Comment updated')
      cancelEdit()
    } catch (e: any) {
      console.error('save edit error', e)
      toast.error(e?.message || 'Could not update comment')
    } finally {
      setSavingEdit(false)
    }
  }

  useEffect(() => {
    load()
    // fetch current user id
    fetch('/api/me')
      .then((r) => r.json())
      .then((j) => setCurrentUserId(j?.id || null))
      .catch(() => setCurrentUserId(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const deleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/community/comments?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to delete comment')
      }
      setComments(prev => prev.filter(c => c.id !== id))
      try { window.dispatchEvent(new CustomEvent('community:comment:deleted', { detail: { postId } })) } catch {}
      toast.success('Comment deleted')
    } catch (e: any) {
      console.error('delete comment error', e)
      toast.error(e?.message || 'Could not delete comment')
    }
  }

  const addComment = async () => {
    const text = content.trim()
    if (!text) return
    try {
      setSubmitting(true)
      const res = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: text })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to add comment')
      }
      const j = await res.json()
      const item: Comment | undefined = j?.item
      if (item) {
        setComments(prev => [item, ...prev])
      } else {
        // fallback refetch
        await load()
      }
      try { window.dispatchEvent(new CustomEvent('community:comment:created', { detail: { postId } })) } catch {}
      setContent('')
      toast.success('Comment added')
    } catch (e: any) {
      console.error('add comment error', e)
      toast.error(e?.message || 'Could not add comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Add a comment</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={addComment}
            disabled={submitting || !content.trim()}
            className={`px-4 py-2 rounded-lg text-white ${submitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        <div className="px-4 py-3 text-sm text-gray-600">
          {loading ? 'Loading comments…' : `${comments.length} comment${comments.length === 1 ? '' : 's'}`}
        </div>
        {comments.map(c => (
          <div key={c.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</div>
              {currentUserId && c.author_id === currentUserId && (
                <div className="flex items-center gap-3">
                  {editingId === c.id ? (
                    <>
                      <button onClick={saveEdit} disabled={savingEdit || !editText.trim()} className={`text-xs ${savingEdit ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-700'}`}>{savingEdit ? 'Saving…' : 'Save'}</button>
                      <button onClick={cancelEdit} disabled={savingEdit} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(c)} className="text-xs text-gray-600 hover:text-gray-800">Edit</button>
                      <button onClick={() => deleteComment(c.id)} className="text-xs text-red-600 hover:text-red-700">Delete</button>
                    </>
                  )}
                </div>
              )}
            </div>
            {editingId === c.id ? (
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              />
            ) : (
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{c.content}</div>
            )}
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">No comments yet. Be the first to comment.</div>
        )}
        {!loading && comments.length > 0 && hasMore && (
          <div className="px-4 py-3 flex justify-center">
            <button
              onClick={() => load({ append: true })}
              disabled={loadingMore}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${loadingMore ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'} border-gray-200`}
            >
              {loadingMore ? 'Loading…' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
