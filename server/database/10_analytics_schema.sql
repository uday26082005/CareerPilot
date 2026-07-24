-- Phase 12: Analytics & Insights Schema

CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_score INTEGER DEFAULT 0,
    ats_score INTEGER DEFAULT 0,
    skill_match INTEGER DEFAULT 0,
    roadmap_completion INTEGER DEFAULT 0,
    interview_average INTEGER DEFAULT 0,
    practice_accuracy INTEGER DEFAULT 0,
    consistency_score INTEGER DEFAULT 0,
    overall_progress INTEGER DEFAULT 0,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, snapshot_date)
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_user_id ON public.analytics_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON public.analytics_snapshots(snapshot_date);

-- Row Level Security
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own analytics snapshots"
    ON public.analytics_snapshots FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics snapshots"
    ON public.analytics_snapshots FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics snapshots"
    ON public.analytics_snapshots FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics snapshots"
    ON public.analytics_snapshots FOR DELETE
    USING (auth.uid() = user_id);
