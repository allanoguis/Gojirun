-- Create optimized leaderboard view
-- This view joins games and users tables to provide pre-calculated leaderboard data
-- Improves performance by doing aggregations at database level

CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    g.user_id as player_id,
    u.email,
    u.fullname as player_name,
    u.profile_image_url,
    MAX(g.score) as score,
    MIN(g.time) as best_time,
    COUNT(*) as games_played
FROM games g
JOIN users u ON g.user_id = u.user_id
GROUP BY g.user_id, u.email, u.fullname, u.profile_image_url
ORDER BY score DESC, best_time ASC;

-- Add comment for documentation
COMMENT ON VIEW leaderboard_view IS 'Optimized leaderboard view with pre-calculated best scores and player statistics';
