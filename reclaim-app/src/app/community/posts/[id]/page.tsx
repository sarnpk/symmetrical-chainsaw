import Link from 'next/link'
import CommentsSection from './CommentsSection'
import { createServerSupabase } from '@/lib/supabase-server'
import DashboardLayout from '@/components/DashboardLayout'
import type { Profile } from '@/lib/supabase'
import { redirect } from 'next/navigation'

interface PostDetailPageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const id = params.id
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  const { data: item, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Post detail fetch error:', error)
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Link href="/community" className="text-sm text-indigo-600 hover:text-indigo-700">← Back to Community</Link>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
          <div className="text-gray-600">Post not found.</div>
        </div>
      </div>
    )
  }

  const createdAt = item.created_at ? new Date(item.created_at).toLocaleString() : ''
  const authorLabel = item.is_anonymous ? 'Anonymous' : 'Member'
  const category = item.category || 'general'

  const categoryClass = (() => {
    switch (category) {
      case 'recovery': return 'bg-green-100 text-green-800 border-green-200'
      case 'strategies': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'healing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'parenting': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  })()

  return (
    <DashboardLayout user={user} profile={profile as Profile}>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <header className="mb-2">
          <h1 className="text-3xl font-semibold text-gray-900">Community Post</h1>
          <p className="text-sm text-gray-500">Read and discuss with the community</p>
        </header>
        <Link href="/community" className="text-sm text-indigo-600 hover:text-indigo-700">← Back to Community</Link>
        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{authorLabel}</div>
              <div className="text-xs text-gray-400">{createdAt}</div>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${categoryClass}`}>
              {category}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{item.title}</h1>
          <div className="prose prose-indigo mt-4 max-w-none text-gray-800 whitespace-pre-wrap">{item.content}</div>
        </article>
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          <div className="mt-3">
            <CommentsSection postId={id} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
