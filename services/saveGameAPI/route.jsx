export const saveGame = async (data) => {
  try {
    const response = await fetch('/api/savegame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log("Error while calling saveGame API", error);
  }
};
