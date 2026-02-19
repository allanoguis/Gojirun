import supabase from "../supabaseClient.js";

export const saveGame = async (req, res) => {
  const { player, playerName, time, score, ipAddress, deviceType, userAgent } = req.body;

  try {
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          player_id: player,
          player_name: playerName,
          time: time, // ensuring this is a valid timestamp string or Date object
          score: score,
          ip_address: ipAddress,
          device_type: deviceType,
          user_agent: userAgent,
          created_at: new Date()
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Game saved successfully", id: data[0].id });
  } catch (error) {
    console.error("Error saving game:", error);
    res.status(500).json({ message: "Error saving game" });
  }
};
