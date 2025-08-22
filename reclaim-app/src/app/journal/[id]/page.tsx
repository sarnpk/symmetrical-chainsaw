'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import DashboardLayout from '@/components/DashboardLayout'
import JournalEntryHeader from '@/components/journal/entry/JournalEntryHeader'
import SafetyRatingCard from '@/components/journal/entry/SafetyRatingCard'
import ContentSection from '@/components/journal/entry/ContentSection'
import BehaviorTypesCard from '@/components/journal/entry/BehaviorTypesCard'
import EmotionalImpactCard from '@/components/journal/entry/EmotionalImpactCard'
import AdditionalDetailsCard from '@/components/journal/entry/AdditionalDetailsCard'
import PhotoEvidenceCard from '@/components/journal/entry/PhotoEvidenceCard'
import AudioEvidenceCard from '@/components/journal/entry/AudioEvidenceCard'
import EntryMetadata from '@/components/journal/entry/EntryMetadata'
import DeleteConfirmationModal from '@/components/journal/entry/DeleteConfirmationModal'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry, EvidenceFile } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Props {
  params: Promise<{ id: string }>
}

export default function JournalEntryDetailPage({ params }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([])
  const [evidenceUrls, setEvidenceUrls] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [subscriptionTier, setSubscriptionTier] = useState<'foundation' | 'recovery' | 'empowerment'>('foundation')

  const router = useRouter()
  
  // Evidence and signed URLs are fetched via secure server API

  useEffect(() => {
    const getEntry = async () => {
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
      if (profile) {
        const tier = profile.subscription_tier || 'foundation'
        setSubscriptionTier(tier)
      }

      // Await params to get the id
      const resolvedParams = await params
      
      // Get the journal entry
      const { data: entry, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (error || !entry) {
        router.push('/journal')
        return
      }

      setEntry(entry)

      // Get evidence files and signed URLs via server API
      try {
        const res = await fetch(`/api/journal/${resolvedParams.id}/evidence`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          const evidence = json.evidence || []
          setEvidenceFiles(evidence)
          const urls: {[key: string]: string} = {}
          for (const file of evidence) {
            if (file.signedUrl) {
              urls[file.id] = file.signedUrl
            }
          }
          setEvidenceUrls(urls)
        }
      } catch (e) {
        console.error('Failed to load evidence via API', e)
      }

      setLoading(false)
    }

    getEntry()
  }, [router, supabase, params])

  // Subscription tier helper functions
  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'
  const isEmpowermentUser = () => subscriptionTier === 'empowerment'

  const getFeatureAccess = () => ({
    basicForm: true,
    behaviorAssessment: true,
    basicEvidence: true,
    emotionalTracking: true,
    howThisAffectedYou: isPaidUser(),
    enhancedRatings: isPaidUser(),
    audioEvidence: isPaidUser(),
    draftMode: isPaidUser(),
    detailedAnalysis: isEmpowermentUser(),
    evidenceDocumentation: isEmpowermentUser(),
    advancedFields: isEmpowermentUser(),
  })

  const featureAccess = getFeatureAccess()

  const handleDeleteEntry = async () => {
    if (!entry || !user) return
    
    setDeleting(true)
    try {
      // First delete evidence DB rows (storage deletion will move to secure server API)
      for (const file of evidenceFiles) {
        await supabase
          .from('evidence_files')
          .delete()
          .eq('id', file.id)
      }
      
      // Delete the journal entry
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entry.id)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      toast.success('Journal entry deleted successfully')
      router.push('/journal')
    } catch (error: any) {
      toast.error('Failed to delete entry: ' + error.message)
      console.error('Delete error:', error)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile || !entry) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <JournalEntryHeader 
          entry={entry} 
          onDelete={() => setShowDeleteConfirm(true)} 
        />

        {/* Safety Rating */}
        <SafetyRatingCard rating={entry.safety_rating} />

        {/* Main Content */}
        <ContentSection 
          title="What Happened"
          content={entry.description}
        />

        {/* Behavior Types */}
        <BehaviorTypesCard behaviorTypes={entry.abuse_types || []} />

        {/* Emotional Impact - Recovery & Empowerment Only */}
        <EmotionalImpactCard
          emotionalStateBefore={entry.emotional_state_before}
          emotionalStateAfter={entry.emotional_state_after}
          showUpgradePrompt={!featureAccess.howThisAffectedYou && !entry.emotional_state_before && !entry.emotional_state_after}
        />

        {/* Additional Details */}
        <AdditionalDetailsCard 
          location={entry.location}
          witnesses={entry.witnesses}
        />

        {/* Photo Evidence */}
        <PhotoEvidenceCard 
          evidenceFiles={evidenceFiles}
          evidenceUrls={evidenceUrls}
        />

        {/* Audio Evidence */}
        <AudioEvidenceCard 
          evidenceFiles={evidenceFiles}
          evidenceUrls={evidenceUrls}
        />

        {/* Metadata */}
        <EntryMetadata entry={entry} />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          entry={entry}
          isOpen={showDeleteConfirm}
          isDeleting={deleting}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteEntry}
        />
      </div>
    </DashboardLayout>
  )
}