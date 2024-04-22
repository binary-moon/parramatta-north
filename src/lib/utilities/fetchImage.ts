export const fetchImage =  async (id: number) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/media/${id}`);
    const data = await response.json();
    console.log(data)
    return data.guid?.rendered;
  } catch (error) {
    console.error("Failed to fetch image:", error)
    return null;
  }
}