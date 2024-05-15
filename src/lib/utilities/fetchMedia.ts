const apiUrl = import.meta.env.VITE_API_URL;

export const fetchImage =  async (id: number, imageSize: string) => {
  try {
    const response = await fetch(`${apiUrl}/media/${id}`);
    const data = await response.json();
    return data.media_details?.sizes?.[imageSize].source_url;
  } catch (error) {
    console.error("Failed to fetch image:", error)
    return null;
  }
}

export const fetchVideo = async (id: number) => {
  try {
    const response = await fetch(`${apiUrl}/media/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch video:", error)
    return null;
  }
}

export const fetchAudio = async (id: number) => {
  try {
    const response = await fetch(`${apiUrl}/media/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch audio:", error)
    return null;
  }
}
