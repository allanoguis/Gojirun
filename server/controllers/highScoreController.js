import supabase from "../supabaseClient.js";

export const getHighscoreForPlayer = async (req, res) => {
  const { playerId } = req.query;

  if (!playerId) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('player_id', playerId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" for .single()
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: "No games found for the specified player" });
    }

    const topGame = {
      id: data.id,
      ...data,
      player: data.player_id, // mapping back for frontend compatibility if needed
      playerName: data.player_name,
      time: data.time,
      score: data.score
    };

    res.status(200).json({ topGame });
  } catch (error) {
    console.error("Error retrieving high score:", error);
    res.status(500).json({ message: "Error retrieving high score for player" });
  }
};
