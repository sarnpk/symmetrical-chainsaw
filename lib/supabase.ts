import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types based on your Supabase schema
export interface Profile {
  id: string
  email: string
  display_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  location?: string
  date_of_birth?: string
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
  is_active: boolean
  timezone: string
  ui_preferences?: Record<string, any>
  privacy_settings?: {
    data_sharing: boolean
    analytics: boolean
    marketing_emails: boolean
    push_notifications: boolean
  }
  security_settings?: {
    two_factor_enabled: boolean
    login_alerts: boolean
    data_encryption: boolean
  }
  created_at: string
  updated_at: string
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

export interface Boundary {
  id: string
  user_id: string
  title: string
  description: string
  category: 'communication' | 'emotional' | 'physical' | 'time' | 'social' | 'workplace'
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'working-on' | 'needs-attention'
  is_active: boolean
  created_at: string
  updated_at: string
  last_reviewed: string
}

export interface BoundaryInteraction {
  id: string
  boundary_id: string
  user_id: string
  interaction_type: 'violation' | 'success' | 'review' | 'modification'
  severity?: 'low' | 'medium' | 'high'
  description?: string
  context?: string
  emotional_impact?: number // 1-5 scale
  location?: string
  triggers?: string[]
  outcome?: string
  lessons_learned?: string
  created_at: string
}

export interface BoundaryAnalytics {
  id: string
  user_id: string
  boundary_id: string
  period_start: string
  period_end: string
  period_type: 'daily' | 'weekly' | 'monthly'
  total_interactions: number
  violations_count: number
  successes_count: number
  reviews_count: number
  modifications_count: number
  success_rate?: number
  average_emotional_impact?: number
  trend_direction?: 'improving' | 'stable' | 'declining'
  created_at: string
  updated_at: string
}

export interface BoundaryReview {
  id: string
  boundary_id: string
  user_id: string
  review_type: 'scheduled' | 'triggered' | 'manual'
  review_status: 'pending' | 'completed' | 'skipped'
  effectiveness_rating?: number // 1-5 scale
  needs_modification: boolean
  modification_notes?: string
  challenges_faced?: string
  support_needed?: string
  scheduled_date?: string
  completed_date?: string
  next_review_date?: string
  created_at: string
}

export interface SafetyPlan {
  id: string
  user_id: string
  emergency_contacts: Array<{
    name: string
    phone: string
    relationship: string
    available_times: string
  }>
  safe_locations: Array<{
    name: string
    address: string
    contact_person: string
    phone: string
    notes: string
  }>
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
  protected_info_password_hash?: string
  protected_information?: string
  created_at: string
  updated_at: string
}

export interface AIConversation {
  id: string
  user_id: string
  title: string
  context_type: 'general' | 'crisis' | 'pattern-analysis' | 'mind-reset' | 'grey-rock'
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: Record<string, any>
  created_at: string
}

// New interfaces for comprehensive schema
export interface PatternAnalysis {
  id: string
  user_id: string
  analysis_type: 'abuse_patterns' | 'time_patterns' | 'emotional_trends' | 'escalation_indicators'
  analysis_period_start: string
  analysis_period_end: string
  patterns_identified: Record<string, any>[]
  insights: Record<string, any>
  recommendations: Record<string, any>[]
  risk_assessment: Record<string, any>
  confidence_score?: number
  data_points_analyzed?: number
  ai_model_version?: string
  created_at: string
  updated_at: string
}

export interface UserInsight {
  id: string
  user_id: string
  insight_type: 'pattern' | 'recommendation' | 'warning' | 'progress' | 'achievement'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  related_entries?: string[]
  related_patterns?: string[]
  action_items: Record<string, any>[]
  is_read: boolean
  is_dismissed: boolean
  user_feedback?: string
  created_at: string
  expires_at?: string
}

export interface ExportRequest {
  id: string
  user_id: string
  export_type: 'journal_pdf' | 'evidence_package' | 'pattern_report' | 'legal_summary' | 'therapeutic_report'
  date_range_start?: string
  date_range_end?: string
  include_evidence: boolean
  include_patterns: boolean
  export_format: 'pdf' | 'docx' | 'json' | 'csv'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  file_path?: string
  file_size?: number
  download_count: number
  processing_started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  expires_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  feature_name: string
  usage_type: 'api_call' | 'storage_mb' | 'export_request' | 'ai_interaction'
  usage_count: number
  usage_metadata: Record<string, any>
  billing_period_start: string
  billing_period_end: string
  created_at: string
}

export interface FeatureLimit {
  id: string
  subscription_tier: 'foundation' | 'recovery' | 'empowerment'
  feature_name: string
  limit_type: 'monthly_count' | 'storage_mb' | 'concurrent_sessions'
  limit_value: number
  created_at: string
  updated_at: string
}

export interface MindResetSession {
  id: string
  user_id: string
  session_type: 'thought_reframe' | 'breathing_exercise' | 'grounding_technique' | 'affirmation'
  original_thought?: string
  reframed_thought?: string
  techniques_used?: string[]
  duration_minutes?: number
  mood_before?: number
  mood_after?: number
  effectiveness_rating?: number
  notes?: string
  created_at: string
}

export interface MoodCheckIn {
  id: string
  user_id: string
  mood_rating: number // 1-10
  energy_level: number // 1-10
  anxiety_level: number // 1-10
  notes?: string
  created_at: string
}

export interface CopingStrategy {
  id: string
  user_id: string
  strategy_name: string
  description?: string
  effectiveness_rating?: number // 1-5
  category?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HealingResource {
  id: string
  user_id: string
  resource_type: 'affirmation' | 'quote' | 'exercise' | 'article'
  title: string
  content: string
  is_favorite: boolean
  created_at: string
}

export interface RecoveryLesson {
  id: string
  title: string
  description: string
  content: string
  category: 'boundaries' | 'healing' | 'safety' | 'communication' | 'self-care'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress_percentage: number
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const createClient = () => {
  return supabase
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Journal helpers
export const getJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select(`
      *,
      evidence_files (*)
    `)
    .eq('user_id', userId)
    .order('incident_date', { ascending: false })
  
  return { data, error }
}

export const createJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([{
      ...entry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()
  
  return { data, error }
}

export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// Boundary helpers
export const getBoundaries = async (userId: string) => {
  const { data, error } = await supabase
    .from('boundaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createBoundary = async (boundary: Omit<Boundary, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('boundaries')
    .insert([{
      ...boundary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_reviewed: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const updateBoundary = async (id: string, updates: Partial<Boundary>) => {
  const { data, error } = await supabase
    .from('boundaries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export const deleteBoundary = async (id: string) => {
  const { data, error } = await supabase
    .from('boundaries')
    .delete()
    .eq('id', id)

  return { data, error }
}

// Boundary Interaction helpers
export const createBoundaryInteraction = async (interaction: Omit<BoundaryInteraction, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('boundary_interactions')
    .insert([{
      ...interaction,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const getBoundaryInteractions = async (userId: string, boundaryId?: string) => {
  let query = supabase
    .from('boundary_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (boundaryId) {
    query = query.eq('boundary_id', boundaryId)
  }

  const { data, error } = await query
  return { data, error }
}

export const getBoundaryInteractionsByType = async (
  userId: string,
  interactionType: BoundaryInteraction['interaction_type'],
  boundaryId?: string
) => {
  let query = supabase
    .from('boundary_interactions')
    .select('*')
    .eq('user_id', userId)
    .eq('interaction_type', interactionType)
    .order('created_at', { ascending: false })

  if (boundaryId) {
    query = query.eq('boundary_id', boundaryId)
  }

  const { data, error } = await query
  return { data, error }
}

// Safety Plan helpers
export const getSafetyPlan = async (userId: string) => {
  const { data, error } = await supabase
    .from('safety_plans')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createOrUpdateSafetyPlan = async (userId: string, plan: Omit<SafetyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const { data: existing } = await getSafetyPlan(userId)

  if (existing) {
    const { data, error } = await supabase
      .from('safety_plans')
      .update({ ...plan, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  } else {
    const { data, error } = await supabase
      .from('safety_plans')
      .insert([{
        ...plan,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    return { data, error }
  }
}

// Protected Information helpers
export const updateProtectedInfo = async (userId: string, protectedInfo: string, passwordHash: string) => {
  const { data, error } = await supabase
    .from('safety_plans')
    .update({
      protected_information: protectedInfo,
      protected_info_password_hash: passwordHash,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export const getProtectedInfoHash = async (userId: string) => {
  const { data, error } = await supabase
    .from('safety_plans')
    .select('protected_info_password_hash')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

// Boundary Review helpers
export const createBoundaryReview = async (review: Omit<BoundaryReview, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('boundary_reviews')
    .insert([{
      ...review,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const updateBoundaryReview = async (id: string, updates: Partial<BoundaryReview>) => {
  const { data, error } = await supabase
    .from('boundary_reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export const getBoundaryReviews = async (userId: string, boundaryId?: string) => {
  let query = supabase
    .from('boundary_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (boundaryId) {
    query = query.eq('boundary_id', boundaryId)
  }

  const { data, error } = await query
  return { data, error }
}

export const getPendingBoundaryReviews = async (userId: string) => {
  const { data, error } = await supabase
    .from('boundary_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('review_status', 'pending')
    .order('scheduled_date', { ascending: true })

  return { data, error }
}

// Boundary Analytics helpers
export const getBoundaryAnalytics = async (
  userId: string,
  boundaryId?: string,
  periodType: 'daily' | 'weekly' | 'monthly' = 'weekly'
) => {
  let query = supabase
    .from('boundary_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('period_type', periodType)
    .order('period_start', { ascending: false })

  if (boundaryId) {
    query = query.eq('boundary_id', boundaryId)
  }

  const { data, error } = await query
  return { data, error }
}

export const createOrUpdateBoundaryAnalytics = async (analytics: Omit<BoundaryAnalytics, 'id' | 'created_at' | 'updated_at'>) => {
  // Check if analytics already exist for this period
  const { data: existing } = await supabase
    .from('boundary_analytics')
    .select('id')
    .eq('boundary_id', analytics.boundary_id)
    .eq('period_start', analytics.period_start)
    .eq('period_end', analytics.period_end)
    .eq('period_type', analytics.period_type)
    .single()

  if (existing) {
    // Update existing analytics
    const { data, error } = await supabase
      .from('boundary_analytics')
      .update({ ...analytics, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    return { data, error }
  } else {
    // Create new analytics
    const { data, error } = await supabase
      .from('boundary_analytics')
      .insert([{
        ...analytics,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    return { data, error }
  }
}

// Utility function to calculate boundary success rate
export const calculateBoundarySuccessRate = async (
  boundaryId: string,
  startDate: string,
  endDate: string
): Promise<{ data: number | null, error: any }> => {
  try {
    const { data, error } = await supabase.rpc('calculate_boundary_success_rate', {
      p_boundary_id: boundaryId,
      p_start_date: startDate,
      p_end_date: endDate
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// AI Conversation helpers
export const getAIConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select(`
      *,
      ai_messages (*)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  return { data, error }
}

export const createAIMessage = async (message: Omit<AIMessage, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('ai_messages')
    .insert([{
      ...message,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()
  
  return { data, error }
}

// File upload helpers
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  return { data, error }
}

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// Pattern Analysis helpers
export const createPatternAnalysis = async (analysis: Omit<PatternAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('pattern_analysis')
    .insert([{
      ...analysis,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const getPatternAnalysis = async (userId: string, analysisType?: string) => {
  let query = supabase
    .from('pattern_analysis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (analysisType) {
    query = query.eq('analysis_type', analysisType)
  }

  const { data, error } = await query
  return { data, error }
}

// User Insights helpers
export const createUserInsight = async (insight: Omit<UserInsight, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('user_insights')
    .insert([{
      ...insight,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const getUserInsights = async (userId: string, unreadOnly: boolean = false) => {
  let query = supabase
    .from('user_insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query
  return { data, error }
}

export const markInsightAsRead = async (insightId: string) => {
  const { data, error } = await supabase
    .from('user_insights')
    .update({ is_read: true })
    .eq('id', insightId)
    .select()
    .single()

  return { data, error }
}

// Export Request helpers
export const createExportRequest = async (request: Omit<ExportRequest, 'id' | 'created_at' | 'expires_at' | 'download_count'>) => {
  const { data, error } = await supabase
    .from('export_requests')
    .insert([{
      ...request,
      download_count: 0,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    }])
    .select()
    .single()

  return { data, error }
}

export const getExportRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('export_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const updateExportRequest = async (id: string, updates: Partial<ExportRequest>) => {
  const { data, error } = await supabase
    .from('export_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Usage Tracking helpers
export const getUserUsage = async (userId: string, featureName?: string) => {
  let query = supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (featureName) {
    query = query.eq('feature_name', featureName)
  }

  const { data, error } = await query
  return { data, error }
}

export const checkFeatureLimit = async (userId: string, featureName: string, limitType: string = 'monthly_count') => {
  const { data, error } = await supabase.rpc('check_feature_limit', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_limit_type: limitType
  })

  return { data, error }
}

// Mind Reset Session helpers
export const createMindResetSession = async (session: Omit<MindResetSession, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('mind_reset_sessions')
    .insert([{
      ...session,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const getMindResetSessions = async (userId: string, sessionType?: string) => {
  let query = supabase
    .from('mind_reset_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (sessionType) {
    query = query.eq('session_type', sessionType)
  }

  const { data, error } = await query
  return { data, error }
}