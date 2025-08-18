'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar, MapPin, Users, Heart, Shield, Trash2 } from 'lucide-react'
import Link from 'next/link'
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

  // Subscription tier state
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

  const getSafetyColor = (rating: string | number) => {
    const colors = {
      '1': 'text-red-600 bg-red-100',
      '2': 'text-orange-600 bg-orange-100', 
      '3': 'text-yellow-600 bg-yellow-100',
      '4': 'text-blue-600 bg-blue-100',
      '5': 'text-green-600 bg-green-100'
    }
    const key = String(rating) as keyof typeof colors
    return colors[key] || 'text-gray-600 bg-gray-100'
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/journal"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{entry.title}</h1>
              <p className="text-gray-600 mt-1">
                {new Date(entry.incident_date).toLocaleDateString()} at {new Date(entry.incident_date).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/journal/${entry.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Safety Rating */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Shield className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Safety Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(entry.safety_rating)}`}>
                    {String(entry.safety_rating)}/5
                  </span>
                  <span className="text-gray-500 text-sm">
                    {String(entry.safety_rating) === '1' && 'Very Unsafe'}
                    {String(entry.safety_rating) === '2' && 'Unsafe'}
                    {String(entry.safety_rating) === '3' && 'Neutral'}
                    {String(entry.safety_rating) === '4' && 'Safe'}
                    {String(entry.safety_rating) === '5' && 'Very Safe'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>What Happened</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {entry.description}
            </p>
          </CardContent>
        </Card>

        {/* Abuse Types */}
        {entry.abuse_types && entry.abuse_types.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Behavior Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {entry.abuse_types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {type.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How This Affected You - Recovery & Empowerment Only */}
        {featureAccess.howThisAffectedYou && (entry.emotional_state_before || entry.emotional_state_after) && (
          <Card>
            <CardHeader>
              <CardTitle>🛡️ How This Affected You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {entry.emotional_state_before && (
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Before</p>
                    <p className="text-gray-700">{entry.emotional_state_before}</p>
                  </div>
                </div>
              )}
              {entry.emotional_state_after && (
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">After</p>
                    <p className="text-gray-700">{entry.emotional_state_after}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Details */}
        {(entry.location || entry.witnesses) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {entry.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-700">{entry.location}</p>
                  </div>
                </div>
              )}
              {entry.witnesses && entry.witnesses.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Witnesses</p>
                    <p className="text-gray-700">{entry.witnesses.join(', ')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photo Evidence - available for all tiers */}
        {evidenceFiles.some(f => f.file_type?.startsWith('image')) && (
          <Card>
            <CardHeader>
              <CardTitle>📸 Photo Evidence</CardTitle>
              <CardDescription>Images attached to this entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceFiles.filter(file => file.file_type?.startsWith('image')).map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <img
                      src={evidenceUrls[file.id] || ''}
                      alt={file.caption || 'Evidence photo'}
                      className="w-full rounded-lg shadow-sm object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', file.storage_path, 'Bucket:', file.storage_bucket)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    {file.caption && (
                      <p className="text-gray-700 font-medium">{file.caption}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      📅 {new Date(file.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Audio Evidence - paid tiers may include transcriptions, but viewing is allowed if present */}
        {evidenceFiles.some(f => f.file_type?.startsWith('audio')) && (
          <Card>
            <CardHeader>
              <CardTitle>🎙️ Audio Evidence</CardTitle>
              <CardDescription>Audio recordings and their transcriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceFiles.filter(file => file.file_type?.startsWith('audio')).map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">🎵</div>
                      <div>
                        <p className="font-medium text-gray-900">Audio Recording</p>
                        <p className="text-sm text-gray-500">📅 {new Date(file.uploaded_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <audio controls className="w-full" src={evidenceUrls[file.id] || ''}>
                      Your browser does not support audio playback.
                    </audio>

                    {file.caption && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Caption:</p>
                        <p className="text-gray-700">{file.caption}</p>
                      </div>
                    )}

                    {/* Transcription status pill */}
                    <div className="flex items-center gap-2 text-xs">
                      {file.transcription_status === 'completed' && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                      )}
                      {file.transcription_status === 'processing' && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Processing…</span>
                      )}
                      {file.transcription_status === 'failed' && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">Failed</span>
                      )}
                    </div>

                    {/* Conversation-style transcription bubble */}
                    {file.transcription && (
                      <div className="mt-1">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-800">You</div>
                            <div className="flex-1">
                              <div className="inline-block bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-sm text-gray-800 max-w-full whitespace-pre-wrap">
                                {file.transcription}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-1">{new Date(file.uploaded_at).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created: {new Date(entry.created_at).toLocaleDateString()}
              </div>
              {entry.updated_at !== entry.created_at && (
                <div className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Updated: {new Date(entry.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Journal Entry</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<strong>{entry.title}</strong>"? This will permanently remove the entry and all associated evidence files.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEntry}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Entry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 