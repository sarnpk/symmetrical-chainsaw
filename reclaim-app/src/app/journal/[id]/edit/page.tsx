'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft, Calendar, MapPin, Users, Heart, Camera, Upload, X, Mic, MicOff, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Profile, JournalEntry } from '@/lib/supabase'
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

interface Props {
  params: Promise<{ id: string }>
}

export default function EditJournalEntryPage({ params }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentTime, setIncidentTime] = useState('')
  const [safetyRating, setSafetyRating] = useState<'1' | '2' | '3' | '4' | '5'>('3')
  const [selectedAbuseTypes, setSelectedAbuseTypes] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [witnesses, setWitnesses] = useState('')
  const [emotionalStateBefore, setEmotionalStateBefore] = useState<string[]>([])
  const [emotionalStateAfter, setEmotionalStateAfter] = useState<string[]>([])
  const [moodRating, setMoodRating] = useState<number | null>(null)

  // Evidence state
  const [existingEvidence, setExistingEvidence] = useState<EvidenceFile[]>([])
  const [evidenceUrls, setEvidenceUrls] = useState<{[key: string]: string}>({})
  const [photoEvidence, setPhotoEvidence] = useState<PhotoEvidence[]>([])
  const [audioEvidence, setAudioEvidence] = useState<AudioEvidence[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [saving, setSaving] = useState(false)

  // Subscription tier state
  const [subscriptionTier, setSubscriptionTier] = useState<'foundation' | 'recovery' | 'empowerment'>('foundation')

  const router = useRouter()
  const supabase = createClient()
  
  // Create admin client for storage uploads (bypasses RLS)
  const supabaseAdmin = createSupabaseClient(
    'https://gstiokcvqmxiaqzmtzmv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4NDQ4NiwiZXhwIjoyMDcwOTYwNDg2fQ.pE3OAwQKCZjg8PGpLBPCeZpJC2kXC-du2XSGOa8CJ48'
  )

  useEffect(() => {
    const loadEntry = async () => {
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
      
      // Load existing evidence files using admin client
      const { data: existingEvidence } = await supabaseAdmin
        .from('evidence_files')
        .select('*')
        .eq('journal_entry_id', resolvedParams.id)
        .order('uploaded_at', { ascending: true })

      if (existingEvidence) {
        setExistingEvidence(existingEvidence)
        
        // Generate signed URLs for existing evidence files
        const urls: {[key: string]: string} = {}
        for (const file of existingEvidence) {
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
      
      // Populate form fields
      setTitle(entry.title)
      setDescription(entry.description)
      
      // Parse the incident_date timestamp into separate date and time
      const incidentDateTime = new Date(entry.incident_date)
      setIncidentDate(incidentDateTime.toISOString().split('T')[0]) // YYYY-MM-DD
      setIncidentTime(incidentDateTime.toTimeString().slice(0, 5)) // HH:MM
      
      setSafetyRating(entry.safety_rating)
      setSelectedAbuseTypes(entry.abuse_types || [])
      setLocation(entry.location || '')
      setWitnesses(Array.isArray(entry.witnesses) ? entry.witnesses.join(', ') : (entry.witnesses || ''))
      setEmotionalStateBefore(entry.emotional_state_before ? entry.emotional_state_before.split(', ') : [])
      setEmotionalStateAfter(entry.emotional_state_after ? entry.emotional_state_after.split(', ') : [])
      setMoodRating(entry.mood_rating ?? null)
      
      setLoading(false)
    }

    loadEntry()
  }, [router, supabase, params])

  // Subscription tier helper functions
  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment'
  const isEmpowermentUser = () => subscriptionTier === 'empowerment'

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

  const featureAccess = getFeatureAccess()

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!entry || !user) return

      // Combine date and time into a single timestamp
      const incidentDateTime = incidentTime 
        ? `${incidentDate}T${incidentTime}:00.000Z`
        : `${incidentDate}T12:00:00.000Z`

      const updateData: any = {
        title,
        description,
        incident_date: incidentDateTime,
        safety_rating: safetyRating,
        abuse_types: selectedAbuseTypes,
        location: location || null,
        witnesses: witnesses ? witnesses.split(',').map(w => w.trim()).filter(w => w) : null,
        emotional_state_before: emotionalStateBefore.join(', ') || null,
        emotional_state_after: emotionalStateAfter.join(', ') || null,
        updated_at: new Date().toISOString()
      }

      if (featureAccess.enhancedRatings) {
        updateData.mood_rating = moodRating ?? null
      }

      const { error } = await supabase
        .from('journal_entries')
        .update(updateData)
        .eq('id', entry.id)

      if (error) throw error

      console.log('Journal entry updated, now uploading evidence...')
      console.log('Photos to upload:', photoEvidence.length)
      console.log('Audio to upload:', audioEvidence.length)

      // Upload new photos using Supabase Storage API
      for (const [index, photo] of photoEvidence.entries()) {
        const fileName = `${entry.id}/photo-${index}-${Date.now()}.jpg`
        
        try {
          // Use standard Supabase Storage API
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('evidence-photos')
            .upload(fileName, photo.file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Photo upload error:', uploadError)
            toast.error(`Photo upload failed: ${uploadError.message}`)
            continue
          }

          // Save metadata using regular Supabase client
          const { error: photoDbError } = await supabase
            .from('evidence_files')
            .insert({
              journal_entry_id: entry.id,
              user_id: user.id,
              file_name: photo.file.name,
              storage_bucket: 'evidence-photos',
              storage_path: fileName,
              file_type: photo.file.type,
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

      // Upload new audio recordings using direct S3 API
      for (const [index, audio] of audioEvidence.entries()) {
        const fileName = `${entry.id}/audio-${index}-${Date.now()}.wav`
        
        try {
          // Use standard Supabase Storage API
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('evidence-audio')
            .upload(fileName, audio.file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Audio upload error:', uploadError)
            toast.error(`Audio upload failed: ${uploadError.message}`)
            continue
          }

          // Save metadata using regular Supabase client
          const { data: evidenceData, error: audioDbError } = await supabase
            .from('evidence_files')
            .insert({
              journal_entry_id: entry.id,
              user_id: user.id,
              file_name: audio.file.name,
              storage_bucket: 'evidence-audio',
              storage_path: fileName,
              file_type: audio.file.type,
              file_size: audio.file.size,
              caption: audio.caption || null,
              transcription_status: 'pending',
              duration_seconds: audio.duration || null,
              uploaded_at: new Date().toISOString()
            })
            .select('id')
            .single()

          if (audioDbError) {
            console.error('Audio DB error:', audioDbError)
          } else {
            console.log('Audio uploaded successfully:', fileName)
            
            // Start transcription via Edge Function
            if (evidenceData) {
              // AI transcription is a paid feature
              if (isPaidUser()) {
                try {
                  await supabase.functions.invoke('transcribe-audio', {
                    body: { 
                      fileId: evidenceData.id,
                      storagePath: fileName
                    }
                  })
                } catch (transcriptionError) {
                  console.error('Transcription error:', transcriptionError)
                }
              }
            }
          }
        } catch (error) {
          console.error('Audio upload error:', error)
        }
      }

      console.log('All uploads completed!')
      toast.success('Entry and evidence updated successfully!')
      router.push(`/journal/${entry.id}`)
    } catch (error: any) {
      toast.error('Failed to update entry: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleAbuseType = (type: string) => {
    setSelectedAbuseTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleEmotionalState = (state: string, isBefore: boolean) => {
    const setter = isBefore ? setEmotionalStateBefore : setEmotionalStateAfter
    setter(prev => 
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    )
  }

  const getIntensityColor = (intensity: string, isSelected: boolean) => {
    const baseColors = {
      positive: isSelected ? 'bg-green-500 text-white' : 'border-green-500 text-green-700 hover:bg-green-50',
      neutral: isSelected ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-700 hover:bg-blue-50',
      negative: isSelected ? 'bg-red-500 text-white' : 'border-red-500 text-red-700 hover:bg-red-50'
    }
    return baseColors[intensity as keyof typeof baseColors]
  }

  const getSafetyColor = (rating: string, isSelected: boolean) => {
    const colors = {
      '1': isSelected ? 'bg-red-600 text-white' : 'border-red-600 text-red-700 hover:bg-red-50',
      '2': isSelected ? 'bg-orange-500 text-white' : 'border-orange-500 text-orange-700 hover:bg-orange-50',
      '3': isSelected ? 'bg-yellow-500 text-white' : 'border-yellow-500 text-yellow-700 hover:bg-yellow-50',
      '4': isSelected ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-700 hover:bg-blue-50',
      '5': isSelected ? 'bg-green-600 text-white' : 'border-green-600 text-green-700 hover:bg-green-50'
    }
    return colors[rating as keyof typeof colors] || 'border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          const newPhoto = {
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
    
    // Reset the input
    e.target.value = ''
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
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const audioFile = new File([audioBlob], `audio-${Date.now()}.wav`, { type: 'audio/wav' })
        
        const newRecording = {
          file: audioFile,
          caption: '',
          timestamp: new Date().toISOString(),
          duration: 0,
          transcription: '',
          transcriptionStatus: 'pending' as const,
          audioUrl
        }
        
        setAudioEvidence(prev => [...prev, newRecording])
      }

      setMediaRecorder(recorder)
      setAudioStream(stream)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      toast.error('Failed to start recording')
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

  const removeExistingEvidence = async (evidenceId: string) => {
    try {
      const { error } = await supabase
        .from('evidence_files')
        .delete()
        .eq('id', evidenceId)
      
      if (error) throw error
      
      setExistingEvidence(prev => prev.filter(file => file.id !== evidenceId))
      toast.success('Evidence file deleted')
    } catch (error: any) {
      toast.error('Failed to delete evidence: ' + error.message)
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
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/journal/${entry.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Entry</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Update your documented experience</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
          {/* Basic Information */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📝 What Happened
              </CardTitle>
              <CardDescription>Tell your story in your own words</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                  placeholder="Describe what happened in detail. This is your safe space to document everything."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    When did this happen? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Time
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Rating */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                🛡️ Safety Assessment
              </CardTitle>
              <CardDescription>How safe did you feel during this experience?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {['1', '2', '3', '4', '5'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSafetyRating(rating as any)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-center ${
                      getSafetyColor(rating, safetyRating === rating)
                    }`}
                  >
                    <div className="text-lg font-bold">{rating}</div>
                    <div className="text-xs mt-1">
                      {rating === '1' && 'Very Unsafe'}
                      {rating === '2' && 'Unsafe'}
                      {rating === '3' && 'Neutral'}
                      {rating === '4' && 'Safe'}
                      {rating === '5' && 'Very Safe'}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Abuse Types */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                🎭 Behavior Categories
              </CardTitle>
              <CardDescription>What types of behavior did you experience? (Select all that apply)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {abuseTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAbuseType(type)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                      selectedAbuseTypes.includes(type)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'border-red-300 text-red-700 hover:bg-red-50'
                    }`}
                  >
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How This Affected You - Recovery & Empowerment Only */}
          {featureAccess.howThisAffectedYou ? (
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Heart className="h-5 w-5" />
                  🛡️ How This Affected You
                </CardTitle>
                <CardDescription>How did you feel before and after this experience?</CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">How did you feel BEFORE?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {emotionalStates.map((state) => (
                    <button
                      key={`before-${state.value}`}
                      type="button"
                      onClick={() => toggleEmotionalState(state.value, true)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        getIntensityColor(state.intensity, emotionalStateBefore.includes(state.value))
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">How did you feel AFTER?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {emotionalStates.map((state) => (
                    <button
                      key={`after-${state.value}`}
                      type="button"
                      onClick={() => toggleEmotionalState(state.value, false)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        getIntensityColor(state.intensity, emotionalStateAfter.includes(state.value))
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
              </div>

              {featureAccess.enhancedRatings && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How would you rate your mood during this incident? (1-10)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
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
                        <div className="text-sm font-semibold">{rating}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Optional. Leave unset if you prefer not to rate.</p>
                </div>
              )}
            </CardContent>
          </Card>
          ) : (
            <UpgradePrompt feature="How This Affected You - Emotional Impact Tracking" />
          )}

          {/* Additional Details */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📍 Additional Context
              </CardTitle>
              <CardDescription>Any additional details that might be important</CardDescription>
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

          {/* Photo Evidence (all tiers) */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                📸 Photo Evidence
              </CardTitle>
              <CardDescription>Add photos related to this entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Photos */}
              {existingEvidence.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Existing Photos</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {existingEvidence
                      .filter(file => file.file_type?.startsWith('image'))
                      .map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="relative mb-3">
                            <img
                              src={evidenceUrls[file.id] || ''}
                              alt={file.caption || 'Evidence photo'}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Image failed to load:', file.storage_path, 'Bucket:', file.storage_bucket)
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingEvidence(file.id)}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {file.caption && (
                            <p className="text-gray-700 font-medium mb-2">{file.caption}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            📅 {new Date(file.uploaded_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h4 className="font-medium text-gray-900">Add New Photos</h4>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <span className="hidden sm:inline">Take Photo</span>
                      <span className="sm:hidden">Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                    
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span className="hidden sm:inline">Upload Photos</span>
                      <span className="sm:hidden">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  </div>
                </div>
                
                {photoEvidence.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {photoEvidence.map((photo, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="relative mb-3">
                          <img
                            src={photo.preview}
                            alt="Evidence"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Add a caption..."
                            value={photo.caption}
                            onChange={(e) => updatePhotoCaption(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <p className="text-xs text-gray-500">
                            📅 {new Date(photo.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Audio Evidence (all tiers; AI transcription gated to paid) */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                🎤 Audio Evidence
              </CardTitle>
              <CardDescription>Record or upload audio. AI transcription runs for paid plans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Audio */}
              {existingEvidence.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Existing Audio</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {existingEvidence
                      .filter(file => file.file_type?.startsWith('audio'))
                      .map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              🎵
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">Audio Recording</p>
                              <p className="text-sm text-gray-500">
                                📅 {new Date(file.uploaded_at).toLocaleString()}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingEvidence(file.id)}
                              className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors self-start sm:self-center"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <audio
                            controls
                            className="w-full mb-3"
                            src={evidenceUrls[file.id] || ''}
                          >
                            Your browser does not support audio playback.
                          </audio>

                          {file.caption && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-900 mb-1">Caption:</p>
                              <p className="text-gray-700">{file.caption}</p>
                            </div>
                          )}

                          {file.transcription && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Transcription:</p>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded italic">
                                "{file.transcription}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Audio Recording */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h4 className="font-medium text-gray-900">Add New Audio Recordings</h4>
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
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            🎵
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Audio Recording</p>
                            <p className="text-sm text-gray-500">
                              📅 {new Date(recording.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAudioRecording(index)}
                            className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors self-start sm:self-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <audio
                          controls
                          className="w-full mb-3"
                          src={recording.audioUrl}
                        >
                          Your browser does not support audio playback.
                        </audio>

                        <input
                          type="text"
                          placeholder="Add a caption..."
                          value={recording.caption}
                          onChange={(e) => updateAudioCaption(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href={`/journal/${entry.id}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Updating...' : 'Update Entry'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 