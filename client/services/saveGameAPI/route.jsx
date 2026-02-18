import axios from "axios";

export const saveGame = async (data) => {
  try {
    const backendURL = process.env.NEXT_PUBLIC_API_KEY;
    return await axios.post(`${backendURL}/api/savegame`, data);
  } catch (error) {
    console.log("Error while calling saveGame API", error);
  }
};
