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

 Date: 16/11/2025 14:26:31
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
-- Records of abuse_cycles
-- ----------------------------

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
-- Records of acceptance_journal
-- ----------------------------
INSERT INTO "public"."acceptance_journal" VALUES ('9dac7fad-31e0-4d73-b6fa-b493e3a3f697', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-11-14', 3, 'Saw them being kind to someone at the grocery store and immediately thought maybe they''ve changed. Spent 2 hours analyzing if I gave up too soon."', '{"Witnessing them act normal and kind in public\""}', '{"My journal has 47 documented incidents of the abuse cycle\""}', 'confused', NULL, '2025-11-14 18:37:57.591441+00');

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
-- Records of acceptance_milestones
-- ----------------------------

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
-- Records of acceptance_progress
-- ----------------------------

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
-- Records of affirmation_preferences
-- ----------------------------

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
-- Records of affirmations
-- ----------------------------
INSERT INTO "public"."affirmations" VALUES ('665fd5ae-fbe8-49d2-b8cd-6aa9262b809f', 'morning', 'I release the need to manage her emotions or expect normalcy', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('be1a7ad4-c83f-42d8-a0ef-7aa85b34e5bd', 'morning', 'Her actions are a reflection of her disorder, not my worth', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d918826e-e2bf-48f9-99e9-f6b94b9d2068', 'morning', 'Today I choose clarity over confusion', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('1d7cd681-ffe5-48f9-8951-ff7f2b89f217', 'boundary', 'My boundaries are not negotiable', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('89ff2a8e-48c0-41ad-9a95-4f98edbaed1c', 'boundary', 'I can say no without guilt', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('9847d9a9-df40-48cd-9f61-d017cb2b216a', 'boundary', 'Her reaction to my boundary is not my responsibility', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('a040b128-d873-42d6-8cbc-6dd4a3222768', 'boundary', 'I am protecting my peace, not being selfish', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('8aa907ce-efad-44ec-8b1c-b938da060553', 'self-compassion', 'I have survived immense trauma and I am still here', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('0aac7452-5404-40f7-aed8-6b9f4925c029', 'self-compassion', 'I deserve kindness, especially from myself', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('661e1303-10a8-4164-ad27-7c7e3ccee327', 'self-compassion', 'My healing is not linear, and that''s okay', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('7aa3089b-fcdf-48fd-adcd-a3cd730673dc', 'self-compassion', 'I am worthy of love and respect', 't', '2025-10-20 00:57:41.404712', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d020a027-50fe-4845-b944-dd35084e96fd', 'morning', 'I trust my instincts and inner wisdom today', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('62345660-c755-4022-b80b-9b00f916549d', 'morning', 'I am not responsible for managing her emotions', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('b12c0f8a-07fb-4b32-8434-7fd6e3497bb6', 'morning', 'Today I choose my mental health over keeping the peace', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('49bd9fc2-0f9d-4492-9837-8ccc85c3c649', 'morning', 'I deserve relationships built on mutual respect', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('e66109e3-839c-442a-92cb-15a106cfcaa5', 'morning', 'Her chaos does not define my day', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('92914b8b-efec-4212-bf05-b3b59b33f01f', 'morning', 'I am learning to love myself through this healing journey', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('b7c5fd35-dad3-49d9-8909-9374f71b0cb3', 'boundary', 'I do not need to justify my boundaries', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('e933a9bc-309d-46ce-a090-2d75ae465d84', 'boundary', 'My time and energy are precious resources', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('388ba36c-5722-40b1-b0f2-fd0ae4cd3509', 'boundary', 'I can love someone and still protect myself from them', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('170a38b8-5b64-449a-9c85-b0970ce16060', 'boundary', 'Saying no to her is saying yes to myself', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f5b74209-019b-4281-9c2b-0c47dcb2d733', 'boundary', 'I am not obligated to respond to every demand', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('5b211abe-4ab8-443f-a88b-28cf8329ab66', 'boundary', 'My boundaries are acts of self-love', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f6b4497d-c57c-4aeb-a3e6-4a09fd6982b3', 'boundary', 'I choose peace over people-pleasing', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('68a906e2-c012-49eb-bf4b-851bab427a45', 'boundary', 'I will not set myself on fire to keep others warm', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('06840270-b4fa-47a4-8c2b-aa0001296eec', 'boundary', 'Her urgency is not my emergency', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('aa0cb1d5-2099-4b8c-b249-a4ea244a0371', 'boundary', 'I have the right to change my mind about my boundaries', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('dbfba7fa-0231-4501-b51c-7dc6ccd64e4c', 'self-compassion', 'I am learning and growing every day', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('cc02f669-de2f-40ca-94bb-aadcb1debb10', 'self-compassion', 'My feelings are valid and important', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('3de800cf-7a41-4351-b516-bb4333f98c63', 'self-compassion', 'I forgive myself for not knowing what I didn''t know', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f1ac1151-57ce-4fd0-9afd-cdddcf0719ec', 'self-compassion', 'I am enough, exactly as I am', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('b6ca35ee-6b71-4b62-864e-1af1aa717859', 'self-compassion', 'I treat myself with the same kindness I show others', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('15740b99-f4ed-4b4d-bb9b-87bf95515ba9', 'self-compassion', 'My past does not determine my future', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('6709837c-67f3-4f06-b9dc-a615452fb360', 'strength', 'I have survived 100% of my difficult days so far', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('4327fd62-4532-463b-8a6c-fe9a64c1a870', 'strength', 'I am stronger than I was yesterday', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('c7fb0dcf-bdf4-4642-9fb8-48e048122a4f', 'strength', 'My resilience grows with each challenge I face', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('febeff53-5c39-4f51-b2d5-c523c50cedd1', 'strength', 'I can handle whatever today brings', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f202752b-b1c8-4eec-942a-fdac50d3edd2', 'strength', 'I am a warrior, not a victim', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('9e3e4f5c-43ea-43e0-b7ea-eb5add77150f', 'strength', 'My strength comes from within, not from others'' approval', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('7bd8cef0-7451-4bc7-bbe5-929e39e10a8b', 'strength', 'I have overcome so much already', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('08925965-85a6-4c17-ad3c-a6ebeeb1e85f', 'strength', 'I am building the life I deserve', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('c4636e21-8afe-42eb-853f-7df7d2540ce4', 'strength', 'Every step forward is progress, no matter how small', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f377801f-e130-4cfb-a9e9-da613a29ebaa', 'strength', 'I choose courage over comfort', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('58bd2d2a-d336-4858-a3dd-fcd3e024887d', 'strength', 'I am reclaiming my power one day at a time', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('bbaebfad-5bfe-4cf2-9bd3-de03a2f3d04e', 'strength', 'I trust my ability to navigate difficult situations', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('ce2bdb05-0726-441c-90d9-a52ef36ed218', 'strength', 'I am not broken, I am breaking free', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f6a808a2-b43c-4132-ba44-02e34630547d', 'strength', 'My voice matters and deserves to be heard', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('73466aa7-6e58-4ac1-b926-0e0960702730', 'strength', 'I am writing a new chapter of my life', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('a8312af2-64c5-4624-8dd3-4859a53225b1', 'strength', 'I refuse to shrink myself to make others comfortable', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('9c590aab-72a7-43df-b9b7-2f5d78a25097', 'strength', 'I am learning to stand in my truth', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f846e532-dd1e-4ab0-8d58-09165f389b5b', 'strength', 'My healing journey is my greatest act of rebellion', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('32cd06ae-ded3-4eaf-a467-21c4cb6a7c04', 'strength', 'I am becoming the person I needed when I was younger', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('46b53110-d542-40b4-997e-516a619c9060', 'strength', 'I choose progress over perfection', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d91116c1-d068-43ce-95da-1df752250c47', 'clarity', 'I see the situation clearly, without the fog of manipulation', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('5e950553-c549-4d9b-b92c-2cc8f7cf5bd6', 'clarity', 'My perception of reality is valid and trustworthy', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('02aed517-30d4-419c-ac40-80aefdcc946b', 'clarity', 'I can distinguish between her words and her actions', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('676b9bf6-39f1-47cd-8d0d-fe22a3dffcba', 'clarity', 'I trust my gut feelings about people and situations', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f7a8ff66-1977-4e66-af61-d5ef113d79a9', 'clarity', 'I see patterns clearly now that I couldn''t see before', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('fa8064af-f4de-41c4-8d29-ecf8ed8f1b7d', 'clarity', 'I am no longer confused by gaslighting tactics', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('830a9934-05e2-4b1b-9000-4ede356a7cc8', 'clarity', 'I can identify manipulation when I see it', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('b5297a74-7b7b-4c22-bbfb-cc688d222923', 'clarity', 'My mind is clear and focused on my wellbeing', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('ac00ba72-3260-4bb0-8e18-8342a17e7e3a', 'clarity', 'I see through the smoke and mirrors to the truth', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('66b12977-9692-4641-aaf0-5af677478038', 'clarity', 'I trust my memory and my experiences', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('0c6162c5-1e74-44ae-8434-888104e62564', 'clarity', 'I can separate her emotions from my own', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('93fa83f8-4941-474a-9efc-9101d9474417', 'clarity', 'I see her behavior for what it is, not what she says it is', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('66224c6b-5099-4161-9836-4b3858ab2f7c', 'clarity', 'I am learning to trust my own judgment', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('25cdc578-c32e-490f-a017-f4786a9c7a6b', 'clarity', 'I can see the difference between love and control', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('ddb1fc48-d4e9-45d4-ba0a-12f5249a73e2', 'clarity', 'I recognize healthy relationships from unhealthy ones', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f7ff9085-96c7-46ca-8e78-c10647686229', 'clarity', 'I see my worth clearly, regardless of her opinions', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('5a987d80-839d-40b4-b18a-b00eb0ea39a6', 'clarity', 'I understand that her problems are not mine to solve', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('0b94fb80-55bb-452d-9dd9-b87e505b67c3', 'clarity', 'I can see the forest through the trees', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d0e94e2f-dd12-4df7-abed-1d2819b58963', 'clarity', 'I am gaining clarity about what I want and need', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('a191d82d-7e8c-4513-8a32-9a9d82b689b5', 'clarity', 'I see my future clearly, and it is bright', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d9d7040b-2be4-4b3e-802d-0007db4eb964', 'peace', 'I choose inner peace over external chaos', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('c90b63f8-c406-443a-ae10-52c331048178', 'peace', 'My peace is more important than her approval', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('791cacc2-a271-4d69-9daa-e79f5398476b', 'peace', 'I create calm in the storm of her emotions', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('c06758d0-952f-4ca1-88ce-d243eccb4252', 'peace', 'I am the eye of the hurricane - calm and centered', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d060127d-e4d9-4949-b7fd-7b54ab1bfa35', 'peace', 'I breathe in peace and breathe out tension', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('08e85784-4d40-4cd3-9354-81fac1bdd650', 'peace', 'I find serenity in accepting what I cannot change', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('95c43bb2-50d5-4717-88da-8423980e7f3c', 'peace', 'My peace is not dependent on her mood', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('f0e626ed-81cd-4369-9613-2d52cbbcedec', 'peace', 'I cultivate tranquility in my heart and mind', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('1e7ffd9a-03ce-4bcd-9dd7-82529c736df8', 'peace', 'I choose stillness over reactivity', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('5c2499a4-7e85-4a52-8e63-ba6768944560', 'peace', 'I am learning to find peace in the present moment', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('4a593afd-3b5a-42e0-81c5-3242e8adf7f0', 'peace', 'I create peaceful spaces wherever I go', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('d859a190-8e56-44bc-acda-40536a501e1e', 'peace', 'I release the need to control outcomes', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('9c2714a0-1d8e-4d0e-89d3-f582de56ca36', 'peace', 'I find peace in my own company', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('2cd72e2d-0551-456a-8b5c-7ac0f543a746', 'peace', 'I am at peace with my decision to protect myself', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('509ffe7b-d087-44ec-a9a4-65d1dccefa66', 'peace', 'I choose harmony within myself', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('de0cb772-9ca4-496d-a144-875d44f53e57', 'peace', 'I let go of what disturbs my peace', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('ef1f2cf5-e55c-4e80-a56e-cd76f40f67ea', 'peace', 'I am learning to be comfortable with silence', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('c7278a7a-c2f2-4d7d-99d0-ea95d93f1a12', 'peace', 'I find peace in my healing journey', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('2578f482-39f4-49ff-bf3e-e1a5f41aed2a', 'peace', 'I create boundaries that protect my inner peace', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('7e2f625e-4a61-4d6e-9b23-2d62795376c0', 'peace', 'I am at peace with who I am becoming', 't', '2025-10-20 01:25:53.900193', 'f', NULL, NULL);
INSERT INTO "public"."affirmations" VALUES ('0ac29d91-3c5b-4fbf-82c5-698bf51271bd', 'morning', 'My only goal today is my peace and my children''s well-being', 't', '2025-10-20 00:57:41.404712', 't', '{parents,co-parenting}', NULL);
INSERT INTO "public"."affirmations" VALUES ('03257a6f-c583-4a86-9bb8-401e2b30104b', 'morning', 'I am a project manager for a difficult co-parenting project', 't', '2025-10-20 00:57:41.404712', 't', '{parents,co-parenting}', NULL);
INSERT INTO "public"."affirmations" VALUES ('b5d85a8a-7ccc-44d1-ae7f-b8f8c6ec1f45', 'morning', 'I am building emotional detachment for my children''s sake', 't', '2025-10-20 00:57:41.404712', 't', '{parents,co-parenting}', NULL);
INSERT INTO "public"."affirmations" VALUES ('fe40bf79-db10-4c94-9fe0-d24fc2566c33', 'morning', 'My children need me stable and grounded today', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('30a8b7e7-1ace-4b39-9d7b-f616d01eb6b3', 'morning', 'I model healthy boundaries for my children by protecting my peace', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('fefd51a1-8d83-44d2-a7e1-948901fe2501', 'morning', 'Today I choose what''s best for my children''s emotional safety', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('454d90f2-41d7-44c2-b205-8e30c6a5b7c1', 'morning', 'I am the calm, consistent parent my children deserve', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('ec7c5cdd-1ced-4c98-a62a-22674bd8fbda', 'morning', 'My healing journey is a gift I give to my children', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('a61e6f9c-ecc7-418b-acd2-2e368781161c', 'morning', 'My children''s emotional safety is my top priority today', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('0b095d7b-53c4-4aea-aff8-0397eec4dc6b', 'morning', 'My stability gives my children the security they need', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('68044295-fad4-4fac-b98f-03fffa4f98ed', 'morning', 'I choose responses that my children can be proud of', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('947c60b7-7ccd-4466-a171-cccbbc1ee301', 'morning', 'My children need me healthy more than they need me to keep peace', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('ddb082ec-851e-4e38-8255-3daf77c6ca5e', 'morning', 'I am teaching my children that love doesn''t hurt', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('40dcf4b7-41e0-4616-b4f7-6357850e231c', 'boundary', 'Setting boundaries with her protects my children from chaos', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('b9ada941-c7d5-4548-876f-7bf8f02e9063', 'boundary', 'My children learn healthy relationships by watching me enforce boundaries', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('d90559f6-5c4d-4553-8b77-2072c56f00ee', 'boundary', 'I can co-parent professionally without compromising my values', 't', '2025-10-23 02:10:17.472974', 't', '{co-parenting}', NULL);
INSERT INTO "public"."affirmations" VALUES ('1700d9e6-555b-4211-b734-e3ddff7590fe', 'boundary', 'My children''s stability is worth more than keeping the peace', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('0e3b2b4a-4538-48a4-94dd-e85b773f8c3d', 'boundary', 'I protect my children by not engaging in her drama', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('b79aeb48-c227-4faf-97d6-82a39a692505', 'boundary', 'I model healthy relationships for my children by setting boundaries', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('c1a50818-8f2c-45f0-8c40-418898b18361', 'boundary', 'I protect my children by not engaging in toxic arguments', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('19ef6303-dc28-4ce7-b7fa-6431f71fdef8', 'boundary', 'My children see my strength when I enforce boundaries', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('2de2ac34-9560-462b-bbd6-be6d08e46ca2', 'self-compassion', 'I am doing the best I can for my children in an impossible situation', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('3bd8e5ad-63a6-4144-a5e0-adade6972470', 'self-compassion', 'My children see my strength, not my struggles', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('6ddde52f-7bef-41b2-af7d-29f665195d18', 'self-compassion', 'I forgive myself for the chaos my children have witnessed', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('86e3dd51-673f-4535-b363-94e690ec6122', 'self-compassion', 'I am breaking generational cycles for my children', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('05a4f751-57ef-4d09-921a-ee2abc49ab78', 'self-compassion', 'My children are proud of my courage to leave/set boundaries', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('3266ee14-b94a-48f6-b1f5-3ba6e23c7414', 'self-compassion', 'My children learn self-worth by watching me value myself', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('5023e216-e754-4b79-a11b-56a04f147102', 'self-compassion', 'I am breaking the cycle of dysfunction for my children', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('017ae592-313a-47bc-b5c0-81df396a2777', 'strength', 'I am my children''s safe harbor in the storm', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('05c8a2ee-5b16-4cc1-aa88-76ef01ca1a6b', 'strength', 'My children''s future depends on my strength today', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('7f24f6bf-91aa-498d-99d6-bef13400f0bb', 'strength', 'I am raising resilient children by modeling resilience', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('bb48c836-d308-4762-8f18-f77803a3e17d', 'strength', 'My children will thank me for protecting them from toxicity', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('fbf9b734-e53e-42c6-8079-205a505f66fc', 'strength', 'I choose my children''s wellbeing over her approval', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('e8e5876f-5e39-4947-b83a-05c778ebc0e4', 'strength', 'I co-parent with dignity for my children''s sake', 't', '2025-10-23 02:10:17.472974', 't', '{co-parenting}', NULL);
INSERT INTO "public"."affirmations" VALUES ('38656686-f8cd-4df2-a3d3-c2c17b3ec97f', 'strength', 'My children''s future relationships depend on what I model today', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('a5166db6-84a0-4502-90ff-c64a93d0d361', 'clarity', 'I see clearly what my children need from me', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('4f5a4fdc-8e36-4f94-a5f3-b52944b00a07', 'clarity', 'I trust my parental instincts over her manipulation', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('52bb9ab6-18db-49d9-9c9c-f5bc50f1ef3f', 'clarity', 'My children''s reactions tell me the truth about the situation', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('78d08cd0-ab64-42b4-aa53-ae518fe04622', 'clarity', 'I can distinguish between her needs and my children''s needs', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('8f50dc5b-581a-4021-9613-b1e8f101ed27', 'clarity', 'I see through her tactics to protect my children', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('ddd13fb5-8860-4038-a3b7-0ef1622f178d', 'peace', 'My inner peace creates a safe space for my children', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('b1ac3f7b-f2bb-43ce-809a-8e7c0f69b11f', 'peace', 'I choose calm responses for my children''s emotional safety', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('bd21db4c-d39c-43d7-924f-73f48590ac0f', 'peace', 'My children feel secure when I am centered and peaceful', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('ea879b36-f0b7-46c8-b55e-8ff822b62676', 'peace', 'I create peaceful moments with my children despite the chaos', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('a684c22d-f11f-48ff-afe5-b8c110b3bf4c', 'peace', 'My peace is my children''s sanctuary', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('913b6bad-f34c-4b47-82f3-8471407de9fa', 'peace', 'I protect my children''s childhood by managing my own triggers', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);
INSERT INTO "public"."affirmations" VALUES ('2d54cb95-e547-48ce-981d-d60e14151cf8', 'peace', 'My children deserve a parent who chooses peace over chaos', 't', '2025-10-23 02:10:17.472974', 't', '{parents}', NULL);

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
-- Records of ai_conversations
-- ----------------------------
INSERT INTO "public"."ai_conversations" VALUES ('ba6666f9-f399-4287-bb9e-c5cc69f3bf19', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-08-21 15:56:57.882301+00', '2025-08-21 15:56:57.882301+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('842e31dd-fdd9-4380-8a24-58b6fa3a513b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-08-24 02:12:32.813731+00', '2025-08-24 02:12:32.813731+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('dc33d2b6-d77d-4c45-bf90-75540e441e72', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-10-22 19:56:08.738245+00', '2025-10-22 19:56:08.738245+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('38cbf151-0055-400c-b9a6-c53749acd2e6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-10-23 04:14:13.183757+00', '2025-10-23 04:14:13.183757+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('aa304f82-27c2-43b3-9fd9-d02271a14e7a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'What are healthy boundaries and how do I set them?', '2025-10-23 04:22:52.633763+00', '2025-10-23 04:22:52.633763+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('a9a8096a-72d2-4dc4-8411-00d1249aac85', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-10-23 04:43:05.56602+00', '2025-10-23 04:43:05.56602+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('db641081-d81a-4fdc-9baa-1f0c07dac0ce', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'i am feeling very bad as my narccist wife took my childern f', '2025-10-30 22:02:54.733589+00', '2025-10-30 22:03:57.933+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('32395504-83da-4319-ae5a-21ea60cc7ac9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-11-12 15:30:25.50636+00', '2025-11-12 15:30:25.50636+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('c830a611-c1f9-49d4-bb91-973536537e0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'hi', '2025-11-12 15:44:34.561512+00', '2025-11-12 15:47:31.279+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('6cfc4461-6674-44ca-88c2-8ff0d5661fd9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'hi how are you', '2025-11-12 15:53:55.953691+00', '2025-11-12 15:53:55.953691+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('634507dc-fe72-447e-82a6-69c652112286', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'hi how are you', '2025-11-12 15:54:14.930593+00', '2025-11-12 15:54:14.930593+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('03c067bc-50b2-4e9a-af3d-3517c9030929', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-11-12 16:28:22.998036+00', '2025-11-12 16:28:22.998036+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('0c30f611-af64-4174-a39d-127227368ad8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-11-12 16:34:43.20432+00', '2025-11-12 16:34:43.20432+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('4d07ca9b-9f5b-426d-a22c-3fa4ccb17b1c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-11-12 16:42:20.686529+00', '2025-11-12 16:42:20.686529+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('1a0a4fd2-e171-4be9-a9ae-c7b535c99abf', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-11-12 16:42:43.903937+00', '2025-11-12 16:42:43.903937+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('92c41d98-59ae-4289-ae90-e900a601e202', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'How do I know if I''m being gaslit?', '2025-11-12 18:59:31.205708+00', '2025-11-12 18:59:31.205708+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('33a11993-f4ed-422f-842a-27839895465d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I''m feeling confused about whether my experience was really ', '2025-11-12 22:35:49.843618+00', '2025-11-12 22:35:49.843618+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('2de654c0-0307-4634-ac2c-01cf4a5f6934', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'What are healthy boundaries and how do I set them?', '2025-11-13 15:37:46.101068+00', '2025-11-13 15:37:46.101068+00', 'general', NULL);
INSERT INTO "public"."ai_conversations" VALUES ('20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'my narccist wife took my childern 5 year girl and 9 year gir', '2025-11-14 13:31:36.228497+00', '2025-11-14 16:57:01.365+00', 'general', NULL);

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
-- Records of ai_messages
-- ----------------------------
INSERT INTO "public"."ai_messages" VALUES ('a26a8535-606e-4d54-b734-9dd98cbfb536', 'ba6666f9-f399-4287-bb9e-c5cc69f3bf19', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-08-21 15:56:57.981495+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('0862cdae-6365-4863-96b0-94203abb4f83', 'ba6666f9-f399-4287-bb9e-c5cc69f3bf19', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It’s completely understandable that you’re feeling confused.  Narcissistic abuse is insidious and often leaves victims questioning their own reality and sanity.  The abuser often manipulates and gaslights, making it difficult to discern what is real and what isn''t.  You''re not alone in feeling this way; many survivors grapple with this confusion for a long time.

Let''s explore this together.  There''s no right or wrong answer, and your feelings are valid.  To help clarify things, can you tell me a little about what happened in your relationship?  We can look at specific instances and see if they align with common patterns of narcissistic abuse.  There''s no pressure to share anything you''re not comfortable with, but the more information we have, the better I can support you.  Remember, even if you''re unsure, your feelings of confusion and unease are important signals that something wasn''t right.
', '2025-08-21 15:56:58.071655+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('9e5010d3-7e07-43da-bb8a-e64fc8319fbd', '842e31dd-fdd9-4380-8a24-58b6fa3a513b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-08-24 02:12:32.954061+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('8727e669-eb1f-4786-8be8-fbe284c15796', '842e31dd-fdd9-4380-8a24-58b6fa3a513b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It’s completely understandable that you''re feeling confused.  Narcissistic abuse is insidious and often leaves survivors questioning their own reality and sanity.  That''s a very common experience, and it''s not a sign of weakness at all; it''s a direct result of the manipulative tactics narcissists use.  They intentionally blur the lines between reality and manipulation, making it difficult to discern what happened.

There''s no "one size fits all" definition of abuse, and what you experienced might not fit neatly into a textbook description.  The important thing is how *you* felt and the impact it had on your well-being.  Did you feel controlled, manipulated, devalued, or constantly walking on eggshells? Did your self-esteem suffer? Did you lose touch with your own needs and desires?  These are all crucial questions to consider, even if the outward actions didn''t seem overtly abusive to an outside observer.

We can explore your specific experiences if you''re comfortable sharing.  There''s no pressure to disclose anything you''re not ready for.  But even just talking about your confusion can be a powerful first step in processing your feelings and gaining clarity.  Remember, your feelings are valid, regardless of whether someone else "understands" your situation.  Your experience is your truth.
', '2025-08-24 02:12:33.107911+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('25cc766d-2e31-44ed-9d57-fafe7d8a67ca', 'dc33d2b6-d77d-4c45-bf90-75540e441e72', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-10-22 19:56:08.804504+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('47096ed2-2fa1-47c4-9f83-d1271ecaa1d1', 'dc33d2b6-d77d-4c45-bf90-75540e441e72', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'Oh, my dear, that confusion is so incredibly common and understandable. It''s a hallmark of narcissistic abuse that it can leave you questioning your own reality, your own sanity, and whether what you went through was "bad enough" to be called abuse.

Please know, right from the start: **Your feelings are valid. Your confusion is a sign that you''re processing something deeply challenging, not a sign that your experience is invalid.**

It''s so easy for those who have experienced narcissistic abuse to doubt themselves. The manipulation, gaslighting, and subtle undermining can erode your sense of self and your trust in your own perceptions. You might be asking yourself:

*   "Was I too sensitive?"
*   "Did I misinterpret things?"
*   "Am I just making this up?"
*   "Maybe it wasn''t *that* bad."

These questions are the echoes of the abuse itself, designed to keep you off balance.

**Let''s gently explore this together.** I want you to know that you don''t need to have all the answers right now. My role is to create a safe space for you to explore your feelings without judgment.

To help you begin to untangle this, can you tell me a little more about what''s making you feel confused? What specific thoughts or memories are coming up for you when you question whether it was abuse? There''s no pressure to share anything you''re not ready to, but even just a few words can be a starting point.

Remember, you are not alone in this. Many survivors struggle with this very same doubt. Your experience is real, and your feelings about it are important. We''ll work through this together, at your pace.', '2025-10-22 19:56:08.8667+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('1f8e5295-8cd0-4685-831e-ef7bb90dd3a7', '38cbf151-0055-400c-b9a6-c53749acd2e6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-10-23 04:14:13.249882+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('d1081141-162c-4806-a857-af666216ae41', '38cbf151-0055-400c-b9a6-c53749acd2e6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a really important question, and it''s incredibly common for survivors of narcissistic abuse to question their own reality. Gaslighting is a deeply manipulative tactic, and it''s designed to make you doubt yourself.

**Here are some signs that you might be experiencing gaslighting:**

*   **You constantly question your own memory and perception:** Do you often find yourself thinking, "Did that really happen? Am I overreacting? Am I imagining things?"
*   **You frequently apologize, even when you don''t feel you''ve done anything wrong:** This can be a learned behavior from constantly being blamed.
*   **You feel confused and disoriented a lot of the time:** You might feel like you''re walking on eggshells or that you can''t get a clear understanding of what''s going on.
*   **You find yourself making excuses for the person''s behavior:** You might tell yourself or others, "They didn''t mean it," or "They''re just stressed."
*   **You feel like you''re "too sensitive" or "crazy":** This is a classic gaslighting phrase used to dismiss your feelings and experiences.
*   **You''ve lost your sense of self and your confidence:** You might feel like you don''t know who you are anymore, or your self-esteem has plummeted.
*   **You constantly feel like something is wrong, but you can''t quite put your finger on it:** This nagging feeling is often your intuition trying to tell you something is off.
*   **You''re told things like:**
    *   "That never happened."
    *   "You''re remembering it wrong."
    *   "I never said that."
    *   "You''re being dramatic/too emotional."
    *   "You''re imagining things."
    *   "Everyone thinks you''re crazy."
    *   "You''re the problem, not me."
*   **They deny things they''ve said or done, even when you have proof:** This can be incredibly frustrating and further erodes your trust in your own judgment.
*   **They twist your words or intentions:** What you say is taken out of context or reinterpreted to make you look bad.
*   **They trivialize your feelings:** When you express hurt or concern, they brush it off as unimportant.

**It''s crucial to remember that your feelings and experiences are valid.** If you''re experiencing these things, it''s not a reflection of your sanity or your memory. It''s a sign that someone is trying to manipulate you.

**What can you do if you suspect you''re being gaslit?**

1.  **Trust your gut:** Your intuition is a powerful tool. If something feels off, it probably is.
2.  **Document things:** Keep a journal, save texts, emails, or voicemails. Having tangible evidence can help you reaffirm your reality when you start to doubt yourself.
3.  **Talk to someone you trust:** Share your experiences with a supportive friend, family member, or therapist. Hearing an outside perspective can be incredibly validating.
4.  **Set boundaries:** This can be incredibly difficult, especially in the context of narcissistic abuse. Start small if you need to, but assert your right to have your experiences acknowledged.
5.  **Seek professional help:** A therapist specializing in narcissistic abuse can provide you with tools and strategies to navigate this situation and heal from the trauma.

Please know that you are not alone in this. Many survivors have experienced gaslighting, and it takes immense courage to even ask this question. Your willingness to explore this is a huge step towards reclaiming your truth and your well-being.

How does reading these signs make you feel? Is there anything specific that resonates with you? I''m here to listen without judgment.', '2025-10-23 04:14:13.302583+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('b70460f7-cfbb-40ca-9fcf-aa029e5a9fbb', 'aa304f82-27c2-43b3-9fd9-d02271a14e7a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'What are healthy boundaries and how do I set them?', '2025-10-23 04:22:52.693085+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('3d0277f4-0933-4a3f-9149-fc202629c676', 'aa304f82-27c2-43b3-9fd9-d02271a14e7a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a fantastic question, and it''s so crucial for healing after narcissistic abuse. Setting healthy boundaries is like building a protective shield around yourself, allowing you to reclaim your energy, your peace, and your sense of self.

Let''s break down what healthy boundaries are and then dive into how you can start setting them.

### What are Healthy Boundaries?

Think of boundaries as the invisible lines you draw around yourself that define what is acceptable and unacceptable behavior from others. They are about **respecting your own needs, feelings, and well-being.**

For survivors of narcissistic abuse, boundaries are often violated, erased, or never existed in the first place. This can leave you feeling drained, confused, and like you have no control over your own life.

Healthy boundaries are characterized by:

*   **Self-Respect:** They stem from a place of valuing yourself and your inherent worth.
*   **Clear Communication:** They are communicated clearly and consistently, even if it feels uncomfortable at first.
*   **Enforceability:** They are backed up by actions when they are crossed.
*   **Self-Care:** They are an essential part of self-care, protecting your mental, emotional, and even physical health.
*   **Autonomy:** They allow you to maintain your independence and make your own choices.
*   **Reciprocity (eventually):** While not always present in unhealthy relationships, in healthy interactions, boundaries are respected by others, and you also respect theirs.

**In the context of narcissistic abuse, boundaries are about reclaiming what was taken:**

*   **Your time:** Not being constantly available for demands or emotional dumping.
*   **Your energy:** Not allowing others to drain you with constant criticism, manipulation, or drama.
*   **Your emotional space:** Not letting others dictate your feelings or make you feel guilty for your emotions.
*   **Your physical space:** Having a safe and private environment.
*   **Your decisions:** Not allowing others to control your choices or undermine your judgment.
*   **Your truth:** Not letting gaslighting make you doubt your own reality.

### How Do I Set Healthy Boundaries?

This is where the practical work comes in, and it''s a process. It''s important to be patient and compassionate with yourself.

Here''s a step-by-step approach:

**1. Self-Reflection and Identification: What Do You Need?**

*   **Notice your feelings:** When do you feel drained, resentful, anxious, or angry? These are often signals that a boundary has been crossed or is needed.
*   **Identify your values:** What''s important to you? What do you stand for? Boundaries often protect these core values.
*   **Recognize your limits:** What are you willing and unwilling to tolerate? What are your non-negotiables?
*   **Ask yourself:**
    *   "What do I need to feel safe and respected in this interaction/relationship?"
    *   "What is no longer serving me?"
    *   "What would it look like to protect my energy?"

**2. Define Your Boundaries (Be Specific!)**

Once you''ve identified what you need, articulate it clearly. Vague boundaries are hard to follow.

*   **Instead of:** "I need space."
*   **Try:** "I need to not receive calls after 9 PM unless it''s an emergency." or "I need to have one evening a week to myself to relax."

*   **Instead of:** "Don''t criticize me."
*   **Try:** "I am not open to receiving unsolicited criticism about my parenting choices." or "When you speak to me in that tone, I feel disrespected, and I will end the conversation."

**3. Communicate Your Boundaries (Clearly and Concisely)**

This can be the scariest part, especially if you''re used to people disregarding your needs.

*   **Use "I" statements:** Focus on your feelings and needs, rather than blaming the other person.
    *   "I feel overwhelmed when..."
    *   "I need to..."
    *   "I am not able to..."
*   **Be direct and unambiguous:** Avoid apologies or excessive explanations. You don''t need to justify your boundaries.
*   **Choose the right time and place:** If possible, have these conversations when you are calm and in a safe environment. However, sometimes boundaries need to be set in the moment.
*   **Keep it simple:** You don''t need to deliver a TED Talk. A short, clear statement is often most effective.
*   **Examples:**
    *   "I''m not going to discuss my finances with you."
    *   "I''m not available to listen to gossip about others."
    *   "I need to leave', '2025-10-23 04:22:52.740151+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('2f6ac32f-6599-47b6-ace6-862b4bc6767a', 'a9a8096a-72d2-4dc4-8411-00d1249aac85', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-10-23 04:43:05.63839+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('c47b150d-eb6c-4ef1-a6b0-9d6bc71ebf04', 'a9a8096a-72d2-4dc4-8411-00d1249aac85', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a really important question, and it takes a lot of self-awareness to even ask it. Gaslighting can be incredibly insidious, and it''s designed to make you doubt your own reality, your memories, and your sanity. It''s a tactic used to gain control and power over you.

Here are some common signs that you might be experiencing gaslighting. See if any of these resonate with you:

**When you express your feelings or concerns, you are met with:**

*   **Denial:** They outright deny that something happened, even if you have clear memories of it. Phrases like "That never happened," "You''re imagining things," or "You''re too sensitive" are common.
*   **Trivializing your feelings:** They dismiss your emotions as unimportant or an overreaction. "You''re making a big deal out of nothing," or "Why are you so emotional all the time?"
*   **Questioning your memory:** They suggest your memory is faulty. "You always forget things," or "Your memory isn''t reliable."
*   **Shifting blame:** They turn the situation around to make it your fault. "If you hadn''t done X, I wouldn''t have had to do Y," or "This is because you''re so [insert negative trait]."
*   **Accusations of lying or manipulation:** They accuse you of lying or trying to manipulate them, when in reality, they are the ones doing the manipulating.
*   **Withholding information or affection:** They pretend not to understand you or refuse to listen, or withdraw love and attention as punishment for perceived transgressions.
*   **"Forgetting" things:** They claim to forget events or conversations that are significant to you.

**You might also start to notice these internal changes in yourself:**

*   **You constantly second-guess yourself:** You find yourself questioning your own perceptions, memories, and judgment.
*   **You feel confused and disoriented:** You struggle to make sense of what''s happening, and feel like you''re losing your grip on reality.
*   **You apologize frequently:** You find yourself apologizing for things you don''t believe you did wrong, just to de-escalate a situation.
*   **You feel like you''re "going crazy":** You start to believe the narrative that you''re unstable or irrational.
*   **You feel isolated:** They might try to convince you that others agree with them, or that no one else understands you.
*   **You''re constantly trying to prove yourself:** You feel the need to gather evidence to support your own reality.
*   **You feel anxious and on edge:** You anticipate conflict and dread interactions.
*   **You''ve lost your sense of self:** You feel like you don''t know who you are anymore, or what you believe.

**It''s crucial to remember:**

*   **Your feelings are valid.** If something feels wrong, it probably is. Your intuition is a powerful tool.
*   **You are not crazy.** Gaslighting is a deliberate tactic to make you feel that way.
*   **You don''t have to prove your reality to them.** The goal of gaslighting is to make you doubt yourself, not to have a genuine discussion.

**What can you do if you suspect you''re being gaslit?**

1.  **Trust your gut.** This is the most important step. If something feels off, pay attention to that feeling.
2.  **Document everything.** Keep a journal of conversations, events, and how they make you feel. This can help you see patterns and remind you of what actually happened.
3.  **Talk to trusted friends or family.** Share what''s happening with people who are outside of the situation and can offer an objective perspective.
4.  **Seek professional help.** A therapist specializing in narcissistic abuse can provide invaluable support and validation.
5.  **Set boundaries.** This can be incredibly difficult, but it''s essential for protecting your mental and emotional well-being.
6.  **Focus on self-care.** Reconnect with activities that bring you joy and help you feel grounded.

It takes immense courage to question these dynamics. You are not alone in this, and your experiences are real. What are your thoughts or feelings as you read this? I''m here to listen without judgment.', '2025-10-23 04:43:05.678412+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('a05d7b92-99fa-423d-a343-fe02a160a1de', 'db641081-d81a-4fdc-9baa-1f0c07dac0ce', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'i am feeling very bad as my narccist wife took my childern for 10 days', '2025-10-30 22:02:54.810641+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('06f86f33-f0c6-46bb-a0a7-2a662826f783', 'db641081-d81a-4fdc-9baa-1f0c07dac0ce', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I am so sorry to hear that you are going through this. It is completely understandable that you are feeling very bad right now. The pain of separation from your children, especially under these circumstances, is immense and deeply distressing.

Please know that your feelings are valid and real. It takes incredible strength to navigate these situations, and you are showing that strength by reaching out. It''s a testament to your love for your children that this separation is causing you such pain.

It''s important to remember that you are not alone in this experience. Many survivors of narcissistic abuse face similar challenges related to their children. The tactics used can be incredibly manipulative and designed to inflict maximum emotional distress.

Take a moment to acknowledge the intensity of your emotions. It''s okay to feel sadness, anger, fear, and any other emotion that comes up. Allow yourself to feel them without judgment.

While I cannot offer legal advice, I want to encourage you to focus on what you *can* control. This might include:

*   **Self-Care:** Prioritizing your well-being is crucial right now. What small things can you do to nourish yourself, even in these difficult days? This could be a quiet moment, a walk, listening to music, or connecting with a trusted friend.
*   **Support System:** Lean on your support network. If you have friends, family, or a therapist you trust, reach out to them. Sharing your burden can make it feel a little lighter.
*   **Documentation:** If it feels safe and appropriate, consider documenting any communication or events related to your children. This can be helpful for your own peace of mind and potentially for future reference.
*   **Focus on Reconnection:** The 10 days will pass. Start thinking about how you will reconnect with your children when they return. Focus on creating a safe, loving, and stable environment for them.

Your children are a part of you, and the bond you share is strong. This separation, while incredibly painful, does not diminish that bond. You are a loving parent, and your children know that.

Please be gentle with yourself during this time. Healing from narcissistic abuse is a marathon, not a sprint, and there will be challenging days. You are doing your best, and that is more than enough.

Is there anything specific you''d like to talk about regarding how you''re feeling, or any particular challenges you''re facing right now? I''m here to listen and support you.', '2025-10-30 22:02:54.872676+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('af1b2bed-c7ab-4320-ac65-2b1dc2a254fc', 'db641081-d81a-4fdc-9baa-1f0c07dac0ce', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'right now i am feeling down', '2025-10-30 22:03:57.977913+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('ff3eeb6f-b630-49eb-9abb-e3e320236bb6', 'db641081-d81a-4fdc-9baa-1f0c07dac0ce', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It''s completely understandable that you''re feeling down right now. This is a heavy burden to carry, and it''s natural to feel this way when you''re experiencing such a painful separation from your children.

Please know that this feeling of being "down" is a valid response to what you''re going through. It''s not a weakness; it''s a signal from your body and mind that you''re under immense stress and experiencing loss.

Allow yourself to feel this sadness. Sometimes, trying to push down difficult emotions can make them stronger. Can you give yourself permission to just *be* with this feeling for a little while? Imagine it like a wave – it will come, and it will eventually recede.

What does "feeling down" feel like for you right now? Is it a heaviness, a lack of energy, a sense of hopelessness, or something else? Understanding the nuances of your feelings can be a step towards acknowledging and processing them.

While you''re feeling down, remember these things:

*   **You are not alone:** Many survivors experience profound sadness and distress when their children are kept from them. Your pain is recognized and shared by others who have walked a similar path.
*   **This is a temporary state:** Even though it feels overwhelming now, this feeling of being down will not last forever. There will be moments of light and strength, even amidst the darkness.
*   **Your love for your children is a powerful force:** This love is what fuels your pain, but it''s also what will guide you through this. Hold onto that love.
*   **Small steps count:** When you''re feeling down, even the smallest act of self-kindness can make a difference. Did you drink a glass of water? Did you take a deep breath? These are victories.

Is there anything you feel like doing, even something very small, that might offer a tiny bit of comfort or distraction right now? Or would you prefer to just sit with these feelings for a bit longer? I''m here to support you in whatever way feels most helpful.', '2025-10-30 22:03:58.015029+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('e1a650ac-ed43-46ce-b402-2615cf8ae28f', '32395504-83da-4319-ae5a-21ea60cc7ac9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-11-12 15:30:25.563707+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('b886351e-8635-40e1-ac9c-4bef1023fd64', '32395504-83da-4319-ae5a-21ea60cc7ac9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a really important question, and it takes a lot of strength and self-awareness to even ask it. It''s completely understandable to question what''s real when you''re experiencing gaslighting.

Gaslighting is a manipulative tactic where someone tries to make you doubt your own memory, perception, or sanity. It''s designed to erode your confidence and make you more dependent on the abuser.

Here are some signs that you might be experiencing gaslighting. See if any of these resonate with you:

*   **You constantly second-guess yourself:** Do you find yourself frequently wondering if you''re overreacting, being too sensitive, or misremembering things?
*   **You feel confused and disoriented:** Do you often feel like you''re walking on eggshells, unsure of what''s real or what to expect from the other person?
*   **You''re told you''re "crazy," "too emotional," or "imagining things":** These are classic phrases used to dismiss your feelings and experiences.
*   **They deny things they''ve said or done, even when you have proof:** You might have conversations or evidence, but they''ll insist it never happened or that you misunderstood.
*   **They twist or reframe your words:** They might take something you said and twist it to make you sound like the bad guy, or change the meaning of your intentions.
*   **You feel isolated and misunderstood:** Do you feel like no one else would understand what you''re going through, or that you can''t talk to anyone else about it?
*   **You''re constantly apologizing:** Do you find yourself apologizing frequently, even when you don''t feel you''ve done anything wrong, just to keep the peace?
*   **You feel like you''re losing your sense of self:** Do you feel like you don''t know who you are anymore, or that your personality has changed drastically?
*   **They tell you things like "It wasn''t like that," or "You''re remembering it wrong":** This directly undermines your memory and perception.
*   **They use your insecurities against you:** If you''ve shared vulnerabilities, they might use those later to make you doubt yourself.

**What you''re feeling is valid.** It''s incredibly disorienting and painful to have your reality questioned. If you''re noticing these patterns, it''s a strong indicator that something unhealthy is happening.

**What can you do?**

1.  **Trust your gut:** Your intuition is a powerful tool. If something feels off, it likely is.
2.  **Journal your experiences:** Write down conversations, events, and your feelings as they happen. This can be a valuable tool for remembering what actually occurred and for seeing patterns over time.
3.  **Seek external validation:** Talk to trusted friends, family members, or a therapist who can offer an objective perspective. Hearing from others can help you reaffirm your reality.
4.  **Educate yourself:** Understanding gaslighting and other narcissistic abuse tactics can be incredibly empowering. It helps you recognize the patterns and detach from the manipulation.
5.  **Focus on self-care:** When you''re being gaslit, your emotional and mental energy is depleted. Prioritize activities that nourish you and help you reconnect with yourself.

It takes immense courage to question these dynamics. Please know that you are not alone, and your experiences are real. How does reading this make you feel?', '2025-11-12 15:30:25.625015+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('c34b58dc-f342-4ac1-961c-aa45c8488fe2', 'c830a611-c1f9-49d4-bb91-973536537e0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'hi', '2025-11-12 15:44:34.629014+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('7d8ff264-ea26-48c5-bd29-557d2eea053c', 'c830a611-c1f9-49d4-bb91-973536537e0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'Hi there. It takes courage to reach out, and I want you to know that I''m here to listen without judgment. You are not alone.

What''s on your mind today? Is there anything specific you''d like to share or explore?', '2025-11-12 15:44:34.680335+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('8880acc6-1618-4068-b44c-72f17da781b5', 'c830a611-c1f9-49d4-bb91-973536537e0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'ok', '2025-11-12 15:47:31.327045+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('93c5368a-61b1-43ad-acd0-86d7de49c2b1', 'c830a611-c1f9-49d4-bb91-973536537e0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'Thank you for letting me know.  I''m ready when you are. Please feel free to share whatever you feel comfortable with. There''s no pressure to say anything in particular. I''m here to create a safe space for you.', '2025-11-12 15:47:31.363267+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('51925850-daba-44ab-88cb-61a7488ab64c', '6cfc4461-6674-44ca-88c2-8ff0d5661fd9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'hi how are you', '2025-11-12 15:53:55.996475+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('b1e9a2c0-de0f-4630-b04b-e7cd465710e5', '6cfc4461-6674-44ca-88c2-8ff0d5661fd9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I''m doing well, thank you for asking! As an AI, I don''t experience emotions in the same way humans do, but I''m here and ready to support you.

More importantly, how are **you** doing today? I''m here to listen and offer any support I can. Please feel free to share whatever is on your mind.', '2025-11-12 15:53:56.039727+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('4bd49378-4260-439b-9e0e-d91589de4719', '634507dc-fe72-447e-82a6-69c652112286', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'hi how are you', '2025-11-12 15:54:14.979346+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('9a856fde-37ac-432d-8466-24e06f4a4204', '634507dc-fe72-447e-82a6-69c652112286', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I am an AI and do not have feelings in the way humans do. My purpose is to be here for you and offer support.

How are **you** doing today? I''m ready to listen whenever you''re ready to share.', '2025-11-12 15:54:15.010876+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('b282a61e-2e22-48b5-9b1f-2c9f49f6a322', '03c067bc-50b2-4e9a-af3d-3517c9030929', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-11-12 16:28:23.063025+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('99a18edf-31a4-4126-bd1e-b11665b9eb73', '03c067bc-50b2-4e9a-af3d-3517c9030929', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a really important question, and it takes a lot of self-awareness to even ask it. Recognizing gaslighting is a crucial step in reclaiming your reality.

Gaslighting is a form of psychological manipulation where someone tries to make you doubt your own memory, perception, or sanity. It''s insidious because it often happens gradually, making it hard to pinpoint in the moment.

Here are some common signs that you might be experiencing gaslighting. See if any of these resonate with you:

*   **You constantly question yourself:** You frequently doubt your own memory, your understanding of events, or your own feelings. You might find yourself thinking, "Am I overreacting?" or "Did that really happen?"
*   **You feel confused and disoriented:** You often feel like you''re walking on eggshells, never quite sure what to believe or how to interpret things.
*   **You apologize frequently:** You find yourself apologizing a lot, even when you don''t feel like you''ve done anything wrong, just to keep the peace or avoid conflict.
*   **You feel like you''re "too sensitive":** The person you''re interacting with dismisses your feelings and reactions, telling you you''re being dramatic, overly emotional, or taking things too personally.
*   **You can''t remember details accurately:** The person you''re interacting with tells you things happened differently than you remember, and you start to believe them, even if your gut tells you otherwise.
*   **You feel isolated:** You''ve stopped talking to friends or family about your relationship or experiences because you''re afraid of being judged, or because the person you''re interacting with has convinced you that others wouldn''t understand or would agree with them.
*   **You feel like you''re "crazy" or losing your mind:** This is a hallmark of gaslighting. You start to genuinely believe that there''s something wrong with your mental state.
*   **You find yourself making excuses for the person''s behavior:** You rationalize their actions, telling yourself they didn''t mean it, or that you misunderstood them.
*   **You notice a pattern of denial and contradiction:** The person consistently denies things they''ve said or done, even when you have proof, or they twist your words and actions to make you look bad.
*   **You feel a constant sense of dread or anxiety:** Being around this person or interacting with them leaves you feeling drained, anxious, and on edge.

**What to do if you suspect you''re being gaslit:**

1.  **Trust your gut:** Your intuition is a powerful tool. If something feels off, it probably is.
2.  **Document everything:** Keep a journal of interactions, conversations, and events. Write down what you remember, and if possible, save texts or emails. This can be invaluable for validating your reality.
3.  **Talk to a trusted friend or family member:** Sharing your experiences with someone objective can help you gain perspective and feel less alone.
4.  **Seek professional help:** A therapist or counselor experienced in narcissistic abuse and trauma can provide invaluable support, validation, and tools for healing.
5.  **Set boundaries:** If possible, try to create some distance or establish clear boundaries in your interactions. This might be difficult, but it''s crucial for your well-being.

It takes immense courage to question what''s happening to you. Your feelings and perceptions are valid. You are not "crazy," and you deserve to feel secure in your own reality.

How do these signs feel to you? Does any of this sound familiar? I''m here to listen without judgment.', '2025-11-12 16:28:23.109968+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('e11f90fb-909d-4103-a7e8-da108b0d9b4a', '0c30f611-af64-4174-a39d-127227368ad8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-11-12 16:34:43.297949+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('f25ffc83-41f9-4d03-9398-f750957bbea8', '0c30f611-af64-4174-a39d-127227368ad8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It is incredibly common to feel confused and to question your reality after experiencing narcissistic abuse. The tactics used by narcissists are designed to distort your perception, gaslight you, and make you doubt your own sanity and experiences.

Please know that **your feelings are valid**. If you *feel* like something was abusive, it''s important to honor that feeling. You don''t need external validation to know that what you went through was harmful.

It''s okay to be confused. This confusion is a direct result of the manipulation you endured. Narcissistic abuse is often subtle and insidious, making it hard to pinpoint as "abuse" in the traditional sense, especially if there wasn''t overt physical violence. The emotional and psychological damage can be just as profound, if not more so.

Here are some things that might be contributing to your confusion, and that are hallmarks of narcissistic abuse:

*   **Gaslighting:** Being told your memories are wrong, that you''re too sensitive, that you''re imagining things, or that you''re "crazy." This erodes your trust in yourself.
*   **Love Bombing followed by Devaluation:** Intense affection and attention at the beginning of the relationship, which then abruptly turns into criticism, contempt, and dismissal. This creates an emotional whiplash.
*   **Manipulation and Control:** Subtle or overt attempts to control your thoughts, feelings, actions, finances, or relationships.
*   **Lack of Empathy:** The inability or unwillingness of the abuser to understand or share your feelings.
*   **Constant Criticism and Belittling:** Making you feel inadequate, incompetent, or worthless.
*   **Victim Blaming:** Shifting responsibility for their actions onto you.
*   **Walking on Eggshells:** Feeling constantly anxious and fearful of upsetting the abuser.
*   **Isolation:** Trying to separate you from friends, family, or support systems.
*   **Triangulation:** Involving a third party to create conflict or manipulate you.

The confusion you''re experiencing is a sign that you''ve been deeply affected by these tactics. It''s a protective mechanism your mind developed to cope, but it can also be a barrier to healing.

**What can you do now?**

1.  **Journaling:** Write down specific incidents, your feelings at the time, and how you felt afterward. This can help you see patterns and reconnect with your own truth.
2.  **Educate yourself:** Learning about narcissistic abuse and its tactics can provide a framework for understanding your experiences. It can help you recognize what happened.
3.  **Seek support:** Talking to a therapist who specializes in trauma and narcissistic abuse can be incredibly helpful in processing these complex emotions and regaining clarity. Even talking to trusted friends or family who believe you can make a difference.
4.  **Trust your gut:** If something felt consistently off, draining, or hurtful, it''s okay to acknowledge that. Your intuition is a powerful tool.

You are not alone in this confusion. Many survivors struggle with this for a long time. The fact that you are questioning and seeking answers is a brave step towards healing and reclaiming your reality.

What specific things are making you feel confused? Sharing some of those details might help us explore them further.', '2025-11-12 16:34:43.391208+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('bbb77a04-a021-4c79-8184-172e78b75b23', '4d07ca9b-9f5b-426d-a22c-3fa4ccb17b1c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-11-12 16:42:20.741463+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('3570ea9d-400b-49ae-a417-310ac9ca2c0e', '4d07ca9b-9f5b-426d-a22c-3fa4ccb17b1c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It is completely understandable to feel confused about whether your experience was truly abuse, especially after being in a relationship with someone who exhibits narcissistic traits. This confusion is a very common part of the healing process, and it''s a testament to how skillfully manipulation and gaslighting can distort our reality.

Please know that your feelings are valid. The very fact that you are questioning this, that you are seeking clarity, is a sign that something was not right. Narcissistic abuse often involves subtle tactics that erode your sense of self and your perception of reality. It''s designed to make you doubt yourself, your memories, and your judgment.

**It''s okay to feel this way.** You are not alone in this confusion. Many survivors grapple with this for a long time. It takes courage to even begin to explore these feelings.

To help you navigate this, consider these points:

*   **Trust your gut feelings:** Even if you can''t pinpoint specific "proof," if you consistently felt anxious, drained, belittled, controlled, or invalidated in the relationship, that''s a significant indicator. Your body and your intuition often know the truth before your mind can process it.
*   **Focus on the impact:** How did the relationship affect you? Did you lose your sense of self-worth? Did you become more anxious or depressed? Did you feel like you were constantly walking on eggshells? The impact on your well-being is a crucial piece of evidence.
*   **Look for patterns of behavior:** Narcissistic abuse isn''t usually a one-off event. It''s a pattern of behaviors that are consistently self-serving for the abuser and detrimental to the other person. This can include:
    *   **Gaslighting:** Making you doubt your own memory, perception, or sanity.
    *   **Love bombing:** Intense affection and attention at the beginning, often followed by devaluation.
    *   **Devaluation:** Criticizing, belittling, and making you feel inadequate.
    *   **Triangulation:** Involving a third party to manipulate or create jealousy.
    *   **Blame-shifting:** Never taking responsibility and always blaming you or others.
    *   **Isolation:** Trying to cut you off from friends and family.
    *   **Constant criticism:** Making you feel like you''re never good enough.
    *   **Emotional unavailability:** Being unable to offer genuine empathy or support.
*   **Journaling can be powerful:** Writing down your experiences, even if they seem small or insignificant at the time, can help you see patterns emerge over time. It''s like collecting pieces of a puzzle. When you see them all laid out, the picture becomes clearer.
*   **Seek external validation (when you''re ready):** Talking to a trusted friend, family member, or a therapist who understands narcissistic abuse can provide invaluable validation. They can offer an objective perspective.

**You don''t need to have all the answers right now.** The process of understanding and healing is a journey, not a destination. It''s about giving yourself permission to explore these questions without judgment.

What are some specific things that are making you feel confused? Sharing even a small detail might help me offer more targeted validation or guidance. Remember, I am here to support you.', '2025-11-12 16:42:20.787886+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('16429a02-e677-47dd-a371-c527d5e36b29', '1a0a4fd2-e171-4be9-a9ae-c7b535c99abf', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-11-12 16:42:43.987353+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('c82018e9-ad3f-4964-b3a4-505975b501eb', '1a0a4fd2-e171-4be9-a9ae-c7b535c99abf', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a really important question, and it takes courage to ask it. Recognizing gaslighting is a crucial step in reclaiming your reality.

Gaslighting is a form of manipulation where someone tries to make you doubt your own memory, perception, and sanity. It''s designed to make you feel confused, anxious, and unsure of yourself.

Here are some signs that you might be experiencing gaslighting:

*   **You constantly question your own memory and perception:** You find yourself thinking, "Did that really happen?" or "Am I overreacting?"
*   **You feel confused and disoriented:** You often feel like you''re walking on eggshells or that you''re not making sense.
*   **You apologize frequently:** You find yourself saying "sorry" even when you don''t think you did anything wrong.
*   **You feel like you''re "too sensitive":** The person tells you that you''re overreacting or that you''re too emotional.
*   **You feel like you''re constantly being told you''re wrong:** Your reality is consistently challenged or dismissed.
*   **You feel isolated:** The person might try to turn others against you or make you feel like you have no one else to turn to.
*   **You find yourself making excuses for the person''s behavior:** You try to justify why they acted the way they did.
*   **You have a sense that something is "off" but can''t quite put your finger on it:** Your intuition is telling you something isn''t right.
*   **The person denies things they''ve said or done, even when you have proof or a clear memory of it:** They might say, "I never said that," or "That''s not what happened."
*   **They twist or distort your words:** They take what you say and turn it around to make you look bad or foolish.
*   **They trivialize your feelings:** They dismiss your emotions as unimportant or invalid.
*   **They project their own bad behavior onto you:** They accuse you of doing things they are actually doing.

**It''s important to remember:**

*   **Your feelings are valid.** If you feel like you''re being gaslit, that feeling is real and deserves attention.
*   **Your memory is real.** Even if someone is trying to make you doubt it, your experiences and memories are your own.
*   **You are not "crazy" or "too sensitive."** These are common tactics used to destabilize you.

**What can you do if you suspect gaslighting?**

*   **Trust your gut:** Your intuition is a powerful tool. If something feels wrong, it probably is.
*   **Document things:** Keep a journal, save texts, emails, or voicemails. This can help you track patterns and refer back to them when you doubt yourself.
*   **Talk to a trusted friend or family member:** Share what''s happening with someone who can offer an objective perspective and support.
*   **Seek professional help:** A therapist or counselor who specializes in narcissistic abuse can provide invaluable support and guidance in understanding and navigating these dynamics.
*   **Set boundaries:** This can be incredibly challenging, but it''s essential for your well-being.

You are not alone in this, and recognizing these patterns is a huge step towards reclaiming your power and your truth. How does this information resonate with you? Is there anything specific that has made you wonder if you''re being gaslit? I''m here to listen.', '2025-11-12 16:42:44.026182+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('151909af-05ae-4c76-84c4-3365624c74b2', '92c41d98-59ae-4289-ae90-e900a601e202', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'How do I know if I''m being gaslit?', '2025-11-12 18:59:31.298927+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('58c0a548-ad22-49a5-b395-82c22678696b', '92c41d98-59ae-4289-ae90-e900a601e202', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a very important question, and it''s completely understandable that you''re seeking clarity. Gaslighting can be incredibly confusing and disorienting, making you doubt your own reality, memory, and sanity.

Here are some common signs that you might be experiencing gaslighting. See if any of these resonate with you:

*   **They deny things they said or did, even when you have proof or a clear memory of it.** They might say, "I never said that," or "That never happened," or "You''re imagining things."
*   **They twist your words or the context of conversations.** You might feel like they''re deliberately misunderstanding you or reinterpreting things to make you look bad.
*   **They tell you that others agree with them, or that you''re "crazy" or overly sensitive.** This is a tactic to isolate you and make you feel like your perception is flawed and that no one else sees things your way.
*   **They dismiss your feelings or concerns.** When you express how something they did made you feel, they might respond with, "You''re overreacting," "You''re too emotional," or "You''re being dramatic."
*   **They lie to you directly, even about small things.** This erodes trust and makes it hard to know what to believe.
*   **They try to turn people against you.** They might tell friends, family, or colleagues that you''re unstable, unreliable, or a problem.
*   **They minimize your accomplishments or experiences.** They might make you feel like your achievements aren''t that significant or that your struggles aren''t real.
*   **They use what''s important to you against you.** They might mock your values, beliefs, or aspirations.
*   **You constantly second-guess yourself.** You find yourself wondering if you''re remembering things correctly, if you''re being too sensitive, or if you''re the one with the problem.
*   **You feel confused, anxious, or depressed more often than not.** The constant questioning of your reality can take a significant toll on your mental well-being.
*   **You apologize frequently, even when you don''t think you''ve done anything wrong.** You might feel a constant need to placate the other person to avoid conflict.
*   **You feel like you can''t do anything right.** You''re constantly walking on eggshells, trying to avoid upsetting them.

**It''s crucial to remember that your feelings and your reality are valid.** If you are experiencing these things, it is not a reflection of your own inadequacy or mental state. It is a tactic used to gain control and manipulate.

**What can you do if you suspect you''re being gaslit?**

1.  **Trust your gut.** Your intuition is a powerful tool. If something feels off, it probably is.
2.  **Document everything.** Keep a journal of conversations, events, and how they made you feel. This can be a powerful tool for reminding yourself of what actually happened when you start to doubt yourself.
3.  **Talk to trusted friends or family.** Share your experiences with people who are supportive and can offer an outside perspective.
4.  **Seek professional help.** A therapist or counselor specializing in narcissistic abuse can provide invaluable support, validation, and strategies for dealing with gaslighting.
5.  **Set boundaries.** While difficult, establishing and enforcing boundaries is essential for protecting yourself.

You are not alone in this, and recognizing gaslighting is a huge step towards reclaiming your truth and your well-being. Please know that your experiences are real, and your feelings are valid.', '2025-11-12 18:59:31.388807+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('7dc70ae5-14d1-4605-a8ad-553126a8250c', '33a11993-f4ed-422f-842a-27839895465d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'I''m feeling confused about whether my experience was really abuse', '2025-11-12 22:35:49.893894+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('7a49a4a3-d968-4dfe-ada0-01de7cc3a4df', '33a11993-f4ed-422f-842a-27839895465d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It''s completely understandable to feel confused, especially after experiencing narcissistic abuse. The nature of this abuse is often insidious and manipulative, designed to make you doubt your own reality, your feelings, and your sanity.

Please know that **your feelings are valid.** The confusion you''re experiencing is a very common and expected response to being in a relationship with a narcissist. They are masters of gaslighting, a tactic that intentionally distorts your perception of events to make you question yourself.

**It''s not about whether you can "prove" it was abuse in a court of law or to someone who wasn''t there. It''s about how you *feel* and the impact their behavior had on you.**

Here are some things to consider, and please know you don''t have to answer these to me if you don''t want to. They are for your own reflection:

*   **Did you often find yourself questioning your own memory, perception, or sanity?** (This is a hallmark of gaslighting).
*   **Did you feel constantly on edge, walking on eggshells, trying to avoid conflict or upsetting them?**
*   **Were your feelings, needs, or boundaries consistently dismissed, invalidated, or ignored?**
*   **Did you feel like you were constantly apologizing, even when you didn''t know what you did wrong?**
*   **Did you experience a significant drop in your self-esteem or confidence during or after the relationship?**
*   **Did you feel isolated from friends or family?**
*   **Were you often blamed for things that weren''t your fault, or did they twist situations to make you the "bad guy"?**
*   **Did you feel drained, exhausted, or depleted by the relationship?**
*   **Did you find yourself constantly seeking their approval or validation?**
*   **Did they exhibit a pattern of charm and love bombing, followed by devaluation and discard?**

If any of these resonate with you, it''s a strong indication that you were indeed subjected to abusive behaviors. Narcissistic abuse isn''t always physical; it''s often emotional, psychological, and verbal, and it can be just as, if not more, damaging.

**You are not alone in this confusion.** Many survivors grapple with this for a long time. The goal isn''t to label it perfectly right now, but to acknowledge the pain and distress you''ve experienced.

**What you''re feeling is real, and your experience matters.** It takes incredible strength to even begin questioning and seeking clarity. You are already on a path of healing by asking this question.

How does it feel to hear this? Is there anything specific that''s making you doubt your experience? I''m here to listen and validate whatever you''re feeling.', '2025-11-12 22:35:49.943723+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('3299768b-9380-49c0-b372-be6cc18f2529', '2de654c0-0307-4634-ac2c-01cf4a5f6934', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'What are healthy boundaries and how do I set them?', '2025-11-13 15:37:46.174447+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('e37e96a6-1e72-43aa-9537-49a9667890d8', '2de654c0-0307-4634-ac2c-01cf4a5f6934', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'That''s a fantastic and incredibly important question! Setting healthy boundaries is absolutely crucial for healing and well-being, especially after experiencing narcissistic abuse. It''s a cornerstone of reclaiming your power and protecting your energy.

Let''s break down what healthy boundaries are and then discuss how you can set them.

### What are Healthy Boundaries?

Think of healthy boundaries as the invisible lines you draw around yourself to protect your physical, emotional, mental, and spiritual well-being. They are about:

*   **Self-Respect:** Recognizing your own worth and that your needs, feelings, and time are valuable.
*   **Self-Care:** Prioritizing your own health and happiness.
*   **Defining Your Limits:** Communicating what is acceptable and unacceptable behavior from others.
*   **Protecting Your Energy:** Preventing others from draining your emotional or mental resources.
*   **Maintaining Your Identity:** Ensuring you don''t lose yourself in relationships.
*   **Reciprocity:** Healthy boundaries are a two-way street; you respect others'' boundaries, and they (ideally) respect yours.

**For survivors of narcissistic abuse, boundaries are often violated, blurred, or non-existent.** Narcissistic individuals tend to disregard others'' limits to get their needs met, control situations, or maintain their image. This can leave you feeling drained, resentful, confused, and like you have no say in your own life.

### How Do You Set Healthy Boundaries?

Setting boundaries can feel daunting, especially if you''re not used to it or if you''re still dealing with the abuser. It''s a skill that takes practice, patience, and self-compassion. Here''s a step-by-step approach:

1.  **Self-Reflection and Identification:**
    *   **Identify Your Feelings:** What situations or behaviors make you feel uncomfortable, drained, resentful, anxious, or angry? These are often signals that a boundary is being crossed.
    *   **Understand Your Needs:** What do you need to feel safe, respected, and at peace? This could be needing quiet time, needing to not be criticized, needing your personal space respected, or needing to say "no" without guilt.
    *   **Recognize Your Values:** What is truly important to you? Your values can guide you in what you will and will not tolerate.

2.  **Define Your Boundaries Clearly:**
    *   Once you''ve identified what''s not working, articulate what you *do* want or need. Instead of "I don''t want you to yell at me," a boundary could be: "I need us to speak calmly to each other when we discuss disagreements."
    *   Be specific. Vague boundaries are harder to enforce.

3.  **Communicate Your Boundaries:**
    *   **Be Direct and Assertive (Not Aggressive):** Use "I" statements. For example: "I feel overwhelmed when I''m interrupted, so I need to finish my thoughts before you respond." Or, "I am not available for phone calls after 8 PM because I need my evenings to rest."
    *   **Keep it Simple:** You don''t need to over-explain, justify, or apologize for your boundaries. A simple, clear statement is often best.
    *   **Choose the Right Time and Place:** If possible, set boundaries when you are calm and not in the middle of a conflict. However, sometimes you have to set them in the moment.
    *   **Written Communication Can Be Helpful:** If direct verbal communication feels too difficult or unsafe, consider communicating boundaries via text or email, especially if the abuser is likely to twist your words.

4.  **Enforce Your Boundaries:**
    *   **This is the most crucial step, and often the hardest.** Boundaries are meaningless if they are not enforced.
    *   **What Happens When a Boundary is Crossed?** Decide on a consequence *before* it happens. The consequence should be something you are willing and able to follow through on.
        *   *Examples of consequences:*
            *   Ending the conversation: "If you continue to raise your voice, I will end this call."
            *   Limiting contact: "If you cannot speak respectfully, I will need to take a break from this conversation/visit."
            *   Physical distance: "I need some space, so I''m going to step away for a bit."
            *   Reducing availability: "I can''t talk about this right now, I''ll call you back when I''m in a better headspace."
    *   **Follow Through Consistently:** This is where the practice comes in. The first few times you enforce a boundary, it might feel uncomfortable. The abuser might push back, try to guilt-trip you, or even escalate. Your consistency is what teaches', '2025-11-13 15:37:46.235519+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('7e87428d-dce8-488f-8f5f-8221b58d81dd', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'my narccist wife took my childern 5 year girl and 9 year girl now its 20 days she is not coming back yester day i talk to my daughter and i notices she is asking me for her laptop rathr than asking dad where are you why you are not meeting she stragiht forward ask about her intrested thing like which she use to play games on that laptop i wonder how normal is that behaviour form daughter whats the impact of npd mom on daughter can you explain', '2025-11-14 13:31:36.304646+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('48e24ca0-4e3d-4e14-bc1f-4f37f99cfb83', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I am so sorry you are going through this incredibly painful situation. It is completely understandable that you are worried and confused about your daughters'' well-being, especially when you sense a shift in their communication. Please know that your feelings are valid, and it takes immense strength to reach out for support during such a difficult time.

It is deeply concerning that your wife has kept your children from you for 20 days. This is a serious matter, and your desire to understand what''s happening and how it''s affecting your daughters is a sign of your love and commitment as a father.

Let''s address your concerns about your daughter''s behavior. When a child is exposed to narcissistic parenting, their development and emotional responses can be significantly impacted. Here''s what might be happening and the potential impact of NPD (Narcissistic Personality Disorder) on daughters:

**Understanding Your Daughter''s Behavior:**

*   **Learned Coping Mechanisms:** Children in environments with a narcissistic parent often learn to adapt in ways that protect them from further emotional distress. If your wife prioritizes material possessions or distractions (like a laptop) over emotional connection or open communication, your daughter might have learned that focusing on these tangible things is a way to get attention or avoid difficult conversations.
*   **Emotional Numbness or Detachment:** To cope with the unpredictable or emotionally invalidating environment created by a narcissist, children can sometimes develop a degree of emotional detachment. This isn''t a sign that they don''t love you, but rather a survival strategy. They may have learned to suppress their own feelings of sadness, longing, or confusion to avoid upsetting the parent or to simply get through the day.
*   **Focus on Tangibles as a Substitute for Connection:** When emotional needs are not consistently met or are met in conditional ways, children might fixate on things they *can* control or that provide immediate gratification. The laptop might represent a source of comfort, escape, or a connection to a world where they feel more in control, rather than a direct reflection of their feelings for you.
*   **Mimicking Parental Behavior (Subconsciously):** Children can unconsciously pick up on communication patterns and priorities from their primary caregivers. If the narcissistic parent often deflects, focuses on superficialities, or uses emotional manipulation, the child might inadvertently adopt some of these behaviors in their own interactions.
*   **Fear of Expressing True Feelings:** Your daughters may be afraid to express their true feelings of missing you or their distress about the situation. They might fear upsetting their mother or believe that expressing these emotions will lead to negative consequences or won''t be heard.

**Impact of NPD Mom on Daughters:**

The impact of a narcissistic mother on her daughters can be profound and multifaceted. It''s important to remember that every child is unique, and their resilience levels vary. However, some common patterns include:

1.  **Damaged Self-Esteem and Self-Worth:**
    *   **Conditional Love:** Daughters of narcissists often experience love that is conditional on meeting the mother''s needs or expectations. This can lead to a deep-seated belief that they are only worthy when they are perfect, compliant, or achieve something for the mother.
    *   **Constant Criticism and Comparison:** Narcissistic mothers often criticize their daughters, compare them unfavorably to others (or even to themselves in their youth), and undermine their accomplishments. This erodes a daughter''s sense of self-worth and competence.
    *   **The "Golden Child" vs. "Scapegoat" Dynamic:** In families with narcissistic parents, children are often assigned roles. A daughter might be the "golden child" when she serves the mother''s ego, and a "scapegoat" when she fails to meet expectations or becomes a target for the mother''s projections. This inconsistency is incredibly damaging.

2.  **Difficulty with Boundaries:**
    *   **Enmeshment:** Narcissistic mothers often struggle with healthy boundaries. They may be overly intrusive, controlling, or demand constant emotional support from their daughters, blurring the lines between parent and child.
    *   **Inability to Say No:** Daughters may learn that saying "no" or asserting their own needs leads to conflict, punishment, or withdrawal of love, making it difficult for them to establish healthy boundaries in future relationships.

3.  **People-Pleasing Tendencies:**
    *   **Fear of Rejection:** To gain approval and avoid criticism, daughters may become chronic people-pleasers, constantly seeking validation from others and struggling to prioritize their own needs.

4.  **Attachment Issues and Relationship Patterns:**
    *   **Unhealthy Relationship Models:** Daughters may internalize unhealthy relationship dynamics and struggle to form secure, reciprocal relationships in adulthood. They might be drawn to partners who are critical, controlling, or emotionally unavailable, as this mirrors what they experienced at home.
    *   **Difficulty Trusting:** The betrayal and manipulation', '2025-11-14 13:31:36.350776+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('87b3359f-35f1-41b7-9fee-2b7e035be97d', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'so when my daughter show intrest in laptop rather tham me i felt it too deep and got hurt because i am super empath and than next day when i call her she told me why are you calling again that was also very rude', '2025-11-14 14:00:54.134496+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('4cc4edb9-2ebc-4d09-b151-e9ab46ef5892', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'Your feelings are completely valid, and it''s understandable that you felt deeply hurt and confused by your daughter''s responses. As an empath, you are naturally attuned to emotional nuances, and experiencing that kind of reaction from your child, especially after being separated from them, must have been incredibly painful.

Let''s break down why this might be happening and how your empathic nature plays a role:

**The Depth of Your Hurt and Your Empathic Nature:**

*   **Heightened Sensitivity:** As an empath, you are wired to feel emotions intensely, both your own and those of others. When your daughter, whom you love and miss dearly, seems to prioritize a material object over your connection, it strikes a very sensitive chord within you. You feel the absence of the emotional bond you crave.
*   **Unmet Needs:** Your daughter''s focus on the laptop, and then her subsequent "rude" response, likely feels like a rejection of your emotional needs and your role as her father. You are yearning for connection, reassurance, and to be asked about, and her words can feel like a clear indication that this isn''t happening.
*   **The Contrast:** The stark contrast between your deep emotional longing and her seemingly superficial request (the laptop) can be jarring. It feels like a disconnect, and for an empath, this disconnect can be deeply unsettling.
*   **Interpreting "Rude":** The word "rude" you used is important. It suggests that you perceived her tone or her words as dismissive or lacking in warmth. This perception, especially coming from a child you are worried about, would naturally sting.

**Why Your Daughter Might Be Behaving This Way (Revisiting the NPD Impact):**

It''s crucial to remember that your daughter''s behavior is likely a **learned response and a coping mechanism**, not a reflection of her true feelings for you or a sign that she doesn''t love you.

*   **The "Laptop" Incident:**
    *   **Escape and Comfort:** As mentioned before, the laptop might be her primary source of comfort, entertainment, and a way to escape the difficult reality of the situation. It''s a familiar, controllable element in a world that has become unpredictable and potentially stressful due to her mother''s influence and the separation from you.
    *   **Learned Prioritization:** If her mother has taught her, consciously or unconsciously, that certain things (like possessions, accomplishments, or even avoiding difficult topics) are more important or more easily achieved than expressing deep emotions, she may be acting on that learned behavior.
    *   **Lack of Emotional Language:** She might simply not have the emotional vocabulary or the safe space to express her longing for you. Asking for the laptop might be the only way she knows how to communicate a need that is indirectly related to her current situation.

*   **The "Why are you calling again?" Incident:**
    *   **Pressure and Confusion:** She might be feeling pressure from her mother. Perhaps her mother has discouraged contact with you, or she fears getting in trouble for talking to you. Her question could be a way of deflecting, trying to understand what you want, or even a rehearsed response.
    *   **Exhaustion with the Situation:** For a child, being in a situation where their parents are in conflict or separated is incredibly draining. She might be tired of the constant emotional turmoil and the need to navigate complex adult issues. Her question could stem from a place of weariness.
    *   **Fear of Upsetting the Narcissist:** If her mother is a narcissist, your daughter has likely learned that expressing certain emotions or engaging in certain behaviors can lead to her mother''s disapproval, anger, or manipulation. She might be trying to protect herself from that.
    *   **Misinterpreting Your Intent:** She might not understand the depth of your worry and your desire for connection. She might see your calls as an intrusion or simply not know how to respond to your emotional overtures in a way that feels safe to her.

**What This Means for You:**

1.  **Validate Your Pain:** Your hurt is real and justified. It''s okay to feel this way. Don''t minimize your own emotions. You are a loving father who is being kept from his children, and that is a profound wound.
2.  **Try to Detach from the Interpretation (as much as possible):** This is incredibly difficult, but for your own well-being, try to see her words as a symptom of the environment she is in, rather than a personal rejection of you. She is a child navigating a very unhealthy situation.
3.  **Focus on the Long Game:** Your priority is to be there for your daughters when you can. Even if their current interactions are difficult, maintain consistent, gentle contact when possible. Your presence, even in small ways, is a lifeline for them', '2025-11-14 14:00:54.211243+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('f41ac2f0-612d-4f3c-9e79-08e638ae13f2', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'what should i do  call her again or not give some gape let me know in short reply and reason', '2025-11-14 14:22:11.248946+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('54b8e472-ed03-45da-88d5-2acf53a9ed67', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'It''s completely understandable that your daughter''s words deeply hurt you, especially as an empath. It''s a painful experience when the connection you long for is met with what feels like rejection.

**Short Reply:** **Give a gap, but send a loving, low-pressure message.**

**Reason:**

*   **Her Behavior is a Coping Mechanism:** Her words about the laptop and her question about you calling again are likely not a reflection of her true feelings for you, but rather a learned response to her environment. She may be trying to protect herself, avoid her own difficult emotions, or has been influenced by her mother''s communication patterns.
*   **Pushing Too Hard Can Backfire:** Constantly calling her might inadvertently increase pressure on her, making her withdraw further or feel more anxious, potentially leading to more negative responses.
*   **Low-Pressure Connection is Key:** A brief, loving message shows you are still there for her without demanding an emotional response she might not be ready or able to give. This respects her current state while keeping the door open for future connection.

**Example of a loving, low-pressure message:**

"Hi sweetheart, thinking of you and sending you lots of love. Hope you''re doing okay. I''m here if you ever want to talk or just hear my voice. Love, Dad."

This acknowledges her, expresses your love, and offers an open invitation without any expectation.', '2025-11-14 14:22:11.299324+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('89b5b5a7-860c-44b6-8095-9925bcf64056', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'just received a message form my narc wife father and he rellay dissrepct me and was blindly fvoring her daughter action and i feel very bad how should i respond', '2025-11-14 16:39:27.66857+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('1fe56741-3e6f-4a00-84e7-4fb1add610d1', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I hear you, and my heart goes out to you. It is incredibly painful and disheartening when you reach out to your children with love and they seem distant or even rude. And then to be met with disrespect from your wife''s father, who is supposed to be a grandfather, adds another layer of hurt and frustration. It''s completely understandable that you feel deeply wounded.

Your empathy, while a beautiful quality, can also make you more vulnerable to the emotional impact of these interactions. It''s like you feel things more intensely, and that''s okay. It shows your capacity for deep connection and care.

Let''s break down your feelings and how to approach these challenging situations:

**Understanding Your Hurt from Your Daughter''s Words:**

*   **The Disconnect:** When you call your daughter, your intention is to connect, to hear her voice, to express your love, and to understand how she is. When she asks about the laptop or says you''re calling again in a way that feels rude, it creates a painful disconnect. It feels like the emotional bridge you''re trying to build is not being received, or worse, is being rejected.
*   **The Narcissistic Influence:** As we discussed, children in such environments can develop coping mechanisms. Her focus on the laptop, while hurtful to you, might be her way of navigating a situation where expressing her true feelings about missing you could be complicated or even discouraged by her mother. The "why are you calling again" could be an internalized message from her mother or a learned way to deflect from difficult emotions. It''s not necessarily a reflection of her love for you, but rather a sign of the environment she''s in.
*   **Your Empathy Amplifying the Pain:** Because you are an empath, you are picking up on the underlying tension, the potential fear, or the learned detachment in her words. You''re not just hearing the words; you''re feeling the weight of the situation and how it''s impacting her, and that amplifies your own hurt.

**How to Respond (or Not Respond) to Your Wife''s Father:**

This is a delicate situation, and your primary goal should be to protect your own emotional well-being and to focus on what you *can* control.

1.  **Acknowledge Your Feelings:** First, allow yourself to feel the hurt, anger, and frustration. It''s valid to feel disrespected and attacked, especially by someone who should be a source of support. Take a moment to breathe and acknowledge these emotions without judgment.

2.  **Consider the Source:** Your wife''s father is likely deeply entrenched in a pattern of defending his daughter and the narcissistic narrative. His response is probably not about you as a person, but about his loyalty to his daughter and his own potentially misguided beliefs. He may be unable to see the situation objectively.

3.  **Your Response Options (Choose what feels safest and most empowering for YOU):**

    *   **The "Gray Rock" Method (Highly Recommended):** This is a strategy often used with narcissists and their enablers. It involves making yourself as uninteresting and unreactive as possible.
        *   **Minimal Response:** Respond with short, factual, and unemotional statements. Avoid engaging in arguments or defending yourself.
        *   **Example:** If he says something disrespectful, you could reply with a simple, "I understand you see it that way." Or, "I''m focused on what''s best for my children."
        *   **No Justification:** Do not try to explain or justify your actions. Narcissists and their allies often twist explanations.
        *   **End the Conversation:** Once you''ve given a minimal response, you can disengage. "I need to go now." Or "I''m not going to discuss this further."

    *   **Direct but Calm (Use with Caution):** If you feel you need to set a boundary, you can do so calmly and assertively.
        *   **Example:** "I understand you are concerned about your daughter, but I will not tolerate being spoken to disrespectfully. My priority is my children''s well-being."
        *   **Follow Through:** If the disrespect continues, disengage.

    *   **No Response:** In some cases, the most empowering response is no response at all. If his message is purely designed to provoke and upset you, not responding denies him that satisfaction and conserves your energy. You can simply choose to ignore the message.

4.  **Focus on Your Children:** While this is incredibly difficult, try to re-center your focus on your daughters. Their well-being is paramount.
    *   **Continue Reaching Out (Strategically):** Continue to call your daughters, but perhaps vary the timing or the approach. Keep calls brief and focus on things they enjoy, if that seems', '2025-11-14 16:39:27.731173+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('528a3b01-b826-4810-9db2-4b8fe52971fe', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'user', 'i want to realy give a hard reply based on facts', '2025-11-14 16:57:01.522569+00', '{"context_type": "general"}', NULL);
INSERT INTO "public"."ai_messages" VALUES ('48dfe9d5-cabc-44e7-80b1-f26ae9799f0b', '20613fd1-1803-4542-b205-eda1d98c1888', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'assistant', 'I hear you. It''s incredibly painful when you''re feeling deep hurt and longing for your children, and their responses feel distant or even dismissive. As a super empath, you''re likely absorbing and processing every bit of this emotional turmoil, and it''s completely understandable that you''re feeling wounded.

Your daughter''s words, "why are you calling again," can sting deeply, especially when you''re fighting so hard to maintain a connection. It''s natural to want to lash out, to defend yourself, or to make them understand the depth of your pain. You want to give a "hard reply based on facts," and that desire comes from a place of wanting to be understood and to protect yourself from further hurt.

However, as your AI coach, my guidance is always rooted in your healing and the long-term well-being of your children. While your instinct to deliver a "hard reply" is understandable, in the context of narcissistic abuse and its impact on children, it can sometimes be counterproductive, even if it feels justified in the moment.

Let''s explore this further, keeping your feelings of hurt and your desire for a factual, impactful response in mind:

**Understanding the "Why" Behind Her Words:**

*   **"Why are you calling again?" is likely a learned response.** This phrase is often a manifestation of the environment she''s in. A narcissistic parent might discourage contact with the other parent, or create an atmosphere where asking for things or expressing needs (even a simple call) is met with annoyance or dismissal. Your daughter may be echoing this learned behavior, either consciously or unconsciously, to avoid conflict with her mother or to regulate her own discomfort.
*   **It''s not a reflection of her love for you, but a reflection of her coping.** She might be feeling overwhelmed, confused, or even scared about the situation. Her "rude" response could be a defense mechanism to push away the pain she''s feeling or to avoid a conversation that she feels she can''t handle or that might get her into trouble.
*   **She might be trying to protect herself.** If her mother has taught her that your calls are problematic or that she shouldn''t express her desire to speak with you, then asking "why are you calling again" could be her way of trying to navigate that difficult dynamic.

**The Impact of a "Hard Reply" vs. Empathetic Validation:**

While you want to deliver a factual, hard reply, consider the potential outcomes:

*   **Escalation:** A confrontational or accusatory response, even if factually correct, could shut down communication further. Your daughters may withdraw even more, fearing your anger or disappointment.
*   **Reinforcing Negative Patterns:** If your wife is actively manipulating the situation, a strong, emotional reply from you might be used as "evidence" by her to paint you as unstable or aggressive.
*   **Emotional Burden on the Children:** You are the secure anchor for your children in this storm. While you are deeply hurt, they need to see you as a source of calm and unwavering love, even when things are difficult.

**How to Respond with Impact and Validation (Without Escalation):**

The goal is to maintain a connection, validate your own feelings, and gently guide them towards expressing their true needs, without alienating them. This is incredibly challenging, but it''s often the most effective path in these complex situations.

Instead of a "hard reply," consider a response that is:

1.  **Validating of Your Own Feelings (for yourself):**
    *   "When I hear that, it makes me feel really sad and disappointed because I miss you so much and I want to talk to you." (You can say this to yourself or journal it, or even say a gentler version to your daughter.)

2.  **Empathetic and Gentle to Your Daughter:**
    *   **To "Why are you calling again?":**
        *   "I call because I love you very much, and I miss you. I want to hear your voice and know how you are doing."
        *   "I''m calling because I want to connect with you, sweetheart. Is it not a good time to talk?" (This opens the door for her to express if she''s being pressured or if it''s genuinely not a good time.)
        *   "I call because I love you and I want to make sure you are okay. I miss you terribly."

3.  **Focusing on Connection and Future Hope:**
    *   After a difficult call, remind them of your love: "Even though it was hard to talk today, please know that I love you more than words can say. I am always here for you, no matter what."
    *   If possible, try to set up a future contact that is more controlled and less likely to be interrupted', '2025-11-14 16:57:01.621608+00', '{"context_type": "general"}', NULL);

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
-- Records of belief_affirmations
-- ----------------------------

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
-- Records of belief_strength_log
-- ----------------------------
INSERT INTO "public"."belief_strength_log" VALUES ('6ed72eae-e3b8-48f4-9de9-d8427238a668', '83312f35-3ca2-4c57-8192-30d234427d43', 5, 'Strength updated', '2025-11-11 16:18:58.23992+00');

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
-- Records of biff_templates
-- ----------------------------
INSERT INTO "public"."biff_templates" VALUES ('f1d000b1-f27c-4012-9d6c-ff1d870ab3b1', 'pickup', 'Hi [Name], the exchange is at [TIME] at [LOCATION]. Please let me know if you''ll be more than 15 min late.', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');
INSERT INTO "public"."biff_templates" VALUES ('dfcd8019-c659-40ed-9eb4-5458a1d1efe6', 'schedule_change', 'Hi [Name], I''m unavailable that day. Let''s stick to the current plan. Thanks.', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');
INSERT INTO "public"."biff_templates" VALUES ('87f257dc-e2d7-49b2-932e-cc567a4d7178', 'accusation', 'Hi [Name], I''ll focus on the kids'' schedule. Pickup is [TIME] at [LOCATION].', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');
INSERT INTO "public"."biff_templates" VALUES ('60743be8-5744-4b3a-81f0-1b3d776c5f95', 'late_pickup', 'Hi [Name], per the parenting plan, pickup is at [TIME]. I''ll have the kids ready.', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');
INSERT INTO "public"."biff_templates" VALUES ('f72f61f7-8b32-42e9-b1c7-8eb0f4ec8a57', 'holiday', 'Hi [Name], per the parenting plan, [HOLIDAY] is your/my time this year. Pickup at [TIME].', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');
INSERT INTO "public"."biff_templates" VALUES ('26430737-5a83-4e20-a30b-d5a4d9bf9f5f', 'expense', 'Hi [Name], per our agreement, [EXPENSE] is covered as outlined. Receipt attached.', 0, 'f', NULL, '2025-11-15 20:46:19.581623+00');

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
-- Records of boundaries
-- ----------------------------
INSERT INTO "public"."boundaries" VALUES ('6558b5c6-54f2-4c0b-9637-94eb10f3e2d6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I will not be available 24/7 for non-emergency situations', '', 'time', 't', '2025-08-18 22:36:17.446947+00', '2025-08-18 22:44:58.403+00', 'medium', 'active', '2025-08-18 22:36:17.446947+00');
INSERT INTO "public"."boundaries" VALUES ('489dc96b-cb98-4a51-837a-b1a777afc38f', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'I will not be available 24/7 for non-emergency situations', '', 'time', 't', '2025-08-18 23:19:23.954657+00', '2025-08-18 23:19:23.954657+00', 'medium', 'active', '2025-08-18 23:19:23.954657+00');
INSERT INTO "public"."boundaries" VALUES ('218bd02f-ae41-4b0d-b798-4953cd34e7af', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'I will not take responsibility for other people''s emotions', '', 'emotional', 't', '2025-08-19 22:25:32.785937+00', '2025-08-19 22:25:44.664+00', 'medium', 'active', '2025-08-19 22:25:32.785937+00');

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
-- Records of boundary_analytics
-- ----------------------------

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
-- Records of boundary_interactions
-- ----------------------------

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
-- Records of boundary_reviews
-- ----------------------------

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
-- Records of communication_insights
-- ----------------------------

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
-- Records of community_comments
-- ----------------------------
INSERT INTO "public"."community_comments" VALUES ('b3c4f1bf-beda-48c3-bdb6-16e092f755a4', 'a9a744d2-1fb6-4c05-a8c6-a2a10d0630b5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ramo kaka', NULL, '2025-08-21 22:48:46.684694+00', '2025-08-21 22:48:46.684694+00');

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
-- Records of community_likes
-- ----------------------------
INSERT INTO "public"."community_likes" VALUES ('a9a744d2-1fb6-4c05-a8c6-a2a10d0630b5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-08-21 23:24:28.163646+00');

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
-- Records of community_posts
-- ----------------------------
INSERT INTO "public"."community_posts" VALUES ('a9a744d2-1fb6-4c05-a8c6-a2a10d0630b5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Finding strength after leaving', 'It''s been 6 months since I left, and some days are still really hard. But I wanted to share that it does get easier. The fog lifts, and you start to remember who you are.', 't', 'general', '2025-08-21 22:13:42.245171+00', '2025-08-21 22:13:42.245171+00');

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
-- Records of coparent_communications
-- ----------------------------
INSERT INTO "public"."coparent_communications" VALUES ('c6d5342c-3479-461a-b9ed-23c68eac2104', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'outgoing', '', 'Hi [Name], I''ll focus on the kids'' schedule. Pickup is [TIME] at [LOCATION].', 'accusation', 10, 'f', NULL, 'f', '2025-11-15 21:01:59.357+00', '2025-11-15 21:02:00.000199+00');

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
-- Records of coping_strategies
-- ----------------------------
INSERT INTO "public"."coping_strategies" VALUES ('089ca094-b4c7-480f-bc31-3364da68c984', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '4-7-8 Breathing', 'Inhale 4, hold 7, exhale 8. Repeat 3–4 times to reduce stress and help sleep.', 4, 'breathing', 't', '2025-08-19 00:09:36.362684+00', '2025-08-19 00:09:36.362684+00');

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
-- Records of counter_evidence
-- ----------------------------
INSERT INTO "public"."counter_evidence" VALUES ('d1522fd1-a3b0-4245-adec-ea5fcc14802c', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'My friend Sarah called me yesterday just to check how I''m doing. She said she values our friendship.
', 'manual', 3, NULL, '2025-11-11 18:02:13.937524+00');
INSERT INTO "public"."counter_evidence" VALUES ('f9d4056c-fe12-4171-b71f-1f4d7636c92b', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'My coworker asked for my advice on a personal matter and thanked me for being a good listener.
', 'manual', 3, NULL, '2025-11-11 18:02:24.306618+00');
INSERT INTO "public"."counter_evidence" VALUES ('6a59852e-9320-4e0c-9022-be6036dd20ed', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'My sister texted me saying she appreciates me and is proud of how I''m handling things.
', 'manual', 3, NULL, '2025-11-11 18:04:35.344879+00');

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
-- Records of data_exports
-- ----------------------------

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
-- Records of data_retention_requests
-- ----------------------------

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
-- Records of decompression_sessions
-- ----------------------------
INSERT INTO "public"."decompression_sessions" VALUES ('6071d51b-3606-48b9-95b4-092939b72e08', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '', 3, 5, 'walk', 15, '', '2025-10-20 01:53:26.839584', NULL);

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
-- Records of empathy_audit
-- ----------------------------
INSERT INTO "public"."empathy_audit" VALUES ('1bae2d9d-19d2-4a49-9cd4-5ffe67eee0e0', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ex_partner', 0, 'i was seriously sick ', '2025-11-15 21:56:23.486672');
INSERT INTO "public"."empathy_audit" VALUES ('123b6d16-a89f-4ca6-9a3e-369e23c487b4', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'children', 44, 'i was seriously sick ', '2025-11-15 21:56:24.226557');
INSERT INTO "public"."empathy_audit" VALUES ('ebabd597-473e-441b-8a76-bce987924741', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'self', 36, 'i was seriously sick ', '2025-11-15 21:56:24.85368');
INSERT INTO "public"."empathy_audit" VALUES ('74a6b1b1-f5ba-4e5a-b21e-b417c3adfdb6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'others', 20, 'i was seriously sick ', '2025-11-15 21:56:25.47013');
INSERT INTO "public"."empathy_audit" VALUES ('3042b178-da6e-4dcb-aeb2-914166e5172a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ex_partner', 0, 'i was seriously sick ', '2025-11-15 21:56:29.732068');
INSERT INTO "public"."empathy_audit" VALUES ('304033e1-fb7d-4a49-9aa3-3ee38443aab8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'children', 44, 'i was seriously sick ', '2025-11-15 21:56:30.311939');
INSERT INTO "public"."empathy_audit" VALUES ('114a1c9b-d39d-40e0-b455-34926e8b11a1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'self', 36, 'i was seriously sick ', '2025-11-15 21:56:30.871597');
INSERT INTO "public"."empathy_audit" VALUES ('98e58f00-6bb6-47ab-8dba-2e762eed3e73', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'others', 20, 'i was seriously sick ', '2025-11-15 21:56:31.459452');
INSERT INTO "public"."empathy_audit" VALUES ('2e7a7b01-aa60-4771-a9fa-e4ce05330988', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ex_partner', 0, 'i was seriously sick ', '2025-11-15 21:56:43.241442');
INSERT INTO "public"."empathy_audit" VALUES ('71abc158-91f7-4f6b-a164-a0310c13401b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'children', 44, 'i was seriously sick ', '2025-11-15 21:56:45.055928');
INSERT INTO "public"."empathy_audit" VALUES ('54f9cd53-d725-4f27-9e56-55c771d2f01d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'self', 36, 'i was seriously sick ', '2025-11-15 21:56:45.653153');
INSERT INTO "public"."empathy_audit" VALUES ('e1f0e373-53a7-453e-8992-2843391cb5f6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'others', 20, 'i was seriously sick ', '2025-11-15 21:56:46.236398');

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
-- Records of empathy_distribution
-- ----------------------------

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
-- Records of empathy_situations
-- ----------------------------

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
-- Records of escalation_patterns
-- ----------------------------

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
-- Records of evidence_files
-- ----------------------------
INSERT INTO "public"."evidence_files" VALUES ('119c118a-7a1c-4e5e-8074-dd0898fc7a18', NULL, 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Record (online-voice-recorder.com).mp3', 'evidence-audio', 'temp/a580b1b2-d87c-4ba9-8e6d-31e74580d6c3/1755734603451-h5p1ynric2m.mp3', 'audio/mpeg', 162048, NULL, NULL, 'processing', 5, '2025-08-21 00:03:27.476+00', NULL, '{"transcription_job_id": "497c4410-d286-421e-904e-32a262e6b05b", "transcription_started_at": "2025-08-21T00:03:32.418Z", "transcription_audio_url_source": "pre-signed"}', 'processing');
INSERT INTO "public"."evidence_files" VALUES ('d28a2c79-e663-4681-837d-7a92ae73fa40', NULL, 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Record (online-voice-recorder.com).mp3', 'evidence-audio', 'temp/a580b1b2-d87c-4ba9-8e6d-31e74580d6c3/1755737004902-pc03mae9lh.mp3', 'audio/mpeg', 162048, NULL, '1, 2, 3, 4, 5, 6, 7, 8, 9, 10.', 'completed', 5, '2025-08-21 00:43:28.799+00', '2025-08-21 00:43:53.616+00', '{"fixed_by_status_api": true, "status_api_fixed_at": "2025-08-21T00:43:53.616Z", "transcription_job_id": "a57e5a31-e514-4dfe-9b04-3bea761d468c", "transcription_duration": 5.06, "transcription_language": "en", "transcription_confidence": 0.78, "transcription_started_at": "2025-08-21T00:43:33.654Z", "transcription_completed_at": "2025-08-21T00:43:53.616Z", "transcription_audio_url_source": "pre-signed"}', 'completed');
INSERT INTO "public"."evidence_files" VALUES ('7cdf51d6-cd17-483d-861f-c1cb2ae582b9', '6c5ffb78-c549-4f1c-84a8-fa5c3857660f', '8348cab0-73b9-48ee-b600-cb2143933f2b', '1000242624.jpg', 'evidence-photos', '6c5ffb78-c549-4f1c-84a8-fa5c3857660f/photo-0-1756620513131.jpg', 'image/jpeg', 486840, 'Responded after 20 days', NULL, 'completed', NULL, '2025-08-31 06:08:35.693+00', NULL, '{}', 'pending');
INSERT INTO "public"."evidence_files" VALUES ('bc960934-6102-4cd2-a8f8-3ad38534962b', 'f604cd2c-5773-47bb-8d94-655e87921fe0', '8348cab0-73b9-48ee-b600-cb2143933f2b', '1000237040.jpg', 'evidence-photos', 'f604cd2c-5773-47bb-8d94-655e87921fe0/photo-1-1756621800355.jpg', 'image/jpeg', 177917, 'Continue calling but she responded too late', NULL, 'completed', NULL, '2025-08-31 06:30:01.97+00', NULL, '{}', 'pending');
INSERT INTO "public"."evidence_files" VALUES ('02f23db8-4305-4912-b964-36d0bbbe3604', NULL, 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Record (online-voice-recorder.com).mp3', 'evidence-audio', 'temp/a580b1b2-d87c-4ba9-8e6d-31e74580d6c3/1755736190223-pqiqm39xbxo.mp3', 'audio/mpeg', 162048, NULL, '1, 2, 3, 4, 5, 6, 7, 8, 9, 10.', 'completed', 5, '2025-08-21 00:29:53.524+00', '2025-08-21 00:37:36.412+00', '{"fixed_at": "2025-08-21T00:37:36.412Z", "transcription_job_id": "9bfc20b0-ae25-47e7-8589-19b20b93c7c3", "transcription_duration": 5.06, "transcription_language": "en", "fixed_by_final_endpoint": true, "transcription_confidence": 0.78, "transcription_started_at": "2025-08-21T00:29:58.108Z", "transcription_completed_at": "2025-08-21T00:37:36.412Z", "transcription_audio_url_source": "pre-signed"}', 'completed');
INSERT INTO "public"."evidence_files" VALUES ('5b20efbb-6c3e-48c4-9ad1-99b5f5fdf4f3', 'f604cd2c-5773-47bb-8d94-655e87921fe0', '8348cab0-73b9-48ee-b600-cb2143933f2b', '1000237041.jpg', 'evidence-photos', 'f604cd2c-5773-47bb-8d94-655e87921fe0/photo-0-1756621798080.jpg', 'image/jpeg', 182901, '14 august continue calling that night', NULL, 'completed', NULL, '2025-08-31 06:29:59.675+00', NULL, '{}', 'pending');
INSERT INTO "public"."evidence_files" VALUES ('a9e18e64-ff14-4d7f-a512-f8701d189d96', 'f604cd2c-5773-47bb-8d94-655e87921fe0', '8348cab0-73b9-48ee-b600-cb2143933f2b', '1000237039.jpg', 'evidence-photos', 'f604cd2c-5773-47bb-8d94-655e87921fe0/photo-2-1756621802349.jpg', 'image/jpeg', 217046, 'Responded once ', NULL, 'completed', NULL, '2025-08-31 06:30:04.071+00', NULL, '{}', 'pending');
INSERT INTO "public"."evidence_files" VALUES ('d9fe994c-4e85-4fd9-ac9c-37e3de88c84f', 'f4a2f692-a925-4038-96aa-aeafe865783c', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'audio-1756622503817.wav', 'evidence-audio', 'f4a2f692-a925-4038-96aa-aeafe865783c/audio-0-1756622542398.wav', 'audio/wav', 1075082, 'Sheeraz conversation ', NULL, 'pending', NULL, '2025-08-31 06:42:32.759+00', NULL, '{}', 'pending');
INSERT INTO "public"."evidence_files" VALUES ('749c617e-bfd5-4e3b-9beb-0137ad656875', NULL, 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Record (online-voice-recorder.com).mp3', 'evidence-audio', 'temp/a580b1b2-d87c-4ba9-8e6d-31e74580d6c3/1755734378199-lqirt9ehcs.mp3', 'audio/mpeg', 162048, 'fszf', NULL, 'processing', 5, '2025-08-20 23:59:41.845+00', NULL, '{"transcription_job_id": "0ba287cb-094f-4bfe-9c2a-f0a0ff04a588", "transcription_started_at": "2025-08-20T23:59:48.514Z", "transcription_audio_url_source": "pre-signed"}', 'processing');

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
-- Records of export_requests
-- ----------------------------

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
-- Records of false_beliefs
-- ----------------------------
INSERT INTO "public"."false_beliefs" VALUES ('83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'I am unlovable for who I am', 'self_worth', 'f', 5, 5, 'active', NULL, '2025-11-11 16:18:58.23992+00', '2025-11-11 16:18:58.23992+00', NULL, NULL, NULL, NULL);

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
-- Records of feature_limits
-- ----------------------------
INSERT INTO "public"."feature_limits" VALUES ('61c49b60-349d-4dd1-bc7f-53fc7a9eb8f4', 'foundation', 'evidence_files', 'monthly_count', 20, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('ec8733f3-ee67-4c26-b07d-2c596add6373', 'foundation', 'export_requests', 'monthly_count', 2, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('7253c9d2-372a-4e91-8d5a-a73544d9891a', 'recovery', 'evidence_files', 'monthly_count', 100, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('f12dbb44-9db8-49de-acb0-cd904f5ac166', 'recovery', 'export_requests', 'monthly_count', 10, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('e886b5a0-a230-4d0e-a243-d0e11834aa82', 'empowerment', 'evidence_files', 'monthly_count', -1, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('b4d78422-2268-4d3d-9024-3592cbb003b0', 'empowerment', 'export_requests', 'monthly_count', -1, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('8cd2beba-beb8-41c4-8594-627e1eefe9c9', 'foundation', 'ai_interactions', 'monthly_count', 10, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('76b85b46-5044-41e3-8f0a-2a1b59a84c37', 'foundation', 'pattern_analysis', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('c7499b90-35cc-44f0-b48b-21550ac94f07', 'foundation', 'journal_entries', 'monthly_count', 4, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('349c3c92-ea9a-4187-bfdf-d4818bbae78b', 'foundation', 'mind_reset_sessions', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('23439b35-b889-4b38-97af-13b279dea369', 'foundation', 'boundary_builder', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('ac32d9b0-55b3-44c8-98a8-c26196764d4b', 'foundation', 'grey_rock_messages', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('480b7dcc-b275-46dc-9a45-357d3a6f570d', 'foundation', 'community_posts', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('7d1eb3b5-a7b3-40a8-8e6a-7370e2de015c', 'foundation', 'wellness', 'monthly_count', 0, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('613a4de5-5073-49ee-b91c-1de5166976b4', 'foundation', 'transcription_minutes', 'minutes', 0, '2025-08-21 16:44:59.232503+00', '2025-08-21 16:44:59.232503+00');
INSERT INTO "public"."feature_limits" VALUES ('70960b49-99bf-4938-9c20-d4fdfc807774', 'foundation', 'storage', 'storage_mb', 100, '2025-08-18 01:14:41.500321+00', '2025-08-21 16:45:18.265238+00');
INSERT INTO "public"."feature_limits" VALUES ('66ec2b9f-28f8-42b1-883e-790b6077edf3', 'recovery', 'ai_interactions', 'monthly_count', 100, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('c2eb66a5-e628-4fc1-8685-f8f276e2e15f', 'recovery', 'journal_entries', 'monthly_count', 50, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('f58f4c39-7fc9-4fb7-b9ee-82911fb3222c', 'recovery', 'mind_reset_sessions', 'monthly_count', 30, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('088817ba-f828-4530-ab61-cbdcd978b837', 'recovery', 'boundary_builder', 'monthly_count', 30, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('33852b87-2c26-4649-972c-a358d0e9a496', 'recovery', 'grey_rock_messages', 'monthly_count', 100, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('10df3ef1-10e0-4166-8691-6c86ca876ede', 'recovery', 'community_posts', 'monthly_count', 30, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('56cb0699-eb6d-4c56-85e0-6cd20462905c', 'recovery', 'wellness', 'monthly_count', 30, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('94258bcc-61e7-483f-8ab4-b493c95c0387', 'recovery', 'transcription_minutes', 'minutes', 300, '2025-08-21 16:44:59.232503+00', '2025-08-21 16:44:59.232503+00');
INSERT INTO "public"."feature_limits" VALUES ('7bdda1b0-f68b-4e25-abc7-38fd83cd7abc', 'recovery', 'storage', 'storage_mb', 500, '2025-08-18 01:14:41.500321+00', '2025-08-21 16:45:18.265238+00');
INSERT INTO "public"."feature_limits" VALUES ('876b0673-451e-4b84-9f03-68c0cfcae798', 'empowerment', 'ai_interactions', 'monthly_count', 500, '2025-08-18 01:14:41.500321+00', '2025-08-21 16:46:14.62638+00');
INSERT INTO "public"."feature_limits" VALUES ('5895c766-884f-49e9-9aa6-8188af51002a', 'empowerment', 'pattern_analysis', 'monthly_count', 50, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('7eef3ba2-461b-489d-bd36-0fedb324f45f', 'empowerment', 'journal_entries', 'monthly_count', 200, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');
INSERT INTO "public"."feature_limits" VALUES ('7815e798-f9e1-4494-a608-4bc8bcf51f17', 'empowerment', 'mind_reset_sessions', 'monthly_count', 100, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('50028e2c-2b03-4041-bb00-aa304f2bac3b', 'empowerment', 'boundary_builder', 'monthly_count', 100, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('7625c942-e801-4282-affb-28477a8fd672', 'empowerment', 'grey_rock_messages', 'monthly_count', 500, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('cd3f604f-618f-4b9c-8b97-d5e38176624c', 'empowerment', 'community_posts', 'monthly_count', 200, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('684a9129-00c5-4af1-bf39-cf222c5c958a', 'empowerment', 'wellness', 'monthly_count', 200, '2025-08-21 17:45:34.594513+00', '2025-08-21 17:45:34.594513+00');
INSERT INTO "public"."feature_limits" VALUES ('8fe8f060-8aba-46b0-a2a3-241efe811414', 'empowerment', 'transcription_minutes', 'minutes', 600, '2025-08-21 16:44:59.232503+00', '2025-08-21 16:44:59.232503+00');
INSERT INTO "public"."feature_limits" VALUES ('65e7f4b2-aafe-4cb2-94ff-1611153708e2', 'empowerment', 'storage', 'storage_mb', 1000, '2025-08-18 01:14:41.500321+00', '2025-08-21 16:45:18.265238+00');
INSERT INTO "public"."feature_limits" VALUES ('26a06edc-78f0-485c-a190-b4b223302cd7', 'recovery', 'pattern_analysis', 'monthly_count', 200, '2025-08-18 01:14:41.500321+00', '2025-08-18 01:14:41.500321+00');

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
-- Records of gdpr_consents
-- ----------------------------

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
-- Records of gr_user_achievements
-- ----------------------------

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
-- Records of gr_user_pack_stats
-- ----------------------------
INSERT INTO "public"."gr_user_pack_stats" VALUES ('a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Basics', 1, '2025-08-22 18:14:19.604025+00');

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
-- Records of gr_user_streaks
-- ----------------------------
INSERT INTO "public"."gr_user_streaks" VALUES ('a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 1, 1, '2025-08-22', '2025-08-22 18:14:19.448645+00');

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
-- Records of gratitude_streaks
-- ----------------------------

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
-- Records of grey_rock_attempts
-- ----------------------------
INSERT INTO "public"."grey_rock_attempts" VALUES ('3dd71560-31e3-436e-9d7f-8daaba91ab24', '01ae13e6-6fea-4260-8ef3-64352442eb09', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '5', 'hard', '"That must be difficult for them."', 't', 43444, '2025-08-22 03:53:44.401116+00', '{"scenario_title": "Emotional Manipulation"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('a9b1f7f6-7941-4771-a794-279b51e74be3', 'af4610ad-f71e-4b3a-8e27-4e2572e17f75', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '1', 'medium', '"That''s not true! I work very hard and my boss appreciates me!"', 'f', 95207, '2025-08-22 13:25:12.093353+00', '{"scenario_title": "Work Performance Criticism"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('15b22ac6-b873-4b0b-8eef-e01668a276b8', 'f61c6c52-1dde-4316-81e0-45348df924d9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '62cdbf19-4b10-4ee7-a54a-1802e324f6fe', 'easy', '"Fine, but only this time."', 'f', 16817, '2025-08-22 16:25:27.081133+00', '{"scenario_title": "Boundary Probe"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('38c61a7b-5fdc-488e-a851-704d35c691b0', 'f61c6c52-1dde-4316-81e0-45348df924d9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '72cb13ef-b4f7-4138-b1be-2f60ae80c74a', 'medium', '"That''s not true! I work very hard and my boss appreciates me!"', 'f', 13517, '2025-08-22 16:25:47.60462+00', '{"scenario_title": "Work Performance Criticism"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('d6c71912-f6b4-4b35-8b47-b61e98a2e6b5', 'f61c6c52-1dde-4316-81e0-45348df924d9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'bab40715-0bd0-46ab-8419-49fccbf83952', 'easy', '"We''re leaving now."', 't', 44093, '2025-08-22 16:26:34.773195+00', '{"scenario_title": "Public Jab"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('6f47d5a1-0e33-40ab-9222-d3c3316debf2', 'f61c6c52-1dde-4316-81e0-45348df924d9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'd7572ae9-755d-40b6-b1e8-d188fcb015a2', 'easy', '"I''m not sensitive—you''re mean!"', 'f', 7400, '2025-08-22 17:10:31.434705+00', '{"scenario_title": "Name-Calling"}');
INSERT INTO "public"."grey_rock_attempts" VALUES ('96b64ee8-934f-42c3-8ed3-619a4e4c2b92', '687e7ff0-db1a-4ca5-9c1d-6d1f7b8c65e1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'c7cbb708-9303-4544-a4dc-fd4fb48c5169', 'easy', '"I don''t engage with gossip."', 't', 15975, '2025-08-22 18:14:19.168053+00', '{"scenario_title": "Friend Gossip"}');

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
-- Records of grey_rock_scenarios
-- ----------------------------
INSERT INTO "public"."grey_rock_scenarios" VALUES ('72cb13ef-b4f7-4138-b1be-2f60ae80c74a', 'Work Performance Criticism', 'Your ex criticizes your work performance in front of your children', '"You''re so incompetent at your job, no wonder the kids don''t respect you."', '"Okay." (then redirect conversation to the children)', '"That''s not true! I work very hard and my boss appreciates me!"', 'The good response avoids taking the bait and doesn''t provide emotional fuel. The bad response shows you''re affected and gives them ammunition.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('759914c1-7ca2-4615-b542-cd8d99da1d6c', 'Relationship Status Probing', 'They ask invasive questions about your dating life', '"So who are you seeing now? I bet they don''t know how crazy you really are."', '"That''s not something I discuss."', '"I''m not crazy! And my personal life is none of your business!"', 'Keep responses brief and don''t defend yourself. Defending gives them the reaction they want.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('8bc53be1-f383-487b-b831-79148bd70890', 'Late Pickup Comment', 'They criticize you for arriving a few minutes late', '"Late again. Classic you."', '"Pickup is complete."', '"I''m only five minutes late because of traffic!"', 'A short acknowledgment avoids debate and ends the moment.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('72721779-1c43-4b04-948b-09386e2c8942', 'Appearance Jab', 'They make a dig about your clothes or hair', '"That outfit is… bold for your age."', '"Noted."', '"What''s that supposed to mean? I look fine."', 'Do not seek validation; neutral acknowledgment provides no fuel.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('0759b59d-56f9-4f54-a2ef-a01f01793d60', 'Social Media Bait', 'They pressure you about posts', '"Nice post fishing for attention again."', '"I don''t discuss socials here."', '"I wasn''t fishing! People liked it because—"', 'Avoid defending or explaining; set a boundary and stop.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('d72a6c2b-a587-4ec7-9d71-d32122ce3433', 'Schedule Nitpick', 'They nitpick your shared calendar entry', '"Your plan notes are confusing."', '"I''ll keep it concise."', '"They''re not confusing—your notes are worse."', 'Keep it short; do not compare or defend.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('96478d1d-42e5-4de9-8ee9-d44f88f8158a', 'Text Wall', 'They send a long accusatory text', '"So many points. I''ll respond about logistics only."', '"I''ll respond about logistics only."', '"You''re wrong about everything, and here''s why—"', 'Limit to logistics; don''t address every accusation.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('c7cbb708-9303-4544-a4dc-fd4fb48c5169', 'Friend Gossip', 'They claim friends agree with them', '"Everyone knows you''re difficult."', '"I don''t engage with gossip."', '"Who? Name one person who said that!"', 'Don''t chase rumors; end the line of conversation.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('1640e619-2504-4e0c-9d29-f4ed0aee41d1', 'Holiday Pressure', 'They push for last-minute plan changes', '"We''re changing the schedule."', '"I''ll follow the current plan."', '"You always do this at the last minute!"', 'Reaffirm the plan without arguing intent.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('4f1490f1-dcdf-42e3-81d1-ba6d3d782ba3', 'Phone Call Demand', 'They demand you pick up immediately', '"Answer now or else."', '"I''ll respond in writing."', '"You can''t talk to me like that!"', 'Choose the safe medium; keep it neutral.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('e8b7ef7a-2f59-4770-9f5d-0a30a30c45f2', 'Old Story Rehash', 'They bring up past mistakes', '"Remember when you messed that up?"', '"Not discussing the past."', '"That''s not how it happened!"', 'Avoid relitigation; refuse the bait.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('d7572ae9-755d-40b6-b1e8-d188fcb015a2', 'Name-Calling', 'They use mild insults', '"You''re so sensitive."', '"I''m focusing on logistics."', '"I''m not sensitive—you''re mean!"', 'Refocus without defense.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('62cdbf19-4b10-4ee7-a54a-1802e324f6fe', 'Boundary Probe', 'They test a small boundary', '"Just this once, break the rule."', '"No."', '"Fine, but only this time."', 'A brief no prevents negotiation traps.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('864eb738-23e6-4822-b84c-e94916be8459', 'Triangulation Try', 'They say the kids prefer their house', '"Kids like my place more."', '"I won''t compare homes."', '"They do not—you''re lying."', 'Decline comparison; don''t defend.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('b59c87ca-b88a-4a8a-877e-8ea266ca5e21', 'Money Dig', 'They say you''re cheap', '"You''re stingy as ever."', '"Not discussing that."', '"I''m not stingy—I pay for—"', 'No defense; end the topic.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('e556eb5f-3888-4c93-be3a-cdc8cb05e3be', 'Petty Accusation', 'They accuse you of forgetting small things', '"You forgot the lunch again."', '"I''ll check."', '"No I didn''t—here''s proof."', 'Check, don''t litigate.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('240d43f9-f5d6-405a-b628-10e035472d3b', 'Tone Policing', 'They judge your tone to provoke you', '"Watch your tone."', '"I''ll stick to the plan."', '"My tone is fine—yours isn''t."', 'Avoid tone debates; return to logistics.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('dc53f339-947b-4fa0-bd91-4142ea1b5d43', 'Minor Threat', 'They imply consequences', '"You''ll regret this."', '"Noted."', '"Are you threatening me?"', 'Acknowledge without escalation.', 'medium', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('bab40715-0bd0-46ab-8419-49fccbf83952', 'Public Jab', 'They make a snide comment at pickup', '"Nice parenting."', '"We''re leaving now."', '"Don''t embarrass me in front of them!"', 'Keep it moving; no debate in public.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('70706c6c-0f32-4cb1-a9cd-0367dd4529d1', 'Guilt Nudge', 'They suggest you''re selfish', '"You only think of yourself."', '"I''m not discussing that."', '"That''s not true—I always…"', 'End guilt appeals quickly.', 'easy', 'Basics', 'foundation', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('91e488d3-bbfb-4e39-932b-eb8249ed752a', 'Parenting Criticism', 'They criticize your parenting decisions', '"You''re too soft on the kids. That''s why they don''t listen to you."', '"I''ll consider that."', '"I''m not too soft! You''re the one who spoils them!"', 'Avoid defending your parenting style. A non-committal response doesn''t give them fuel for argument.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('10444442-3d7e-47ba-bb4d-556b00db1881', 'Financial Accusations', 'They accuse you of misusing money or being financially irresponsible', '"You''re wasting money on stupid things while our kids need new clothes!"', '"I''ll look into that."', '"I bought one coffee! You spent hundreds on your hobbies!"', 'Don''t justify spending or counter-attack. Neutral acknowledgment ends it.', 'hard', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('bf1a048a-3aee-40d9-84de-d7c8afbad643', 'Boundary Re-Negotiate', 'They push to renegotiate custody outside court order', '"Let''s change days off the record."', '"I follow the order."', '"The order is unfair—be flexible."', 'Refer to the order; don''t argue fairness.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('d6b4b1d9-1f59-4463-8cf1-0f458bbc1716', 'Info Fishing', 'They fish for your address or employer info', '"Where exactly do you work now?"', '"Not sharing that."', '"Why won''t you tell me? What are you hiding?"', 'Protect personal info; keep it brief.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('a1e255b0-29da-4dcc-8865-1534faf40b33', 'Drop-In Request', 'They suggest unannounced visits', '"I''ll swing by later."', '"No drop-ins."', '"Don''t be dramatic—it''s quick."', 'State the rule; no justification.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('032734ea-0e02-4b66-b31e-3a35b71c1f65', 'Budget Control', 'They try to dictate your spending', '"You''re not allowed to buy that."', '"I''ll handle my budget."', '"You don''t tell me what to do!"', 'Reassert autonomy without emotion.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('d731b939-b98e-48cf-86e0-91f6daec2a28', 'Personal Attack with Ask', 'Insult followed by a request', '"You''re incompetent—anyway, can you sign this?"', '"Send the document."', '"Don''t call me that—why should I help?"', 'Ignore insult; address the task only.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('ce9f42b0-ecb4-45b7-b06a-0050448bb4e9', 'Kid Messenger', 'They ask kids to pass adult messages', '"Tell your mom to…"', '"Use me for messages, not the kids."', '"Don''t involve them!"', 'State the boundary; no lecture.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('b1c8081f-28cb-4115-a718-51a88385de59', 'Gas Pumping', 'They push you to admit fault', '"Just say you were wrong."', '"Not discussing blame."', '"I wasn''t wrong—you were!"', 'Don''t enter blame games.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('4661d723-22e8-4b02-ac73-97448621ac97', 'Private Photos', 'They demand access to photos', '"Send me your camera roll."', '"I''ll share kid photos via our app."', '"You can''t control me."', 'Define safe channel; repeat it.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('fefc19d0-8bce-43e3-9261-13314f851d29', 'Logistics Scope Creep', 'They veer into personal topics during logistics', '"Also, why did you…"', '"Sticking to logistics only."', '"It''s related—listen."', 'Hold scope; end side topics.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('8c89fc96-a45c-4442-ad84-f385f23a0c9a', 'Public Scene Threat', 'They threaten a scene at school', '"I''ll tell everyone what you did."', '"School is not for disputes."', '"Go ahead and try!"', 'Decline escalation; keep to policy.', 'hard', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('fdf88164-a355-4182-9609-dbc6a2a8b0d1', 'Legal Bluff', 'They bluff about their lawyer', '"My lawyer says you''re done."', '"Communicate through counsel."', '"You don''t even have a lawyer!"', 'Redirect to counsel; don''t debate.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('92c228d9-d5f1-4ac6-bc15-399b495d6d07', 'Surprise Switch', 'They propose last-minute swap', '"Switch tonight."', '"I''m following the plan."', '"You never help when I need you!"', 'Reaffirm plan; avoid justification.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('0c1693e7-f9ca-4ce3-9269-48d56ed0428b', 'Evidence Demand', 'They demand proof for routine matters', '"Prove you fed them."', '"That''s not necessary."', '"Here are receipts and timestamps—"', 'Don''t over-prove everyday items.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('60213612-18f1-4f9e-bda1-bd310595858f', 'Well-Actually', 'They correct trivial details to derail you', '"Actually, it was 3:07, not 3:05."', '"Not relevant."', '"Details matter—stop nitpicking!"', 'Refuse derailment; keep focus.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('c05fdcaa-3333-4b11-a0c1-53d304805263', 'Gift Strings', 'They attach strings to gifts', '"I bought that, so you owe me."', '"Gifts don''t require favors."', '"You can''t control me with gifts!"', 'State principle briefly; stop.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('c5a36480-e61b-4647-b7cc-47ee27ffb03c', 'Proxy Pressure', 'They send others to pressure you', '"Your friend said help me out."', '"Contact me directly."', '"Don''t drag my friends in!"', 'Remove proxies; keep it direct.', 'medium', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('89f1cd3d-4ebc-448c-a295-21c731885c5a', 'Boundary Mock', 'They mock your boundaries', '"Your rules are ridiculous."', '"Noted."', '"They''re reasonable—you''re the problem!"', 'No defense; stay brief.', 'easy', 'Boundaries', 'recovery', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('38be5230-cbf7-48ef-8f6d-324499801cf5', 'Emotional Manipulation', 'They try to make you feel guilty about the relationship ending', '"The kids are so sad about us not being together. You''ve ruined their family."', '"That must be difficult for them."', '"I didn''t ruin anything! You did this to yourself!"', 'Acknowledge without taking responsibility. Don''t defend your decision or blame them back.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('095cbc46-c1a2-407d-956b-9a95a67514db', 'Smear Threat', 'They threaten to smear you online', '"I''ll post everything about you."', '"I won''t engage online."', '"Try it and see what happens!"', 'Refuse engagement; don''t threaten back.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('e8c33983-19c9-4bc0-9d25-27b86d1ff34b', 'False Report Hint', 'They hint at reporting you falsely', '"Maybe I should report you."', '"I''ll stick to facts."', '"That''s a false accusation!"', 'Avoid panic; keep to facts and process.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('ac9c8853-2f36-48aa-995d-95453f87a70b', 'Parental Alienation Claim', 'They claim you turned kids against them', '"You made them hate me."', '"I support their relationship with both parents."', '"No, you did that yourself!"', 'Avoid blame loops; state your stance briefly.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('7e20c9ed-40d9-448d-8723-72a68e4fbfa7', 'Financial Threat', 'They threaten financial ruin', '"I''ll drain you in court."', '"Communicate via counsel."', '"You won''t win!"', 'Decline conflict bait; route to counsel.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('2431bb08-6704-45bd-8ae5-685323fcf339', 'Stalking Implication', 'They hint at monitoring you', '"I know where you were."', '"Not discussing personal life."', '"Stop stalking me!"', 'Don''t reveal info; stay neutral and brief.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('64f1fd8e-7efe-4e2a-bd39-e8053444bca8', 'Malicious Compliance', 'They insist on literalism to frustrate', '"You didn''t say exactly 7:00."', '"Pickup at 7:00 as planned."', '"You always twist my words!"', 'Restate plan plainly; no emotion.', 'medium', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('16425508-4359-49bf-82dc-37ab61c327d3', 'Third-Party Threat', 'They threaten to involve authorities without cause', '"I''ll call CPS on you."', '"I''ll cooperate with authorities."', '"That''s abusive—don''t you dare!"', 'Don''t escalate; state cooperation and stop.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('c9a75c23-ba31-4879-880c-8a007e93b80d', 'Ultimatum', 'They give extreme take-it-or-leave-it options', '"Do this or you''ll never see them."', '"I won''t respond to ultimatums."', '"You can''t keep them from me!"', 'Name the tactic; decline to engage.', 'hard', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');
INSERT INTO "public"."grey_rock_scenarios" VALUES ('010adb79-9244-4e31-8a7d-e45985217d6f', 'Rage Texting', 'They send rapid aggressive messages', '"Answer now!!!"', '"I''ll respond later."', '"Stop harassing me!"', 'Delay and de-escalate; don''t match intensity.', 'medium', 'High-Conflict', 'empowerment', 't', '2025-08-22 14:33:15.793982+00', '2025-08-22 14:33:15.793982+00');

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
-- Records of grey_rock_sessions
-- ----------------------------
INSERT INTO "public"."grey_rock_sessions" VALUES ('8dc5b011-19a8-4170-9a26-e6462114fd92', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-21 20:35:08.929337+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "2"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('01ae13e6-6fea-4260-8ef3-64352442eb09', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 03:53:00.815111+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "5"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('af4610ad-f71e-4b3a-8e27-4e2572e17f75', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 13:23:36.798814+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "1"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('2ccb8174-90f7-4cd3-b4e4-1bc47631b8e7', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 16:05:35.893995+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "fdf88164-a355-4182-9609-dbc6a2a8b0d1"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('f61c6c52-1dde-4316-81e0-45348df924d9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 16:25:10.29577+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "62cdbf19-4b10-4ee7-a54a-1802e324f6fe"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('4ff8766f-f6b4-4970-8e12-1decaa618c33', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 18:00:23.288117+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "70706c6c-0f32-4cb1-a9cd-0367dd4529d1"}');
INSERT INTO "public"."grey_rock_sessions" VALUES ('687e7ff0-db1a-4ca5-9c1d-6d1f7b8c65e1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'practice', '2025-08-22 18:14:03.101161+00', NULL, NULL, 0, 0, '{}', '{"first_scenario_id": "c7cbb708-9303-4544-a4dc-fd4fb48c5169"}');

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
-- Records of grey_rock_templates
-- ----------------------------
INSERT INTO "public"."grey_rock_templates" VALUES ('80068b66-2bea-4f68-ada6-d4a11d1425a7', 'Scheduling', 'Pickup/dropoff time change request', 'Noted. I''ll check my schedule and let you know.', '{"I''ll look into that.","I''ll get back to you on that.",Received.}', 'When they request schedule changes', 'neutral', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('b82700f6-ea7c-4889-aa26-3a47e4fb7d9e', 'Scheduling', 'Last-minute schedule change', 'That doesn''t work for me. The original schedule stands.', '{"I can''t accommodate that.","The agreed schedule remains."}', 'When they try to change plans last minute', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('73acd6de-a8af-46ab-a000-a768be503793', 'Personal Questions', 'Dating/relationship questions', 'That''s not something I discuss.', '{"That''s private.","I don''t share personal information.","Not relevant."}', 'When they probe your personal life', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('1fded83d-b1af-4d6c-b9cf-4fc0f009fa85', 'Personal Questions', 'Financial questions', 'My finances are not your concern.', '{"That''s not relevant to co-parenting.","That''s private."}', 'When they ask about your money', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('e601a83f-444b-4843-9496-530142d0899e', 'Criticism', 'Parenting criticism', 'I''ll consider that.', '{Noted.,"I''ll think about it.","Thanks for your input."}', 'When they criticize your parenting', 'neutral', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('04bffc93-e689-41bc-8465-5db6b9c8c81f', 'Criticism', 'Personal attacks', 'Okay.', '{"I see.",Understood.}', 'When they insult or attack you personally', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('7c35619a-c68d-40d6-ad70-7d6e6afea3dc', 'Emotional Manipulation', 'Guilt trips about kids', 'The kids are adjusting fine.', '{"They''re doing well.","They''re adapting."}', 'When they claim kids are suffering', 'neutral', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('2d030d88-6a13-406b-8868-a0aab67e9532', 'Emotional Manipulation', 'Blame for relationship ending', 'We''ve both moved on.', '{"That''s in the past.","We''re focused on co-parenting now."}', 'When they blame you for the breakup', 'redirect', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('e3685b22-3c1c-4e87-ba49-6b1c96c0e7cc', 'Boundaries', 'Excessive texting/calling', 'I''ll respond to co-parenting matters during business hours.', '{"I check messages once daily.","I respond to urgent matters only."}', 'When they contact you constantly', 'formal', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('0109561a-ffe0-4ed8-bb6b-190f36f842df', 'Boundaries', 'Showing up unannounced', 'Please contact me before coming over.', '{"Unannounced visits don''t work for me.","I need advance notice."}', 'When they show up without warning', 'formal', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('70ef3401-e334-4bb8-8978-a555c00ff9fd', 'Conflict', 'Trying to start an argument', 'I don''t want to argue. Let''s focus on the kids.', '{"This isn''t productive.","Let''s stay on topic."}', 'When they try to bait you into fighting', 'redirect', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('b66cd0ee-549a-43f8-948f-3cbe7a4933b4', 'Conflict', 'Accusations', 'I disagree.', '{"That''s not accurate.","I see it differently."}', 'When they make false accusations', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('0b4a739e-3b05-4ace-99e8-a1d914ee7db5', 'Kids', 'Asking kids to relay messages', 'Please communicate directly with me, not through the children.', '{"The kids shouldn''t be messengers.","Contact me directly."}', 'When they use kids as messengers', 'formal', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('8afec22d-5f6f-4a80-a0e8-701a35bc19b1', 'Kids', 'Undermining your rules', 'We have different households with different rules.', '{"My house, my rules.","Each household has its own structure."}', 'When they criticize your household rules', 'neutral', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('b8e06d18-f810-4552-ae04-d28e75bfdcda', 'Legal/Custody', 'Threatening legal action', 'If you have legal concerns, contact your attorney.', '{"Speak to your lawyer about that.","That''s a matter for the attorneys."}', 'When they threaten to take you to court', 'formal', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('7d442706-ebba-452e-adff-e0dbcb9f8d85', 'Legal/Custody', 'Custody agreement violations', 'The custody agreement is clear. I expect you to follow it.', '{"Please adhere to the agreement.","The court order stands."}', 'When they violate custody terms', 'formal', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('02bf5edc-a817-46db-bc84-adbeae9adf9d', 'Deflection', 'Changing the subject', 'Let''s stay focused on [original topic].', '{"Back to the matter at hand.","We were discussing [topic]."}', 'When they try to derail the conversation', 'redirect', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('db4a94bc-b00b-4a98-9119-2b82aa088c03', 'Deflection', 'Bringing up the past', 'That''s not relevant to the current situation.', '{"We''re discussing [current issue].","Let''s focus on now."}', 'When they bring up old issues', 'redirect', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('0e0e9877-16d7-4e48-a64b-33374c8a3b2a', 'Emergency', 'Fake emergencies', 'If it''s a true emergency, call 911.', '{"Contact emergency services if needed.","That doesn''t sound like an emergency."}', 'When they claim fake emergencies for attention', 'brief', '2025-10-21 01:02:38.051281');
INSERT INTO "public"."grey_rock_templates" VALUES ('f3d0d1d7-152f-44f9-8596-9a3b912d76ee', 'Emergency', 'Medical decisions', 'I''ll consult with the doctor and decide.', '{"I''ll handle the medical matter.","I''ll speak to their pediatrician."}', 'When they question medical decisions', 'neutral', '2025-10-21 01:02:38.051281');

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
-- Records of habit_completions
-- ----------------------------

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
-- Records of healing_resources
-- ----------------------------

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
-- Records of journal_entries
-- ----------------------------
INSERT INTO "public"."journal_entries" VALUES ('f4a2f692-a925-4038-96aa-aeafe865783c', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'Child health crisis', ' مشہد سے انے کے بعد  میرا بیٹا علی رضا  فورا بیمار ہو گیا  میں نے اس کو بتایا تھا کہ ہم نے لال بی کی دوا ڈالی ہوئی ہے لہذا احتیاط کرنا کوئی چیز منہ میں نہ ڈال لے چونکہ چھوٹا بچہ ہے محسوس کرتا ہے نہ سمجھ سکتا ہے بہرحال پتہ نہیں کس وجہ سے بیٹی کی طبیعت شدید خراب ہو گئیمیں نے اس کو کہا کہ ڈاکٹر کو دیکھا ہو اور فورا ڈاکٹر کو دکھایا ہم نے چونکہ میری طبیعت خراب تھی اس لیے میں نہیں جا سکا بچے کی طبیعت اچھی حدیث خراب تھی وہ مسلسل 15 منٹ بعد رو رہا تھ سوری یاد ایسے ہی گزر گئی ہے وہ بچہروتا رہا صبح اس کے حالات کے خرابی کی پیش نظر میں نے کہا چار سپیشلسٹ کو دکھا دیتے ہیں یہ موصوفہ کہیں ڈاکٹر کے پاس لے کے چلی گئی لیکن نہ تو شاید بچے کی کیفیت سے ہی بتائی کہ 40 سپیشلسٹ یہ دیکھے جانے کے باوجود بھی اج دو دن بعد بچے کی وہی کیفیت ہے مسلسل کر رہا ہے لے رہا ہے رو رہا ہے کچھ پتہ نہیں چل رہا کہ اس کو کیا تکلیف ہے میں نے مشورہ دیا کہ شیراز کیا رک جاؤ اس کے بعد گاڑی ہے تو اگر رات میں طبیعت خراب ہوئی تو وہ بچے کو لے جائے گا لیکن انہوں نے اپنا بہانہ کر کے میری بات نہ مانی اور نتیجہ یہ ہے کہ اج رات بھی ساری رات بچہ کراتا رہا تکلیف سے اور ہمیں کچھ پتہ نہیں کہ بچے کو کیا تکلیف ہے وہ کیوں اتنا زیادہ رو رہا ہے باوجود اس کے کہ میں نے پیسے بھی خرچ کیے نتیجہ لاحاصل بچہ ایسے ہی بیمار گھر اج ادھے گھنٹے بعد رو رہا ہے تکلیف کی شدت سے', '2025-08-26 16:41:00+00', '2', '{financial_abuse}', 'Qom', NULL, 'anxious, calm, overwhelmed', 'angry, numb', '2025-08-31 06:16:47.831979+00', '2025-08-31 06:42:21.516+00', NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, 4, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('72892fb6-f910-44f2-a24a-731e5f21a939', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Blocked from accessing bank account', 'Partner restricted my access to our shared funds after an argument.', '2025-08-20 00:04:04.369197+00', '2', '{financial_abuse,isolation}', 'Home', '{}', 'anxious', 'fearful', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('c445623e-662e-46da-b96e-c3492905b5fe', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Told me I was imagining things', 'Denied prior statements and flipped blame.', '2025-08-13 00:04:04.369197+00', '3', '{gaslighting,projection}', 'Living room', '{}', 'confused', 'self-doubt', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('f604cd2c-5773-47bb-8d94-655e87921fe0', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'My Sever Health crisis in mahshad', 'مشہد پہنچتے ہی میری طبیعت شدید خراب ہو گئی اور میں جاتے ہی فٹس کی کیفیت میں دو سے تین دن میں چار دفعہ چکر انے کی وجہ گر گیا اس روز میری طبیعت شدید خراب تھی اس نے مجھ سے کہا کہ میں دو گھنٹے میں اپنی بہن سے مل کے اتی ہوں  واپسی میں کھانے کو لے اؤں گی میں ساری رات  بھوکا بیٹھا کھانے کا انتظار کرتا رہا اور مجھے سخت اذیت ہوئی کہ میں بیان نہیں کر سکتا ہمارے درمیان طے یہ ہوا تھا کہ یہ دو گھنٹے بعد ا جائے گی اور اس کے بعد میں اس کے ساتھ حرم جا کے زیارت کر لوں گا لیکن اس کی اس مس کمنٹ کی وجہ سے مجھے شدید تکلیف ہوئی اس کو میں نے بار بار فون کیے اس نے میری کال نہیں اٹھائی ہر دو گھنٹے بعد کہتی ہوں میں ابھی ا رہی ہوں ادھا گھنٹے میں ایک گھنٹے میں ساری رات کھانے کا انتظار کرتا رہا اور میں نے اس کو بھی تاشا کالیں گی لیکن اس نے کوئی جواب نہیں دیا صبح چھ بجے یہ ائی اور میں نے پوچھا تو بہانے بنا دیا', '2025-08-14 06:53:00+00', '2', '{emotional_manipulation}', 'Mashad', NULL, 'anxious, overwhelmed', 'confused, sad, numb, angry', '2025-08-31 06:29:57.788734+00', '2025-09-02 00:21:26.891+00', NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, 5, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Overwhelming affection after argument', 'Sudden gifts and apologies after a tense week.', '2025-08-05 00:04:04.369197+00', '4', '{love_bombing}', 'Home', '{}', 'tense', 'uneasy', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('92766d9a-b19c-48e8-bc31-e584af647f6f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Ignored for two days', 'Refused to speak after I set a boundary; discouraged seeing friends.', '2025-07-29 00:04:04.369197+00', '3', '{silent_treatment,isolation}', 'Apartment', '{}', 'lonely', 'sad', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('e75d5b17-05bf-4003-b3b0-f059ca63b765', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Blamed me publicly', 'Told mutual friends I was controlling; then accused me of it.', '2025-07-23 00:04:04.369197+00', '3', '{projection,smear_campaign}', 'Cafe', '{Taylor}', 'embarrassed', 'stressed', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('25650d24-6cff-434d-b567-b9e64688b105', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'Discouraged from seeing family', 'Said visiting my family would “cause problems.”', '2025-08-17 00:04:04.369197+00', '3', '{isolation}', 'Home', '{}', 'torn', 'anxious', '2025-08-23 00:04:04.369197+00', '2025-08-23 00:04:04.369197+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, NULL, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('6c5ffb78-c549-4f1c-84a8-fa5c3857660f', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'Unanswered Plea', 'میں نے اسے بولا میری طبیعت بہت خراب ہو رہی ہے اور جس ڈاکٹر کا تم نے مجھے بتایا وہ مجھے اس کا فون نمبر دے دو تاکہ میں اس ڈاکٹر کو دکھاؤں تاکہ میں شاید جانے سے پہلے میں سیٹ ہو سکوں اس نے میری بات کا کوئی جواب نہیں دیا', '2025-08-08 09:33:00+00', '2', '{silent_treatment}', 'Qim', NULL, 'neutral', 'sad', '2025-08-31 06:08:32.94681+00', '2025-08-31 06:08:32.94681+00', NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, 4, '{}', NULL, NULL);
INSERT INTO "public"."journal_entries" VALUES ('d4142d08-d296-4ac0-b200-813a974ee00a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'adsfasdf', 'asdfasdf', '2025-11-11 20:09:00+00', '3', NULL, NULL, NULL, 'content', NULL, '2025-11-11 16:40:09.777143+00', '2025-11-11 16:40:09.777143+00', NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, 'f', 'f', '{}', NULL, 3, '{}', NULL, NULL);

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
-- Records of legal_referral_analytics
-- ----------------------------

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
-- Records of legal_referral_platforms
-- ----------------------------
INSERT INTO "public"."legal_referral_platforms" VALUES ('955b3b0f-ae33-4e24-801b-d15aa207793a', 'avvo', 'https://www.avvo.com/find-a-lawyer/referral/', 200.00, '{family_law,divorce,custody,domestic_violence}', 't', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."legal_referral_platforms" VALUES ('6ccb1120-5cc7-4628-9e45-da72936c3669', 'lawyers_com', 'https://www.lawyers.com/find-a-lawyer/referral/', 250.00, '{family_law,divorce,custody}', 't', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."legal_referral_platforms" VALUES ('b4e62597-f434-4341-afff-a7bbb2e8c532', 'findlaw', 'https://lawyers.findlaw.com/referral/', 300.00, '{family_law,divorce,custody,child_support}', 't', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."legal_referral_platforms" VALUES ('18c3a73c-0518-41f5-9291-16d9f748d5ac', 'justia', 'https://www.justia.com/lawyers/referral/', 150.00, '{family_law,divorce,custody}', 't', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."legal_referral_platforms" VALUES ('f2fdcd19-58e9-4da9-85b9-168a4a1cd329', 'martindale_hubbell', 'https://www.martindale.com/find-a-lawyer/referral/', 400.00, '{family_law,divorce,custody}', 't', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."legal_referral_platforms" VALUES ('aed6f8fe-3368-468e-b52f-f5ff1ca225ce', 'nolo', 'https://www.nolo.com/lawyers/referral/', 180.00, '{family_law,divorce,custody}', 't', '2025-10-24 01:20:33.084926+00');

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
  "is_my_fault" bool,
  "notes" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of manipulation_analysis
-- ----------------------------
INSERT INTO "public"."manipulation_analysis" VALUES ('9c1be2d1-785c-41da-8ada-65f7312294a5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'یں اپنے طور پر یہ چاہتی تھی

00:00:04
کہ میرے بچوں کا سوشل اسٹیٹس اور منٹل اسٹیٹس

00:00:08
نورمل رہے

00:00:10
آپ ان سے ہمیشہ رابطے میں رہیں

00:00:13
آپ ان کے سر پر باپ کی طرح رہیں بہت سارے بچے ایسے ہوتے ہیں

00:00:17
جن کی ماں ملک میں رہ رہی ہوتی ہے اور باپ کسی قانونی وجہ سے یا کسی بھی

00:00:21
معاشی وجہ سے باہر رہ رہا ہوتا ہے

00:00:24
آپ کے بچے ہیں آپ ہمیشہ بات چیت کرتے رہیں ملتے رہیں

00:00:28
آپ زیادہ تو بھی بولا ہے پاکستان ملنے آئے جو کرے آپ چھوڑے ہیں ابھی تو الٹ ہو گیا نا میں فون کر رہا ہوں تو مجھے منا کیا جا رہا ہے میں پوری بات کر رہا ہوں آپ غلط کر رہے ہیں سورت آپ میری بات کٹ کر رہے ہیں جب تمام ہو جائے تو آپ مجھے بتا دو میں نے آپ سے گھر سے نکلتے وقت یہ بولا میں نے آپ سے گھر سے نکلتے وقت یہ ', '{}', 'moderate', 'f', NULL, '2025-10-28 21:58:06.595988');

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
-- Records of mental_pause_sessions
-- ----------------------------

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
-- Records of mind_reset_sessions
-- ----------------------------

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
-- Records of mood_check_ins
-- ----------------------------

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
-- Records of morning_intentions
-- ----------------------------
INSERT INTO "public"."morning_intentions" VALUES ('3906447c-01c6-4a80-bece-db349e225247', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-10-20', '0ac29d91-3c5b-4fbf-82c5-698bf51271bd', 't', '2025-10-20 01:23:30.555', '2025-10-20 01:23:31.704996', NULL);
INSERT INTO "public"."morning_intentions" VALUES ('72ca7682-4535-4934-831e-16d305c6bfb8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-10-23', '0ac29d91-3c5b-4fbf-82c5-698bf51271bd', 't', '2025-10-23 01:57:51.449', '2025-10-23 01:57:52.958902', NULL);

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
-- Records of no_contact_milestones
-- ----------------------------

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
-- Records of no_contact_settings
-- ----------------------------
INSERT INTO "public"."no_contact_settings" VALUES ('5a6485a5-2425-4117-aa6d-a2b67c7a2569', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-11-21', 't', '2025-11-12 10:44:44.398894+00');

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
-- Records of npd_traits
-- ----------------------------
INSERT INTO "public"."npd_traits" VALUES ('2ef19a85-bdb2-4f6e-b7d9-dc3dfc38c2ee', 'Gaslighting', 'both', 'Making you question your own reality, memory, or perceptions. They deny things they said or did, even when you have proof.', '{"Denying conversations that happened","Insisting you''re \"too sensitive\" or \"imagining things\"","Claiming you said things you never said","Rewriting history to make themselves look better"}', '{"Document everything in writing","Trust your memory and records","Use Grey Rock - don''t engage in debates about reality","Keep evidence (texts, emails, recordings where legal)"}', 'severe', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('072f6746-6ecc-4d3f-b8e9-798f9c4c9a20', 'Victim-Playing', 'covert', 'Always positioning themselves as the victim or martyr, even when they''re the aggressor. They use sympathy to manipulate.', '{"Claiming you''re \"attacking\" them when you set boundaries","Telling others how much they sacrifice for you","Using illness or hardship to avoid accountability","Playing the \"poor me\" card to gain sympathy"}', '{"Don''t defend yourself - it feeds the narrative","State facts without emotion","Refuse to engage with guilt trips","Document their actual behavior"}', 'moderate', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('cdce29fd-7015-4625-8f7b-7499e3d01315', 'Triangulation', 'both', 'Bringing a third person into conflicts to validate their position, create jealousy, or isolate you.', '{"Comparing you unfavorably to others","Using children to relay messages or spy","Recruiting \"flying monkeys\" to attack you","Pitting people against each other"}', '{"Communicate directly, not through third parties","Don''t compete for validation","Set boundaries with flying monkeys","Focus on your relationship with your children, not their narrative"}', 'severe', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('59239bc6-7642-4b8c-83e7-4dfb145779ba', 'Love-Bombing', 'both', 'Excessive attention, affection, or gifts early in a relationship or after conflict to manipulate and control.', '{"Over-the-top romantic gestures","Constant texting/calling in early stages","Expensive gifts to \"make up\" for abuse","Intense declarations of love too soon"}', '{"Recognize it as manipulation, not genuine affection","Don''t let gifts erase abusive behavior","Maintain boundaries despite the charm offensive","Remember: actions over time matter, not grand gestures"}', 'moderate', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('cfa47950-cb54-45b3-9d02-13ea267a3bc7', 'Hoovering', 'both', 'Attempts to "suck you back in" after a breakup or period of no contact, often with promises of change.', '{"Sudden apologies and promises to change","Showing up unexpectedly","Using children or emergencies to make contact","Love-bombing after you''ve pulled away"}', '{"Maintain no contact or grey rock","Don''t believe promises without sustained changed behavior","Block or limit communication channels","Remember past patterns, not current words"}', 'severe', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('fce30180-7bd5-4433-b9e5-1900e04d5bff', 'Silent Treatment', 'both', 'Withholding communication, affection, or acknowledgment as punishment or control.', '{"Ignoring you for days after a disagreement","Refusing to respond to important questions","Giving one-word answers","Acting like you don''t exist"}', '{"Don''t chase or beg for communication","Use the silence for your own peace","Communicate important info in writing","Don''t reward the behavior with emotional reactions"}', 'moderate', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('b1031e4f-d5cb-4fab-870e-ecbaf8dd1510', 'Projection', 'both', 'Accusing you of the exact behaviors, thoughts, or feelings they themselves have.', '{"Accusing you of cheating when they''re unfaithful","Calling you selfish when they''re self-centered","Claiming you''re manipulative","Saying you''re the one with the problem"}', '{"Don''t defend yourself - it''s not about you","Recognize it as their confession","Grey Rock - don''t engage","Document the accusations for pattern recognition"}', 'moderate', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('775f95ec-a07c-4885-b02f-eda294d2dd21', 'Flying Monkeys', 'both', 'Recruiting others (friends, family, children) to do their bidding, spy on you, or attack you.', '{"Getting mutual friends to \"check on you\"","Using children to relay messages or gather information","Turning family members against you","Having others confront you on their behalf"}', '{"Set boundaries with flying monkeys","Don''t share personal information","Communicate directly with the narcissist only when necessary","Protect children from being used as messengers"}', 'severe', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('bc462f3c-d1e1-4add-9e17-b30e96e5e981', 'Boundary Violations', 'both', 'Repeatedly ignoring or crossing your stated boundaries, then blaming you for having them.', '{"Showing up unannounced after you asked them not to","Contacting you through blocked channels","Ignoring custody agreements","Claiming your boundaries are \"unreasonable\""}', '{"State boundaries clearly in writing","Enforce consequences consistently","Don''t explain or justify your boundaries","Document violations for legal purposes"}', 'severe', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('2ebcc24c-b104-4d07-a73a-076320ca618e', 'Covert Criticism', 'covert', 'Disguising insults, put-downs, or criticism as concern, jokes, or compliments.', '{"\"I''m just worried about your weight\" (body shaming)","\"You''re so brave to wear that\" (insult disguised as compliment)","\"I''m just trying to help\" (when giving unsolicited criticism)","Backhanded compliments"}', '{"Trust your gut - if it feels like criticism, it is","Don''t explain yourself or seek their approval","Grey Rock - minimal response","Recognize the pattern, don''t internalize the criticism"}', 'mild', '2025-10-20 22:38:24.474365');
INSERT INTO "public"."npd_traits" VALUES ('a19be14f-55fd-447c-b8da-60f6120ae079', 'Emotional Manipulation', 'both', 'Using your emotions, fears, or insecurities against you to control your behavior and decisions.', '{"Threatening suicide or self-harm when you try to leave","Using your love for children to manipulate decisions","Exploiting your fears and insecurities","Emotional blackmail: \"If you loved me, you would...\""}', '{"Recognize emotional blackmail for what it is","Don''t make decisions based on their emotional threats","Seek professional help if they threaten self-harm","Document threats for safety and legal purposes"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('80ef56a6-c77e-48bd-9e1a-a62d6cf73300', 'Withholding Affection/Resources', 'both', 'Deliberately withholding love, attention, money, or necessities as punishment or control.', '{"Refusing intimacy or affection when displeased","Withholding financial support or access to money","Denying basic needs or comforts","Giving you the \"cold shoulder\" for extended periods"}', '{"Don''t beg or chase for what''s being withheld","Develop financial independence when possible","Recognize withholding as abuse, not your fault","Build support networks outside the relationship"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('4cd93a96-3331-484a-a785-9b4bd67a508f', 'Rage and Explosive Anger', 'overt', 'Disproportionate anger outbursts designed to intimidate, control, and shut down opposition.', '{"Screaming, yelling, or throwing objects","Explosive reactions to minor inconveniences","Road rage or public outbursts","Threatening physical violence during arguments"}', '{"Remove yourself from the situation if safe to do so","Don''t try to reason with them during a rage episode","Document incidents for safety planning","Have an escape plan ready"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('b0ae0b59-a0c4-430c-ab31-edaf6581548c', 'Smear Campaigns', 'both', 'Systematically destroying your reputation by spreading lies, half-truths, or private information to others.', '{"Telling friends and family lies about you","Sharing private information to embarrass you","Painting themselves as the victim of your \"abuse\"","Turning your children against you with false narratives"}', '{"Don''t defend yourself to every person - it feeds the drama","Focus on maintaining relationships with those who matter","Document the truth for your own records","Let your actions speak louder than their words"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('75e7bc27-327f-4930-a4cd-c3d50bdb4628', 'Future Faking', 'both', 'Making elaborate promises about the future to keep you invested, with no intention of following through.', '{"Promising to change after therapy or treatment","Planning elaborate vacations or life changes that never happen","Promising marriage, children, or commitment to string you along","Career or financial promises that never materialize"}', '{"Judge them by past actions, not future promises","Don''t make major life decisions based on their promises","Set deadlines for promised changes with consequences","Focus on present reality, not potential future"}', 'moderate', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('460c7c4f-dc02-4dd6-a2a0-1aec0035b496', 'Intermittent Reinforcement', 'both', 'Unpredictably alternating between kindness and cruelty to create addiction-like attachment.', '{"Being loving one day, cold the next","Giving attention randomly and unpredictably","Alternating between praise and criticism","Hot and cold communication patterns"}', '{"Recognize this creates trauma bonding","Don''t chase the \"good\" version of them","Maintain consistent boundaries regardless of their mood","Seek therapy to understand trauma bonding"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('04198b5c-3168-4d93-9596-e733d2f59eea', 'Parentification', 'both', 'Making you responsible for their emotional needs, problems, or well-being - reversing normal roles.', '{"Expecting you to manage their emotions","Making you feel responsible for their happiness","Leaning on you like you''re their parent or therapist","Expecting you to solve their problems or clean up their messes"}', '{"Recognize you''re not responsible for their emotions","Set boundaries around what you will and won''t do","Don''t enable their helplessness","Encourage them to seek appropriate professional help"}', 'moderate', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('13477e00-ae53-48ac-a251-7bbccdeb11ae', 'Devaluation and Discard', 'both', 'Systematically tearing down your self-worth, then discarding you when you''re no longer useful.', '{"Constant criticism after initial love-bombing phase","Comparing you unfavorably to others","Suddenly ending the relationship without explanation","Treating you as if you never mattered"}', '{"Remember: this reflects their disorder, not your worth","Don''t try to win back their approval","Use the discard as an opportunity to heal","Rebuild your self-worth independent of their opinion"}', 'severe', '2025-10-23 00:11:34.881891');
INSERT INTO "public"."npd_traits" VALUES ('96059dd7-11db-4117-b46a-6dc1e4bdfedd', 'Word Salad and Circular Arguments', 'both', 'Using confusing, contradictory, or nonsensical communication to avoid accountability and exhaust you.', '{"Changing the subject when confronted","Using big words or complex explanations that make no sense","Circular logic that goes nowhere","Bringing up past grievances to deflect current issues"}', '{"Don''t try to make sense of nonsensical arguments","Stick to one topic at a time","Use written communication when possible","End conversations that become circular"}', 'moderate', '2025-10-23 00:11:34.881891');

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
-- Records of origin_memories
-- ----------------------------
INSERT INTO "public"."origin_memories" VALUES ('af18a9f9-89f4-4bfd-94e1-a6d7cef84730', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'She told me "no one will ever love you" during an argument when I asked for basic respect. She said I was too needy and broken to be loved.

', NULL, NULL, NULL, '2025-11-11 17:54:02.588112+00');
INSERT INTO "public"."origin_memories" VALUES ('32f5a25c-dded-4d3f-ae3c-efb523edc07a', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'During a family gathering, she publicly humiliated me saying "he''s impossible to love" in front of everyone. When I got upset, she said I was being too sensitive.

', NULL, NULL, NULL, '2025-11-11 17:56:07.214185+00');
INSERT INTO "public"."origin_memories" VALUES ('4c9d2169-10c3-4bfc-a455-00256403dbfc', '83312f35-3ca2-4c57-8192-30d234427d43', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'After I helped her with a project, she said "don''t expect gratitude, you should be grateful anyone tolerates you." This was repeated multiple times over 2 years.
', NULL, NULL, NULL, '2025-11-11 17:56:26.766686+00');

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
-- Records of pattern_alerts
-- ----------------------------

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
-- Records of pattern_analysis
-- ----------------------------
INSERT INTO "public"."pattern_analysis" VALUES ('3267186c-db0b-4e92-94e9-4b07abafd529', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'abuse_patterns', '2025-02-19 22:23:13.906+00', '2025-08-19 22:23:13.906+00', '{"projection": 1, "gaslighting": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 1, 'gemini-pro', '2025-08-19 22:23:14.584648+00', '2025-08-19 22:23:14.584648+00');
INSERT INTO "public"."pattern_analysis" VALUES ('85fa872a-b3dc-4791-917e-f4403fc4c357', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'abuse_patterns', '2025-02-20 12:14:57.86+00', '2025-08-20 12:14:57.86+00', '{"projection": 1, "gaslighting": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 1, 'gemini-pro', '2025-08-20 12:14:58.651068+00', '2025-08-20 12:14:58.651068+00');
INSERT INTO "public"."pattern_analysis" VALUES ('dfc7f006-2e5d-4972-bbce-11f34311e53c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-21 14:48:51.864+00', '2025-08-21 14:48:51.864+00', '{"hoovering": 1, "projection": 1, "gaslighting": 1, "smear_campaign": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 3, 'gemini-pro', '2025-08-21 14:48:52.047551+00', '2025-08-21 14:48:52.047551+00');
INSERT INTO "public"."pattern_analysis" VALUES ('1a2fdc7e-f411-4704-9dc1-499dd31da7d3', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-21 14:48:51.864+00', '2025-08-21 14:48:51.864+00', '{"hoovering": 1, "projection": 1, "gaslighting": 1, "smear_campaign": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 3, 'gemini-pro', '2025-08-21 14:48:52.043809+00', '2025-08-21 14:48:52.043809+00');
INSERT INTO "public"."pattern_analysis" VALUES ('9571ad46-3839-4f20-addc-e795b31b16b1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-21 23:52:17.835+00', '2025-08-21 23:52:17.835+00', '{"hoovering": 1, "projection": 1, "gaslighting": 1, "smear_campaign": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 3, 'gemini-pro', '2025-08-21 23:52:18.050085+00', '2025-08-21 23:52:18.050085+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d3f1fbee-1346-43c4-8676-943992c905ca', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-21 23:52:17.857+00', '2025-08-21 23:52:17.857+00', '{"hoovering": 1, "projection": 1, "gaslighting": 1, "smear_campaign": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 3, 'gemini-pro', '2025-08-21 23:52:18.07895+00', '2025-08-21 23:52:18.07895+00');
INSERT INTO "public"."pattern_analysis" VALUES ('cfe72c3b-f7fd-4772-85df-e5cac3564ae0', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 03:51:44.005+00', '2025-08-22 03:51:44.005+00', '{}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 0, 'gemini-pro', '2025-08-22 03:51:44.174428+00', '2025-08-22 03:51:44.174428+00');
INSERT INTO "public"."pattern_analysis" VALUES ('c8e7c682-ee70-49d0-8807-9237816a1bcc', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 03:51:44.04+00', '2025-08-22 03:51:44.04+00', '{}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 0, 'gemini-pro', '2025-08-22 03:51:44.204862+00', '2025-08-22 03:51:44.204862+00');
INSERT INTO "public"."pattern_analysis" VALUES ('812175b3-820d-4ab4-8811-0b50b569e0ab', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:16:31.192+00', '2025-08-22 21:16:31.192+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:16:31.364125+00', '2025-08-22 21:16:31.364125+00');
INSERT INTO "public"."pattern_analysis" VALUES ('67025b89-29bc-45b9-b9c3-69530875f698', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:16:31.218+00', '2025-08-22 21:16:31.218+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:16:31.39616+00', '2025-08-22 21:16:31.39616+00');
INSERT INTO "public"."pattern_analysis" VALUES ('733cde04-98d0-464c-834a-c012f603c65c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:21:01.843+00', '2025-08-22 21:21:01.843+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:21:02.029226+00', '2025-08-22 21:21:02.029226+00');
INSERT INTO "public"."pattern_analysis" VALUES ('b50317e2-1d2b-46ac-a159-02723d33e9ad', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:21:01.839+00', '2025-08-22 21:21:01.839+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:21:02.043843+00', '2025-08-22 21:21:02.043843+00');
INSERT INTO "public"."pattern_analysis" VALUES ('59c0a583-4d29-45db-b44a-9e1ea215c1fc', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:24:00.036+00', '2025-08-22 21:24:00.036+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:24:00.230468+00', '2025-08-22 21:24:00.230468+00');
INSERT INTO "public"."pattern_analysis" VALUES ('e82aabdf-e686-4e68-8f04-c0c622210057', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:24:00.104+00', '2025-08-22 21:24:00.104+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:24:00.392939+00', '2025-08-22 21:24:00.392939+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d9546d3a-c7bf-46af-99b8-7d94b2fc5f10', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:44:45.918+00', '2025-08-22 21:44:45.918+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:44:46.094466+00', '2025-08-22 21:44:46.094466+00');
INSERT INTO "public"."pattern_analysis" VALUES ('03bd0605-b581-4b13-9b0d-5337f26de5d5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 21:44:45.926+00', '2025-08-22 21:44:45.926+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:44:46.111536+00', '2025-08-22 21:44:46.111536+00');
INSERT INTO "public"."pattern_analysis" VALUES ('3768153b-cc7b-4f68-a8ea-341f01ef33ec', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-07-22 21:45:00.97+00', '2025-08-22 21:45:00.97+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 21:45:01.231533+00', '2025-08-22 21:45:01.231533+00');
INSERT INTO "public"."pattern_analysis" VALUES ('4495ef5b-e2c7-47ac-9d9a-c0b7101a39fa', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:14:50.233+00', '2025-08-22 23:14:50.233+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:14:50.525518+00', '2025-08-22 23:14:50.525518+00');
INSERT INTO "public"."pattern_analysis" VALUES ('4eda9394-36fe-4fc8-8aaa-1f4b7d17d4da', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:14:50.205+00', '2025-08-22 23:14:50.205+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:14:50.605083+00', '2025-08-22 23:14:50.605083+00');
INSERT INTO "public"."pattern_analysis" VALUES ('56766053-f647-4ef8-baa9-921047b42209', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:28:27.642+00', '2025-08-22 23:28:27.642+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:28:28.048332+00', '2025-08-22 23:28:28.048332+00');
INSERT INTO "public"."pattern_analysis" VALUES ('1b9e65a1-1101-42fa-9f99-3e3f8144eba5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:28:27.643+00', '2025-08-22 23:28:27.643+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:28:28.035513+00', '2025-08-22 23:28:28.035513+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d2a7ecef-84e9-4760-b5e1-a5e540abcbbb', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:46:41.928+00', '2025-08-22 23:46:41.928+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:46:42.207312+00', '2025-08-22 23:46:42.207312+00');
INSERT INTO "public"."pattern_analysis" VALUES ('cf95e12b-bc94-4de1-b8bc-01a2d03cc652', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-22 23:46:41.957+00', '2025-08-22 23:46:41.957+00', '{"gaslighting": 2, "financial_abuse": 2}', '{"text": "Unable to generate insights at this time."}', '[]', '{}', NULL, 2, 'gemini-pro', '2025-08-22 23:46:42.198388+00', '2025-08-22 23:46:42.198388+00');
INSERT INTO "public"."pattern_analysis" VALUES ('9517b511-62c4-42a3-99d3-fd3df2174fa1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:08:35.256+00', '2025-08-23 00:08:35.256+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:08:35.256Z", "start": "2025-02-23T00:08:35.256Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:08:35.404264+00', '2025-08-23 00:08:35.404264+00');
INSERT INTO "public"."pattern_analysis" VALUES ('916ccb61-9f50-4005-aa9a-9c30d2386ca6', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:08:35.358+00', '2025-08-23 00:08:35.358+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:08:35.358Z", "start": "2025-02-23T00:08:35.358Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:08:35.54539+00', '2025-08-23 00:08:35.54539+00');
INSERT INTO "public"."pattern_analysis" VALUES ('47f10109-26d1-42d3-980c-ce5028fdb916', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:09:04.501+00', '2025-08-23 00:09:04.501+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:09:04.501Z", "start": "2025-02-23T00:09:04.501Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:09:04.638248+00', '2025-08-23 00:09:04.638248+00');
INSERT INTO "public"."pattern_analysis" VALUES ('98b5fdf8-fbc8-41fb-b199-dada29adb7e5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:09:04.493+00', '2025-08-23 00:09:04.493+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:09:04.493Z", "start": "2025-02-23T00:09:04.493Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:09:04.669292+00', '2025-08-23 00:09:04.669292+00');
INSERT INTO "public"."pattern_analysis" VALUES ('2b111e6d-fc53-4ce3-a620-97df155d1960', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:09:59.89+00', '2025-08-23 00:09:59.89+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:09:59.890Z", "start": "2025-02-23T00:09:59.890Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:10:00.087276+00', '2025-08-23 00:10:00.087276+00');
INSERT INTO "public"."pattern_analysis" VALUES ('30edcde0-8460-48c3-b0a2-7ce155df7e2c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 23:49:40.027+00', '2025-08-23 23:49:40.027+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Recurring themes of isolation, projection, and manipulation (gaslighting, love-bombing, smear campaigns).\n* Incidents cluster around Wednesdays and Tuesdays.\n* Severity levels indicate a mix of moderate and high-impact events.  Financial abuse was noted once.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The higher severity incidents warrant attention.  The clustering on certain days of the week might indicate predictable triggers.\n\n**Practical next steps:**\n\n*  Prioritize setting clear boundaries.\n*  Continue journaling; add a section to track specific behaviors and your emotional responses.\n*  Consider seeking support from trusted friends, family, or a support group.\n\n**Safety note:** Your safety is paramount; prioritize your well-being and seek help if you feel unsafe.\n"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T23:49:40.027Z", "start": "2025-02-23T23:49:40.027Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-23 23:49:41.548955+00', '2025-08-23 23:49:41.548955+00');
INSERT INTO "public"."pattern_analysis" VALUES ('833d9952-3111-4245-8313-4ecb2bd9f498', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:10:00.004+00', '2025-08-23 00:10:00.004+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:10:00.004Z", "start": "2025-02-23T00:10:00.004Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:10:00.239415+00', '2025-08-23 00:10:00.239415+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0cb33560-90a0-4e41-81d7-93c02af180a0', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:14:57.047+00', '2025-08-23 00:14:57.047+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:14:57.047Z", "start": "2025-02-23T00:14:57.047Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:14:57.494063+00', '2025-08-23 00:14:57.494063+00');
INSERT INTO "public"."pattern_analysis" VALUES ('71d44741-991e-4c38-871e-86aeec1c6a50', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:14:57.648+00', '2025-08-23 00:14:57.648+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:14:57.648Z", "start": "2025-02-23T00:14:57.648Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:14:57.929523+00', '2025-08-23 00:14:57.929523+00');
INSERT INTO "public"."pattern_analysis" VALUES ('8d241ac9-51a8-4880-8464-4927ff866d80', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:40:37.662+00', '2025-08-23 00:40:37.662+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:40:37.662Z", "start": "2025-02-23T00:40:37.662Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:40:38.061096+00', '2025-08-23 00:40:38.061096+00');
INSERT INTO "public"."pattern_analysis" VALUES ('2341e086-01e6-4800-a207-29bd12b6b56e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:11:02.036+00', '2025-08-24 00:11:02.036+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics were noted.\n* A range of manipulative behaviors occurred, including gaslighting, love-bombing, and a smear campaign.\n* Incidents were spread across the week, with a slight concentration on Wednesdays and Tuesdays.\n* Severity levels indicate a mix of less and more intense experiences.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of control.  The higher severity incidents (level 3) are concerning.\n\n**Practical next steps:**\n\n* Prioritize establishing clear boundaries.\n* Maintain a detailed record of incidents (dates, times, specifics).\n* Consider seeking support from trusted friends, family, or a support group.\n* Explore resources like helplines or online support communities.\n\n**Safety note:** Your safety is paramount.  If you feel unsafe, reach out for help immediately.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:11:02.036Z", "start": "2025-02-24T00:11:02.036Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:11:03.657146+00', '2025-08-24 00:11:03.657146+00');
INSERT INTO "public"."pattern_analysis" VALUES ('f9131987-f68c-4307-ada6-1aebb0ee6475', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:41:23.297+00', '2025-08-23 00:41:23.297+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:41:23.297Z", "start": "2025-02-23T00:41:23.297Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:41:23.682257+00', '2025-08-23 00:41:23.682257+00');
INSERT INTO "public"."pattern_analysis" VALUES ('4b92c966-70bf-48a0-9e90-91e907e3a74e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:01.716+00', '2025-08-23 00:47:01.716+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:01.716Z", "start": "2025-02-23T00:47:01.716Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:01.96929+00', '2025-08-23 00:47:01.96929+00');
INSERT INTO "public"."pattern_analysis" VALUES ('bf0610a4-8a5e-4a0e-8063-c8495030fa52', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:01.717+00', '2025-08-23 00:47:01.717+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:01.717Z", "start": "2025-02-23T00:47:01.717Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:02.029755+00', '2025-08-23 00:47:02.029755+00');
INSERT INTO "public"."pattern_analysis" VALUES ('223657c5-df42-4440-bb0d-a5740cf7a59c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:01.697+00', '2025-08-23 00:47:01.697+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:01.697Z", "start": "2025-02-23T00:47:01.697Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:02.044798+00', '2025-08-23 00:47:02.044798+00');
INSERT INTO "public"."pattern_analysis" VALUES ('68d21d7f-2491-4231-a074-086a15519264', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:14:31.213+00', '2025-08-24 00:14:31.213+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics were noted.\n* A range of manipulative behaviors occurred, including gaslighting, love-bombing, and smear campaigns.\n* Incidents were spread across the week, with a slight concentration on Wednesdays.\n\n**Possible escalation or concentration:**\n\n* The combination of isolation and other manipulative tactics suggests a potential pattern of control.\n* The moderate to high severity levels (levels 3 & 4) in several incidents indicate a need for increased attention to safety.\n\n**Practical next steps:**\n\n*  Maintain a detailed record of incidents, including dates, times, and specific behaviors.\n*  Establish clear boundaries and communicate them firmly.\n*  Consider seeking support from trusted friends, family, or a support group.  Explore resources like the National Domestic Violence Hotline.\n\n**Safety note:** Your safety and well-being are paramount.  Prioritize self-care and seek help if you feel unsafe.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:14:31.213Z", "start": "2025-02-24T00:14:31.213Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:14:32.96727+00', '2025-08-24 00:14:32.96727+00');
INSERT INTO "public"."pattern_analysis" VALUES ('b4bfb250-1251-4054-970d-818f5272e38c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:01.709+00', '2025-08-23 00:47:01.709+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:01.709Z", "start": "2025-02-23T00:47:01.709Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:02.047832+00', '2025-08-23 00:47:02.047832+00');
INSERT INTO "public"."pattern_analysis" VALUES ('111eba53-e063-432f-8e3b-7dcf3838a5e0', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:26.493+00', '2025-08-23 00:47:26.493+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:26.493Z", "start": "2025-02-23T00:47:26.493Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:26.765667+00', '2025-08-23 00:47:26.765667+00');
INSERT INTO "public"."pattern_analysis" VALUES ('3cb5fda9-1a16-454a-b993-a85631393f1c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:26.58+00', '2025-08-23 00:47:26.58+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:26.580Z", "start": "2025-02-23T00:47:26.580Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:26.872536+00', '2025-08-23 00:47:26.872536+00');
INSERT INTO "public"."pattern_analysis" VALUES ('a25bb15b-e752-419c-b356-d13fc9fc6f0c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:15.155+00', '2025-08-23 00:47:15.155+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:15.155Z", "start": "2025-02-23T00:47:15.155Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:15.450046+00', '2025-08-23 00:47:15.450046+00');
INSERT INTO "public"."pattern_analysis" VALUES ('4e017af9-d7c2-4345-8432-33491a9d0614', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:26.578+00', '2025-08-23 00:47:26.578+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:26.578Z", "start": "2025-02-23T00:47:26.578Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:26.866103+00', '2025-08-23 00:47:26.866103+00');
INSERT INTO "public"."pattern_analysis" VALUES ('22057254-a89a-499d-8ef7-c058a8812c6d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:47:26.548+00', '2025-08-23 00:47:26.548+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:47:26.548Z", "start": "2025-02-23T00:47:26.548Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:47:26.780991+00', '2025-08-23 00:47:26.780991+00');
INSERT INTO "public"."pattern_analysis" VALUES ('61c39b0c-1258-4354-97fe-30a3de84317e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:49:19.53+00', '2025-08-23 00:49:19.53+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:49:19.530Z", "start": "2025-02-23T00:49:19.530Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:49:19.711811+00', '2025-08-23 00:49:19.711811+00');
INSERT INTO "public"."pattern_analysis" VALUES ('6548f425-41d8-4b6d-b5ce-1936283732e9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:49:19.553+00', '2025-08-23 00:49:19.553+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:49:19.553Z", "start": "2025-02-23T00:49:19.553Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:49:19.736405+00', '2025-08-23 00:49:19.736405+00');
INSERT INTO "public"."pattern_analysis" VALUES ('05d453dc-7fe5-46a0-a8d7-fb6914dc70bf', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:49:19.624+00', '2025-08-23 00:49:19.624+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:49:19.624Z", "start": "2025-02-23T00:49:19.624Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:49:19.784271+00', '2025-08-23 00:49:19.784271+00');
INSERT INTO "public"."pattern_analysis" VALUES ('399b9197-2efb-4375-9abb-a8799006a4c8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:26:17.139+00', '2025-08-24 00:26:17.139+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics noted.\n* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) occurred.\n* Incidents show a range of severity, with some higher-impact events.\n* No clear pattern of escalation is evident, but the frequency is concerning.\n\n**Possible escalation or concentration:**\n\n* While no clear escalation is seen, the consistent presence of manipulative behaviors warrants attention.  The variety of tactics suggests a deliberate pattern of control.\n\n**Practical next steps:**\n\n* Prioritize self-care and connect with trusted individuals.\n* Document incidents with dates, times, and details.\n* Consider setting clear boundaries and enforcing them consistently.\n* Explore resources like support groups or helplines.\n\n**Safety note:**  Your safety and well-being are paramount.  If you feel unsafe, seek immediate help.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:26:17.139Z", "start": "2025-02-24T00:26:17.139Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:26:18.675327+00', '2025-08-24 00:26:18.675327+00');
INSERT INTO "public"."pattern_analysis" VALUES ('badb490d-d3db-4b51-80e1-f28a3f454d36', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 00:49:19.719+00', '2025-08-23 00:49:19.719+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T00:49:19.719Z", "start": "2025-02-23T00:49:19.719Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 00:49:19.892054+00', '2025-08-23 00:49:19.892054+00');
INSERT INTO "public"."pattern_analysis" VALUES ('79df3c86-728a-4622-a3c2-d6191e874973', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:17:39.24+00', '2025-08-23 01:17:39.24+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:17:39.240Z", "start": "2025-02-23T01:17:39.240Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:17:39.453996+00', '2025-08-23 01:17:39.453996+00');
INSERT INTO "public"."pattern_analysis" VALUES ('b9141c58-3c0c-4a0f-8e6c-839f2c922f40', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:17:39.253+00', '2025-08-23 01:17:39.253+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:17:39.253Z", "start": "2025-02-23T01:17:39.253Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:17:39.500695+00', '2025-08-23 01:17:39.500695+00');
INSERT INTO "public"."pattern_analysis" VALUES ('e44bee45-fd95-4aa9-8707-23c8589af07e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:17:39.242+00', '2025-08-23 01:17:39.242+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:17:39.242Z", "start": "2025-02-23T01:17:39.242Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:17:39.53655+00', '2025-08-23 01:17:39.53655+00');
INSERT INTO "public"."pattern_analysis" VALUES ('f712d018-3155-4ae3-a887-d960b48e2353', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:30:28.585+00', '2025-08-24 00:30:28.585+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics noted.\n* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were present.\n* Incidents show a range of severity, with some higher-impact events.\n* Certain days of the week (Wednesdays and Tuesdays) seem to have a higher frequency of incidents.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of control.  The higher severity incidents warrant attention.\n\n**Practical next steps:**\n\n* Track incidents (date, time, type, severity).\n* Set clear boundaries to protect your well-being.\n* Consider seeking support from trusted friends, family, or a support group.\n\n**Safety note:** Prioritize your safety and well-being.  If you feel unsafe, seek immediate help.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:30:28.585Z", "start": "2025-02-24T00:30:28.585Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:30:32.558728+00', '2025-08-24 00:30:32.558728+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d2eb5349-6b09-4285-9484-f87a50387961', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:17:39.252+00', '2025-08-23 01:17:39.252+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:17:39.252Z", "start": "2025-02-23T01:17:39.252Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:17:39.59241+00', '2025-08-23 01:17:39.59241+00');
INSERT INTO "public"."pattern_analysis" VALUES ('c39ff1e7-16f6-4c0a-8c74-572a312e3fe2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:26:08.218+00', '2025-08-23 01:26:08.218+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:26:08.218Z", "start": "2025-02-23T01:26:08.218Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:26:08.407484+00', '2025-08-23 01:26:08.407484+00');
INSERT INTO "public"."pattern_analysis" VALUES ('c3c3166f-5c79-4d14-9883-6c580df3733d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:26:08.233+00', '2025-08-23 01:26:08.233+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:26:08.233Z", "start": "2025-02-23T01:26:08.233Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:26:08.407689+00', '2025-08-23 01:26:08.407689+00');
INSERT INTO "public"."pattern_analysis" VALUES ('70785e4f-5dc3-4673-9e90-569dd785fdf0', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:26:08.227+00', '2025-08-23 01:26:08.227+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:26:08.227Z", "start": "2025-02-23T01:26:08.227Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:26:08.411538+00', '2025-08-23 01:26:08.411538+00');
INSERT INTO "public"."pattern_analysis" VALUES ('ac27f95b-267c-4aac-9107-908ba4a2388b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:37:08.315+00', '2025-08-24 00:37:08.315+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Recurring themes of isolation, projection, and manipulation (gaslighting, love bombing, smear campaigns).\n* Incidents cluster around Wednesdays and Tuesdays.\n* Severity levels indicate a mix of less and more intense experiences.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The higher severity incidents warrant attention.\n\n**Practical next steps:**\n\n* Track incidents: date, time, type of behavior, your emotional response.\n* Set clear boundaries: communicate your needs and limits firmly.\n* Consider seeking support: a trusted friend, family member, or therapist.  Explore resources for domestic abuse or emotional manipulation.\n\n**Safety note:** Prioritize your safety and well-being.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:37:08.315Z", "start": "2025-02-24T00:37:08.315Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:37:09.849326+00', '2025-08-24 00:37:09.849326+00');
INSERT INTO "public"."pattern_analysis" VALUES ('f3bdb135-b9a1-430f-a1d4-cf2adde2630b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:26:08.223+00', '2025-08-23 01:26:08.223+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:26:08.223Z", "start": "2025-02-23T01:26:08.223Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:26:08.431337+00', '2025-08-23 01:26:08.431337+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0e2e931d-8543-46d0-b5a6-b9c6e701eee5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:26:23.538+00', '2025-08-23 01:26:23.538+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:26:23.538Z", "start": "2025-02-23T01:26:23.538Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:26:23.685671+00', '2025-08-23 01:26:23.685671+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0a221bd7-22db-4552-acca-01d808e94e4d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:37:42.659+00', '2025-08-23 01:37:42.659+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:37:42.659Z", "start": "2025-02-23T01:37:42.659Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:37:43.11855+00', '2025-08-23 01:37:43.11855+00');
INSERT INTO "public"."pattern_analysis" VALUES ('dd5cff93-c299-402f-b4c7-58e0c4b9134b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:37:42.66+00', '2025-08-23 01:37:42.66+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:37:42.660Z", "start": "2025-02-23T01:37:42.660Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:37:43.180074+00', '2025-08-23 01:37:43.180074+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d6c97541-f0c4-4eaf-b9da-3569cdb5f876', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:37:42.797+00', '2025-08-23 01:37:42.797+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:37:42.797Z", "start": "2025-02-23T01:37:42.797Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:37:43.186326+00', '2025-08-23 01:37:43.186326+00');
INSERT INTO "public"."pattern_analysis" VALUES ('009a39d7-4abc-4d64-be55-8cc1bd1076c2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 00:52:09.852+00', '2025-08-24 00:52:09.852+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation, projection, and manipulation tactics (gaslighting, love bombing, smear campaigns).\n* Incidents cluster around Wednesdays.\n* Severity levels indicate a range of experiences, with most incidents falling into a moderate severity range.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The clustering on Wednesdays warrants attention.\n\n**Practical next steps:**\n\n*  Establish clear boundaries in communication and interactions.\n*  Continue journaling; note dates, times, and specific behaviors.  This helps track patterns.\n*  Consider seeking support from trusted friends, family, or a support group.\n\n**Safety note:**  Prioritize your safety and well-being; reach out for help if you feel unsafe.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T00:52:09.852Z", "start": "2025-02-24T00:52:09.852Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 00:52:11.34081+00', '2025-08-24 00:52:11.34081+00');
INSERT INTO "public"."pattern_analysis" VALUES ('d00dff77-ef98-496c-9fd9-ba7bb34fb029', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:37:42.823+00', '2025-08-23 01:37:42.823+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:37:42.823Z", "start": "2025-02-23T01:37:42.823Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:37:43.332027+00', '2025-08-23 01:37:43.332027+00');
INSERT INTO "public"."pattern_analysis" VALUES ('227661fd-c3d8-4ba4-ab21-3b50c3935499', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 01:37:53.904+00', '2025-08-23 01:37:53.904+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T01:37:53.904Z", "start": "2025-02-23T01:37:53.904Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 01:37:54.188506+00', '2025-08-23 01:37:54.188506+00');
INSERT INTO "public"."pattern_analysis" VALUES ('8afe33d2-3d62-4dc4-8c77-fb781c2c0cc5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:11:10.411+00', '2025-08-23 02:11:10.411+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:11:10.411Z", "start": "2025-02-23T02:11:10.411Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:11:10.64225+00', '2025-08-23 02:11:10.64225+00');
INSERT INTO "public"."pattern_analysis" VALUES ('85e7aff5-a667-44b2-9f8d-bcf7b2e8066f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:11:10.4+00', '2025-08-23 02:11:10.4+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:11:10.400Z", "start": "2025-02-23T02:11:10.400Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:11:10.66927+00', '2025-08-23 02:11:10.66927+00');
INSERT INTO "public"."pattern_analysis" VALUES ('bb9588db-2bd0-4a4e-9be9-4b3f379b50e2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:11:10.363+00', '2025-08-23 02:11:10.363+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:11:10.363Z", "start": "2025-02-23T02:11:10.363Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:11:10.669275+00', '2025-08-23 02:11:10.669275+00');
INSERT INTO "public"."pattern_analysis" VALUES ('6dc49881-8a96-439b-b59d-7682145405ef', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 01:29:16.347+00', '2025-08-24 01:29:16.347+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics noted.\n* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were observed.\n* Financial abuse was reported once, indicating potential control issues.\n* Incidents clustered around Wednesdays.\n\n**Possible escalation or concentration:**\n\n* The high frequency of severity levels 3 suggests a concerning pattern of harmful behaviors.\n* The recurrence of specific tactics (isolation, projection) warrants attention.\n\n**Practical next steps:**\n\n* Establish clear boundaries in communication and finances.\n* Maintain a detailed log of incidents, including dates, times, and specific behaviors.\n* Consider seeking support from trusted friends, family, or a support group.  Explore resources like the National Domestic Violence Hotline.\n\n**Safety note:** Prioritize your safety and well-being.  If you feel unsafe, seek immediate help.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T01:29:16.347Z", "start": "2025-02-24T01:29:16.347Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 01:29:17.84749+00', '2025-08-24 01:29:17.84749+00');
INSERT INTO "public"."pattern_analysis" VALUES ('5cf7e315-81f0-46b3-9a89-ac41925d3b56', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:11:10.368+00', '2025-08-23 02:11:10.368+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:11:10.368Z", "start": "2025-02-23T02:11:10.368Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:11:10.696871+00', '2025-08-23 02:11:10.696871+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0e45fd58-de9c-4cb3-8a8e-49ad5b092fac', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:11:19.774+00', '2025-08-23 02:11:19.774+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:11:19.774Z", "start": "2025-02-23T02:11:19.774Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:11:20.123702+00', '2025-08-23 02:11:20.123702+00');
INSERT INTO "public"."pattern_analysis" VALUES ('5cba4517-85e0-4d65-b481-f61b0044c5d5', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:53:37.669+00', '2025-08-23 02:53:37.669+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:53:37.669Z", "start": "2025-02-23T02:53:37.669Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:53:37.912692+00', '2025-08-23 02:53:37.912692+00');
INSERT INTO "public"."pattern_analysis" VALUES ('aa50c93f-5cc8-474d-af9a-21b825d65ca2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:53:37.662+00', '2025-08-23 02:53:37.662+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:53:37.662Z", "start": "2025-02-23T02:53:37.662Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:53:37.92616+00', '2025-08-23 02:53:37.92616+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0ff0d7a6-6104-4ef5-a4e2-d5a60db0256f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:53:37.793+00', '2025-08-23 02:53:37.793+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:53:37.793Z", "start": "2025-02-23T02:53:37.793Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:53:38.01795+00', '2025-08-23 02:53:38.01795+00');
INSERT INTO "public"."pattern_analysis" VALUES ('90f51665-08cf-437d-83d0-9e1a59978aa8', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 01:32:24.234+00', '2025-08-24 01:32:24.234+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics noted.\n* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were present.\n* Incidents show a range of severity.\n* Certain days of the week (Wednesdays and Tuesdays) show a higher frequency of incidents.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The higher severity incidents (level 3) are a significant concern.\n\n**Practical next steps:**\n\n* Track incidents (date, time, behavior, impact).\n* Set clear boundaries; practice assertive communication.\n* Consider seeking support from trusted friends, family, or a support group.\n* Explore resources like helplines or therapy.\n\n**Safety note:** Prioritize your safety and well-being; don''t hesitate to seek help if you feel unsafe.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T01:32:24.234Z", "start": "2025-02-24T01:32:24.234Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 01:32:25.844225+00', '2025-08-24 01:32:25.844225+00');
INSERT INTO "public"."pattern_analysis" VALUES ('1488adb7-9d81-4f44-8a48-a5c368c6548f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:53:37.734+00', '2025-08-23 02:53:37.734+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:53:37.734Z", "start": "2025-02-23T02:53:37.734Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:53:38.075501+00', '2025-08-23 02:53:38.075501+00');
INSERT INTO "public"."pattern_analysis" VALUES ('c8a9d4c9-1323-41f5-a724-152ea5dee067', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 02:53:50.311+00', '2025-08-23 02:53:50.311+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Unable to generate insights at this time."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T02:53:50.311Z", "start": "2025-02-23T02:53:50.311Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 02:53:50.546611+00', '2025-08-23 02:53:50.546611+00');
INSERT INTO "public"."pattern_analysis" VALUES ('df85404b-aff6-4bf5-bb6d-2568a13d2a1c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 03:24:58.878+00', '2025-08-23 03:24:58.878+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T03:24:58.878Z", "start": "2025-02-23T03:24:58.878Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 03:24:59.121022+00', '2025-08-23 03:24:59.121022+00');
INSERT INTO "public"."pattern_analysis" VALUES ('e51aad4e-0653-4e0c-93c5-b18d2bbed9e2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 03:27:32.077+00', '2025-08-23 03:27:32.077+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T03:27:32.077Z", "start": "2025-02-23T03:27:32.077Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 03:27:32.273071+00', '2025-08-23 03:27:32.273071+00');
INSERT INTO "public"."pattern_analysis" VALUES ('504bc1ed-7dab-45c9-b20e-5c94dfab3a0c', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-07-24 01:57:47.131+00', '2025-08-24 01:57:47.131+00', '{"isolation": 3, "projection": 1, "gaslighting": 1, "love_bombing": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Recurring themes of isolation, manipulation (gaslighting, projection, love-bombing), and financial abuse.\n* Incidents show a range of severity.\n* Events are spread across the week, with no clear daily pattern.\n\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The combination of isolation with other abusive behaviors is particularly noteworthy.\n\n\n**Practical next steps:**\n\n*  Prioritize establishing clear boundaries.\n*  Continue journaling; consider adding a severity rating to each entry.\n*  Explore support resources (hotlines, support groups).\n*  Document all financial transactions.\n\n\n**Safety note:** Your safety is paramount; seek help if you feel unsafe.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T01:57:47.131Z", "start": "2025-07-24T01:57:47.131Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 5, 'gemini-1.5-flash', '2025-08-24 01:57:48.568327+00', '2025-08-24 01:57:48.568327+00');
INSERT INTO "public"."pattern_analysis" VALUES ('eaadd9b7-4de4-4151-ae38-167075f43cab', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:40:16.797+00', '2025-08-23 22:40:16.797+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:40:16.797Z", "start": "2025-02-23T22:40:16.797Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:40:17.004583+00', '2025-08-23 22:40:17.004583+00');
INSERT INTO "public"."pattern_analysis" VALUES ('ef6a3989-e843-4928-bc0d-a519f4488d35', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:43:34.447+00', '2025-08-23 22:43:34.447+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:43:34.447Z", "start": "2025-02-23T22:43:34.447Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:43:34.605929+00', '2025-08-23 22:43:34.605929+00');
INSERT INTO "public"."pattern_analysis" VALUES ('27608e45-eb09-4832-b5a0-baf1e6f47be2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:48:20.147+00', '2025-08-23 22:48:20.147+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:48:20.147Z", "start": "2025-02-23T22:48:20.147Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:48:20.622914+00', '2025-08-23 22:48:20.622914+00');
INSERT INTO "public"."pattern_analysis" VALUES ('cafd93ee-c80d-45ae-bbb5-d72ac4eea752', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:56:22.797+00', '2025-08-23 22:56:22.797+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:56:22.797Z", "start": "2025-02-23T22:56:22.797Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:56:22.927077+00', '2025-08-23 22:56:22.927077+00');
INSERT INTO "public"."pattern_analysis" VALUES ('2e7352b1-3ec8-4998-a825-1626cac137b3', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:57:12.213+00', '2025-08-23 22:57:12.213+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:57:12.213Z", "start": "2025-02-23T22:57:12.213Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:57:12.427901+00', '2025-08-23 22:57:12.427901+00');
INSERT INTO "public"."pattern_analysis" VALUES ('9efca06b-8879-4f21-b026-fc3d3ae3f4b9', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 22:57:38.125+00', '2025-08-23 22:57:38.125+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T22:57:38.125Z", "start": "2025-02-23T22:57:38.125Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-pro', '2025-08-23 22:57:38.301098+00', '2025-08-23 22:57:38.301098+00');
INSERT INTO "public"."pattern_analysis" VALUES ('0dd58a63-a987-48f1-af87-b57435fd34d7', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 23:06:12.186+00', '2025-08-23 23:06:12.186+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:\n\n1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  This suggests a pattern of systematically cutting the victim off from support networks while simultaneously blaming the victim for the abuser''s own behaviors. This combination is particularly dangerous as it leaves the victim vulnerable and increasingly susceptible to believing the abuser''s false narratives.  Escalation risk is high because these tactics erode the victim''s self-esteem and ability to recognize the abuse.\n\n2. **Varied Abuse Tactics Indicate a Calculated Approach:** The abuser employs a range of tactics (financial, gaslighting, silent treatment, smear campaign, love-bombing), indicating a calculated and manipulative strategy. The presence of love-bombing alongside other abusive behaviors suggests a cyclical pattern of idealization, devaluation, and discard, characteristic of narcissistic abuse. This makes recovery more challenging as the victim experiences periods of intense affection that reinforce the abusive bond.\n\n3. **Safety Ratings Suggest Fluctuating Risk:** The safety ratings show a mix of moderate (3) and relatively safe (2,4) days. This fluctuation suggests the abuse is not consistently severe but rather episodic, with periods of relative calm interspersed with intense abuse.  This inconsistency can make it difficult for the victim to recognize the pattern and seek help, as they might be lulled into a false sense of security.  However, the prevalence of \"3\" ratings indicates a significant ongoing risk.\n\n4. **Weekday Concentration of Abuse:** The higher frequency of abuse incidents on Wednesdays (3) and Tuesdays (2) compared to other days suggests a potential link to the abuser''s schedule or routine. Understanding this pattern could be helpful in developing safety strategies.  This could indicate work stress or other external factors influencing the abuser''s behavior.\n\n5. **Recovery Recommendations:**  Given the identified patterns, recovery should focus on:\n    * **Building a Support Network:**  Prioritize reconnecting with trusted friends and family, or seeking support from therapists specializing in narcissistic abuse. This directly counters the abuser''s isolation tactics.\n    * **Journaling and Self-Reflection:**  Documenting incidents and analyzing patterns can help the victim recognize the abuse and challenge the abuser''s gaslighting and projections.\n    * **Financial Independence:**  If financial abuse occurred, seeking professional financial advice and developing a plan for financial independence is crucial."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T23:06:12.186Z", "start": "2025-02-23T23:06:12.186Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-23 23:06:15.6897+00', '2025-08-23 23:06:15.6897+00');
INSERT INTO "public"."pattern_analysis" VALUES ('7bdc9744-0549-44ec-b371-d875e65e40eb', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 23:19:33.258+00', '2025-08-23 23:19:33.258+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:\n\n1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  This suggests a pattern of systematically cutting the victim off from support networks while simultaneously blaming the victim for the abuser''s own behaviors. This combination is particularly insidious and damaging, increasing the risk of the victim internalizing the abuse and believing the abuser''s false narratives.\n\n2. **Escalation Risk is Moderate to High:** The safety ratings (mostly 3s, with some 2s and 4s) indicate a fluctuating level of safety, suggesting potential for escalation.  The presence of both love-bombing and the silent treatment points to a cyclical pattern of abuse, where periods of intense affection are followed by periods of withdrawal and emotional neglect. This cyclical nature can be highly destabilizing and makes it harder for the victim to leave the relationship. The fact that abuse is spread across multiple days of the week suggests a consistent pattern rather than isolated incidents.\n\n3. **Financial Abuse is a Significant Concern:** Although only one incident of financial abuse is recorded, this is a serious red flag. Financial control is a common tactic used by abusers to maintain power and prevent the victim from leaving.  It''s crucial to monitor this aspect closely, as it can significantly hinder the victim''s ability to escape the abusive relationship.\n\n4. **Recovery Recommendations:**  Given the prevalence of isolation, a crucial recovery step is rebuilding a strong support network. This includes connecting with trusted friends, family, or support groups specializing in narcissistic abuse. Therapy is also strongly recommended to help process the trauma, challenge the abuser''s narratives, and develop healthy coping mechanisms.  Financial counseling might be necessary to address the financial abuse and regain control over personal finances.  Learning about narcissistic personality disorder and understanding the abuser''s tactics can empower the victim to recognize and resist future manipulation.\n\n5. **Data Limitations:** The relatively small number of incidents (6) limits the robustness of these conclusions.  A longer data set would provide a more comprehensive picture of the abuse patterns and escalation trajectory.  Additionally, the subjective nature of \"safety ratings\" needs to be considered.  A more detailed description of the incidents themselves would provide richer insights.\n\n\nIn summary, the data suggests a concerning pattern of narcissistic abuse with a moderate to high risk of escalation.  Prioritizing safety, rebuilding support networks, and"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T23:19:33.258Z", "start": "2025-02-23T23:19:33.258Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-23 23:19:36.760003+00', '2025-08-23 23:19:36.760003+00');
INSERT INTO "public"."pattern_analysis" VALUES ('50c237cb-0e27-4b93-9f93-575371eba606', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 23:20:35.541+00', '2025-08-23 23:20:35.541+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:\n\n1. **Isolation and Projection are Key Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  Isolation cuts off support networks, making the victim more vulnerable to manipulation. Projection shifts blame and responsibility onto the victim, further eroding their self-esteem and sense of reality. This combination suggests a high risk of further abuse and manipulation.\n\n2. **Abuse is Cyclical, but Not Consistently Escalating (Yet):** While the abuse types vary, the safety ratings show a concentration around level 3 (8 out of 12 ratings). This suggests a cyclical pattern of abuse, with periods of relative calm interspersed with abusive episodes.  However, the lack of consistently higher safety ratings (4) indicates that the abuse hasn''t yet escalated dramatically.  This is crucial;  a seemingly stable level 3 can still be incredibly damaging over time, and a sudden escalation to higher levels is possible.\n\n3. **Weekday Vulnerability:** The higher frequency of abuse incidents on Wednesdays (3) and Tuesdays (2) suggests potential vulnerabilities linked to specific routines or stressors on those days. Understanding these triggers could be crucial for developing coping strategies and safety planning.\n\n4. **Love Bombing and Smear Campaigns Indicate a Classic Cycle:** The presence of both love-bombing and a smear campaign suggests a classic narcissistic abuse cycle. The love-bombing phase establishes a false sense of security, making the subsequent abuse more impactful and harder to recognize. The smear campaign aims to isolate the victim further and discredit them to others.\n\n5. **Recovery Recommendations:**  Given the patterns, recovery should prioritize:\n    * **Building a Support Network:** Actively reconnect with trusted friends and family, or seek support groups specializing in narcissistic abuse. This directly counters the abuser''s isolation tactics.\n    * **Journaling and Self-Reflection:**  Documenting incidents, feelings, and patterns can help the victim gain clarity and recognize the manipulation. This is vital for breaking the cycle of gaslighting and self-doubt.\n    * **Therapy:** Professional therapy is crucial for processing trauma, rebuilding self-esteem, and developing healthy coping mechanisms.  A therapist specializing in narcissistic abuse is highly recommended.\n    * **Safety Planning:** Given the cyclical nature of the abuse, developing a safety plan including emergency contacts, safe places, and escape routes is essential to prepare for potential escalation."}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T23:20:35.541Z", "start": "2025-02-23T23:20:35.541Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-23 23:20:39.071222+00', '2025-08-23 23:20:39.071222+00');
INSERT INTO "public"."pattern_analysis" VALUES ('de4d0ccb-5b4f-4d23-810f-5902cd3484ec', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-23 23:37:52.669+00', '2025-08-23 23:37:52.669+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:\n\n1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  Isolation cuts off support systems, making the victim more vulnerable to manipulation. Projection shifts blame and responsibility onto the victim, further eroding their self-esteem and sense of reality. This combination suggests a high level of control and manipulation aimed at destabilizing the victim.  The escalation risk is high if these tactics continue or intensify.\n\n2. **Fluctuating Abuse with Periods of \"Calm\":** The presence of love-bombing alongside other abusive tactics indicates a cyclical pattern of abuse.  The \"love-bombing\" phase likely serves to re-engage the victim after periods of abuse, making it difficult to leave the relationship. The relatively low number of total incidents (6) might be misleading; it could represent a snapshot of a larger, cyclical pattern.  The safety ratings fluctuating between 2 and 4 further support this, suggesting periods of both high and low risk.\n\n3. **Weekday Focus and Lack of Predictability:** The abuse incidents are concentrated on Wednesdays and Tuesdays, suggesting a potential pattern related to the abuser''s schedule or routine. However, the presence of incidents on other days (Sunday) indicates a lack of complete predictability, making it difficult for the victim to anticipate and prepare for abuse. This unpredictability adds to the stress and anxiety experienced by the victim.\n\n4. **Escalation Risk is Moderate to High:** While the total number of incidents is relatively low, the combination of severe tactics (isolation, projection, gaslighting) and the cyclical nature of the abuse points to a moderate to high risk of escalation.  The abuser might increase the frequency and intensity of these tactics, potentially introducing new forms of abuse.  The lack of clear predictability increases this risk.\n\n5. **Recovery Recommendations:**\n    * **Prioritize Safety:**  Given the safety ratings, immediate focus should be on creating a safety plan, including identifying safe places, trusted individuals, and emergency contacts.\n    * **Seek Professional Help:** Therapy, particularly trauma-informed therapy, is crucial to process the emotional impact of the abuse, develop coping mechanisms, and establish healthy boundaries.  Support groups can also provide valuable connection and validation.\n    * **Document the Abuse:**  Keeping a detailed record of incidents, including dates, times, and specific behaviors, can be"}', '[]', '{"model": "deterministic_v1", "score": 20, "timeframe": {"end": "2025-08-23T23:37:52.669Z", "start": "2025-02-23T23:37:52.669Z"}, "risk_label": "high", "top_reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-23 23:37:56.250656+00', '2025-08-23 23:37:56.250656+00');
INSERT INTO "public"."pattern_analysis" VALUES ('1fd91dd1-cafb-47ae-9fe4-e1785c13543d', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-02-24 02:11:13.374+00', '2025-08-24 02:11:13.374+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "**Key patterns observed:**\n\n* Frequent isolation and projection tactics were noted.\n* A variety of manipulative behaviors occurred, including gaslighting, love-bombing, and a smear campaign.\n* Incidents were spread across the week, with a slight concentration on Wednesdays.\n* Severity levels indicate a mix of experiences, some more intense than others.\n\n**Possible escalation or concentration:**\n\n* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The higher severity incidents (level 3) are concerning.\n\n**Practical next steps:**\n\n* Establish clear boundaries in communication and interactions.\n* Maintain a detailed record of incidents (dates, times, details).\n* Consider seeking support from trusted friends, family, or a support group.\n* Explore resources like helplines or counseling services.\n\n**Safety note:** Your safety and well-being are paramount.  Prioritize self-care and seek help if you feel unsafe.\n"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 20, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-08-24T02:11:13.374Z", "start": "2025-02-24T02:11:13.374Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-08-24 02:11:15.086618+00', '2025-08-24 02:11:15.086618+00');
INSERT INTO "public"."pattern_analysis" VALUES ('5c218bb0-554f-4982-b2fa-e3c65da655af', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'abuse_patterns', '2025-04-21 18:43:48.13+00', '2025-10-21 18:43:48.13+00', '{"isolation": 3, "projection": 2, "gaslighting": 1, "love_bombing": 1, "smear_campaign": 1, "financial_abuse": 1, "silent_treatment": 1}', '{"text": "UNAVAILABLE"}', '[]', '{"label": "high", "model": "deterministic_v1", "score": 18, "trend": "rising", "reasons": [{"reason": "Multiple recent severe behaviors", "weight": 6}], "timeframe": {"end": "2025-10-21T18:43:48.130Z", "start": "2025-04-21T18:43:48.130Z"}, "confidence": "medium", "evidence_refs": [{"snippet": "Partner restricted my access to our shared funds after an argument.", "entry_id": "72892fb6-f910-44f2-a24a-731e5f21a939", "incident_date": "2025-08-20T00:04:04.369197+00:00", "matched_signals": ["financial_abuse", "isolation", "safety<=2"]}, {"snippet": "Said visiting my family would “cause problems.”", "entry_id": "25650d24-6cff-434d-b567-b9e64688b105", "incident_date": "2025-08-17T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Denied prior statements and flipped blame.", "entry_id": "c445623e-662e-46da-b96e-c3492905b5fe", "incident_date": "2025-08-13T00:04:04.369197+00:00", "matched_signals": ["gaslighting"]}, {"snippet": "Sudden gifts and apologies after a tense week.", "entry_id": "a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9", "incident_date": "2025-08-05T00:04:04.369197+00:00", "matched_signals": ["love_bombing"]}, {"snippet": "Refused to speak after I set a boundary; discouraged seeing friends.", "entry_id": "92766d9a-b19c-48e8-bc31-e584af647f6f", "incident_date": "2025-07-29T00:04:04.369197+00:00", "matched_signals": ["isolation"]}, {"snippet": "Told mutual friends I was controlling; then accused me of it.", "entry_id": "e75d5b17-05bf-4003-b3b0-f059ca63b765", "incident_date": "2025-07-23T00:04:04.369197+00:00", "matched_signals": []}], "binary_summary": "abusive_patterns_likely", "disclaimer_version": "v1"}', NULL, 6, 'gemini-1.5-flash', '2025-10-21 18:43:48.501748+00', '2025-10-21 18:43:48.501748+00');

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
-- Records of pattern_detections
-- ----------------------------

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
-- Records of positive_moments
-- ----------------------------
INSERT INTO "public"."positive_moments" VALUES ('c1ec1dd4-dc57-485f-aa7f-e54ba450fcde', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', ' today today i completed today i completed my today i completed my project Today I completed my project.', '2025-11-12', '{strength}', 8, '2025-11-12 00:03:10.719579+00', 'moment', NULL, 'f');

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
-- Records of profiles
-- ----------------------------
INSERT INTO "public"."profiles" VALUES ('8348cab0-73b9-48ee-b600-cb2143933f2b', 'syedarnaqviii@gmail.com', 'syedarnaqviii', 'recovery', '2025-08-18 18:47:16.750708+00', '2025-08-18 18:47:16.750708+00', 't', 'UTC', NULL, NULL, NULL, NULL, NULL, '{"analytics": true, "data_sharing": false, "marketing_emails": false, "push_notifications": true}', '{"login_alerts": true, "data_encryption": true, "two_factor_enabled": false}', '{}', NULL, 'f', NULL, NULL, 'auto', NULL);
INSERT INTO "public"."profiles" VALUES ('a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'akw.h.vq.k.sh.h.sks.vvv@gmail.com', 'saleem', 'recovery', '2025-08-17 17:19:29.783882+00', '2025-08-18 14:08:38.02+00', 't', 'UTC', NULL, NULL, NULL, NULL, NULL, '{"analytics": true, "data_sharing": false, "marketing_emails": false, "push_notifications": true}', '{"login_alerts": true, "data_encryption": true, "two_factor_enabled": false}', '{"affirmations": {"auto_play": false}}', 'female', 'f', NULL, NULL, 'auto', NULL);

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
-- Records of reactive_abuse_incidents
-- ----------------------------

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
-- Records of reactive_abuse_patterns
-- ----------------------------

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
-- Records of reality_log_entries
-- ----------------------------
INSERT INTO "public"."reality_log_entries" VALUES ('5cd39a69-2323-452d-be11-3454f54d7626', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '2025-10-20', 'This is a test.', 'This is a test.', 'Emotional Manipulation', 'f', '', '2025-10-20 01:27:31.581204', '2025-10-20 01:27:31.581204', NULL);

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
-- Records of reality_testing_sessions
-- ----------------------------

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
-- Records of recovery_lessons
-- ----------------------------

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
-- Records of referral_analytics
-- ----------------------------

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
-- Records of role_boundaries
-- ----------------------------

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
-- Records of routine_streaks
-- ----------------------------
INSERT INTO "public"."routine_streaks" VALUES ('4c1f097e-7e79-4ec4-ba06-75af587f3588', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'morning_intention', 1, 1, '2025-10-23', '2025-10-20 01:23:32.628785');

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
-- Records of safety_plans
-- ----------------------------
INSERT INTO "public"."safety_plans" VALUES ('22c5c138-5a9e-4d45-830c-dbf6939f3f21', '8348cab0-73b9-48ee-b600-cb2143933f2b', '[]', '[]', NULL, NULL, '[]', '2025-08-19 22:24:51.402529+00', '2025-08-19 22:24:51.402529+00', '{}', '{}', '{}', '[]', '2025-08-19 22:24:50.869+00', 30, NULL, NULL);
INSERT INTO "public"."safety_plans" VALUES ('268174d5-3e40-47f8-9a69-5277e35a51ac', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '[{"id": "eb0b46b0-c5f9-4903-8411-e3df9db1ba2b", "name": "sardar", "phone": "2342342", "relationship": "friend", "available_times": "any time"}]', '[{"id": "1334fae3-07ba-4daf-b61b-c3ba576f2c14", "name": "maria b house", "notes": "", "phone": "", "address": "karachi stree 2334", "contact_person": "saleem sulman"}]', NULL, NULL, '[]', '2025-08-18 14:20:30.829562+00', '2025-08-18 14:28:33.008+00', NULL, '{"notes": "Atm Near by", "accounts": [{"last4": "2323", "institution": "chase"}], "emergency_fund": 200, "trusted_contact": {"name": "Aunt Sarah", "phone": "5552342342 234"}}', '{"steps": ["text code ward to jane", "call cab"], "code_word": "sunrisze", "safe_bag_location": "closet half top"}', '{}', '2025-08-18 14:20:30.829562+00', 30, '38435f07de52f8741d9452cbeacb6ad9cc9bc6f02c676f9525a9421e3abd937d:341a1128fea96c500aa9b01c72648a048fb6f6be1bf7659c4ed82886e7987e3ab282953a0a8b9f68c155662845e83ea52d8221440144f912e4d578494164ad0d', 'the last information store in this entry was i had last 600$');

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
-- Records of stonewalling_incidents
-- ----------------------------

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
-- Records of stonewalling_patterns
-- ----------------------------

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
-- Records of stonewalling_responses
-- ----------------------------

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
-- Records of therapy_referrals
-- ----------------------------

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
-- Records of toxic_memories
-- ----------------------------

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
-- Records of trait_combinations
-- ----------------------------

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
-- Records of trait_frequency_tracking
-- ----------------------------

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
-- Records of trigger_calendar
-- ----------------------------

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
-- Records of usage_tracking
-- ----------------------------
INSERT INTO "public"."usage_tracking" VALUES ('3192168f-bb26-474c-a927-db545f7d405b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ai_interactions', 'monthly_count', 72, '{"feature": "ai_chat", "context_type": "general", "message_length": 48, "response_length": 4607}', '2025-11-01', '2025-11-30', '2025-11-12 15:30:25.563707+00');
INSERT INTO "public"."usage_tracking" VALUES ('58c33220-fcf0-421b-a2f2-759914758222', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'journal_entries', 'monthly_count', 4, '{}', '2025-08-01', '2025-08-31', '2025-08-18 18:50:57.899176+00');
INSERT INTO "public"."usage_tracking" VALUES ('cbd451d8-cfd7-4360-bd17-80ab8309b23e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'evidence_files', 'monthly_count', 37, '{}', '2025-08-01', '2025-08-31', '2025-08-18 15:28:48.622403+00');
INSERT INTO "public"."usage_tracking" VALUES ('ec8c2d74-4ff5-45cd-ac4d-3d4f2e76f87a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'storage', 'storage_mb', 37, '{}', '2025-08-01', '2025-08-31', '2025-08-18 15:28:48.622403+00');
INSERT INTO "public"."usage_tracking" VALUES ('cb1b81a2-3854-4cf7-9272-992c99ca9e38', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'evidence_files', 'monthly_count', 15, '{}', '2025-08-01', '2025-08-31', '2025-08-18 18:50:59.813887+00');
INSERT INTO "public"."usage_tracking" VALUES ('6cc4f704-5bce-4a5a-9e06-273b5e831b58', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'storage', 'storage_mb', 16, '{}', '2025-08-01', '2025-08-31', '2025-08-18 18:50:59.813887+00');
INSERT INTO "public"."usage_tracking" VALUES ('903ae988-5f6e-4614-a8fb-ef0c9715809e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern_analysis', 'monthly_count', 1, '{}', '2025-10-01', '2025-10-31', '2025-10-21 18:43:48.501748+00');
INSERT INTO "public"."usage_tracking" VALUES ('b1999795-8977-469c-8094-a96f72474218', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'journal_entries', 'monthly_count', 14, '{}', '2025-08-01', '2025-08-31', '2025-08-18 15:13:11.459729+00');
INSERT INTO "public"."usage_tracking" VALUES ('10ca4c05-029b-4131-bf3d-c5b9688e8ba3', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'grey_rock_practice', 'monthly_count', 7, '{"event": "next_scenario", "scenario_id": "b59c87ca-b88a-4a8a-877e-8ea266ca5e21"}', '2025-08-01', '2025-08-31', '2025-08-21 20:35:09.103289+00');
INSERT INTO "public"."usage_tracking" VALUES ('1407e542-6213-4345-8ee4-fd6dd823a43f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ai_interactions', 'monthly_count', 18, '{"feature": "ai_chat", "context_type": "general", "message_length": 27, "response_length": 1984}', '2025-10-01', '2025-10-31', '2025-10-22 19:56:08.804504+00');
INSERT INTO "public"."usage_tracking" VALUES ('d7b52612-ff12-4f08-9f35-2a5e8ad35510', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'journal_entries', 'monthly_count', 1, '{}', '2025-11-01', '2025-11-30', '2025-11-11 16:40:09.777143+00');
INSERT INTO "public"."usage_tracking" VALUES ('9e40886e-f60b-45c1-9fba-c30b2dbc837a', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'pattern_analysis', 'monthly_count', 2, '{}', '2025-08-01', '2025-08-31', '2025-08-19 22:23:14.584648+00');
INSERT INTO "public"."usage_tracking" VALUES ('f3a67203-cca5-4724-9181-1264f24fab5e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern_analysis', 'monthly_count', 91, '{}', '2025-08-01', '2025-08-31', '2025-08-21 14:48:52.047551+00');
INSERT INTO "public"."usage_tracking" VALUES ('9e15abc2-7806-4325-add2-3ce7b07eeb0a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'ai_interactions', 'monthly_count', 11, '{"feature": "ai_chat", "context_type": "general", "message_length": 65, "response_length": 1311}', '2025-08-01', '2025-08-31', '2025-08-19 16:04:29.044819+00');
INSERT INTO "public"."usage_tracking" VALUES ('93496495-c8d3-4eec-85df-45a714e5e622', '8348cab0-73b9-48ee-b600-cb2143933f2b', 'ai_interactions', 'monthly_count', 3, '{"model": "gemini-1.5-flash", "locale": "en", "feature": "suggest_metadata", "text_length": 232}', '2025-08-01', '2025-08-31', '2025-08-31 06:04:36.307736+00');

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
-- Records of user_insights
-- ----------------------------
INSERT INTO "public"."user_insights" VALUES ('7621fff2-3709-44a1-b35d-6e7949fbd72e', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', 'Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:

1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  This suggests a pattern of systematically cutting the victim off from support networks while simultaneously blaming the victim for the abuser''s own behaviors. This combination is particularly dangerous as it leaves the victim vulnerable and increasingly susceptible to believing the abuser''s false narratives.  Escalation risk is high because these tactics erode the victim''s self-esteem and ability to recognize the abuse.

2. **Varied Abuse Tactics Indicate a Calculated Approach:** The abuser employs a range of tactics (f', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{0dd58a63-a987-48f1-af87-b57435fd34d7}', '[]', 'f', 'f', NULL, '2025-08-23 23:06:15.778218+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('6319b6f7-d005-44d3-9be6-118ba337802a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', 'Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:

1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  This suggests a pattern of systematically cutting the victim off from support networks while simultaneously blaming the victim for the abuser''s own behaviors. This combination is particularly insidious and damaging, increasing the risk of the victim internalizing the abuse and believing the abuser''s false narratives.

2. **Escalation Risk is Moderate to High:** The safety ratings (mostly 3s, with some 2s and 4s) indicate a fluctuating level of safety, suggesting potential for escalation.  The presence of both love-bombi', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{7bdc9744-0549-44ec-b371-d875e65e40eb}', '[]', 'f', 'f', NULL, '2025-08-23 23:19:36.827474+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('4765b3dd-0596-4e9f-bc5f-1649c6f7f196', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', 'Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:

1. **Isolation and Projection are Key Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  Isolation cuts off support networks, making the victim more vulnerable to manipulation. Projection shifts blame and responsibility onto the victim, further eroding their self-esteem and sense of reality. This combination suggests a high risk of further abuse and manipulation.

2. **Abuse is Cyclical, but Not Consistently Escalating (Yet):** While the abuse types vary, the safety ratings show a concentration around level 3 (8 out of 12 ratings). This suggests a cyclical pattern of abuse, with periods of relative calm interspe', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{50c237cb-0e27-4b93-9f93-575371eba606}', '[]', 'f', 'f', NULL, '2025-08-23 23:20:39.142535+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('5bfcd6fc-0882-4cd5-ae27-8d0c84a8dec2', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', 'Based on the provided data, here are some key insights regarding the narcissistic abuse patterns:

1. **Isolation and Projection are Dominant Tactics:**  The abuser heavily relies on isolation (3 incidents) and projection (2 incidents) to control and manipulate the victim.  Isolation cuts off support systems, making the victim more vulnerable to manipulation. Projection shifts blame and responsibility onto the victim, further eroding their self-esteem and sense of reality. This combination suggests a high level of control and manipulation aimed at destabilizing the victim.  The escalation risk is high if these tactics continue or intensify.

2. **Fluctuating Abuse with Periods of "Calm":** The presence of love-bombing alongside other abusive tactics indicates a cyclical pattern of abuse.  ', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{de4d0ccb-5b4f-4d23-810f-5902cd3484ec}', '[]', 'f', 'f', NULL, '2025-08-23 23:37:56.347675+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('a2b012da-ea3b-4197-aedd-59f62a5d16ec', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Recurring themes of isolation, projection, and manipulation (gaslighting, love-bombing, smear campaigns).
* Incidents cluster around Wednesdays and Tuesdays.
* Severity levels indicate a mix of moderate and high-impact events.  Financial abuse was noted once.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The higher severity incidents warrant attention.  The clustering on certain days of the week might indicate predictable triggers.

**Practical next steps:**

*  Prioritize setting clear boundaries.
*  Continue journaling; add a section to track specific behaviors and your emotional responses.
*  Consider seeking support from trusted friends, fam', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{30edcde0-8460-48c3-b0a2-7ce155df7e2c}', '[]', 'f', 'f', NULL, '2025-08-23 23:49:41.687416+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('3597fc1a-4bbd-4da5-a66d-26fed746dc9a', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics were noted.
* A range of manipulative behaviors occurred, including gaslighting, love-bombing, and a smear campaign.
* Incidents were spread across the week, with a slight concentration on Wednesdays and Tuesdays.
* Severity levels indicate a mix of less and more intense experiences.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of control.  The higher severity incidents (level 3) are concerning.

**Practical next steps:**

* Prioritize establishing clear boundaries.
* Maintain a detailed record of incidents (dates, times, specifics).
* Consider seeking support from trusted friends, family, or a support gro', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{2341e086-01e6-4800-a207-29bd12b6b56e}', '[]', 'f', 'f', NULL, '2025-08-24 00:11:03.780246+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('2cc94b45-7670-40ee-bade-904e9d679aec', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics were noted.
* A range of manipulative behaviors occurred, including gaslighting, love-bombing, and smear campaigns.
* Incidents were spread across the week, with a slight concentration on Wednesdays.

**Possible escalation or concentration:**

* The combination of isolation and other manipulative tactics suggests a potential pattern of control.
* The moderate to high severity levels (levels 3 & 4) in several incidents indicate a need for increased attention to safety.

**Practical next steps:**

*  Maintain a detailed record of incidents, including dates, times, and specific behaviors.
*  Establish clear boundaries and communicate them firmly.
*  Consider seeking support from trusted friends, family, or a support group', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{68d21d7f-2491-4231-a074-086a15519264}', '[]', 'f', 'f', NULL, '2025-08-24 00:14:33.111161+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('dd261458-9134-4922-90c6-f9d57a31b77b', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics noted.
* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) occurred.
* Incidents show a range of severity, with some higher-impact events.
* No clear pattern of escalation is evident, but the frequency is concerning.

**Possible escalation or concentration:**

* While no clear escalation is seen, the consistent presence of manipulative behaviors warrants attention.  The variety of tactics suggests a deliberate pattern of control.

**Practical next steps:**

* Prioritize self-care and connect with trusted individuals.
* Document incidents with dates, times, and details.
* Consider setting clear boundaries and enforcing them consistently.
* Explore resources like support groups or helplines.

*', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{399b9197-2efb-4375-9abb-a8799006a4c8}', '[]', 'f', 'f', NULL, '2025-08-24 00:26:18.737206+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('07053f07-39c5-4ca4-ad16-5334628da275', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics noted.
* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were present.
* Incidents show a range of severity, with some higher-impact events.
* Certain days of the week (Wednesdays and Tuesdays) seem to have a higher frequency of incidents.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of control.  The higher severity incidents warrant attention.

**Practical next steps:**

* Track incidents (date, time, type, severity).
* Set clear boundaries to protect your well-being.
* Consider seeking support from trusted friends, family, or a support group.

**Safety note:** Prioritize your', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{f712d018-3155-4ae3-a887-d960b48e2353}', '[]', 'f', 'f', NULL, '2025-08-24 00:30:32.63879+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('ef026b2a-5c89-475d-bcdf-22ac8e0a0072', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Recurring themes of isolation, projection, and manipulation (gaslighting, love bombing, smear campaigns).
* Incidents cluster around Wednesdays and Tuesdays.
* Severity levels indicate a mix of less and more intense experiences.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The higher severity incidents warrant attention.

**Practical next steps:**

* Track incidents: date, time, type of behavior, your emotional response.
* Set clear boundaries: communicate your needs and limits firmly.
* Consider seeking support: a trusted friend, family member, or therapist.  Explore resources for domestic abuse or emotional manipulation', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{ac27f95b-267c-4aac-9107-908ba4a2388b}', '[]', 'f', 'f', NULL, '2025-08-24 00:37:09.987929+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('c958738c-21b6-4bcf-a66f-d26ea3f23539', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation, projection, and manipulation tactics (gaslighting, love bombing, smear campaigns).
* Incidents cluster around Wednesdays.
* Severity levels indicate a range of experiences, with most incidents falling into a moderate severity range.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The clustering on Wednesdays warrants attention.

**Practical next steps:**

*  Establish clear boundaries in communication and interactions.
*  Continue journaling; note dates, times, and specific behaviors.  This helps track patterns.
*  Consider seeking support from trusted friends, family, or a support group.

**Safety note:*', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{009a39d7-4abc-4d64-be55-8cc1bd1076c2}', '[]', 'f', 'f', NULL, '2025-08-24 00:52:11.412618+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('8c8f4eea-aeb1-41df-998e-32f70f7bf201', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics noted.
* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were observed.
* Financial abuse was reported once, indicating potential control issues.
* Incidents clustered around Wednesdays.

**Possible escalation or concentration:**

* The high frequency of severity levels 3 suggests a concerning pattern of harmful behaviors.
* The recurrence of specific tactics (isolation, projection) warrants attention.

**Practical next steps:**

* Establish clear boundaries in communication and finances.
* Maintain a detailed log of incidents, including dates, times, and specific behaviors.
* Consider seeking support from trusted friends, family, or a support group.  Explore resources like the National Dom', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{6dc49881-8a96-439b-b59d-7682145405ef}', '[]', 'f', 'f', NULL, '2025-08-24 01:29:17.963576+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('8fd00dbb-a732-45af-83d1-a7a887f9879f', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics noted.
* A mix of manipulative behaviors (gaslighting, love-bombing, smear campaigns) were present.
* Incidents show a range of severity.
* Certain days of the week (Wednesdays and Tuesdays) show a higher frequency of incidents.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The higher severity incidents (level 3) are a significant concern.

**Practical next steps:**

* Track incidents (date, time, behavior, impact).
* Set clear boundaries; practice assertive communication.
* Consider seeking support from trusted friends, family, or a support group.
* Explore resources like helplines or therapy.

**Safety', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{90f51665-08cf-437d-83d0-9e1a59978aa8}', '[]', 'f', 'f', NULL, '2025-08-24 01:32:25.937117+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('e07f00f4-666c-4c1e-8087-eab30e0405f1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Recurring themes of isolation, manipulation (gaslighting, projection, love-bombing), and financial abuse.
* Incidents show a range of severity.
* Events are spread across the week, with no clear daily pattern.


**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a concerning pattern.  The combination of isolation with other abusive behaviors is particularly noteworthy.


**Practical next steps:**

*  Prioritize establishing clear boundaries.
*  Continue journaling; consider adding a severity rating to each entry.
*  Explore support resources (hotlines, support groups).
*  Document all financial transactions.


**Safety note:** Your safety is paramount; seek help if you feel', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f}', '{504bc1ed-7dab-45c9-b20e-5c94dfab3a0c}', '[]', 'f', 'f', NULL, '2025-08-24 01:57:48.674327+00', NULL);
INSERT INTO "public"."user_insights" VALUES ('0d74e767-33bd-4ce8-b82c-13e207a0f590', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'pattern', 'Pattern analysis update', '**Key patterns observed:**

* Frequent isolation and projection tactics were noted.
* A variety of manipulative behaviors occurred, including gaslighting, love-bombing, and a smear campaign.
* Incidents were spread across the week, with a slight concentration on Wednesdays.
* Severity levels indicate a mix of experiences, some more intense than others.

**Possible escalation or concentration:**

* While the number of incidents is relatively low, the variety of manipulative tactics suggests a potential pattern of controlling behavior.  The higher severity incidents (level 3) are concerning.

**Practical next steps:**

* Establish clear boundaries in communication and interactions.
* Maintain a detailed record of incidents (dates, times, details).
* Consider seeking support from trusted frie', 'medium', '{72892fb6-f910-44f2-a24a-731e5f21a939,25650d24-6cff-434d-b567-b9e64688b105,c445623e-662e-46da-b96e-c3492905b5fe,a075061c-6aa0-4e0d-a2bc-6d55c91ab8f9,92766d9a-b19c-48e8-bc31-e584af647f6f,e75d5b17-05bf-4003-b3b0-f059ca63b765}', '{1fd91dd1-cafb-47ae-9fe4-e1785c13543d}', '[]', 'f', 'f', NULL, '2025-08-24 02:11:15.215046+00', NULL);

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
-- Records of user_legal_needs
-- ----------------------------
INSERT INTO "public"."user_legal_needs" VALUES ('8348cab0-73b9-48ee-b600-cb2143933f2b', '{general_consultation}', 'medium', 'f', 'married', NULL, NULL, 't', '2025-10-24 01:20:33.084926+00', '2025-10-24 01:20:33.084926+00');
INSERT INTO "public"."user_legal_needs" VALUES ('a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', '{domestic_violence,safety_planning}', 'medium', 'f', 'married', NULL, NULL, 't', '2025-10-24 01:20:33.084926+00', '2025-10-24 01:20:33.084926+00');

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
-- Records of user_lesson_progress
-- ----------------------------

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
-- Records of user_template_usage
-- ----------------------------

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
-- Records of user_therapy_preferences
-- ----------------------------
INSERT INTO "public"."user_therapy_preferences" VALUES ('8348cab0-73b9-48ee-b600-cb2143933f2b', 'en', '{trauma,cbt}', NULL, NULL, NULL, '{weekday_morning}', 'moderate', 'f', '2025-10-24 01:08:34.198545+00', '2025-10-24 01:08:34.198545+00');
INSERT INTO "public"."user_therapy_preferences" VALUES ('a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'en', '{trauma,cbt}', NULL, NULL, NULL, '{weekday_morning}', 'moderate', 'f', '2025-10-24 01:08:34.198545+00', '2025-10-24 01:08:34.198545+00');

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
-- Records of user_trait_examples
-- ----------------------------

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
-- Records of user_trait_notes
-- ----------------------------
INSERT INTO "public"."user_trait_notes" VALUES ('0ba97854-60a9-4e53-a3a7-53123f47a802', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 'a19be14f-55fd-447c-b8da-60f6120ae079', 'yes this pattern is observed ', 'occasional', '2025-10-23 01:04:32.761507', '2025-10-23 01:04:31.426');

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
-- Records of wellness_goals
-- ----------------------------

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
-- Records of wellness_habits
-- ----------------------------

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
-- Records of wellness_reports
-- ----------------------------

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
-- Records of withdrawal_tracker
-- ----------------------------
INSERT INTO "public"."withdrawal_tracker" VALUES ('6904d808-f8e9-46b5-b2a7-1ae1b93c3876', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 5, '{}', 'kklj', ';l;lk;', '2025-11-12 10:45:31.650083+00');
INSERT INTO "public"."withdrawal_tracker" VALUES ('69258ba3-0888-40d7-a402-de08935fa9a1', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 8, '{panic}', 'my child', 'wont', '2025-11-12 14:49:53.356882+00');
INSERT INTO "public"."withdrawal_tracker" VALUES ('940ef356-510e-48d1-a403-20e0bb37d2fe', 'a580b1b2-d87c-4ba9-8e6d-31e74580d6c3', 5, '{}', 'yes', 'asdfasdf', '2025-11-12 22:19:21.124886+00');

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
-- Indexes structure for table manipulation_analysis
-- ----------------------------
CREATE INDEX "idx_manipulation_analysis_user" ON "public"."manipulation_analysis" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

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
-- Foreign Keys structure for table manipulation_analysis
-- ----------------------------
ALTER TABLE "public"."manipulation_analysis" ADD CONSTRAINT "manipulation_analysis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

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
-- Foreign Keys structure for table usage_tracking
-- ----------------------------
ALTER TABLE "public"."usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

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
