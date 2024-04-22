import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/event/`);
  const data = await response.json()

  const events = data.map(event => {
    return {
      raw: event,
      title: event.title.rendered,
      subtitle: event.acf.excerpt,
      image: event.acf.image,
      href: `/whats-on/${event.id}`,
      tags: event.tags.map(tag => tag.name),
    }
  })

  return {
    events
  };
}) satisfies PageLoad;