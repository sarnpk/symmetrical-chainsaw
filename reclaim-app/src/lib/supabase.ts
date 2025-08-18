import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()

// Types for our database
export interface Profile {
  id: string
  email: string
  display_name?: string
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
  created_at: string
  updated_at: string
  is_active: boolean
  timezone: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  description: string
  content?: string
  incident_date: string
  incident_time?: string
  location?: string
  safety_rating: number // 1-5 scale
  mood_rating?: number // 1-10 scale
  abuse_types?: string[]
  behavior_categories?: string[]
  pattern_flags?: string[]
  emotional_impact?: string[]
  evidence_type?: string[]
  evidence_notes?: string
  witnesses?: string[]
  emotional_state_before?: string
  emotional_state_after?: string
  is_evidence: boolean
  is_draft: boolean
  content_warnings?: string[]
  trigger_level?: number // 1-5 scale
  ai_analysis?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface EvidenceFile {
  id: string
  journal_entry_id: string
  user_id: string
  file_name: string
  storage_bucket: string
  storage_path: string
  file_type: string
  file_size?: number
  caption?: string
  transcription?: string
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed'
  duration_seconds?: number
  metadata?: Record<string, any>
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  uploaded_at: string
  processed_at?: string
}

export interface AIConversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Safety Plan helpers used by ProtectedInformation component
export interface SafetyPlanRecord {
  id: string
  user_id: string
  protected_information?: string | null
  protected_info_password_hash?: string | null
  updated_at?: string
}

export async function getSafetyPlan(userId: string) {
  const client = createClient()
  const { data, error } = await client
    .from('safety_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return { data: data as SafetyPlanRecord | null, error }
}

export async function getProtectedInfoHash(userId: string) {
  const client = createClient()
  const { data, error } = await client
    .from('safety_plans')
    .select('protected_info_password_hash')
    .eq('user_id', userId)
    .maybeSingle()
  return { data: data as Pick<SafetyPlanRecord, 'protected_info_password_hash'> | null, error }
}

export async function updateProtectedInfo(
  userId: string,
  protectedInfo: string,
  passwordHash: string
) {
  const client = createClient()
  // Try update first
  const updateRes = await client
    .from('safety_plans')
    .update({
      protected_information: protectedInfo,
      protected_info_password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()

  if (updateRes.data) {
    return { data: updateRes.data as SafetyPlanRecord, error: updateRes.error }
  }

  // If no existing row, insert
  const insertRes = await client
    .from('safety_plans')
    .insert({
      user_id: userId,
      protected_information: protectedInfo,
      protected_info_password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  return { data: insertRes.data as SafetyPlanRecord | null, error: insertRes.error }
}