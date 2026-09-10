import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth?redirect=/admin')
  }

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
