-- Phase 6: Skill Gap Analysis

CREATE TABLE IF NOT EXISTS public.role_skill_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert common software roles
INSERT INTO public.role_skill_templates (role_name, required_skills)
VALUES 
  ('Frontend Developer', '["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git", "Responsive Design", "Web Performance", "State Management (Redux/Context)", "REST APIs"]'::jsonb),
  ('Backend Developer', '["Node.js", "Express.js", "Python", "Java", "SQL", "NoSQL", "REST APIs", "GraphQL", "Docker", "Git", "Microservices", "System Design"]'::jsonb),
  ('Full Stack Developer', '["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "SQL", "NoSQL", "Git", "Docker", "REST APIs", "AWS/Cloud", "TypeScript"]'::jsonb),
  ('Python Developer', '["Python", "Django", "FastAPI", "Flask", "SQL", "Git", "REST APIs", "Docker", "AWS/Cloud", "Testing (PyTest)"]'::jsonb),
  ('Java Developer', '["Java", "Spring Boot", "SQL", "Git", "REST APIs", "Microservices", "Docker", "AWS/Cloud", "Hibernate/JPA", "Testing (JUnit)"]'::jsonb),
  ('Software Engineer', '["Data Structures", "Algorithms", "Object-Oriented Programming", "System Design", "Git", "SQL", "REST APIs", "Testing", "Cloud Computing"]'::jsonb),
  ('Data Scientist', '["Python", "SQL", "Machine Learning", "Data Analysis", "Pandas", "Scikit-Learn", "Statistics", "Data Visualization", "Jupyter", "TensorFlow/PyTorch"]'::jsonb),
  ('Data Analyst', '["SQL", "Excel", "Tableau/Power BI", "Python", "Data Visualization", "Statistics", "Data Cleaning"]'::jsonb),
  ('Machine Learning Engineer', '["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "SQL", "Docker", "AWS/GCP/Azure", "MLOps", "Data Structures"]'::jsonb),
  ('Cloud Engineer', '["AWS", "Azure", "GCP", "Linux", "Networking", "Docker", "Kubernetes", "Terraform", "CI/CD", "Security"]'::jsonb),
  ('DevOps Engineer', '["Linux", "Docker", "Kubernetes", "CI/CD", "Jenkins/GitLab CI", "Terraform", "AWS/Cloud", "Scripting (Bash/Python)", "Monitoring (Prometheus/Grafana)"]'::jsonb),
  ('Android Developer', '["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Coroutines", "Room", "Retrofit", "Git", "MVVM/MVI"]'::jsonb),
  ('Cyber Security Engineer', '["Network Security", "Cryptography", "Linux", "Penetration Testing", "Vulnerability Assessment", "Firewalls", "Python/Bash Scripting", "Incident Response"]'::jsonb)
ON CONFLICT (role_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.skill_gap_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_analysis_id UUID NOT NULL REFERENCES public.resume_analysis(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_order JSONB NOT NULL DEFAULT '[]'::jsonb,
  skill_match_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  next_learning_step TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  analysis_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS skill_gap_user_created_idx
  ON public.skill_gap_analysis (user_id, created_at DESC);

-- Trigger for role_skill_templates
DROP TRIGGER IF EXISTS role_skill_templates_set_updated_at ON public.role_skill_templates;
CREATE TRIGGER role_skill_templates_set_updated_at
  BEFORE UPDATE ON public.role_skill_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger for skill_gap_analysis
DROP TRIGGER IF EXISTS skill_gap_set_updated_at ON public.skill_gap_analysis;
CREATE TRIGGER skill_gap_set_updated_at
  BEFORE UPDATE ON public.skill_gap_analysis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS Policies
ALTER TABLE public.role_skill_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view role templates" ON public.role_skill_templates;
CREATE POLICY "Public can view role templates"
  ON public.role_skill_templates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own skill gap analysis" ON public.skill_gap_analysis;
CREATE POLICY "Users can view their own skill gap analysis"
  ON public.skill_gap_analysis FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

NOTIFY pgrst, 'reload schema';
