-- 12_career_insights_schema.sql

-- Create the career_insights table
CREATE TABLE IF NOT EXISTS public.career_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Best Career Match
    best_match_role TEXT NOT NULL,
    match_score INTEGER NOT NULL,
    match_reason TEXT NOT NULL,
    other_matches JSONB DEFAULT '[]'::jsonb, 
    
    -- Salary Insights
    salary_entry TEXT NOT NULL,
    salary_mid TEXT NOT NULL,
    salary_senior TEXT NOT NULL,
    
    -- Top Companies
    top_companies JSONB DEFAULT '[]'::jsonb, 
    
    -- Key Takeaways
    key_takeaways JSONB DEFAULT '[]'::jsonb, 
    
    -- AI Career Advisor
    ai_advice TEXT NOT NULL,
    ai_focus_area TEXT NOT NULL,
    ai_potential_improvement TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.career_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    CREATE POLICY "Users can view their own career insights" 
        ON public.career_insights FOR SELECT 
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own career insights" 
        ON public.career_insights FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own career insights" 
        ON public.career_insights FOR UPDATE 
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_career_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_career_insights_updated_at ON public.career_insights;
CREATE TRIGGER update_career_insights_updated_at
    BEFORE UPDATE ON public.career_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_career_insights_updated_at();

-- Force Supabase cache reload
NOTIFY pgrst, 'reload schema';
