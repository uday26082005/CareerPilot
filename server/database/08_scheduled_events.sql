-- Scheduled Events Table
CREATE TABLE IF NOT EXISTS public.user_scheduled_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries on user's upcoming events
CREATE INDEX IF NOT EXISTS idx_user_scheduled_events_user_id_date 
  ON public.user_scheduled_events(user_id, scheduled_at);

-- Row Level Security
ALTER TABLE public.user_scheduled_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own scheduled events"
  ON public.user_scheduled_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled events"
  ON public.user_scheduled_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled events"
  ON public.user_scheduled_events FOR DELETE
  USING (auth.uid() = user_id);
