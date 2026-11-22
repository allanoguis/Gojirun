DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'leaderboard_broadcast_on_refresh',
        'refresh_top_leaderboard_mat',
        'games_broadcast_trigger',
        'fetch_top_leaderboard',
        'refresh_leaderboard_entry',
        'games_leaderboard_trigger',
        'refresh_leaderboard_entry_for_user',
        'leaderboard_broadcast_trigger',
        'games_changes',
        'update_updated_at_column',
        'get_player_stats',
        'get_leaderboard'
      ])
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', r.oid::regprocedure);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.oid::regprocedure);
  END LOOP;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_views
    WHERE schemaname = 'public'
      AND viewname = 'user_profile_view'
  ) THEN
    EXECUTE 'ALTER VIEW public.user_profile_view SET (security_invoker = true)';
  END IF;
END $$;

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leaderboard is publicly readable" ON public.leaderboard;
CREATE POLICY "Leaderboard is publicly readable"
ON public.leaderboard
FOR SELECT
TO anon, authenticated
USING (true);

ALTER TABLE public.matview_refresh_log ENABLE ROW LEVEL SECURITY;

DROP INDEX IF EXISTS public.achievements_user_id_idx1;
DROP INDEX IF EXISTS public.achievements_user_id_idx;
DROP INDEX IF EXISTS public.games_time_idx1;
DROP INDEX IF EXISTS public.games_player_id_idx1;
DROP INDEX IF EXISTS public.idx_games_player;
DROP INDEX IF EXISTS public.idx_games_player_id;
