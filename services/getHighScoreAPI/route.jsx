export const fetchHighScore = async (data) => {
  try {
    const params = new URLSearchParams(data).toString();
    const response = await fetch(`/api/highscore?${params}`);
    if (!response.ok) throw new Error('Failed to fetch high score');
    return await response.json();
  } catch (error) {
    console.log("Error while calling highscore API", error);
    throw error;
  }
};
