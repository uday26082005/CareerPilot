-- Phase 8: Mock Interviews Schema

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL,
  target_role TEXT NOT NULL,
  company_name TEXT,
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Progress',
  current_question INTEGER NOT NULL DEFAULT 1,
  total_questions INTEGER NOT NULL DEFAULT 5,
  overall_score INTEGER,
  communication_score INTEGER,
  technical_score INTEGER,
  confidence_score INTEGER,
  feedback_summary TEXT,
  recommended_practice JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  user_answer TEXT,
  ai_feedback TEXT,
  score INTEGER,
  strengths JSONB,
  improvements JSONB,
  ideal_answer TEXT,
  next_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.interview_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_interviews INTEGER NOT NULL DEFAULT 0,
  average_score INTEGER NOT NULL DEFAULT 0,
  technical_average INTEGER NOT NULL DEFAULT 0,
  behavioral_average INTEGER NOT NULL DEFAULT 0,
  role_average INTEGER NOT NULL DEFAULT 0,
  company_average INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  lowest_score INTEGER NOT NULL DEFAULT 0,
  last_interview TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_statistics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own interviews" ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own interview questions" ON public.interview_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE id = interview_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view their own statistics" ON public.interview_statistics FOR SELECT USING (auth.uid() = user_id);

-- Service Role Policies (Backend can do anything)
CREATE POLICY "Service Role Full Access Interviews" ON public.interviews USING (true);
CREATE POLICY "Service Role Full Access Questions" ON public.interview_questions USING (true);
CREATE POLICY "Service Role Full Access Statistics" ON public.interview_statistics USING (true);
