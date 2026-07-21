-- Phase 9: AI Practice Arena

CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  target_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed')),
  total_questions INTEGER NOT NULL DEFAULT 10 CHECK (total_questions BETWEEN 1 AND 20),
  current_question INTEGER NOT NULL DEFAULT 1 CHECK (current_question >= 1),
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CHECK (current_question <= total_questions)
);

CREATE TABLE IF NOT EXISTS public.practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_session_id UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL CHECK (question_number >= 1),
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'Multiple Choice', 'Coding Challenge', 'Short Answer', 'True / False', 'Scenario Based', 'Fill in the Blank'
  )),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  user_answer TEXT,
  ai_feedback JSONB,
  score INTEGER CHECK (score BETWEEN 0 AND 10),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  explanation TEXT,
  hints JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (practice_session_id, question_number)
);

CREATE TABLE IF NOT EXISTS public.practice_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0 CHECK (total_sessions >= 0),
  questions_attempted INTEGER NOT NULL DEFAULT 0 CHECK (questions_attempted >= 0),
  questions_correct INTEGER NOT NULL DEFAULT 0 CHECK (questions_correct >= 0),
  overall_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (overall_accuracy BETWEEN 0 AND 100),
  best_category TEXT,
  weakest_category TEXT,
  last_session TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS practice_sessions_user_created_idx
  ON public.practice_sessions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS practice_questions_session_number_idx
  ON public.practice_questions (practice_session_id, question_number);

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can view their own practice sessions"
  ON public.practice_sessions FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own practice questions" ON public.practice_questions;
CREATE POLICY "Users can view their own practice questions"
  ON public.practice_questions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_sessions
      WHERE practice_sessions.id = practice_questions.practice_session_id
        AND practice_sessions.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view their own practice statistics" ON public.practice_statistics;
CREATE POLICY "Users can view their own practice statistics"
  ON public.practice_statistics FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.practice_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS practice_sessions_set_updated_at ON public.practice_sessions;
CREATE TRIGGER practice_sessions_set_updated_at
  BEFORE UPDATE ON public.practice_sessions
  FOR EACH ROW EXECUTE FUNCTION public.practice_set_updated_at();

DROP TRIGGER IF EXISTS practice_questions_set_updated_at ON public.practice_questions;
CREATE TRIGGER practice_questions_set_updated_at
  BEFORE UPDATE ON public.practice_questions
  FOR EACH ROW EXECUTE FUNCTION public.practice_set_updated_at();

DROP TRIGGER IF EXISTS practice_statistics_set_updated_at ON public.practice_statistics;
CREATE TRIGGER practice_statistics_set_updated_at
  BEFORE UPDATE ON public.practice_statistics
  FOR EACH ROW EXECUTE FUNCTION public.practice_set_updated_at();

NOTIFY pgrst, 'reload schema';
