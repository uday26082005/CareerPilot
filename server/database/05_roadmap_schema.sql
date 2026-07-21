-- Phase 7: AI Career Roadmap Schema

CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_analysis_id UUID REFERENCES public.resume_analysis(id) ON DELETE SET NULL,
  skill_gap_analysis_id UUID REFERENCES public.skill_gap_analysis(id) ON DELETE SET NULL,
  current_position TEXT NOT NULL,
  target_role TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  estimated_duration TEXT NOT NULL,
  current_phase INTEGER DEFAULT 1,
  completion_percentage NUMERIC(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  summary TEXT NOT NULL,
  roadmap_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT NOT NULL,
  estimated_hours INTEGER NOT NULL,
  resource_title TEXT,
  resource_url TEXT,
  resource_type TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  order_index INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Policies for Row Level Security (RLS)
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roadmaps" ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own roadmap tasks" ON public.roadmap_tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.roadmaps
    WHERE roadmaps.id = roadmap_tasks.roadmap_id AND roadmaps.user_id = auth.uid()
  )
);

-- Note: Updates to roadmaps and tasks are performed by the backend service-role, so we only need SELECT for clients (if any).

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_roadmaps_modtime
BEFORE UPDATE ON public.roadmaps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_tasks_modtime
BEFORE UPDATE ON public.roadmap_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
