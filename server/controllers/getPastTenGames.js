import supabase from "../supabaseClient.js";

export const getpastTenGames = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { data: pastTenGames, error } = await supabase
      .from('games')
      .select('*')
      .eq('player_id', userId)
      .order('time', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    res.status(200).json({ pastTenGames });
  } catch (error) {
    console.error("Error getting past ten games:", error);
    res.status(500).json({ message: "Error getting past ten games" });
  }
};
