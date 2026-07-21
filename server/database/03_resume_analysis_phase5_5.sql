-- Phase 5.5: AI Resume Analysis Database Migrations
-- This script adds the detailed metrics required by the updated Gemini prompt for Phase 5.5.

-- 1. Add new text and jsonb columns to store the granular analysis data
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS overall_summary TEXT;
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS ats_status TEXT;
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS ats_tips JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS section_scores JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS key_suggestions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.resume_analysis ADD COLUMN IF NOT EXISTS role_fit_summary TEXT;

-- 2. Force Supabase (PostgREST) to reload its schema cache so the API recognizes the columns
NOTIFY pgrst, 'reload schema';
