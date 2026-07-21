-- Phase 5: Resume Analysis module
-- Keep the `resumes` bucket private. The server performs all object access using
-- the service-role client; browser clients never receive a permanent object URL.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf'];

CREATE TABLE IF NOT EXISTS public.resume_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- This stores the private `resumes` bucket object path, not a public URL.
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  ats_score NUMERIC(5,2) NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  role_fit TEXT NOT NULL,
  key_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvement_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  analysis_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS resume_analysis_user_created_at_idx
  ON public.resume_analysis (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS resume_analysis_set_updated_at ON public.resume_analysis;
CREATE TRIGGER resume_analysis_set_updated_at
  BEFORE UPDATE ON public.resume_analysis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;

-- The API uses the Supabase service-role key, which bypasses RLS. These policies
-- make direct authenticated access safe if a future module needs it.
DROP POLICY IF EXISTS "Users can view their resume analyses" ON public.resume_analysis;
CREATE POLICY "Users can view their resume analyses"
  ON public.resume_analysis FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

NOTIFY pgrst, 'reload schema';
