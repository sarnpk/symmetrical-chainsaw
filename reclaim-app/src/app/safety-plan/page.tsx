'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import SafetyPlanContent from './SafetyPlanContentSimplified'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { 
  Shield,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Heart,
  Car,
  CreditCard,
  FileText,
  Edit,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react'

interface SafetyPlan {
  id: string
  emergency_contacts: {
    name: string
    phone: string
    relationship: string
    available_times: string
  }[]
  safe_locations: {
    name: string
    address: string
    contact_person: string
    phone: string
    notes: string
  }[]
  warning_signs: string[]
  coping_strategies: string[]
  important_documents: string[]
  financial_resources: {
    bank_accounts: string[]
    credit_cards: string[]
    cash_locations: string[]
    financial_contacts: string[]
  }
  escape_plan: {
    transportation: string
    destination: string
    route_notes: string
    bag_location: string
    children_plan: string
  }
  professional_support: {
    therapist: { name: string; phone: string }
    lawyer: { name: string; phone: string }
    doctor: { name: string; phone: string }
    case_worker: { name: string; phone: string }
  }
  last_updated: string
}

const emergencyResources = [
  {
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: '24/7 confidential support',
    website: 'thehotline.org'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: '24/7 crisis support via text',
    website: 'crisistextline.org'
  },
  {
    name: 'National Sexual Assault Hotline',
    phone: '1-800-656-4673',
    description: '24/7 confidential support',
    website: 'rainn.org'
  },
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 suicide prevention support',
    website: 'suicidepreventionlifeline.org'
  }
]

export default function SafetyPlanPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
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

  if (!user || !profile) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <SafetyPlanContent userId={user.id} />
    </DashboardLayout>
  )
}



