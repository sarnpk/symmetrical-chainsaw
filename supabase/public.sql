/*
 Navicat Premium Data Transfer

 Source Server         : Reclaimapp
 Source Server Type    : PostgreSQL
 Source Server Version : 170004 (170004)
 Source Host           : aws-1-us-east-2.pooler.supabase.com:6543
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170004 (170004)
 File Encoding         : 65001

 Date: 27/11/2025 07:12:27
*/


-- ----------------------------
-- Type structure for abuse_type
-- ----------------------------
DROP TYPE IF EXISTS "public"."abuse_type";
CREATE TYPE "public"."abuse_type" AS ENUM (
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
);
ALTER TYPE "public"."abuse_type" OWNER TO "postgres";

-- ----------------------------
-- Type structure for safety_rating
-- ----------------------------
DROP TYPE IF EXISTS "public"."safety_rating";
CREATE TYPE "public"."safety_rating" AS ENUM (
  '1',
  '2',
  '3',
  '4',
  '5'
);
ALTER TYPE "public"."safety_rating" OWNER TO "postgres";

-- ----------------------------
-- Type structure for subscription_tier
-- ----------------------------
DROP TYPE IF EXISTS "public"."subscription_tier";
CREATE TYPE "public"."subscription_tier" AS ENUM (
  'foundation',
  'recovery',
  'empowerment'
);
ALTER TYPE "public"."subscription_tier" OWNER TO "postgres";

-- ----------------------------
-- Table structure for abuse_cycles
-- ----------------------------
DROP TABLE IF EXISTS "public"."abuse_cycles";
CREATE TABLE "public"."abuse_cycles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "cycle_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "phases" jsonb NOT NULL,
  "average_cycle_length_days" int4,
  "current_phase" text COLLATE "pg_catalog"."default",
  "cycle_start_date" date,
  "predicted_next_phase_date" date,
  "cycle_count" int4 DEFAULT 1,
  "pattern_confidence" numeric(3,2),
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for acceptance_journal
-- ----------------------------
DROP TABLE IF EXISTS "public"."acceptance_journal";
CREATE TABLE "public"."acceptance_journal" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "entry_date" date DEFAULT CURRENT_DATE,
  "acceptance_level" int4,
  "daily_struggle" text COLLATE "pg_catalog"."default",
  "hope_triggers" text[] COLLATE "pg_catalog"."default",
  "reality_anchors" text[] COLLATE "pg_catalog"."default",
  "emotional_state" varchar(50) COLLATE "pg_catalog"."default",
  "breakthrough_moment" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for acceptance_milestones
-- ----------------------------
DROP TABLE IF EXISTS "public"."acceptance_milestones";
CREATE TABLE "public"."acceptance_milestones" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "milestone_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "achieved_at" timestamptz(6) DEFAULT now(),
  "description" text COLLATE "pg_catalog"."default",
  "emotional_impact" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for acceptance_progress
-- ----------------------------
DROP TABLE IF EXISTS "public"."acceptance_progress";
CREATE TABLE "public"."acceptance_progress" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "module_type" text COLLATE "pg_catalog"."default",
  "completed" bool DEFAULT false,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now(),
  "difficulty_rating" int4,
  "emotional_state" varchar(50) COLLATE "pg_catalog"."default",
  "breakthrough_moments" text COLLATE "pg_catalog"."default",
  "resistance_areas" text COLLATE "pg_catalog"."default",
  "revisit_count" int4 DEFAULT 0,
  "last_revisited" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS "public"."admin_users";
CREATE TABLE "public"."admin_users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" text COLLATE "pg_catalog"."default" DEFAULT 'admin'::text,
  "permissions" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "created_by" uuid,
  "is_active" bool DEFAULT true,
  "last_login_at" timestamptz(6),
  "last_login_ip" text COLLATE "pg_catalog"."default",
  "failed_attempts" int4 DEFAULT 0,
  "locked_until" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for affirmation_preferences
-- ----------------------------
DROP TABLE IF EXISTS "public"."affirmation_preferences";
CREATE TABLE "public"."affirmation_preferences" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "has_children" bool DEFAULT false,
  "children_count" int4 DEFAULT 0,
  "custody_situation" text COLLATE "pg_catalog"."default",
  "preferred_focus" text[] COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for affirmations
-- ----------------------------
DROP TABLE IF EXISTS "public"."affirmations";
CREATE TABLE "public"."affirmations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "category" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "text" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_default" bool DEFAULT true,
  "created_at" timestamp(6) DEFAULT now(),
  "is_parent_focused" bool DEFAULT false,
  "target_audience" text[] COLLATE "pg_catalog"."default",
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for ai_conversations
-- ----------------------------
DROP TABLE IF EXISTS "public"."ai_conversations";
CREATE TABLE "public"."ai_conversations" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "title" text COLLATE "pg_catalog"."default" DEFAULT 'New Conversation'::text,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "context_type" text COLLATE "pg_catalog"."default" DEFAULT 'general'::text,
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for ai_messages
-- ----------------------------
DROP TABLE IF EXISTS "public"."ai_messages";
CREATE TABLE "public"."ai_messages" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "conversation_id" uuid,
  "user_id" uuid,
  "role" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamptz(6) DEFAULT now(),
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for assessment_categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."assessment_categories";
CREATE TABLE "public"."assessment_categories" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "weight" numeric DEFAULT 1.0,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for attachment_triggers
-- ----------------------------
DROP TABLE IF EXISTS "public"."attachment_triggers";
CREATE TABLE "public"."attachment_triggers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "trigger_date" timestamptz(6) DEFAULT now(),
  "trigger_description" text COLLATE "pg_catalog"."default" NOT NULL,
  "old_pattern" text COLLATE "pg_catalog"."default",
  "new_response" text COLLATE "pg_catalog"."default",
  "coping_strategy" text COLLATE "pg_catalog"."default",
  "effectiveness" int4,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for belief_affirmations
-- ----------------------------
DROP TABLE IF EXISTS "public"."belief_affirmations";
CREATE TABLE "public"."belief_affirmations" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "belief_id" uuid,
  "affirmation_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_ai_generated" bool DEFAULT false,
  "times_viewed" int4 DEFAULT 0,
  "user_rating" int4,
  "feels_believable" bool,
  "created_at" timestamptz(6) DEFAULT now(),
  "last_viewed_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for belief_strength_log
-- ----------------------------
DROP TABLE IF EXISTS "public"."belief_strength_log";
CREATE TABLE "public"."belief_strength_log" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "belief_id" uuid,
  "strength" int4 NOT NULL,
  "notes" text COLLATE "pg_catalog"."default",
  "logged_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for biff_templates
-- ----------------------------
DROP TABLE IF EXISTS "public"."biff_templates";
CREATE TABLE "public"."biff_templates" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "category" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "template_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "usage_count" int4 DEFAULT 0,
  "is_custom" bool DEFAULT false,
  "user_id" uuid,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for blog_categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."blog_categories";
CREATE TABLE "public"."blog_categories" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "color" text COLLATE "pg_catalog"."default" DEFAULT '#6366f1'::text,
  "sort_order" int4 DEFAULT 0,
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for blog_post_tags
-- ----------------------------
DROP TABLE IF EXISTS "public"."blog_post_tags";
CREATE TABLE "public"."blog_post_tags" (
  "post_id" uuid NOT NULL,
  "tag_id" uuid NOT NULL
)
;

-- ----------------------------
-- Table structure for blog_posts
-- ----------------------------
DROP TABLE IF EXISTS "public"."blog_posts";
CREATE TABLE "public"."blog_posts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "featured_image" text COLLATE "pg_catalog"."default",
  "category_id" uuid,
  "author_name" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Reclaim Team'::text,
  "author_bio" text COLLATE "pg_catalog"."default",
  "author_avatar" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'draft'::text,
  "is_featured" bool DEFAULT false,
  "meta_title" text COLLATE "pg_catalog"."default",
  "meta_description" text COLLATE "pg_catalog"."default",
  "meta_keywords" text COLLATE "pg_catalog"."default",
  "reading_time" int4,
  "view_count" int4 DEFAULT 0,
  "published_at" timestamptz(6),
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for blog_tags
-- ----------------------------
DROP TABLE IF EXISTS "public"."blog_tags";
CREATE TABLE "public"."blog_tags" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for boundaries
-- ----------------------------
DROP TABLE IF EXISTS "public"."boundaries";
CREATE TABLE "public"."boundaries" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "priority" text COLLATE "pg_catalog"."default" DEFAULT 'medium'::text,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'active'::text,
  "last_reviewed" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for boundary_analytics
-- ----------------------------
DROP TABLE IF EXISTS "public"."boundary_analytics";
CREATE TABLE "public"."boundary_analytics" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "boundary_id" uuid,
  "period_start" timestamptz(6) NOT NULL,
  "period_end" timestamptz(6) NOT NULL,
  "period_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "total_interactions" int4 DEFAULT 0,
  "violations_count" int4 DEFAULT 0,
  "successes_count" int4 DEFAULT 0,
  "reviews_count" int4 DEFAULT 0,
  "modifications_count" int4 DEFAULT 0,
  "success_rate" numeric(5,2),
  "average_emotional_impact" numeric(3,2),
  "trend_direction" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for boundary_interactions
-- ----------------------------
DROP TABLE IF EXISTS "public"."boundary_interactions";
CREATE TABLE "public"."boundary_interactions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "boundary_id" uuid,
  "user_id" uuid,
  "interaction_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "severity" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "context" text COLLATE "pg_catalog"."default",
  "emotional_impact" int4,
  "location" text COLLATE "pg_catalog"."default",
  "triggers" text[] COLLATE "pg_catalog"."default",
  "outcome" text COLLATE "pg_catalog"."default",
  "lessons_learned" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for boundary_reviews
-- ----------------------------
DROP TABLE IF EXISTS "public"."boundary_reviews";
CREATE TABLE "public"."boundary_reviews" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "boundary_id" uuid,
  "user_id" uuid,
  "review_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "review_status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text,
  "effectiveness_rating" int4,
  "needs_modification" bool DEFAULT false,
  "modification_notes" text COLLATE "pg_catalog"."default",
  "challenges_faced" text COLLATE "pg_catalog"."default",
  "support_needed" text COLLATE "pg_catalog"."default",
  "scheduled_date" timestamptz(6),
  "completed_date" timestamptz(6),
  "next_review_date" timestamptz(6),
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for code_redemptions
-- ----------------------------
DROP TABLE IF EXISTS "public"."code_redemptions";
CREATE TABLE "public"."code_redemptions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code_id" uuid,
  "user_id" uuid,
  "redeemed_at" timestamptz(6) DEFAULT now(),
  "trial_starts_at" timestamptz(6) DEFAULT now(),
  "trial_ends_at" timestamptz(6) NOT NULL,
  "original_tier" "public"."subscription_tier" NOT NULL,
  "upgraded_tier" "public"."subscription_tier" NOT NULL,
  "is_active" bool DEFAULT true,
  "ip_address" inet,
  "user_agent" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for cognitive_dissonance_alerts
-- ----------------------------
DROP TABLE IF EXISTS "public"."cognitive_dissonance_alerts";
CREATE TABLE "public"."cognitive_dissonance_alerts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "alert_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "severity" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'medium'::character varying,
  "source_1_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "source_1_id" uuid NOT NULL,
  "source_1_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "source_1_date" timestamp(6) NOT NULL,
  "source_2_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "source_2_id" uuid NOT NULL,
  "source_2_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "source_2_date" timestamp(6) NOT NULL,
  "conflict_summary" text COLLATE "pg_catalog"."default" NOT NULL,
  "ai_analysis" text COLLATE "pg_catalog"."default",
  "is_dismissed" bool DEFAULT false,
  "is_resolved" bool DEFAULT false,
  "user_notes" text COLLATE "pg_catalog"."default",
  "resolved_at" timestamp(6),
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for communication_insights
-- ----------------------------
DROP TABLE IF EXISTS "public"."communication_insights";
CREATE TABLE "public"."communication_insights" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "insight_date" date DEFAULT CURRENT_DATE,
  "total_messages" int4 DEFAULT 0,
  "biff_compliance_rate" numeric(5,2),
  "common_triggers" text[] COLLATE "pg_catalog"."default",
  "escalation_patterns" text COLLATE "pg_catalog"."default",
  "improvement_areas" text[] COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for community_comments
-- ----------------------------
DROP TABLE IF EXISTS "public"."community_comments";
CREATE TABLE "public"."community_comments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "post_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "parent_comment_id" uuid,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for community_likes
-- ----------------------------
DROP TABLE IF EXISTS "public"."community_likes";
CREATE TABLE "public"."community_likes" (
  "post_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "created_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for community_posts
-- ----------------------------
DROP TABLE IF EXISTS "public"."community_posts";
CREATE TABLE "public"."community_posts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "author_id" uuid NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_anonymous" bool NOT NULL DEFAULT false,
  "category" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for confabulation_patterns
-- ----------------------------
DROP TABLE IF EXISTS "public"."confabulation_patterns";
CREATE TABLE "public"."confabulation_patterns" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "analysis_date" date DEFAULT CURRENT_DATE,
  "total_statements" int4 DEFAULT 0,
  "total_contradictions" int4 DEFAULT 0,
  "contradiction_rate" numeric(5,2),
  "most_gaslit_topic" varchar(100) COLLATE "pg_catalog"."default",
  "topic_breakdown" jsonb,
  "avg_gaslighting_severity" numeric(3,1),
  "avg_impact" numeric(3,1),
  "ai_insights" text COLLATE "pg_catalog"."default",
  "escalation_warning" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for coparent_communications
-- ----------------------------
DROP TABLE IF EXISTS "public"."coparent_communications";
CREATE TABLE "public"."coparent_communications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "direction" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "message_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "response_text" text COLLATE "pg_catalog"."default",
  "category" varchar(50) COLLATE "pg_catalog"."default",
  "biff_score" int4,
  "jade_detected" bool DEFAULT false,
  "emotional_trigger_level" int4,
  "cooling_off_used" bool DEFAULT false,
  "sent_at" timestamptz(6),
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for coping_strategies
-- ----------------------------
DROP TABLE IF EXISTS "public"."coping_strategies";
CREATE TABLE "public"."coping_strategies" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "strategy_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "effectiveness_rating" int4,
  "category" text COLLATE "pg_catalog"."default",
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."coping_strategies" IS 'User-defined coping mechanisms and their effectiveness';

-- ----------------------------
-- Table structure for counter_evidence
-- ----------------------------
DROP TABLE IF EXISTS "public"."counter_evidence";
CREATE TABLE "public"."counter_evidence" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "belief_id" uuid,
  "user_id" uuid,
  "evidence_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "evidence_source" text COLLATE "pg_catalog"."default" DEFAULT 'manual'::text,
  "evidence_strength" int4 DEFAULT 3,
  "related_journal_entry_id" uuid,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for crisis_reframes
-- ----------------------------
DROP TABLE IF EXISTS "public"."crisis_reframes";
CREATE TABLE "public"."crisis_reframes" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "crisis_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "context_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "ai_reframe" jsonb NOT NULL,
  "revisited_count" int4 DEFAULT 0,
  "last_revisited_at" timestamp(6),
  "helpful_rating" int4,
  "notes" text COLLATE "pg_catalog"."default",
  "control_checklist" jsonb DEFAULT '{}'::jsonb,
  "survived_duration" int4 DEFAULT 0,
  "prevented_contact" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for data_exports
-- ----------------------------
DROP TABLE IF EXISTS "public"."data_exports";
CREATE TABLE "public"."data_exports" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "export_type" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'full'::character varying,
  "status" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'pending'::character varying,
  "file_path" text COLLATE "pg_catalog"."default",
  "expires_at" timestamptz(6) DEFAULT (now() + '7 days'::interval),
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."data_exports" IS 'Tracks user data export requests and file availability';

-- ----------------------------
-- Table structure for data_retention_requests
-- ----------------------------
DROP TABLE IF EXISTS "public"."data_retention_requests";
CREATE TABLE "public"."data_retention_requests" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "request_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'pending'::character varying,
  "requested_at" timestamptz(6) DEFAULT now(),
  "completed_at" timestamptz(6),
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."data_retention_requests" IS 'Tracks GDPR data retention and deletion requests';

-- ----------------------------
-- Table structure for decompression_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."decompression_sessions";
CREATE TABLE "public"."decompression_sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "interaction_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "mood_before" int4,
  "mood_after" int4,
  "ritual_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "duration_minutes" int4,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for detachment_milestones
-- ----------------------------
DROP TABLE IF EXISTS "public"."detachment_milestones";
CREATE TABLE "public"."detachment_milestones" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "milestone_date" date DEFAULT CURRENT_DATE,
  "milestone_type" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for empathy_audit
-- ----------------------------
DROP TABLE IF EXISTS "public"."empathy_audit";
CREATE TABLE "public"."empathy_audit" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "empathy_target" text COLLATE "pg_catalog"."default",
  "percentage" int4,
  "reflection" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for empathy_distribution
-- ----------------------------
DROP TABLE IF EXISTS "public"."empathy_distribution";
CREATE TABLE "public"."empathy_distribution" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "empathy_target" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "percentage" int4,
  "reflection" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for empathy_situations
-- ----------------------------
DROP TABLE IF EXISTS "public"."empathy_situations";
CREATE TABLE "public"."empathy_situations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "situation_type" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "situation_description" text COLLATE "pg_catalog"."default" NOT NULL,
  "asked_how_feeling" bool,
  "listened_without_interrupting" bool,
  "validated_emotions" bool,
  "offered_comfort" bool,
  "made_it_about_themselves" bool,
  "minimized_experience" bool,
  "blamed_for_feelings" bool,
  "got_angry" bool,
  "empathy_score" int4,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for escalation_patterns
-- ----------------------------
DROP TABLE IF EXISTS "public"."escalation_patterns";
CREATE TABLE "public"."escalation_patterns" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "pattern_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "trigger_events" text[] COLLATE "pg_catalog"."default" NOT NULL,
  "escalation_stages" jsonb NOT NULL,
  "typical_duration_hours" int4,
  "warning_signs" text[] COLLATE "pg_catalog"."default",
  "safety_recommendations" text[] COLLATE "pg_catalog"."default",
  "confidence_score" numeric(3,2),
  "last_detected" date,
  "detection_count" int4 DEFAULT 1,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for evidence_files
-- ----------------------------
DROP TABLE IF EXISTS "public"."evidence_files";
CREATE TABLE "public"."evidence_files" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "journal_entry_id" uuid,
  "user_id" uuid,
  "file_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "storage_bucket" text COLLATE "pg_catalog"."default" NOT NULL,
  "storage_path" text COLLATE "pg_catalog"."default" NOT NULL,
  "file_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "file_size" int8,
  "caption" text COLLATE "pg_catalog"."default",
  "transcription" text COLLATE "pg_catalog"."default",
  "transcription_status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text,
  "duration_seconds" int4,
  "uploaded_at" timestamptz(6) DEFAULT now(),
  "processed_at" timestamptz(6),
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "processing_status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text
)
;

-- ----------------------------
-- Table structure for export_requests
-- ----------------------------
DROP TABLE IF EXISTS "public"."export_requests";
CREATE TABLE "public"."export_requests" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "export_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "date_range_start" timestamptz(6),
  "date_range_end" timestamptz(6),
  "include_evidence" bool DEFAULT true,
  "include_patterns" bool DEFAULT true,
  "export_format" text COLLATE "pg_catalog"."default" DEFAULT 'pdf'::text,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text,
  "file_path" text COLLATE "pg_catalog"."default",
  "file_size" int8,
  "download_count" int4 DEFAULT 0,
  "processing_started_at" timestamptz(6),
  "completed_at" timestamptz(6),
  "error_message" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "expires_at" timestamptz(6) DEFAULT (now() + '7 days'::interval)
)
;
COMMENT ON TABLE "public"."export_requests" IS 'Tracks user requests for data exports and report generation';

-- ----------------------------
-- Table structure for false_beliefs
-- ----------------------------
DROP TABLE IF EXISTS "public"."false_beliefs";
CREATE TABLE "public"."false_beliefs" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "belief_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "belief_category" text COLLATE "pg_catalog"."default",
  "is_preset" bool DEFAULT false,
  "current_strength" int4 NOT NULL,
  "initial_strength" int4 NOT NULL,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'active'::text,
  "origin_journal_entry_id" uuid,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "resolved_at" timestamptz(6),
  "origin_memory_text" text COLLATE "pg_catalog"."default",
  "origin_memory_audio_url" text COLLATE "pg_catalog"."default",
  "origin_memory_image_url" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for feature_limits
-- ----------------------------
DROP TABLE IF EXISTS "public"."feature_limits";
CREATE TABLE "public"."feature_limits" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "subscription_tier" "public"."subscription_tier" NOT NULL,
  "feature_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "limit_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "limit_value" int4 NOT NULL,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."feature_limits" IS 'Defines usage limits for different subscription tiers';

-- ----------------------------
-- Table structure for gaslighting_statements
-- ----------------------------
DROP TABLE IF EXISTS "public"."gaslighting_statements";
CREATE TABLE "public"."gaslighting_statements" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "statement_date" timestamptz(6) NOT NULL,
  "their_claim" text COLLATE "pg_catalog"."default" NOT NULL,
  "topic" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "context" text COLLATE "pg_catalog"."default",
  "actual_truth" text COLLATE "pg_catalog"."default" NOT NULL,
  "your_memory" text COLLATE "pg_catalog"."default",
  "has_evidence" bool DEFAULT false,
  "evidence_type" varchar(50) COLLATE "pg_catalog"."default",
  "evidence_notes" text COLLATE "pg_catalog"."default",
  "gaslighting_severity" int4,
  "impact_on_you" int4,
  "is_contradiction" bool DEFAULT false,
  "contradicts_statement_id" uuid,
  "created_at" timestamptz(6) DEFAULT now(),
  "audio_url" text COLLATE "pg_catalog"."default",
  "video_url" text COLLATE "pg_catalog"."default",
  "image_urls" text[] COLLATE "pg_catalog"."default",
  "evidence_text" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for gdpr_consents
-- ----------------------------
DROP TABLE IF EXISTS "public"."gdpr_consents";
CREATE TABLE "public"."gdpr_consents" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "consent_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "consented" bool NOT NULL DEFAULT false,
  "consent_date" timestamptz(6) DEFAULT now(),
  "ip_address" inet,
  "user_agent" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."gdpr_consents" IS 'Tracks user consent for various data processing activities';

-- ----------------------------
-- Table structure for gr_user_achievements
-- ----------------------------
DROP TABLE IF EXISTS "public"."gr_user_achievements";
CREATE TABLE "public"."gr_user_achievements" (
  "user_id" uuid NOT NULL,
  "key" text COLLATE "pg_catalog"."default" NOT NULL,
  "achieved_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for gr_user_pack_stats
-- ----------------------------
DROP TABLE IF EXISTS "public"."gr_user_pack_stats";
CREATE TABLE "public"."gr_user_pack_stats" (
  "user_id" uuid NOT NULL,
  "pack" text COLLATE "pg_catalog"."default" NOT NULL,
  "attempts" int4 NOT NULL DEFAULT 0,
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for gr_user_streaks
-- ----------------------------
DROP TABLE IF EXISTS "public"."gr_user_streaks";
CREATE TABLE "public"."gr_user_streaks" (
  "user_id" uuid NOT NULL,
  "current_streak" int4 NOT NULL DEFAULT 0,
  "best_streak" int4 NOT NULL DEFAULT 0,
  "last_practiced_date" date,
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for gratitude_streaks
-- ----------------------------
DROP TABLE IF EXISTS "public"."gratitude_streaks";
CREATE TABLE "public"."gratitude_streaks" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "current_streak" int4 DEFAULT 0,
  "longest_streak" int4 DEFAULT 0,
  "last_entry_date" date,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for grey_rock_attempts
-- ----------------------------
DROP TABLE IF EXISTS "public"."grey_rock_attempts";
CREATE TABLE "public"."grey_rock_attempts" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "session_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "scenario_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "difficulty" text COLLATE "pg_catalog"."default",
  "selected_response" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_correct" bool NOT NULL,
  "latency_ms" int4,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "metadata" jsonb DEFAULT '{}'::jsonb
)
;

-- ----------------------------
-- Table structure for grey_rock_scenarios
-- ----------------------------
DROP TABLE IF EXISTS "public"."grey_rock_scenarios";
CREATE TABLE "public"."grey_rock_scenarios" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "trigger" text COLLATE "pg_catalog"."default" NOT NULL,
  "good_response" text COLLATE "pg_catalog"."default" NOT NULL,
  "bad_response" text COLLATE "pg_catalog"."default" NOT NULL,
  "explanation" text COLLATE "pg_catalog"."default" NOT NULL,
  "difficulty" text COLLATE "pg_catalog"."default" NOT NULL,
  "pack" text COLLATE "pg_catalog"."default" NOT NULL,
  "min_tier" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_active" bool NOT NULL DEFAULT true,
  "created_at" timestamptz(6) NOT NULL DEFAULT now(),
  "updated_at" timestamptz(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Table structure for grey_rock_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."grey_rock_sessions";
CREATE TABLE "public"."grey_rock_sessions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "mode" text COLLATE "pg_catalog"."default" NOT NULL,
  "started_at" timestamptz(6) NOT NULL DEFAULT now(),
  "ended_at" timestamptz(6),
  "duration_ms" int8,
  "total_attempts" int4 DEFAULT 0,
  "correct_count" int4 DEFAULT 0,
  "difficulty_breakdown" jsonb DEFAULT '{}'::jsonb,
  "metadata" jsonb DEFAULT '{}'::jsonb
)
;

-- ----------------------------
-- Table structure for grey_rock_templates
-- ----------------------------
DROP TABLE IF EXISTS "public"."grey_rock_templates";
CREATE TABLE "public"."grey_rock_templates" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "category" text COLLATE "pg_catalog"."default" NOT NULL,
  "situation" text COLLATE "pg_catalog"."default" NOT NULL,
  "template_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "variations" text[] COLLATE "pg_catalog"."default",
  "when_to_use" text COLLATE "pg_catalog"."default",
  "tone" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for habit_completions
-- ----------------------------
DROP TABLE IF EXISTS "public"."habit_completions";
CREATE TABLE "public"."habit_completions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "habit_id" uuid NOT NULL,
  "completion_date" date NOT NULL,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for healing_resources
-- ----------------------------
DROP TABLE IF EXISTS "public"."healing_resources";
CREATE TABLE "public"."healing_resources" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "resource_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_favorite" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."healing_resources" IS 'Personalized collection of healing resources and affirmations';

-- ----------------------------
-- Table structure for journal_entries
-- ----------------------------
DROP TABLE IF EXISTS "public"."journal_entries";
CREATE TABLE "public"."journal_entries" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "incident_date" timestamptz(6) NOT NULL,
  "safety_rating" "public"."safety_rating" NOT NULL,
  "abuse_types" "public"."abuse_type"[] DEFAULT '{}'::abuse_type[],
  "location" text COLLATE "pg_catalog"."default",
  "witnesses" text[] COLLATE "pg_catalog"."default",
  "emotional_state_before" text COLLATE "pg_catalog"."default",
  "emotional_state_after" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "content" text COLLATE "pg_catalog"."default",
  "incident_time" time(6),
  "mood_rating" int4,
  "behavior_categories" text[] COLLATE "pg_catalog"."default",
  "pattern_flags" text[] COLLATE "pg_catalog"."default",
  "emotional_impact" text[] COLLATE "pg_catalog"."default",
  "evidence_type" text[] COLLATE "pg_catalog"."default",
  "evidence_notes" text COLLATE "pg_catalog"."default",
  "is_evidence" bool DEFAULT false,
  "is_draft" bool DEFAULT false,
  "ai_analysis" jsonb DEFAULT '{}'::jsonb,
  "content_warnings" text[] COLLATE "pg_catalog"."default",
  "trigger_level" int4,
  "npd_traits_identified" uuid[] DEFAULT '{}'::uuid[],
  "reality_check_notes" text COLLATE "pg_catalog"."default",
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for legal_referral_analytics
-- ----------------------------
DROP TABLE IF EXISTS "public"."legal_referral_analytics";
CREATE TABLE "public"."legal_referral_analytics" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "date" date NOT NULL DEFAULT CURRENT_DATE,
  "referral_source" text COLLATE "pg_catalog"."default" NOT NULL,
  "platform" text COLLATE "pg_catalog"."default" NOT NULL,
  "legal_specialty" text COLLATE "pg_catalog"."default" NOT NULL,
  "clicks" int4 DEFAULT 0,
  "conversions" int4 DEFAULT 0,
  "revenue" numeric(10,2) DEFAULT 0,
  "conversion_rate" numeric(5,4) GENERATED ALWAYS AS (

CASE
    WHEN (clicks > 0) THEN ((conversions)::numeric / (clicks)::numeric)
    ELSE (0)::numeric
END
) STORED,
  "revenue_per_click" numeric(10,2) GENERATED ALWAYS AS (

CASE
    WHEN (clicks > 0) THEN (revenue / (clicks)::numeric)
    ELSE (0)::numeric
END
) STORED,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for legal_referral_platforms
-- ----------------------------
DROP TABLE IF EXISTS "public"."legal_referral_platforms";
CREATE TABLE "public"."legal_referral_platforms" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "platform_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "base_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "commission_rate" numeric(5,2) NOT NULL,
  "specialties" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY['family_law'::text, 'divorce'::text, 'custody'::text],
  "active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for letting_go_affirmations
-- ----------------------------
DROP TABLE IF EXISTS "public"."letting_go_affirmations";
CREATE TABLE "public"."letting_go_affirmations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "affirmation_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" varchar(50) COLLATE "pg_catalog"."default",
  "is_default" bool DEFAULT true
)
;

-- ----------------------------
-- Table structure for letting_go_entries
-- ----------------------------
DROP TABLE IF EXISTS "public"."letting_go_entries";
CREATE TABLE "public"."letting_go_entries" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "entry_date" date DEFAULT CURRENT_DATE,
  "emotional_reactivity" int4,
  "mental_space" int4,
  "hope_for_change" int4,
  "need_for_validation" int4,
  "boundary_strength" int4,
  "what_letting_go" text COLLATE "pg_catalog"."default",
  "what_gaining" text COLLATE "pg_catalog"."default",
  "grief_acknowledgment" text COLLATE "pg_catalog"."default",
  "acceptance_practice" text COLLATE "pg_catalog"."default",
  "affirmation" text COLLATE "pg_catalog"."default",
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for manipulation_analysis
-- ----------------------------
DROP TABLE IF EXISTS "public"."manipulation_analysis";
CREATE TABLE "public"."manipulation_analysis" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "message_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "identified_tactics" uuid[] DEFAULT '{}'::uuid[],
  "emotional_impact" text COLLATE "pg_catalog"."default",
  "is_my_fault" bool DEFAULT false,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for mental_pause_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."mental_pause_sessions";
CREATE TABLE "public"."mental_pause_sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "interaction_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "mood_before" int4,
  "breathing_completed" bool DEFAULT false,
  "visualization_completed" bool DEFAULT false,
  "mantra_used" text COLLATE "pg_catalog"."default",
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for mind_reset_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."mind_reset_sessions";
CREATE TABLE "public"."mind_reset_sessions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "session_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "original_thought" text COLLATE "pg_catalog"."default",
  "reframed_thought" text COLLATE "pg_catalog"."default",
  "techniques_used" text[] COLLATE "pg_catalog"."default",
  "duration_minutes" int4,
  "mood_before" int4,
  "mood_after" int4,
  "effectiveness_rating" int4,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "deleted_at" timestamptz(6)
)
;
COMMENT ON TABLE "public"."mind_reset_sessions" IS 'Tracks mind reset tool usage and effectiveness';

-- ----------------------------
-- Table structure for mood_check_ins
-- ----------------------------
DROP TABLE IF EXISTS "public"."mood_check_ins";
CREATE TABLE "public"."mood_check_ins" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "mood_rating" int4,
  "energy_level" int4,
  "anxiety_level" int4,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."mood_check_ins" IS 'Daily mood and emotional state tracking for recovery progress';

-- ----------------------------
-- Table structure for morning_intentions
-- ----------------------------
DROP TABLE IF EXISTS "public"."morning_intentions";
CREATE TABLE "public"."morning_intentions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "date" date NOT NULL,
  "affirmation_id" uuid,
  "completed" bool DEFAULT false,
  "completed_at" timestamp(6),
  "created_at" timestamp(6) DEFAULT now(),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for narcissist_analyses
-- ----------------------------
DROP TABLE IF EXISTS "public"."narcissist_analyses";
CREATE TABLE "public"."narcissist_analyses" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "input_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "input_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'message'::character varying,
  "primary_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'Unknown'::character varying,
  "primary_confidence" numeric(5,2) NOT NULL DEFAULT 0,
  "traits_detected" jsonb DEFAULT '{}'::jsonb,
  "manipulation_tactics" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY[]::text[],
  "severity_score" int4 DEFAULT 5,
  "key_phrases" jsonb DEFAULT '[]'::jsonb,
  "recommended_strategies" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY[]::text[],
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for narcissist_simulator_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."narcissist_simulator_sessions";
CREATE TABLE "public"."narcissist_simulator_sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "narcissist_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "scenario" text COLLATE "pg_catalog"."default" NOT NULL,
  "conversation_history" jsonb DEFAULT '[]'::jsonb,
  "total_messages" int4 DEFAULT 0,
  "techniques_used" jsonb DEFAULT '{}'::jsonb,
  "effectiveness_scores" jsonb DEFAULT '[]'::jsonb,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'active'::text,
  "started_at" timestamptz(6) DEFAULT now(),
  "completed_at" timestamptz(6),
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for no_contact_milestones
-- ----------------------------
DROP TABLE IF EXISTS "public"."no_contact_milestones";
CREATE TABLE "public"."no_contact_milestones" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "milestone_days" int4 NOT NULL,
  "achieved_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for no_contact_settings
-- ----------------------------
DROP TABLE IF EXISTS "public"."no_contact_settings";
CREATE TABLE "public"."no_contact_settings" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "no_contact_start_date" date NOT NULL,
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for npd_traits
-- ----------------------------
DROP TABLE IF EXISTS "public"."npd_traits";
CREATE TABLE "public"."npd_traits" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "examples" text[] COLLATE "pg_catalog"."default",
  "response_strategies" text[] COLLATE "pg_catalog"."default",
  "severity" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for origin_memories
-- ----------------------------
DROP TABLE IF EXISTS "public"."origin_memories";
CREATE TABLE "public"."origin_memories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "belief_id" uuid,
  "user_id" uuid,
  "memory_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "memory_date" date,
  "memory_audio_url" text COLLATE "pg_catalog"."default",
  "memory_image_url" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for pattern_alerts
-- ----------------------------
DROP TABLE IF EXISTS "public"."pattern_alerts";
CREATE TABLE "public"."pattern_alerts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "alert_type" text COLLATE "pg_catalog"."default",
  "trait_id" uuid,
  "frequency_count" int4,
  "time_period_days" int4,
  "alert_message" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_acknowledged" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for pattern_analysis
-- ----------------------------
DROP TABLE IF EXISTS "public"."pattern_analysis";
CREATE TABLE "public"."pattern_analysis" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "analysis_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "analysis_period_start" timestamptz(6) NOT NULL,
  "analysis_period_end" timestamptz(6) NOT NULL,
  "patterns_identified" jsonb DEFAULT '[]'::jsonb,
  "insights" jsonb DEFAULT '{}'::jsonb,
  "recommendations" jsonb DEFAULT '[]'::jsonb,
  "risk_assessment" jsonb DEFAULT '{}'::jsonb,
  "confidence_score" numeric(3,2),
  "data_points_analyzed" int4,
  "ai_model_version" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."pattern_analysis" IS 'Stores AI-generated pattern analysis results for user journal entries';

-- ----------------------------
-- Table structure for pattern_detections
-- ----------------------------
DROP TABLE IF EXISTS "public"."pattern_detections";
CREATE TABLE "public"."pattern_detections" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "detection_type" text COLLATE "pg_catalog"."default",
  "pattern_data" jsonb NOT NULL,
  "confidence_score" numeric(3,2),
  "risk_level" text COLLATE "pg_catalog"."default",
  "recommendations" text[] COLLATE "pg_catalog"."default",
  "is_acknowledged" bool DEFAULT false,
  "expires_at" timestamp(6),
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS "public"."payments";
CREATE TABLE "public"."payments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "stripe_payment_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "stripe_customer_id" text COLLATE "pg_catalog"."default",
  "amount" numeric(10,2) NOT NULL,
  "currency" text COLLATE "pg_catalog"."default" DEFAULT 'usd'::text,
  "status" text COLLATE "pg_catalog"."default" NOT NULL,
  "subscription_tier" text COLLATE "pg_catalog"."default" NOT NULL,
  "payment_method" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for positive_moments
-- ----------------------------
DROP TABLE IF EXISTS "public"."positive_moments";
CREATE TABLE "public"."positive_moments" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "moment_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "moment_date" date DEFAULT CURRENT_DATE,
  "tags" text[] COLLATE "pg_catalog"."default",
  "mood_rating" int4,
  "created_at" timestamptz(6) DEFAULT now(),
  "entry_type" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'moment'::character varying,
  "gratitude_category" varchar(50) COLLATE "pg_catalog"."default",
  "is_daily_gratitude" bool DEFAULT false
)
;

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."profiles";
CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "display_name" text COLLATE "pg_catalog"."default",
  "subscription_tier" "public"."subscription_tier" DEFAULT 'foundation'::subscription_tier,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "is_active" bool DEFAULT true,
  "timezone" text COLLATE "pg_catalog"."default" DEFAULT 'UTC'::text,
  "first_name" text COLLATE "pg_catalog"."default",
  "last_name" text COLLATE "pg_catalog"."default",
  "phone" text COLLATE "pg_catalog"."default",
  "location" text COLLATE "pg_catalog"."default",
  "date_of_birth" date,
  "privacy_settings" jsonb DEFAULT '{"analytics": true, "data_sharing": false, "marketing_emails": false, "push_notifications": true}'::jsonb,
  "security_settings" jsonb DEFAULT '{"login_alerts": true, "data_encryption": true, "two_factor_enabled": false}'::jsonb,
  "ui_preferences" jsonb DEFAULT '{}'::jsonb,
  "abuser_gender" varchar(20) COLLATE "pg_catalog"."default",
  "has_children" bool DEFAULT false,
  "children_ages" int4[],
  "custody_arrangement" text COLLATE "pg_catalog"."default",
  "preferred_language" varchar(10) COLLATE "pg_catalog"."default" DEFAULT 'auto'::character varying,
  "deleted_at" timestamptz(6)
)
;
COMMENT ON COLUMN "public"."profiles"."preferred_language" IS 'User preferred language for AI responses (auto, en, ur, ar, es, fr, etc.)';

-- ----------------------------
-- Table structure for reactive_abuse_incidents
-- ----------------------------
DROP TABLE IF EXISTS "public"."reactive_abuse_incidents";
CREATE TABLE "public"."reactive_abuse_incidents" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "incident_date" timestamptz(6) DEFAULT now(),
  "what_you_addressed" text COLLATE "pg_catalog"."default" NOT NULL,
  "your_approach" varchar(50) COLLATE "pg_catalog"."default",
  "reaction_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "what_they_said" text COLLATE "pg_catalog"."default",
  "what_they_accused_you_of" text COLLATE "pg_catalog"."default",
  "made_you_feel" varchar(100) COLLATE "pg_catalog"."default",
  "did_you_apologize" bool DEFAULT false,
  "original_issue_resolved" bool DEFAULT false,
  "is_recurring_pattern" bool DEFAULT false,
  "similar_topic_before" bool DEFAULT false,
  "how_you_responded" text COLLATE "pg_catalog"."default",
  "maintained_boundary" bool,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for reactive_abuse_patterns
-- ----------------------------
DROP TABLE IF EXISTS "public"."reactive_abuse_patterns";
CREATE TABLE "public"."reactive_abuse_patterns" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "pattern_date" date DEFAULT CURRENT_DATE,
  "total_incidents" int4 DEFAULT 0,
  "most_common_reaction" varchar(50) COLLATE "pg_catalog"."default",
  "topics_you_cant_discuss" text[] COLLATE "pg_catalog"."default",
  "apology_rate" numeric(5,2),
  "boundary_maintenance_rate" numeric(5,2),
  "insights" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for reality_log_entries
-- ----------------------------
DROP TABLE IF EXISTS "public"."reality_log_entries";
CREATE TABLE "public"."reality_log_entries" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "date" date NOT NULL,
  "event" text COLLATE "pg_catalog"."default" NOT NULL,
  "fact" text COLLATE "pg_catalog"."default" NOT NULL,
  "npd_trait" varchar(100) COLLATE "pg_catalog"."default",
  "is_consistent" bool,
  "pattern_note" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now(),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for reality_testing_sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."reality_testing_sessions";
CREATE TABLE "public"."reality_testing_sessions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "belief_id" uuid,
  "user_id" uuid,
  "evidence_for" text COLLATE "pg_catalog"."default",
  "evidence_against" text COLLATE "pg_catalog"."default",
  "alternative_explanation" text COLLATE "pg_catalog"."default",
  "source_analysis" text COLLATE "pg_catalog"."default",
  "strength_before" int4,
  "strength_after" int4,
  "insights" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for recovery_lessons
-- ----------------------------
DROP TABLE IF EXISTS "public"."recovery_lessons";
CREATE TABLE "public"."recovery_lessons" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "lesson_order" int4 NOT NULL,
  "category" text COLLATE "pg_catalog"."default" NOT NULL,
  "estimated_duration" int4,
  "is_premium" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for redeem_codes
-- ----------------------------
DROP TABLE IF EXISTS "public"."redeem_codes";
CREATE TABLE "public"."redeem_codes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "code_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "target_tier" "public"."subscription_tier" NOT NULL,
  "trial_duration_days" int4 NOT NULL DEFAULT 7,
  "max_uses" int4 DEFAULT 1,
  "current_uses" int4 DEFAULT 0,
  "is_active" bool DEFAULT true,
  "campaign_name" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "created_by" uuid,
  "expires_at" timestamptz(6),
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for referral_analytics
-- ----------------------------
DROP TABLE IF EXISTS "public"."referral_analytics";
CREATE TABLE "public"."referral_analytics" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "date" date NOT NULL DEFAULT CURRENT_DATE,
  "referral_source" text COLLATE "pg_catalog"."default" NOT NULL,
  "platform" text COLLATE "pg_catalog"."default" NOT NULL,
  "clicks" int4 DEFAULT 0,
  "conversions" int4 DEFAULT 0,
  "revenue" numeric(10,2) DEFAULT 0,
  "conversion_rate" numeric(5,4) GENERATED ALWAYS AS (

CASE
    WHEN (clicks > 0) THEN ((conversions)::numeric / (clicks)::numeric)
    ELSE (0)::numeric
END
) STORED,
  "revenue_per_click" numeric(10,2) GENERATED ALWAYS AS (

CASE
    WHEN (clicks > 0) THEN (revenue / (clicks)::numeric)
    ELSE (0)::numeric
END
) STORED,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for relationship_assessments
-- ----------------------------
DROP TABLE IF EXISTS "public"."relationship_assessments";
CREATE TABLE "public"."relationship_assessments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "overall_score" int4 NOT NULL,
  "category_scores" jsonb NOT NULL,
  "risk_level" text COLLATE "pg_catalog"."default" NOT NULL,
  "answers" jsonb NOT NULL,
  "recommendations" jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for role_boundaries
-- ----------------------------
DROP TABLE IF EXISTS "public"."role_boundaries";
CREATE TABLE "public"."role_boundaries" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "responsibility_area" text COLLATE "pg_catalog"."default" NOT NULL,
  "my_responsibility" bool NOT NULL,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for routine_streaks
-- ----------------------------
DROP TABLE IF EXISTS "public"."routine_streaks";
CREATE TABLE "public"."routine_streaks" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "routine_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "current_streak" int4 DEFAULT 0,
  "longest_streak" int4 DEFAULT 0,
  "last_completed_date" date,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for safety_plans
-- ----------------------------
DROP TABLE IF EXISTS "public"."safety_plans";
CREATE TABLE "public"."safety_plans" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "emergency_contacts" jsonb DEFAULT '[]'::jsonb,
  "safe_locations" jsonb DEFAULT '[]'::jsonb,
  "warning_signs" text[] COLLATE "pg_catalog"."default",
  "coping_strategies" text[] COLLATE "pg_catalog"."default",
  "professional_resources" jsonb DEFAULT '[]'::jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now(),
  "important_documents" text[] COLLATE "pg_catalog"."default",
  "financial_resources" jsonb DEFAULT '{}'::jsonb,
  "escape_plan" jsonb DEFAULT '{}'::jsonb,
  "professional_support" jsonb DEFAULT '{}'::jsonb,
  "last_reviewed" timestamptz(6) DEFAULT now(),
  "review_frequency_days" int4 DEFAULT 30,
  "protected_info_password_hash" text COLLATE "pg_catalog"."default",
  "protected_information" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for security_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."security_logs";
CREATE TABLE "public"."security_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "event_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "event_data" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for social_media_links
-- ----------------------------
DROP TABLE IF EXISTS "public"."social_media_links";
CREATE TABLE "public"."social_media_links" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "platform" text COLLATE "pg_catalog"."default" NOT NULL,
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "icon" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_active" bool DEFAULT true,
  "sort_order" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for statement_contradictions
-- ----------------------------
DROP TABLE IF EXISTS "public"."statement_contradictions";
CREATE TABLE "public"."statement_contradictions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "statement_1_id" uuid NOT NULL,
  "statement_2_id" uuid NOT NULL,
  "contradiction_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "ai_confidence_score" numeric(3,2),
  "explanation" text COLLATE "pg_catalog"."default",
  "time_between_statements" int4,
  "detected_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for stonewalling_incidents
-- ----------------------------
DROP TABLE IF EXISTS "public"."stonewalling_incidents";
CREATE TABLE "public"."stonewalling_incidents" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "incident_date" timestamptz(6) DEFAULT now(),
  "shutdown_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "duration_minutes" int4,
  "trigger_context" text COLLATE "pg_catalog"."default" NOT NULL,
  "location" varchar(100) COLLATE "pg_catalog"."default",
  "emotional_state_before" int4,
  "emotional_state_after" int4,
  "impact_level" int4,
  "what_you_needed" text COLLATE "pg_catalog"."default",
  "what_actually_happened" text COLLATE "pg_catalog"."default",
  "your_response" varchar(100) COLLATE "pg_catalog"."default",
  "attempted_reconnection" bool DEFAULT false,
  "reconnection_successful" bool,
  "is_recurring_pattern" bool DEFAULT false,
  "similar_past_incidents" int4 DEFAULT 0,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for stonewalling_patterns
-- ----------------------------
DROP TABLE IF EXISTS "public"."stonewalling_patterns";
CREATE TABLE "public"."stonewalling_patterns" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "pattern_date" date DEFAULT CURRENT_DATE,
  "total_incidents" int4 DEFAULT 0,
  "avg_duration_minutes" int4,
  "most_common_trigger" text COLLATE "pg_catalog"."default",
  "most_common_shutdown_type" varchar(50) COLLATE "pg_catalog"."default",
  "avg_emotional_impact" numeric(3,1),
  "escalation_trend" varchar(20) COLLATE "pg_catalog"."default",
  "most_effective_response" varchar(100) COLLATE "pg_catalog"."default",
  "reconnection_success_rate" numeric(5,2),
  "insights" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for stonewalling_responses
-- ----------------------------
DROP TABLE IF EXISTS "public"."stonewalling_responses";
CREATE TABLE "public"."stonewalling_responses" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "incident_id" uuid,
  "response_type" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "what_you_tried" text COLLATE "pg_catalog"."default" NOT NULL,
  "outcome" varchar(20) COLLATE "pg_catalog"."default",
  "self_care_actions" text[] COLLATE "pg_catalog"."default",
  "would_try_again" bool,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for subscription_plans
-- ----------------------------
DROP TABLE IF EXISTS "public"."subscription_plans";
CREATE TABLE "public"."subscription_plans" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "plan_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "plan_tier" "public"."subscription_tier" NOT NULL,
  "display_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "price_monthly" numeric(10,2) NOT NULL,
  "price_yearly" numeric(10,2),
  "is_active" bool DEFAULT true,
  "sort_order" int4 NOT NULL,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for therapy_referrals
-- ----------------------------
DROP TABLE IF EXISTS "public"."therapy_referrals";
CREATE TABLE "public"."therapy_referrals" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "platform" text COLLATE "pg_catalog"."default" NOT NULL,
  "referral_source" text COLLATE "pg_catalog"."default" NOT NULL,
  "referral_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "clicked_at" timestamptz(6) DEFAULT now(),
  "converted" bool DEFAULT false,
  "conversion_date" timestamptz(6),
  "commission_amount" numeric(10,2),
  "commission_status" text COLLATE "pg_catalog"."default" DEFAULT 'pending'::text,
  "user_agent" text COLLATE "pg_catalog"."default",
  "ip_address" inet,
  "created_at" timestamptz(6) DEFAULT now(),
  "referral_type" text COLLATE "pg_catalog"."default" DEFAULT 'therapy'::text
)
;

-- ----------------------------
-- Table structure for toxic_memories
-- ----------------------------
DROP TABLE IF EXISTS "public"."toxic_memories";
CREATE TABLE "public"."toxic_memories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "memory_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "memory_date" date DEFAULT CURRENT_DATE,
  "tags" text[] COLLATE "pg_catalog"."default" DEFAULT '{}'::text[],
  "audio_url" text COLLATE "pg_catalog"."default",
  "video_url" text COLLATE "pg_catalog"."default",
  "image_urls" text[] COLLATE "pg_catalog"."default" DEFAULT '{}'::text[],
  "ai_analysis" jsonb,
  "linked_belief_ids" uuid[] DEFAULT '{}'::uuid[],
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for trait_combinations
-- ----------------------------
DROP TABLE IF EXISTS "public"."trait_combinations";
CREATE TABLE "public"."trait_combinations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "primary_trait_id" uuid NOT NULL,
  "secondary_trait_ids" uuid[] NOT NULL,
  "occurrence_date" date NOT NULL,
  "combination_frequency" int4 DEFAULT 1,
  "journal_entry_id" uuid,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for trait_frequency_tracking
-- ----------------------------
DROP TABLE IF EXISTS "public"."trait_frequency_tracking";
CREATE TABLE "public"."trait_frequency_tracking" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "trait_id" uuid NOT NULL,
  "occurrence_date" date NOT NULL,
  "intensity_level" int4,
  "context" text COLLATE "pg_catalog"."default",
  "journal_entry_id" uuid,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for trigger_calendar
-- ----------------------------
DROP TABLE IF EXISTS "public"."trigger_calendar";
CREATE TABLE "public"."trigger_calendar" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "trigger_type" text COLLATE "pg_catalog"."default",
  "trigger_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "risk_level" text COLLATE "pg_catalog"."default",
  "date_pattern" text COLLATE "pg_catalog"."default",
  "time_pattern" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "coping_strategies" text[] COLLATE "pg_catalog"."default",
  "safety_reminders" text[] COLLATE "pg_catalog"."default",
  "is_active" bool DEFAULT true,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for truth_timeline
-- ----------------------------
DROP TABLE IF EXISTS "public"."truth_timeline";
CREATE TABLE "public"."truth_timeline" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "event_date" timestamptz(6) NOT NULL,
  "event_title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "what_actually_happened" text COLLATE "pg_catalog"."default" NOT NULL,
  "their_version_1" text COLLATE "pg_catalog"."default",
  "their_version_1_date" timestamptz(6),
  "their_version_2" text COLLATE "pg_catalog"."default",
  "their_version_2_date" timestamptz(6),
  "their_version_3" text COLLATE "pg_catalog"."default",
  "their_version_3_date" timestamptz(6),
  "evidence_links" text[] COLLATE "pg_catalog"."default",
  "witness_accounts" text[] COLLATE "pg_catalog"."default",
  "total_revisions" int4 DEFAULT 0,
  "confabulation_score" int4,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for usage_tracking
-- ----------------------------
DROP TABLE IF EXISTS "public"."usage_tracking";
CREATE TABLE "public"."usage_tracking" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "feature_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "usage_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "usage_count" int4 DEFAULT 1,
  "usage_metadata" jsonb DEFAULT '{}'::jsonb,
  "billing_period_start" date NOT NULL,
  "billing_period_end" date NOT NULL,
  "created_at" timestamptz(6) DEFAULT now()
)
;
COMMENT ON TABLE "public"."usage_tracking" IS 'Monitors feature usage for subscription tier enforcement';

-- ----------------------------
-- Table structure for user_feedback
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_feedback";
CREATE TABLE "public"."user_feedback" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "feature" text COLLATE "pg_catalog"."default" NOT NULL,
  "rating" int4,
  "feedback" text COLLATE "pg_catalog"."default" NOT NULL,
  "suggestion" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_insights
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_insights";
CREATE TABLE "public"."user_insights" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "insight_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "priority" text COLLATE "pg_catalog"."default" DEFAULT 'medium'::text,
  "related_entries" uuid[],
  "related_patterns" uuid[],
  "action_items" jsonb DEFAULT '[]'::jsonb,
  "is_read" bool DEFAULT false,
  "is_dismissed" bool DEFAULT false,
  "user_feedback" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT now(),
  "expires_at" timestamptz(6)
)
;
COMMENT ON TABLE "public"."user_insights" IS 'Personalized insights and recommendations generated for users';

-- ----------------------------
-- Table structure for user_legal_needs
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_legal_needs";
CREATE TABLE "public"."user_legal_needs" (
  "user_id" uuid NOT NULL,
  "legal_situation" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY[]::text[],
  "urgency_level" text COLLATE "pg_catalog"."default" DEFAULT 'medium'::text,
  "has_children" bool DEFAULT false,
  "married_status" text COLLATE "pg_catalog"."default" DEFAULT 'married'::text,
  "location_state" text COLLATE "pg_catalog"."default",
  "budget_range" text COLLATE "pg_catalog"."default",
  "evidence_collected" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_lesson_progress
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_lesson_progress";
CREATE TABLE "public"."user_lesson_progress" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "lesson_id" uuid,
  "completed_at" timestamptz(6),
  "progress_percentage" int4 DEFAULT 0,
  "notes" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for user_letting_go_affirmations
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_letting_go_affirmations";
CREATE TABLE "public"."user_letting_go_affirmations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "affirmation_text" text COLLATE "pg_catalog"."default" NOT NULL,
  "times_used" int4 DEFAULT 0,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_template_usage
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_template_usage";
CREATE TABLE "public"."user_template_usage" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "template_id" uuid,
  "custom_text" text COLLATE "pg_catalog"."default",
  "context" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_therapy_preferences
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_therapy_preferences";
CREATE TABLE "public"."user_therapy_preferences" (
  "user_id" uuid NOT NULL,
  "preferred_language" text COLLATE "pg_catalog"."default" DEFAULT 'en'::text,
  "therapy_types" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY['trauma'::text, 'cbt'::text],
  "gender_preference" text COLLATE "pg_catalog"."default",
  "insurance_provider" text COLLATE "pg_catalog"."default",
  "budget_range" text COLLATE "pg_catalog"."default",
  "availability" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY['weekday_morning'::text],
  "severity_level" text COLLATE "pg_catalog"."default",
  "previous_therapy" bool DEFAULT false,
  "created_at" timestamptz(6) DEFAULT now(),
  "updated_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_trait_examples
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_trait_examples";
CREATE TABLE "public"."user_trait_examples" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "trait_id" uuid NOT NULL,
  "personal_example" text COLLATE "pg_catalog"."default" NOT NULL,
  "date_occurred" date,
  "emotional_impact" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for user_trait_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_trait_notes";
CREATE TABLE "public"."user_trait_notes" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "trait_id" uuid NOT NULL,
  "personal_note" text COLLATE "pg_catalog"."default",
  "frequency" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for wellness_goals
-- ----------------------------
DROP TABLE IF EXISTS "public"."wellness_goals";
CREATE TABLE "public"."wellness_goals" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "goal_type" text COLLATE "pg_catalog"."default",
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "target_value" int4,
  "current_value" int4 DEFAULT 0,
  "target_date" date,
  "is_completed" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for wellness_habits
-- ----------------------------
DROP TABLE IF EXISTS "public"."wellness_habits";
CREATE TABLE "public"."wellness_habits" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "habit_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "habit_type" text COLLATE "pg_catalog"."default",
  "target_frequency" int4 DEFAULT 1,
  "streak_count" int4 DEFAULT 0,
  "longest_streak" int4 DEFAULT 0,
  "last_completed" date,
  "is_active" bool DEFAULT true,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for wellness_reports
-- ----------------------------
DROP TABLE IF EXISTS "public"."wellness_reports";
CREATE TABLE "public"."wellness_reports" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "week_start_date" date NOT NULL,
  "week_end_date" date NOT NULL,
  "mood_average" numeric(3,1),
  "energy_average" numeric(3,1),
  "anxiety_average" numeric(3,1),
  "coping_strategies_used" int4 DEFAULT 0,
  "journal_entries_count" int4 DEFAULT 0,
  "habits_completed" int4 DEFAULT 0,
  "ai_insights" jsonb DEFAULT '{}'::jsonb,
  "progress_summary" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Table structure for withdrawal_tracker
-- ----------------------------
DROP TABLE IF EXISTS "public"."withdrawal_tracker";
CREATE TABLE "public"."withdrawal_tracker" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "urge_intensity" int4,
  "withdrawal_symptoms" text[] COLLATE "pg_catalog"."default",
  "trigger_description" text COLLATE "pg_catalog"."default",
  "how_resisted" text COLLATE "pg_catalog"."default",
  "logged_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Function structure for calculate_boundary_success_rate
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."calculate_boundary_success_rate"("p_boundary_id" uuid, "p_start_date" timestamptz, "p_end_date" timestamptz);
CREATE OR REPLACE FUNCTION "public"."calculate_boundary_success_rate"("p_boundary_id" uuid, "p_start_date" timestamptz, "p_end_date" timestamptz)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE
  total_interactions INTEGER;
  success_interactions INTEGER;
  success_rate DECIMAL(5,2);
BEGIN
  -- Count total interactions (excluding reviews and modifications)
  SELECT COUNT(*) INTO total_interactions
  FROM boundary_interactions
  WHERE boundary_id = p_boundary_id
    AND created_at BETWEEN p_start_date AND p_end_date
    AND interaction_type IN ('violation', 'success');
  
  -- Count successful interactions
  SELECT COUNT(*) INTO success_interactions
  FROM boundary_interactions
  WHERE boundary_id = p_boundary_id
    AND created_at BETWEEN p_start_date AND p_end_date
    AND interaction_type = 'success';
  
  -- Calculate success rate
  IF total_interactions > 0 THEN
    success_rate := (success_interactions::DECIMAL / total_interactions::DECIMAL) * 100;
  ELSE
    success_rate := NULL;
  END IF;
  
  RETURN success_rate;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for check_daily_feature_limit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."check_daily_feature_limit"("p_user_id" uuid, "p_feature_name" text);
CREATE OR REPLACE FUNCTION "public"."check_daily_feature_limit"("p_user_id" uuid, "p_feature_name" text)
  RETURNS "pg_catalog"."bool" AS $BODY$
DECLARE
  user_tier subscription_tier;
  daily_limit INTEGER;
  current_usage INTEGER;
  today_start TIMESTAMP WITH TIME ZONE;
  today_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles WHERE id = p_user_id;

  -- Get daily limit for this feature
  SELECT limit_value INTO daily_limit
  FROM feature_limits
  WHERE subscription_tier = user_tier
    AND feature_name = p_feature_name
    AND limit_type = 'monthly_count';

  -- If no limit found or unlimited (-1), allow
  IF daily_limit IS NULL OR daily_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- If limit is 0, deny access
  IF daily_limit = 0 THEN
    RETURN FALSE;
  END IF;

  -- Calculate today's period
  today_start := DATE_TRUNC('day', NOW());
  today_end := today_start + INTERVAL '1 day';

  -- Get current usage for today
  SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature_name = p_feature_name
    AND created_at >= today_start
    AND created_at < today_end;

  -- Check if under daily limit
  RETURN current_usage < daily_limit;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for check_feature_limit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."check_feature_limit"("p_user_id" uuid, "p_feature_name" text, "p_limit_type" text);
CREATE OR REPLACE FUNCTION "public"."check_feature_limit"("p_user_id" uuid, "p_feature_name" text, "p_limit_type" text='monthly_count'::text)
  RETURNS "pg_catalog"."bool" AS $BODY$
DECLARE
  user_tier subscription_tier;
  feature_limit INTEGER;
  current_usage INTEGER;
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles WHERE id = p_user_id;

  -- Get feature limit for this tier
  SELECT limit_value INTO feature_limit
  FROM feature_limits
  WHERE subscription_tier = user_tier
    AND feature_name = p_feature_name
    AND limit_type = p_limit_type;

  -- If no limit found or unlimited (-1), allow
  IF feature_limit IS NULL OR feature_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- Calculate current billing period
  current_period_start := DATE_TRUNC('month', CURRENT_DATE);
  current_period_end := current_period_start + INTERVAL '1 month' - INTERVAL '1 day';

  -- Get current usage for this period
  SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature_name = p_feature_name
    AND usage_type = p_limit_type
    AND billing_period_start = current_period_start;

  -- Check if under limit
  RETURN current_usage < feature_limit;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
COMMENT ON FUNCTION "public"."check_feature_limit"("p_user_id" uuid, "p_feature_name" text, "p_limit_type" text) IS 'Checks if user has reached their subscription tier limit for a feature';

-- ----------------------------
-- Function structure for cleanup_deleted_data
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."cleanup_deleted_data"();
CREATE OR REPLACE FUNCTION "public"."cleanup_deleted_data"()
  RETURNS "pg_catalog"."int4" AS $BODY$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete data older than 30 days
    DELETE FROM journal_entries WHERE deleted_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM ai_conversations WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM ai_messages WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM mind_reset_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM affirmations WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM morning_intentions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM reality_log_entries WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM mental_pause_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    DELETE FROM decompression_sessions WHERE deleted_at < NOW() - INTERVAL '30 days';
    
    -- Finally delete profiles (this will cascade to remaining data)
    DELETE FROM profiles WHERE deleted_at < NOW() - INTERVAL '30 days';
    
    RETURN deleted_count;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
COMMENT ON FUNCTION "public"."cleanup_deleted_data"() IS 'Permanently removes soft-deleted data older than 30 days';

-- ----------------------------
-- Function structure for expire_trial_codes
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."expire_trial_codes"();
CREATE OR REPLACE FUNCTION "public"."expire_trial_codes"()
  RETURNS "pg_catalog"."int4" AS $BODY$
DECLARE
  v_expired_count INTEGER := 0;
  v_redemption RECORD;
BEGIN
  -- Find expired trials
  FOR v_redemption IN
    SELECT cr.id, cr.user_id, cr.original_tier
    FROM code_redemptions cr
    WHERE cr.is_active = true
      AND cr.trial_ends_at <= NOW()
  LOOP
    -- Revert user to original tier
    UPDATE profiles
    SET subscription_tier = v_redemption.original_tier,
        updated_at = NOW()
    WHERE id = v_redemption.user_id;

    -- Mark redemption as inactive
    UPDATE code_redemptions
    SET is_active = false
    WHERE id = v_redemption.id;

    v_expired_count := v_expired_count + 1;
  END LOOP;

  RETURN v_expired_count;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for get_latest_relationship_health
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."get_latest_relationship_health"("user_uuid" uuid);
CREATE OR REPLACE FUNCTION "public"."get_latest_relationship_health"("user_uuid" uuid)
  RETURNS "pg_catalog"."int4" AS $BODY$
DECLARE
    latest_score INTEGER;
BEGIN
    SELECT overall_score INTO latest_score
    FROM relationship_assessments
    WHERE user_id = user_uuid
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(latest_score, 50); -- Default neutral score
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for get_optimal_legal_platform
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."get_optimal_legal_platform"("p_user_id" uuid, "p_source" text, "p_legal_specialty" text);
CREATE OR REPLACE FUNCTION "public"."get_optimal_legal_platform"("p_user_id" uuid, "p_source" text, "p_legal_specialty" text='family_law'::text)
  RETURNS "pg_catalog"."text" AS $BODY$
DECLARE
  user_needs user_legal_needs%ROWTYPE;
  optimal_platform TEXT;
BEGIN
  -- Get user legal needs
  SELECT * INTO user_needs 
  FROM user_legal_needs 
  WHERE user_id = p_user_id;
  
  -- Determine optimal platform based on source and needs
  CASE p_source
    WHEN 'evidence_export' THEN
      optimal_platform := 'martindale_hubbell'; -- Premium platform for evidence-based cases
    WHEN 'custody_documentation' THEN
      optimal_platform := 'findlaw'; -- Strong custody focus
    WHEN 'divorce_planning' THEN
      optimal_platform := 'lawyers_com'; -- Comprehensive divorce services
    WHEN 'safety_plan' THEN
      optimal_platform := 'avvo'; -- Good for domestic violence cases
    ELSE
      -- Use analytics to determine best performing platform
      SELECT platform INTO optimal_platform
      FROM legal_referral_analytics
      WHERE referral_source = p_source
        AND legal_specialty = p_legal_specialty
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY (conversion_rate * revenue_per_click) DESC
      LIMIT 1;
      
      -- Default fallback
      optimal_platform := COALESCE(optimal_platform, 'avvo');
  END CASE;
  
  RETURN optimal_platform;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for get_optimal_therapy_platform
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."get_optimal_therapy_platform"("p_user_id" uuid, "p_source" text);
CREATE OR REPLACE FUNCTION "public"."get_optimal_therapy_platform"("p_user_id" uuid, "p_source" text)
  RETURNS "pg_catalog"."text" AS $BODY$
DECLARE
  optimal_platform TEXT;
BEGIN
  CASE p_source
    WHEN 'crisis' THEN
      optimal_platform := 'betterhelp';
    WHEN 'manipulation_detected' THEN
      optimal_platform := 'talkspace';
    WHEN 'safety_plan' THEN
      optimal_platform := 'betterhelp';
    ELSE
      SELECT platform INTO optimal_platform
      FROM referral_analytics
      WHERE referral_source = p_source
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY (conversion_rate * revenue_per_click) DESC
      LIMIT 1;
      
      optimal_platform := COALESCE(optimal_platform, 'psychology_today');
  END CASE;
  
  RETURN optimal_platform;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for get_related_posts
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."get_related_posts"("post_id" uuid, "limit_count" int4);
CREATE OR REPLACE FUNCTION "public"."get_related_posts"("post_id" uuid, "limit_count" int4=3)
  RETURNS TABLE("id" uuid, "title" text, "slug" text, "excerpt" text, "featured_image" text, "published_at" timestamptz) AS $BODY$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image,
    bp.published_at
  FROM blog_posts bp
  JOIN blog_post_tags bpt1 ON bp.id = bpt1.post_id
  JOIN blog_post_tags bpt2 ON bpt1.tag_id = bpt2.tag_id
  WHERE bpt2.post_id = get_related_posts.post_id
    AND bp.id != get_related_posts.post_id
    AND bp.status = 'published'
  ORDER BY bp.published_at DESC
  LIMIT limit_count;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100
  ROWS 1000;

-- ----------------------------
-- Function structure for get_subscription_plan
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."get_subscription_plan"("p_tier" "public"."subscription_tier");
CREATE OR REPLACE FUNCTION "public"."get_subscription_plan"("p_tier" "public"."subscription_tier")
  RETURNS TABLE("plan_name" text, "display_name" text, "description" text, "price_monthly" numeric, "price_yearly" numeric) AS $BODY$
BEGIN
  RETURN QUERY
  SELECT 
    sp.plan_name,
    sp.display_name,
    sp.description,
    sp.price_monthly,
    sp.price_yearly
  FROM subscription_plans sp
  WHERE sp.plan_tier = p_tier AND sp.is_active = true;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100
  ROWS 1000;

-- ----------------------------
-- Function structure for increment_post_views
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."increment_post_views"("post_slug" text);
CREATE OR REPLACE FUNCTION "public"."increment_post_views"("post_slug" text)
  RETURNS "pg_catalog"."void" AS $BODY$
BEGIN
  UPDATE blog_posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for log_belief_strength_change
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."log_belief_strength_change"();
CREATE OR REPLACE FUNCTION "public"."log_belief_strength_change"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.current_strength != NEW.current_strength) OR TG_OP = 'INSERT' THEN
    INSERT INTO belief_strength_log (belief_id, strength, notes)
    VALUES (NEW.id, NEW.current_strength, 'Strength updated');
  END IF;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for record_feature_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."record_feature_usage"("p_user_id" uuid, "p_feature_name" text, "p_usage_type" text, "p_usage_count" int4, "p_metadata" jsonb);
CREATE OR REPLACE FUNCTION "public"."record_feature_usage"("p_user_id" uuid, "p_feature_name" text, "p_usage_type" text='monthly_count'::text, "p_usage_count" int4=1, "p_metadata" jsonb=''::jsonb)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  current_period_start := DATE_TRUNC('month', CURRENT_DATE);
  current_period_end := current_period_start + INTERVAL '1 month' - INTERVAL '1 day';

  INSERT INTO usage_tracking (
    user_id, feature_name, usage_type, usage_count, usage_metadata,
    billing_period_start, billing_period_end
  ) VALUES (
    p_user_id, p_feature_name, p_usage_type, p_usage_count, p_metadata,
    current_period_start, current_period_end
  )
  ON CONFLICT (user_id, feature_name, usage_type, billing_period_start)
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + EXCLUDED.usage_count,
    usage_metadata = EXCLUDED.usage_metadata;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
COMMENT ON FUNCTION "public"."record_feature_usage"("p_user_id" uuid, "p_feature_name" text, "p_usage_type" text, "p_usage_count" int4, "p_metadata" jsonb) IS 'Records feature usage for subscription tier tracking';

-- ----------------------------
-- Function structure for redeem_trial_code
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."redeem_trial_code"("p_code" text, "p_user_id" uuid, "p_ip_address" inet, "p_user_agent" text);
CREATE OR REPLACE FUNCTION "public"."redeem_trial_code"("p_code" text, "p_user_id" uuid, "p_ip_address" inet=NULL::inet, "p_user_agent" text=NULL::text)
  RETURNS "pg_catalog"."json" AS $BODY$
DECLARE
  v_code_record redeem_codes%ROWTYPE;
  v_user_tier subscription_tier;
  v_trial_end TIMESTAMP WITH TIME ZONE;
  v_redemption_id UUID;
  v_existing_redemption UUID;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO v_code_record
  FROM redeem_codes
  WHERE code = p_code 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses = -1 OR current_uses < max_uses);

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired code'
    );
  END IF;

  -- Get user's current tier
  SELECT subscription_tier INTO v_user_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user already has an active trial
  SELECT id INTO v_existing_redemption
  FROM code_redemptions
  WHERE user_id = p_user_id 
    AND is_active = true
    AND trial_ends_at > NOW();

  IF FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You already have an active trial'
    );
  END IF;

  -- Check if user is trying to downgrade
  IF (v_user_tier = 'empowerment' AND v_code_record.target_tier != 'empowerment') OR
     (v_user_tier = 'recovery' AND v_code_record.target_tier = 'foundation') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cannot downgrade with trial code'
    );
  END IF;

  -- Calculate trial end date
  v_trial_end := NOW() + (v_code_record.trial_duration_days || ' days')::INTERVAL;

  -- Create redemption record
  INSERT INTO code_redemptions (
    code_id, user_id, trial_ends_at, original_tier, upgraded_tier,
    ip_address, user_agent
  ) VALUES (
    v_code_record.id, p_user_id, v_trial_end, v_user_tier, v_code_record.target_tier,
    p_ip_address, p_user_agent
  ) RETURNING id INTO v_redemption_id;

  -- Update user's subscription tier
  UPDATE profiles
  SET subscription_tier = v_code_record.target_tier,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Increment code usage
  UPDATE redeem_codes
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = v_code_record.id;

  RETURN json_build_object(
    'success', true,
    'message', 'Code redeemed successfully!',
    'trial_tier', v_code_record.target_tier,
    'trial_days', v_code_record.trial_duration_days,
    'trial_ends_at', v_trial_end,
    'redemption_id', v_redemption_id
  );
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for reset_admin_failed_attempts
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."reset_admin_failed_attempts"();
CREATE OR REPLACE FUNCTION "public"."reset_admin_failed_attempts"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  IF NEW.last_login_at IS NOT NULL AND NEW.last_login_at != OLD.last_login_at THEN
    NEW.failed_attempts = 0;
    NEW.locked_until = NULL;
  END IF;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for set_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."set_updated_at"();
CREATE OR REPLACE FUNCTION "public"."set_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
begin
  new.updated_at = now();
  return new;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for soft_delete_user
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."soft_delete_user"("target_user_id" uuid);
CREATE OR REPLACE FUNCTION "public"."soft_delete_user"("target_user_id" uuid)
  RETURNS "pg_catalog"."bool" AS $BODY$
BEGIN
    -- Soft delete profile
    UPDATE profiles SET deleted_at = NOW() WHERE id = target_user_id;
    
    -- Soft delete all user data
    UPDATE journal_entries SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE ai_conversations SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE ai_messages SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE mind_reset_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE affirmations SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE morning_intentions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE reality_log_entries SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE mental_pause_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    UPDATE decompression_sessions SET deleted_at = NOW() WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
COMMENT ON FUNCTION "public"."soft_delete_user"("target_user_id" uuid) IS 'Soft deletes a user and all their data for GDPR compliance';

-- ----------------------------
-- Function structure for track_ai_interaction_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."track_ai_interaction_usage"();
CREATE OR REPLACE FUNCTION "public"."track_ai_interaction_usage"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'ai_interactions', 'monthly_count', 1);
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for track_evidence_file_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."track_evidence_file_usage"();
CREATE OR REPLACE FUNCTION "public"."track_evidence_file_usage"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'evidence_files', 'monthly_count', 1);
  
  -- Also track storage usage
  IF NEW.file_size IS NOT NULL THEN
    PERFORM record_feature_usage(
      NEW.user_id, 
      'storage', 
      'storage_mb', 
      CEIL(NEW.file_size / 1048576.0)::INTEGER -- Convert bytes to MB
    );
  END IF;
  
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for track_export_request_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."track_export_request_usage"();
CREATE OR REPLACE FUNCTION "public"."track_export_request_usage"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'export_requests', 'monthly_count', 1);
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for track_journal_entry_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."track_journal_entry_usage"();
CREATE OR REPLACE FUNCTION "public"."track_journal_entry_usage"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'journal_entries', 'monthly_count', 1);
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for track_pattern_analysis_usage
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."track_pattern_analysis_usage"();
CREATE OR REPLACE FUNCTION "public"."track_pattern_analysis_usage"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  PERFORM record_feature_usage(NEW.user_id, 'pattern_analysis', 'monthly_count', 1);
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for trigger_update_gratitude_streak
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."trigger_update_gratitude_streak"();
CREATE OR REPLACE FUNCTION "public"."trigger_update_gratitude_streak"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  -- Only update streak for gratitude entries
  IF NEW.entry_type IN ('gratitude', 'both') OR NEW.is_daily_gratitude = true THEN
    PERFORM update_gratitude_streak(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_boundary_last_reviewed
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_boundary_last_reviewed"();
CREATE OR REPLACE FUNCTION "public"."update_boundary_last_reviewed"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  UPDATE boundaries 
  SET last_reviewed = NOW(), updated_at = NOW()
  WHERE id = NEW.boundary_id;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_crisis_reframes_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_crisis_reframes_updated_at"();
CREATE OR REPLACE FUNCTION "public"."update_crisis_reframes_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_gratitude_streak
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_gratitude_streak"("user_uuid" uuid);
CREATE OR REPLACE FUNCTION "public"."update_gratitude_streak"("user_uuid" uuid)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
  has_today_entry BOOLEAN;
  current_streak_val INTEGER := 0;
  longest_streak_val INTEGER := 0;
BEGIN
  -- Check if user has gratitude entry today
  SELECT EXISTS(
    SELECT 1 FROM positive_moments 
    WHERE user_id = user_uuid 
    AND DATE(moment_date) = today_date 
    AND (entry_type = 'gratitude' OR entry_type = 'both' OR is_daily_gratitude = true)
  ) INTO has_today_entry;

  -- Get current streak info
  SELECT current_streak, longest_streak 
  INTO current_streak_val, longest_streak_val
  FROM gratitude_streaks 
  WHERE user_id = user_uuid;

  -- If no streak record exists, create one
  IF NOT FOUND THEN
    INSERT INTO gratitude_streaks (user_id, current_streak, longest_streak, last_entry_date)
    VALUES (user_uuid, 0, 0, NULL);
    current_streak_val := 0;
    longest_streak_val := 0;
  END IF;

  -- Update streak based on today's entry
  IF has_today_entry THEN
    -- Check if this continues a streak from yesterday
    IF EXISTS(
      SELECT 1 FROM positive_moments 
      WHERE user_id = user_uuid 
      AND DATE(moment_date) = yesterday_date 
      AND (entry_type = 'gratitude' OR entry_type = 'both' OR is_daily_gratitude = true)
    ) THEN
      current_streak_val := current_streak_val + 1;
    ELSE
      current_streak_val := 1; -- Start new streak
    END IF;
    
    -- Update longest streak if current is longer
    IF current_streak_val > longest_streak_val THEN
      longest_streak_val := current_streak_val;
    END IF;
    
    -- Update the streak record
    UPDATE gratitude_streaks 
    SET current_streak = current_streak_val,
        longest_streak = longest_streak_val,
        last_entry_date = today_date,
        updated_at = NOW()
    WHERE user_id = user_uuid;
  END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Function structure for update_legal_referral_analytics
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_legal_referral_analytics"();
CREATE OR REPLACE FUNCTION "public"."update_legal_referral_analytics"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  -- Only process legal referrals
  IF NEW.referral_type != 'legal' THEN
    RETURN NEW;
  END IF;

  -- Update analytics when legal referral is clicked
  IF TG_OP = 'INSERT' THEN
    INSERT INTO legal_referral_analytics (date, referral_source, platform, legal_specialty, clicks)
    VALUES (CURRENT_DATE, NEW.referral_source, NEW.platform, 'family_law', 1)
    ON CONFLICT (date, referral_source, platform, legal_specialty)
    DO UPDATE SET clicks = legal_referral_analytics.clicks + 1;
  END IF;
  
  -- Update conversions when legal referral converts
  IF TG_OP = 'UPDATE' AND OLD.converted = FALSE AND NEW.converted = TRUE THEN
    UPDATE legal_referral_analytics 
    SET 
      conversions = conversions + 1,
      revenue = revenue + COALESCE(NEW.commission_amount, 0)
    WHERE 
      date = CURRENT_DATE 
      AND referral_source = NEW.referral_source 
      AND platform = NEW.platform
      AND legal_specialty = 'family_law';
  END IF;
  
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_manipulation_analysis_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_manipulation_analysis_updated_at"();
CREATE OR REPLACE FUNCTION "public"."update_manipulation_analysis_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_narcissist_analyses_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_narcissist_analyses_updated_at"();
CREATE OR REPLACE FUNCTION "public"."update_narcissist_analyses_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_referral_analytics
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_referral_analytics"();
CREATE OR REPLACE FUNCTION "public"."update_referral_analytics"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO referral_analytics (date, referral_source, platform, clicks)
    VALUES (CURRENT_DATE, NEW.referral_source, NEW.platform, 1)
    ON CONFLICT (date, referral_source, platform)
    DO UPDATE SET clicks = referral_analytics.clicks + 1;
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.converted = FALSE AND NEW.converted = TRUE THEN
    UPDATE referral_analytics 
    SET 
      conversions = conversions + 1,
      revenue = revenue + COALESCE(NEW.commission_amount, 0)
    WHERE 
      date = CURRENT_DATE 
      AND referral_source = NEW.referral_source 
      AND platform = NEW.platform;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_relationship_assessments_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_relationship_assessments_updated_at"();
CREATE OR REPLACE FUNCTION "public"."update_relationship_assessments_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_simulator_sessions_updated_at
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_simulator_sessions_updated_at"();
CREATE OR REPLACE FUNCTION "public"."update_simulator_sessions_updated_at"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for update_updated_at_column
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."update_updated_at_column"();
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Function structure for validate_redeem_code
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."validate_redeem_code"("p_code" text, "p_user_id" uuid);
CREATE OR REPLACE FUNCTION "public"."validate_redeem_code"("p_code" text, "p_user_id" uuid)
  RETURNS "pg_catalog"."json" AS $BODY$
DECLARE
  v_code_record redeem_codes%ROWTYPE;
  v_user_tier subscription_tier;
  v_existing_redemption UUID;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO v_code_record
  FROM redeem_codes
  WHERE code = p_code 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses = -1 OR current_uses < max_uses);

  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Invalid or expired code'
    );
  END IF;

  -- Get user's current tier
  SELECT subscription_tier INTO v_user_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user already has an active trial
  SELECT id INTO v_existing_redemption
  FROM code_redemptions
  WHERE user_id = p_user_id 
    AND is_active = true
    AND trial_ends_at > NOW();

  IF FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'You already have an active trial'
    );
  END IF;

  -- Check if user is trying to downgrade
  IF (v_user_tier = 'empowerment' AND v_code_record.target_tier != 'empowerment') OR
     (v_user_tier = 'recovery' AND v_code_record.target_tier = 'foundation') THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Cannot downgrade with trial code'
    );
  END IF;

  RETURN json_build_object(
    'valid', true,
    'code_type', v_code_record.code_type,
    'target_tier', v_code_record.target_tier,
    'trial_duration_days', v_code_record.trial_duration_days,
    'description', v_code_record.description,
    'remaining_uses', CASE 
      WHEN v_code_record.max_uses = -1 THEN -1
      ELSE v_code_record.max_uses - v_code_record.current_uses
    END
  );
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;

-- ----------------------------
-- Indexes structure for table abuse_cycles
-- ----------------------------
CREATE INDEX "idx_abuse_cycles_user" ON "public"."abuse_cycles" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table abuse_cycles
-- ----------------------------
ALTER TABLE "public"."abuse_cycles" ADD CONSTRAINT "abuse_cycles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table acceptance_journal
-- ----------------------------
CREATE INDEX "idx_acceptance_journal_user_date" ON "public"."acceptance_journal" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "entry_date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table acceptance_journal
-- ----------------------------
ALTER TABLE "public"."acceptance_journal" ADD CONSTRAINT "acceptance_journal_user_id_entry_date_key" UNIQUE ("user_id", "entry_date");

-- ----------------------------
-- Checks structure for table acceptance_journal
-- ----------------------------
ALTER TABLE "public"."acceptance_journal" ADD CONSTRAINT "acceptance_journal_acceptance_level_check" CHECK (acceptance_level >= 1 AND acceptance_level <= 10);

-- ----------------------------
-- Primary Key structure for table acceptance_journal
-- ----------------------------
ALTER TABLE "public"."acceptance_journal" ADD CONSTRAINT "acceptance_journal_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table acceptance_milestones
-- ----------------------------
CREATE INDEX "idx_acceptance_milestones_user_type" ON "public"."acceptance_milestones" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "milestone_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table acceptance_milestones
-- ----------------------------
ALTER TABLE "public"."acceptance_milestones" ADD CONSTRAINT "acceptance_milestones_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table acceptance_progress
-- ----------------------------
CREATE INDEX "idx_acceptance_progress_user" ON "public"."acceptance_progress" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table acceptance_progress
-- ----------------------------
ALTER TABLE "public"."acceptance_progress" ADD CONSTRAINT "acceptance_progress_difficulty_rating_check" CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10);
ALTER TABLE "public"."acceptance_progress" ADD CONSTRAINT "acceptance_progress_module_type_check" CHECK (module_type = ANY (ARRAY['mask_visualization'::text, 'grief_processing'::text, 'acceptance_affirmations'::text, 'expectation_vs_reality'::text, 'trigger_identification'::text]));

-- ----------------------------
-- Primary Key structure for table acceptance_progress
-- ----------------------------
ALTER TABLE "public"."acceptance_progress" ADD CONSTRAINT "acceptance_progress_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table admin_users
-- ----------------------------
CREATE TRIGGER "reset_failed_attempts_trigger" BEFORE UPDATE ON "public"."admin_users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."reset_admin_failed_attempts"();

-- ----------------------------
-- Checks structure for table admin_users
-- ----------------------------
ALTER TABLE "public"."admin_users" ADD CONSTRAINT "admin_users_role_check" CHECK (role = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- ----------------------------
-- Primary Key structure for table admin_users
-- ----------------------------
ALTER TABLE "public"."admin_users" ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table affirmation_preferences
-- ----------------------------
CREATE INDEX "idx_affirmation_preferences_user" ON "public"."affirmation_preferences" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table affirmation_preferences
-- ----------------------------
ALTER TABLE "public"."affirmation_preferences" ADD CONSTRAINT "affirmation_preferences_user_id_key" UNIQUE ("user_id");

-- ----------------------------
-- Checks structure for table affirmation_preferences
-- ----------------------------
ALTER TABLE "public"."affirmation_preferences" ADD CONSTRAINT "affirmation_preferences_custody_situation_check" CHECK (custody_situation = ANY (ARRAY['full'::text, 'shared'::text, 'limited'::text, 'supervised'::text, 'none'::text]));

-- ----------------------------
-- Primary Key structure for table affirmation_preferences
-- ----------------------------
ALTER TABLE "public"."affirmation_preferences" ADD CONSTRAINT "affirmation_preferences_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table affirmations
-- ----------------------------
CREATE INDEX "idx_affirmations_category" ON "public"."affirmations" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_affirmations_parent_focused" ON "public"."affirmations" USING btree (
  "is_parent_focused" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "idx_affirmations_target_audience" ON "public"."affirmations" USING gin (
  "target_audience" COLLATE "pg_catalog"."default" "pg_catalog"."array_ops"
);

-- ----------------------------
-- Primary Key structure for table affirmations
-- ----------------------------
ALTER TABLE "public"."affirmations" ADD CONSTRAINT "affirmations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table ai_conversations
-- ----------------------------
ALTER TABLE "public"."ai_conversations" ADD CONSTRAINT "ai_conversations_context_type_check" CHECK (context_type = ANY (ARRAY['general'::text, 'crisis'::text, 'pattern-analysis'::text, 'mind-reset'::text, 'grey-rock'::text]));

-- ----------------------------
-- Primary Key structure for table ai_conversations
-- ----------------------------
ALTER TABLE "public"."ai_conversations" ADD CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ai_messages
-- ----------------------------
CREATE INDEX "idx_ai_messages_conversation_id" ON "public"."ai_messages" USING btree (
  "conversation_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table ai_messages
-- ----------------------------
CREATE TRIGGER "trigger_track_ai_interaction_usage" AFTER INSERT ON "public"."ai_messages"
FOR EACH ROW
EXECUTE PROCEDURE "public"."track_ai_interaction_usage"();

-- ----------------------------
-- Checks structure for table ai_messages
-- ----------------------------
ALTER TABLE "public"."ai_messages" ADD CONSTRAINT "ai_messages_role_check" CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text]));

-- ----------------------------
-- Primary Key structure for table ai_messages
-- ----------------------------
ALTER TABLE "public"."ai_messages" ADD CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table assessment_categories
-- ----------------------------
ALTER TABLE "public"."assessment_categories" ADD CONSTRAINT "assessment_categories_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table assessment_categories
-- ----------------------------
ALTER TABLE "public"."assessment_categories" ADD CONSTRAINT "assessment_categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table attachment_triggers
-- ----------------------------
CREATE INDEX "idx_attachment_triggers_user_date" ON "public"."attachment_triggers" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "trigger_date" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table attachment_triggers
-- ----------------------------
ALTER TABLE "public"."attachment_triggers" ADD CONSTRAINT "attachment_triggers_effectiveness_check" CHECK (effectiveness >= 1 AND effectiveness <= 10);

-- ----------------------------
-- Primary Key structure for table attachment_triggers
-- ----------------------------
ALTER TABLE "public"."attachment_triggers" ADD CONSTRAINT "attachment_triggers_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table belief_affirmations
-- ----------------------------
CREATE INDEX "idx_affirmations_user_belief" ON "public"."belief_affirmations" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "belief_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table belief_affirmations
-- ----------------------------
ALTER TABLE "public"."belief_affirmations" ADD CONSTRAINT "belief_affirmations_user_rating_check" CHECK (user_rating >= 1 AND user_rating <= 5);

-- ----------------------------
-- Primary Key structure for table belief_affirmations
-- ----------------------------
ALTER TABLE "public"."belief_affirmations" ADD CONSTRAINT "belief_affirmations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table belief_strength_log
-- ----------------------------
CREATE INDEX "idx_belief_strength_log_belief" ON "public"."belief_strength_log" USING btree (
  "belief_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "logged_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table belief_strength_log
-- ----------------------------
ALTER TABLE "public"."belief_strength_log" ADD CONSTRAINT "belief_strength_log_strength_check" CHECK (strength >= 1 AND strength <= 10);

-- ----------------------------
-- Primary Key structure for table belief_strength_log
-- ----------------------------
ALTER TABLE "public"."belief_strength_log" ADD CONSTRAINT "belief_strength_log_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table biff_templates
-- ----------------------------
CREATE INDEX "idx_biff_templates_category" ON "public"."biff_templates" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "is_custom" "pg_catalog"."bool_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table biff_templates
-- ----------------------------
ALTER TABLE "public"."biff_templates" ADD CONSTRAINT "biff_templates_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table blog_categories
-- ----------------------------
ALTER TABLE "public"."blog_categories" ADD CONSTRAINT "blog_categories_name_key" UNIQUE ("name");
ALTER TABLE "public"."blog_categories" ADD CONSTRAINT "blog_categories_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table blog_categories
-- ----------------------------
ALTER TABLE "public"."blog_categories" ADD CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table blog_post_tags
-- ----------------------------
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("post_id", "tag_id");

-- ----------------------------
-- Indexes structure for table blog_posts
-- ----------------------------
CREATE INDEX "idx_blog_posts_category" ON "public"."blog_posts" USING btree (
  "category_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_blog_posts_featured" ON "public"."blog_posts" USING btree (
  "is_featured" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_featured = true;
CREATE INDEX "idx_blog_posts_published" ON "public"."blog_posts" USING btree (
  "published_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
) WHERE status = 'published'::text;
CREATE INDEX "idx_blog_posts_slug" ON "public"."blog_posts" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_blog_posts_status" ON "public"."blog_posts" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Checks structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]));

-- ----------------------------
-- Primary Key structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table blog_tags
-- ----------------------------
ALTER TABLE "public"."blog_tags" ADD CONSTRAINT "blog_tags_name_key" UNIQUE ("name");
ALTER TABLE "public"."blog_tags" ADD CONSTRAINT "blog_tags_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table blog_tags
-- ----------------------------
ALTER TABLE "public"."blog_tags" ADD CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table boundaries
-- ----------------------------
ALTER TABLE "public"."boundaries" ADD CONSTRAINT "boundaries_priority_check" CHECK (priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]));
ALTER TABLE "public"."boundaries" ADD CONSTRAINT "boundaries_status_check" CHECK (status = ANY (ARRAY['active'::text, 'working-on'::text, 'needs-attention'::text]));

-- ----------------------------
-- Primary Key structure for table boundaries
-- ----------------------------
ALTER TABLE "public"."boundaries" ADD CONSTRAINT "boundaries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table boundary_analytics
-- ----------------------------
CREATE INDEX "idx_boundary_analytics_boundary_id" ON "public"."boundary_analytics" USING btree (
  "boundary_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_analytics_period" ON "public"."boundary_analytics" USING btree (
  "period_start" "pg_catalog"."timestamptz_ops" ASC NULLS LAST,
  "period_end" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_analytics_user_id" ON "public"."boundary_analytics" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table boundary_analytics
-- ----------------------------
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_boundary_id_period_start_period_end_peri_key" UNIQUE ("boundary_id", "period_start", "period_end", "period_type");

-- ----------------------------
-- Checks structure for table boundary_analytics
-- ----------------------------
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_period_type_check" CHECK (period_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text]));
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_trend_direction_check" CHECK (trend_direction = ANY (ARRAY['improving'::text, 'stable'::text, 'declining'::text]));

-- ----------------------------
-- Primary Key structure for table boundary_analytics
-- ----------------------------
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table boundary_interactions
-- ----------------------------
CREATE INDEX "idx_boundary_interactions_boundary_id" ON "public"."boundary_interactions" USING btree (
  "boundary_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_interactions_created_at" ON "public"."boundary_interactions" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_interactions_type" ON "public"."boundary_interactions" USING btree (
  "interaction_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_interactions_user_id" ON "public"."boundary_interactions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table boundary_interactions
-- ----------------------------
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_emotional_impact_check" CHECK (emotional_impact >= 1 AND emotional_impact <= 5);
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_interaction_type_check" CHECK (interaction_type = ANY (ARRAY['violation'::text, 'success'::text, 'review'::text, 'modification'::text]));
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_severity_check" CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]));

-- ----------------------------
-- Primary Key structure for table boundary_interactions
-- ----------------------------
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table boundary_reviews
-- ----------------------------
CREATE INDEX "idx_boundary_reviews_boundary_id" ON "public"."boundary_reviews" USING btree (
  "boundary_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_reviews_scheduled_date" ON "public"."boundary_reviews" USING btree (
  "scheduled_date" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_reviews_status" ON "public"."boundary_reviews" USING btree (
  "review_status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_boundary_reviews_user_id" ON "public"."boundary_reviews" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table boundary_reviews
-- ----------------------------
CREATE TRIGGER "trigger_update_boundary_last_reviewed" AFTER INSERT ON "public"."boundary_reviews"
FOR EACH ROW
WHEN ((new.review_status = 'completed'::text))
EXECUTE PROCEDURE "public"."update_boundary_last_reviewed"();

-- ----------------------------
-- Checks structure for table boundary_reviews
-- ----------------------------
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_effectiveness_rating_check" CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5);
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_review_status_check" CHECK (review_status = ANY (ARRAY['pending'::text, 'completed'::text, 'skipped'::text]));
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_review_type_check" CHECK (review_type = ANY (ARRAY['scheduled'::text, 'triggered'::text, 'manual'::text]));

-- ----------------------------
-- Primary Key structure for table boundary_reviews
-- ----------------------------
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table code_redemptions
-- ----------------------------
CREATE INDEX "idx_code_redemptions_active" ON "public"."code_redemptions" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_active = true;
CREATE INDEX "idx_code_redemptions_trial_end" ON "public"."code_redemptions" USING btree (
  "trial_ends_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_code_redemptions_user" ON "public"."code_redemptions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table code_redemptions
-- ----------------------------
ALTER TABLE "public"."code_redemptions" ADD CONSTRAINT "code_redemptions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table cognitive_dissonance_alerts
-- ----------------------------
CREATE INDEX "idx_cd_alerts_unresolved" ON "public"."cognitive_dissonance_alerts" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_resolved" "pg_catalog"."bool_ops" ASC NULLS LAST,
  "is_dismissed" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_resolved = false AND is_dismissed = false;
CREATE INDEX "idx_cd_alerts_user" ON "public"."cognitive_dissonance_alerts" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table cognitive_dissonance_alerts
-- ----------------------------
ALTER TABLE "public"."cognitive_dissonance_alerts" ADD CONSTRAINT "cognitive_dissonance_alerts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table communication_insights
-- ----------------------------
CREATE INDEX "idx_communication_insights_user_date" ON "public"."communication_insights" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "insight_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table communication_insights
-- ----------------------------
ALTER TABLE "public"."communication_insights" ADD CONSTRAINT "communication_insights_user_id_insight_date_key" UNIQUE ("user_id", "insight_date");

-- ----------------------------
-- Primary Key structure for table communication_insights
-- ----------------------------
ALTER TABLE "public"."communication_insights" ADD CONSTRAINT "communication_insights_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table community_comments
-- ----------------------------
CREATE INDEX "community_comments_author_idx" ON "public"."community_comments" USING btree (
  "author_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "community_comments_created_idx" ON "public"."community_comments" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);
CREATE INDEX "community_comments_post_idx" ON "public"."community_comments" USING btree (
  "post_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table community_comments
-- ----------------------------
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table community_likes
-- ----------------------------
ALTER TABLE "public"."community_likes" ADD CONSTRAINT "community_likes_pkey" PRIMARY KEY ("post_id", "user_id");

-- ----------------------------
-- Indexes structure for table community_posts
-- ----------------------------
CREATE INDEX "community_posts_author_idx" ON "public"."community_posts" USING btree (
  "author_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "community_posts_created_idx" ON "public"."community_posts" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table community_posts
-- ----------------------------
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table confabulation_patterns
-- ----------------------------
CREATE INDEX "idx_confabulation_patterns_user" ON "public"."confabulation_patterns" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "analysis_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table confabulation_patterns
-- ----------------------------
ALTER TABLE "public"."confabulation_patterns" ADD CONSTRAINT "confabulation_patterns_user_id_analysis_date_key" UNIQUE ("user_id", "analysis_date");

-- ----------------------------
-- Primary Key structure for table confabulation_patterns
-- ----------------------------
ALTER TABLE "public"."confabulation_patterns" ADD CONSTRAINT "confabulation_patterns_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table coparent_communications
-- ----------------------------
CREATE INDEX "idx_coparent_comms_user_date" ON "public"."coparent_communications" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table coparent_communications
-- ----------------------------
ALTER TABLE "public"."coparent_communications" ADD CONSTRAINT "coparent_communications_biff_score_check" CHECK (biff_score >= 1 AND biff_score <= 10);
ALTER TABLE "public"."coparent_communications" ADD CONSTRAINT "coparent_communications_direction_check" CHECK (direction::text = ANY (ARRAY['incoming'::character varying, 'outgoing'::character varying]::text[]));
ALTER TABLE "public"."coparent_communications" ADD CONSTRAINT "coparent_communications_emotional_trigger_level_check" CHECK (emotional_trigger_level >= 1 AND emotional_trigger_level <= 10);

-- ----------------------------
-- Primary Key structure for table coparent_communications
-- ----------------------------
ALTER TABLE "public"."coparent_communications" ADD CONSTRAINT "coparent_communications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table coping_strategies
-- ----------------------------
CREATE INDEX "idx_coping_strategies_user_id" ON "public"."coping_strategies" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table coping_strategies
-- ----------------------------
ALTER TABLE "public"."coping_strategies" ADD CONSTRAINT "coping_strategies_effectiveness_rating_check" CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5);

-- ----------------------------
-- Primary Key structure for table coping_strategies
-- ----------------------------
ALTER TABLE "public"."coping_strategies" ADD CONSTRAINT "coping_strategies_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table counter_evidence
-- ----------------------------
CREATE INDEX "idx_counter_evidence_belief" ON "public"."counter_evidence" USING btree (
  "belief_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table counter_evidence
-- ----------------------------
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_evidence_source_check" CHECK (evidence_source = ANY (ARRAY['journal'::text, 'manual'::text, 'ai_suggested'::text]));
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_evidence_strength_check" CHECK (evidence_strength >= 1 AND evidence_strength <= 5);

-- ----------------------------
-- Primary Key structure for table counter_evidence
-- ----------------------------
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table crisis_reframes
-- ----------------------------
CREATE INDEX "idx_crisis_reframes_created" ON "public"."crisis_reframes" USING btree (
  "created_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_crisis_reframes_type" ON "public"."crisis_reframes" USING btree (
  "crisis_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_crisis_reframes_user" ON "public"."crisis_reframes" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table crisis_reframes
-- ----------------------------
CREATE TRIGGER "crisis_reframes_updated_at" BEFORE UPDATE ON "public"."crisis_reframes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_crisis_reframes_updated_at"();

-- ----------------------------
-- Checks structure for table crisis_reframes
-- ----------------------------
ALTER TABLE "public"."crisis_reframes" ADD CONSTRAINT "crisis_reframes_helpful_rating_check" CHECK (helpful_rating >= 1 AND helpful_rating <= 5);

-- ----------------------------
-- Primary Key structure for table crisis_reframes
-- ----------------------------
ALTER TABLE "public"."crisis_reframes" ADD CONSTRAINT "crisis_reframes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table data_exports
-- ----------------------------
CREATE INDEX "idx_data_exports_expires_at" ON "public"."data_exports" USING btree (
  "expires_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_data_exports_user_id" ON "public"."data_exports" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table data_exports
-- ----------------------------
ALTER TABLE "public"."data_exports" ADD CONSTRAINT "data_exports_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table data_retention_requests
-- ----------------------------
CREATE INDEX "idx_data_retention_requests_user_id" ON "public"."data_retention_requests" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table data_retention_requests
-- ----------------------------
ALTER TABLE "public"."data_retention_requests" ADD CONSTRAINT "data_retention_requests_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table decompression_sessions
-- ----------------------------
CREATE INDEX "idx_decompression_user_date" ON "public"."decompression_sessions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table decompression_sessions
-- ----------------------------
ALTER TABLE "public"."decompression_sessions" ADD CONSTRAINT "decompression_sessions_mood_after_check" CHECK (mood_after >= 1 AND mood_after <= 10);
ALTER TABLE "public"."decompression_sessions" ADD CONSTRAINT "decompression_sessions_mood_before_check" CHECK (mood_before >= 1 AND mood_before <= 10);

-- ----------------------------
-- Primary Key structure for table decompression_sessions
-- ----------------------------
ALTER TABLE "public"."decompression_sessions" ADD CONSTRAINT "decompression_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table detachment_milestones
-- ----------------------------
CREATE INDEX "idx_detachment_milestones_user_date" ON "public"."detachment_milestones" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "milestone_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table detachment_milestones
-- ----------------------------
ALTER TABLE "public"."detachment_milestones" ADD CONSTRAINT "detachment_milestones_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table empathy_audit
-- ----------------------------
CREATE INDEX "idx_empathy_audit_user" ON "public"."empathy_audit" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_empathy_audit_user_date" ON "public"."empathy_audit" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table empathy_audit
-- ----------------------------
ALTER TABLE "public"."empathy_audit" ADD CONSTRAINT "empathy_audit_empathy_target_check" CHECK (empathy_target = ANY (ARRAY['ex_partner'::text, 'children'::text, 'self'::text, 'others'::text]));
ALTER TABLE "public"."empathy_audit" ADD CONSTRAINT "empathy_audit_percentage_check" CHECK (percentage >= 0 AND percentage <= 100);

-- ----------------------------
-- Primary Key structure for table empathy_audit
-- ----------------------------
ALTER TABLE "public"."empathy_audit" ADD CONSTRAINT "empathy_audit_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table empathy_distribution
-- ----------------------------
CREATE INDEX "idx_empathy_distribution_user_date" ON "public"."empathy_distribution" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table empathy_distribution
-- ----------------------------
ALTER TABLE "public"."empathy_distribution" ADD CONSTRAINT "empathy_distribution_percentage_check" CHECK (percentage >= 0 AND percentage <= 100);

-- ----------------------------
-- Primary Key structure for table empathy_distribution
-- ----------------------------
ALTER TABLE "public"."empathy_distribution" ADD CONSTRAINT "empathy_distribution_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table empathy_situations
-- ----------------------------
CREATE INDEX "idx_empathy_situations_user_date" ON "public"."empathy_situations" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table empathy_situations
-- ----------------------------
ALTER TABLE "public"."empathy_situations" ADD CONSTRAINT "empathy_situations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table escalation_patterns
-- ----------------------------
CREATE INDEX "idx_escalation_patterns_user" ON "public"."escalation_patterns" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table escalation_patterns
-- ----------------------------
ALTER TABLE "public"."escalation_patterns" ADD CONSTRAINT "escalation_patterns_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table evidence_files
-- ----------------------------
CREATE INDEX "idx_evidence_files_journal_entry_id" ON "public"."evidence_files" USING btree (
  "journal_entry_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table evidence_files
-- ----------------------------
CREATE TRIGGER "trigger_track_evidence_file_usage" AFTER INSERT ON "public"."evidence_files"
FOR EACH ROW
EXECUTE PROCEDURE "public"."track_evidence_file_usage"();

-- ----------------------------
-- Checks structure for table evidence_files
-- ----------------------------
ALTER TABLE "public"."evidence_files" ADD CONSTRAINT "check_file_type" CHECK (file_type = ANY (ARRAY['image/jpeg'::text, 'image/png'::text, 'image/heic'::text, 'audio/mpeg'::text, 'audio/wav'::text, 'audio/m4a'::text, 'application/pdf'::text, 'text/plain'::text]));
ALTER TABLE "public"."evidence_files" ADD CONSTRAINT "evidence_files_processing_status_check" CHECK (processing_status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text]));

-- ----------------------------
-- Primary Key structure for table evidence_files
-- ----------------------------
ALTER TABLE "public"."evidence_files" ADD CONSTRAINT "evidence_files_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table export_requests
-- ----------------------------
CREATE INDEX "idx_export_requests_created_at" ON "public"."export_requests" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_export_requests_status" ON "public"."export_requests" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_export_requests_user_id" ON "public"."export_requests" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table export_requests
-- ----------------------------
CREATE TRIGGER "trigger_track_export_request_usage" AFTER INSERT ON "public"."export_requests"
FOR EACH ROW
EXECUTE PROCEDURE "public"."track_export_request_usage"();

-- ----------------------------
-- Checks structure for table export_requests
-- ----------------------------
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_export_format_check" CHECK (export_format = ANY (ARRAY['pdf'::text, 'docx'::text, 'json'::text, 'csv'::text]));
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_export_type_check" CHECK (export_type = ANY (ARRAY['journal_pdf'::text, 'evidence_package'::text, 'pattern_report'::text, 'legal_summary'::text, 'therapeutic_report'::text]));
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text]));
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_user_check" CHECK (CHECK (user_id = auth.uid()) NOT VALID);

-- ----------------------------
-- Primary Key structure for table export_requests
-- ----------------------------
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table false_beliefs
-- ----------------------------
CREATE INDEX "idx_false_beliefs_user_status" ON "public"."false_beliefs" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table false_beliefs
-- ----------------------------
CREATE TRIGGER "trigger_log_belief_strength" AFTER INSERT OR UPDATE ON "public"."false_beliefs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."log_belief_strength_change"();

-- ----------------------------
-- Checks structure for table false_beliefs
-- ----------------------------
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_current_strength_check" CHECK (current_strength >= 1 AND current_strength <= 10);
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_initial_strength_check" CHECK (initial_strength >= 1 AND initial_strength <= 10);
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_belief_category_check" CHECK (belief_category = ANY (ARRAY['self_worth'::text, 'dependency'::text, 'reality_doubt'::text, 'responsibility'::text, 'capability'::text]));
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_status_check" CHECK (status = ANY (ARRAY['active'::text, 'resolved'::text]));

-- ----------------------------
-- Primary Key structure for table false_beliefs
-- ----------------------------
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table feature_limits
-- ----------------------------
CREATE INDEX "idx_feature_limits_lookup" ON "public"."feature_limits" USING btree (
  "subscription_tier" "pg_catalog"."enum_ops" ASC NULLS LAST,
  "feature_name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "limit_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table feature_limits
-- ----------------------------
ALTER TABLE "public"."feature_limits" ADD CONSTRAINT "feature_limits_subscription_tier_feature_name_limit_type_key" UNIQUE ("subscription_tier", "feature_name", "limit_type");

-- ----------------------------
-- Checks structure for table feature_limits
-- ----------------------------
ALTER TABLE "public"."feature_limits" ADD CONSTRAINT "feature_limits_limit_type_check" CHECK (limit_type = ANY (ARRAY['monthly_count'::text, 'storage_mb'::text, 'concurrent_sessions'::text, 'minutes'::text]));

-- ----------------------------
-- Primary Key structure for table feature_limits
-- ----------------------------
ALTER TABLE "public"."feature_limits" ADD CONSTRAINT "feature_limits_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table gaslighting_statements
-- ----------------------------
CREATE INDEX "idx_gaslighting_statements_topic" ON "public"."gaslighting_statements" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "topic" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_gaslighting_statements_user_date" ON "public"."gaslighting_statements" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "statement_date" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table gaslighting_statements
-- ----------------------------
ALTER TABLE "public"."gaslighting_statements" ADD CONSTRAINT "gaslighting_statements_gaslighting_severity_check" CHECK (gaslighting_severity >= 1 AND gaslighting_severity <= 10);
ALTER TABLE "public"."gaslighting_statements" ADD CONSTRAINT "gaslighting_statements_impact_on_you_check" CHECK (impact_on_you >= 1 AND impact_on_you <= 10);

-- ----------------------------
-- Primary Key structure for table gaslighting_statements
-- ----------------------------
ALTER TABLE "public"."gaslighting_statements" ADD CONSTRAINT "gaslighting_statements_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table gdpr_consents
-- ----------------------------
CREATE INDEX "idx_gdpr_consents_user_id" ON "public"."gdpr_consents" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table gdpr_consents
-- ----------------------------
ALTER TABLE "public"."gdpr_consents" ADD CONSTRAINT "gdpr_consents_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table gr_user_achievements
-- ----------------------------
ALTER TABLE "public"."gr_user_achievements" ADD CONSTRAINT "gr_user_achievements_pkey" PRIMARY KEY ("user_id", "key");

-- ----------------------------
-- Primary Key structure for table gr_user_pack_stats
-- ----------------------------
ALTER TABLE "public"."gr_user_pack_stats" ADD CONSTRAINT "gr_user_pack_stats_pkey" PRIMARY KEY ("user_id", "pack");

-- ----------------------------
-- Primary Key structure for table gr_user_streaks
-- ----------------------------
ALTER TABLE "public"."gr_user_streaks" ADD CONSTRAINT "gr_user_streaks_pkey" PRIMARY KEY ("user_id");

-- ----------------------------
-- Indexes structure for table gratitude_streaks
-- ----------------------------
CREATE INDEX "idx_gratitude_streaks_user_id" ON "public"."gratitude_streaks" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table gratitude_streaks
-- ----------------------------
ALTER TABLE "public"."gratitude_streaks" ADD CONSTRAINT "gratitude_streaks_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table grey_rock_attempts
-- ----------------------------
CREATE INDEX "idx_gr_attempts_session" ON "public"."grey_rock_attempts" USING btree (
  "session_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_gr_attempts_user" ON "public"."grey_rock_attempts" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table grey_rock_attempts
-- ----------------------------
ALTER TABLE "public"."grey_rock_attempts" ADD CONSTRAINT "grey_rock_attempts_difficulty_check" CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]));

-- ----------------------------
-- Primary Key structure for table grey_rock_attempts
-- ----------------------------
ALTER TABLE "public"."grey_rock_attempts" ADD CONSTRAINT "grey_rock_attempts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table grey_rock_scenarios
-- ----------------------------
CREATE INDEX "idx_gr_scenarios_active" ON "public"."grey_rock_scenarios" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_active = true;
CREATE INDEX "idx_gr_scenarios_difficulty" ON "public"."grey_rock_scenarios" USING btree (
  "difficulty" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_gr_scenarios_pack" ON "public"."grey_rock_scenarios" USING btree (
  "pack" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_gr_scenarios_tier" ON "public"."grey_rock_scenarios" USING btree (
  "min_tier" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table grey_rock_scenarios
-- ----------------------------
CREATE TRIGGER "set_updated_at_on_gr_scenarios" BEFORE UPDATE ON "public"."grey_rock_scenarios"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_updated_at"();

-- ----------------------------
-- Checks structure for table grey_rock_scenarios
-- ----------------------------
ALTER TABLE "public"."grey_rock_scenarios" ADD CONSTRAINT "grey_rock_scenarios_difficulty_check" CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]));
ALTER TABLE "public"."grey_rock_scenarios" ADD CONSTRAINT "grey_rock_scenarios_min_tier_check" CHECK (min_tier = ANY (ARRAY['foundation'::text, 'recovery'::text, 'empowerment'::text]));
ALTER TABLE "public"."grey_rock_scenarios" ADD CONSTRAINT "grey_rock_scenarios_pack_check" CHECK (pack = ANY (ARRAY['Basics'::text, 'Boundaries'::text, 'High-Conflict'::text]));

-- ----------------------------
-- Primary Key structure for table grey_rock_scenarios
-- ----------------------------
ALTER TABLE "public"."grey_rock_scenarios" ADD CONSTRAINT "grey_rock_scenarios_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table grey_rock_sessions
-- ----------------------------
CREATE INDEX "idx_gr_sessions_user" ON "public"."grey_rock_sessions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "started_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table grey_rock_sessions
-- ----------------------------
ALTER TABLE "public"."grey_rock_sessions" ADD CONSTRAINT "grey_rock_sessions_mode_check" CHECK (mode = ANY (ARRAY['learn'::text, 'practice'::text]));

-- ----------------------------
-- Primary Key structure for table grey_rock_sessions
-- ----------------------------
ALTER TABLE "public"."grey_rock_sessions" ADD CONSTRAINT "grey_rock_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table grey_rock_templates
-- ----------------------------
ALTER TABLE "public"."grey_rock_templates" ADD CONSTRAINT "grey_rock_templates_tone_check" CHECK (tone = ANY (ARRAY['neutral'::text, 'brief'::text, 'formal'::text, 'redirect'::text]));

-- ----------------------------
-- Primary Key structure for table grey_rock_templates
-- ----------------------------
ALTER TABLE "public"."grey_rock_templates" ADD CONSTRAINT "grey_rock_templates_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table habit_completions
-- ----------------------------
CREATE INDEX "idx_habit_completions_user_date" ON "public"."habit_completions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "completion_date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table habit_completions
-- ----------------------------
ALTER TABLE "public"."habit_completions" ADD CONSTRAINT "habit_completions_habit_id_completion_date_key" UNIQUE ("habit_id", "completion_date");

-- ----------------------------
-- Primary Key structure for table habit_completions
-- ----------------------------
ALTER TABLE "public"."habit_completions" ADD CONSTRAINT "habit_completions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table healing_resources
-- ----------------------------
CREATE INDEX "idx_healing_resources_user_id" ON "public"."healing_resources" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table healing_resources
-- ----------------------------
ALTER TABLE "public"."healing_resources" ADD CONSTRAINT "healing_resources_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table journal_entries
-- ----------------------------
CREATE INDEX "idx_journal_entries_deleted_at" ON "public"."journal_entries" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_incident_date" ON "public"."journal_entries" USING btree (
  "incident_date" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_is_draft" ON "public"."journal_entries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_draft" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_is_evidence" ON "public"."journal_entries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_evidence" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_mood_rating" ON "public"."journal_entries" USING btree (
  "mood_rating" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_npd_traits" ON "public"."journal_entries" USING gin (
  "npd_traits_identified" "pg_catalog"."array_ops"
);
CREATE INDEX "idx_journal_entries_trigger_level" ON "public"."journal_entries" USING btree (
  "trigger_level" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_journal_entries_user_id" ON "public"."journal_entries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table journal_entries
-- ----------------------------
CREATE TRIGGER "trigger_track_journal_entry_usage" AFTER INSERT ON "public"."journal_entries"
FOR EACH ROW
EXECUTE PROCEDURE "public"."track_journal_entry_usage"();

-- ----------------------------
-- Checks structure for table journal_entries
-- ----------------------------
ALTER TABLE "public"."journal_entries" ADD CONSTRAINT "journal_entries_mood_rating_check" CHECK (mood_rating >= 1 AND mood_rating <= 10);
ALTER TABLE "public"."journal_entries" ADD CONSTRAINT "journal_entries_trigger_level_check" CHECK (trigger_level >= 1 AND trigger_level <= 5);

-- ----------------------------
-- Primary Key structure for table journal_entries
-- ----------------------------
ALTER TABLE "public"."journal_entries" ADD CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table legal_referral_analytics
-- ----------------------------
CREATE INDEX "legal_referral_analytics_date_idx" ON "public"."legal_referral_analytics" USING btree (
  "date" "pg_catalog"."date_ops" DESC NULLS FIRST
);
CREATE INDEX "legal_referral_analytics_specialty_idx" ON "public"."legal_referral_analytics" USING btree (
  "legal_specialty" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table legal_referral_analytics
-- ----------------------------
ALTER TABLE "public"."legal_referral_analytics" ADD CONSTRAINT "legal_referral_analytics_date_referral_source_platform_lega_key" UNIQUE ("date", "referral_source", "platform", "legal_specialty");

-- ----------------------------
-- Primary Key structure for table legal_referral_analytics
-- ----------------------------
ALTER TABLE "public"."legal_referral_analytics" ADD CONSTRAINT "legal_referral_analytics_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table legal_referral_platforms
-- ----------------------------
ALTER TABLE "public"."legal_referral_platforms" ADD CONSTRAINT "legal_referral_platforms_platform_name_key" UNIQUE ("platform_name");

-- ----------------------------
-- Primary Key structure for table legal_referral_platforms
-- ----------------------------
ALTER TABLE "public"."legal_referral_platforms" ADD CONSTRAINT "legal_referral_platforms_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table letting_go_affirmations
-- ----------------------------
ALTER TABLE "public"."letting_go_affirmations" ADD CONSTRAINT "letting_go_affirmations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table letting_go_entries
-- ----------------------------
CREATE INDEX "idx_letting_go_entries_user_date" ON "public"."letting_go_entries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "entry_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table letting_go_entries
-- ----------------------------
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_user_id_entry_date_key" UNIQUE ("user_id", "entry_date");

-- ----------------------------
-- Checks structure for table letting_go_entries
-- ----------------------------
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_hope_for_change_check" CHECK (hope_for_change >= 1 AND hope_for_change <= 10);
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_mental_space_check" CHECK (mental_space >= 1 AND mental_space <= 10);
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_need_for_validation_check" CHECK (need_for_validation >= 1 AND need_for_validation <= 10);
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_boundary_strength_check" CHECK (boundary_strength >= 1 AND boundary_strength <= 10);
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_emotional_reactivity_check" CHECK (emotional_reactivity >= 1 AND emotional_reactivity <= 10);

-- ----------------------------
-- Primary Key structure for table letting_go_entries
-- ----------------------------
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table manipulation_analysis
-- ----------------------------
CREATE INDEX "idx_manipulation_analysis_created_at" ON "public"."manipulation_analysis" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_manipulation_analysis_user" ON "public"."manipulation_analysis" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table manipulation_analysis
-- ----------------------------
CREATE TRIGGER "update_manipulation_analysis_updated_at" BEFORE UPDATE ON "public"."manipulation_analysis"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_manipulation_analysis_updated_at"();

-- ----------------------------
-- Checks structure for table manipulation_analysis
-- ----------------------------
ALTER TABLE "public"."manipulation_analysis" ADD CONSTRAINT "manipulation_analysis_emotional_impact_check" CHECK (emotional_impact = ANY (ARRAY['none'::text, 'mild'::text, 'moderate'::text, 'severe'::text]));

-- ----------------------------
-- Primary Key structure for table manipulation_analysis
-- ----------------------------
ALTER TABLE "public"."manipulation_analysis" ADD CONSTRAINT "manipulation_analysis_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table mental_pause_sessions
-- ----------------------------
CREATE INDEX "idx_mental_pause_user_date" ON "public"."mental_pause_sessions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table mental_pause_sessions
-- ----------------------------
ALTER TABLE "public"."mental_pause_sessions" ADD CONSTRAINT "mental_pause_sessions_mood_before_check" CHECK (mood_before >= 1 AND mood_before <= 10);

-- ----------------------------
-- Primary Key structure for table mental_pause_sessions
-- ----------------------------
ALTER TABLE "public"."mental_pause_sessions" ADD CONSTRAINT "mental_pause_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table mind_reset_sessions
-- ----------------------------
CREATE INDEX "idx_mind_reset_sessions_created_at" ON "public"."mind_reset_sessions" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_mind_reset_sessions_type" ON "public"."mind_reset_sessions" USING btree (
  "session_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_mind_reset_sessions_user_id" ON "public"."mind_reset_sessions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table mind_reset_sessions
-- ----------------------------
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_mood_after_check" CHECK (mood_after >= 1 AND mood_after <= 10);
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_mood_before_check" CHECK (mood_before >= 1 AND mood_before <= 10);
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_effectiveness_rating_check" CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5);
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_session_type_check" CHECK (session_type = ANY (ARRAY['thought_reframe'::text, 'breathing_exercise'::text, 'grounding_technique'::text, 'affirmation'::text]));
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_user_check" CHECK (CHECK (user_id = auth.uid()) NOT VALID);

-- ----------------------------
-- Primary Key structure for table mind_reset_sessions
-- ----------------------------
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table mood_check_ins
-- ----------------------------
CREATE INDEX "idx_mood_check_ins_created_at" ON "public"."mood_check_ins" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_mood_check_ins_user_id" ON "public"."mood_check_ins" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table mood_check_ins
-- ----------------------------
ALTER TABLE "public"."mood_check_ins" ADD CONSTRAINT "mood_check_ins_anxiety_level_check" CHECK (anxiety_level >= 1 AND anxiety_level <= 10);
ALTER TABLE "public"."mood_check_ins" ADD CONSTRAINT "mood_check_ins_energy_level_check" CHECK (energy_level >= 1 AND energy_level <= 10);
ALTER TABLE "public"."mood_check_ins" ADD CONSTRAINT "mood_check_ins_mood_rating_check" CHECK (mood_rating >= 1 AND mood_rating <= 10);

-- ----------------------------
-- Primary Key structure for table mood_check_ins
-- ----------------------------
ALTER TABLE "public"."mood_check_ins" ADD CONSTRAINT "mood_check_ins_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table morning_intentions
-- ----------------------------
CREATE INDEX "idx_morning_intentions_user_date" ON "public"."morning_intentions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table morning_intentions
-- ----------------------------
ALTER TABLE "public"."morning_intentions" ADD CONSTRAINT "morning_intentions_user_id_date_key" UNIQUE ("user_id", "date");

-- ----------------------------
-- Primary Key structure for table morning_intentions
-- ----------------------------
ALTER TABLE "public"."morning_intentions" ADD CONSTRAINT "morning_intentions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table narcissist_analyses
-- ----------------------------
CREATE INDEX "idx_narcissist_analyses_created_at" ON "public"."narcissist_analyses" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_narcissist_analyses_input_type" ON "public"."narcissist_analyses" USING btree (
  "input_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_narcissist_analyses_user_id" ON "public"."narcissist_analyses" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table narcissist_analyses
-- ----------------------------
CREATE TRIGGER "update_narcissist_analyses_updated_at" BEFORE UPDATE ON "public"."narcissist_analyses"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_narcissist_analyses_updated_at"();

-- ----------------------------
-- Checks structure for table narcissist_analyses
-- ----------------------------
ALTER TABLE "public"."narcissist_analyses" ADD CONSTRAINT "narcissist_analyses_severity_score_check" CHECK (severity_score >= 1 AND severity_score <= 10);

-- ----------------------------
-- Primary Key structure for table narcissist_analyses
-- ----------------------------
ALTER TABLE "public"."narcissist_analyses" ADD CONSTRAINT "narcissist_analyses_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table narcissist_simulator_sessions
-- ----------------------------
CREATE INDEX "idx_simulator_sessions_created_at" ON "public"."narcissist_simulator_sessions" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_simulator_sessions_status" ON "public"."narcissist_simulator_sessions" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_simulator_sessions_user_id" ON "public"."narcissist_simulator_sessions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table narcissist_simulator_sessions
-- ----------------------------
CREATE TRIGGER "update_simulator_sessions_updated_at" BEFORE UPDATE ON "public"."narcissist_simulator_sessions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_simulator_sessions_updated_at"();

-- ----------------------------
-- Checks structure for table narcissist_simulator_sessions
-- ----------------------------
ALTER TABLE "public"."narcissist_simulator_sessions" ADD CONSTRAINT "narcissist_simulator_sessions_narcissist_type_check" CHECK (narcissist_type = ANY (ARRAY['overt'::text, 'covert'::text, 'malignant'::text]));
ALTER TABLE "public"."narcissist_simulator_sessions" ADD CONSTRAINT "narcissist_simulator_sessions_scenario_check" CHECK (scenario = ANY (ARRAY['custody'::text, 'text'::text, 'email'::text, 'boundary'::text]));
ALTER TABLE "public"."narcissist_simulator_sessions" ADD CONSTRAINT "narcissist_simulator_sessions_status_check" CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'abandoned'::text]));

-- ----------------------------
-- Primary Key structure for table narcissist_simulator_sessions
-- ----------------------------
ALTER TABLE "public"."narcissist_simulator_sessions" ADD CONSTRAINT "narcissist_simulator_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table no_contact_milestones
-- ----------------------------
CREATE INDEX "idx_no_contact_milestones_user_id" ON "public"."no_contact_milestones" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "achieved_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table no_contact_milestones
-- ----------------------------
ALTER TABLE "public"."no_contact_milestones" ADD CONSTRAINT "no_contact_milestones_user_id_milestone_days_key" UNIQUE ("user_id", "milestone_days");

-- ----------------------------
-- Primary Key structure for table no_contact_milestones
-- ----------------------------
ALTER TABLE "public"."no_contact_milestones" ADD CONSTRAINT "no_contact_milestones_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table no_contact_settings
-- ----------------------------
CREATE INDEX "idx_no_contact_settings_user_id" ON "public"."no_contact_settings" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table no_contact_settings
-- ----------------------------
ALTER TABLE "public"."no_contact_settings" ADD CONSTRAINT "no_contact_settings_user_id_key" UNIQUE ("user_id");

-- ----------------------------
-- Primary Key structure for table no_contact_settings
-- ----------------------------
ALTER TABLE "public"."no_contact_settings" ADD CONSTRAINT "no_contact_settings_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table npd_traits
-- ----------------------------
ALTER TABLE "public"."npd_traits" ADD CONSTRAINT "npd_traits_category_check" CHECK (category = ANY (ARRAY['covert'::text, 'overt'::text, 'both'::text]));
ALTER TABLE "public"."npd_traits" ADD CONSTRAINT "npd_traits_severity_check" CHECK (severity = ANY (ARRAY['mild'::text, 'moderate'::text, 'severe'::text]));

-- ----------------------------
-- Primary Key structure for table npd_traits
-- ----------------------------
ALTER TABLE "public"."npd_traits" ADD CONSTRAINT "npd_traits_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table origin_memories
-- ----------------------------
CREATE INDEX "idx_origin_memories_belief" ON "public"."origin_memories" USING btree (
  "belief_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table origin_memories
-- ----------------------------
ALTER TABLE "public"."origin_memories" ADD CONSTRAINT "origin_memories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table pattern_alerts
-- ----------------------------
CREATE INDEX "idx_pattern_alerts_type" ON "public"."pattern_alerts" USING btree (
  "alert_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_pattern_alerts_user_id" ON "public"."pattern_alerts" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table pattern_alerts
-- ----------------------------
ALTER TABLE "public"."pattern_alerts" ADD CONSTRAINT "pattern_alerts_alert_type_check" CHECK (alert_type = ANY (ARRAY['repeated_trait'::text, 'escalation_pattern'::text, 'cycle_detected'::text, 'safety_concern'::text]));

-- ----------------------------
-- Primary Key structure for table pattern_alerts
-- ----------------------------
ALTER TABLE "public"."pattern_alerts" ADD CONSTRAINT "pattern_alerts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table pattern_analysis
-- ----------------------------
CREATE INDEX "idx_pattern_analysis_period" ON "public"."pattern_analysis" USING btree (
  "analysis_period_start" "pg_catalog"."timestamptz_ops" ASC NULLS LAST,
  "analysis_period_end" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_pattern_analysis_type" ON "public"."pattern_analysis" USING btree (
  "analysis_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_pattern_analysis_user_id" ON "public"."pattern_analysis" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table pattern_analysis
-- ----------------------------
CREATE TRIGGER "trigger_track_pattern_analysis_usage" AFTER INSERT ON "public"."pattern_analysis"
FOR EACH ROW
EXECUTE PROCEDURE "public"."track_pattern_analysis_usage"();

-- ----------------------------
-- Checks structure for table pattern_analysis
-- ----------------------------
ALTER TABLE "public"."pattern_analysis" ADD CONSTRAINT "pattern_analysis_analysis_type_check" CHECK (analysis_type = ANY (ARRAY['abuse_patterns'::text, 'time_patterns'::text, 'emotional_trends'::text, 'escalation_indicators'::text]));
ALTER TABLE "public"."pattern_analysis" ADD CONSTRAINT "pattern_analysis_user_check" CHECK (CHECK (user_id = auth.uid()) NOT VALID);

-- ----------------------------
-- Primary Key structure for table pattern_analysis
-- ----------------------------
ALTER TABLE "public"."pattern_analysis" ADD CONSTRAINT "pattern_analysis_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table pattern_detections
-- ----------------------------
CREATE INDEX "idx_pattern_detections_unack" ON "public"."pattern_detections" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_acknowledged" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_acknowledged = false;
CREATE INDEX "idx_pattern_detections_user" ON "public"."pattern_detections" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table pattern_detections
-- ----------------------------
ALTER TABLE "public"."pattern_detections" ADD CONSTRAINT "pattern_detections_detection_type_check" CHECK (detection_type = ANY (ARRAY['escalation_risk'::text, 'cycle_phase'::text, 'trait_cluster'::text, 'safety_concern'::text]));
ALTER TABLE "public"."pattern_detections" ADD CONSTRAINT "pattern_detections_risk_level_check" CHECK (risk_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));

-- ----------------------------
-- Primary Key structure for table pattern_detections
-- ----------------------------
ALTER TABLE "public"."pattern_detections" ADD CONSTRAINT "pattern_detections_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table payments
-- ----------------------------
CREATE INDEX "idx_payments_created_at" ON "public"."payments" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_payments_status" ON "public"."payments" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_payments_stripe_payment_id" ON "public"."payments" USING btree (
  "stripe_payment_id" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_payments_user_id" ON "public"."payments" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table payments
-- ----------------------------
CREATE TRIGGER "update_payments_updated_at" BEFORE UPDATE ON "public"."payments"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Uniques structure for table payments
-- ----------------------------
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_stripe_payment_id_key" UNIQUE ("stripe_payment_id");

-- ----------------------------
-- Checks structure for table payments
-- ----------------------------
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'succeeded'::text, 'failed'::text, 'canceled'::text, 'refunded'::text]));

-- ----------------------------
-- Primary Key structure for table payments
-- ----------------------------
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table positive_moments
-- ----------------------------
CREATE INDEX "idx_positive_moments_daily_gratitude" ON "public"."positive_moments" USING btree (
  "is_daily_gratitude" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "idx_positive_moments_entry_type" ON "public"."positive_moments" USING btree (
  "entry_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_positive_moments_gratitude_category" ON "public"."positive_moments" USING btree (
  "gratitude_category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_positive_moments_user_date" ON "public"."positive_moments" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "moment_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Triggers structure for table positive_moments
-- ----------------------------
CREATE TRIGGER "update_gratitude_streak_trigger" AFTER INSERT ON "public"."positive_moments"
FOR EACH ROW
EXECUTE PROCEDURE "public"."trigger_update_gratitude_streak"();

-- ----------------------------
-- Checks structure for table positive_moments
-- ----------------------------
ALTER TABLE "public"."positive_moments" ADD CONSTRAINT "positive_moments_entry_type_check" CHECK (entry_type::text = ANY (ARRAY['moment'::character varying, 'gratitude'::character varying, 'both'::character varying]::text[]));
ALTER TABLE "public"."positive_moments" ADD CONSTRAINT "positive_moments_mood_rating_check" CHECK (mood_rating >= 1 AND mood_rating <= 10);

-- ----------------------------
-- Primary Key structure for table positive_moments
-- ----------------------------
ALTER TABLE "public"."positive_moments" ADD CONSTRAINT "positive_moments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table profiles
-- ----------------------------
CREATE INDEX "idx_profiles_deleted_at" ON "public"."profiles" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

-- ----------------------------
-- Checks structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_abuser_gender_check" CHECK (abuser_gender::text = ANY (ARRAY['male'::character varying, 'female'::character varying, 'non-binary'::character varying, 'prefer-not-to-say'::character varying]::text[]));

-- ----------------------------
-- Primary Key structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table reactive_abuse_incidents
-- ----------------------------
CREATE INDEX "idx_reactive_abuse_incidents_user_date" ON "public"."reactive_abuse_incidents" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "incident_date" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Primary Key structure for table reactive_abuse_incidents
-- ----------------------------
ALTER TABLE "public"."reactive_abuse_incidents" ADD CONSTRAINT "reactive_abuse_incidents_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table reactive_abuse_patterns
-- ----------------------------
CREATE INDEX "idx_reactive_abuse_patterns_user_date" ON "public"."reactive_abuse_patterns" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "pattern_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table reactive_abuse_patterns
-- ----------------------------
ALTER TABLE "public"."reactive_abuse_patterns" ADD CONSTRAINT "reactive_abuse_patterns_user_id_pattern_date_key" UNIQUE ("user_id", "pattern_date");

-- ----------------------------
-- Primary Key structure for table reactive_abuse_patterns
-- ----------------------------
ALTER TABLE "public"."reactive_abuse_patterns" ADD CONSTRAINT "reactive_abuse_patterns_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table reality_log_entries
-- ----------------------------
CREATE INDEX "idx_reality_log_user_date" ON "public"."reality_log_entries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table reality_log_entries
-- ----------------------------
ALTER TABLE "public"."reality_log_entries" ADD CONSTRAINT "reality_log_entries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table reality_testing_sessions
-- ----------------------------
CREATE INDEX "idx_reality_testing_belief" ON "public"."reality_testing_sessions" USING btree (
  "belief_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table reality_testing_sessions
-- ----------------------------
ALTER TABLE "public"."reality_testing_sessions" ADD CONSTRAINT "reality_testing_sessions_strength_after_check" CHECK (strength_after >= 1 AND strength_after <= 10);
ALTER TABLE "public"."reality_testing_sessions" ADD CONSTRAINT "reality_testing_sessions_strength_before_check" CHECK (strength_before >= 1 AND strength_before <= 10);

-- ----------------------------
-- Primary Key structure for table reality_testing_sessions
-- ----------------------------
ALTER TABLE "public"."reality_testing_sessions" ADD CONSTRAINT "reality_testing_sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table recovery_lessons
-- ----------------------------
ALTER TABLE "public"."recovery_lessons" ADD CONSTRAINT "recovery_lessons_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table redeem_codes
-- ----------------------------
CREATE INDEX "idx_redeem_codes_active" ON "public"."redeem_codes" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_active = true;
CREATE INDEX "idx_redeem_codes_campaign" ON "public"."redeem_codes" USING btree (
  "campaign_name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_redeem_codes_code" ON "public"."redeem_codes" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table redeem_codes
-- ----------------------------
ALTER TABLE "public"."redeem_codes" ADD CONSTRAINT "redeem_codes_code_key" UNIQUE ("code");

-- ----------------------------
-- Checks structure for table redeem_codes
-- ----------------------------
ALTER TABLE "public"."redeem_codes" ADD CONSTRAINT "redeem_codes_code_type_check" CHECK (code_type = ANY (ARRAY['trial'::text, 'discount'::text, 'upgrade'::text]));

-- ----------------------------
-- Primary Key structure for table redeem_codes
-- ----------------------------
ALTER TABLE "public"."redeem_codes" ADD CONSTRAINT "redeem_codes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table referral_analytics
-- ----------------------------
CREATE INDEX "referral_analytics_date_idx" ON "public"."referral_analytics" USING btree (
  "date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table referral_analytics
-- ----------------------------
ALTER TABLE "public"."referral_analytics" ADD CONSTRAINT "referral_analytics_date_referral_source_platform_key" UNIQUE ("date", "referral_source", "platform");

-- ----------------------------
-- Primary Key structure for table referral_analytics
-- ----------------------------
ALTER TABLE "public"."referral_analytics" ADD CONSTRAINT "referral_analytics_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table relationship_assessments
-- ----------------------------
CREATE INDEX "idx_relationship_assessments_created_at" ON "public"."relationship_assessments" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_relationship_assessments_risk_level" ON "public"."relationship_assessments" USING btree (
  "risk_level" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_relationship_assessments_user_id" ON "public"."relationship_assessments" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table relationship_assessments
-- ----------------------------
CREATE TRIGGER "update_relationship_assessments_updated_at" BEFORE UPDATE ON "public"."relationship_assessments"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_relationship_assessments_updated_at"();

-- ----------------------------
-- Checks structure for table relationship_assessments
-- ----------------------------
ALTER TABLE "public"."relationship_assessments" ADD CONSTRAINT "relationship_assessments_overall_score_check" CHECK (overall_score >= 0 AND overall_score <= 100);
ALTER TABLE "public"."relationship_assessments" ADD CONSTRAINT "relationship_assessments_risk_level_check" CHECK (risk_level = ANY (ARRAY['low'::text, 'moderate'::text, 'high'::text]));

-- ----------------------------
-- Primary Key structure for table relationship_assessments
-- ----------------------------
ALTER TABLE "public"."relationship_assessments" ADD CONSTRAINT "relationship_assessments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table role_boundaries
-- ----------------------------
CREATE INDEX "idx_role_boundaries_user" ON "public"."role_boundaries" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table role_boundaries
-- ----------------------------
ALTER TABLE "public"."role_boundaries" ADD CONSTRAINT "role_boundaries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table routine_streaks
-- ----------------------------
ALTER TABLE "public"."routine_streaks" ADD CONSTRAINT "routine_streaks_user_id_routine_type_key" UNIQUE ("user_id", "routine_type");

-- ----------------------------
-- Primary Key structure for table routine_streaks
-- ----------------------------
ALTER TABLE "public"."routine_streaks" ADD CONSTRAINT "routine_streaks_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table safety_plans
-- ----------------------------
ALTER TABLE "public"."safety_plans" ADD CONSTRAINT "safety_plans_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table security_logs
-- ----------------------------
CREATE INDEX "idx_security_logs_created_at" ON "public"."security_logs" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_security_logs_event_type" ON "public"."security_logs" USING btree (
  "event_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table security_logs
-- ----------------------------
ALTER TABLE "public"."security_logs" ADD CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table social_media_links
-- ----------------------------
ALTER TABLE "public"."social_media_links" ADD CONSTRAINT "social_media_links_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table statement_contradictions
-- ----------------------------
CREATE INDEX "idx_contradictions_user" ON "public"."statement_contradictions" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "detected_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table statement_contradictions
-- ----------------------------
ALTER TABLE "public"."statement_contradictions" ADD CONSTRAINT "statement_contradictions_statement_1_id_statement_2_id_key" UNIQUE ("statement_1_id", "statement_2_id");

-- ----------------------------
-- Primary Key structure for table statement_contradictions
-- ----------------------------
ALTER TABLE "public"."statement_contradictions" ADD CONSTRAINT "statement_contradictions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table stonewalling_incidents
-- ----------------------------
CREATE INDEX "idx_stonewalling_incidents_user_date" ON "public"."stonewalling_incidents" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "incident_date" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table stonewalling_incidents
-- ----------------------------
ALTER TABLE "public"."stonewalling_incidents" ADD CONSTRAINT "stonewalling_incidents_emotional_state_after_check" CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10);
ALTER TABLE "public"."stonewalling_incidents" ADD CONSTRAINT "stonewalling_incidents_emotional_state_before_check" CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10);
ALTER TABLE "public"."stonewalling_incidents" ADD CONSTRAINT "stonewalling_incidents_impact_level_check" CHECK (impact_level >= 1 AND impact_level <= 10);

-- ----------------------------
-- Primary Key structure for table stonewalling_incidents
-- ----------------------------
ALTER TABLE "public"."stonewalling_incidents" ADD CONSTRAINT "stonewalling_incidents_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table stonewalling_patterns
-- ----------------------------
CREATE INDEX "idx_stonewalling_patterns_user_date" ON "public"."stonewalling_patterns" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "pattern_date" "pg_catalog"."date_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Uniques structure for table stonewalling_patterns
-- ----------------------------
ALTER TABLE "public"."stonewalling_patterns" ADD CONSTRAINT "stonewalling_patterns_user_id_pattern_date_key" UNIQUE ("user_id", "pattern_date");

-- ----------------------------
-- Primary Key structure for table stonewalling_patterns
-- ----------------------------
ALTER TABLE "public"."stonewalling_patterns" ADD CONSTRAINT "stonewalling_patterns_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table stonewalling_responses
-- ----------------------------
CREATE INDEX "idx_stonewalling_responses_incident" ON "public"."stonewalling_responses" USING btree (
  "incident_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table stonewalling_responses
-- ----------------------------
ALTER TABLE "public"."stonewalling_responses" ADD CONSTRAINT "stonewalling_responses_outcome_check" CHECK (outcome::text = ANY (ARRAY['worked'::character varying, 'partially_worked'::character varying, 'didnt_work'::character varying]::text[]));

-- ----------------------------
-- Primary Key structure for table stonewalling_responses
-- ----------------------------
ALTER TABLE "public"."stonewalling_responses" ADD CONSTRAINT "stonewalling_responses_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table subscription_plans
-- ----------------------------
CREATE INDEX "idx_subscription_plans_active" ON "public"."subscription_plans" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "idx_subscription_plans_tier" ON "public"."subscription_plans" USING btree (
  "plan_tier" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table subscription_plans
-- ----------------------------
ALTER TABLE "public"."subscription_plans" ADD CONSTRAINT "subscription_plans_plan_name_key" UNIQUE ("plan_name");
ALTER TABLE "public"."subscription_plans" ADD CONSTRAINT "subscription_plans_plan_tier_key" UNIQUE ("plan_tier");

-- ----------------------------
-- Primary Key structure for table subscription_plans
-- ----------------------------
ALTER TABLE "public"."subscription_plans" ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table therapy_referrals
-- ----------------------------
CREATE INDEX "therapy_referrals_converted_idx" ON "public"."therapy_referrals" USING btree (
  "converted" "pg_catalog"."bool_ops" ASC NULLS LAST,
  "conversion_date" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "therapy_referrals_platform_idx" ON "public"."therapy_referrals" USING btree (
  "platform" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "therapy_referrals_source_idx" ON "public"."therapy_referrals" USING btree (
  "referral_source" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "therapy_referrals_user_idx" ON "public"."therapy_referrals" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table therapy_referrals
-- ----------------------------
CREATE TRIGGER "legal_referral_analytics_trigger" AFTER INSERT OR UPDATE ON "public"."therapy_referrals"
FOR EACH ROW
WHEN ((new.referral_type = 'legal'::text))
EXECUTE PROCEDURE "public"."update_legal_referral_analytics"();
CREATE TRIGGER "referral_analytics_trigger" AFTER INSERT OR UPDATE ON "public"."therapy_referrals"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_referral_analytics"();

-- ----------------------------
-- Checks structure for table therapy_referrals
-- ----------------------------
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_commission_status_check" CHECK (commission_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'paid'::text, 'cancelled'::text]));
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_platform_check" CHECK (platform = ANY (ARRAY['betterhelp'::text, 'talkspace'::text, 'psychology_today'::text, 'cerebral'::text, 'mdlive'::text]));
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_referral_source_check" CHECK (referral_source = ANY (ARRAY['safety_plan'::text, 'manipulation_detected'::text, 'dashboard'::text, 'crisis'::text, 'ai_chat'::text]));
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_referral_type_check" CHECK (referral_type = ANY (ARRAY['therapy'::text, 'legal'::text]));

-- ----------------------------
-- Primary Key structure for table therapy_referrals
-- ----------------------------
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table toxic_memories
-- ----------------------------
CREATE INDEX "idx_toxic_memories_beliefs" ON "public"."toxic_memories" USING gin (
  "linked_belief_ids" "pg_catalog"."array_ops"
);
CREATE INDEX "idx_toxic_memories_date" ON "public"."toxic_memories" USING btree (
  "memory_date" "pg_catalog"."date_ops" ASC NULLS LAST
);
CREATE INDEX "idx_toxic_memories_user" ON "public"."toxic_memories" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table toxic_memories
-- ----------------------------
ALTER TABLE "public"."toxic_memories" ADD CONSTRAINT "toxic_memories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table trait_combinations
-- ----------------------------
CREATE INDEX "idx_trait_combinations_user" ON "public"."trait_combinations" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table trait_combinations
-- ----------------------------
ALTER TABLE "public"."trait_combinations" ADD CONSTRAINT "trait_combinations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table trait_frequency_tracking
-- ----------------------------
CREATE INDEX "idx_trait_frequency_date" ON "public"."trait_frequency_tracking" USING btree (
  "occurrence_date" "pg_catalog"."date_ops" ASC NULLS LAST
);
CREATE INDEX "idx_trait_frequency_user_trait" ON "public"."trait_frequency_tracking" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "trait_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table trait_frequency_tracking
-- ----------------------------
ALTER TABLE "public"."trait_frequency_tracking" ADD CONSTRAINT "trait_frequency_tracking_intensity_level_check" CHECK (intensity_level >= 1 AND intensity_level <= 5);

-- ----------------------------
-- Primary Key structure for table trait_frequency_tracking
-- ----------------------------
ALTER TABLE "public"."trait_frequency_tracking" ADD CONSTRAINT "trait_frequency_tracking_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table trigger_calendar
-- ----------------------------
CREATE INDEX "idx_trigger_calendar_active" ON "public"."trigger_calendar" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_active = true;
CREATE INDEX "idx_trigger_calendar_user" ON "public"."trigger_calendar" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table trigger_calendar
-- ----------------------------
ALTER TABLE "public"."trigger_calendar" ADD CONSTRAINT "trigger_calendar_risk_level_check" CHECK (risk_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));
ALTER TABLE "public"."trigger_calendar" ADD CONSTRAINT "trigger_calendar_trigger_type_check" CHECK (trigger_type = ANY (ARRAY['date_anniversary'::text, 'time_pattern'::text, 'seasonal'::text, 'event_based'::text]));

-- ----------------------------
-- Primary Key structure for table trigger_calendar
-- ----------------------------
ALTER TABLE "public"."trigger_calendar" ADD CONSTRAINT "trigger_calendar_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table truth_timeline
-- ----------------------------
CREATE INDEX "idx_truth_timeline_user_date" ON "public"."truth_timeline" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "event_date" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table truth_timeline
-- ----------------------------
ALTER TABLE "public"."truth_timeline" ADD CONSTRAINT "truth_timeline_confabulation_score_check" CHECK (confabulation_score >= 1 AND confabulation_score <= 10);

-- ----------------------------
-- Primary Key structure for table truth_timeline
-- ----------------------------
ALTER TABLE "public"."truth_timeline" ADD CONSTRAINT "truth_timeline_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table usage_tracking
-- ----------------------------
CREATE INDEX "idx_usage_tracking_feature" ON "public"."usage_tracking" USING btree (
  "feature_name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_usage_tracking_period" ON "public"."usage_tracking" USING btree (
  "billing_period_start" "pg_catalog"."date_ops" ASC NULLS LAST,
  "billing_period_end" "pg_catalog"."date_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "idx_usage_tracking_unique_period" ON "public"."usage_tracking" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "feature_name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "usage_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "billing_period_start" "pg_catalog"."date_ops" ASC NULLS LAST
);
CREATE INDEX "idx_usage_tracking_user_id" ON "public"."usage_tracking" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table usage_tracking
-- ----------------------------
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_usage_type_check" CHECK (usage_type = ANY (ARRAY['api_call'::text, 'storage_mb'::text, 'export_request'::text, 'ai_interaction'::text, 'monthly_count'::text, 'minutes'::text]));
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_user_check" CHECK (CHECK (user_id = auth.uid()) NOT VALID);

-- ----------------------------
-- Primary Key structure for table usage_tracking
-- ----------------------------
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_feedback
-- ----------------------------
CREATE INDEX "idx_user_feedback_created_at" ON "public"."user_feedback" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_user_feedback_feature" ON "public"."user_feedback" USING btree (
  "feature" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_user_feedback_user_id" ON "public"."user_feedback" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table user_feedback
-- ----------------------------
ALTER TABLE "public"."user_feedback" ADD CONSTRAINT "user_feedback_rating_check" CHECK (rating >= 1 AND rating <= 5);

-- ----------------------------
-- Primary Key structure for table user_feedback
-- ----------------------------
ALTER TABLE "public"."user_feedback" ADD CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_insights
-- ----------------------------
CREATE INDEX "idx_user_insights_priority" ON "public"."user_insights" USING btree (
  "priority" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_user_insights_type" ON "public"."user_insights" USING btree (
  "insight_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_user_insights_unread" ON "public"."user_insights" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "is_read" "pg_catalog"."bool_ops" ASC NULLS LAST
) WHERE is_read = false;
CREATE INDEX "idx_user_insights_user_id" ON "public"."user_insights" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table user_insights
-- ----------------------------
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_insight_type_check" CHECK (insight_type = ANY (ARRAY['pattern'::text, 'recommendation'::text, 'warning'::text, 'progress'::text, 'achievement'::text]));
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_priority_check" CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]));
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_user_check" CHECK (CHECK (user_id = auth.uid()) NOT VALID);

-- ----------------------------
-- Primary Key structure for table user_insights
-- ----------------------------
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_legal_needs
-- ----------------------------
CREATE INDEX "user_legal_needs_situation_idx" ON "public"."user_legal_needs" USING gin (
  "legal_situation" COLLATE "pg_catalog"."default" "pg_catalog"."array_ops"
);

-- ----------------------------
-- Checks structure for table user_legal_needs
-- ----------------------------
ALTER TABLE "public"."user_legal_needs" ADD CONSTRAINT "user_legal_needs_budget_range_check" CHECK (budget_range = ANY (ARRAY['under_1000'::text, '1000_5000'::text, '5000_10000'::text, '10000_plus'::text, 'payment_plan'::text]));
ALTER TABLE "public"."user_legal_needs" ADD CONSTRAINT "user_legal_needs_married_status_check" CHECK (married_status = ANY (ARRAY['married'::text, 'separated'::text, 'divorced'::text, 'single'::text]));
ALTER TABLE "public"."user_legal_needs" ADD CONSTRAINT "user_legal_needs_urgency_level_check" CHECK (urgency_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'emergency'::text]));

-- ----------------------------
-- Primary Key structure for table user_legal_needs
-- ----------------------------
ALTER TABLE "public"."user_legal_needs" ADD CONSTRAINT "user_legal_needs_pkey" PRIMARY KEY ("user_id");

-- ----------------------------
-- Indexes structure for table user_lesson_progress
-- ----------------------------
CREATE INDEX "idx_user_lesson_progress_user_id" ON "public"."user_lesson_progress" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table user_lesson_progress
-- ----------------------------
ALTER TABLE "public"."user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id");

-- ----------------------------
-- Primary Key structure for table user_lesson_progress
-- ----------------------------
ALTER TABLE "public"."user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table user_letting_go_affirmations
-- ----------------------------
ALTER TABLE "public"."user_letting_go_affirmations" ADD CONSTRAINT "user_letting_go_affirmations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_template_usage
-- ----------------------------
CREATE INDEX "idx_user_template_usage_user" ON "public"."user_template_usage" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table user_template_usage
-- ----------------------------
ALTER TABLE "public"."user_template_usage" ADD CONSTRAINT "user_template_usage_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table user_therapy_preferences
-- ----------------------------
ALTER TABLE "public"."user_therapy_preferences" ADD CONSTRAINT "user_therapy_preferences_budget_range_check" CHECK (budget_range = ANY (ARRAY['under_50'::text, '50_100'::text, '100_200'::text, '200_plus'::text]));
ALTER TABLE "public"."user_therapy_preferences" ADD CONSTRAINT "user_therapy_preferences_gender_preference_check" CHECK (gender_preference = ANY (ARRAY['male'::text, 'female'::text, 'non_binary'::text, 'no_preference'::text]));
ALTER TABLE "public"."user_therapy_preferences" ADD CONSTRAINT "user_therapy_preferences_severity_level_check" CHECK (severity_level = ANY (ARRAY['mild'::text, 'moderate'::text, 'severe'::text, 'crisis'::text]));

-- ----------------------------
-- Primary Key structure for table user_therapy_preferences
-- ----------------------------
ALTER TABLE "public"."user_therapy_preferences" ADD CONSTRAINT "user_therapy_preferences_pkey" PRIMARY KEY ("user_id");

-- ----------------------------
-- Indexes structure for table user_trait_examples
-- ----------------------------
CREATE INDEX "idx_user_trait_examples_user_trait" ON "public"."user_trait_examples" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "trait_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table user_trait_examples
-- ----------------------------
ALTER TABLE "public"."user_trait_examples" ADD CONSTRAINT "user_trait_examples_emotional_impact_check" CHECK (emotional_impact = ANY (ARRAY['mild'::text, 'moderate'::text, 'severe'::text]));

-- ----------------------------
-- Primary Key structure for table user_trait_examples
-- ----------------------------
ALTER TABLE "public"."user_trait_examples" ADD CONSTRAINT "user_trait_examples_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table user_trait_notes
-- ----------------------------
CREATE INDEX "idx_user_trait_notes_trait" ON "public"."user_trait_notes" USING btree (
  "trait_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "idx_user_trait_notes_user" ON "public"."user_trait_notes" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table user_trait_notes
-- ----------------------------
ALTER TABLE "public"."user_trait_notes" ADD CONSTRAINT "user_trait_notes_user_trait_unique" UNIQUE ("user_id", "trait_id");

-- ----------------------------
-- Checks structure for table user_trait_notes
-- ----------------------------
ALTER TABLE "public"."user_trait_notes" ADD CONSTRAINT "user_trait_notes_frequency_check" CHECK (frequency = ANY (ARRAY['rare'::text, 'occasional'::text, 'frequent'::text, 'constant'::text]));

-- ----------------------------
-- Primary Key structure for table user_trait_notes
-- ----------------------------
ALTER TABLE "public"."user_trait_notes" ADD CONSTRAINT "user_trait_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table wellness_goals
-- ----------------------------
CREATE INDEX "idx_wellness_goals_user_id" ON "public"."wellness_goals" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table wellness_goals
-- ----------------------------
ALTER TABLE "public"."wellness_goals" ADD CONSTRAINT "wellness_goals_goal_type_check" CHECK (goal_type = ANY (ARRAY['daily_checkin'::text, 'mood_improvement'::text, 'coping_usage'::text, 'self_compassion'::text, 'boundary_setting'::text]));

-- ----------------------------
-- Primary Key structure for table wellness_goals
-- ----------------------------
ALTER TABLE "public"."wellness_goals" ADD CONSTRAINT "wellness_goals_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table wellness_habits
-- ----------------------------
CREATE INDEX "idx_wellness_habits_user_id" ON "public"."wellness_habits" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Checks structure for table wellness_habits
-- ----------------------------
ALTER TABLE "public"."wellness_habits" ADD CONSTRAINT "wellness_habits_habit_type_check" CHECK (habit_type = ANY (ARRAY['affirmation'::text, 'mood_checkin'::text, 'coping_strategy'::text, 'self_care'::text, 'boundary_practice'::text]));

-- ----------------------------
-- Primary Key structure for table wellness_habits
-- ----------------------------
ALTER TABLE "public"."wellness_habits" ADD CONSTRAINT "wellness_habits_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table wellness_reports
-- ----------------------------
CREATE INDEX "idx_wellness_reports_user_week" ON "public"."wellness_reports" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "week_start_date" "pg_catalog"."date_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table wellness_reports
-- ----------------------------
ALTER TABLE "public"."wellness_reports" ADD CONSTRAINT "wellness_reports_user_id_week_start_date_key" UNIQUE ("user_id", "week_start_date");

-- ----------------------------
-- Primary Key structure for table wellness_reports
-- ----------------------------
ALTER TABLE "public"."wellness_reports" ADD CONSTRAINT "wellness_reports_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table withdrawal_tracker
-- ----------------------------
CREATE INDEX "idx_withdrawal_tracker_user_id" ON "public"."withdrawal_tracker" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "logged_at" "pg_catalog"."timestamptz_ops" DESC NULLS FIRST
);

-- ----------------------------
-- Checks structure for table withdrawal_tracker
-- ----------------------------
ALTER TABLE "public"."withdrawal_tracker" ADD CONSTRAINT "withdrawal_tracker_urge_intensity_check" CHECK (urge_intensity >= 1 AND urge_intensity <= 10);

-- ----------------------------
-- Primary Key structure for table withdrawal_tracker
-- ----------------------------
ALTER TABLE "public"."withdrawal_tracker" ADD CONSTRAINT "withdrawal_tracker_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table abuse_cycles
-- ----------------------------
ALTER TABLE "public"."abuse_cycles" ADD CONSTRAINT "abuse_cycles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table acceptance_journal
-- ----------------------------
ALTER TABLE "public"."acceptance_journal" ADD CONSTRAINT "acceptance_journal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table acceptance_milestones
-- ----------------------------
ALTER TABLE "public"."acceptance_milestones" ADD CONSTRAINT "acceptance_milestones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table acceptance_progress
-- ----------------------------
ALTER TABLE "public"."acceptance_progress" ADD CONSTRAINT "acceptance_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table admin_users
-- ----------------------------
ALTER TABLE "public"."admin_users" ADD CONSTRAINT "admin_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."admin_users" ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table affirmation_preferences
-- ----------------------------
ALTER TABLE "public"."affirmation_preferences" ADD CONSTRAINT "affirmation_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table ai_conversations
-- ----------------------------
ALTER TABLE "public"."ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table ai_messages
-- ----------------------------
ALTER TABLE "public"."ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."ai_messages" ADD CONSTRAINT "ai_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table attachment_triggers
-- ----------------------------
ALTER TABLE "public"."attachment_triggers" ADD CONSTRAINT "attachment_triggers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table belief_affirmations
-- ----------------------------
ALTER TABLE "public"."belief_affirmations" ADD CONSTRAINT "belief_affirmations_belief_id_fkey" FOREIGN KEY ("belief_id") REFERENCES "public"."false_beliefs" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."belief_affirmations" ADD CONSTRAINT "belief_affirmations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table belief_strength_log
-- ----------------------------
ALTER TABLE "public"."belief_strength_log" ADD CONSTRAINT "belief_strength_log_belief_id_fkey" FOREIGN KEY ("belief_id") REFERENCES "public"."false_beliefs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table biff_templates
-- ----------------------------
ALTER TABLE "public"."biff_templates" ADD CONSTRAINT "biff_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table blog_post_tags
-- ----------------------------
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table blog_posts
-- ----------------------------
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table boundaries
-- ----------------------------
ALTER TABLE "public"."boundaries" ADD CONSTRAINT "boundaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table boundary_analytics
-- ----------------------------
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_boundary_id_fkey" FOREIGN KEY ("boundary_id") REFERENCES "public"."boundaries" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."boundary_analytics" ADD CONSTRAINT "boundary_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table boundary_interactions
-- ----------------------------
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_boundary_id_fkey" FOREIGN KEY ("boundary_id") REFERENCES "public"."boundaries" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."boundary_interactions" ADD CONSTRAINT "boundary_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table boundary_reviews
-- ----------------------------
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_boundary_id_fkey" FOREIGN KEY ("boundary_id") REFERENCES "public"."boundaries" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."boundary_reviews" ADD CONSTRAINT "boundary_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table code_redemptions
-- ----------------------------
ALTER TABLE "public"."code_redemptions" ADD CONSTRAINT "code_redemptions_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "public"."redeem_codes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."code_redemptions" ADD CONSTRAINT "code_redemptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table cognitive_dissonance_alerts
-- ----------------------------
ALTER TABLE "public"."cognitive_dissonance_alerts" ADD CONSTRAINT "cognitive_dissonance_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table communication_insights
-- ----------------------------
ALTER TABLE "public"."communication_insights" ADD CONSTRAINT "communication_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table community_comments
-- ----------------------------
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."community_comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "community_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table community_likes
-- ----------------------------
ALTER TABLE "public"."community_likes" ADD CONSTRAINT "community_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."community_likes" ADD CONSTRAINT "community_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table community_posts
-- ----------------------------
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table confabulation_patterns
-- ----------------------------
ALTER TABLE "public"."confabulation_patterns" ADD CONSTRAINT "confabulation_patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table coparent_communications
-- ----------------------------
ALTER TABLE "public"."coparent_communications" ADD CONSTRAINT "coparent_communications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table coping_strategies
-- ----------------------------
ALTER TABLE "public"."coping_strategies" ADD CONSTRAINT "coping_strategies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table counter_evidence
-- ----------------------------
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_belief_id_fkey" FOREIGN KEY ("belief_id") REFERENCES "public"."false_beliefs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_related_journal_entry_id_fkey" FOREIGN KEY ("related_journal_entry_id") REFERENCES "public"."journal_entries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."counter_evidence" ADD CONSTRAINT "counter_evidence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table crisis_reframes
-- ----------------------------
ALTER TABLE "public"."crisis_reframes" ADD CONSTRAINT "crisis_reframes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table data_exports
-- ----------------------------
ALTER TABLE "public"."data_exports" ADD CONSTRAINT "data_exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table data_retention_requests
-- ----------------------------
ALTER TABLE "public"."data_retention_requests" ADD CONSTRAINT "data_retention_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table decompression_sessions
-- ----------------------------
ALTER TABLE "public"."decompression_sessions" ADD CONSTRAINT "decompression_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table detachment_milestones
-- ----------------------------
ALTER TABLE "public"."detachment_milestones" ADD CONSTRAINT "detachment_milestones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table empathy_audit
-- ----------------------------
ALTER TABLE "public"."empathy_audit" ADD CONSTRAINT "empathy_audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table empathy_distribution
-- ----------------------------
ALTER TABLE "public"."empathy_distribution" ADD CONSTRAINT "empathy_distribution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table empathy_situations
-- ----------------------------
ALTER TABLE "public"."empathy_situations" ADD CONSTRAINT "empathy_situations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table escalation_patterns
-- ----------------------------
ALTER TABLE "public"."escalation_patterns" ADD CONSTRAINT "escalation_patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table evidence_files
-- ----------------------------
ALTER TABLE "public"."evidence_files" ADD CONSTRAINT "evidence_files_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."evidence_files" ADD CONSTRAINT "evidence_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table export_requests
-- ----------------------------
ALTER TABLE "public"."export_requests" ADD CONSTRAINT "export_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table false_beliefs
-- ----------------------------
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_origin_journal_entry_id_fkey" FOREIGN KEY ("origin_journal_entry_id") REFERENCES "public"."journal_entries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."false_beliefs" ADD CONSTRAINT "false_beliefs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table gaslighting_statements
-- ----------------------------
ALTER TABLE "public"."gaslighting_statements" ADD CONSTRAINT "gaslighting_statements_contradicts_statement_id_fkey" FOREIGN KEY ("contradicts_statement_id") REFERENCES "public"."gaslighting_statements" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."gaslighting_statements" ADD CONSTRAINT "gaslighting_statements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table gdpr_consents
-- ----------------------------
ALTER TABLE "public"."gdpr_consents" ADD CONSTRAINT "gdpr_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table gratitude_streaks
-- ----------------------------
ALTER TABLE "public"."gratitude_streaks" ADD CONSTRAINT "gratitude_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table grey_rock_attempts
-- ----------------------------
ALTER TABLE "public"."grey_rock_attempts" ADD CONSTRAINT "grey_rock_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."grey_rock_sessions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."grey_rock_attempts" ADD CONSTRAINT "grey_rock_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table grey_rock_sessions
-- ----------------------------
ALTER TABLE "public"."grey_rock_sessions" ADD CONSTRAINT "grey_rock_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table habit_completions
-- ----------------------------
ALTER TABLE "public"."habit_completions" ADD CONSTRAINT "habit_completions_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "public"."wellness_habits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."habit_completions" ADD CONSTRAINT "habit_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table healing_resources
-- ----------------------------
ALTER TABLE "public"."healing_resources" ADD CONSTRAINT "healing_resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table journal_entries
-- ----------------------------
ALTER TABLE "public"."journal_entries" ADD CONSTRAINT "journal_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table letting_go_entries
-- ----------------------------
ALTER TABLE "public"."letting_go_entries" ADD CONSTRAINT "letting_go_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table manipulation_analysis
-- ----------------------------
ALTER TABLE "public"."manipulation_analysis" ADD CONSTRAINT "manipulation_analysis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table mental_pause_sessions
-- ----------------------------
ALTER TABLE "public"."mental_pause_sessions" ADD CONSTRAINT "mental_pause_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table mind_reset_sessions
-- ----------------------------
ALTER TABLE "public"."mind_reset_sessions" ADD CONSTRAINT "mind_reset_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table mood_check_ins
-- ----------------------------
ALTER TABLE "public"."mood_check_ins" ADD CONSTRAINT "mood_check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table morning_intentions
-- ----------------------------
ALTER TABLE "public"."morning_intentions" ADD CONSTRAINT "morning_intentions_affirmation_id_fkey" FOREIGN KEY ("affirmation_id") REFERENCES "public"."affirmations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."morning_intentions" ADD CONSTRAINT "morning_intentions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table narcissist_analyses
-- ----------------------------
ALTER TABLE "public"."narcissist_analyses" ADD CONSTRAINT "narcissist_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table narcissist_simulator_sessions
-- ----------------------------
ALTER TABLE "public"."narcissist_simulator_sessions" ADD CONSTRAINT "narcissist_simulator_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table no_contact_milestones
-- ----------------------------
ALTER TABLE "public"."no_contact_milestones" ADD CONSTRAINT "no_contact_milestones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table no_contact_settings
-- ----------------------------
ALTER TABLE "public"."no_contact_settings" ADD CONSTRAINT "no_contact_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table origin_memories
-- ----------------------------
ALTER TABLE "public"."origin_memories" ADD CONSTRAINT "origin_memories_belief_id_fkey" FOREIGN KEY ("belief_id") REFERENCES "public"."false_beliefs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."origin_memories" ADD CONSTRAINT "origin_memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table pattern_alerts
-- ----------------------------
ALTER TABLE "public"."pattern_alerts" ADD CONSTRAINT "pattern_alerts_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "public"."npd_traits" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."pattern_alerts" ADD CONSTRAINT "pattern_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table pattern_analysis
-- ----------------------------
ALTER TABLE "public"."pattern_analysis" ADD CONSTRAINT "pattern_analysis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table pattern_detections
-- ----------------------------
ALTER TABLE "public"."pattern_detections" ADD CONSTRAINT "pattern_detections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table payments
-- ----------------------------
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table positive_moments
-- ----------------------------
ALTER TABLE "public"."positive_moments" ADD CONSTRAINT "positive_moments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table reactive_abuse_incidents
-- ----------------------------
ALTER TABLE "public"."reactive_abuse_incidents" ADD CONSTRAINT "reactive_abuse_incidents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table reactive_abuse_patterns
-- ----------------------------
ALTER TABLE "public"."reactive_abuse_patterns" ADD CONSTRAINT "reactive_abuse_patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table reality_log_entries
-- ----------------------------
ALTER TABLE "public"."reality_log_entries" ADD CONSTRAINT "reality_log_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table reality_testing_sessions
-- ----------------------------
ALTER TABLE "public"."reality_testing_sessions" ADD CONSTRAINT "reality_testing_sessions_belief_id_fkey" FOREIGN KEY ("belief_id") REFERENCES "public"."false_beliefs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."reality_testing_sessions" ADD CONSTRAINT "reality_testing_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table relationship_assessments
-- ----------------------------
ALTER TABLE "public"."relationship_assessments" ADD CONSTRAINT "relationship_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table role_boundaries
-- ----------------------------
ALTER TABLE "public"."role_boundaries" ADD CONSTRAINT "role_boundaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table routine_streaks
-- ----------------------------
ALTER TABLE "public"."routine_streaks" ADD CONSTRAINT "routine_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table safety_plans
-- ----------------------------
ALTER TABLE "public"."safety_plans" ADD CONSTRAINT "safety_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table statement_contradictions
-- ----------------------------
ALTER TABLE "public"."statement_contradictions" ADD CONSTRAINT "statement_contradictions_statement_1_id_fkey" FOREIGN KEY ("statement_1_id") REFERENCES "public"."gaslighting_statements" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."statement_contradictions" ADD CONSTRAINT "statement_contradictions_statement_2_id_fkey" FOREIGN KEY ("statement_2_id") REFERENCES "public"."gaslighting_statements" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."statement_contradictions" ADD CONSTRAINT "statement_contradictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table stonewalling_incidents
-- ----------------------------
ALTER TABLE "public"."stonewalling_incidents" ADD CONSTRAINT "stonewalling_incidents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table stonewalling_patterns
-- ----------------------------
ALTER TABLE "public"."stonewalling_patterns" ADD CONSTRAINT "stonewalling_patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table stonewalling_responses
-- ----------------------------
ALTER TABLE "public"."stonewalling_responses" ADD CONSTRAINT "stonewalling_responses_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "public"."stonewalling_incidents" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."stonewalling_responses" ADD CONSTRAINT "stonewalling_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table therapy_referrals
-- ----------------------------
ALTER TABLE "public"."therapy_referrals" ADD CONSTRAINT "therapy_referrals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table toxic_memories
-- ----------------------------
ALTER TABLE "public"."toxic_memories" ADD CONSTRAINT "toxic_memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table trait_combinations
-- ----------------------------
ALTER TABLE "public"."trait_combinations" ADD CONSTRAINT "trait_combinations_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."trait_combinations" ADD CONSTRAINT "trait_combinations_primary_trait_id_fkey" FOREIGN KEY ("primary_trait_id") REFERENCES "public"."npd_traits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."trait_combinations" ADD CONSTRAINT "trait_combinations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table trait_frequency_tracking
-- ----------------------------
ALTER TABLE "public"."trait_frequency_tracking" ADD CONSTRAINT "trait_frequency_tracking_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."trait_frequency_tracking" ADD CONSTRAINT "trait_frequency_tracking_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "public"."npd_traits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."trait_frequency_tracking" ADD CONSTRAINT "trait_frequency_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table trigger_calendar
-- ----------------------------
ALTER TABLE "public"."trigger_calendar" ADD CONSTRAINT "trigger_calendar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table truth_timeline
-- ----------------------------
ALTER TABLE "public"."truth_timeline" ADD CONSTRAINT "truth_timeline_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table usage_tracking
-- ----------------------------
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_feedback
-- ----------------------------
ALTER TABLE "public"."user_feedback" ADD CONSTRAINT "user_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_insights
-- ----------------------------
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_legal_needs
-- ----------------------------
ALTER TABLE "public"."user_legal_needs" ADD CONSTRAINT "user_legal_needs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_lesson_progress
-- ----------------------------
ALTER TABLE "public"."user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."recovery_lessons" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_letting_go_affirmations
-- ----------------------------
ALTER TABLE "public"."user_letting_go_affirmations" ADD CONSTRAINT "user_letting_go_affirmations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_template_usage
-- ----------------------------
ALTER TABLE "public"."user_template_usage" ADD CONSTRAINT "user_template_usage_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."grey_rock_templates" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."user_template_usage" ADD CONSTRAINT "user_template_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_therapy_preferences
-- ----------------------------
ALTER TABLE "public"."user_therapy_preferences" ADD CONSTRAINT "user_therapy_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_trait_examples
-- ----------------------------
ALTER TABLE "public"."user_trait_examples" ADD CONSTRAINT "user_trait_examples_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "public"."npd_traits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_trait_examples" ADD CONSTRAINT "user_trait_examples_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_trait_notes
-- ----------------------------
ALTER TABLE "public"."user_trait_notes" ADD CONSTRAINT "user_trait_notes_trait_id_fkey" FOREIGN KEY ("trait_id") REFERENCES "public"."npd_traits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_trait_notes" ADD CONSTRAINT "user_trait_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table wellness_goals
-- ----------------------------
ALTER TABLE "public"."wellness_goals" ADD CONSTRAINT "wellness_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table wellness_habits
-- ----------------------------
ALTER TABLE "public"."wellness_habits" ADD CONSTRAINT "wellness_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table wellness_reports
-- ----------------------------
ALTER TABLE "public"."wellness_reports" ADD CONSTRAINT "wellness_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table withdrawal_tracker
-- ----------------------------
ALTER TABLE "public"."withdrawal_tracker" ADD CONSTRAINT "withdrawal_tracker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
