import axios from "axios";

export const fetchHighScore = async (data) => {
  try {
    const backendURL = process.env.NEXT_PUBLIC_API_KEY;

    const response = await axios.get(`${backendURL}/api/highscore`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling highscore API", error);
    throw error;
  }
};
