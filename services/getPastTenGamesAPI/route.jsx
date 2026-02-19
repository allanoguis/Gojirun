export const getPastTen = async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`/api/getpastten?${params}`);
        if (!response.ok) throw new Error('Failed to fetch past ten games');
        return await response.json();
    } catch (error) {
        console.log("Error while calling getPastTen API", error);
    }
};
