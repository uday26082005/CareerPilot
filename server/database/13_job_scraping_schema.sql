-- 13_job_scraping_schema.sql

CREATE TABLE IF NOT EXISTS public.scraped_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast role lookups in insights service
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_role_name ON public.scraped_jobs(role_name);

-- Enable RLS
ALTER TABLE public.scraped_jobs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
DO $$ BEGIN
    CREATE POLICY "Users can read scraped jobs" 
        ON public.scraped_jobs FOR SELECT 
        USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Allow service role to insert/update jobs (cron job will run with service role)
DO $$ BEGIN
    CREATE POLICY "Service role can manage scraped jobs" 
        ON public.scraped_jobs FOR ALL 
        USING (true)
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Force Supabase cache reload
NOTIFY pgrst, 'reload schema';
