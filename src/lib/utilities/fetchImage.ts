export const fetchImage =  async (id: number, imageSize: string) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/media/${id}`);
    const data = await response.json();
    console.log(data, imageSize)
    return data.media_details?.sizes?.[imageSize].source_url;
  } catch (error) {
    console.error("Failed to fetch image:", error)
    return null;
  }
}