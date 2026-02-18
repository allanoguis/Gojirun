import axios from "axios";

export const getPastTen = async (data) => {
    try {
        const backendURL = process.env.NEXT_PUBLIC_API_KEY;

        return await axios.get(`${backendURL}/api/getpastten`,data);
    } catch (error) {
        console.log("Error while calling getPastTen API", error);
    }
}
