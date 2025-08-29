'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'
import { Shield, Phone, MapPin, FileText, Info } from 'lucide-react'

export default function SafetyPlanHelpPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }
  if (!user || !profile) return null

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto pt-4 sm:pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-7 w-7 text-rose-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Safety Plan — Help</h1>
          </div>
          <Link href="/safety-plan" className="text-sm text-indigo-600 hover:text-indigo-700">Back to Safety Plan →</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center text-gray-900 font-semibold">
            <Info className="h-5 w-5 text-rose-600" />
            <span className="ml-2">Purpose</span>
          </div>
          <p className="text-gray-600 text-sm">Your Safety Plan centralizes critical contacts, safe places, documents, and steps so you can act quickly under stress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <Phone className="h-5 w-5 text-indigo-600" />
              <span className="ml-2">Contacts & Locations</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Add trusted people with availability notes.</li>
              <li>List safe locations with addresses and a contact person.</li>
              <li>Keep details brief, clear, and up to date.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center text-gray-900 font-semibold">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span className="ml-2">Documents & Steps</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Track important documents and financial resources.</li>
              <li>Write an escape plan with small, concrete steps.</li>
              <li>Add professional support contacts (therapist, lawyer, etc.).</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500">Review your plan regularly. If anything changes (phone numbers, addresses, relationships), update right away. In immediate danger, call local emergency services.</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
