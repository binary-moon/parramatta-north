import type { PageLoad } from './$types';
import { fetchImage } from '$lib/utilities/fetchMedia';

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/place/${params.id}`);
  const data = await response.json();
  const mapImage = await fetchImage(data.acf.image, 'thumbnail');

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: data.acf.image,
    video: data.acf.video,
    audio: data.acf.vo_file,
    mapImage: mapImage,
    location: {
      lat: data.acf.latitude,
      lng: data.acf.longitude,
    },
    tags: data.tags.map(tag => tag.name),
    htmlContent: data.description,
  }

  return { 
      pageData,
      isFooterHidden: true,
      isWhiteLogo: true,
  };
}) satisfies PageLoad;