import supabase from "../supabaseClient.js";

export const getLeaderBoard = async (req, res) => {
  try {
    // Current simple implementation: fetch top 100 scores and unique by player in JS
    // Optimization: Create a Postgres View for this!
    const { data: games, error } = await supabase
      .from('games')
      .select(`
        player_id,
        player_name,
        score,
        time,
        users (
          profile_image_url,
          email
        )
      `)
      .order('score', { ascending: false })
      .limit(100);

    if (error) throw error;

    const playerScores = new Map();
    games.forEach((game) => {
      const playerId = game.player_id;
      if (!playerScores.has(playerId)) {
        playerScores.set(playerId, {
          playerId: playerId,
          playerName: game.player_name,
          score: game.score,
          time: game.time,
          profileImageUrl: game.users?.profile_image_url,
          email: game.users?.email
        });
      }
    });

    // Get top 10 from unique players
    const leaderboard = Array.from(playerScores.values()).slice(0, 10);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error in getLeaderBoard controller:", error);
    res.status(500).json({ message: "Error in getLeaderBoard controller" });
  }
};
