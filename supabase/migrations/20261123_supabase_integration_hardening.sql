ALTER TABLE public.matview_refresh_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "matview_refresh_log_no_public_access" ON public.matview_refresh_log;
CREATE POLICY "matview_refresh_log_no_public_access"
ON public.matview_refresh_log
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

REVOKE ALL ON TABLE public.matview_refresh_log FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.top_leaderboard_mat FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO public
USING (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO public
USING (((select auth.uid())::text = user_id))
WITH CHECK (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO public
WITH CHECK (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "Users can insert games" ON public.games;
DROP POLICY IF EXISTS "Users can insert own games" ON public.games;
DROP POLICY IF EXISTS "Guests can insert games" ON public.games;
CREATE POLICY "Users and guests can insert games"
ON public.games
FOR INSERT
TO public
WITH CHECK (
  user_id = '000000'
  OR ((select auth.uid())::text = user_id)
);

DROP POLICY IF EXISTS "Users can update own games" ON public.games;
CREATE POLICY "Users can update own games"
ON public.games
FOR UPDATE
TO public
USING (((select auth.uid())::text = user_id))
WITH CHECK (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
CREATE POLICY "Users can view own achievements"
ON public.achievements
FOR SELECT
TO public
USING (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.achievements;
CREATE POLICY "Users can insert own achievements"
ON public.achievements
FOR INSERT
TO public
WITH CHECK (((select auth.uid())::text = user_id));
