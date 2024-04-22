import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/tour/${params.id}`);
  const data = await response.json();

  const pageData = {
    raw: data,
    title: data.title.rendered,
    subtitle: data.acf.excerpt,
    tags: data.tags.map(tag => tag.name),
    content: data.content.rendered,
    places: data.acf.places_included,
    image: data.acf.image,
  }

  return { 
      pageData,
      isFooterHidden: true,
      isWhiteLogo: true,
  };
}) satisfies PageLoad;