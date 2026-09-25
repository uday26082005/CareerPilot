-- 14_analytics_dashboard_schema.sql

CREATE OR REPLACE FUNCTION get_user_analytics_dashboard(uid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '14 days',
      CURRENT_DATE,
      '1 day'::interval
    )::date AS d
  ),
  daily_interviews AS (
    SELECT 
      completed_at::date as d,
      AVG(overall_score) as avg_interview_score,
      COUNT(id) as interviews_taken
    FROM public.interviews
    WHERE user_id = uid AND status = 'Completed' AND completed_at IS NOT NULL
    GROUP BY completed_at::date
  ),
  daily_practice AS (
    SELECT 
      completed_at::date as d,
      AVG(accuracy) as avg_practice_accuracy,
      COUNT(id) as practice_sessions
    FROM public.practice_sessions
    WHERE user_id = uid AND status = 'Completed' AND completed_at IS NOT NULL
    GROUP BY completed_at::date
  ),
  daily_roadmap AS (
    SELECT 
      rt.completed_at::date as d,
      COUNT(rt.id) as tasks_completed
    FROM public.roadmap_tasks rt
    JOIN public.roadmaps r ON rt.roadmap_id = r.id
    WHERE r.user_id = uid AND rt.status = 'Completed' AND rt.completed_at IS NOT NULL
    GROUP BY rt.completed_at::date
  ),
  trend_data AS (
    SELECT 
      TO_CHAR(ds.d, 'Mon DD') as date_label,
      ds.d,
      COALESCE(ROUND(i.avg_interview_score::numeric, 1), 0) as avg_interview_score,
      COALESCE(ROUND(p.avg_practice_accuracy::numeric, 1), 0) as avg_practice_accuracy,
      COALESCE(r.tasks_completed, 0) as tasks_completed,
      
      -- Window Function 1: 7-day Moving Average of Interview Score
      ROUND(AVG(COALESCE(i.avg_interview_score, 0)) OVER(
        ORDER BY ds.d 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
      )::numeric, 1) as moving_avg_interview,
      
      -- Window Function 2: Cumulative Sum of Mastered Skills/Tasks
      SUM(COALESCE(r.tasks_completed, 0)) OVER(
        ORDER BY ds.d 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) as cumulative_tasks

    FROM date_series ds
    LEFT JOIN daily_interviews i ON ds.d = i.d
    LEFT JOIN daily_practice p ON ds.d = p.d
    LEFT JOIN daily_roadmap r ON ds.d = r.d
    ORDER BY ds.d
  ),
  overall_stats AS (
    SELECT
      (SELECT COUNT(*) FROM public.interviews WHERE user_id = uid AND status = 'Completed') as total_interviews,
      (SELECT COUNT(*) FROM public.practice_sessions WHERE user_id = uid AND status = 'Completed') as total_practice,
      (SELECT COUNT(*) FROM public.roadmap_tasks rt JOIN public.roadmaps r ON rt.roadmap_id = r.id WHERE r.user_id = uid AND rt.status = 'Completed') as total_tasks,
      (SELECT COALESCE(ROUND(AVG(overall_score)::numeric, 1), 0) FROM public.interviews WHERE user_id = uid AND status = 'Completed') as lifetime_avg_interview,
      (SELECT COALESCE(ROUND(AVG(accuracy)::numeric, 1), 0) FROM public.practice_sessions WHERE user_id = uid AND status = 'Completed') as lifetime_avg_practice
  )
  SELECT jsonb_build_object(
    'trends', (SELECT jsonb_agg(t) FROM trend_data t),
    'stats', (SELECT row_to_json(s) FROM overall_stats s)
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
