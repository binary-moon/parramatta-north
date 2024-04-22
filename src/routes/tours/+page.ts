import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/tour/`);
  const data = await response.json();

  const tours = data.map(tour => {
    return {
      raw: tour,
      id: tour.id,
      title: tour.title.rendered,
      subtitle: tour.acf.excerpt,
      image: tour.acf.image,
      href: `/tours/${tour.id}`,
      tags: tour.tags.map(tag => tag.name),
    }
  });

  const filterOptions = data.reduce((acc, tour) => {
    tour.tags.forEach(tag => {
      if (!acc.includes(tag.name)) {
        acc.push(tag.name);
      }
    });
    return acc;
  }, ['All']);

  return {
    tours,
    filterOptions,
  }
}) satisfies PageLoad