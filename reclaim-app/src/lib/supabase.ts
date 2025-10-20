import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Grey Rock Gamification types
export interface GRStreak {
  user_id: string
  current_streak: number
  best_streak: number
  last_practiced_date: string | null
  updated_at?: string
}

export interface GRPackStats {
  user_id: string
  pack: 'Basics' | 'Boundaries' | 'High-Conflict'
  attempts: number
  updated_at?: string
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

// Grey Rock practice persistence types
export interface GreyRockSession {
  id: string
  user_id: string
  mode: 'learn' | 'practice'
  started_at: string
  ended_at?: string | null
  duration_ms?: number | null
  total_attempts: number
  correct_count: number
  difficulty_breakdown?: Record<string, number> | null
  metadata?: Record<string, any> | null
}

export interface GreyRockAttempt {
  id: string
  session_id: string
  user_id: string
  scenario_id: string
  difficulty?: 'easy' | 'medium' | 'hard' | null
  selected_response: string
  is_correct: boolean
  latency_ms?: number | null
  created_at: string
  metadata?: Record<string, any> | null
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

// Feature usage helpers (client-side)
export async function checkFeatureLimit(
  userId: string,
  featureName: string,
  limitType: string = 'monthly_count'
) {
  const client = createClient()
  const { data, error } = await client.rpc('check_feature_limit', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_limit_type: limitType,
  })
  return { data: data as boolean | null, error }
}

export async function recordFeatureUsage(
  userId: string,
  featureName: string,
  usageType: string = 'monthly_count',
  usageCount: number = 1,
  metadata: Record<string, any> = {}
) {
  const client = createClient()
  const { data, error } = await client.rpc('record_feature_usage', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_usage_type: usageType,
    p_usage_count: usageCount,
    p_metadata: metadata,
  })
  return { data, error }
}

// Grey Rock sessions/attempts helpers
export async function createGreyRockSession(
  userId: string,
  mode: 'learn' | 'practice',
  metadata: Record<string, any> = {}
) {
  const client = createClient()
  const { data, error } = await client
    .from('grey_rock_sessions')
    .insert({ user_id: userId, mode, metadata })
    .select('*')
    .single()
  return { data: data as GreyRockSession | null, error }
}

export async function endGreyRockSession(
  sessionId: string,
  updates: Partial<Pick<GreyRockSession, 'ended_at' | 'duration_ms' | 'total_attempts' | 'correct_count' | 'difficulty_breakdown' | 'metadata'>>
) {
  const client = createClient()
  const { data, error } = await client
    .from('grey_rock_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select('*')
    .single()
  return { data: data as GreyRockSession | null, error }
}

export async function createGreyRockAttempt(
  userId: string,
  sessionId: string,
  params: {
    scenario_id: string
    difficulty?: 'easy' | 'medium' | 'hard'
    selected_response: string
    is_correct: boolean
    latency_ms?: number
    metadata?: Record<string, any>
  }
) {
  const client = createClient()
  const { data, error } = await client
    .from('grey_rock_attempts')
    .insert({ user_id: userId, session_id: sessionId, ...params })
    .select('*')
    .single()
  return { data: data as GreyRockAttempt | null, error }
}

// ---------- Grey Rock Gamification Helpers ----------
export async function getStreak(userId: string) {
  const client = createClient()
  const { data, error } = await client
    .from('gr_user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return { data: (data as GRStreak | null) || null, error }
}

export async function upsertStreakOnAttempt(userId: string) {
  const client = createClient()
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  // Read current streak
  const { data: existing } = await client
    .from('gr_user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    const { data, error } = await client
      .from('gr_user_streaks')
      .insert({ user_id: userId, current_streak: 1, best_streak: 1, last_practiced_date: todayStr })
      .select('*')
      .single()
    return { data: data as GRStreak | null, error }
  }

  const last = existing.last_practiced_date as string | null
  let current = existing.current_streak as number
  let best = existing.best_streak as number
  // Compute yesterday string
  const y = new Date(today)
  y.setDate(y.getDate() - 1)
  const yesterdayStr = y.toISOString().slice(0, 10)

  if (last === todayStr) {
    // already counted today
    const { data, error } = await client
      .from('gr_user_streaks')
      .update({ updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select('*')
      .single()
    return { data: data as GRStreak | null, error }
  }

  if (last === yesterdayStr) {
    current = current + 1
    if (current > best) best = current
  } else {
    current = 1
    if (best < 1) best = 1
  }

  const { data, error } = await client
    .from('gr_user_streaks')
    .update({ current_streak: current, best_streak: best, last_practiced_date: todayStr, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('*')
    .single()
  return { data: data as GRStreak | null, error }
}

export async function getPackStats(userId: string) {
  const client = createClient()
  const { data, error } = await client
    .from('gr_user_pack_stats')
    .select('*')
    .eq('user_id', userId)
  return { data: (data as GRPackStats[] | null) || [], error }
}

export async function incrementPackAttempts(userId: string, pack: 'Basics' | 'Boundaries' | 'High-Conflict') {
  const client = createClient()
  // Try update (atomic increment via RPC is ideal; here we do read-modify-write simple flow)
  const { data: existing } = await client
    .from('gr_user_pack_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('pack', pack)
    .maybeSingle()

  if (!existing) {
    const { data, error } = await client
      .from('gr_user_pack_stats')
      .insert({ user_id: userId, pack, attempts: 1 })
      .select('*')
      .single()
    return { data: data as GRPackStats | null, error }
  }

  const attempts = (existing.attempts as number) + 1
  const { data, error } = await client
    .from('gr_user_pack_stats')
    .update({ attempts, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('pack', pack)
    .select('*')
    .single()
  return { data: data as GRPackStats | null, error }
}