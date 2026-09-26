-- 14_analytics_dashboard_schema.sql
-- DROP old version first
DROP FUNCTION IF EXISTS get_user_analytics_dashboard(UUID);

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
      ROUND(AVG(overall_score)::numeric, 1) as avg_interview_score,
      COUNT(id) as interviews_taken
    FROM public.interviews
    WHERE user_id = uid AND status = 'Completed' AND completed_at IS NOT NULL
    GROUP BY completed_at::date
  ),
  daily_practice AS (
    SELECT 
      completed_at::date as d,
      ROUND(AVG(accuracy)::numeric, 1) as avg_practice_accuracy,
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
  -- Assign a group number that increments only when a non-null value appears
  -- This lets us forward-fill the last known value across null days
  base AS (
    SELECT 
      TO_CHAR(ds.d, 'Mon DD') as date_label,
      ds.d,
      i.avg_interview_score,
      p.avg_practice_accuracy,
      COALESCE(r.tasks_completed, 0) as tasks_completed,
      -- group counters: increment only when we see a real value
      COUNT(i.avg_interview_score) OVER (ORDER BY ds.d) as i_grp,
      COUNT(p.avg_practice_accuracy) OVER (ORDER BY ds.d) as p_grp
    FROM date_series ds
    LEFT JOIN daily_interviews i ON ds.d = i.d
    LEFT JOIN daily_practice p ON ds.d = p.d
    LEFT JOIN daily_roadmap r ON ds.d = r.d
  ),
  -- Forward-fill: within each group, the MAX of the single real value propagates
  filled AS (
    SELECT
      date_label,
      d,
      COALESCE(MAX(avg_interview_score) OVER (PARTITION BY i_grp), 0) as interview_filled,
      COALESCE(MAX(avg_practice_accuracy) OVER (PARTITION BY p_grp), 0) as practice_filled,
      tasks_completed
    FROM base
  ),
  -- Final trends with proper moving averages and cumulative sums
  final_trends AS (
    SELECT
      date_label,
      d,
      interview_filled as avg_interview_score,
      practice_filled as avg_practice_accuracy,
      tasks_completed,

      -- Window Function 1: 7-day Moving Average of Interview Score (skip zero-only windows)
      CASE 
        WHEN MAX(interview_filled) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) > 0
        THEN ROUND(
          AVG(CASE WHEN interview_filled > 0 THEN interview_filled END) OVER (
            ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
          )::numeric, 1)
        ELSE NULL
      END as moving_avg_interview,

      -- Window Function 2: 7-day Moving Average of Practice Accuracy (skip zero-only windows)
      CASE 
        WHEN MAX(practice_filled) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) > 0
        THEN ROUND(
          AVG(CASE WHEN practice_filled > 0 THEN practice_filled END) OVER (
            ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
          )::numeric, 1)
        ELSE NULL
      END as moving_avg_practice,

      -- Window Function 3: Cumulative Sum of Mastered Skills/Tasks
      SUM(tasks_completed) OVER (
        ORDER BY d ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) as cumulative_tasks
    FROM filled
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
    'trends', (SELECT jsonb_agg(t) FROM final_trends t),
    'stats', (SELECT row_to_json(s) FROM overall_stats s)
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
