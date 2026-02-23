-- Create a view for profile data that bypasses RLS policies
-- This view joins users with their games and aggregates data

CREATE OR REPLACE VIEW public.user_profile_view AS
SELECT 
    u.user_id,
    u.email,
    u.fullname,
    u.profile_image_url,
    u.created_at,
    u.last_sign_in_at,
    COALESCE(
        (SELECT MAX(g.score) 
         FROM public.games g 
         WHERE g.user_id = u.user_id), 
        0
    ) as high_score,
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', g.id,
                'score', g.score,
                'time', g.time,
                'device_type', g.device_type,
                'created_at', g.created_at
            ) ORDER BY g.created_at DESC LIMIT 10
        )
        FROM public.games g 
        WHERE g.user_id = u.user_id
    ) as past_games
FROM public.users u;

-- Grant access to the view
GRANT SELECT ON public.user_profile_view TO authenticated;
GRANT SELECT ON public.user_profile_view TO anon;
