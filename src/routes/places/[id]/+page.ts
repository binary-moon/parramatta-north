import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/place/${params.id}`);
  const data = await response.json();

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: null,
    mapImage: null,
    location: {
      lat: data.acf.latitude,
      lng: data.acf.longitude,
    },
    tags: data.tags.map(tag => tag.name),
    htmlContent: data.acf.description,
  }

  return { 
      pageData,
      isFooterHidden: true,
      isWhiteLogo: true,
  };
}) satisfies PageLoad;