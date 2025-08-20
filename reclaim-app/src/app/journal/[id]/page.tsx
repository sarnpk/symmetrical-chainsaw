'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
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
  
  // Create admin client to bypass RLS for storage operations
  const supabaseAdmin = createClient(
    'https://gstiokcvqmxiaqzmtzmv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4NDQ4NiwiZXhwIjoyMDcwOTYwNDg2fQ.pE3OAwQKCZjg8PGpLBPCeZpJC2kXC-du2XSGOa8CJ48'
  )

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

      // Get evidence files for this entry using admin client
      const { data: evidence } = await supabaseAdmin
        .from('evidence_files')
        .select('*')
        .eq('journal_entry_id', resolvedParams.id)
        .order('uploaded_at', { ascending: true })

      if (evidence) {
        setEvidenceFiles(evidence)
        
        // Generate signed URLs for evidence files
        const urls: {[key: string]: string} = {}
        for (const file of evidence) {
          try {
            const { data } = await supabaseAdmin.storage
              .from(file.storage_bucket)
              .createSignedUrl(file.storage_path, 3600) // 1 hour expiry
            
            if (data?.signedUrl) {
              urls[file.id] = data.signedUrl
            }
          } catch (error) {
            console.error('Failed to generate signed URL for file:', file.id, error)
          }
        }
        setEvidenceUrls(urls)
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
      // First delete all evidence files from storage and database
      for (const file of evidenceFiles) {
        // Delete from storage
        if (file.storage_bucket && file.storage_path) {
          await supabaseAdmin.storage
            .from(file.storage_bucket)
            .remove([file.storage_path])
        }
        
        // Delete from database
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