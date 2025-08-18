'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft, Calendar, MapPin, Users, Heart, Shield, Camera, Mic, MicOff, Upload, X, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import toast from 'react-hot-toast'

const abuseTypes = [
  'gaslighting',
  'love_bombing', 
  'silent_treatment',
  'triangulation',
  'projection',
  'hoovering',
  'smear_campaign',
  'financial_abuse',
  'emotional_manipulation',
  'isolation',
  'misscommitment'
]

const emotionalStates = [
  { label: 'Happy', intensity: 'positive', value: 'happy' },
  { label: 'Content', intensity: 'positive', value: 'content' },
  { label: 'Hopeful', intensity: 'positive', value: 'hopeful' },
  { label: 'Calm', intensity: 'neutral', value: 'calm' },
  { label: 'Neutral', intensity: 'neutral', value: 'neutral' },
  { label: 'Confused', intensity: 'neutral', value: 'confused' },
  { label: 'Anxious', intensity: 'negative', value: 'anxious' },
  { label: 'Sad', intensity: 'negative', value: 'sad' },
  { label: 'Angry', intensity: 'negative', value: 'angry' },
  { label: 'Scared', intensity: 'negative', value: 'scared' },
  { label: 'Overwhelmed', intensity: 'negative', value: 'overwhelmed' },
  { label: 'Numb', intensity: 'negative', value: 'numb' },
]

// New field options for enhanced schema
const behaviorCategoryOptions = [
  'verbal_abuse', 'emotional_manipulation', 'gaslighting', 'isolation',
  'financial_control', 'physical_intimidation', 'surveillance', 'threats',
  'love_bombing', 'silent_treatment', 'blame_shifting', 'projection'
]

const emotionalImpactOptions = [
  'anxiety', 'depression', 'fear', 'confusion', 'anger', 'shame',
  'guilt', 'helplessness', 'numbness', 'hypervigilance', 'dissociation'
]

const patternFlagOptions = [
  'escalation', 'cycle_repeat', 'trigger_identified', 'new_behavior',
  'intensity_increase', 'frequency_increase', 'multiple_tactics'
]

const contentWarningOptions = [
  'violence', 'sexual_content', 'self_harm', 'substance_abuse',
  'graphic_language', 'trauma_details', 'medical_content'
]

const evidenceTypeOptions = [
  'text_messages', 'emails', 'voicemails', 'photos', 'videos',
  'documents', 'recordings', 'screenshots', 'witness_statements'
]

interface PhotoEvidence {
  file: File
  caption: string
  timestamp: string
  preview: string
}

interface AudioEvidence {
  file: File
  caption: string
  timestamp: string
  duration: number
  transcription?: string
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  audioUrl: string
}

export default function NewJournalEntryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Basic form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentTime, setIncidentTime] = useState('')
  const [location, setLocation] = useState('')

  // Rating fields (updated to use numbers)
  const [safetyRating, setSafetyRating] = useState<number>(3)
  const [moodRating, setMoodRating] = useState<number>(5)
  const [triggerLevel, setTriggerLevel] = useState<number>(3)

  // Category arrays
  const [selectedAbuseTypes, setSelectedAbuseTypes] = useState<string[]>([])
  const [behaviorCategories, setBehaviorCategories] = useState<string[]>([])
  const [emotionalImpact, setEmotionalImpact] = useState<string[]>([])
  const [patternFlags, setPatternFlags] = useState<string[]>([])
  const [contentWarnings, setContentWarnings] = useState<string[]>([])

  // Evidence fields
  const [evidenceType, setEvidenceType] = useState<string[]>([])
  const [evidenceNotes, setEvidenceNotes] = useState('')
  const [isEvidence, setIsEvidence] = useState(false)

  // Context fields
  const [witnesses, setWitnesses] = useState('')
  const [emotionalStateBefore, setEmotionalStateBefore] = useState<string[]>([])
  const [emotionalStateAfter, setEmotionalStateAfter] = useState<string[]>([])

  // Draft and submission state
  const [isDraft, setIsDraft] = useState(false)

  // Subscription tier state
  const [subscriptionTier, setSubscriptionTier] = useState<'foundation' | 'recovery' | 'empowerment'>('foundation')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Evidence state
  const [photoEvidence, setPhotoEvidence] = useState<PhotoEvidence[]>([])
  const [audioEvidence, setAudioEvidence] = useState<AudioEvidence[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  // Collapsible sections state for mobile optimization
  const [collapsedSections, setCollapsedSections] = useState({
    basicInfo: false,
    behaviorTypes: true,
    safetyEmotional: true,
    evidence: true,
    context: true
  })

  // Help dialog state
  const [showBehaviorHelp, setShowBehaviorHelp] = useState(false)

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const router = useRouter()
  const supabase = createClient()
  
  // Create admin client for storage uploads (bypasses RLS)
  const supabaseAdmin = createSupabaseClient(
    'https://gstiokcvqmxiaqzmtzmv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4NDQ4NiwiZXhwIjoyMDcwOTYwNDg2fQ.pE3OAwQKCZjg8PGpLBPCeZpJC2kXC-du2XSGOa8CJ48'
  )

  useEffect(() => {
    // Set current date and time as defaults
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0] // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM
    
    setIncidentDate(currentDate)
    setIncidentTime(currentTime)

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
      if (profile) {
        const tier = profile.subscription_tier || 'foundation'
        setSubscriptionTier(tier)
        console.log('Profile loaded, subscription tier:', tier)
      }
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          const newPhoto: PhotoEvidence = {
            file,
            caption: '',
            timestamp: new Date().toISOString(),
            preview
          }
          setPhotoEvidence(prev => [...prev, newPhoto])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index: number) => {
    setPhotoEvidence(prev => prev.filter((_, i) => i !== index))
  }

  const updatePhotoCaption = (index: number, caption: string) => {
    setPhotoEvidence(prev => prev.map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    ))
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(blob)
        const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' })
        
        const newRecording: AudioEvidence = {
          file,
          caption: '',
          timestamp: new Date().toISOString(),
          duration: 0, // Will be calculated later
          transcription: '',
          transcriptionStatus: 'pending',
          audioUrl
        }
        
        setAudioEvidence(prev => [...prev, newRecording])
        
        // Start transcription (paid tiers only)
        if (isPaidUser()) {
          transcribeAudio(newRecording, audioEvidence.length)
        }
      }

      setMediaRecorder(recorder)
      setAudioStream(stream)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      toast.error('Failed to start recording')
      console.error('Recording error:', error)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
  }

  const transcribeAudio = async (recording: AudioEvidence, index: number) => {
    try {
      // Update status to processing
      setAudioEvidence(prev => prev.map((rec, i) => 
        i === index ? { ...rec, transcriptionStatus: 'processing' } : rec
      ))

      // Upload to Supabase Storage first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('evidence-audio')
        .upload(`temp/${recording.file.name}`, recording.file)

      if (uploadError) throw uploadError

      // Call our transcription Edge Function
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions
        .invoke('transcribe-audio', {
          body: { 
            fileId: 'temp', // temporary ID
            storagePath: uploadData.path
          }
        })

      if (transcriptionError) throw transcriptionError

      // Update with transcription result
      setAudioEvidence(prev => prev.map((rec, i) => 
        i === index ? { 
          ...rec, 
          transcription: transcriptionData.transcription,
          transcriptionStatus: 'completed'
        } : rec
      ))

      toast.success('Audio transcribed successfully!')
    } catch (error) {
      console.error('Transcription error:', error)
      setAudioEvidence(prev => prev.map((rec, i) => 
        i === index ? { ...rec, transcriptionStatus: 'failed' } : rec
      ))
      toast.error('Failed to transcribe audio')
    }
  }

  const removeAudioRecording = (index: number) => {
    const recording = audioEvidence[index]
    URL.revokeObjectURL(recording.audioUrl)
    setAudioEvidence(prev => prev.filter((_, i) => i !== index))
  }

  const updateAudioCaption = (index: number, caption: string) => {
    setAudioEvidence(prev => prev.map((recording, i) => 
      i === index ? { ...recording, caption } : recording
    ))
  }

  const handleAbuseTypeToggle = (type: string) => {
    setSelectedAbuseTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // Subscription tier helper functions
  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'
  const isRecoveryUser = () => subscriptionTier === 'recovery'
  const isEmpowermentUser = () => subscriptionTier === 'empowerment'
  const isFoundationUser = () => subscriptionTier === 'foundation'

  const getFeatureAccess = () => ({
    // Foundation (Free) - Basic features
    basicForm: true, // Available to all users
    behaviorAssessment: true, // Basic behavior pattern selection
    basicEvidence: true, // Photo upload only (3 max)
    emotionalTracking: true, // Before/after emotional states

    // Recovery (Mid-tier) - Enhanced documentation
    howThisAffectedYou: isPaidUser(), // "How This Affected You" section
    enhancedRatings: isPaidUser(), // Mood rating, trigger level
    audioEvidence: isPaidUser(), // Audio recording + transcription
    draftMode: isPaidUser(), // Save as draft functionality

    // Empowerment (Premium) - Complete toolkit
    detailedAnalysis: isEmpowermentUser(), // Behavior categories, emotional impact, pattern flags
    evidenceDocumentation: isEmpowermentUser(), // Evidence types, notes, legal flagging, content warnings
    advancedFields: isEmpowermentUser(), // Content field, enhanced metadata
  })

  // Debug logging for subscription tier (remove in production)
  console.log('Current subscription tier:', subscriptionTier)
  console.log('Is paid user:', isPaidUser())
  console.log('Feature access:', getFeatureAccess())

  // Helper functions for safety rating display
  const getSafetyLabel = (rating: string) => {
    switch (rating) {
      case '1': return 'Very Unsafe'
      case '2': return 'Unsafe'
      case '3': return 'Neutral'
      case '4': return 'Safe'
      case '5': return 'Very Safe'
      default: return ''
    }
  }

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case '1': return 'border-red-500 bg-red-50 text-red-700'
      case '2': return 'border-orange-500 bg-orange-50 text-orange-700'
      case '3': return 'border-yellow-500 bg-yellow-50 text-yellow-700'
      case '4': return 'border-blue-500 bg-blue-50 text-blue-700'
      case '5': return 'border-green-500 bg-green-50 text-green-700'
      default: return 'border-gray-300 bg-gray-50 text-gray-700'
    }
  }

  // Numeric descriptors for Enhanced Impact Assessment
  const getMoodDescriptor = (val: number) => {
    if (val <= 2) return 'Very Low'
    if (val <= 4) return 'Low'
    if (val <= 7) return 'Moderate'
    if (val <= 9) return 'High'
    return 'Very High'
  }

  const getTriggerDescriptor = (val: number) => {
    if (val === 1) return 'Mild'
    if (val === 2) return 'Light'
    if (val === 3) return 'Moderate'
    if (val === 4) return 'Strong'
    return 'Severe'
  }

  const handleEmotionalStateToggle = (state: string, type: 'before' | 'after') => {
    if (type === 'before') {
      setEmotionalStateBefore(prev => 
        prev.includes(state) 
          ? prev.filter(s => s !== state)
          : [...prev, state]
      )
    } else {
      setEmotionalStateAfter(prev => 
        prev.includes(state) 
          ? prev.filter(s => s !== state)
          : [...prev, state]
      )
    }
  }

  // Duplicate function removed - using the one defined above

  const getEmotionalIntensityStyle = (intensity: string, selected: boolean) => {
    if (!selected) return 'border-gray-200 hover:border-gray-300 bg-white'
    
    switch (intensity) {
      case 'positive': return 'border-green-400 bg-green-50 text-green-700'
      case 'neutral': return 'border-blue-400 bg-blue-50 text-blue-700'
      case 'negative': return 'border-red-400 bg-red-50 text-red-700'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user) throw new Error('Not authenticated')

      const incidentDateTime = incidentDate + (incidentTime ? 'T' + incidentTime : 'T12:00:00')
      
      // Prepare entry data based on subscription tier
      const featureAccess = getFeatureAccess()

      const entryData: any = {
        user_id: user.id,
        title,
        description,
        incident_date: incidentDateTime,
        safety_rating: safetyRating,
        abuse_types: selectedAbuseTypes.length > 0 ? selectedAbuseTypes : null,
        location: location || null,
        witnesses: witnesses ? witnesses.split(',').map(w => w.trim()).filter(w => w) : null,
        emotional_state_before: emotionalStateBefore.join(', ') || null,
        emotional_state_after: emotionalStateAfter.join(', ') || null,
      }

      // Add enhanced fields only for paid users
      if (featureAccess.advancedFields) {
        entryData.content = content || null
        entryData.incident_time = incidentTime || null
      }

      if (featureAccess.enhancedRatings) {
        entryData.mood_rating = moodRating
        entryData.trigger_level = triggerLevel
      }

      if (featureAccess.detailedAnalysis) {
        entryData.behavior_categories = behaviorCategories.length > 0 ? behaviorCategories : null
        entryData.pattern_flags = patternFlags.length > 0 ? patternFlags : null
        entryData.emotional_impact = emotionalImpact.length > 0 ? emotionalImpact : null
      }

      if (featureAccess.evidenceDocumentation) {
        entryData.evidence_type = evidenceType.length > 0 ? evidenceType : null
        entryData.evidence_notes = evidenceNotes || null
        entryData.is_evidence = isEvidence
        entryData.content_warnings = contentWarnings.length > 0 ? contentWarnings : null
      }

      if (featureAccess.draftMode) {
        entryData.is_draft = isDraft
      }

      // Save journal entry
      const { data: savedEntry, error: entryError } = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single()

      if (entryError) throw entryError

      // Upload photos
      for (const [index, photo] of photoEvidence.entries()) {
        const fileName = `${savedEntry.id}/photo-${index}-${Date.now()}.jpg`
        
        try {
          // Use admin client for storage upload
          const { data: photoUpload, error: photoError } = await supabaseAdmin.storage
            .from('evidence-photos')
            .upload(fileName, photo.file, {
              cacheControl: '3600',
              upsert: false
            })

          if (photoError) {
            console.error('Photo upload error:', photoError)
            toast.error(`Photo upload failed: ${photoError.message}`)
            continue
          }

          // Save metadata using regular client
          const { error: photoDbError } = await supabase.from('evidence_files').insert({
            journal_entry_id: savedEntry.id,
            user_id: user.id,
            file_name: photo.file.name,
            storage_bucket: 'evidence-photos',
            storage_path: fileName,
            file_type: photo.file.type || 'image/jpeg',
            file_size: photo.file.size,
            caption: photo.caption || null,
            transcription_status: 'completed',
            uploaded_at: new Date().toISOString()
          })

          if (photoDbError) {
            console.error('Photo DB error:', photoDbError)
          } else {
            console.log('Photo uploaded successfully:', fileName)
          }
        } catch (error) {
          console.error('Photo upload error:', error)
        }
      }

      // Upload audio recordings
      for (const [index, audio] of audioEvidence.entries()) {
        const fileName = `${savedEntry.id}/audio-${index}-${Date.now()}.wav`
        
        try {
          // Use admin client for storage upload
          const { data: audioUpload, error: audioError } = await supabaseAdmin.storage
            .from('evidence-audio')
            .upload(fileName, audio.file, {
              cacheControl: '3600',
              upsert: false
            })

          if (audioError) {
            console.error('Audio upload error:', audioError)
            toast.error(`Audio upload failed: ${audioError.message}`)
            continue
          }

          // Save metadata using regular client
          const { error: audioDbError } = await supabase.from('evidence_files').insert({
            journal_entry_id: savedEntry.id,
            user_id: user.id,
            file_name: audio.file.name,
            storage_bucket: 'evidence-audio',
            storage_path: fileName,
            file_type: audio.file.type || 'audio/wav',
            file_size: audio.file.size,
            caption: audio.caption || null,
            transcription: audio.transcription || null,
            transcription_status: audio.transcriptionStatus || 'pending',
            duration_seconds: Math.round(audio.duration) || null,
            uploaded_at: new Date().toISOString()
          })

          if (audioDbError) {
            console.error('Audio DB error:', audioDbError)
          } else {
            console.log('Audio uploaded successfully:', fileName)
          }
        } catch (error) {
          console.error('Audio upload error:', error)
        }
      }

      toast.success('Journal entry with evidence saved successfully!')
      router.push('/journal')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error('Failed to save entry: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Upgrade prompt component with tier-specific messaging
  const UpgradePrompt = ({ feature }: { feature: string }) => {
    const getUpgradeMessage = () => {
      if (feature.includes('How This Affected You') || feature.includes('Enhanced Impact Assessment')) {
        return {
          title: `Unlock ${feature} with Recovery Plan`,
          description: 'Track emotional impact and get enhanced documentation features starting at $9.99/month.',
          tier: 'Recovery'
        }
      } else if (feature.includes('Detailed') || feature.includes('Evidence Documentation')) {
        return {
          title: `Unlock ${feature} with Empowerment Plan`,
          description: 'Get complete trauma recovery toolkit with unlimited AI coaching and advanced analysis.',
          tier: 'Empowerment'
        }
      } else {
        return {
          title: `Unlock ${feature} with Recovery or Empowerment Plan`,
          description: 'Get access to enhanced documentation features and AI-powered insights.',
          tier: 'Recovery'
        }
      }
    }

    const upgradeInfo = getUpgradeMessage()

    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">✨</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-purple-900 mb-1">
              {upgradeInfo.title}
            </h4>
            <p className="text-sm text-purple-700 mb-3">
              {upgradeInfo.description}
            </p>
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Upgrade to {upgradeInfo.tier}
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  const featureAccess = getFeatureAccess()

  

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/journal"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Document Your Experience</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Create a safe record of what happened</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
          {/* Date and Time - First Priority */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Calendar className="h-5 w-5" />
                When did this happen? <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>Start by recording when this incident occurred</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader 
              className="cursor-pointer md:cursor-default"
              onClick={() => window.innerWidth < 768 && toggleSection('basicInfo')}
            >
              <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                <span className="flex items-center gap-2">
                  📝 What Happened
                </span>
                <button
                  type="button"
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSection('basicInfo')
                  }}
                >
                  {collapsedSections.basicInfo ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </button>
              </CardTitle>
              <CardDescription>Tell your story in your own words</CardDescription>
            </CardHeader>
            {!collapsedSections.basicInfo && (
              <CardContent className="space-y-4 md:space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base"
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What happened? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none text-base"
                  placeholder="Brief summary of what happened"
                  required
                />
              </div>

              {/* Enhanced Content Field - Paid Users Only */}
              {featureAccess.advancedFields && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Detailed Account (optional)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none text-base"
                    placeholder="Detailed description with specific quotes, actions, and context. This is your safe space to document everything."
                  />
                </div>
              )}


              </CardContent>
            )}
          </Card>

          {/* Behavior Assessment - Moved right after "What Happened" */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                <span className="flex items-center gap-2">
                  🎭 Behavior Assessment
                </span>
                <button
                  type="button"
                  onClick={() => setShowBehaviorHelp(true)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Learn about behavior assessment"
                >
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                </button>
              </CardTitle>
              <CardDescription>Select all patterns that apply (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {abuseTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAbuseTypeToggle(type)}
                    className={`p-3 md:p-4 text-sm rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedAbuseTypes.includes(type)
                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Safety Rating - Always Available */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                🛡️ Safety Assessment
              </CardTitle>
              <CardDescription>How safe did you feel during this experience?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSafetyRating(rating)}
                    className={`p-3 md:p-4 rounded-xl border-2 font-medium transition-all transform hover:scale-105 text-center ${
                      safetyRating === rating
                        ? getSafetyColor(rating.toString()) + ' shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-xl md:text-2xl font-bold mb-1">{rating}</div>
                    <div className="text-xs">{getSafetyLabel(rating.toString())}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Ratings - Paid Users Only */}
          {featureAccess.enhancedRatings ? (
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  📊 Enhanced Impact Assessment
                </CardTitle>
                <CardDescription>Detailed analysis of emotional and psychological impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How would you rate your mood during this incident? (1-10)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setMoodRating(rating)}
                        className={`p-2 text-center rounded-lg border-2 transition-all ${
                          moodRating === rating
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold">{rating}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: <span className="font-medium">{moodRating}</span> — {getMoodDescriptor(moodRating)}
                  </div>
                </div>

                {/* Trigger Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How triggering was this experience? (1-5)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setTriggerLevel(rating)}
                        className={`p-3 text-center rounded-lg border-2 transition-all ${
                          triggerLevel === rating
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-lg">{rating}</div>
                        <div className="text-xs">{getTriggerDescriptor(rating)}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: <span className="font-medium">{triggerLevel}</span> — {getTriggerDescriptor(triggerLevel)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <UpgradePrompt feature="Enhanced Impact Assessment" />
          )}



          {/* Enhanced Categories - Paid Users Only */}
          {featureAccess.detailedAnalysis ? (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  🔍 Detailed Analysis
                </CardTitle>
                <CardDescription>Help identify patterns and behaviors (optional)</CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Behavior Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specific Behaviors Observed
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {behaviorCategoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setBehaviorCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(c => c !== category)
                            : [...prev, category]
                        )
                      }}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        behaviorCategories.includes(category)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {category.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotional Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Emotional Impact
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {emotionalImpactOptions.map((impact) => (
                    <button
                      key={impact}
                      type="button"
                      onClick={() => {
                        setEmotionalImpact(prev =>
                          prev.includes(impact)
                            ? prev.filter(i => i !== impact)
                            : [...prev, impact]
                        )
                      }}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        emotionalImpact.includes(impact)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {impact.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Flags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pattern Indicators
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {patternFlagOptions.map((flag) => (
                    <button
                      key={flag}
                      type="button"
                      onClick={() => {
                        setPatternFlags(prev =>
                          prev.includes(flag)
                            ? prev.filter(f => f !== flag)
                            : [...prev, flag]
                        )
                      }}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        patternFlags.includes(flag)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {flag.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          ) : (
            <UpgradePrompt feature="Detailed Pattern Analysis" />
          )}

          {/* Evidence and Documentation - Paid Users Only */}
          {featureAccess.evidenceDocumentation ? (
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📋 Evidence Documentation
              </CardTitle>
              <CardDescription>Document evidence and important details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Evidence Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Types of Evidence Available
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {evidenceTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setEvidenceType(prev =>
                          prev.includes(type)
                            ? prev.filter(t => t !== type)
                            : [...prev, type]
                        )
                      }}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        evidenceType.includes(type)
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Evidence Notes
                </label>
                <textarea
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors resize-none text-base"
                  placeholder="Notes about evidence, where it's stored, how to access it, etc."
                />
              </div>

              {/* Evidence Flag */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isEvidence"
                  checked={isEvidence}
                  onChange={(e) => setIsEvidence(e.target.checked)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isEvidence" className="text-sm font-medium text-gray-700">
                  Mark this entry as containing evidence for potential legal use
                </label>
              </div>

              {/* Content Warnings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Warnings (optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {contentWarningOptions.map((warning) => (
                    <button
                      key={warning}
                      type="button"
                      onClick={() => {
                        setContentWarnings(prev =>
                          prev.includes(warning)
                            ? prev.filter(w => w !== warning)
                            : [...prev, warning]
                        )
                      }}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        contentWarnings.includes(warning)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {warning.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          ) : (
            <UpgradePrompt feature="Evidence Documentation" />
          )}

          {/* How This Affected You - Recovery & Empowerment Only */}
          {featureAccess.howThisAffectedYou ? (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  🛡️ How This Affected You
                </CardTitle>
                <CardDescription>Your safety and emotional wellbeing matter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <Heart className="inline h-4 w-4 mr-1 text-blue-500" />
                      How were you feeling before?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {emotionalStates.map((state) => (
                        <button
                          key={state.value}
                          type="button"
                          onClick={() => handleEmotionalStateToggle(state.value, 'before')}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            getEmotionalIntensityStyle(state.intensity, emotionalStateBefore.includes(state.value))
                          }`}
                        >
                          {state.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <Heart className="inline h-4 w-4 mr-1 text-red-500" />
                      How did you feel after?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {emotionalStates.map((state) => (
                        <button
                          key={state.value}
                          type="button"
                          onClick={() => handleEmotionalStateToggle(state.value, 'after')}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            getEmotionalIntensityStyle(state.intensity, emotionalStateAfter.includes(state.value))
                          }`}
                        >
                          {state.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <UpgradePrompt feature="How This Affected You - Emotional Impact Tracking" />
          )}

          {/* Photo Evidence Upload */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📸 Photo Evidence
              </CardTitle>
              <CardDescription>Upload photos related to this entry (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <Camera className="inline h-4 w-4 mr-1" />
                    Photos
                  </label>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center sm:justify-start">
                    <Upload className="h-4 w-4" />
                    Add Photos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {photoEvidence.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {photoEvidence.map((photo, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="relative mb-3">
                          <img
                            src={photo.preview}
                            alt="Evidence"
                            className="w-full h-32 sm:h-48 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Add a caption..."
                          value={photo.caption}
                          onChange={(e) => updatePhotoCaption(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(photo.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Audio Evidence Recording */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                🎙️ Audio Evidence
              </CardTitle>
              <CardDescription>Record or upload audio evidence (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:space-y-8">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <Mic className="inline h-4 w-4 mr-1" />
                    Audio Recordings
                  </label>
                  <button
                    type="button"
                    onClick={isRecording ? stopAudioRecording : startAudioRecording}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center sm:justify-start ${
                      isRecording
                        ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>

                {audioEvidence.length > 0 && (
                  <div className="space-y-4">
                    {audioEvidence.map((recording, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <audio controls src={recording.audioUrl} className="flex-1 w-full" />
                          <button
                            type="button"
                            onClick={() => removeAudioRecording(index)}
                            className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 self-end sm:self-auto"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Add a caption..."
                          value={recording.caption}
                          onChange={(e) => updateAudioCaption(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                        />

                        <div className="text-xs text-gray-500 mb-2">
                          {new Date(recording.timestamp).toLocaleString()}
                        </div>

                        {recording.transcriptionStatus !== 'pending' && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-gray-700">Transcription:</span>
                              <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                                recording.transcriptionStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                recording.transcriptionStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {recording.transcriptionStatus}
                              </span>
                            </div>
                            {recording.transcription && (
                              <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-sm text-gray-800 max-w-full whitespace-pre-wrap">
                                {recording.transcription}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Context Details */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📍 Additional Context
              </CardTitle>
              <CardDescription>These details can be helpful but are optional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Where did this happen?
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Location of the incident"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="inline h-4 w-4 mr-1" />
                  Were there any witnesses?
                </label>
                <input
                  type="text"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Names of people who saw or heard what happened (comma-separated)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-xl">
            <div className="space-y-4">
              {/* Draft Mode Toggle - Paid Users Only */}
              {featureAccess.draftMode && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <input
                    type="checkbox"
                    id="isDraft"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isDraft" className="text-sm font-medium text-gray-700">
                    Save as draft (you can complete this entry later)
                  </label>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {featureAccess.draftMode && isDraft ? 'Save as draft?' : 'Ready to save your entry?'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {featureAccess.draftMode && isDraft
                      ? 'Your draft will be saved privately and you can complete it anytime.'
                      : 'Your information will be stored securely and privately.'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link
                    href="/journal"
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white transition-colors text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving || !title || (!description && !(featureAccess.draftMode && isDraft)) || !incidentDate}
                    className="px-6 md:px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : (featureAccess.draftMode && isDraft ? 'Save Draft' : 'Save Entry')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Sticky bottom action bar for small screens */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-3 sm:hidden">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/journal"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || !title || (!description && !(featureAccess.draftMode && isDraft)) || !incidentDate}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : (featureAccess.draftMode && isDraft ? 'Save Draft' : 'Save')}
              </button>
            </div>
          </div>
          {/* Spacer to prevent content hidden behind sticky bar */}
          <div className="h-20 sm:h-0" />
        </form>
      </div>

      {/* Behavior Assessment Help Dialog */}
      <Dialog open={showBehaviorHelp} onClose={() => setShowBehaviorHelp(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Understanding Behavior Assessment
                </DialogTitle>
                <button
                  onClick={() => setShowBehaviorHelp(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What is Behavior Assessment?</h3>
                  <p className="mb-4">
                    Behavior assessment helps you identify and document specific patterns of harmful behavior.
                    This is important for understanding the dynamics of your situation and can be valuable for
                    legal documentation, therapy, or personal healing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Common Behavior Patterns:</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-teal-700">Gaslighting</h4>
                      <p className="text-sm">Making you question your own memory, perception, or judgment</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-700">Love Bombing</h4>
                      <p className="text-sm">Excessive attention, affection, or gifts early in a relationship or after conflict</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-700">Silent Treatment</h4>
                      <p className="text-sm">Deliberately ignoring or refusing to communicate as punishment</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-700">Triangulation</h4>
                      <p className="text-sm">Bringing a third person into conflicts to manipulate or control</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-700">Projection</h4>
                      <p className="text-sm">Accusing you of behaviors or feelings they themselves exhibit</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-700">Financial Abuse</h4>
                      <p className="text-sm">Controlling access to money, credit, or financial resources</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Remember</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You don't need to select every behavior that applies</li>
                    <li>• This section is completely optional</li>
                    <li>• Your entries are private and secure</li>
                    <li>• Documenting patterns can help you and professionals understand your situation</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowBehaviorHelp(false)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}