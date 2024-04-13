import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/place/`);
  const data = await response.json()

  const places = data.map(place => {
    return {
      raw: place,
      title: place.title.rendered,
      description: place.acf.excerpt,
      image: undefined,
      href: `/places/${place.id}`,
      tags: place.tags.map(tag => tag.name),
      location: {
        latitude: place.acf.latitude,
        longitude: place.acf.longitude,
      }
    }
  })

  const filterOptions = data.reduce((acc, place) => {
    place.tags.forEach(tag => {
      if (!acc.includes(tag.name)) {
        acc.push(tag.name);
      }
    });
    return acc;
  }, ['All']);

  return {
    places,
    filterOptions,
  }
}) satisfies PageLoad;